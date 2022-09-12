const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("./db");

//init app and middleware
const app = express();
app.use(express.json());

const PORT = 3000;

//db connection
let db;

connectToDB((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
    db = getDB();
  }
});

//Routes - get request handlers
app.get("/", (req, res) => {
  res.send("<h1>For more go to location: /books</h1>");
});

//we are firing callback function when that request comes into this URL. We have a request and response object inside that handler which we automatically get. We are sending response back to whoever is making that request. We use response object right here and use a method on that called json to send back a json response. We are sending simple message property on an object
app.get("/books", (req, res) => {
  const page = req.query.page || 0;
  const booksPerPage = 5;

  let books = [];
  //this is equvalent of db.books in mongosh (choosing collection within specific database)
  db.collection("books") //referencing to the collection 'books'
    .find() //cursor toArray forEach - mongo is fetching data in smaller batches
    .sort({ author: 1 }) //sort automatically by the author ascending;
    .skip(page * booksPerPage) //let us to skip certain amount of books (pagination)
    .limit(booksPerPage) //how many books we have displayed per page
    .forEach((book) => books.push(book)) //using cursor method one of them is forEach. Cycles through each book in batches
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Yo. Could not fetch documents" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "Could not fetch the document. Sorry mate." });
      });
  } else {
    res.status(500).json({ error: "Not valid document ID mate." });
  }
});

//POST REQUEST
app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document mate" });
    });
});

//As Async function. Code from someone on YT:
// exports.postBook = async (req, res) => {
//   const newBook = req.body;
//   let db = getDb();
//   try {
//     const result = await db.collection('books').insertOne(newBook);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ msg: 'Could not post new object.' });
//   }
// };

//PATCH REQUEST
app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "Could not update the document. Sorry mate." });
      });
  } else {
    res.status(500).json({ error: "Not valid document ID mate." });
  }
});

//DELETE REQUEST
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "Could not delete the document. Sorry mate." });
      });
  } else {
    res.status(500).json({ error: "Not valid document ID mate." });
  }
});

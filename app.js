const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("./db");

//init app and middleware
const app = express();
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
  let books = [];
  //this is equvalent of db.books in mongosh (choosing collection within specific database)
  db.collection("books") //referencing to the collection 'books'
    .find() //cursor toArray forEach - mongo is fetching data in smaller batches
    .sort({ author: 1 }) //sort automatically by the author ascending;
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

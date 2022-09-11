const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  //Establish connection to DB
  connectToDB: (cb) => {
    MongoClient.connect("mongodb://127.0.0.1:27017/bookstore")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  //Return that connection to DB
  getDB: () => {
    return dbConnection;
  },
};

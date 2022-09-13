const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoUSER = process.env.mongoUSER;
const mongoPASSWORD = process.env.mongoPASSWORD;


let dbConnection;
let uri = `mongodb+srv://${mongoUSER}:${mongoPASSWORD}@mongodb-cluster0.99qmncj.mongodb.net/?retryWrites=true&w=majority`;
// let uri ="mongodb+srv://Out-A-Time:xxx@mongodb-cluster0.99qmncj.mongodb.net/?retryWrites=true&w=majority";

module.exports = {
  //Establish connection to DB
  connectToDB: (cb) => {
    // MongoClient.connect("mongodb://127.0.0.1:27017/bookstore")   LOCAL
    MongoClient.connect(uri)
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

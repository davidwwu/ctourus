const connectMongo_async = require('../controllers/dbController');
let mdb;
let ObjectId;
connectMongo_async().then((data) => {
  mdb = data.db;
  ObjectId = data.ObjectId;
});

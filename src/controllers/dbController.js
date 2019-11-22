const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const DATABASE_NAME = '';
const URL = `${process.env.MONGODB_URI}`;

module.exports = async () => {
  const client = new MongoClient(URL, { useNewUrlParser: true });
  let db = null;
  try {
    // Note this breaks.
    // await client.connect({useNewUrlParser: true})
    await client.connect();
    console.log('connected successfully to server');
    db = client.db();
  } catch (err) {
    console.log(err.stack);
  }

  return { db, ObjectId };
};

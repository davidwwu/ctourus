const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = '',
    URL = `${process.env.MONGODB_URI}`

module.exports = async function() {
    const client = new MongoClient(URL, {useNewUrlParser: true})
    var db = null
    try {
        // Note this breaks.
        // await client.connect({useNewUrlParser: true})
        await client.connect()
        console.log("connected successfully to server")
        db = client.db()
    } catch (err) {
        console.log(err.stack)
    }

    return db
}
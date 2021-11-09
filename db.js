const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.DB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true });

async function openConnect() {

    try {

        await client.connect();
        _db = client.db('Testing');
        return _db;

    } catch (e) {
        console.error(e);
    }

}

async function closeConnection() {

    await client.close();
    console.log("Connection was closed.");

}

module.exports = { openConnect, closeConnection }
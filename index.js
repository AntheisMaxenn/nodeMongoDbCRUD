const express = require('express')
const app = express()
const cors = require('cors');
const { openConnect, closeConnection } = require('./db');
const util = require('util')
require("dotenv").config()

// This example won't follow the standard Architecture pattern. For now...
// Route -> Controller -> Model ❌


const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Server is online!");
})

app.get('/open', function(req, res) {
    res.send('Trying to open connection')
    openConnect();
})

app.get('/close', async function(req, res) {
    res.send('Trying to open close')
    closeConnection();
})

// USER CRUD.

app.post("/user", async(req, res) => {
    try {

        user = { firstName: req.body.firstName, lastName: req.body.lastName }
        db = await openConnect();
        const results = await db.collection('users').insertOne(user);
        console.log(`The results: ${util.inspect(results.acknowledged)}.`);
        closeConnection();
        res.status(201).send('Complete')
    } catch (err) {
        console.log(`There was an error ${err}`)
        res.status(501).send(`There was an error.`)
    } finally {
        res.status(500)
    }
})

// READ

app.get("/user", async(req, res) => {
    // let results
    try {

        db = await openConnect();
        const results = await db.collection('users').findOne({ firstName: req.body.firstName });
        console.log(`The results: ${util.inspect(results)}.`);
        closeConnection();
        res.status(201).send(results);
    } catch (err) {
        console.log(`There was an error ${err}`)
        res.status(501).send(`There was an error.`)
    } finally {
        res.status(500);
    }
})


// UPDATE

app.put("/user", async(req, res) => {
    // let results
    try {

        db = await openConnect();
        const results = await db.collection('users').updateOne({ firstName: req.body.firstName }, { $set: { status: req.body.status } });
        console.log(`The results: ${util.inspect(results)}.`);
        closeConnection();
        res.status(201).send(results);
    } catch (err) {
        console.log(`There was an error ${err}`)
        res.status(501).send(`There was an error.`)
    } finally {
        res.status(500);
    }
})

// DELETE

app.delete("/user", async(req, res) => {

    try {

        db = await openConnect();
        const results = await db.collection('users').deleteOne({ firstName: req.body.firstName });
        console.log(`The results: ${util.inspect(results)}.`);
        closeConnection();
        res.status(201).send(results.deletedCount.toString());
    } catch (err) {
        console.log(`There was an error ${err}`)
        res.status(501).send(`There was an error.`)
    } finally {
        res.status(500);
    }
})


console.log(`The server is running on port ${PORT}!`)
app.listen(PORT)
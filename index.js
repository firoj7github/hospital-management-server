const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterhospital.66shuij.mongodb.net/?retryWrites=true&w=majority`;







app.get('/', (req, res) => {
  res.send('Backend Setup!')
})

app.listen(port, () => {
  console.log(`Runnung ${port}`)
})
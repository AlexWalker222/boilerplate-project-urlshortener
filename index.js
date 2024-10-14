require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const ShortURL = require('./models/urls.js');
app.use(cors({}));
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://alexw3071:7DaWETBCRfzvDB4R@cluster0.8vurzur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
app.get('/', (req, res) => {
  res.send('Hello World! - from codedamn')
})
app.get('/short', (req, res) => {
  res.send('Hello from short')
})
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', { myVariable: 'My name is Alex!' })
})
app.post('/short', async (req, res) => {
  const db = mongoose.connection.db;
  const record = new ShortURL({
    full: 'test'
  });
  await record.save();
  // insert the record in 'test' collection
  res.json({
    ok: 1
  })
})

// setup your mongodb connection here
mongoose.connect('mongodb+srv://alexw3071:7DaWETBCRfzvDB4R@cluster0.8vurzur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/short', async (req, res) => {
  // insert the record using the model
  const record = new ShortURL({
    full: 'test'
  })
  await record.save()
  res.json({
    ok: 1
  })
})

mongoose.connection.on('open', () => {
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
});
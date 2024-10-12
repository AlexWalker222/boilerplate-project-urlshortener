//@ts-nocheck

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");
app.use(cors({}));
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    strict: true,
    unifiedTopology: true,
    deprecationErrors: true
  }
});

function run() {
  try {
    // connect the client to the server
    // (optional starting in v4.7)
    async function run() {


      await client.connect();
      // Send a ping to confirm a successful connection
      client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    run().catch(console.dir);

  } finally {
    // Ensures that the client will close
    // when you finish / error
    client.close();
  }
}
run().catch(console.dir);

const db = client.db('urlshortener');
const urls = db.collection('urls');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
const urlCount = urls.countDocuments({})

// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  console.log(req.body);
  const url = req.body.url;
  const dnslookup = dns.lookup(url.parser.parse(url).hostname,
    function (address, err) {
      if (!address === err) {
        res.json({ error: "Invalid URL" });
      } else {
        const urlDoc = {
          url,
          short_url: urlCount
        }
        const result = urls.insertOne(urlDoc);
        console.log(result);
        res.json({ original_url: url, short_url: urlCount });
      }
    });
});

app.get("/api/shorturl/:short_url", async (req, res) => {

  const shorturl = req.params.short_url;
  const urlDoc = await urls.findOne({ short_url: +shorturl })
  res.redirect(urlDoc.url)
})

app.listen(port, function (req, res) {
  console.log(`Listening on port ${port}`);
});

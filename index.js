//@ts-nocheck
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApiL: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // connect the client to the server (optional starting in v4.7)
    await client.connect();
    // 
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
const db = client.db("urlshortener")
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
let urls;

// Your first API endpoint
app.post('/api/shorturl', function (req, res, dns) {
  console.log(req.body);
  const url = req.body.url;
  const dnslookup = dns.lookup(url.parser.parse(url).hostname,
    async (err, address) => {
      if (!address) {
        res.json({ error: "Invalid URL" });
      } else {
        const urlCount = await urls.countDocuments({})
        const urlDoc = {
          url,
          short_url: urlCount
        }
        const result = urls.insertOne(urlDoc);
        console.log(result);
        res.json({ original_url: url, short_url: urlCount })
      }
    });
});

app.get("/api/shorturl/:short_url", async (req, res) => {

  const shorturl = req.params.short_url;
  const urlDoc = await urls.findOne({ short_url: +shorturl })
  res.redirect(urlDoc.url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

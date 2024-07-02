require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns');
const url = require('url');
const localURLStorage = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  dns.lookup(url.parse(req.body.url).hostname, {}, function (err, address) {
    if (err) return console.log(err);

    if (String(address) === "null") {
      res.send({ "error": "invalid url" })
    } else {
      localURLStorage.push({
        "original_url": req.body.url,
        "short_url": localURLStorage.length
      })

      res.send({
        "original_url": req.body.url,
        "short_url": localURLStorage.length
      })
    }
  })
})

app.get('/api/shorturl/:shorturl', function (req, res) {
  let matchedURLObj = {};

  for (let i = 0; i < localURLStorage.length; i++) {
    if (Number.parseInt(localURLStorage[i].short_url) === Number.parseInt(req.params.shorturl - 1)) {
      matchedURLObj = localURLStorage[i];
    }
  }

  res.redirect(matchedURLObj.original_url);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

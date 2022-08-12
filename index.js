require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url-parse');

// Basic Configuration
const port = 3000;

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
urlSchema = new Schema({
  url: String,
});

const Url = new mongoose.model('Url', urlSchema);
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post(
  '/api/shorturl/',
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    const { url } = req.body;
    const hostname = new urlParser(url).hostname;

    dns.lookup(hostname, (err) => {
      if (err) res.json({ error: 'Invalid URL' });

      const newUrl = new Url({ url });
      newUrl.save();
      res.json({ original_url: newUrl.url, short_url: newUrl.id });
    });
  }
);

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  Url.findById(id, (err, data) => {
    if (err) res.json({ error: 'Invalid URL' });
    res.redirect(data.url);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

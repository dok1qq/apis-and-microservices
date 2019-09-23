'use strict';

const express = require('express');
const dns = require('dns');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Url = require('./scheme/url');
const extractHostname = require('../timestamp/helpers/extractHostname');

const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/urlshortener.html');
});

app.get('/api/shorturl/:id', (req, res) => {
    const { id } = req.params;

    Url.findOne({ short: id }, (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data) {
            return res.redirect(data.full);
        } else {
            res.json({error: "No short url found for given input"});
        }
    });
});

app.post('/api/shorturl/new', (req, res) => {
    const {url} = req.body;
    const hostname = extractHostname(url);

    const options = {
        family: 4,
        hints: dns.ADDRCONFIG | dns.V4MAPPED,
    };

    const protocol = /^https?:\/\/(.*)/i;
    if (!url.match(protocol)) {
        return res.json({"error": "invalid URL"});
    }

    dns.lookup(hostname, options,(err, address, family) => {
        if (err) {
            return res.json({"error":"invalid URL"});
        }

        Url.findOne({ full: url }, (err, data) => {
            if (err) {
                return res.json(err);
            }

            if (data) {
                return res.json({original_url: data.full, short_url: data.short});
            } else {
                const urlModel = new Url({
                    short: `${Math.floor(Math.random() * (1000) + 1)}`,
                    full: url,
                });

                const save = urlModel.save();
                return save
                    .then((data) => res.json({original_url: data.full, short_url: data.short}))
                    .catch((err) => res.json(err));
            }
        });
    });
});


app.listen(port, function () {
    console.log('Node.js listening ... ', port);
});

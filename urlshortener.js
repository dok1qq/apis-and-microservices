'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const Url = require('./scheme/url');

const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
    res.sendFile(process.cwd() + '/views/urlshortener.html');
});

app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});

app.get('/api/shorturl/:id', (req, res) => {
    res.send(req.params);
});

app.post('/api/shorturl/new', (req, res) => {
    res.json(req.body);
});


app.listen(port, function () {
    console.log('Node.js listening ... ', port);
});

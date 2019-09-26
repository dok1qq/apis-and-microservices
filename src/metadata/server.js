const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

const type = upload.single('upfile');
app.post('/api/fileanalyse', type, (req, res) => {
    const { size, originalname: name, mimetype: type } = req.file;
    res.json({ size, name, type });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Node.js listening ...');
});

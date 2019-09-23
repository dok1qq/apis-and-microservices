// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use('/public', express.static(process.cwd() + '/src/public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/timestamp/:date_string", (req, res) => {
  const { date_string : dateString } = req.params;

  if (!dateString) {
    res.json({ "unix": null, "utc" : "Invalid Date" });
    return;
  }

  const isValidDate = (d) => d instanceof Date && !isNaN(d);
  const date = new Date(dateString);

  if (isValidDate(date)) {
    res.json({ "unix": date.getTime(), "utc" : date.toUTCString() });
    return;
  }

  const dateWithTimestamp = new Date(Number(dateString));
  if (isValidDate(dateWithTimestamp)) {
    res.json({ "unix": dateWithTimestamp.getTime(), "utc" : dateWithTimestamp.toUTCString() });
    return;
  }

  res.json({ "unix": null, "utc" : "Invalid Date" });
});

app.get('/api/whoami', (req, res) => {
  console.log(req.params);

  const {
    headers: {
      'user-agent': software,
      'accept-language': language,
      'host': ipaddress,
    }
  } = req;

  res.json({
    ipaddress,
    language,
    software,
  });
});

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

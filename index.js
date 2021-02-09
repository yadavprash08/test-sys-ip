const express = require('express');
const app = express();

const port = 3000;
var localIpV4Address = require("local-ipv4-address");

var ips = '';

localIpV4Address().then((ipAddress) => {
  ips = `${ips};${ipAddress}`;
});

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

app.get('/', (req, res) => {
  res.send({
    request: req.url,
    ips: ips,
    networks: results
  });
});

app.listen(port, () => {
  console.log(`Example app is listening at http://localhost:${port}/`);
});
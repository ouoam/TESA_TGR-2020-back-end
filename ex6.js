var request = require('request');

request('https://ifconfig.co/json', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body);
});

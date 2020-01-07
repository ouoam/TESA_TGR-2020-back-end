var express = require("express");
var app = express();

app.use(express.json());

app.get("/", function(req, res) {
  res.send("ไม่ต้องห่วงเพื่อนผมแบกเอง");
});

app.listen(80, function() {
  console.log("Example app listening on port 80!");
});

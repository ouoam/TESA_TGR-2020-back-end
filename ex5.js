var MongoClient = require('mongodb').MongoClient;
var url = "";

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("video");
    var doc = { title: "Frozen II", year: 2019 };
    dbo.collection("movieDetails").insertOne(doc, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
    });
})

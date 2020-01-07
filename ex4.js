var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mongo.js:H7Jk9QjBwe24WvEhlS8fwTBIJZ8n0Z@19991999.xyz:27017/"

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("video");
    dbo.collection("movieDetails").findOne({}, function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
})

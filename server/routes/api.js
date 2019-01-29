var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/upload-file', function (req, res, next) {
  var fstream;
  if (req.busboy) {
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      fstream = fs.createWriteStream(__dirname + '/../../public/my-files/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        console.log('file ' + filename + ' uploaded');
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          var myobj = [
            { firstname: '', image_name: filename }
          ];
          dbo.collection("customers").insertMany(myobj, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
          });
        });
      });
    });
    req.busboy.on('finish', function () {
      console.log('finish, files uploaded ');
      res.json({ success: true });
    });
    req.pipe(req.busboy);
  }
});

router.get('/getData', function (request, response) {
  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", response)
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log("Nishant",result);
      response.json({ success: true ,results: result});
      db.close();
    });
});

}),

// console.log("Nishant",url)
//   MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("customers").find({}).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

  module.exports = router;

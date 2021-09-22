
const mongoose = require("mongoose");
const multer = require('multer');
fs = require('fs');
const conn = mongoose.connection;

var storage = multer.diskStorage({
    destination: __dirname + '/uploads/images'
  })
var upload = multer({ storage: storage })
const UploadImg = ((req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    var finalImg = {
         contentType: req.file.mimetype,
         image:  new Buffer(encode_image, 'base64')
      };
     conn.db.collection('Images').insertOne(finalImg, (err, result) => {
       if (err) return console.log(err)
       console.log('saved to database')
     })
});

const getImg = ((req,res)=>{
    var url = req.params.id;
    res.contentType('image/*');

})
module.exports = {UploadImg, upload}
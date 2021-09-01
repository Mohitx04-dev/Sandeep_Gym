let gfs;
const mongoose = require("mongoose");
const Grid = require('gridfs-stream')
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = new Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

const uploadImg = async (req,res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `http://localhost:3000/api/file/${req.file.filename}`;
    return res.send(imgUrl);
}

const getImg = async (req,res) =>{
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        console.log(readStream)
        readStream.pipe(res);
        console.log(gfs.files)
    } catch (error) {
        res.send("not found");
    }

}

const deleteImg = async (req,res)=> {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
}

module.exports = {
    uploadImg,getImg,deleteImg
}
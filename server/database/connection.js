const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
let gfs;
const connectDB = async () => {
    try{
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        con.connection.once("open", function () {
            gfs = Grid(con.connection.db);
            gfs.collection("photos");
        });        
        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB
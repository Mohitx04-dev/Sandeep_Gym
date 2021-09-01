const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Name : {
        type : String,
        required: true
    },
    Cust_Id : {
        type : String,
        required: true
    },
    Fees : {type : Number,required:true} , 
    StartDate : {type : Date,required:true},
    EndDate : {type : Date,required:true},
    Trainer : {type : String,required:true},
    Branch : {type : String,required:true}
})

const PT = mongoose.model("personal_training", schema);

module.exports = PT;
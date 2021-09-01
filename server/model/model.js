const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Name : {
        type : String,
        required: true
    },
    Payments : [
        {
            Customer_Name : String,
            Amount : Number,
            Date : Date,
            Cust_Id : String,
            PayMethod : String,
            RecievedBy : String
        }
    ]
    ,
    Total : {type : Number}
})

const Branches = mongoose.model("Branches", schema);

module.exports = Branches;
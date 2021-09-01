const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Branch : {
        type : String,
        required: true

    },
    Name : {
        type : String,
        required: true
    },
    Salary: {
        type: Number,
        required: true

    },
    DOJ : {
        type : Date,
        required: true
    }
    ,
    DOB : {
        type : Date,
        required: true

    },
    Aadhar_No : {type : Number,
    required: true},

})

const Employees = mongoose.model("employees", schema);
module.exports = Employees;
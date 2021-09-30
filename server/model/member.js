const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Cust_Id : {
        type: String,
        required: true,
        unique : true
    },
    Name : {
        type : String,
        required: true
    },
    Time : String ,
    CounselledBy : String,
    JoinedBy : String,
    Age:{
        type:Number,
        required: true
    },
    Height : {
        type : String,
        required: true
    },
    Weight : {
        type: Number,
        required: true
    },
    DOB : {
        type: Date,
        required: true
    },
    Gender : {
        type: String,
        required: true
    },
    DOJ : {
        type: Date,
        required: true
    },
    DOR : Date,
    Valid_Till : {
        type: Date,
        required: true
    },
    Payment : [
        {
            Total : Number,    
            Date : Date,
            Paid : Number,
            Due : Number,
            Comments :String,
            PayMethod : String,
            RecievedBy : String,
            DueDate : Date
        },
    ],
    Branch : {
        type : String,
        required: true
    },
    PRN  :{
        type: Number,
    },
    Address: {
        type: String,
        required: true
    },
    Contact_No : {
        type : Number,
        required: true
    },
    Aadhar : {
        type:Number,
        required: true
    },  
    Injury: {
        type: String,
        required: true
    },
    Occupation  : {
        type: String,
        required: true
    },
    Reference: {
        type: String,
        required: true
    },
    Service: {
        type: String,
        required: true
    },
    Workout_Choice: {
        type: String,
        required: true
    },
    Active: {
        type: Boolean
    },
    url : {
        type: String
    },
    TotalDue : {
        type: Number
    }
})

const Members = mongoose.model("customers", schema);

module.exports = Members;
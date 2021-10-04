var Members = require("../model/member");
var mongoose = require('mongoose');

// create and save new Member
exports.createMember = (req, res,next) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be emtpy!" });
    return;
  }
  // new Member
  const Pay = req.body.Payment[0];
  Pay["RecievedBy"] = req.user.username;
  var newId = new mongoose.mongo.ObjectId();
  console.log(newId)
  Pay["_id"] = newId
  req.txid = newId
  const Payment = [];
  Payment.push(Pay);
  console.log(req.body)
  const Member = new Members({
    Cust_Id: req.body.Cust_Id,
    Name: req.body.Name,
    Time: req.body.Time,
    CounselledBy: req.body.CounselledBy,
    JoinedBy: req.body.JoinedBy,
    Age: req.body.Age,
    Workout_Choice: req.body.Workout_Choice,
    Weight: req.body.Weight,
    DOB: req.body.DOB,
    Gender: req.body.Gender,
    Height: req.body.Height,
    DOJ: req.body.DOJ,
    DOR: req.body.DOR,
    Payment: Payment,
    PRN: req.body.PRN,
    Address: req.body.Address,
    Contact_No: req.body.Contact_No,
    Aadhar: req.body.Aadhar,
    Valid_Till: req.body.Valid_Till,
    Branch: req.body.Branch,
    Injury: req.body.Injury,
    Occupation: req.body.Occupation,
    Reference: req.body.Reference,
    Service: req.body.Service,
    url: req.body.url,
    TotalDue : Pay.Due
  });

  if (Member.Branch == req.get("branch") || req.user.role == "superadmin")
    // save Member in the database
    Member.save(Member)
      .then((data) => {
        //res.send(data)

        next()
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating a create operation",
        });
      });
  else {
    res.status(500).send({
      message: "Some error occurred while creating a create operation",
    });
  }
};

// retrieve and return all Members/ retrive and return a single Member
exports.findMember = (req, res) => {
  var Branch = req.get("branch");
  if (req.user.role == "superadmin" || req.user.permissions['AllBranches']) {
      Members.find()
        .then((Member) => {
          res.send(Member);
        })
        .catch((err) => {
          res
            .status(500)
            .send({
              message:
                err.message ||
                "Error Occurred while retriving Member information",
            });
        });
    }
  else if(req.user.branch == Branch){
        Members.find({Branch : Branch})
        .then((Member) => {
            res.send(Member);
          })
          .catch((err) => {
            res
              .status(500)
              .send({
                message:
                  err.message ||
                  "Error Occurred while retriving Member information",
              });
            })
  }
};

exports.updateValidityDown = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const date = req.body.date;
  if (date) {
    Members.updateMany({ Valid_Till: { $lt: date } }, { Active: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Member with id " });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Erro retrieving Member with id " });
      });
  } else {
    res
      .status(500)
      .send({
        message:
          err.message || "Error Occurred while retriving Member information",
      });
  }
};

exports.updateValidityUp = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const date = req.body.date;
  if (date) {
    Members.updateMany({ Valid_Till: { $gte: date } }, { Active: true })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Member with id " });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Erro retrieving Member with id " });
      });
  } else {
    res
      .status(500)
      .send({
        message:
          err.message || "Error Occurred while retriving Member information",
      });
  }
};

// Update a new idetified Member by Member id
exports.updateMember = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const id = req.params.id;
  var Branch;
  Members.findOne({ Cust_Id: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Not found Member with id " + id });
      } else {
        Branch = data.Branch;
      }
    })
    .then(() => {
      if (req.user.role == "superadmin" || Branch == req.user.branch || req.user.permissions['AllBranches']) {
        Members.findOneAndUpdate({ Cust_Id: id }, req.body)
          .then((data) => {
            if (!data) {
              res
                .status(404)
                .send({
                  message: `Cannot Update Member with ${id}. Maybe Member not found!`,
                });
            } else {
              res.send(data);
            }
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: "Error Update Member information" });
          });
      } else {
        res.status(500).send({ message: "Error Update Member information" });
      }
    })
    .catch(() => {
      res.status(500).send({ message: "Error Update Member information" });
    });
};

// Delete a Member with specified Member id in the request
exports.deleteMember = (req, res) => {
  const id = req.params.id;
  var Branch;
  Members.findOne({ Cust_Id: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Not found Member with id " + id });
      } else {
        Branch = data.Branch;
      }
    })
    .then(() => {
      if (req.user.role == "superadmin" || Branch == req.user.branch ||req.user.permissions['AllBranches']) {
        Members.findOneAndDelete({ Cust_Id: id })
          .then((data) => {
            if (!data) {
              res
                .status(404)
                .send({
                  message: `Cannot Delete with id ${id}. Maybe id is wrong`,
                });
            } else {
              res.send({
                message: "Member was deleted successfully!",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Could not delete Member with id=" + id,
            });
          });
      } else {
        res.status(500).send({
          message: "Could not delete Member with id=" + id,
        });
      }
    })
    .catch(() => {
      res.status(500).send({ message: "Error Update Member information" });
    });
};

exports.findMemberbyId = (req, res) => {
  const id = req.params.id;
  var Branch;
  if (id) {
    Members.findOne({ Cust_Id: id })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Member with id " + id });
        } else {
            if((data.Branch == req.user.branch)||(req.user.role=='superadmin')||(req.user.permissions['AllBranches'])) {
                res.send(data);
            }else {
                res.status(500).send({ message: "Not Allowed "});
            }
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Erro retrieving Member with id " + id });
      });
  } else {
    res
      .status(500)
      .send({
        message:
          err.message || "Error Occurred while retriving Member information",
      });
  }
};

exports.findTransaction = (req, res) => {
  const id = req.params.id;
  const txid = req.params.txid;
  if (id) {
    Members.findOne({ Cust_Id: id }, { Payment: { $elemMatch: { _id: txid } } })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Member with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Erro retrieving Member with id " + id });
      });
  } else {
    res
      .status(500)
      .send({
        message:
          err.message || "Error Occurred while retriving Member information",
      });
  }
};

exports.UpdateDue = (req, res,next) => {
  const id = req.params.id;
  const txid = req.params.txid;
  const Pay = req.body.pay;
  var newId = new mongoose.mongo.ObjectId();
  console.log(newId)
  Pay["_id"] = newId
  req.txid = newId
  var Paid = Pay["Paid"]
  Paid = parseInt(Paid)
  Pay["RecievedBy"] = req.user.username;
  console.log(req.body)
  if (id) {
    Members.findOneAndUpdate(
      { Cust_Id: id },
      { $push: { Payment: Pay }, $inc : {TotalDue:-Paid}},
    )
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({
              message: `Cannot Update Member with ${id}. Maybe Member not found!`,
            });
        } else {
          Members.update(
            { Cust_Id: id, "Payment._id": txid },
            {        
              $set: {
                "Payment.$.Due": req.body.Due,
              },
            }).then(()=>{
              next()
            })
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error Update Member information" });
      });
  } else {
    res
      .status(500)
      .send({
        message:
          err.message || "Error Occurred while retriving Member information",
      });
  }
};

exports.findMemberByBranch = (req, res) => {
  const branch = req.params.branch;
  if((branch==req.user.branch )|| (req.user.role=='superadmin')||req.user.permissions['AllBranches'])
  {if (req.query.id) {
    const id = req.query.id;
    Members.find({ Branch: branch })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Member with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Erro retrieving Member with id " + id });
      });
  } else {
    Members.find({ Branch: branch })
      .then((Member) => {
        res.send(Member);
      })
      .catch((err) => {
        res
          .status(500)
          .send({
            message:
              err.message ||
              "Error Occurred while retriving Member information",
          });
      });
  }} else {
    res
    .status(500)
    .send({
      message:
        "Error Occurred while retriving Member information",
    });
  }
};

exports.ExtendValidity = (req, res,next) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const id = req.params.id;
  const Pay = req.body.Pay;
  var newId = new mongoose.mongo.ObjectId();
  console.log(newId)
  Pay["_id"] = newId
  req.txid = newId
  var due = Pay["Due"];
  due = parseInt(due)
  Pay["RecievedBy"] = req.user.username;
  const Validity = req.body.Valid_Till;
  var Branch;
  Members.findOne({ Cust_Id: id })
  .then((data) => { 
        Branch = data.Branch;
        due += data.TotalDue;
  }).then(()=>{
        if((Branch==req.user.branch)||(req.user.role=='superadmin'||req.user.permissions['AllBranches'])) {
            Members.updateOne(
                { Cust_Id: id },
                { $push: { Payment: Pay }, Valid_Till: Validity, TotalDue : due}
              )
                .then((data) => {
                  if (!data) {
                    res
                      .status(404)
                      .send({
                        message: `Cannot Update Branch with ${id}. Maybe Branch not found!`,
                      });
                  } else {
                     next()
                  }
                })
                .catch((err) => {
                  res.status(500).send({ message: "Error Update Branch information" });
                });
        }
        else {
            res.status(500).send({ message: "Error Update Branch information" });
        }
  })
};


exports.EditPayment = (req,res,next) => {
  console.log('inside')
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const id = req.params.id;
  const txid = req.params.txid;
  Members.update(
        { Cust_Id: id, "Payment._id": txid },
        {        
          $inc:{
            TotalDue : (-parseInt(req.body.oldDue)+parseInt(req.body.Due)) 
          },
          $set: {
            "Payment.$.Paid": req.body.Paid,
            "Payment.$.Due": req.body.Due,
            "Payment.$.Date": req.body.Date,
            "Payment.$.Total": req.body.Total,
            "Payment.$.Comments": req.body.Comments,
            "Payment.$.PayMethod": req.body.PayMethod,
            "Payment.$.RecievedBy": req.user.username,
            "Payment.$.DueDate": req.body.DueDate,
          },
        }).then(()=>{
          next()
        })
        .catch((err) => {
         res.status(500).send({ message: "Error Update Member information" });
          });
}

exports.getTxn = (req,res) =>{
  const id = req.params.id;
  const txid = req.params.txid;
  console.log(id,txid)
  Members.find({ "Payment": { $elemMatch: { _id: txid}}}).then((data)=>{
    if (!data) {
      res.status(404).send({ message: "Not found Member with id " + id });
    } else {
      for(var i=0; i<data[0].Payment.length;i++) {
          console.log(data[0].Payment[i]._id)
          if(data[0].Payment[i]._id==txid) {
            res.send(data[0].Payment[i])
          }
      }
    }
  }).catch((e)=>{
    res.send("ERROR")
  })
}


exports.EditBranchNameforMembers = (req,res) => {
  var id = req.params.Name;
  id = decodeURI(id)
  Members.updateMany({"Branch": id},{
      Branch : req.body.BranchName
  }).then((data)=>{
    res.send(data)
  }).catch((e)=>{
    res.send("ERROR")
  })
}


exports.EditValidity = (req, res,next) => {
  const id = req.params.id;
  if (id) {
    Members.findOneAndUpdate(
      { Cust_Id: id },
      {Valid_Till : req.body.Valid_Till },
    )
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({
              message: `Cannot Update Member with ${id}. Maybe Member not found!`,
            });
        } 
        else {
          res.status(200).send({
            message : "Validity Succesfully Changed"
          })
        }
  })
}}


exports.Pagination = (req,res)=>{
  const pagination = req.body.pagination ? parseInt(req.body.pagination) : 10;
  //PageNumber From which Page to Start 
  const pageNumber = req.body.page ? parseInt(req.body.page) : 1;
  var qc;
  if(req.body.Name) {
    Members.find({Name : { "$regex": req.body.Name, "$options": "i" } })
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  } 
  else if(req.body.MemberId) {
    Members.find({Cust_Id : req.body.MemberId})
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  }else if(req.body.PhoneId) {
    Members.find({Contact_No : req.body.PhoneId})
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  } else if(req.body.Valid_Till) {
    Members.find({Valid_Till : {"$lt":req.body.Valid_Till}})
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  } 
  else if(req.body.ValidityFilter) {
    Members.find({Valid_Till : {"$lte":req.body.ValidityFilter[1], "$gte":req.body.ValidityFilter[0]}})
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  } 
  else if(req.body.DueFind) {
    Members.find({TotalDue : {"$gt":0}})
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  } 
  else {
    Members.find({})
    //skip takes argument to skip number of entries 
    .skip((pageNumber - 1) * pagination)
    //limit is number of Records we want to display
    .limit(pagination)
    .then(data => {
        res.status(200).send({
            "users": data
        })
    })
    .catch(err => {
        res.status(400).send({
            "err": err
        })
    })
  }
}

exports.GetCount = (req,res)=>{
  if(req.body.Name) {
    Members.find({Name : { "$regex": req.body.Name, "$options": "i" } })
    .count()
    .then(data => {
      res.status(200).send({
          "cnt" : data
      })
  })
  .catch(err => {
     res.status(400).send({
         "err" : err
     })
  })
  } else if(req.body.PhoneId) {
    Members.find({Contact_No : req.body.PhoneId})
    .count()
    .then(data => {
      res.status(200).send({
          "cnt" : data
      })
  })
  .catch(err => {
     res.status(400).send({
         "err" : err
     })
  })
  } 
  else if(req.body.MemberId) {
    Members.find({Cust_Id : req.body.MemberId})
    .count()
    .then(data => {
      res.status(200).send({
          "cnt" : data
      })
  })
  .catch(err => {
     res.status(400).send({
         "err" : err
     })
  })
  }
  else if(req.body.Valid_Till) {
    Members.find({Valid_Till : {"$lt":req.body.Valid_Till}})
    .count()
      .then(data => {
        res.status(200).send({
            "cnt" : data
        })
    })
    .catch(err => {
       res.status(400).send({
           "err" : err
       })
    })
  } 
  else if(req.body.ValidityFilter) {
    Members.find({Valid_Till : {"$lte":req.body.ValidityFilter[1], "$gte":req.body.ValidityFilter[0]}})
    .count()
      .then(data => {
        res.status(200).send({
            "cnt" : data
        })
    })
    .catch(err => {
       res.status(400).send({
           "err" : err
       })
    })
  } 
  else if(req.body.DueFind) {
    Members.find({TotalDue : {"$gt":0}})
    .count()
      .then(data => {
        res.status(200).send({
            "cnt" : data
        })
    })
    .catch(err => {
       res.status(400).send({
           "err" : err
       })
    })
  } 
  else {
   Members.find({})
      .count()
      .then(data => {
        res.status(200).send({
            "cnt" : data
        })
    })
    .catch(err => {
       res.status(400).send({
           "err" : err
       })
    })
  }
}
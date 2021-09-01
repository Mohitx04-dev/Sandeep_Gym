var Members = require("../model/member");

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
  const Payment = [];
  Payment.push(Pay);
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
  Pay["RecievedBy"] = req.user.username;
  console.log(req.body)
  if (id) {
    Members.findOneAndUpdate(
      { Cust_Id: id },
      { $push: { Payment: Pay }},
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
                "Payment.$.Paid": req.body.Paid,
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
  Pay["RecievedBy"] = req.user.username;
  const Validity = req.body.Valid_Till;
  var Branch;
  console.log(req.body)
  Members.findOne({ Cust_Id: id })
  .then((data) => { 
        Branch = data.Branch;
  }).then(()=>{
        if((Branch==req.user.branch)||(req.user.role=='superadmin'||req.user.permissions['AllBranches'])) {
            Members.updateOne(
                { Cust_Id: id },
                { $push: { Payment: Pay }, Valid_Till: Validity }
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

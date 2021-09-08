var Employees = require('../model/staff');

// create and save new staff
exports.createEmployee = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new staff
    const staff = new Employees({
        Name : req.body.Name,
        Branch : req.body.Branch,
        Salary: req.body.Salary,
        DOB : req.body.DOB,
        DOJ : req.body.DOJ,
        Aadhar_No : req.body.Aadhar_No
    })

    // save staff in the database
    if(req.user.role=='superadmin' || req.body.Branch == req.user.branch ||req.user.permissions['AllBranches'] ) {
        staff
        .save(staff)
        .then(data => {
            //res.send(data)
            res.status(200).send({ message : "Done"});
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
    }
   else {
        res.status.send(500) ({
            message : "Unauthorised"
        })
   }

}

// retrieve and return all staffs/ retrive and return a single staff
exports.findEmployee = (req, res)=>{
    var Branch = (req.get('branch'))
    if(req.query.id){
        const id = req.query.id;
        Employees.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found staff with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving staff with id " + id})
            })

    } else if(req.user.role=='superadmin' || req.user.permissions['AllBranches']) {
        console.log(Branch)
        Employees.find()        
        .then(staff => {
            res.send(staff)
        })
        .catch(err => {
            res.status(500).send({ message : err.message || "Error Occurred while retriving staff information" })
        })
    }
    else {
           Employees.find({Branch : Branch})
            .then(staff => {
                res.send(staff)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving staff information" })
            })
    }
}

// Update a new idetified staff by staff id
exports.updateEmployee = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Employees.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update staff with ${id}. Maybe staff not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update staff information"})
        })
}

// Delete a staff with specified staff id in the request
exports.deleteEmployee = (req, res)=>{
    const id = req.params.id;
    if(req.user.role=='superadmin' || req.user.branch==req.get('branch') || req.user.permissions['AllBranches'])
    Employees.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "staff was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete staff with id=" + id
            });
        });
        else {
            res.status(500).send({
                message : "Unauthorised"
            })
        }
}


exports.EditBranchNameforEMP = (req,res,next) => {
    var id = req.params.Name;
    id = decodeURI(id)
    Employees.updateMany({"Branch": id},{
        Branch : req.body.BranchName
    }).then((data)=>{
      next()
    }).catch((e)=>{
      res.send("ERROR")
    })
  }
var PTs = require('../model/pt');

// create and save new PT
exports.createPT = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new PT
    const PT = new PTs({
        Name : req.body.Name,
        Branch: req.body.Branch,
        Trainer : req.body.Trainer,
        Fees : req.body.Fees,
        Cust_Id : req.body.Cust_Id,
        StartDate : req.body.StartDate,
        EndDate : req.body.EndDate
    })

    // save PT in the database 
        if(req.user.role=='superadmin' || req.body.Branch == req.user.branch) {
            PT
            .save(PT)
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
        res.status(500).send ({
                message : "Unauthorised"
            })
       }
}

// retrieve and return all PTs/ retrive and return a single PT
exports.findPT = (req, res)=>{
    var Branch = (req.get('branch'))
    if(req.query.id){
        const id = req.query.id;
        PTs.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found PT with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving PT with id " + id})
            })

    } else if(req.user.role=='superadmin') {
        PTs.find()
            .then(PT => {
                res.send(PT)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving PT information" })
            })
    }
    else {
        PTs.find({Branch : Branch})
        .then(PT => {
            res.send(PT)
        })
        .catch(err => {
            res.status(500).send({ message : err.message || "Error Occurred while retriving PT information" })
        })
    }
}

// Update a new idetified PT by PT id
exports.updatePT = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    const id = req.params.id;
    const Branch = req.get('branch')
    if(req.user.role=='superadmin' || req.body.Branch==Branch) {
        PTs.findOneAndUpdate({Cust_Id:id},req.body).then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update PT with ${id}. Maybe PT not found!`})
            }else{
                res.send(data)
            }
        }).catch(err =>{
            res.status(500).send({ message : "Error Update PT information"})
        })
    }
    else {
        res.status(500).send ({
            message : "Unauthorised"
        })
    }
  
}

// Delete a PT with specified PT id in the request
exports.deletePT = (req, res)=>{
    const id = req.params.id;
    var branch;
    PTs.findOne({Cust_Id : id}).then((data)=>{
        branch=data.Branch
        console.log(branch)
    }).then(()=>{
        const Branch = req.get('branch')
    if(req.user.role=='superadmin' || branch==Branch) {
    PTs.findOneAndDelete({Cust_Id : id})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "PT was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete PT with id=" + id
            });
        });
    }
    else {
        res.status(500).send ({
            message : "Unauthorised"
        })
    }
    }).catch((e)=>{
        res.status(500).send ({
            message : e?e:"Unauthorised"
        })
    })
    
}


exports.findPTbyId = (req,res) => {
    const id = req.params.id;
    var branch;
    PTs.findOne({Cust_Id : id}).then((data)=>{
        branch=data.Branch
        console.log(branch)
    }).then(()=>{
        const Branch = req.get('branch')
    if((req.user.role=='superadmin' || branch==Branch) && id) {
        PTs.findOne({Cust_Id:id}).then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found PT with id "+ id})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving PT with id " + id})
        })
    }
    else {
        res.status(500).send({ message : err.message || "Error Occurred while retriving PT information" })
    }
    })
    .catch((e)=>{
        res.status(500).send({ message : err.message || "Error Occurred while retriving PT information" })
    })
}





exports.EditBranchNameforPT = (req,res,next) => {
    var id = req.params.Name;
    id = decodeURI(id)
    PTs.updateMany({"Branch": id},{
        Branch : req.body.BranchName
    }).then((data)=>{
      next()
    }).catch((e)=>{
      res.send("ERROR")
    })
  }
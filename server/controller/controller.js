var Branchs = require('../model/model');

// create and save new Branch
exports.createBranch = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // new Branch
    const Branch = new Branchs({
        Name : req.body.Name,
        Payments: req.body.Payments,
        Total : req.body.Total
    })
    // save Branch in the database
    Branch
        .save(Branch)
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

// retrieve and return all Branchs/ retrive and return a single Branch
exports.findBranch = (req, res)=>{
    var Branch = (req.get('branch'))
    if(req.user.role=='superadmin' || req.user.permissions['AllBranches']) {
        Branchs.find()
            .then(Branch => {   
                res.send(Branch)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving Branch information" })
            })
    }
    else {       
         Branchs.findOne({Name : Branch})
            .then(data=>{
                if(!data){
                    res.status(404).send({ message : "Not found Branch with id "})
                }else{
                    var arr = [data];
                    res.send(arr)
                }
            }) .catch(err =>{
                res.status(500).send({ message: "Erro retrieving Branch with id "})
            })
    }

    
}
// Update a new idetified Branch by Branch id
exports.updateBranch = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    const id = req.params.Name;
    Branchs.findOneAndUpdate({Name:id},req.body).then(data => {
        if(!data){
            res.status(404).send({ message : `Cannot Update Branch with ${id}. Maybe Branch not found!`})
        }else{
            res.send(data)
        }
    }).catch(err =>{
        res.status(500).send({ message : "Error Update Branch information"})
    })
}

// Delete a Branch with specified Branch id in the request
exports.deleteBranch = (req, res)=>{
    const id = req.params.Name;
    console.log(id)
    Branchs.findOneAndDelete({Name : id})
        .then(data => {
            if(!data){
                console.log('here')
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Branch was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Branch with id=" + id
            });
        });
}


exports.findBranchbyId = (req,res) => {
    const id = req.params.Name;
    if((req.user.role=='superadmin')||req.user.branch==id||req.user.permissions['AllBranches']) {
    if(id) {
        Branchs.findOne({Name:id}).then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found Branch with id "+ id})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving Branch with id " + id})
        })
    }
    else {
        res.status(500).send({ message : err.message || "Error Occurred while retriving Branch information" })
    }
}
else {
    res.status(500).send("Error Occurred while retriving Branch information")
}
}


exports.AddBranchPayment = (req, res)=>{
    console.log('inside')
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    const id = req.body.BranchName;
    if(id==req.user.branch || req.user.role=='superadmin'||req.user.permissions['AllBranches']) {
        const Pay = req.body.PayBr;
        Pay["txid"] = req.txid;
        Pay["RecievedBy"] = req.user.username;
        console.log(id,Pay)
        Branchs.updateOne({Name:id},
            {
                $push:{Payments : Pay},
                 $inc: { Total : Pay.Amount} })
                 .then(data => {
                    if(!data){
                        res.status(404).send({ message : `Cannot Update Branch with ${id}. Maybe Branch not found!`})
                    }else{
                        res.send(data)
                    }
                }).catch(err =>{
                    res.status(500).send({ message : "Error Update Branch information"})
                })
    }
    else {
        res.status(500).send({ message : "Error Update Branch information"})
    }
   
}

exports.EditBranchPayment = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    const id = req.body.BranchName;
    const uid = req.params.txid;

    if(id==req.user.branch || req.user.role=='superadmin'||req.user.permissions['AllBranches']) {
        Branchs.findOneAndUpdate({Name:id, "Payments.txid":uid},
            {
                $set:{
                   "Payments.$.Amount" : req.body.Amount,
                   "Payments.$.Customer_Name" : req.body.Customer_Name,
                   "Payments.$.Cust_Id" : req.body.Cust_Id,
                   "Payments.$.Date" : req.body.Date,
                   "Payments.$.PayMethod" : req.body.PayMethod,
                   "Payments.$.RecievedBy" : req.user.username

                }
            })
            .then(data => {
                    if(!data){
                        res.status(404).send({ message : `Cannot Update Branch with ${id}. Maybe Branch not found!`})
                    }else{
                        res.send(data)
                    }
                }).catch(err =>{
                    res.status(500).send({ message : "Error Update Branch information"})
                })
    }
    else {
        res.status(500).send({ message : "Error Update Branch information"})
    }
   
}




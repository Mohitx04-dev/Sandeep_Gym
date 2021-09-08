const mongoose = require('mongoose');
var UserSchema  = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        role: {
          type: String,
          default: "user",
          enum: ["user", "admin", "superadmin"]
        },
        username: {
          type: String,
          required: true
        },
        password: {
          type: String,
          required: true
        },
        permissions : {
                showBranches : Boolean,
                createBranch : Boolean,
                deleteBranches : Boolean,
                editBranch : Boolean,
                showBranchTransaction : Boolean,
                AllBranches : Boolean,
                AddBranchPayment : Boolean,
                showEmployees : Boolean,
                createEmployee : Boolean,
                deleteEmployees : Boolean,
                updateEmployees:Boolean,
                createMember : Boolean,
                showMembers : Boolean,
                updateMembers : Boolean,
                deleteMember : Boolean,
                extendMember : Boolean,
                editTxn : Boolean,
                payDue : Boolean,
                createPT : Boolean,
                showPT : Boolean,
                deletePT : Boolean,
                updatePT : Boolean,
                createAccount : Boolean
        },
        branch : {
            type: String,
            required: true
        }
      },
      { timestamps: true }
)
const Users = mongoose.model("users", UserSchema);
module.exports = Users;

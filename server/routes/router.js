const express = require("express");
const route = express.Router();

const controller = require("../controller/controller");
const staff = require("../controller/staff");
const member = require("../controller/member");
const PT = require("../controller/pt");
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser,
  updateUser,
  GetUserData,
  EditBranchNameforUsers,
  deleteuser,
  findusers,
} = require("../utils/Auth");

const Img = require('../utils/image')
const { useAuth, checkRoleandPermissions } = require("../utils/UserAuth");
// API
route.post(
  "/api/branch",
  useAuth,
  checkRoleandPermissions(["createBranch"]),
  controller.createBranch
);
route.get(
  "/api/branch",
  useAuth,
  checkRoleandPermissions(["showBranches"]),
  controller.findBranch
);
route.put(
  "/api/branch-edit/:Name",
  useAuth,
  checkRoleandPermissions(["editBranch"]),
  controller.EditBranchName,
  EditBranchNameforUsers,
  PT.EditBranchNameforPT,
  staff.EditBranchNameforEMP,
  member.EditBranchNameforMembers
);
// route.put('/api/branch/:Name', controller.updateBranch);
route.get(
  "/api/branch/:Name",
  useAuth,
  checkRoleandPermissions(["showBranches", "showBranchTransaction"]),
  controller.findBranchbyId
);
route.delete(
  "/api/branch/:Name",
  useAuth,
  checkRoleandPermissions(["deleteBranches"]),
  controller.deleteBranch
);
route.post(
  "/api/brtxnbypage",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  controller.Pagination
);
route.post(
  "/api/brtxcount/:id",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  controller.GetCount
);
route.post(
  "/api/staff",
  useAuth,
  checkRoleandPermissions(["createEmployee"]),
  staff.createEmployee
);
route.get(
  "/api/staff",
  useAuth,
  checkRoleandPermissions(["showEmployees"]),
  staff.findEmployee
);
route.put(
  "/api/staff/:id",
  useAuth,
  checkRoleandPermissions(["updateEmployees"]),
  staff.updateEmployee
);
route.delete(
  "/api/staff/:id",
  useAuth,
  checkRoleandPermissions(["deleteEmployees"]),
  staff.deleteEmployee
);
route.post(
  "/api/member",
  useAuth,
  checkRoleandPermissions(["createMember"]),
  member.createMember,
  controller.AddBranchPayment
);
route.get(
  "/api/member",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  member.findMember
);
route.post(
  "/api/memberByPage",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  member.Pagination
);
route.post(
  "/api/MemberCount/:id",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  member.GetCount
);
route.get(
  "/api/findMember/:branch/",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  member.findMemberByBranch
);
route.get(
  "/api/member/:id",
  useAuth,
  checkRoleandPermissions(["showMembers"]),
  member.findMemberbyId
);
route.put(
  "/api/member/:id",
  useAuth,
  checkRoleandPermissions(["updateMembers"]),
  member.updateMember
);
route.delete(
  "/api/member/:id",
  useAuth,
  checkRoleandPermissions(["deleteMember"]),
  member.deleteMember
);
route.put(
  "/api/member-extend/:id/",
  useAuth,
  checkRoleandPermissions(["extendMember"]),
  member.ExtendValidity,
  controller.AddBranchPayment
);
route.get(
  "/api/member/:id/:txid",
  useAuth,
  checkRoleandPermissions(["payDue"]),
  member.findTransaction
);
route.put(
  "/api/member/:id/:txid",
  useAuth,
  checkRoleandPermissions(["payDue"]),
  member.UpdateDue,
  controller.AddBranchPayment
);
route.put(
  "/api/member-txn/:id/:txid",
  useAuth,
  checkRoleandPermissions(["editTxn"]),
  member.EditPayment,
  controller.EditBranchPayment
);
route.get(
  "/api/member-txn/:id/:txid",
  useAuth,
  checkRoleandPermissions(["editTxn"]),
  member.getTxn
);
route.put("/api/validateUp/", member.updateValidityUp);
route.put("/api/validateDown/", member.updateValidityDown);
route.put(
  "/api/member-validity/:id/",
  useAuth,
  checkRoleandPermissions(["editValidity"]),
  member.EditValidity
);
route.post(
  "/api/PT",
  useAuth,
  checkRoleandPermissions(["createPT"]),
  PT.createPT
);
route.get("/api/PT", useAuth, checkRoleandPermissions(["showPT"]), PT.findPT);
route.put(
  "/api/PT/:id",
  useAuth,
  checkRoleandPermissions(["updatePT"]),
  PT.updatePT
);
route.get(
  "/api/PT/:id",
  useAuth,
  checkRoleandPermissions(["showPT"]),
  PT.findPTbyId
);
route.delete(
  "/api/PT/:id",
  useAuth,
  checkRoleandPermissions(["deletePT"]),
  PT.deletePT
);

// route.post("/api/upload-img",Img.upload.single('photo'),Img.UploadImg);

// Users Registeration Route
route.post(
  "/api/register-user",
  useAuth,
  checkRoleandPermissions(["createAccount"]),
  async (req, res) => {
    await userRegister(req.body, "user", res);
  }
);

// Super Admin Registration Route
route.post(
  "/api/register-super-admin",
  useAuth,
  checkRoleandPermissions(["createAccount"]),
  async (req, res) => {
    await userRegister(req.body, "superadmin", res);
  }
);

// Users Login Route
route.post("/api/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Super Admin Login Route
route.post("/api/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

// Profile Route
route.get("/api/profile/:username", useAuth, async (req, res) => {
  return res.json(serializeUser(req));
});

route.get("/api/userprofile/:username", useAuth, GetUserData);

// Users Protected Route
route.get(
  "/api/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Super Admin Protected Route
route.get(
  "/api/superadmin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

route.get(
  "/api/check-permission",
  useAuth,
  checkRoleandPermissions(["createBranch", "showBranches"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);

route.put(
  "/api/update-user/:username",
  useAuth,
  checkRoleandPermissions(["createAccount"]),
  async (req, res) => {
    await updateUser(req.body, req, res);
  }
);

route.get(
  "/api/showUsers/",
  useAuth,
  checkRoleandPermissions(["showUsers"]),
  findusers
);

route.delete(
  "/api/user/:username",
  useAuth,
  checkRoleandPermissions(["showUsers"]),
  deleteuser
);

module.exports = route;

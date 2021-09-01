const passport = require("passport");
const useAuth = passport.authenticate("jwt", { session: false });
/**
 * @DESC Check Role Middleware
 */
const checkRoleandPermissions = (permissions) => (req, res, next) => {
  var k = 0;
  var Obj = req.user.permissions
  console.log(permissions)
  var Branch = (req.get('branch'))
  permissions.forEach(el => {
    if (Obj[el]==true) {
        k++;
    }
  });
  console.log(req.user.role,k,req.user.branch,Branch,req.user.role,permissions.length)

  {
    ((('user'==req.user.role) && k==permissions.length && (Branch==req.user.branch || req.user.permissions.AllBranches==true)) || ('superadmin'==req.user.role))
      ? next()
      : res.status(401).json("Unauthorized");
  }
};

module.exports = {
  useAuth,
  checkRoleandPermissions,
};

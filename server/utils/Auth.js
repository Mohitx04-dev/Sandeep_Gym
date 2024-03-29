const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../model/User");
const { SECRET } = require("../config");

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = async (userDets, role, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false
      });
    }


    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const Permissions = userDets.permissions;
    const Branch = userDets.branch;
    const newUser = new User({
      ...userDets,
      password,
      role,
      Permissions,
      Branch
    });

    await newUser.save();
    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login.",
      success: true
    });
  } catch (err) {
    // Implement logger function (winston)
    console.log('hey')
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false
    });
  }
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  // First Check if the username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials.",
      success: false
    });
  }
  // We will check the role
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
      name : user.name,
      branch : user.branch
    };

    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false
    });
  }
};

const validateUsername = async username => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate('jwt', { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
 { 
      !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();}

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = req => {
  if(req.user.role=='superadmin') { 
  return {
    username: req.user.username,
    email: req.user.email,
    name: req.user.name,
    _id: req.user._id,
    updatedAt: req.user.updatedAt,
    createdAt: req.user.createdAt,
  }
} else {
  return {
    username: req.user.username,
    email: req.user.email,
    name: req.user.name,
    _id: req.user._id,
    updatedAt: req.user.updatedAt,
    createdAt: req.user.createdAt,
    branch: req.user.branch,
    permissions : req.user.permissions
  }
}
};


const updateUser = async (user,req,res) => {
  console.log('trying')
  const id = req.params.username;
  User.findOneAndUpdate({username : id},user)
  .then((data)=>{
      if(!data) {
        res.status(404).send("Failed")
      }
      else {
        res.status(200).send("Updated")
      }
  })
}



const deleteuser = async (req,res) => {
  const id = req.params.username;
  User.findOneAndDelete({username : id})
  .then((data)=>{
      if(!data) {
        res.status(404).send("Failed")
      }
      else {
        res.status(200).send("Deleted")
      }
  })
}

const GetUserData = async (req,res) => {
  User.findOne({username: req.params.username})
  .then((data)=>{
    if(!data) {
      res.status(404).send("Failed")
    }
    else {
      res.status(200).send(data)
    }
  })
}

const EditBranchNameforUsers = (req,res,next) => {
  var id = req.params.Name;
  id = decodeURI(id)
  User.updateMany({"branch": id},{
      branch : req.body.BranchName
  }).then((data)=>{
    next()
  }).catch((e)=>{
    res.send("ERROR")
  })
}

const findusers = (req, res) => {
  User.find()
        .then((user) => {
          res.send(user);
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
};



module.exports = {
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  serializeUser,
  updateUser,
  GetUserData,
  EditBranchNameforUsers,
  deleteuser,
  findusers
};
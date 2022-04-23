const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwtToken = (_id) => {
  return jwt.sign({ _id}, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        msg: "User already registered",
      });

    const { name, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      name,
      email,
      hash_password,
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          msg: "Something went wrong",
        });
      }

      if (user) {
        // const token = generateJwtToken(user._id, user.email);
        const { _id, name, email } = user;
        return res.status(201).json({
          msg: "Registered Successfully.",
          user: { _id, name, email },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  console.log("hit")
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ msg: "Something Went Wrong!" });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword) {
      
        const token = generateJwtToken(user._id);
        const { _id, name, email } = user;

        // SET REQUEST HEADERS
        // req.headers['authorization'] = token

        // console.log(req.headers)
        res.status(200).json({
          msg: "User Logged In.",
          token,
          user: { _id, name, email },
        });
      } else {
        return res.status(401).json({
          msg: "Something went wrong, please check password",
        });
      }
    } else {
      return res.status(400).json({ msg: "Something went wrong" });
    }
  });
};


module.exports.activeStatus = async (req, res) => {
  console.log("hit")
  try {
    const user = await User.findById(req.params.id);
    await user.updateOne({ $set: { "isActive": !user.isActive} });
    res.status(200).json({msg: user.isActive});
 
  } catch (err) {
    res.status(500).json(err);
  }
}
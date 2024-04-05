const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

const bcryptPassword = async (password) => {
  try {
    const hashpassword = await bcrypt.hash(password, 10);
    return hashpassword;
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const userSignup = async (req, res) => {
  try {
    console.log("data recieved", req.body);
    const check = await userModel.exists({ email: req.body.email });
    if (check) {
      res.status(200).json({ exists: true });
    } else {
      const { userName, email, password } = req.body;
      const hashpassword = await bcryptPassword(password);
      const user = {
        userName: userName,
        email: email,
        password: hashpassword,
      };
      await userModel.insertMany([user]);
      res.status(200).json({ success: "created" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const userLogin = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const passwordMatched = await bcrypt.compare(req.body.password,user.password);
      if (passwordMatched) {
        const token = jwt.sign({ value: user }, secretKey, {
          expiresIn: "6000000",
        });
        res.status(200).json({ loginStatus: "success", token });
      } else {
        res.status(200).json({ msg: "passwordWrong" });
      }
    } else {
      res.status(200).json({ msg: "noUserFound" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  userSignup,
  userLogin,
};

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../utils/authMiddleware");

router.use(cookieParser());

router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      profileBackground,
      profileText,
    } = req.body;

    // user Exists or not
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(403)
        .json({ err: "A user with this email already exists", success: false });
    }
    const newUserData = {
      email,
      password: password,
      firstName,
      lastName,
      username,
      profileBackground,
      profileText,
    };
    const newUser = await User.create(newUserData);
    // we want to create a token to return to the user
    const token = await createToken(newUser._id);

    // const userToReturn = { ...newUser.toJSON(), token };
    delete newUser.password;
    return res.status(200).json({ newUser, token, success: true });
  } catch (error) {
    return res.status(400).json({ err: error, success: false });
  }
});

router.post("/login", async (req, res) => {
  // check email exists or not
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).json({ err: "User not found with this email." });
    }

    const userPassword = user.password;
    if (password !== userPassword) {
      return res.status(403).json({ err: "invalid Credentials" });
    }
    
    const token = await createToken(user._id);
    // const userToReturn = { ...user.toJSON(), token };
    delete user.password;
    console.log(user)
    return res.status(200).json({ user, token, success: true });
  } catch (error) {
    return res.status(400).json({ err: error, success: false });
  }
});

const createToken = async (userId) => {
  // Create the token using the provided userId and secret key.
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  return token;
};

router.get("/profile",authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId)
    if (!user) {
      res.status(500).json({
        error: "User doesn't exixts please enter valid user id",
        success: false,
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error getting user data :", error);
    res.status(500).json({ error: "Failed to get user data", success: false });
  }
});

// router.post("/user-detail", async (req, res) => {
//   try {
//     const  {email}  = req.body;
//     console.log(email);
//     const user = await User.findOne({ email: email });
//     res.status(200).send({ user: user });
//   } catch (error) {
//     res.status(400).send({ err: "cookie not found" });
//   }
// });

module.exports = router;

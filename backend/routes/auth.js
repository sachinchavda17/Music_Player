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
    const returnUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileBackground: user.profileBackground,
      profileText: user.profileText,
      username: user.username,
      joinDate: user.joinDate,
      isArtist: user.isArtist,
      _id: user._id,
    };
    return res.status(200).json({ user: returnUser, token, success: true });
  } catch (error) {
    return res.status(400).json({ err: error, success: false });
  }
});

const createToken = async (userId) => {
  // Create the token using the provided userId and secret key.
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  return token;
};

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
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

// API to update user details
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { email, username, firstName, lastName, isArtist } = req.body;

    // Check for required fields
    if (
      !email &&
      !username &&
      !firstName &&
      !lastName &&
      isArtist === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update provided." });
    }

    // Get userId from the auth middleware
    const { userId } = req.body;

    // Find the user by ID and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(email && { email }),
        ...(username && { username }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(isArtist !== undefined && { isArtist }),
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully.",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user.",
    });
  }
});

module.exports = router;

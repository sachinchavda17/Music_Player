const User = require("../models/User");
const Song = require("../models/Song");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerController = async (req, res) => {
  try {
    console.log("api called");
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      profileBackground,
      profileText,
    } = req.body;

    if (!email || !firstName || !password || !confirmPassword) {
      return res.json({ success: false, error: "All fields are mandadory" });
    }
    // user Exists or not
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(403)
        .json({ err: "A user with this email already exists", success: false });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match!" });
    }
    console.log("salting start");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("salting ended");

    const newUserData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profileBackground,
      profileText,
    };
    const newUser = await User.create(newUserData);
    // we want to create a token to return to the user
    const token = await createToken(newUser._id);

    // const userToReturn = { ...newUser.toJSON(), token };
    delete newUser.password;
    return res.status(200).json({ user: newUser, token, success: true });
  } catch (err) {
    return res.status(400).json({ error: err, success: false });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).json({ err: "User not found with this email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ err: "invalid Credentials", success: false });
    }

    const token = await createToken(user._id);

    const returnUser = {
      firstName: user.firstName,
      isArtist: user.isArtist,
      _id: user._id,
    };
    return res.status(200).json({ user: returnUser, token, success: true });
  } catch (error) {
    return res.status(400).json({ err: error, success: false });
  }
};

const createToken = async (userId) => {
  // Create the token using the provided userId and secret key.
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  return token;
};

const profileController = async (req, res) => {
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
};

const profileUpdateController = async (req, res) => {
  try {
    const { email, firstName, lastName, isArtist } = req.body;

    // Check for required fields
    if (!email && !firstName && !lastName && isArtist === undefined) {
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

    res.status(200).json({
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
};

const userRemoveController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found." });

    // Update the artist field in all their songs to indicate they are orphaned
    await Song.updateMany({ artist: userId }, { artist: null });
    // Delete the user account
    await User.deleteOne({ _id: userId });

    return res.status(200).json({
      success: true,
      message: "Your account has been deleted. Your songs are still available.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account.",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  profileController,
  profileUpdateController,
  userRemoveController,
};

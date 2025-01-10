const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now(),
  },
  // likedSongs: [
  //   {
  //     type: [mongoose.Types.ObjectId],
  //     ref: "Song",
  //   },
  // ],
  likedSongs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Song",
    },
  ],
  subscribedArtists: {
    type: String,
    default: "",
  },
  isArtist: {
    type: Boolean,
    default: false,
  },
  profileBackground: {
    type: String,
  },
  profileText: {
    type: String,
  },
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;

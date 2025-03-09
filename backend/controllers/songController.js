const Song = require("../models/Song");
const User = require("../models/User");

const allSongController = async (req, res) => {
  try {
    const songs = await Song.find({}).populate("artist");
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
};

const mySongController = async (req, res) => {
  try {
    // We need to get all songs where artist id == currentUser._id
    const songs = await Song.find({ artist: req.body.userId }).populate(
      "artist"
    );
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
};

const searchSongController = async (req, res) => {
  try {
    const { songName } = req.params;

    // Create a regex pattern for case-insensitive substring matching.
    const regexPattern = new RegExp(songName, "i");

    // Use the regex pattern to find songs with names that contain any part of the input text.
    const songs = await Song.find({
      name: { $regex: regexPattern },
    }).populate("artist");

    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
};

const likedSongsController = async (req, res) => {
  try {
    const { userId } = req.body;
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ err: "User not found", success: false });
    }

    const likedSongs = user.likedSongs;

    if (!likedSongs || likedSongs.length === 0) {
      return res
        .status(200)
        .json({ err: "You haven't liked any song till now", success: false });
    }

    // Fetch all liked songs and populate artist details in one query
    const likedSongData = await Song.find({
      _id: { $in: likedSongs },
    }).populate("artist");

    return res.status(200).json({ data: likedSongData, success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ err: "Internal Server Error", success: false });
  }
};

module.exports = {
  allSongController,
  mySongController,
  searchSongController,
  likedSongsController,
};

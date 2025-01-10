const express = require("express");
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");
const authMiddleware = require("../utils/authMiddleware");
const fileUpload = require("express-fileupload");
const cloudinary = require("../utils/cloudinary")
const router = express.Router();

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.get("/get/allsong", async (req, res) => {
  try {
    const songs = await Song.find({}).populate("artist");
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
});

// Get route to get all songs I have published.
router.get("/get/mysongs", authMiddleware, async (req, res) => {
  try {
    // We need to get all songs where artist id == currentUser._id
    const songs = await Song.find({ artist: req.body.userId }).populate(
      "artist"
    );
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
});

// Get route to get a single song by name

router.get("/get/search/:songName", async (req, res) => {
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
});

router.get("/likesongs", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedSongs = user.likedSongs;

    if (!likedSongs || likedSongs.length === 0) {
      return res
        .status(200)
        .json({ err: "You haven't liked any song till now" });
    }

    // Fetch all liked songs and populate artist details in one query
    const likedSongData = await Song.find({
      _id: { $in: likedSongs },
    }).populate("artist");

    return res.status(200).json({ data: likedSongData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});


router.post("/create-new", authMiddleware, async (req, res) => {
  try {
    const { userId, name } = req.body;
    console.log(req.body);
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Song name is required." });
    }

    if (!req.files || !req.files.thumbnail || !req.files.track) {
      return res
        .status(400)
        .json({ error: "Thumbnail and track files are required." });
    }

    const thumbnailFile = req.files.thumbnail;
    const trackFile = req.files.track;

    // Upload thumbnail to Cloudinary
    const thumbnailCloud = await cloudinary.v2.uploader
      .upload(thumbnailFile.tempFilePath, { folder: "songs" })
      .catch((err) => {
        throw new Error("Failed to upload thumbnail.");
      });

    // Upload track to Cloudinary
    const trackCloud = await cloudinary.v2.uploader
      .upload(
        trackFile.tempFilePath,
        { folder: "songs", resource_type: "video" } // `video` is preferred for audio files in Cloudinary
      )
      .catch((err) => {
        throw new Error("Failed to upload track.");
      });

    // Create new song document
    const newSong = new Song({
      name,
      thumbnail: thumbnailCloud.secure_url,
      track: trackCloud.secure_url,
      artist: userId,
    });

    await newSong.save();

    // Update user to be an artist
    await User.updateOne({ _id: userId }, { isArtist: true });

    res.status(201).json({
      message: "Song created successfully!",
      song: newSong,
      success: true,
    });
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({
      error: error.message || "Failed to create song",
      success: false,
    });
  }
});


router.get("/edit/:songId", authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findOne({ _id: songId }).populate();
    return res.status(200).json({ data: song });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
});


const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, price, category, ratings } = req.body;

    // Validate required fields
    if (!name || !desc || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, description, price, and category are required.",
      });
    }

    // Prepare the updated data
    const updatedData = { name, desc, price, category };

    // Add ratings if provided
    if (ratings !== undefined) {
      const ratingNumber = Number(ratings);
      // Assuming rating should be a number and between 1-5
      if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Rating must be a number between 1 and 5.",
          });
      }
      updatedData.ratings = ratingNumber;
    }

    // Find the food item to update
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ error: "Food not found", success: false });
    }

    // Handle category update
    if (food.category !== category) {
      const menu = await Menu.findById(category);
      if (!menu) {
        return res.status(404).json({ error: "Menu not found" });
      }
      // Add the food to the new menu's foods array
      menu.foods.push(id); // Use food ID to add to the new menu

      // Remove the food item from the old menu's foods array
      await Menu.updateMany(
        { foods: id }, // Find menus that contain the food item
        { $pull: { foods: id } } // Remove the food item from the 'foods' array
      );

      await menu.save(); // Save the updated menu
    }

    // If there's a new image, handle Cloudinary upload
    if (req.files && req.files.image) {
      const imageFile = req.files.image;

      // If the food already has an image, remove the old image from Cloudinary
      if (food.image) {
        const publicId = food.image.split("/").pop().split(".")[0]; // Get public ID from the image URL
        await cloudinary.v2.uploader.destroy(`food_images/${publicId}`);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(
        imageFile.tempFilePath,
        { folder: "food_images" }
      );

      // Update the image URL
      updatedData.image = result.secure_url;
    }

    // Update the food item in the database
    const updatedFood = await Food.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    res.status(200).json({
      message: "Food updated successfully!",
      food: updatedFood,
      success: true,
    });
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({ error: "Failed to update food", success: false });
  }
};

router.post("/edit/:songId/update", authMiddleware, async (req, res) => {
  try {
    const { name, thumbnail, track } = req.body;
    const { songId } = req.params;
    if (!name || !thumbnail || !track) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    const songDetails = { name, thumbnail, track };
    const createdSong = await Song.updateOne({ _id: songId }, songDetails);
    return res.status(200).json(createdSong);
  } catch (error) {
    return res.status(301).json({ err: error });
  }
});
router.get("/edit/:songId/delete", authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    await Song.deleteOne({ _id: songId });
    return res.status(200).json({ data: "Succssfully deleted" });
  } catch (error) {
    return res.status(301).json({ err: error });
  }
});

router.get("/like/:songId", authMiddleware, async (req, res) => {
  const { songId } = req.params;
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    const song = await Song.findById(songId);

    if (!user || !song) {
      return res
        .status(404)
        .json({ err: "User  or song not found", success: false });
    }
    // Check if the song is already liked
    if (user.likedSongs.includes(songId)) {
      // Remove the song from the user's liked songs
      user.likedSongs = user.likedSongs.filter(
        (id) => id.toString() !== songId
      );
      await user.save();
      return res.status(200).json({
        msg: "Liked Song removed successfully",
        success: true,
        liked: false,
      });
    } else {
      user.likedSongs.push(songId);
      await user.save();
      return res
        .status(200)
        .json({ msg: "Song liked successfully", success: true, liked: true });
    }
  } catch (error) {
    console.error("Error liking song:", error);
    return res.status(500).json({ err: "Internal Server error" });
  }
});

// API to check single song like status
router.get("/like-status/:songId", authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    const { userId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ err: "User not found", success: false });
    }

    // Check if the songId is in the likedSongs array of the user
    const likedStatus = user.likedSongs.includes(songId);

    return res.status(200).json({ liked: likedStatus, success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ err: "Internal Server Error", success: false });
  }
});

module.exports = router;

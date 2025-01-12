const express = require("express");
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");
const authMiddleware = require("../utils/authMiddleware");
const fileUpload = require("express-fileupload");
const cloudinary = require("../utils/cloudinary");
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
    const { userId, name, thumbnail, track } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ err: "Song name is required." });
    }

    let thumbnailUrl;
    let trackUrl;

    // Handle thumbnail - check if it's a URL or file upload
    if (thumbnail) {
      if (thumbnail.startsWith("http") || thumbnail.startsWith("https")) {
        // If thumbnail is a URL, use the provided URL
        thumbnailUrl = thumbnail;
      } else {
        // If thumbnail is a file, upload it to Cloudinary
        if (!req.files || !req.files.thumbnail) {
          return res.status(400).json({ err: "Thumbnail is required." });
        }
        const thumbnailFile = req.files.thumbnail;
        // Upload thumbnail to Cloudinary
        const thumbnailCloud = await cloudinary.v2.uploader
          .upload(thumbnailFile.tempFilePath, { folder: "songs" })
          .catch((err) => {
            throw new Error("Failed to upload thumbnail.");
          });
        thumbnailUrl = thumbnailCloud.secure_url;
      }
    } else {
      return res.status(400).json({ err: "Thumbnail is required." });
    }

    // Handle track - check if it's a URL or file upload
    if (track) {
      if (track.startsWith("http") || track.startsWith("https")) {
        // If track is a URL, use the provided URL
        trackUrl = track;
      } else {
        // If track is a file, upload it to Cloudinary
        if (!req.files || !req.files.track) {
          return res.status(400).json({ err: "Track is required." });
        }
        const trackFile = req.files.track;
        // Upload track to Cloudinary
        const trackCloud = await cloudinary.v2.uploader
          .upload(
            trackFile.tempFilePath,
            { folder: "songs", resource_type: "video" } // `video` is preferred for audio files in Cloudinary
          )
          .catch((err) => {
            throw new Error("Failed to upload track.");
          });
        trackUrl = trackCloud.secure_url;
      }
    } else {
      return res.status(400).json({ err: "Track is required." });
    }

    // Create new song document
    const newSong = new Song({
      name,
      thumbnail: thumbnailUrl,
      track: trackUrl,
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
      err: error.message || "Failed to create song",
      success: false,
    });
  }
});


router.get("/:songId", authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findOne({ _id: songId }).populate();
    return res.status(200).json({ song, success: true });
  } catch (error) {
    return res.status(301).json({ err: error, success: false });
  }
});

router.put("/edit/:id/update"),
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, thumbnail, track } = req.body;

      // Validate required fields
      if (!name || !thumbnail || !track) {
        return res.status(400).json({
          success: false,
          err: "Name, thumbnail and track are required.",
        });
      }

      // Prepare the updated data
      const updatedData = { name, thumbnail, track };

      // Find the food item to update
      const song = await Song.findById(id);
      if (!song) {
        return res.status(404).json({ err: "Song not found", success: false });
      }

      // If there's a new image, handle Cloudinary upload
      if (req.files && req.files.thumbnail) {
        const thumbnailFile = req.files.thumbnail;

        // If the food already has an image, remove the old image from Cloudinary
        if (song.thumbnail) {
          const publicId = food.image.split("/").pop().split(".")[0]; // Get public ID from the image URL
          await cloudinary.v2.uploader.destroy(`songs/${publicId}`);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(
          thumbnailFile.tempFilePath,
          { folder: "songs" }
        );

        // Update the image URL
        updatedData.thumbnail = result.secure_url;
      }
      // If there's a new image, handle Cloudinary upload
      if (req.files && req.files.track) {
        const trackFile = req.files.track;

        // If the food already has an image, remove the old image from Cloudinary
        if (song.track) {
          const publicId = food.image.split("/").pop().split(".")[0]; // Get public ID from the image URL
          await cloudinary.v2.uploader.destroy(`songs/${publicId}`);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(
          trackFile.tempFilePath,
          { folder: "songs" }
        );

        // Update the image URL
        updatedData.track = result.secure_url;
      }

      // Update the food item in the database
      const updatedSong = await Song.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
      });

      res.status(200).json({
        message: "Song updated successfully!",
        song: updatedSong,
        success: true,
      });
    } catch (error) {
      console.error("Error updating food:", error);
      res.status(500).json({ err: "Failed to update food", success: false });
    }
  };

router.delete("/edit/:id/delete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the song to be removed
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ success: false, err: "Song not found" });
    }

    // Helper function to check if a URL belongs to Cloudinary
    const isCloudinaryURL = (url) =>
      url.includes("res.cloudinary.com") && url.includes("/songs/");

    // Handle thumbnail deletion
    if (song.thumbnail && isCloudinaryURL(song.thumbnail)) {
      const thumbnailPublicId = song.thumbnail.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader
        .destroy(`songs/${thumbnailPublicId}`)
        .catch((err) => {
          console.warn(
            "Failed to delete thumbnail from Cloudinary:",
            err.message
          );
        });
    }

    // Handle track deletion
    if (song.track && isCloudinaryURL(song.track)) {
      const trackPublicId = song.track.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader
        .destroy(`songs/${trackPublicId}`)
        .catch((err) => {
          console.warn("Failed to delete track from Cloudinary:", err.message);
        });
    }

    // Delete the song from the database
    const deleteResult = await Song.deleteOne({ _id: id });

    if (deleteResult.deletedCount === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete song from database",
      });
    }

    res.json({ success: true, message: "Song removed successfully!" });
  } catch (error) {
    console.error("Error removing song:", error);
    res.status(500).json({ err: "Failed to remove song", success: false });
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

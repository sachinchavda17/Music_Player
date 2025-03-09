const User = require("../models/User");
const Song = require("../models/Song");
const cloudinary = require("../utils/cloudinary");

const createSongController = async (req, res) => {
  try {
    const { userId, name, thumbnail, track, artistName } = req.body;
    // Validate required fields
    if (!name || !artistName) {
      return res
        .status(400)
        .json({ err: "Song name and artist name are required." });
    }

    let thumbnailUrl;
    let trackUrl;

    if (
      thumbnail &&
      (thumbnail.startsWith("http") || thumbnail.startsWith("https"))
    ) {
      thumbnailUrl = thumbnail;
    } else {
      // If thumbnail is a file, upload it to Cloudinary
      if (!req.files || !req.files.thumbnail) {
        return res.status(400).json({ err: "Thumbnail is required." });
      }
      const thumbnailFile = req.files.thumbnail;
      console.log(thumbnailFile);
      // Upload thumbnail to Cloudinary
      const thumbnailCloud = await cloudinary.v2.uploader
        .upload(thumbnailFile.tempFilePath, { folder: "songs" })
        .catch((err) => {
          throw new Error("Failed to upload thumbnail.");
        });
      thumbnailUrl = thumbnailCloud.secure_url;
    }

    if (track && (track.startsWith("http") || track.startsWith("https"))) {
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
          { folder: "songs", resource_type: "video" } 
        )
        .catch((err) => {
          throw new Error("Failed to upload track.");
        });
      trackUrl = trackCloud.secure_url;
    }

    // Create new song document
    const newSong = new Song({
      name,
      thumbnail: thumbnailUrl,
      track: trackUrl,
      artist: userId,
      artistName,
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
};

const getSongController = async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findOne({ _id: songId }).populate();
    return res.status(200).json({ song, success: true });
  } catch (error) {
    return res.status(301).json({ err: error, success: false });
  }
};

const updateSongController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, thumbnail, track, artistName } = req.body;

    // Validate required fields
    if (!name || !thumbnail || !track || !artistName) {
      return res.status(400).json({
        success: false,
        err: "Name, thumbnail, track and Artist name are required.",
      });
    }

    // Prepare the updated data
    const updatedData = { name, thumbnail, track, artistName };

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

const deleteSongController = async (req, res) => {
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
};

const likeSongController = async (req, res) => {
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
};

const getLikeSongController = async (req, res) => {
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
};

module.exports = {
  createSongController,
  getSongController,
  updateSongController,
  deleteSongController,
  likeSongController,
  getLikeSongController,
};

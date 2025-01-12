const express = require("express");
const authMiddleware = require("../utils/authMiddleware");
const fileUpload = require("express-fileupload");
const {
  allSongController,
  mySongController,
  searchSongController,
  likedSongsController,
  updateAllSongs,
} = require("../controllers/songController");
const {
  createSongController,
  getSongController,
  updateSongController,
  deleteSongController,
  getLikeSongController,
  likeSongController,
} = require("../controllers/songEditController");
const router = express.Router();

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.get("/get/allsong", allSongController);

router.get("/get/search/:songName", searchSongController);

router.get("/get/mysongs", authMiddleware, mySongController);

router.get("/likesongs", authMiddleware, likedSongsController);

router.post("/create-new", authMiddleware, createSongController);

router.get("/:songId", authMiddleware, getSongController);

router.put("/edit/:id/update", authMiddleware, updateSongController);

router.delete("/edit/:id/delete", authMiddleware, deleteSongController);

router.get("/like/:songId", authMiddleware, likeSongController );

router.get("/like-status/:songId", authMiddleware, getLikeSongController);

module.exports = router;

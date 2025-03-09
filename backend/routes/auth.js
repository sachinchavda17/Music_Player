const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../utils/authMiddleware");
const {
  loginController,
  registerController,
  profileUpdateController,
  profileController,
  userRemoveController,
} = require("../controllers/authController");
const router = express.Router();

router.use(cookieParser());

router.post("/register", registerController);

router.post("/login", loginController);

router.delete("/remove",authMiddleware, userRemoveController)

router.get("/profile", authMiddleware, profileController);

router.put("/update", authMiddleware, profileUpdateController);

module.exports = router;

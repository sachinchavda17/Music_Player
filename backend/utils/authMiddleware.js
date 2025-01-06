const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Check for the token in the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "Not Authorized. Login Again!" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Token missing. Please log in again." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in Auth Middleware", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token. Please log in again." });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ success: false, error: "Token expired. Please log in again." });
    }

    res
      .status(500)
      .json({ success: false, error: "Failed to authenticate user" });
  }
};

module.exports = authMiddleware;

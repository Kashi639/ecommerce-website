const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; //get second value
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get the id from decoded token, and find user excluding password
      req.user = await User.findById(decoded.user.id).select("-password");
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };

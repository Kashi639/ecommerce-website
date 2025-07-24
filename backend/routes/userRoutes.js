const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authMiddleware")

const router = express.Router(); //new route instance

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // extracts

  try {
    // Registeration logic
    // check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // if not create new user
    user = new User({ name, email, password });
    await user.save();

    // Create JWT Payload, this payload contains info about user id and role,
    // payload gets embedded in token and we will decode it to authorize the user at teh backend
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(
      payload, //paylod
      process.env.JWT_SECRET, //secret key
      { expiresIn: "40h" }, //token expiration, keep it less
      (err, token) => {
        if (err) throw err;

        // Send the user and token in response
        res.status(201).json({
          user: {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/login
// @desc Authenticate user
//  @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.matchPassword(password); //matchPassword checks matching passwords
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(
      payload, //paylod
      process.env.JWT_SECRET, //secret key
      { expiresIn: "40h" }, //token expiration, keep it less
      (err, token) => {
        if (err) throw err;

        // Send the user and token in response
        res.json({
          user: {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profilw (Protected Route)
// @access Private
router.get("/profile", protect, async (req, res) => { // protect is the middleware
  res.json(req.user); // respond with middlewares response
})

module.exports = router;

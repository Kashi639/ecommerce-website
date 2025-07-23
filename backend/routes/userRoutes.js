const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
        })
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

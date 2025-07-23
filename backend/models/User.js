const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"], //validation
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);


// Password Hash middleware
// pre is a mongoose middleware hook, next is other operations
userSchema.pre("save", async function (next) { 
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10); //
  this.password = await bcrypt.hash(this.password, salt); //update password
  next();
})


// Match User entered password to Hashed password

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); //bcrypts compare function returns boolean value
}

module.exports = mongoose.model("User", userSchema); //export the user model
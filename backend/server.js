const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db")

const app = express(); //initialize express application
app.use(express.json()); //server is able to work with json data
app.use(cors()); //enable cross origin request

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME TO CARTNEST API!"); // respond
}); // basic route to test server

app.listen(PORT, () => {
  //start server on port 9000
  console.log(`Server is running on http://localhost:${PORT}`);
});

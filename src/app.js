const express = require("express");
const connectDB = require("./config/database");
const { User } = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).json({ message: "User saved successfully!", user });
  } catch (err) {
    res.status(400).send("Error saving the user : " + err);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established!😃");
    app.listen(3000, () => {
      console.log("Server is running on port 3000...");
    });
  })
  .catch(() => {
    console.error("Error connecting to the Database😥");
  });

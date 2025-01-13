const express = require("express");
const connectDB = require("./config/database")

const app = express();

connectDB()
  .then(() => {
    console.log("Database connection established!😃");
    app.listen(3000, () => {
        console.log("Server is running on port 3000...")
    })
  })
  .catch(() => {
    console.error("Error connecting to the Database😥");
  });


const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://kumharsagar2001:2gQh5hJk4UekpwRR@namastenodejs.wsovl.mongodb.net/devTinder"
  );
};
module.exports = connectDB;



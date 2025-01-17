const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: true,
    },
    lastName: {
      type: String,
    },
    mobileNumber : {
      type : Number,
      max : 10,
      unique : true,
      trim : true
    },
    emailId: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
      lowercase: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.ethicaonline.com/wp-content/uploads/2016/08/dummy-prod-1.jpg",
    },
    about: {
      type: String,
      default: "Tell something about yourself...",
      maxLength: 250,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };

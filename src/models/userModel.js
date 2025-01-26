const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    new: {
      type: Boolean,
      default: true,
    },
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 25,
      required: true,
    },
    lastName: {
      type: String,
    },
    profession: {
      type: String,
      minLength: 3,
      maxLength: 25,
    },
    // mobileNumber: {
    //   type: Number,
    //   max: 10,
    // },
    emailId: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid Email address " + value);
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password " + value);
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("Age must be 18 or greater to use DevTinder");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
      // lowercase: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.ethicaonline.com/wp-content/uploads/2016/08/dummy-prod-1.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Not a valid image URl " + value);
        }
      },
    },

    about: {
      type: String,
      default: "Tell something about yourself...",
      maxLength: 500,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Devtinder@123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (inputPasswordByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordCorrect = await bcrypt.compare(
    inputPasswordByUser,
    passwordHash
  );
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

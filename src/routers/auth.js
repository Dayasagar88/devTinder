const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const validator = require("validator");
const { validateSignupData } = require("../utils/validator");

const USER_DATA = [
  "firstName",
  "lastName",
  "profession",
  "age",
  "skills",
  "photoUrl",
  "gender",
  "about",
  "emailId",
  "password"
];

//Signup api
authRouter.post("/signup", async (req, res, next) => {
  try {
    // validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const isUserAlreadyExist = await User.findOne({ emailId });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "User already exist with this email address",
        success: false,
      });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    return res.status(200).json({ message: "User saved successfully!", user });
  } catch (err) {
    next(err); //forward the error to middleware
  }
});

//login api
authRouter.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Enter a valid email address" , success : false});
    }

    const user = await User.findOne({ emailId })
    if (user) {
      //compare password || check password
      const isPasswordCorrect = await user.validatePassword(password);

      if (isPasswordCorrect) {
        const token = await user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 + 3600000),
        });

        return res.status(200).json({
          message: `Welcome back ${user.firstName} ${user.lastName}`,
          success: true,
          user
        });
      } else {
        return res
          .status(400)
          .json({ message: "Incorrect email or password", success: false });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript
      secure: true,   
      sameSite: 'strict', 
    });

    // Respond with success message
    res.status(200).json({ message: 'Logout successful', success: true });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Something went wrong', success: false });
  }
});

module.exports = authRouter;

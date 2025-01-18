const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { User } = require("../models/userModel");

profileRouter.get("/profile", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

profileRouter.patch("/profile/edit" ,userAuth, async  (req, res, next) => {
  try {
    const {firstName, lastName, age , skills, about, gender, } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, {
      firstName,
      lastName,
      skills,
      age,
      about,
      gender
    }, {returnDocument : "after"})
    await user.save();
    res.status(200).json({message : "Profile updated successfully", success : true, user })

  } catch (error) {
    next(error)
  }
})

module.exports = profileRouter;

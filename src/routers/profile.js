const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { User } = require("../models/userModel");
const { validateEditProfileDate } = require("../utils/validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: "Profile accessed!", success: true, user });
  } catch (error) {
    next(error);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res, next) => {
  try {
    if (!validateEditProfileDate(req)) {
      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      loggedInUser,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

profileRouter.patch(
  "/profile/change-password",
  userAuth,
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = req.user;

      const isOldPasswordCorrect = await user.validatePassword(oldPassword);
      if (!isOldPasswordCorrect) {
        return res
          .status(400)
          .json({ message: "Incorrect old password", success: false });
      }

      const hashNewPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashNewPassword;

      await user.save();

      res
        .status(200)
        .json({ message: "Password changed successfully", success: true });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = profileRouter;

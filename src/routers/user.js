const express = require("express");
const userRouter = express.Router();
const { User } = require("../models/userModel");
const userAuth = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequestModel");
const { set } = require("mongoose");

const USER_SAFE_DATA = "firstName lastName profession age gender photoUrl skills about";

userRouter.get("/user/request/received", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequestReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "like",
    }).populate("fromUserId", "firstName lastName photoUrl");

    if (connectionRequestReceived.length < 1) {
      return res
        .status(200)
        .json({ message: "No pending connection request!", success: true });
    }

    res.status(200).json({
      message: "Data fetched successfully!",
      success: true,
      connectionRequestReceived,
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    const connectionList = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });

    if (connectionList.length < 1) {
      return res
        .status(200)
        .json({ message: "No connections yet!", success: true });
    }

    res.status(200).json({
      message: "Connection fetched successfully!",
      success: true,
      connectionList,
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    limit = limit > 50 ? 50 : limit;

    if (page < 0) {
      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hiddenUserFromFeed.add(request.fromUserId.toString());
      hiddenUserFromFeed.add(request.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed created successfully",
      success: true,
      feedUsers,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;

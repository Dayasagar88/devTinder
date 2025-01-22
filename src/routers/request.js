const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { User } = require("../models/userModel");
const { ConnectionRequest } = require("../models/connectionRequestModel");

//send connection request api
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const toUserId = req.params.userId;
      const fromUserId = String(req.user._id);
      const status = req.params.status;
      console.log(fromUserId);
      console.log(toUserId);

      const ALLOWSTATUS = ["like", "pass"];

      const user = await User.findById(toUserId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User does not exists!", success: false });
      }

      if (!ALLOWSTATUS.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type!",
          success: false,
        });
      }

      if (fromUserId === toUserId) {
        return res
          .status(400)
          .json({ message: "Cannot send request to yourself", success: false });
      }

      const isAlreadyConnectionRequestExists = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (isAlreadyConnectionRequestExists) {
        return res.status(400).json({
          message: "Connection request already sent!",
          success: false,
        });
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await newConnectionRequest.save();

      res.status(200).json({
        message: `Connection request sent successfully to ${user?.firstName}`,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const ALLOWSTATUS = ["accepted", "rejected"];
      if (!ALLOWSTATUS.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type!", success: false });
      }
      //check if request ID user exists in the Users DB
      const isRequestIdUser = await User.findById(requestId);
      if (!isRequestIdUser) {
        return res
          .status(404)
          .json({ message: "User does not exists!", success: false });
      }

      //find the connection request in connnectionRequest DB
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "like",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!", success: false });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({
        message: `You ${status} the connection request of ${isRequestIdUser.firstName} ${isRequestIdUser.lastName}!`,
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = requestRouter;

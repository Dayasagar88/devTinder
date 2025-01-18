const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");


//send connection request api
requestRouter.post("/send-connection-request", userAuth, (req, res, next) => {
    try {
      const user = req.user;
      res.send(user.firstName + " sent a connection request")
    } catch (error) {
      next(error)
    }
  })

  module.exports = requestRouter;

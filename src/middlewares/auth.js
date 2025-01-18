const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }

    const decodedToken = await jwt.verify(token, "Devtinder@123");

    if (!decodedToken) {
      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }

    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found!", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
};
module.exports = userAuth;
const express = require("express");
const connectDB = require("./config/database");
const { User } = require("./models/userModel");
const errorHandler = require("./config/errorHandler");
const { validateSignupData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res, next) => {
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

app.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ emailId });
    if (user) {
      //compare password || check password
      const isPasswordCorrect = await bcrypt.compare(password, user?.password);

      if (isPasswordCorrect) {
        const token = jwt.sign({ _id: user._id }, "Devtinder@123", {expiresIn : "1d"});
        res.cookie("token", token);

        return res
          .status(200)
          .json({
            message: `Welcome back ${user.firstName} ${user.lastName}`,
            success: true,
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

app.get("/profile", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/send-connection-request", userAuth, (req, res, next) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent a connection request")
  } catch (error) {
    next(error)
  }
})

app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Database connection established!😃");
    app.listen(3000, () => {
      console.log("Server is running on port 3000...");
    });
  })
  .catch(() => {
    console.error("Error connecting to the Database😥");
  });

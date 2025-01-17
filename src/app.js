const express = require("express");
const connectDB = require("./config/database");
const { User } = require("./models/userModel");
const errorHandler = require("./config/errorHandler");
const { validateSignupData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

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
        return res
          .status(200)
          .json({ message: "Logged in successfully", success: true });
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

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  if (!userEmail) {
    return res.send("Email Id required");
  }

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.status(200).json({ message: `${users.length} users found`, users });
    } else {
      res.status(404).send("No users found");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
    console.log("Error : ", error);
  }
});

app.delete("/delete-user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find and delete the user in one step
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log(deletedUser);

    // Check if a user was deleted
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.patch("/update-user/:id", async (req, res, next) => {
  const userId = req.params.id;

  try {
    if (req.body?.emailId) {
      return res
        .status(400)
        .send("Sorry, Email Id cannot be changed for security reasons.");
    }

    if (Array.isArray(req.body.skills) && req.body.skills.length > 10) {
      return res.status(400).send("400 Bad Request: Maximum 10 skills allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    next(error); //forward the error to middleware
  }
});

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

const express = require("express");
const connectDB = require("./config/database");
const errorHandler = require("./config/errorHandler");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const requestRouter = require("./routers/request")

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);    
app.use("/", profileRouter);    
app.use("/", requestRouter);    


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

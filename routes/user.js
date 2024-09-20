const express = require("express");
const {
  signup,
  auth,
  logOut,
  profile,
  profileUpdate,
} = require("../controllers/user");
const userAuth = require("../middleware/userAuth");
const userRouter = express.Router();
const fileUpload = require("express-fileupload");

userRouter
  .post("/signup", fileUpload(), signup)
  .post("/login", auth)
  .post("/logout", logOut)
  .get("/profile", userAuth, profile)
  .patch("/profile", userAuth, profileUpdate);

module.exports = userRouter;

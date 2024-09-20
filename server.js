require("dotenv").config();
const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const dbConnection = require("./config/dbConnection");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 5000;

dbConnection();

app.use(express.json());
app.use(cookieParser());

app.use("/user", require("./routes/user"));

app.all("*", (req, res) => {
  if (req.accepts("json")) {
    res.status(404).json({ message: "Not Found" });
  } else if (req.accepts("html")) {
    res.status(404).send("Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("DB connection created...");
  app.listen(PORT, () => {
    console.log("Server running " + PORT);
  });
});

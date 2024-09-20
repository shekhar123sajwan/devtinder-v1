const User = require("../model/Users");
const bcrypt = require("bcrypt");
const {
  userSignUpAllowedFields,
  userProfileEditAllowedFields,
} = require("../utils/allowedFields");
const path = require("path");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  let user = req.body;

  try {
    if (!userSignUpAllowedFields(req)) {
      return res.status(400).json({ message: "Fields not allowed!", data: [] });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not there!", data: [] });
    }

    const sampleFile = req.files.photo;

    const uploadPath =
      __dirname +
      "/../uploads/" +
      new Date().getTime() +
      "_" +
      path.parse(sampleFile.name).name +
      path.extname(sampleFile.name);

    //Size more than 2 MB
    if (sampleFile.size > 2048000) {
      throw new Error("Error: File size is more that 2MB!");
    }

    sampleFile.mv(uploadPath, function (err) {
      if (err) throw new Error(err);
    });

    const hashPassword = await bcrypt.hash(user.password, 10);

    user.password = hashPassword;

    const newUser = await User.create(user);

    return res
      .status(201)
      .json({ message: `${user.firstName} user created!`, data: newUser });
  } catch (err) {
    return res.status(400).json({ message: err.message, data: [] });
  }
};

const auth = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Not valid data!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.statusCode = 400;
      throw new Error("Password does not match");
    }

    const userToken = await jwt.sign({ data: user }, process.env.JWTKEY, {
      expiresIn: "7D",
    });

    res.cookie("uid", userToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    req.user = user;

    res.status(200).json({ data: user, message: "Login Successfull!" });
  } catch (err) {
    res.status(res.statusCode).json({ data: [], message: err.message });
  }
};

const logOut = (req, res) => {
  res.cookie("uid", null, {
    expires: new Date(Date.now()),
  });
  res.json({ data: [], message: "User logout successfull!" });
};

const profile = async (req, res) => {
  try {
    res.status(200).json({ data: req.user, message: "" });
  } catch (err) {
    res.status(res.statusCode).json({ data: [], message: err.message });
  }
};

const profileUpdate = async (req, res) => {
  try {
    const userData = req.body;

    if (!userProfileEditAllowedFields(req)) {
      res.statusCode = 400;
      throw new Error("Fields are not allowed to update!");
    }

    const userUpdate = await User.findOneAndUpdate(
      { _id: req?.user?.id },
      userData,
      {
        returnDocument: "after",
      }
    );

    res.status(200).json({ data: userUpdate, message: "" });
  } catch (err) {
    res.status(res.statusCode).json({ data: [], message: err.message });
  }
};
module.exports = { signup, auth, logOut, profile, profileUpdate };

const jwt = require("jsonwebtoken");
const Users = require("../model/Users");

const userAuth = async (req, res, next) => {
  try {
    const userId = req.cookies?.uid;

    if (!userId) {
      res.statusCode = 400;
      throw new Error("User not found, Please login!");
    }

    const verifiedUser = await jwt.verify(userId, process.env.JWTKEY);

    if (!verifiedUser) {
      throw new Error("Something went wrong!");
    }

    const user = await Users.findOne({ email: verifiedUser?.data?.email });

    if (!user) {
      throw new Error("User does not exist!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(res.statusCode).json({ data: [], message: err.message });
  }
};

module.exports = userAuth;

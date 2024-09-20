const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const db = await mongoose.connect(process.env.DB, {
      dbName: "devtinder_v1",
    });
  } catch (err) {
    throw new Error(err.message);
    process.exit(1);
  }
};
module.exports = dbConnection;

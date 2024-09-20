const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "{VALUE} is not allowed",
      },
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png",
    },
    about: {
      type: String,
      default: "Default About me",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ firstName: 1 });

module.exports = mongoose.model("User", UserSchema);

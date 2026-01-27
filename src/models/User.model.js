const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be exactly 10 digits",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: {
        validator: (v) => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(v),
        message:
          "Password must be at least 6 characters and contain letters and numbers",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);

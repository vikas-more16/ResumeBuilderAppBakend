const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    data: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      summary: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resume", resumeSchema);

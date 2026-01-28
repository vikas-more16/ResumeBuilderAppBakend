const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    program: { type: String, trim: true },
    specialization: { type: String, trim: true },
    institute: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    scoreType: {
      type: String,
      enum: ["percentage", "cgpa", "grade", "other"],
    },
    score: { type: String },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "freelance"],
    },
    company: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
  },
  { _id: false },
);

const skillsSchema = new mongoose.Schema(
  {
    category: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
  },
  { _id: false },
);

const socialLinksSchema = new mongoose.Schema(
  {
    network: { type: String, trim: true },
    username: { type: String, trim: true },
    link: { type: String, trim: true },
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeType: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "Untitiled",
      required: true,
      trim: true,
    },

    personalInfo: {
      photo: { type: String },
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      jobTitle: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      country: { type: String, trim: true },
      city: { type: String, trim: true },
      summary: { type: String },
    },

    education: [educationSchema],

    experience: [experienceSchema],

    skills: [skillsSchema],

    socialLinks: [socialLinksSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);

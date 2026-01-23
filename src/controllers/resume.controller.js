const Resume = require("../models/Resume.model");
const User = require("../models/User.model");

/* ================= CREATE RESUME ================= */
exports.createResume = async (req, res) => {
  try {
    const resume = new Resume({
      user: req.userId,
      title: "Untitled Resume",
      data: {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
      },
    });

    await resume.save();
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { resumes: resume._id } },
      { new: true },
    );
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE RESUME ================= */
exports.updateResume = async (req, res) => {
  try {
    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },

      {
        title: req.body.data.name,
        data: req.body.data,
      },
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER RESUMES ================= */
exports.getMyResumes = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "resumes",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.resumes);
  } catch (error) {
    console.error("GET RESUMES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

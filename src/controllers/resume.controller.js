const Resume = require("../models/Resume.model");

/* ================= CREATE RESUME ================= */
exports.createResume = async (req, res) => {
  try {
    const resume = new Resume({
      user: req.userId,
      title: req.body.name || "Untitled Resume",
      data: req.body,
    });

    await resume.save();
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
        title: req.body.name || "Untitled Resume",
        data: req.body,
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
    const resumes = await Resume.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const { default: mongoose } = require("mongoose");
const Resume = require("../models/Resume.model");
const User = require("../models/User.model");

/* ================= CREATE RESUME ================= */
exports.createResume = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, resumeType } = req.body;

    if (!userId || !resumeType) {
      return res.status(400).json({
        message: "userId and resumeType are required",
      });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const resume = await Resume.create(
      [
        {
          user: userId,
          resumeType,
          title: "Untitled",
        },
      ],
      { session },
    );

    user.resumes.push(resume[0]._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Resume created successfully",
      resume: resume[0],
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};

/* ================= GET USER RESUMES ================= */
exports.getMyResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const resumes = await Resume.find({ user: userId })
      .select("_id title resumeType updatedAt createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    const resume = await Resume.findById(resumeId).populate(
      "user",
      "username email",
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteResume = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { resumeId } = req.params;

    // Validate resumeId
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    // Find resume
    const resume = await Resume.findById(resumeId).session(session);
    if (!resume) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Resume not found" });
    }

    // Remove resume from user
    await User.findByIdAndUpdate(
      resume.user,
      { $pull: { resumes: resume._id } },
      { session },
    );

    // Delete resume
    await Resume.deleteOne({ _id: resumeId }).session(session);

    await session.commitTransaction();

    res.status(200).json({
      message: "Resume deleted successfully",
      resumeId,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};

exports.updateTitle = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { title } = req.body;

    // Validate resumeId
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    // Validate title
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      { title: title.trim() },
      { new: true },
    ).select("_id title updatedAt");

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      message: "Resume title updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePersonalInfo = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const updates = {};

    // Handle photo upload
    if (req.file) {
      const photoUrl = `http://localhost:5000/${Date.now()}-${req.file.originalname}`;
      updates["personalInfo.photo"] = photoUrl;
    }

    // Handle text fields (partial update)
    const allowedFields = [
      "firstName",
      "lastName",
      "jobTitle",
      "email",
      "phone",
      "country",
      "city",
      "summary",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[`personalInfo.${field}`] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: updates },
      { new: true },
    ).select("personalInfo updatedAt");

    res.status(200).json({
      message: "Personal info updated successfully",
      personalInfo: updatedResume.personalInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { socialLinks } = req.body;

    if (!Array.isArray(socialLinks)) {
      return res.status(400).json({ message: "socialLinks must be an array" });
    }

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: { socialLinks } }, // ✅ FULL REPLACEMENT
      { new: true },
    ).select("socialLinks");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      message: "Social links updated",
      socialLinks: resume.socialLinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { education } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    if (!Array.isArray(education)) {
      return res.status(400).json({ message: "education must be an array" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // ✅ REPLACE ENTIRE EDUCATION ARRAY
    resume.education = education.map((edu) => ({
      ...edu,
      scoreType: edu.scoreType?.trim().toLowerCase(),
    }));

    await resume.save();

    res.status(200).json({
      message: "Education updated successfully",
      education: resume.education,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { experience } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    if (!Array.isArray(experience) || experience.length === 0) {
      return res.status(400).json({ message: "experience must be an array" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    experience.forEach((exp) => {
      if (exp._id) {
        const index = resume.experience.findIndex(
          (e) => e._id.toString() === exp._id,
        );

        if (index !== -1) {
          resume.experience[index] = {
            ...resume.experience[index].toObject(),
            ...exp,
          };
        }
      } else {
        resume.experience.push(exp);
      }
    });

    await resume.save();

    res.status(200).json({
      message: "Experience updated successfully",
      experience: resume.experience,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSkills = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { skills } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: "skills must be an array" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    skills.forEach((skillBlock) => {
      if (skillBlock._id) {
        const index = resume.skills.findIndex(
          (s) => s._id.toString() === skillBlock._id,
        );

        if (index !== -1) {
          resume.skills[index] = {
            ...resume.skills[index].toObject(),
            ...skillBlock,
          };
        }
      } else {
        resume.skills.push(skillBlock);
      }
    });

    await resume.save();

    res.status(200).json({
      message: "Skills updated successfully",
      skills: resume.skills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

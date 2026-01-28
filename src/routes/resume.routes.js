const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const {
  createResume,
  getMyResumes,
  deleteResume,
  updateTitle,
  updatePersonalInfo,
  getResume,
  updateSocialLinks,
  updateEducation,
  updateExperience,
  updateSkills,
} = require("../controllers/resume.controller");
const upload = require("../middleware/upload");

router.post("/create", createResume);
router.get("/user/:userId", getMyResumes);
router.get("/:resumeId", getResume);
router.delete("/:resumeId", deleteResume);
router.patch("/:resumeId/title", updateTitle);
router.patch(
  "/:resumeId/personal-info",
  upload.single("photo"),
  updatePersonalInfo,
);
router.patch("/:resumeId/social-links", updateSocialLinks);
router.patch("/:resumeId/education", updateEducation);
router.patch("/:resumeId/experience", updateExperience);
router.patch("/:resumeId/skills", updateSkills);

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const {
  createResume,
  updateResume,
  getMyResumes,
} = require("../controllers/resume.controller");

router.post("/", auth, createResume);
router.put("/:id", auth, updateResume);
router.get("/", auth, getMyResumes);

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const {
  createResume,
  updateResume,
  getMyResumes,
} = require("../controllers/resume.controller");

router.post("/create", auth, createResume);
router.put("/update/:id", auth, updateResume);
router.get("/my", auth, getMyResumes);

module.exports = router;

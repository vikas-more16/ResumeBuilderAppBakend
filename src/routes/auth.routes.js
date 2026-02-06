const express = require("express");
const router = express.Router();
const {
  firebaseAuthLogin,
  firebaseAuthRegister,
} = require("../controllers/auth.controller.js");

router.post("/register", firebaseAuthRegister);
router.post("/login", firebaseAuthLogin);

module.exports = router;

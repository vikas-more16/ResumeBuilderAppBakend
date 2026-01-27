const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");

const firebaseAuthRegister = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const firebaseToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    const { uid, email } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        username: req.body.username || email.split("@")[0],
        phone: req.body.phone || "",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

const firebaseAuthLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const firebaseToken = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const { email, uid } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register first.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        firebaseUid: uid,
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("FIREBASE LOGIN ERROR:", err);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

module.exports = { firebaseAuthRegister, firebaseAuthLogin };

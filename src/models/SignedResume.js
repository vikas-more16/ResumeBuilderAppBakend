const mongoose = require("mongoose");

const signedResumeSchema = new mongoose.Schema({
    resumeId: { type: String, unique: true },
    resumeData: Object,
    signature: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SignedResume", signedResumeSchema);

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  limits: { fileSize: 1 * 1024 * 1024 },
});

module.exports = upload;

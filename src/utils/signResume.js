const crypto = require("crypto");
const fs = require("fs");

const privateKey = fs.readFileSync("./private.pem", "utf8");

function signResume(resumeData) {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(JSON.stringify(resumeData));
    sign.end();

    return sign.sign(privateKey, "base64");
}

module.exports = signResume;

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync("./public.pem",
    "utf8"
);
function verifySignature(resumeData, signature) {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(JSON.stringify(resumeData));
    verify.end();

    return verify.verify(publicKey, signature, "base64");
}

module.exports = verifySignature;

import crypto from "crypto";
import fs from "fs";

const privateKey = fs.readFileSync("./private.pem", "utf8");

export default function signResume(resumeData) {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(JSON.stringify(resumeData));
    sign.end();

    return sign.sign(privateKey, "base64");
}

import crypto from "crypto";
import fs from "fs";

const publicKey = fs.readFileSync("./public.pem", "utf8");

export function verifyResume(resumeData, signature) {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(JSON.stringify(resumeData));
    verify.end();

    return verify.verify(publicKey, signature, "base64");
}

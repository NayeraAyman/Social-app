import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(process.env.PHONE_SECRET_KEY || "", "utf-8");

// encryption
export function encryptPhone(phone: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(phone, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}
// decryption
export function decryptPhone(hash: { iv: string; content: string }) {
  const iv = Buffer.from(hash.iv, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(hash.content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

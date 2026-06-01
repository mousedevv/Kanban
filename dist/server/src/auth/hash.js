import crypto from "crypto";
export function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}
//# sourceMappingURL=hash.js.map
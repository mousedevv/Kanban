import crypto from "crypto";
export class User {
    constructor(username, passwordHash, UUID) {
        this.username = username;
        this.UUID = UUID || crypto.randomUUID();
        this.passwordHash = passwordHash;
    }
}

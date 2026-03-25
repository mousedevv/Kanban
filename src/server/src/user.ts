import crypto from "crypto";

export class User {
    username: string;
    UUID: string;
    passwordHash: string;

    constructor(username: string, passwordHash: string, UUID?: string, ) {
        this.username = username;
        this.UUID = UUID || crypto.randomUUID();
        this.passwordHash = passwordHash;
    }
}
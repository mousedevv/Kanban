export class User {
    username: string;
    UUID: string;
    passwordHash: string;

    constructor(username: string, passwordHash: string, UUID: string) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.UUID = UUID
    }
}
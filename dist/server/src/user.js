export class User {
    constructor(username, passwordHash, UUID) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.UUID = UUID;
    }
}

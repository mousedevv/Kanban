export class User {
    constructor(id, username, passwordHash, UUID) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.UUID = UUID;
    }
}

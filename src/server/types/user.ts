export class User {
    id: number;
    username: string;
    UUID: string;
    passwordHash: string;

    constructor(id: number, username: string, passwordHash: string, UUID: string) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.UUID = UUID
    }
}
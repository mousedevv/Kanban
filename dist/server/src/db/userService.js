import { db } from "../../index.js";
// Users DB functions
export const usersDB = {
    async addUser(user) {
        await db.execute("INSERT INTO users (username, passwordHash, UUID) VALUES (?, ?, ?)", [user.username, user.passwordHash, user.UUID]);
    },
    // const [user] = await db.execute<userRow[]>("SELECT * FROM users WHERE ", []);
    async findUserByUsername(username) {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0];
    }
};

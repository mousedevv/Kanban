import { db } from "../../index.js";
import { hashPassword } from "../auth/hash.js";
// Users DB functions
export const DBUsersService = {
    // Add user to DB
    async addUser(user) {
        const [rows] = await db.execute("INSERT INTO users (username, passwordHash, UUID) VALUES (?, ?, ?)", [user.username, user.passwordHash, user.UUID]);
        // Return new user ID from db
        return rows.insertId;
    },
    // Verify user (compare passwords)
    async verifyUser(user, password) {
        const [rows] = await db.execute("SELECT * FROM users WHERE UUID = ?", [user.UUID]);
        if (rows[0].passwordHash === hashPassword(password))
            return user;
    },
    // Generate UUID safely - no duplicates
    async generateUUID() {
        while (true) {
            const UUID = crypto.randomUUID();
            const [rows] = await db.execute("SELECT * FROM users WHERE UUID = ?", [UUID]);
            if (!rows[0] || rows[0].length === 0)
                return UUID;
        }
    },
    async findUserByUsername(username) {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0] || undefined;
    }
};
//# sourceMappingURL=usersService.js.map
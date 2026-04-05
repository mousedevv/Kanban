import { db } from "../../index.js";

import { User } from "../../types/user.js";
import { userRow } from "../../types/types.js";
import { hashPassword } from "../auth/hash.js";

// Users DB functions
export const DBUsersService = {
    // Add user to DB
    async addUser(user: User) {
        await db.execute(
            "INSERT INTO users (username, passwordHash, UUID) VALUES (?, ?, ?)",
            [user.username, user.passwordHash, user.UUID]
        );
    },

    // Verify user (compare passwords)
    async verifyUser(user: User, password: string): Promise<void | User> {
        const [rows] = await db.execute<userRow[]>(
            "SELECT * FROM users WHERE UUID = ?", [user.UUID]
        );

        if (rows[0].passwordHash === hashPassword(password)) return user;
    },

    // Generate UUID safely - no duplicates
    async generateUUID(): Promise<string> {
        while (true) {
            const UUID = crypto.randomUUID();
            const [rows] = await db.execute<userRow[]>(
                "SELECT * FROM users WHERE UUID = ?", [UUID]
            );
            if (rows[0].length === 0) return UUID;
        }
    },

    async findUserByUsername(username: string): Promise<void | User> {
        const [rows] = await db.execute<userRow[]>(
            "SELECT * FROM users WHERE username = ?", [username]
        );

        return rows[0] || undefined;
    }
}


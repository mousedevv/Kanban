import { db } from "../../index.js";
export async function findUserByUsername(username) {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
}

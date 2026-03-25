import fs from "fs";
import path from "path";
import { User } from "../user.js";
export async function loadUsers() {
    const data = fs.readFileSync(path.join(__dirname, "./data/users.json"));
    const users = [];
    if (!data)
        return;
    const usersFileParsed = await JSON.parse(data);
    usersFileParsed.forEach((user) => {
        users.push(new User(user.username, user.UUID, user.passwordHash));
    });
    return users;
}

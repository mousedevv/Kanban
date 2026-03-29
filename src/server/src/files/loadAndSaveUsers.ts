import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { User } from "../user.js";
import { users } from "../../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadUsers(): User[] | void  {
    const data = fs.readFileSync(path.join(__dirname, "../../data/users.json")) as unknown as string;
    const users: User[] = [];

    if (!data) return;

    const usersFileParsed = JSON.parse(data);
    
    usersFileParsed.forEach((user: User) => {
        users.push(new User(user.username, user.passwordHash, user.UUID));
    });

    return users;
}

export function saveUsers(): void {
    fs.writeFileSync(path.join(__dirname, "../../data/users.json"), JSON.stringify(users));
}
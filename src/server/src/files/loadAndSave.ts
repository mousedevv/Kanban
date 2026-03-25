import fs from "fs";
import path from "path";

import { User } from "../user.js";

import { users } from "../../index.js";

export function loadUsers(): User[] | void  {
    const data = fs.readFileSync(path.join(__dirname, "./data/users.json")) as unknown as string;
    const users: User[] = [];

    if (!data) return;

    const usersFileParsed = JSON.parse(data);
    
    usersFileParsed.forEach((user: User) => {
        users.push(new User(user.username, user.UUID, user.passwordHash));
    });

    return users;
}

export function saveUsers(): void {
    fs.writeFileSync(path.join(__dirname, "../../data/users.json"), JSON.stringify(users));
}
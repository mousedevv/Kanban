import { User } from "../user.js";
import { hashPassword } from "../auth/hash.js";
import { saveUsers } from "../files/loadAndSaveUsers.js";
import { users } from "../../index.js";
export function register(username, password) {
    if (!username || !password)
        throw new Error("Missing username or password");
    // TODO
    // Do it using username (findUserByUsername)
    // const existingUser = findUserByPassword(password);
    // if (existingUser) throw new Error("User already exists");
    const user = new User(username, hashPassword(password));
    users.push(user);
    saveUsers();
    return user;
}

import { User } from "../user.js";
import { users } from "../../index.js";
import { hashPassword } from "../auth/hash.js";

export function findUserByPassword(password: string): User | void {
    return users.find((user: User) => user.passwordHash === hashPassword(password));
}
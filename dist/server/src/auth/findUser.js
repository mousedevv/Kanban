import { users } from "../../index.js";
import { hashPassword } from "../auth/hash.js";
export function findUserByPassword(password) {
    return users.find((user) => user.passwordHash === hashPassword(password));
}

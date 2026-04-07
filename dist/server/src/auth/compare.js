import { hashPassword } from "./hash";
export function verifyPassword(password, user) {
    return user.passwordHash === hashPassword(password);
}

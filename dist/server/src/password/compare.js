import { hashPassword } from "./hash";
export function comparePassword(password, passwordHash) {
    return passwordHash === hashPassword(password);
}

import { hashPassword } from "./hash";

export function comparePassword(password: string, passwordHash: string): boolean {
    return passwordHash === hashPassword(password);
}
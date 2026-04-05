import { User } from "../../types/user.js";
import { hashPassword } from "../auth/hash.js";
import { DBUsersService } from "../db/usersService.js";

const USERNAME_REGEX = /^(?=.*[A-Za-z]).{3,20}$/;
const PASSWORD_REGEX = /^\S{8,}$/;

export async function register(username: string, password: string): Promise<User> {
    if (!username || !password) throw new Error("MISSING_DATA");
    else if (await DBUsersService.findUserByUsername(username)) throw new Error("USER_ALREADY_EXISTS");
    else if (!USERNAME_REGEX.test(username)) throw new Error("REGEX_INVALID_USERNAME");
    else if (!PASSWORD_REGEX.test(password)) throw new Error("REGEX_INVALID_PASSWORD");

    const user = new User(username, hashPassword(password));

    await DBUsersService.addUser(user);

    return user;
}
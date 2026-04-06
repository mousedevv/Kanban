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

    const UUID = await DBUsersService.generateUUID();
    // - 1 is a dummy id (id is generated using MySQL AUTO_INCREMENT) (id required on type User)
    const user = new User(-1, username, hashPassword(password), UUID);

    const dbUserId = await DBUsersService.addUser(user);

    // Replace dummy id with id from MySQL AUTO_INCREMENT
    user.id = dbUserId;

    return user;
}
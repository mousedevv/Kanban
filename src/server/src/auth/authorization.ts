import { DBUsersService } from "../db/usersDB.js";
import { User } from "../user.js";

export async function authorize(username: string, password: string): Promise<void | User> {
    const user = await DBUsersService.findUserByUsername(username);
    if (!user) return;
    
    const authorized = await DBUsersService.verifyUser(user, password)
    if (authorized) return user;
}
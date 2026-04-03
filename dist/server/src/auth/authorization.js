import { DBUsersService } from "../db/usersDB.js";
export async function authorize(username, password) {
    const user = await DBUsersService.findUserByUsername(username);
    if (!user)
        return;
    const authorized = await DBUsersService.verifyUser(user, password);
    if (authorized)
        return user;
}

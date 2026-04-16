import { DBUsersService } from "../db/usersService.js";
export async function authorize(username, password) {
    const user = await DBUsersService.findUserByUsername(username);
    if (!user)
        return;
    const authorized = await DBUsersService.verifyUser(user, password);
    if (authorized)
        return user;
}
//# sourceMappingURL=authorization.js.map
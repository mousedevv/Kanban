import { DBProjectsService } from "../db/projectsService.js";
export async function verifyUserProjectPermissions(req, res, next) {
    if (!req.session.user)
        return res.sendStatus(403);
    try {
        await DBProjectsService.authorizeProjectAccess(req.session.user, req.body.project_id);
        next();
    }
    catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}
//# sourceMappingURL=verifyUserProjectPermissions.js.map
import { DBProjectsService } from "../db/projectsService.js";
export const verifyUserProjectPermissions = (operation_on) => {
    return async (req, res, next) => {
        if (!req.session.user)
            return res.sendStatus(403);
        try {
            await DBProjectsService.authorizeProjectAccess(req.session.user, req.body.project_id);
            switch (operation_on) {
                case 'column':
                    // column_id can be provided directly in the body or indirectly through taskDraft (for task creation)
                    await DBProjectsService.authorizeColumnAccess(req.session.user, req.body.project_id, req.body.column_id);
                    break;
                case 'task':
                    await DBProjectsService.authorizeTaskAccess(req.session.user, req.body.project_id, req.body.task_id);
                    break;
                case 'subtask':
                    await DBProjectsService.authorizeSubtaskAccess(req.session.user, req.body.project_id, req.body.subtask_id);
                    break;
                case 'project':
                    // already authorized above
                    break;
                default:
                    const exhaustiveCheck = operation_on;
                    throw new Error(`Invalid operation_on value: ${exhaustiveCheck}`);
            }
            next();
        }
        catch (e) {
            console.error(e);
            return res.sendStatus(403);
        }
    };
};
//# sourceMappingURL=verifyUserProjectPermissions.js.map
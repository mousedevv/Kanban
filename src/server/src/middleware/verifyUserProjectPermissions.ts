import { NextFunction, Request, Response } from "express";
import { DBProjectsService } from "../db/projectsService.js";

type OperationOn = 'project' | 'column' | 'task' | 'subtask';

export const verifyUserProjectPermissions = (operation_on: OperationOn) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.user) return res.sendStatus(403);
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
                    const exhaustiveCheck: never = operation_on;
                    throw new Error(`Invalid operation_on value: ${exhaustiveCheck}`);
            }

            next();
        } catch (e: Error | any) {
            console.error(e);
            return res.sendStatus(403);
        }
    }
}
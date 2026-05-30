import { NextFunction, Request, Response } from "express";
import { DBProjectsService } from "../db/projectsService.js";

export async function verifyUserProjectPermissions(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) return res.sendStatus(403);
    try {
        await DBProjectsService.authorizeProjectAccess(req.session.user, req.body.project_id);
        next();
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(403);
    }
}
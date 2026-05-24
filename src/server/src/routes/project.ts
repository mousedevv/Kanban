import { Router } from "express";

import { DBProjectsService } from "../db/projectsService.js";
import { Project } from "../../types/project.js";
import { Task } from "../../types/task.js";
import { Column } from "../../types/column.js";
import { verifyUserProjectPermissions } from "../middleware/verifyUserProjectPermissions.js";

const router = Router();

router.post('/project/create-project', async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description || "";

        if (!name) return res.sendStatus(400);

        const project: Project = await DBProjectsService.createProject(name, description, req.session.user!);

        return res.json({ project: project });
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post(`/project/add-column`, verifyUserProjectPermissions, async (req, res) => {
    try {
        const col: Column = await DBProjectsService.addColumn({ project_id: req.body.project_id, name: req.body.name });
        return res.json(col);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post(`/project/add-task`, verifyUserProjectPermissions, async (req, res) => {
    try {
        const task: Task = await DBProjectsService.addTask({
            project_id: req.body.project_id,
            column_id: req.body.column_id,
            name: req.body.name,
            description: req.body.description,
            done: req.body.done,
            subtasks: req.body.subtasks

        });
        return res.json(task);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.get(`/project/get-all-projects`, async (req, res) => {
    try {
        const projects = await DBProjectsService.getUserProjectsFormatted(req.session.user!);
        return res.json(projects);
    } catch (e: Error | any) {
        // DEBUG
        // console.log(req.session.user);
        switch (e.message) {
            case "User not found":
                return res.sendStatus(403);
            case "No projects found":
                return res.sendStatus(404);
            default:
                return res.sendStatus(500);
        }
    }
});

export default router;
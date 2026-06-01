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

        return res.json(project);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.put('/project/edit-project', verifyUserProjectPermissions('project'), async (req, res) => {
    try {
        const projectId: number = req.body.project_id;
        const name: string = req.body.name;
        const description: string = req.body.description;
        await DBProjectsService.editProject(projectId, name, description);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.delete('/project/delete-project', verifyUserProjectPermissions('project'), async (req, res) => {
    try {
        const projectId: number = req.body.project_id;
        await DBProjectsService.deleteProject(projectId);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post(`/project/add-column`, verifyUserProjectPermissions('project'), async (req, res) => {
    try {
        const col: Column = await DBProjectsService.addColumn({ project_id: req.body.project_id, name: req.body.name });
        return res.json(col);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.put(`/project/edit-column`, verifyUserProjectPermissions('column'), async (req, res) => {
    try {
        const columnId: number = req.body.column_id;
        const name: string = req.body.name;
        await DBProjectsService.editColumn(columnId, name);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.delete(`/project/delete-column`, verifyUserProjectPermissions('column'), async (req, res) => {
    try {
        const columnId: number = req.body.column_id;
        await DBProjectsService.deleteColumn(columnId);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post(`/project/add-task`, verifyUserProjectPermissions('column'), async (req, res) => {
    try {
        const task: Task = await DBProjectsService.addTask(
            req.body.project_id,
            req.body.column_id,
            req.body.name,
            req.body.description,
            req.body.done || false,
            req.body.subtasks || []
        );
        return res.json(task);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.put(`/project/edit-task`, verifyUserProjectPermissions('task'), async (req, res) => {
    try {
        const taskId: number = req.body.task_id;
        const name: string = req.body.name;
        const description: string = req.body.description;
        const column_id: number = req.body.column_id;
        const done: boolean = req.body.done;
        await DBProjectsService.editTask(taskId, name, description, column_id, done);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.delete(`/project/delete-task`, verifyUserProjectPermissions('task'), async (req, res) => {
    try {
        const taskId: number = req.body.task_id;
        await DBProjectsService.deleteTask(taskId);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post('/project/add-subtask', verifyUserProjectPermissions('task'), async (req, res) => {
    try {
        const taskId: number = req.body.task_id;
        const name: string = req.body.name;
        const done: boolean = req.body.done;
        const subtask = await DBProjectsService.addSubtask(taskId, name, done);
        return res.json(subtask);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.put('/project/edit-subtask', verifyUserProjectPermissions('subtask'), async (req, res) => {
    try {
        const subtaskId: number = req.body.subtask_id;
        const name: string = req.body.name;
        const done: boolean = req.body.done;
        await DBProjectsService.editSubtask(subtaskId, name, done);
        return res.sendStatus(200);
    } catch (e: Error | any) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.delete('/project/delete-subtask', verifyUserProjectPermissions('subtask'), async (req, res) => {
    try {
        const subtaskId: number = req.body.subtask_id;
        await DBProjectsService.deleteSubtask(subtaskId);
        return res.sendStatus(200);
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
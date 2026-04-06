import { Router } from "express";

import { DBProjectsService } from "../db/projectsService.js";
import { Project } from "../../types/project.js";

const router = Router();

router.post('/create-project', async (req, res) => {
    const name = req.body.name;
    const description = req.body.description || "";

    if (!name) return res.sendStatus(400);

    const project: Project = await DBProjectsService.createProject(name, description, req.session.user!);

    return res.json({ project: project });
});

router.get(`/project/:UUID`, async (req, res) => {
    const UUID = req.params.UUID;
    try {
        const project = await DBProjectsService.getProject(req.session.user!, UUID);
        return res.json({ project });
    } catch (e: Error | any) {
        switch (e.message) {
            case "Project not found":
                return res.sendStatus(404);
            case "Forbidden":
                return res.sendStatus(403);
            default:
                return res.sendStatus(500);
        }
    }
});

export default router;
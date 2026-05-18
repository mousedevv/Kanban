import { Router } from "express";
import { DBProjectsService } from "../db/projectsService.js";
const router = Router();
router.post('/project/create-project', async (req, res) => {
    const name = req.body.name;
    const description = req.body.description || "";
    if (!name)
        return res.sendStatus(400);
    const project = await DBProjectsService.createProject(name, description, req.session.user);
    return res.json({ project: project });
});
router.get(`/project/get-all-projects`, async (req, res) => {
    try {
        const projects = await DBProjectsService.getUserProjectsFormatted(req.session.user);
        return res.json(projects);
    }
    catch (e) {
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
router.post(`/project/add-task`, async (req, res) => {
    try {
        const task = DBProjectsService.addTask(req.body);
        return res.json(task);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});
export default router;
//# sourceMappingURL=project.js.map
import { Router } from "express";
import { DBProjectsService } from "../db/projectsService.js";
const router = Router();
router.post('/create-project', async (req, res) => {
    const name = req.body.name;
    const description = req.body.description || "";
    if (!name)
        return res.sendStatus(400);
    const project = await DBProjectsService.createProject(name, description, req.session.user);
    return res.json({ project: project });
});
export default router;

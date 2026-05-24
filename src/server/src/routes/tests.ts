import { Router } from "express";

import { DBProjectsService } from "../db/projectsService.js";

const router = Router();

console.log(`Starting in ${process.env.NODE_ENV} mode...`);

if (process.env.NODE_ENV === 'development') {
    // TEST ENDPOINTS - DEBUG
    router.get('/create-test-session', (req, res) => {
        req.session.user = {
            id: 99999999,
            username: 'test',
            UUID: 'testUUID',
            passwordHash: 'testHash'
        };

        res.send('session set');
    });

    router.get('/check-session', (req, res) => {
        res.json(req.session.user || null);
    });

    router.get('/create-test-project', async (req, res) => {
        try {
            const project = await DBProjectsService.createProject('testName', 'testDescription', req.session.user!);
            return res.json({ project });
        } catch (e: Error | any) {
            console.error(e);
            return res.sendStatus(500);
        }
    });
}

export default router;
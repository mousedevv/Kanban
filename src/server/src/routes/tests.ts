import { Router } from "express";
// import dotenv from 'dotenv';
// import path from "path";
// import { dirname } from "path";
// import { fileURLToPath } from "url";

import { DBProjectsService } from "../db/projectsService.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const router = Router();

// DEBUG
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    // TEST ENDPOINTS - DEBUG - REMOVE AFTER
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
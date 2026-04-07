import { Router } from "express";
const router = Router();
// only for development
if (process.env.NODE_ENV === 'development') {
    // TEST ENDPOINTS - DEBUG - REMOVE AFTER
    app.get('/api/create-test-session', (req, res) => {
        req.session.user = {
            id: 99999999,
            username: 'test',
            UUID: 'testUUID',
            passwordHash: 'testHash'
        };
        res.send('session set');
    });
    app.get('/api/check-session', (req, res) => {
        res.json(req.session.user || null);
    });
    app.get('/api/create-test-project', async (req, res) => {
        try {
            const project = await DBProjectsService.createProject('testName', 'testDescription', req.session.user);
            return res.json({ project });
        }
        catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    });
}
// only for development
if (process.env.NODE_ENV === 'development') {
    // TEST ENDPOINTS - DEBUG - REMOVE AFTER
    app.get('/api/create-test-session', (req, res) => {
        req.session.user = {
            id: 99999999,
            username: 'test',
            UUID: 'testUUID',
            passwordHash: 'testHash'
        };
        res.send('session set');
    });
    app.get('/api/check-session', (req, res) => {
        res.json(req.session.user || null);
    });
    app.get('/api/create-test-project', async (req, res) => {
        try {
            const project = await DBProjectsService.createProject('testName', 'testDescription', req.session.user);
            return res.json({ project });
        }
        catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    });
}
export default router;

import { Router } from "express";
import { DBProjectsService } from "../db/projectsService.js";
const router = Router();
console.log('[TEST] Tests router initialized');
if (process.env.NODE_ENV === 'development') {
    console.log('[TEST] Defining test routes');
    // TEST ENDPOINTS - DEBUG - REMOVE AFTER
    router.get('/test-create-session', (req, res) => {
        console.log('[TEST] Create test session route called');
        console.log('[TEST] Creating test session');
        req.session.user = {
            id: 99999999,
            username: 'test',
            UUID: 'testUUID',
            passwordHash: 'testHash'
        };
        req.session.save((err) => {
            if (err) {
                console.error('[TEST] Session save error:', err);
                return res.status(500).send('Session save failed');
            }
            console.log('[TEST] Session saved successfully');
            res.send('session set');
        });
    });
    router.get('/check-session', (req, res) => {
        res.json(req.session.user || null);
    });
    router.get('/create-test-project', async (req, res) => {
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
//# sourceMappingURL=tests.js.map
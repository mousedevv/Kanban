import { Router } from "express";

import { loginLimiter } from "../middleware/loginLimiter.js";
import { register } from "../utils/register.js";
import { authorize } from "../auth/authorization.js";

const router = Router();

router.post("/register", loginLimiter, async (req, res) => {
    try {
        const user = await register(req.body.username, req.body.password);
        req.session.user = user;
        console.log("[HTTP /api/register] User registered:", user);
        return res.json(
            {
                user: { username: user.username, UUID: user.UUID },
            }
        );
    } catch (e: Error | any) {
        switch (e.message) {
            case "MISSING_DATA":
            case "REGEX_INVALID_USERNAME":
            case "REGEX_INVALID_PASSWORD":
                return res.sendStatus(400);
            case "USER_ALREADY_EXISTS":
                return res.sendStatus(409);
            default:
                console.error(e);
                return res.sendStatus(500);
        }
    }
});

router.post("/login", loginLimiter, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const authorizedUser = await authorize(username, password);

    if (!authorizedUser) return res.sendStatus(403);

    req.session.user = authorizedUser;

    console.log("[HTTP /api/login] User logged in:", authorizedUser);

    return res.json(
        {
            user: { username: authorizedUser.username, UUID: authorizedUser.UUID },
        }
    );
});

router.get('/logout', (req, res) => {
    // Log user before destroying session
    console.log("[HTTP /api/logout] User logged out:", req.session.user);

    // @ts-ignore
    // remove session from database
    req.session.destroy();

    // clear client cookie
    res.clearCookie('connect.sid');

    return res.json("session destroyed");
});

export default router;
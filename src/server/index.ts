import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import mysql2 from "mysql2/promise";
import rateLimit from "express-rate-limit";

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { User } from "./types/user.js";
import { Project } from "./types/project.js";
import { DBUsersService } from "./src/db/usersService.js";
import { DBProjectsService } from './src/db/projectsService.js';
import { hashPassword } from "./src/auth/hash.js";
import { register } from "./src/utils/register.js";
import { authorize } from "./src/auth/authorization.js";

import { initSessionMiddleware } from "./src/init/session.js";

export let test: string[] = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PUBLIC_PATH = path.join(__dirname, "../public");
const PUBLIC_PATHS = [
    '/welcome',
    '/assets',
    '/errors',
    '/favicon.ico',
    "/auth",
    "/cookiesUtils",
    "/utils",
    "/api/register",
    "/api/login",
    "/api/ping",
    // DEBUG - REMOVE AFTER
    "/api/create-test-session",
];

const SKIPPED_PATHS_WHEN_LOGGED_IN = [
    '/welcome',
    '/auth',
];

const URL = process.env.URL;
const PORT = process.env.PORT;

export const app = express();

// Initialize app.use(session()) middleware instantly after server starts
// (session middleware)
app.use(initSessionMiddleware());

app.use(cors({
    origin: `${URL}:${PORT}`,
    credentials: true
}));

app.use(express.json());

// Limit login attempts - maximum of 10 attempts in 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,  // only 10 attempts to log in in 15 minutes
    handler: (req, res) => {
        res.sendStatus(429);
    }
});

// Authentication middleware
app.use((req, res, next) => {
    // Check if the request route is public
    const isPublic = PUBLIC_PATHS.some((path) => req.path.startsWith(path));

    // Errors handling

    // If user is logged in and trying to access a public route, redirect to /home
    if (req.session.user && SKIPPED_PATHS_WHEN_LOGGED_IN.some((path) => req.path.startsWith(path))) {
        return res.redirect('/home');
    }

    // FIX: Prevent 404 error on / path
    if (req.path === "/") {
        return res.redirect('/home');
    }

    // If user is not logged in and trying to access /home, redirect to /welcome
    if (!req.session.user && req.path.startsWith('/home')) {
        return res.redirect('/welcome');
    }

    // If page does not exist and it's not api, redirect to 404 error
    if (
        !fs.existsSync(path.join(__dirname, `../public${req.path}`)) &&
        !req.path.startsWith("/api")
    ) {
        return res.redirect('/errors/404');
    }

    // If user is not logged in and trying to access a secured route, redirect to 403 FORBIDDEN page error
    if (!req.session.user && !isPublic) {
        return res.redirect('/errors/403');
    }

    next();
});

// Serve static files
app.use(express.static(PUBLIC_PATH));

// Connect to database
export const db = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

async function testDB() {
    try {
        await db.query('SELECT 1 AS test');
        console.log('[MySQL] Connected to DB successfully.');
    } catch (e: Error | any) {
        throw new Error(`[MySQL] Fatal Error`);
    }
}

testDB();

// only for development
if (process.env.NODE_ENV === 'development') {
    // TEST ENDPOINTS - DEBUG - REMOVE AFTER
    app.get('/api/create-test-session', (req, res) => {
        req.session.user = {
            username: 'test',
            UUID: 'testUUID',
            passwordHash: 'testHash'
        };

        res.send('session set');
    });

    app.get('/api/check-session', (req, res) => {
        res.json(req.session.user || null);
    });
}

app.post("/api/register", loginLimiter, async (req, res) => {
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
        }
    }
});

app.post("/api/login", loginLimiter, async (req, res) => {
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

app.get('/api/logout', (req, res) => {
    // Log user before destroying session
    console.log("[HTTP /api/logout] User logged out:", req.session.user);

    // @ts-ignore
    // remove session from database
    req.session.destroy();

    // clear client cookie
    res.clearCookie('connect.sid');

    return res.json("session destroyed");
});

app.post('/api/create-project', async (req, res) => {
    const name = req.body.name;
    const description = req.body.description || "";

    if (!name) return res.sendStatus(400);

    const project: Project = await DBProjectsService.createProject(name, description);

    return res.json({project: project});
});

app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
});

// Expose commonly used variables to console for debugging #DEBUG #DEV #REMOVEAFTER
(globalThis as any).register = register;
(globalThis as any).__dirname = __dirname;
(globalThis as any).path = path;
(globalThis as any).fs = fs;
(globalThis as any).hashPassword = hashPassword;
(globalThis as any).authorize = authorize;
(globalThis as any).db = db;
(globalThis as any).test = test;
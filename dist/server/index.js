import "dotenv/config";
import express from "express";
import mysql2 from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
// Tests
import { testDB } from "./src/db/test.js";
// Authorization utils
import { hashPassword } from "./src/auth/hash.js";
import { register } from "./src/utils/register.js";
import { authorize } from "./src/auth/authorization.js";
// Routers
import authRouter from "./src/routes/auth.js";
import projectRouter from "./src/routes/project.js";
import testsRouter from "./src/routes/tests.js";
import { initSessionMiddleware } from "./src/init/session.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
// const URL = process.env.URL;
const PORT = process.env.PORT;
export const app = express();
// Fix proxy connections
app.set("trust proxy", 1);
// Initialize app.use(session()) middleware instantly after server starts
// (session middleware)
app.use(initSessionMiddleware());
app.use(express.json());
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
    if (!fs.existsSync(path.join(__dirname, `../public${req.path}`)) &&
        !req.path.startsWith("/api")) {
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
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10
});
await testDB();
// only for development - TEST FOR DEVELOPMENT - REMOVE AFTER
if (process.env.NODE_ENV === 'development') {
    app.use('/api', testsRouter);
}
// API Routes
app.use('/api', authRouter);
app.use('/api', projectRouter);
app.use('/api', testsRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Expose commonly used variables to console for debugging #DEBUG #DEV #REMOVE AFTER
globalThis.register = register;
globalThis.__dirname = __dirname;
globalThis.path = path;
globalThis.fs = fs;
globalThis.hashPassword = hashPassword;
globalThis.authorize = authorize;
globalThis.db = db;
//# sourceMappingURL=index.js.map
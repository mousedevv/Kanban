import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { loadUsers } from "./src/files/loadAndSaveUsers.js";
import { findUserByPassword } from "./src/auth/findUser.js";
import { register } from "./src/utils/register.js";
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
    "/register"
];
const URL = process.env.URL;
const PORT = process.env.PORT;
const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
}));
app.use(cors({
    origin: `${URL}:${PORT}`,
    credentials: true
}));
app.use(express.json());
// Authentication middleware
app.use((req, res, next) => {
    // Check if the request route is public
    const isPublic = PUBLIC_PATHS.some((path) => req.path.startsWith(path));
    // const isPublic =
    //     req.path.startsWith('/welcome') ||
    //     req.path.startsWith('/assets') ||
    //     req.path.startsWith('/errors') ||
    //     req.path === '/favicon.ico';
    // Errors handling
    // If user is not logged in and trying to access /home, redirect to /welcome
    if ((!req.session || !req.session.user) && req.path.startsWith('/home')) {
        return res.redirect('/welcome');
    }
    // If page does not exist, redirect to 404 error
    if (!fs.existsSync(path.join(__dirname, `../public${req.path}`))) {
        return res.redirect('/errors/404');
    }
    // If user is not logged in and trying to access a secured route, redirect to 403 FORBIDDEN page error
    if ((!req.session || !req.session.user) && !isPublic) {
        return res.redirect('/errors/403');
    }
    next();
});
// Serve static files
app.use(express.static(PUBLIC_PATH));
export let users = [];
app.post("/register", (req, res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400);
    try {
        const user = register(req.body.username, req.body.password);
        res.json({ user: user, ok: true });
    }
    catch (e) {
    }
});
app.post("/login", (req, res) => {
    const password = req.body.password;
    const user = findUserByPassword(password);
    if (!user)
        return res.status(403);
    req.session.user = user;
    return res.json({ user: user, ok: true });
});
app.post('/logout', (req, res) => {
    // @ts-ignore
    req.session.destroy(); // remove user session
    res.json({ ok: true });
});
app.listen(PORT, () => {
    const loadedState = loadUsers();
    if (!loadedState)
        users = [];
    users = loadedState;
    // DEBUG - REMOVE AFTER
    console.log(users);
    console.log(`Server running on port ${PORT}`);
});
// Expose commonly used variables to console for debugging
globalThis.users = users;
globalThis.loadUsers = loadUsers;
globalThis.findUserByPassword = findUserByPassword;
globalThis.register = register;
globalThis.__dirname = __dirname;
globalThis.path = path;
globalThis.fs = fs;

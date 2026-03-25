const URL = "localhost";
const PORT = 5000;

// console.log(require('crypto').randomBytes(32).toString('hex'))

import express from "express";
import cors from "cors";
import session from "express-session";

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { loadUsers } from "./src/files/loadAndSave.js";

import { User } from "./src/user.js";

import { findUserByPassword } from "./src/auth/findUser.js";

import { register } from "./src/utils/register.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const publicPath = path.join(__dirname, "../public");

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET!,
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

app.use(express.static(publicPath));

export let users: User[] = [];

app.post("/register", (req, res) => {
    if (!req.body.username || !req.body.password) return res.status(400);

    // require('crypto').randomBytes(32).toString('hex')
    try {

    } catch (e) {

    }
});

app.post("/login", (req, res) => {
    const password = req.body.password;

    const user = findUserByPassword(password);

    if (!user) return res.status(403);

    req.session.user = user;

    return res.json({ user: user, ok: true });
});

// EXAMPLES
// // dowolny route — req.session już działa
// app.post('/login', (req, res) => {
//   req.session.userId = 42;   // zapis
//   res.json({ ok: true });
// });

// app.get('/profil', (req, res) => {
//   console.log(req.session.userId);  // odczyt → 42
// });

app.post('/logout', (req, res) => {
    // @ts-ignore
    req.session.destroy();  // kasowanie
    res.json({ ok: true });
});

app.listen(PORT, (): void => {
    const loadedState = loadUsers();

    if (!loadedState) users = [];

    users = loadedState!;

    // DEBUG - REMOVE AFTER
    console.log(users);

    console.log(`Server running on port ${PORT}`);
});
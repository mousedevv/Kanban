import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { app } from '../../index.js';
const OPTIONS = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore(OPTIONS);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        // Secure only work on HTTPS
        secure: (process.env.NODE_ENV === 'production') ? true : false,
        sameSite: 'strict',
        // 14 days
        maxAge: 14 * 24 * 60 * 60 * 1000
    }
}));
console.log("test");

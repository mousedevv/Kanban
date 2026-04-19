import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';

const MySQLStore = MySQLStoreFactory(session);

export function initSessionMiddleware() {
    const OPTIONS = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: Number(process.env.DB_PORT),
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    };

    const sessionStore = new MySQLStore(OPTIONS);

    sessionStore.on('ready', () => {
        console.log('[SESSION] MySQL session store is ready');
    });

    sessionStore.on('error', (error) => {
        console.error('[SESSION] MySQL session store error:', error);
    });

    return session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            // Secure only work on HTTPS
            secure: (process.env.NODE_ENV === 'production')? true : false,
            sameSite: (process.env.NODE_ENV === 'production') ? 'none' : 'lax',
            // 14 days
            maxAge: 14 * 24 * 60 * 60 * 1000
        }
    })
}   

// Initialize app.use(session()) middleware instantly after server starts
export default {};
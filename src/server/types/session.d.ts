import 'express-session';
import { User } from "../src/user.js";

declare module 'express-session' {
    interface SessionData {
        user: User;
    }
}
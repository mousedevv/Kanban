import 'express-session';
import { User } from "./user.js";

declare module 'express-session' {
    interface SessionData {
        user: User;
    }
}
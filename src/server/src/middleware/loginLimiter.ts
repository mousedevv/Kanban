import rateLimit from "express-rate-limit";

// Limit login attempts - maximum of 10 attempts in 15 minutes
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    handler: (req, res) => {
        res.sendStatus(429);
    }
});
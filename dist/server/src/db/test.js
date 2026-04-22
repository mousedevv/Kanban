import { db } from '../../index.js';
export async function testDB() {
    try {
        await db.query('SELECT 1 AS test');
        console.log('[MySQL] Connected to DB successfully.');
    }
    catch (e) {
        console.log(e);
        throw new Error(`[MySQL] Fatal Error`);
    }
}
//# sourceMappingURL=test.js.map
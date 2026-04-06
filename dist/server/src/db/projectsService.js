import { db } from "../../index.js";
import { Project } from "../../types/project.js";
export const DBProjectsService = {
    async generateUUID() {
        while (true) {
            const UUID = crypto.randomUUID();
            const [rows] = await db.execute(`SELECT * FROM projects WHERE UUID = ?`, [UUID]);
            if (!rows[0] || rows[0].length === 0)
                return UUID;
        }
    },
    async authorizeProjectAccess(user, projectUUID) {
        const [rows] = await db.execute(`SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?`, [user.id, projectUUID]);
        if (rows[0].length > 0)
            return rows[0].role;
        else
            throw new Error("Forbidden");
    },
    async createProject(name, description, user) {
        const UUID = await this.generateUUID();
        const [rows1] = await db.execute('INSERT INTO projects (`UUID`, `name`, `description`) VALUES (?, ?, ?)', [UUID, name, description]);
        // Extract project AUTO_INCREMENT id to insert into user_projects
        const projectId = rows1.insertId;
        const [rows2] = await db.execute('INSERT INTO user_projects (`project_id`, `role`, `user_id`) VALUES (?, ?, ?)', [projectId, "owner", user.id]);
        return new Project(name, description, UUID);
    },
    async getProject(user, UUID) {
        const role = await this.authorizeProjectAccess(user, UUID);
        const [rows] = await db.execute(`SELECT * FROM projects WHERE UUID = ?`, [UUID]);
        if (!rows[0] || rows[0].length === 0) {
            throw new Error("Project not found");
        }
        return rows[0];
    }
};

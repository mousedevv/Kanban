import { userRow } from "../../types/types";
import { db } from "../../index.js";
import { Project } from "../../types/project";

export const DBProjectsService = {
    async generateUUID(): Promise<string> {
            while (true) {
                const UUID = crypto.randomUUID();
                const [rows] = await db.execute<userRow[]>(
                    "SELECT * FROM projects WHERE UUID = ?", [UUID]
                );
                if (rows[0].length === 0) return UUID;
            }
        },

    async createProject(name: string, description: string) {
        const UUID = await this.generateUUID();

        const [rows] = await db.execute(
            'INSERT INTO projects ("UUID", "name", "description") VALUES (?, ?, ?)',
            [UUID, name, description]
        );

        return new Project(name, description, UUID);
    }
}
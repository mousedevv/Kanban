import { userRow, projectRow, userProjectsRow } from "../../types/types.js";
import { ResultSetHeader } from "mysql2";
import { db } from "../../index.js";
import { Project} from "../../types/project.js";
import { Column } from "../../types/column.js";
import { User } from "../../types/user.js";

import { getColumns } from "./getters.js";

export const DBProjectsService = {
    async generateUUID(): Promise<string> {
        while (true) {
            const UUID = crypto.randomUUID();
            const [rows] = await db.execute<userRow[]>(
                `SELECT * FROM projects WHERE UUID = ?`, [UUID]
            );

            if (!rows[0] || rows[0].length === 0) return UUID;
        }
    },

    // DEPRECATED
    // async authorizeProjectAccess(user: User, projectUUID: string) {
    //     const [rows] = await db.execute<userRow[]>(
    //         `SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?`, [user.id, projectUUID]
    //     );

    //     if (rows[0].length > 0) return rows[0].role;
    //     else throw new Error("Forbidden");
    // },

    async createProject(name: string, description: string, user: User) {
        const UUID = await this.generateUUID();

        const [rows1] = await db.execute<ResultSetHeader>(
            'INSERT INTO projects (`UUID`, `name`, `description`) VALUES (?, ?, ?)',
            [UUID, name, description]
        );

        const [projectRow] = await db.execute<projectRow[]>(
            'SELECT * FROM projects WHERE UUID = ?',
            [UUID]
        )

        const id = projectRow[0].id;
        const created_at = projectRow[0].created_at;
        const columns: Column[] = [];

        const [rows2] = await db.execute(
            'INSERT INTO user_projects (`project_id`, `role`, `user_id`) VALUES (?, ?, ?)',
            [id, "owner", user.id]
        );

        return new Project(id, UUID, name, description, created_at, columns);
    },

    // DEPRECATED
    // async getProject(user: User, UUID: string) {
    //     const role = await this.authorizeProjectAccess(user, UUID);

    //     const [rows] = await db.execute<projectRow[]>(`SELECT * FROM projects WHERE UUID = ?`, [UUID]);

    //     if (!rows[0] || rows[0].length === 0) {
    //         throw new Error("Project not found");
    //     }

    //     return rows[0];
    // },

    async getUserProjectsFormatted(user: User) {
        const [rows1] = await db.execute<userRow[]>(`SELECT * FROM users WHERE UUID = ?`, [user.UUID]);
        const [rows2] = await db.execute<userProjectsRow[]>(`SELECT * FROM user_projects WHERE user_id = ?`, [user.id]);

        if (!rows1[0] || rows1[0].length === 0) {
            throw new Error("User not found");
        } else if (!rows2 || rows2.length === 0) {
            throw new Error("No projects found");
        }

        const projectIds = rows2.map((row: userProjectsRow) => row.project_id);

        // Generate safe SQL placeholder instead of putting projectIds directly
        // Example: [1, 24, 366] -> "?, ?, ?"
        const queryIdsPlaceholder = projectIds.map(() => "?").join(",");

        const [rows3] = await db.execute<projectRow[]>(
            `SELECT * FROM projects WHERE id IN (${queryIdsPlaceholder})`, 
            projectIds
        );
        
        const formattedProjects = [];

        for (const row of rows3) {
            const project = new Project(
                row.id,
                row.UUID,
                row.name,
                row.description,
                row.created_at,
                []
            );

            project.columns = await getColumns(project);

            formattedProjects.push(project);
        }

        // Get projects user roles
        const roles = rows2.map((row: userProjectsRow) => row.role);

        return [formattedProjects, roles];
    },
}
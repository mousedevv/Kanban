import { userRow, projectRow, userProjectsRow, taskRow } from "../../types/types.js";
import { ResultSetHeader } from "mysql2";
import { db } from "../../index.js";
import { Project } from "../../types/project.js";
import { Column } from "../../types/column.js";
import { User } from "../../types/user.js";

import { getColumns } from "./getters.js";
import { TaskDraft } from "../../../public/home/src/types/task.js";
import { ColumnDraft } from "../../../public/home/src/types/column.js";
import { Task } from "../../types/task.js";
import { Subtask } from "../../types/subtask.js";
import { ProjectRole } from "../../../public/home/src/types/types.js";

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

    async addColumn(columnDraft: ColumnDraft) {
        const [rows] = await db.execute<ResultSetHeader>(
            "INSERT INTO `columns`(`project_id`, `name`) VALUES (?, ?)",
            [columnDraft.project_id, columnDraft.name]
        );

        return new Column(rows.insertId, columnDraft.project_id, columnDraft.name, []);
    },

    async addTask(taskDraft: TaskDraft): Promise<Task> {
        console.log(taskDraft);
        // Add task
        const [rows] = await db.execute<ResultSetHeader>(
            "INSERT INTO `tasks`(`project_id`, `column_id`, `name`, `description`, `done`) VALUES (?, ?, ?, ?, ?)",
            [
                taskDraft.project_id,
                taskDraft.column_id,
                taskDraft.name,
                taskDraft.description,
                // taskDraft.label_id,
                taskDraft.done
            ]
        );

        // Extract created_at property created by MySQL
        const [rows2] = await db.execute<taskRow[]>(
            "SELECT * FROM `tasks` WHERE id = ?",
            [rows.insertId]
        );

        if (!rows2[0]) throw new Error("Task not found");

        const subtasks: Subtask[] = [];

        for (const subtaskDraft of taskDraft.subtasks) {
            // Add every subtask
            const [rows3] = await db.execute<ResultSetHeader>(
                "INSERT INTO `subtasks`(`task_id`, `name`, `done`) VALUES (?, ?, ?)",
                [rows2[0].id, subtaskDraft.name, subtaskDraft.done]
            );

            // Extract created_at property created by MySQL
            const [rows4] = await db.execute<taskRow[]>(
                "SELECT * FROM `subtasks` WHERE id = ?",
                [rows3.insertId]
            );

            if (!rows4[0]) throw new Error("Subtask not found");

            subtasks.push(
                new Subtask(
                    rows3.insertId,
                    rows2[0].id,
                    subtaskDraft.name,
                    subtaskDraft.done,
                    rows4[0].created_at
                )
            );
        }

        return new Task(
            rows2[0].id, 
            rows2[0].project_id, 
            rows2[0].column_id, 
            rows2[0].name, 
            rows2[0].description, 
            rows2[0].done, 
            rows2[0].label_id, 
            rows2[0].created_at,
            subtasks
        );
    },

    async authorizeProjectAccess(user: User, projectId: string): Promise<ProjectRole> {
        const [rows] = await db.execute<userRow[]>(
            `SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?`, [user.id, projectId]
        );

        if (!rows[0]) throw new Error("Forbidden");

        return rows[0].role;
    },

    async createProject(name: string, description: string, user: User): Promise<Project> {
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

    async getUserProjectsFormatted(user: User): Promise<Project[]> {
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
        // DEPRECATED
        // const roles = rows2.map((row: userProjectsRow) => row.role);

        return formattedProjects;
    },
}
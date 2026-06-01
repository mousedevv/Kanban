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
import { SubtaskDraft } from "../../../public/home/src/types/subtask.js";

export const DBProjectsService = {
    // Generate safe uuid that doesn't exist in the database for project
    async generateUUID(): Promise<string> {
        while (true) {
            const UUID = crypto.randomUUID();
            const [rows] = await db.execute<userRow[]>(
                `SELECT * FROM projects WHERE UUID = ?`, [UUID]
            );

            if (!rows[0] || rows[0].length === 0) return UUID;
        }
    },

    // COLUMNS
    async addColumn(columnDraft: ColumnDraft) {
        const [rows] = await db.execute<ResultSetHeader>(
            "INSERT INTO `columns`(`project_id`, `name`) VALUES (?, ?)",
            [columnDraft.project_id, columnDraft.name]
        );

        return new Column(rows.insertId, columnDraft.project_id, columnDraft.name, []);
    },

    async editColumn(columnId: number, name: string) {
        // Check if column exists
        await this.getColumnById(columnId);

        await db.execute(
            "UPDATE `columns` SET `name` = ? WHERE id = ?",
            [name, columnId]
        );
    },

    async deleteColumn(columnId: number) {
        // Check if column exists
        await this.getColumnById(columnId);

        await db.execute(
            "DELETE FROM `columns` WHERE id = ?",
            [columnId]
        );
    },

    async getColumnById(columnId: number): Promise<Column> {
        const [rows] = await db.execute<projectRow[]>(
            "SELECT * FROM `columns` WHERE id = ?",
            [columnId]
        );

        if (!rows[0]) throw new Error("Column not found");

        return new Column(rows[0].id, rows[0].project_id, rows[0].name, []);
    },

    async authorizeColumnAccess(user: User, projectId: number, columnId: number) {
        const col = await this.getColumnById(columnId);

        if (col.project_id !== projectId) throw new Error("Forbidden");
    },


    // TASKS
    async addTask(project_id: number, column_id: number, name: string, description: string, done: boolean, subtaskDrafts: SubtaskDraft[]): Promise<Task> {
        // Add task
        const [rows] = await db.execute<ResultSetHeader>(
            "INSERT INTO `tasks`(`project_id`, `column_id`, `name`, `description`, `done`) VALUES (?, ?, ?, ?, ?)",
            [
                project_id,
                column_id,
                name,
                description,
                // label_id,
                done
            ]
        );

        // Extract created_at property created by MySQL
        const [rows2] = await db.execute<taskRow[]>(
            "SELECT * FROM `tasks` WHERE id = ?",
            [rows.insertId]
        );

        if (!rows2[0]) throw new Error("Task not found");

        const subtasks: Subtask[] = [];

        for (const subtaskDraft of subtaskDrafts) {
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

    async editTask(taskId: number, name: string, description: string, column_id: number, done: boolean) {
        // Check if task exists
        await this.getTaskById(taskId);

        await db.execute(
            "UPDATE `tasks` SET `name` = ?, `description` = ?, `column_id` = ?, `done` = ? WHERE id = ?",
            [name, description, column_id, done, taskId]
        );
    },

    async deleteTask(taskId: number) {
        // Check if task exists
        await this.getTaskById(taskId);

        await db.execute(
            "DELETE FROM `tasks` WHERE id = ?",
            [taskId]
        );
    },

    async getTaskById(taskId: number): Promise<Task> {
        const [rows] = await db.execute<taskRow[]>(
            "SELECT * FROM `tasks` WHERE id = ?",
            [taskId]
        );

        if (!rows[0]) throw new Error("Task not found");

        return new Task(
            rows[0].id,
            rows[0].project_id,
            rows[0].column_id,
            rows[0].name,
            rows[0].description,
            rows[0].done,
            rows[0].label_id,
            rows[0].created_at,
            []
        );
    },

    async authorizeTaskAccess(user: User, projectId: number, taskId: number) {
        const task = await this.getTaskById(taskId);

        if (task.project_id !== projectId) throw new Error("Forbidden");
    },



    // SUBTASKS
    async addSubtask(taskId: number, name: string, done: boolean): Promise<Subtask> {
        const [rows1] = await db.execute<ResultSetHeader>(
            "INSERT INTO `subtasks`(`task_id`, `name`, `done`) VALUES (?, ?, ?)",
            [taskId, name, done]
        );

        const subtask = await this.getSubtaskById(rows1.insertId);

        return subtask;
    },

    async editSubtask(subtaskId: number, name: string, done: boolean) {
        // Check if subtask exists
        await this.getSubtaskById(subtaskId);

        await db.execute(
            "UPDATE `subtasks` SET `name` = ?, `done` = ? WHERE id = ?",
            [name, done, subtaskId]
        );
    },

    async deleteSubtask(subtaskId: number) {
        // Check if subtask exists
        await this.getSubtaskById(subtaskId);

        await db.execute(
            "DELETE FROM `subtasks` WHERE id = ?",
            [subtaskId]
        );
    },

    async getSubtaskById(subtaskId: number): Promise<Subtask> {
        const [rows] = await db.execute<taskRow[]>(
            "SELECT * FROM `subtasks` WHERE id = ?",
            [subtaskId]
        );

        if (!rows[0]) throw new Error("Subtask not found");

        return new Subtask(
            rows[0].id,
            rows[0].task_id,
            rows[0].name,
            Boolean(rows[0].done),
            rows[0].created_at
        )
    },

    async authorizeSubtaskAccess(user: User, projectId: number, subtaskId: number) {
        const subtask = await this.getSubtaskById(subtaskId);
        const task = await this.getTaskById(subtask.task_id);

        if (task.project_id !== projectId) throw new Error("Forbidden");
    },




    // PROJECTS    
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

    async editProject(projectId: number, name: string, description: string) {
        await db.execute(
            "UPDATE `projects` SET `name` = ?, `description` = ? WHERE id = ?",
            [name, description, projectId]
        );
    },

    async deleteProject(projectId: number) {
        await db.execute(
            "DELETE FROM `projects` WHERE id = ?",
            [projectId]
        );
    },

    async authorizeProjectAccess(user: User, projectId: number): Promise<ProjectRole> {
        const [rows] = await db.execute<userRow[]>(
            `SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?`, [user.id, projectId]
        );

        if (!rows[0]) throw new Error("Forbidden");

        return rows[0].role;
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
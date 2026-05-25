import { db } from "../../index.js";
import { Project } from "../../types/project.js";
import { Column } from "../../types/column.js";
import { getColumns } from "./getters.js";
import { Task } from "../../types/task.js";
import { Subtask } from "../../types/subtask.js";
export const DBProjectsService = {
    async generateUUID() {
        while (true) {
            const UUID = crypto.randomUUID();
            const [rows] = await db.execute(`SELECT * FROM projects WHERE UUID = ?`, [UUID]);
            if (!rows[0] || rows[0].length === 0)
                return UUID;
        }
    },
    async addColumn(columnDraft) {
        const [rows] = await db.execute("INSERT INTO `columns`(`project_id`, `name`) VALUES (?, ?)", [columnDraft.project_id, columnDraft.name]);
        return new Column(rows.insertId, columnDraft.project_id, columnDraft.name, []);
    },
    async addTask(taskDraft) {
        console.log(taskDraft);
        // Add task
        const [rows] = await db.execute("INSERT INTO `tasks`(`project_id`, `column_id`, `name`, `description`, `done`) VALUES (?, ?, ?, ?, ?)", [
            taskDraft.project_id,
            taskDraft.column_id,
            taskDraft.name,
            taskDraft.description,
            // taskDraft.label_id,
            taskDraft.done
        ]);
        // Extract created_at property created by MySQL
        const [rows2] = await db.execute("SELECT * FROM `tasks` WHERE id = ?", [rows.insertId]);
        if (!rows2[0])
            throw new Error("Task not found");
        const subtasks = [];
        for (const subtaskDraft of taskDraft.subtasks) {
            // Add every subtask
            const [rows3] = await db.execute("INSERT INTO `subtasks`(`task_id`, `name`, `done`) VALUES (?, ?, ?)", [rows2[0].id, subtaskDraft.name, subtaskDraft.done]);
            // Extract created_at property created by MySQL
            const [rows4] = await db.execute("SELECT * FROM `subtasks` WHERE id = ?", [rows3.insertId]);
            if (!rows4[0])
                throw new Error("Subtask not found");
            subtasks.push(new Subtask(rows3.insertId, rows2[0].id, subtaskDraft.name, subtaskDraft.done, rows4[0].created_at));
        }
        return new Task(rows2[0].id, rows2[0].project_id, rows2[0].column_id, rows2[0].name, rows2[0].description, rows2[0].done, rows2[0].label_id, rows2[0].created_at, subtasks);
    },
    async authorizeProjectAccess(user, projectId) {
        const [rows] = await db.execute(`SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?`, [user.id, projectId]);
        if (!rows[0])
            throw new Error("Forbidden");
        return rows[0].role;
    },
    async createProject(name, description, user) {
        const UUID = await this.generateUUID();
        const [rows1] = await db.execute('INSERT INTO projects (`UUID`, `name`, `description`) VALUES (?, ?, ?)', [UUID, name, description]);
        const [projectRow] = await db.execute('SELECT * FROM projects WHERE UUID = ?', [UUID]);
        const id = projectRow[0].id;
        const created_at = projectRow[0].created_at;
        const columns = [];
        const [rows2] = await db.execute('INSERT INTO user_projects (`project_id`, `role`, `user_id`) VALUES (?, ?, ?)', [id, "owner", user.id]);
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
    async getUserProjectsFormatted(user) {
        const [rows1] = await db.execute(`SELECT * FROM users WHERE UUID = ?`, [user.UUID]);
        const [rows2] = await db.execute(`SELECT * FROM user_projects WHERE user_id = ?`, [user.id]);
        if (!rows1[0] || rows1[0].length === 0) {
            throw new Error("User not found");
        }
        else if (!rows2 || rows2.length === 0) {
            throw new Error("No projects found");
        }
        const projectIds = rows2.map((row) => row.project_id);
        // Generate safe SQL placeholder instead of putting projectIds directly
        // Example: [1, 24, 366] -> "?, ?, ?"
        const queryIdsPlaceholder = projectIds.map(() => "?").join(",");
        const [rows3] = await db.execute(`SELECT * FROM projects WHERE id IN (${queryIdsPlaceholder})`, projectIds);
        const formattedProjects = [];
        for (const row of rows3) {
            const project = new Project(row.id, row.UUID, row.name, row.description, row.created_at, []);
            project.columns = await getColumns(project);
            formattedProjects.push(project);
        }
        // Get projects user roles
        const roles = rows2.map((row) => row.role);
        return [formattedProjects, roles];
    },
};
//# sourceMappingURL=projectsService.js.map
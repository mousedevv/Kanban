import { RowDataPacket } from "mysql2";

import { User } from "./user.js";
import { Project } from "./project.js";
import { Column } from "./column.js";
import { Task } from "./task.js";
import { Subtask } from "./subtask.js";

interface userProject {
    user_id: number;
    project_id: number;
    role: projectRole;
}
 
export type projectRow = RowDataPacket & Project;
export type columnRow = RowDataPacket & Column;
export type taskRow = RowDataPacket & Task;
export type subtaskRow = RowDataPacket & Subtask;

export type userRow = RowDataPacket & User;
export type userProjectsRow = RowDataPacket & userProject;

export type projectRole = "owner" | "editor" | "viewer";

export interface insertRowExtension {
    insertId: number;
}
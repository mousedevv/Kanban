import { Project } from "./project.js";

declare global {
    interface String {
        short(maxLength: number): string;
    }
}

export type ProjectRole = "owner" | "editor" | "viewer";

export type ProjectsPacket = [projects: Project[], role: ProjectRole[]];

export interface ProjectChange {
    project: Project,
    type: "edit" | "delete",
    target: "project" | "column" | "task" | "subtask",
    delta: {
        name?: string,
        description?: string,
        done?: boolean,
        column_id?: number,
        task_id?: number,
        subtask_id?: number,
    }
}
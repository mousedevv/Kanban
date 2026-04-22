import { Project } from "./project.js";

export type ProjectRole = "owner" | "editor" | "viewer";

export type ProjectsPacket = [ projects: Project[], role: ProjectRole[] ];
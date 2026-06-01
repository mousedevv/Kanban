import { Project } from "../types/project.js";
import { Column } from "../types/column.js";
import { notification } from "../../../utils/notification.js";
import { Task } from "../types/task.js";
import { SubtaskDraft } from "../types/subtask.js";
import { UI } from "../UI/UI.js";

export const projectService = {
    projects: [] as Project[],

    getColumnById(id: number): Column | void {
        return this.projects
            .map(project => project.columns)
            .flat(1)
            .find(col => col.id === id);
    },

    async createProject(name: string, description?: string): Promise<Project | void> {
        try {
            const res = await fetch("/api/project/create-project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name, description: description }),
            });

            const data = await res.json();

            console.log(data);

            return data;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async editProject(id: number, name: string, description?: string): Promise<void> {
        try {
            const res = await fetch("/api/project/edit-project", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: id, name: name, description: description }),
            });

            if (!res.ok) throw new Error("Failed to edit project");
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async deleteProject(id: number): Promise<boolean> {
        try {
            await fetch("/api/project/delete-project", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: id }),
            });
            return true;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return false;
        }
    },

    async addColumn(project_id: number, name: string): Promise<Column | void> {
        try {
            const res = await fetch("/api/project/add-column", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, name: name }),
            });

            const data = await res.json();

            // Add new column to activeProject columns and redraw
            UI.activeProject!.columns.push(data);
            UI.draw(UI.activeProject!);

            return data;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async editColumn(project_id: number, id: number, name: string): Promise<void> {
        try {
            const res = await fetch("/api/project/edit-column", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, column_id: id, name: name }),
            });

            if (!res.ok) throw new Error("Failed to edit column");

            // Update local state
            const column = UI.activeProject?.columns.find(col => col.id === id);
            if (column) {
                column.name = name;
            }
            UI.draw(UI.activeProject!);

            return;
        }
        catch (e) {
            console.error(e);
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async deleteColumn(project_id: number, id: number): Promise<boolean> {
        try {
            const res = await fetch("/api/project/delete-column", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, column_id: id }),
            });

            if (!res.ok) throw new Error("Failed to delete column");

            // Remove from local state
            if (UI.activeProject) {
                UI.activeProject.columns = UI.activeProject.columns.filter(col => col.id !== id);
                UI.draw(UI.activeProject);
            }

            return true;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return false;
        }
    },

    async addTask(project_id: number, column_id: number, name: string, description?: string, subtasks: SubtaskDraft[] = []): Promise<Task | void> {
        try {
            const res = await fetch("/api/project/add-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, column_id: column_id, name: name, description: description, subtasks: subtasks }),
            });

            const data = await res.json();

            // Add to local state
            const column = UI.activeProject?.columns.find(col => col.id === column_id);
            if (column) {
                column.tasks.push(data);
            }

            UI.draw(UI.activeProject!);

            return data;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async editTask(project_id: number, id: number, column_id: number, name: string, description?: string, done?: boolean): Promise<void> {
        try {
            const res = await fetch("/api/project/edit-task", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, task_id: id, column_id: column_id, name: name, description: description, done: done }),
            });

            if (!res.ok) throw new Error("Failed to edit task");

            // Update local state
            if (UI.activeProject) {
                for (const column of UI.activeProject.columns) {
                    const task = column.tasks.find(t => t.id === id);
                    if (task) {
                        task.name = name;
                        if (description !== undefined) {
                            task.description = description;
                        }
                        if (done !== undefined) {
                            task.done = done;
                        }
                        UI.draw(UI.activeProject);
                        break;
                    }
                }
            }
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async deleteTask(project_id: number, id: number): Promise<boolean> {
        try {
            await fetch("/api/project/delete-task", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, task_id: id }),
            });

            // Remove from local state
            if (UI.activeProject) {
                for (const column of UI.activeProject.columns) {
                    column.tasks = column.tasks.filter(t => t.id !== id);
                }
                UI.draw(UI.activeProject);
            }

            return true;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return false;
        }
    },

    async addSubtask(project_id: number, task_id: number, name: string, done: boolean): Promise<Task | void> {
        try {
            const res = await fetch("/api/project/add-subtask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, task_id: task_id, name: name, done: done }),
            });

            const data = await res.json();

            // Add to local state
            if (UI.activeProject) {
                for (const column of UI.activeProject.columns) {
                    const task = column.tasks.find(t => t.id === task_id);
                    if (task) {
                        task.subtasks.push(data);
                        UI.draw(UI.activeProject);
                        break;
                    }
                }
            }

            return data;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async editSubtask(project_id: number, id: number, name: string, done?: boolean): Promise<Task | void> {
        try {
            const res = await fetch("/api/project/edit-subtask", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, subtask_id: id, name: name, done: done }),
            });

            if (!res.ok) throw new Error("Failed to edit subtask");

            // Update local state
            if (UI.activeProject) {
                for (const column of UI.activeProject.columns) {
                    for (const task of column.tasks) {
                        const subtask = task.subtasks.find(st => st.id === id);
                        if (subtask) {
                            subtask.name = name;
                            if (done !== undefined) subtask.done = done;
                            UI.draw(UI.activeProject);
                            break;
                        }
                    }
                }
            }

            return;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },

    async deleteSubtask(project_id: number, id: number): Promise<boolean> {
        try {
            await fetch("/api/project/delete-subtask", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: project_id, subtask_id: id }),
            });

            // Remove from local state
            if (UI.activeProject) {
                for (const column of UI.activeProject.columns) {
                    for (const task of column.tasks) {
                        task.subtasks = task.subtasks.filter(st => st.id !== id);
                    }
                }
                UI.draw(UI.activeProject);
            }

            return true;
        }
        catch (e) {
            notification("Something went wrong - try again later!", "error");
            return false;
        }
    },

    async getProjects() {
        try {
            const res = await fetch(window.location.origin + "/api/project/get-all-projects", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            return data;
        }
        catch (e) {
            return;
        }
    },

    async initProjects() {
        const projects = await this.getProjects();
        this.projects = projects || [];
        return this.projects;
    },
};
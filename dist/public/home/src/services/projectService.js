import { notification } from "../../../utils/notification.js";
export const projectService = {
    projects: [],
    getColumnById(id) {
        return this.projects
            .map(project => project.columns)
            .flat(1)
            .find(col => col.id === id);
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
            notification("Something went wrong - try again later!", "error");
            return;
        }
    },
    async initProjects() {
        const projects = await this.getProjects();
        this.projects = projects || [];
        return this.projects;
    },
};
//# sourceMappingURL=projectService.js.map
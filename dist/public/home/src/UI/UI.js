import { dom } from "../home.js";
import { projectService } from "../services/projectService.js";
export const UI = {
    activeProject: {},
    async draw(project) {
        if (!project) {
            project = this.activeProject;
        }
        await projectService.drawProjects(false, project);
        await this.updateWindows(project);
    },
    async updateWindows(project) {
        this.activeProject = project;
        await this.updateAddTaskWindow();
    },
    async updateAddTaskWindow() {
        // Update column field
        dom.windows.addTask.column.innerHTML = "";
        this.activeProject.columns.forEach(column => {
            const option = document.createElement('option');
            option.value = column.id.toString();
            option.textContent = column.name;
            dom.windows.addTask.column.appendChild(option);
        });
    }
};
//# sourceMappingURL=UI.js.map
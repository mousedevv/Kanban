import { $$ } from "../../../utils/dom/selectors.js";
import { dom } from "../home.js";
import { projectService } from "../services/projectService.js";
import { Project } from "../types/project.js";

export const UI = {
    activeProject: {} as Project,

    async draw(project: Project | null) {
        if (!project) {
            project = this.activeProject;
        }

        await projectService.drawProjects(false, project);

        await this.updateWindows(project);
    },

    async updateWindows(project: Project) {
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
        })
    }
}


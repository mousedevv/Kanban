import { dom } from "../home.js";
import { projectService } from "../services/projectService.js";
import { Project } from "../types/project.js";

export const UI = {
    activeProject: {} as Project,

    updateWindows(project: Project) {
        this.activeProject = project;

        this.updateAddTaskWindow();
    },
    
    updateAddTaskWindow() {
        // Update column field
        dom.windows.addTask.column.innerHTML = "";

        this.activeProject.columns.forEach(column => {
            const option = document.createElement('option');
            option.value = column.id.toString();
            option.textContent = column.name;
            dom.windows.addTask.column.appendChild(option);
        })
    
        // projectService.projects.forEach(project => {
        //     const option = document.createElement('option');
        //     option.value = activeProject.UUID;
        //     option.textContent = project.name;
        //     dom.windows.addTask.column.appendChild(option);
        // });
    }
}


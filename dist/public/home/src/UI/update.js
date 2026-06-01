import { dom } from "../home.js";
import { projectService } from "../services/projectService.js";
export function updateWindows(project) {
    updateAddTaskWindow();
}
function updateAddTaskWindow() {
    // Update column field
    dom.windows.addTask.column.innerHTML = "";
    projectService.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.UUID;
        option.textContent = project.name;
        dom.windows.addTask.column.appendChild(option);
    });
}
//# sourceMappingURL=update.js.map
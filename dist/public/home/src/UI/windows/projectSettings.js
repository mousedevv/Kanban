import { confirmPopup, notification } from "../../../../utils/notification.js";
import { dom } from "../../dom.js";
import { projectService } from "../../services/projectService.js";
import { UI } from "../UI.js";
dom.windows.projectSettings.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // TODO: Implement edit project
    // const name = dom.windows.projectSettings.name.value;
    // const description = dom.windows.projectSettings.description.value;
    // if (!name) return;
    // TODO: Implement edit project deltas function
    const project = UI.activeProject;
    if (!project) {
        notification("Error occurred while updating the project settings - try again later!", "error");
        return;
    }
    UI.activeProject = project;
    projectService.projects.push(project);
    UI.draw(project);
    UI.changeOpenedProject(project);
    closeProjectSettingsWindow();
});
dom.windows.projectSettings.deleteBtn.addEventListener("click", async () => {
    const project = UI.activeProject;
    if (!project) {
        notification("Error occurred while deleting the project - try again later!", "error");
        return;
    }
    const confirmed = await confirmPopup();
    if (!confirmed)
        return;
    // If the project is successfully deleted, remove it from the UI and projects list
    if (await projectService.deleteProject(project.id)) {
        UI.activeProject = null;
        projectService.projects = projectService.projects.filter(p => p.id !== project.id);
        UI.draw(null, true);
        console.log(UI.activeProject);
        closeProjectSettingsWindow();
    }
});
/*
    Open window event listeners are in UI.ts,
    because the buttons to open it
    is created dynamically when drawing the project.
*/
export function openProjectSettingsWindow() {
    dom.windows.wrapper.classList.remove("hidden");
    dom.windows.projectSettings.wrapper.classList.remove("hidden");
}
// Close
dom.windows.projectSettings.closeBtn.addEventListener("click", closeProjectSettingsWindow);
function closeProjectSettingsWindow() {
    dom.windows.projectSettings.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");
}
//# sourceMappingURL=projectSettings.js.map
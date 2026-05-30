import { notification } from "../../../../utils/notification.js";
import { dom } from "../../dom.js";
import { projectService } from "../../services/projectService.js";
import { UI } from "../UI.js";
dom.windows.projectSettings.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = dom.windows.projectSettings.name.value;
    const description = dom.windows.projectSettings.description.value;
    if (!name)
        return;
    // Edit project POST placeholder
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
import { notification } from "../../../../utils/notification.js";
import { dom } from "../../dom.js";
import { projectService } from "../../services/projectService.js";
import { UI } from "../UI.js";
dom.windows.createProject.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = dom.windows.createProject.name.value;
    const description = dom.windows.createProject.description.value;
    if (!name)
        return;
    const project = await projectService.createProject(name, description);
    if (!project) {
        notification("Error occurred while creating the project - try again later!", "error");
        return;
    }
    UI.activeProject = project;
    projectService.projects.push(project);
    UI.draw(project);
    UI.changeOpenedProject(project);
    closeCreateProjectWindow();
});
/*
    Open window event listeners are in UI.ts,
    because the buttons to open it
    is created dynamically when drawing the project.
*/
export function openCreateProjectWindow() {
    dom.windows.wrapper.classList.remove("hidden");
    dom.windows.createProject.wrapper.classList.remove("hidden");
}
// Close
dom.windows.createProject.closeBtn.addEventListener("click", closeCreateProjectWindow);
function closeCreateProjectWindow() {
    dom.windows.createProject.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");
}
//# sourceMappingURL=createProject.js.map
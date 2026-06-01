import { confirmPopup, notification } from "../../../utils/notification.js";
import { dom } from "../dom.js";
import { projectService } from "../services/projectService.js";
import { UI } from "../UI/UI.js";
dom.savePopup.saveBtn.addEventListener("click", async () => {
    console.log("Sending changes...");
    saveManager.saveProject(UI.activeProject);
    UI.closeAllWindows();
    dom.savePopup.wrapper.classList.add("hidden");
    saveManager.saved = true;
});
dom.savePopup.discardBtn.addEventListener("click", async () => {
    const confirmed = await confirmPopup("discardChanges");
    if (!confirmed)
        return;
    console.log("Reverting changes...");
    UI.closeAllWindows();
    dom.savePopup.wrapper.classList.add("hidden");
    // Revert changes locally
    UI.activeProject = saveManager.projectStash;
    UI.draw(UI.activeProject, false);
    // Clear stashed project and changes
    saveManager.projectStash = null;
    saveManager.changes = [];
    // Mark as saved
    saveManager.saved = true;
});
export const saveManager = {
    projectStash: null,
    saved: true,
    changes: [],
    addChange(change) {
        this.changes.push(change);
        this.enterUnsavedState();
    },
    enterUnsavedState() {
        if (this.saved) {
            // Stash project in case user wants to revert changes
            this.projectStash = UI.activeProject ? structuredClone(UI.activeProject) : null;
        }
        dom.savePopup.wrapper.classList.remove("hidden");
        this.saved = false;
    },
    async saveProject(project) {
        try {
            for (const change of this.changes) {
                switch (change.type) {
                    case "edit":
                        await this.handleEdit(change);
                        break;
                    case "delete":
                        await this.handleDelete(change);
                        break;
                }
            }
            this.changes = [];
        }
        catch (e) {
            notification("Error occurred while saving the project - try again later!", "error");
            return;
        }
    },
    /*
    export interface ProjectChange {
        project: Project,
        type: "edit" | "delete",
        target: "project" | "column" | "task" | "subtask",
        delta: {
            name?: string,
            description?: string,
            done?: boolean,
            column_id?: number,
            task_id?: number,
            subtask_id?: number,
        }
    }
    */
    async handleEdit(change) {
        // Handle edit logic based on change.target
        console.log("Handling edit for delta:", change.delta);
        switch (change.target) {
            case "project":
                projectService.editProject(change.project.id, change.delta.name, change.delta.description);
                break;
            case "column":
                projectService.editColumn(change.project.id, change.delta.column_id, change.delta.name);
                break;
            case "task":
                projectService.editTask(change.project.id, change.delta.task_id, change.delta.column_id, change.delta.name, change.delta.description, change.delta.done);
                break;
            case "subtask":
                projectService.editSubtask(change.project.id, change.delta.subtask_id, change.delta.name, change.delta.done);
                break;
        }
    },
    async handleDelete(change) {
        // Handle delete logic based on change.target
        switch (change.target) {
            case "project":
                projectService.deleteProject(change.project.id);
                break;
            case "column":
                projectService.deleteColumn(change.project.id, change.delta.column_id);
                break;
            case "task":
                projectService.deleteTask(change.project.id, change.delta.task_id);
                break;
            case "subtask":
                projectService.deleteSubtask(change.project.id, change.delta.subtask_id);
                break;
        }
    },
};
//# sourceMappingURL=saveManager.js.map
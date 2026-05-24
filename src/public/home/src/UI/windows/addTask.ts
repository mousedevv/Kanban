import { notification } from "../../../../utils/notification.js";
import { dom } from "../../home.js";

import { projectService } from "../../services/projectService.js";
import { SubtaskDraft } from "../../types/subtask.js";
import { TaskDraft } from "../../types/task.js";
import { UI } from "../UI.js";

// Add task window submit
dom.windows.addTask.form.addEventListener("submit", e => {
    e.preventDefault();

    const col = projectService.getColumnById(
        parseInt(dom.windows.addTask.column.value)
    );

    if (!col) {
        console.log("xd");
        notification("Error occurred while adding the task - try again later!", "error");
        return;
    }

    const subtasks: SubtaskDraft[] = [
        { name: "Subtask 1 name placeholder", done: false },
        { name: "Subtask 2 name placeholder", done: false },
    ]

    const task: TaskDraft = {
        project_id: UI.activeProject.id,
        column_id: col.id,
        name: dom.windows.addTask.name.value,
        description: dom.windows.addTask.description.value,
        done: false,
        // label_id: 1, // Placeholder
        subtasks: subtasks
    }

    UI.activeProject.columns.push()
});

// Add task window - add subtask
dom.windows.addTask.addSubtaskBtn.addEventListener("click", e => {
    
});

// Close
dom.windows.addTask.closeBtn.addEventListener("click", () => {
    dom.windows.addTask.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");
});
import { notification } from "../../../../utils/notification.js";
import { dom } from "../../home.js";
import { $, $$ } from "../../../../utils/dom/selectors.js";
import { projectService } from "../../services/projectService.js";
import { taskService } from "../../services/taskService.js";
import { UI } from "../UI.js";
// Add task window submit
dom.windows.addTask.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const col = projectService.getColumnById(parseInt(dom.windows.addTask.column.value));
    if (!col) {
        notification("Error occurred while adding the task - try again later!", "error");
        return;
    }
    const subtasks = [];
    const DOMsubtasks = $$(".addTaskSubtask");
    DOMsubtasks.forEach(DOMsubtask => {
        const name = $(`.${DOMsubtask.className} .addTaskSubtaskNameInput`).value;
        const done = $(`.${DOMsubtask.className} .addTaskSubtaskDone`).checked;
        subtasks.push({ name, done });
    });
    const task = {
        project_id: UI.activeProject.id,
        column_id: col.id,
        name: dom.windows.addTask.name.value,
        description: dom.windows.addTask.description.value,
        done: false,
        // label_id: 1, // Placeholder
        subtasks: subtasks
    };
    const addedTask = await taskService.addTask(task);
    if (!addedTask) {
        notification("Error occurred while adding the task - try again later!", "error");
        return;
    }
    // Find a column to add addedTask to col locally    
    UI.activeProject.columns[UI.activeProject.columns
        .findIndex(el => el.id = col.id)].tasks.push(addedTask);
    UI.draw(UI.activeProject);
});
// Add task window - add subtask
dom.windows.addTask.addSubtaskBtn.addEventListener("click", e => {
    // Buttons in the form should be with type="button" to avoid submitting it
    const wrapper = dom.windows.addTask.subtasksWrapper;
    const subtask = document.createElement("div");
    const name = document.createElement("input");
    const doneCheckbox = document.createElement("input");
    const btn = document.createElement("button");
    // Subtask el
    subtask.classList.add("addTaskSubtask");
    subtask.id = wrapper.lastElementChild ? `${parseInt(wrapper.lastElementChild.id) + 1}` : "0";
    // Subtask name input
    name.required = true;
    name.placeholder = `Subtask #${subtask.id} name`;
    name.classList.add("addTaskSubtaskNameInput");
    // Subtask done checkbox
    doneCheckbox.type = "checkbox";
    doneCheckbox.classList.add("addTaskSubtaskDone");
    // Delete subtask from list btn
    btn.type = "button";
    btn.classList.add("addTaskDeleteSubtask", "btn", "animateOnHover");
    btn.id = "0";
    btn.textContent = "X";
    btn.addEventListener("click", () => {
        wrapper.removeChild(subtask);
    });
    subtask.appendChild(doneCheckbox);
    subtask.appendChild(name);
    subtask.appendChild(btn);
    wrapper.appendChild(subtask);
});
// Close
dom.windows.addTask.closeBtn.addEventListener("click", () => {
    dom.windows.addTask.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");
});
//# sourceMappingURL=addTask.js.map
import { notification } from "../../../../utils/notification.js";
import { dom } from "../../dom.js";

import { $, $$ } from "../../../../utils/dom/selectors.js";

import { projectService } from "../../services/projectService.js";
import { SubtaskDraft, getNextDraftId } from "../../types/subtask.js";
import { UI } from "../UI.js";
import { Column } from "../../types/column.js";

export const addTaskWindowState = {
    selectedColumn: null as Column | null,
}

// Add task window submit
dom.windows.addTask.form.addEventListener("submit", async e => {
    e.preventDefault();

    const col = addTaskWindowState.selectedColumn!;

    if (!col) {
        notification("Error occurred while adding the task - try again later!", "error");
        return;
    }

    const subtasks: SubtaskDraft[] = [];

    const DOMsubtasks = $$(".addTaskSubtask");

    DOMsubtasks.forEach(DOMsubtask => {
        const name = ($(`#${DOMsubtask.id} .addTaskSubtaskNameInput`) as HTMLInputElement).value;
        const done = ($(`#${DOMsubtask.id} .addTaskSubtaskDone`) as HTMLInputElement).checked;
        const id = DOMsubtask.dataset.draftId ? Number(DOMsubtask.dataset.draftId) : getNextDraftId();

        subtasks.push({ id, name, done });
    });

    const addedTask = await projectService.addTask(
        UI.activeProject!.id,
        col.id,
        dom.windows.addTask.name.value,
        dom.windows.addTask.description.value,
        subtasks
    );

    if (!addedTask) {
        notification("Error occurred while adding the task - try again later!", "error");
        return;
    }

    closeAddTaskWindow();

    await UI.draw(UI.activeProject);
});

// Add task window - add subtask
dom.windows.addTask.addSubtaskBtn.addEventListener("click", e => {
    // ! Buttons in the form should be with type="button" to avoid submitting it
    const wrapper = dom.windows.addTask.subtasksWrapper;

    const subtask = document.createElement("div");
    const name = document.createElement("input");
    const doneCheckbox = document.createElement("input");
    const btn = document.createElement("button");

    // Subtask el
    subtask.classList.add("addTaskSubtask");
    subtask.dataset.draftId = getNextDraftId().toString();

    const id = wrapper.lastElementChild?.id || "task-0";

    if (wrapper.lastElementChild) {
        subtask.id = `task-${parseInt(id.slice(id.length - 1, id.length)) + 1}`;
    } else {
        subtask.id = "task-0";
    }

    // Subtask name input
    name.required = true;
    name.placeholder = `Subtask #${subtask.id.slice(subtask.id.length - 1, subtask.id.length)} name`;
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

/* 
    Open window event listeners are in UI.ts, 
    because the buttons to open it 
    is created dynamically when drawing the project.
*/
export function openAddTaskWindow(col: Column) {
    addTaskWindowState.selectedColumn = col;
    dom.windows.wrapper.classList.remove("hidden");
    dom.windows.addTask.wrapper.classList.remove("hidden");
}

// Close
dom.windows.addTask.closeBtn.addEventListener("click", () => {
    closeAddTaskWindow();
});

function closeAddTaskWindow() {
    dom.windows.addTask.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");

    // Clear selected column
    addTaskWindowState.selectedColumn = null;

    clearAddTaskWindow();
}

function clearAddTaskWindow() {
    dom.windows.addTask.name.value = "";
    dom.windows.addTask.description.value = "";
    dom.windows.addTask.subtasksWrapper.innerHTML = "";
}
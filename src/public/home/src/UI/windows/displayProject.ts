import { notification } from "../../../../utils/notification.js";
import { dom } from "../../dom.js";
import { saveManager } from "../../saves/saveManager.js";
import { Column } from "../../types/column.js";
import { SubtaskDraft } from "../../types/subtask.js";
import { Task } from "../../types/task.js";
import { UI } from "../UI.js";

export const displayTaskWindowState = {
    selectedColumn: null as Column | null,
    selectedTaskId: null as number | null,
}

function generateSubtaskElement(wrapper: HTMLDivElement, subtask: SubtaskDraft, name?: string, done?: boolean, addChangeListener?: boolean): HTMLDivElement {
    const subtaskEl = document.createElement("div");
    const nameInput = document.createElement("input");
    const doneCheckbox = document.createElement("input");
    const btn = document.createElement("button");

    // Subtask el
    subtaskEl.classList.add("displayTaskSubtask");
    subtaskEl.id = wrapper.lastElementChild ? `task-${parseInt(wrapper.lastElementChild.id.slice(wrapper.lastElementChild.id.length - 1, wrapper.lastElementChild.id.length)) + 1}` : "task-0";

    // Subtask name input
    nameInput.required = true;
    nameInput.value = name || subtask.name;
    nameInput.placeholder = `Subtask #${subtaskEl.id.slice(subtaskEl.id.length - 1, subtaskEl.id.length)} name`;
    nameInput.classList.add("displayTaskSubtaskNameInput");
    // TODO
    // if (addChangeListener) {
    //     nameInput.addEventListener("blur", () => {
    //         const column = displayTaskWindowState.selectedColumn;
    //         const taskId = displayTaskWindowState.selectedTaskId;
    //         const project = UI.activeProject;

    //         if (!column || taskId === null || !project) {
    //             notification("Error occurred while updating the subtask - try again later!", "error");
    //             return;
    //         }

    //         const task = column.tasks.find(t => t.id === taskId)!;

    //         projectService.
    //     });
    // }

    // Subtask done checkbox
    doneCheckbox.type = "checkbox";
    doneCheckbox.checked = done ?? subtask.done;
    doneCheckbox.classList.add("displayTaskSubtaskDone");

    // Delete subtask from list btn
    btn.type = "button";
    btn.classList.add("displayTaskDeleteSubtask", "btn", "animateOnHover");
    btn.id = "0";
    btn.textContent = "X";
    btn.addEventListener("click", () => {
        wrapper.removeChild(subtaskEl);
    });

    subtaskEl.appendChild(doneCheckbox);
    subtaskEl.appendChild(nameInput);
    subtaskEl.appendChild(btn);

    return subtaskEl;
}

dom.windows.displayTask.description.addEventListener("blur", () => {
    const column = displayTaskWindowState.selectedColumn;
    const taskId = displayTaskWindowState.selectedTaskId;
    const task = column?.tasks.find(t => t.id === taskId);
    const project = UI.activeProject;

    if (!column || taskId === null || !project) {
        notification("Error occurred while updating the task - try again later!", "error");
        return;
    }

    if (task?.description === dom.windows.displayTask.description.value) return;

    saveManager.addChange({
        project,
        type: "edit",
        target: "task",
        delta: {
            description: dom.windows.displayTask.description.value,
            task_id: taskId,
            column_id: column.id,
            name: dom.windows.displayTask.name.textContent || "",
            done: task?.done || false,
        }
    });
});

// Display task window - add subtask
dom.windows.displayTask.addSubtaskBtn.addEventListener("click", e => {
    // ! Buttons in the form should be with type="button" to avoid submitting it
    const wrapper = dom.windows.displayTask.subtasksWrapper;

    const subtaskEl = generateSubtaskElement(wrapper, {
        name: "",
        done: false,
    })

    wrapper.appendChild(subtaskEl);
});

/* 
    Open window event listeners are in UI.ts, 
    because the buttons to open it 
    is created dynamically when drawing the project.
*/
export function openDisplayTaskWindow(col: Column, task: Task) {
    dom.windows.displayTask.name.textContent = task.name;
    displayTaskWindowState.selectedColumn = col;
    displayTaskWindowState.selectedTaskId = task.id;

    // Task description
    dom.windows.displayTask.description.value = task.description;

    task.subtasks.forEach(subtask => {
        const subtaskEl = generateSubtaskElement(dom.windows.displayTask.subtasksWrapper, subtask);
        (subtaskEl.querySelector("input") as HTMLInputElement).value = subtask.name;
        (subtaskEl.querySelector("input") as HTMLInputElement).checked = subtask.done;

        dom.windows.displayTask.subtasksWrapper.appendChild(subtaskEl);
    });

    dom.windows.wrapper.classList.remove("hidden");
    dom.windows.displayTask.wrapper.classList.remove("hidden");
}

// Close
dom.windows.displayTask.closeBtn.addEventListener("click", () => {
    closeDisplayTaskWindow();
});

function closeDisplayTaskWindow() {
    dom.windows.displayTask.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");

    // Clear selected column
    displayTaskWindowState.selectedColumn = null;
    displayTaskWindowState.selectedTaskId = null;

    clearDisplayTaskWindow();
}

function clearDisplayTaskWindow() {
    (dom.windows.displayTask.name as HTMLElement).textContent = "";
    (dom.windows.displayTask.description as HTMLTextAreaElement).value = "";
    dom.windows.displayTask.subtasksWrapper.innerHTML = "";
}
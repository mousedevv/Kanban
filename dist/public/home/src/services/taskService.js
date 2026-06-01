import { UI } from "../UI/UI.js";
import { saveManager } from "../saves/saveManager.js";
import { openDisplayTaskWindow } from "../UI/windows/displayProject.js";
export const taskService = {
    createDOMElement(task) {
        const taskEl = document.createElement('div');
        taskEl.classList.add('task');
        taskEl.id = `task${task.id}`;
        const taskTitleRow = document.createElement('div');
        taskTitleRow.classList.add('taskTitleRow');
        const taskTitle = document.createElement('div');
        taskTitle.classList.add('taskTitle');
        taskTitle.textContent = task.name;
        taskTitle.style.textDecoration = task.done ? "line-through 2px black" : "none";
        taskTitle.contentEditable = 'true';
        taskTitle.spellcheck = false;
        taskTitle.addEventListener('blur', () => {
            // Save change if name was changed, otherwise do nothing
            if (taskTitle.textContent === task.name)
                return;
            task.name = taskTitle.textContent;
            saveManager.addChange({
                project: UI.activeProject,
                type: "edit",
                target: "task",
                delta: {
                    name: task.name,
                    task_id: task.id,
                    column_id: task.column_id,
                    description: task.description,
                    done: task.done,
                }
            });
        });
        // Task checkbox
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = task.done;
        taskCheckbox.classList.add('flex', 'taskCheckbox');
        taskCheckbox.addEventListener('change', () => {
            task.done = taskCheckbox.checked;
            taskTitle.style.textDecoration = task.done ? "line-through 2px black" : "none";
            saveManager.addChange({
                project: UI.activeProject,
                type: "edit",
                target: "task",
                delta: {
                    done: task.done,
                    task_id: task.id,
                    column_id: task.column_id,
                    name: task.name,
                    description: task.description,
                }
            });
        });
        taskTitleRow.appendChild(taskTitle);
        taskTitleRow.appendChild(taskCheckbox);
        taskEl.appendChild(taskTitleRow);
        const doneSubtasksQuantity = task.subtasks.filter((subtask) => subtask.done).length;
        const subtasksQuantity = task.subtasks.length;
        if (subtasksQuantity > 0) {
            // Only display subtasks counter if there are any
            const doneSubtasksText = document.createElement('p');
            doneSubtasksText.classList.add("taskDoneSubtasks");
            doneSubtasksText.textContent = `
                ${doneSubtasksQuantity}
                of 
                ${subtasksQuantity} 
                subtasks done
            `;
            (doneSubtasksQuantity === subtasksQuantity) ?
                doneSubtasksText.classList.add("taskDoneSubtasksAllDoneText") :
                doneSubtasksText.classList.add("taskDoneSubtasksNotAllDoneText");
            doneSubtasksText.addEventListener("click", () => {
                openDisplayTaskWindow(UI.activeProject.columns.find(col => col.id === task.column_id), task);
            });
            taskEl.appendChild(doneSubtasksText);
        }
        return taskEl;
    },
};
//# sourceMappingURL=taskService.js.map
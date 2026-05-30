import { Task } from "../types/task.js";
import { UI } from "../UI/UI.js";
import { notification } from "../../../utils/notification.js";
export const taskService = {
    async addTask(taskDraft) {
        try {
            console.log(taskDraft);
            const res = await fetch("/api/project/add-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: UI.activeProject.id, taskDraft: taskDraft }),
            });
            const rJ = await res.json();
            return new Task(rJ.id, rJ.project_id, rJ.column_id, rJ.name, rJ.description, Boolean(rJ.done), 
            // rJ.label_id,
            rJ.created_at, rJ.subtasks);
        }
        catch (e) {
            notification("Error occurred while adding the task - try again later!", "error");
            return;
        }
    },
    async deleteTask(task) {
        try {
            const res = await fetch("/api/project/delete-task", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: UI.activeProject.id, task_id: task.id }),
            });
            if (!res.ok)
                throw new Error("Failed to delete task");
            // Remove task from activeProject columns
            UI.activeProject.columns
                .find(col => col.id === task.column_id)
                .tasks =
                UI.activeProject.columns
                    .find(col => col.id === task.column_id).tasks
                    .filter(t => t.id !== task.id);
            // Redraw project
            UI.draw(UI.activeProject);
        }
        catch (e) {
            notification("Error occurred while deleting the task - try again later!", "error");
        }
    },
    createDOMElement(task) {
        // <div class="task" id="task1">
        //     <div class="taskTitleRow">
        //         <div class="taskTitle" contenteditable>Task 1 title</div>
        //         <input type="checkbox" class="flex taskCheckbox" id="col1settings"></input>
        //     </div>
        // </div>
        const taskEl = document.createElement('div');
        taskEl.classList.add('task');
        taskEl.id = `task${task.id}`;
        const taskTitleRow = document.createElement('div');
        taskTitleRow.classList.add('taskTitleRow');
        const taskTitle = document.createElement('div');
        taskTitle.classList.add('taskTitle');
        taskTitle.textContent = task.name;
        taskTitle.contentEditable = 'true';
        taskTitle.spellcheck = false;
        taskTitle.addEventListener('blur', () => {
            task.name = taskTitle.textContent;
        });
        // Task checkbox
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.classList.add('flex', 'taskCheckbox');
        taskCheckbox.addEventListener('change', () => {
            task.done = taskCheckbox.checked;
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
            taskEl.appendChild(doneSubtasksText);
        }
        return taskEl;
    },
};
//# sourceMappingURL=taskService.js.map
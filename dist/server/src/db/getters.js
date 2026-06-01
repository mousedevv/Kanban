import { db } from "../../index.js";
import { Column } from "../../types/column.js";
import { Task } from "../../types/task.js";
import { Subtask } from "../../types/subtask.js";
export async function getColumns(project) {
    const columns = [];
    const [rows] = await db.execute('SELECT * FROM columns WHERE project_id = ?', [project.id]);
    if (rows.length === 0)
        return columns;
    for (const row of rows) {
        const column = new Column(row.id, row.project_id, row.name, []);
        const columnTasks = await getTasks(column);
        column.tasks.push(...columnTasks);
        columns.push(column);
    }
    return columns;
}
async function getTasks(column) {
    const tasks = [];
    const [rows] = await db.execute('SELECT * FROM tasks WHERE column_id = ?', [column.id]);
    if (rows.length === 0)
        return tasks;
    for (const row of rows) {
        const task = new Task(row.id, row.project_id, row.column_id, row.name, row.description, row.done, row.label_id, row.created_at, []);
        // public id: number,
        // public project_id: number,
        // public column_id: number,
        // public name: string,
        // public description: string,
        // public done: number | boolean,
        // public label_id: number | null,
        // public created_at: string,
        // public subtasks: Subtask[]
        const taskSubtasks = await getSubtasks(task);
        task.subtasks.push(...taskSubtasks);
        tasks.push(task);
    }
    return tasks;
}
async function getSubtasks(task) {
    const [rows] = await db.execute('SELECT * FROM subtasks WHERE task_id = ?', [task.id]);
    if (rows.length === 0)
        return [];
    const subtasks = rows.map((row) => new Subtask(row.id, row.task_id, row.name, row.done, row.created_at));
    return subtasks;
}
//# sourceMappingURL=getters.js.map
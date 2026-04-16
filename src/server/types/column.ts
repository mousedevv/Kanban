import { Task } from "./task.js";

export class Column {
    constructor (
        public id: number,
        public project_id: number,
        public name: string,
        public tasks: Task[]
    ) {
        this.id = id;
        this.project_id = project_id;
        this.name = name;
        this.tasks = tasks;
    }
}
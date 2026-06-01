import { Subtask, SubtaskDraft } from "./subtask.js";

export class Task {
    constructor(
        public id: number,
        public project_id: number,
        public column_id: number,
        public name: string,
        public description: string,
        public done: boolean,
        // public label_id: number | null,
        public created_at: string,
        public subtasks: Subtask[]
    ) {
        this.id = id;
        this.project_id = project_id;
        this.column_id = column_id;
        this.name = name;
        this.description = description;
        this.done = Boolean(done);
        // this.label_id = label_id;
        this.created_at = created_at;
        this.subtasks = subtasks;
    }
}

export interface TaskDraft {
    project_id: number,
    column_id: number,
    name: string;
    description: string;
    done: boolean;
    // label_id: number;
    subtasks: SubtaskDraft[]
}
export class Subtask {
    constructor(
        public id: number,
        public task_id: number,
        public name: string,
        public done: number,
        public created_at: string
    ) {
        this.id = id;
        this.task_id = task_id;
        this.name = name;
        this.done = done;
        this.created_at = created_at;
    }
}
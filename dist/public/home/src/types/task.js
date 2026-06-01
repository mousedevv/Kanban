export class Task {
    constructor(id, project_id, column_id, name, description, done, 
    // public label_id: number | null,
    created_at, subtasks) {
        this.id = id;
        this.project_id = project_id;
        this.column_id = column_id;
        this.name = name;
        this.description = description;
        this.done = done;
        this.created_at = created_at;
        this.subtasks = subtasks;
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
//# sourceMappingURL=task.js.map
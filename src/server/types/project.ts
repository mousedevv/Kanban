import { Column } from "./column.js";

export class Project {
    constructor (
        public id: number,
        public UUID: string,
        public name: string,
        public description: string,
        public created_at: string,
        public columns: Column[]
    ) {
        this.id = id;
        this.UUID = UUID;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.columns = columns;
    }
}
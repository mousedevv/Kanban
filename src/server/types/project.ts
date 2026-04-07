export class Project {
    name: string;
    description: string;
    UUID: string;

    constructor(name: string, description: string, UUID: string) {
        this.name = name;
        this.description = description;
        this.UUID = UUID
    }
}
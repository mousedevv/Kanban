import { Project } from "./types/project.js";
import { Column } from "./types/column.js";

import { $, $$ } from "./dom/selectors.js";

import { columnService } from "./services/columnService.js";
import { taskService } from "./services/taskService.js";
import { projectService } from "./services/projectService.js";

const dom = {
    // Sidebar management
    sidebar: $(".sidebar")! as HTMLDivElement,
    menuBtn: $(".menuBtn")! as HTMLDivElement,

    // Columns
    content: {
        testBtn: $(".colSettingsBtn")! as HTMLDivElement,
        colsWrapper: $(".colsWrapper")! as HTMLDivElement,
    }
}

dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});

// Project placeholder - DEV
const projects = [
    {
        id: 1,
        UUID: '1e74c082-61d7-4c89-a2bf-8766b6fb4751',
        name: 'TEST PROJECT',
        description: 'Description of the test project',
        created_at: "Wed Apr 08 2026 21:22:09 GMT+0200 (czas środkowoeuropejski letni)",
        columns: [
            {
                id: 5,
                project_id: 1,
                name: 'To Do',
                tasks: [
                    {
                        id: 1,
                        project_id: 1,
                        column_id: 5,
                        name: 'Setup repo',
                        description: 'Initialize repository and base config',
                        done: 1,
                        label_id: null,
                        created_at: "Wed Apr 08 2026 21:29:14 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    },
                    {
                        id: 2,
                        project_id: 1,
                        column_id: 5,
                        name: 'Install dependencies',
                        description: 'Add required packages',
                        done: 0,
                        label_id: null,
                        created_at: "Wed Apr 08 2026 21:30:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            },
            {
                id: 6,
                project_id: 1,
                name: 'In Progress',
                tasks: [
                    {
                        id: 3,
                        project_id: 1,
                        column_id: 6,
                        name: 'Build layout',
                        description: 'Create main UI structure',
                        done: 0,
                        label_id: null,
                        created_at: "Wed Apr 08 2026 21:35:10 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: [
                            {
                                id: 1,
                                task_id: 3,
                                name: 'Header section',
                                done: 0,
                                created_at: "Wed Apr 08 2026 21:36:00 GMT+0200 (czas środkowoeuropejski letni)"
                            }
                        ]
                    }
                ]
            },
            {
                id: 7,
                project_id: 1,
                name: 'Done',
                tasks: [
                    {
                        id: 4,
                        project_id: 1,
                        column_id: 7,
                        name: 'Project setup',
                        description: 'Initial project structure created',
                        done: 1,
                        label_id: null,
                        created_at: "Wed Apr 08 2026 21:40:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            }
        ]
    },

    {
        id: 2,
        UUID: '7c2b9c11-2a5d-4d3f-9b8a-112233445566',
        name: 'KANBAN APP REDESIGN',
        description: 'Redesign and refactor of Kanban board',
        created_at: "Mon Apr 07 2026 10:14:33 GMT+0200 (czas środkowoeuropejski letni)",
        columns: [
            {
                id: 10,
                project_id: 2,
                name: 'Backlog',
                tasks: [
                    {
                        id: 5,
                        project_id: 2,
                        column_id: 10,
                        name: 'Analyze UI',
                        description: 'Review current UI problems',
                        done: 1,
                        label_id: null,
                        created_at: "Mon Apr 07 2026 10:20:11 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    },
                    {
                        id: 6,
                        project_id: 2,
                        column_id: 10,
                        name: 'Define architecture',
                        description: 'Plan services and structure',
                        done: 0,
                        label_id: null,
                        created_at: "Mon Apr 07 2026 10:22:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            },
            {
                id: 11,
                project_id: 2,
                name: 'Development',
                tasks: [
                    {
                        id: 7,
                        project_id: 2,
                        column_id: 11,
                        name: 'Refactor services',
                        description: 'Split logic into modules',
                        done: 0,
                        label_id: null,
                        created_at: "Mon Apr 07 2026 11:00:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: [
                            {
                                id: 2,
                                task_id: 7,
                                name: 'Column service',
                                done: 0,
                                created_at: "Mon Apr 07 2026 11:05:00 GMT+0200 (czas środkowoeuropejski letni)"
                            },
                            {
                                id: 3,
                                task_id: 7,
                                name: 'Task service',
                                done: 0,
                                created_at: "Mon Apr 07 2026 11:06:00 GMT+0200 (czas środkowoeuropejski letni)"
                            }
                        ]
                    }
                ]
            },
            {
                id: 12,
                project_id: 2,
                name: 'Done',
                tasks: [
                    {
                        id: 8,
                        project_id: 2,
                        column_id: 12,
                        name: 'Project scaffold',
                        description: 'Initial setup completed',
                        done: 1,
                        label_id: null,
                        created_at: "Mon Apr 07 2026 09:50:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            }
        ]
    },

    {
        id: 3,
        UUID: '9f3d1a22-88bb-4c11-91aa-998877665544',
        name: 'PERSONAL PRODUCTIVITY TOOL',
        description: 'Daily task tracking app',
        created_at: "Sun Apr 06 2026 18:45:00 GMT+0200 (czas środkowoeuropejski letni)",
        columns: [
            {
                id: 20,
                project_id: 3,
                name: 'Ideas',
                tasks: [
                    {
                        id: 9,
                        project_id: 3,
                        column_id: 20,
                        name: 'Dark mode concept',
                        description: 'Design theme system',
                        done: 0,
                        label_id: null,
                        created_at: "Sun Apr 06 2026 18:50:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    },
                    {
                        id: 10,
                        project_id: 3,
                        column_id: 20,
                        name: 'Notifications system',
                        description: 'Plan push notifications',
                        done: 0,
                        label_id: null,
                        created_at: "Sun Apr 06 2026 18:52:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            },
            {
                id: 21,
                project_id: 3,
                name: 'Active',
                tasks: [
                    {
                        id: 11,
                        project_id: 3,
                        column_id: 21,
                        name: 'UI structure',
                        description: 'Build base layout',
                        done: 0,
                        label_id: null,
                        created_at: "Sun Apr 06 2026 19:00:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    },
                    {
                        id: 12,
                        project_id: 3,
                        column_id: 21,
                        name: 'State management',
                        description: 'Handle global state',
                        done: 0,
                        label_id: null,
                        created_at: "Sun Apr 06 2026 19:05:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            },
            {
                id: 22,
                project_id: 3,
                name: 'Done',
                tasks: [
                    {
                        id: 13,
                        project_id: 3,
                        column_id: 22,
                        name: 'Project init',
                        description: 'Created base app structure',
                        done: 1,
                        label_id: null,
                        created_at: "Sun Apr 06 2026 18:46:00 GMT+0200 (czas środkowoeuropejski letni)",
                        subtasks: []
                    }
                ]
            }
        ]
    }
];


projectService.initProjects(projects);
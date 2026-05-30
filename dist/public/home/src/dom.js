import { $ } from "../../utils/dom/selectors.js";
export const dom = {
    // Sidebar management
    sidebar: $(".sidebar"),
    menuBtn: $(".menuBtn"),
    logoutBtn: $(".logoutBtn"),
    // Project navigation
    projectBtnWrapper: $(".projectBtnWrapper"),
    projectsWrapper: $(".projectsWrapper"),
    // Windows
    windows: {
        wrapper: $(".windowsWrapper"),
        addTask: {
            wrapper: $(".addTaskWindow"),
            form: $(".addTaskForm"),
            closeBtn: $(".addTaskWindow .closeBtn"),
            name: $("#addTaskName"),
            description: $("#addTaskDescription"),
            column: $("#addTaskColumn"),
            subtasksWrapper: $(".addTaskSubtasksWrapper"),
            addSubtaskBtn: $(".addTaskAddSubtaskBtn"),
        },
        addColumn: {
            wrapper: $(".addColumnWindow"),
            form: $(".addColumnForm"),
            closeBtn: $(".addColumnWindow .closeBtn"),
            name: $("#addColumnName"),
        },
        createProject: {
            wrapper: $(".createProjectWindow"),
            form: $(".createProjectForm"),
            closeBtn: $(".createProjectWindow .closeBtn"),
            name: $("#createProjectName"),
            description: $("#createProjectDescription"),
        },
        projectSettings: {
            wrapper: $(".projectSettingsWindow"),
            form: $(".projectSettingsForm"),
            closeBtn: $(".projectSettingsWindow .closeBtn"),
            name: $("#projectSettingsName"),
            description: $("#projectSettingsDescription"),
            deleteBtn: $(".projectSettingsDeleteBtn"),
        },
    },
};
//# sourceMappingURL=dom.js.map
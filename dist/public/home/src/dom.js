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
        displayTask: {
            wrapper: $(".displayTaskWindow"),
            form: $(".displayTaskForm"),
            closeBtn: $(".displayTaskWindow .closeBtn"),
            name: $(".displayTaskTaskName"),
            description: $("#displayTaskDescription"),
            column: $("#displayTaskColumn"),
            subtasksWrapper: $(".displayTaskSubtasksWrapper"),
            addSubtaskBtn: $(".displayTaskAddSubtaskBtn"),
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
            deleteBtn: $(".deleteProjectBtn"),
        },
    },
    savePopup: {
        wrapper: $(".saveChangesPopup"),
        saveBtn: $(".saveChangesBtn"),
        discardBtn: $(".discardChangesBtn"),
    },
};
//# sourceMappingURL=dom.js.map
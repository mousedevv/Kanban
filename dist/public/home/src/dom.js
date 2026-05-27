import { $ } from "../../utils/dom/selectors.js";
export const dom = {
    // Sidebar management
    sidebar: $(".sidebar"),
    menuBtn: $(".menuBtn"),
    logoutBtn: $(".logoutBtn"),
    // Project navigation
    projectBtnWrapper: $(".projectBtnWrapper"),
    projectsWrapper: $(".projectsWrapper"),
    // Columns
    content: {
        testBtn: $(".colSettingsBtn"),
        colsWrapper: $(".colsWrapper"),
    },
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
    },
};
//# sourceMappingURL=dom.js.map
import { $ } from "../../utils/dom/selectors.js";

export const dom = {
    // Sidebar management
    sidebar: $(".sidebar")! as HTMLDivElement,
    menuBtn: $(".menuBtn")! as HTMLDivElement,
    logoutBtn: $(".logoutBtn")! as HTMLButtonElement,

    // Project navigation
    projectBtnWrapper: $(".projectBtnWrapper")! as HTMLDivElement,
    projectsWrapper: $(".projectsWrapper")! as HTMLDivElement,

    // Columns
    content: {
        testBtn: $(".colSettingsBtn")! as HTMLDivElement,
        colsWrapper: $(".colsWrapper")! as HTMLDivElement,
    },

    // Windows
    windows: {
        wrapper: $(".windowsWrapper")! as HTMLDivElement,
        addTask: {
            wrapper: $(".addTaskWindow")! as HTMLDivElement,
            form: $(".addTaskForm") as HTMLFormElement,
            closeBtn: $(".addTaskWindow .closeBtn")! as HTMLButtonElement,
            name: $("#addTaskName")! as HTMLInputElement,
            description: $("#addTaskDescription")! as HTMLTextAreaElement,
            column: $("#addTaskColumn")! as HTMLSelectElement,
            subtasksWrapper: $(".addTaskSubtasksWrapper")! as HTMLDivElement,
            addSubtaskBtn: $(".addTaskAddSubtaskBtn") as HTMLButtonElement,
        },
        addColumn: {
            wrapper: $(".addColumnWindow")! as HTMLDivElement,
            form: $(".addColumnForm") as HTMLFormElement,
            closeBtn: $(".addColumnWindow .closeBtn")! as HTMLButtonElement,
            name: $("#addColumnName")! as HTMLInputElement,
        },
    },
};

import { $ } from "../../utils/dom/selectors.js";

export const dom = {
    // Sidebar management
    sidebar: $(".sidebar")! as HTMLDivElement,
    menuBtn: $(".menuBtn")! as HTMLDivElement,
    logoutBtn: $(".logoutBtn")! as HTMLButtonElement,

    // Project navigation
    projectBtnWrapper: $(".projectBtnWrapper")! as HTMLDivElement,
    projectsWrapper: $(".projectsWrapper")! as HTMLDivElement,

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
        displayTask: {
            wrapper: $(".displayTaskWindow")! as HTMLDivElement,
            form: $(".displayTaskForm") as HTMLFormElement,
            closeBtn: $(".displayTaskWindow .closeBtn")! as HTMLButtonElement,
            name: $(".displayTaskTaskName")! as HTMLElement,
            description: $("#displayTaskDescription")! as HTMLTextAreaElement,
            column: $("#displayTaskColumn")! as HTMLSelectElement,
            subtasksWrapper: $(".displayTaskSubtasksWrapper")! as HTMLDivElement,
            addSubtaskBtn: $(".displayTaskAddSubtaskBtn") as HTMLButtonElement,
        },
        addColumn: {
            wrapper: $(".addColumnWindow")! as HTMLDivElement,
            form: $(".addColumnForm") as HTMLFormElement,
            closeBtn: $(".addColumnWindow .closeBtn")! as HTMLButtonElement,
            name: $("#addColumnName")! as HTMLInputElement,
        },
        createProject: {
            wrapper: $(".createProjectWindow")! as HTMLDivElement,
            form: $(".createProjectForm") as HTMLFormElement,
            closeBtn: $(".createProjectWindow .closeBtn")! as HTMLButtonElement,
            name: $("#createProjectName")! as HTMLInputElement,
            description: $("#createProjectDescription")! as HTMLTextAreaElement,
        },
        projectSettings: {
            wrapper: $(".projectSettingsWindow")! as HTMLDivElement,
            form: $(".projectSettingsForm") as HTMLFormElement,
            closeBtn: $(".projectSettingsWindow .closeBtn")! as HTMLButtonElement,
            name: $("#projectSettingsName") as HTMLInputElement | null,
            description: $("#projectSettingsDescription") as HTMLTextAreaElement | null,
            deleteBtn: $(".deleteProjectBtn")! as HTMLButtonElement,
        },
    },
    savePopup: {
        wrapper: $(".saveChangesPopup")! as HTMLDivElement,
        saveBtn: $(".saveChangesBtn")! as HTMLButtonElement,
        discardBtn: $(".discardChangesBtn")! as HTMLButtonElement,
    },
};
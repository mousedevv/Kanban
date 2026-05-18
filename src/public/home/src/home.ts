import { $, $$ } from "../../utils/dom/selectors.js";

import { projectService } from "./services/projectService.js";

export const dom = {
    // Sidebar management
    sidebar: $(".sidebar")! as HTMLDivElement,
    menuBtn: $(".menuBtn")! as HTMLDivElement,
    logoutBtn: $(".logoutBtn")! as HTMLButtonElement,

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
            // columnOptions: $$("#addTaskColumn option") as HTMLOptionElement[],
            // submitBtn: $(".addTaskSubmitBtn")! as HTMLButtonElement,
        }
    }
}

dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});

dom.logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "GET" });

    window.location.href = "/welcome";
});

projectService.initProjects();
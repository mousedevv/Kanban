import { Project } from "./types/project.js";
import { Column } from "./types/column.js";

import { $, $$ } from "../../utils/dom/selectors.js";

import { columnService } from "./services/columnService.js";
import { taskService } from "./services/taskService.js";
import { projectService } from "./services/projectService.js";

const dom = {
    // Sidebar management
    sidebar: $(".sidebar")! as HTMLDivElement,
    menuBtn: $(".menuBtn")! as HTMLDivElement,
    logoutBtn: $(".logoutBtn")! as HTMLButtonElement,

    // Columns
    content: {
        testBtn: $(".colSettingsBtn")! as HTMLDivElement,
        colsWrapper: $(".colsWrapper")! as HTMLDivElement,
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
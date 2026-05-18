import { $ } from "../../utils/dom/selectors.js";
import { projectService } from "./services/projectService.js";
export const dom = {
    // Sidebar management
    sidebar: $(".sidebar"),
    menuBtn: $(".menuBtn"),
    logoutBtn: $(".logoutBtn"),
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
            addSubtaskBtn: $(".addTaskAddSubtaskBtn")
        }
    }
};
dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});
dom.logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "GET" });
    window.location.href = "/welcome";
});
projectService.initProjects();
//# sourceMappingURL=home.js.map
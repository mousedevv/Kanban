import { $ } from "./dom/selectors.js";
import { projectService } from "./services/projectService.js";
const dom = {
    // Sidebar management
    sidebar: $(".sidebar"),
    menuBtn: $(".menuBtn"),
    logoutBtn: $(".logoutBtn"),
    // Columns
    content: {
        testBtn: $(".colSettingsBtn"),
        colsWrapper: $(".colsWrapper"),
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
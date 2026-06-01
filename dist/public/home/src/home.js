import { dom } from "./dom.js";
import { notification } from "../../utils/notification.js";
import { UI } from "./UI/UI.js";
import { saveManager } from "./saves/saveManager.js";
dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});
dom.logoutBtn.addEventListener("click", async () => {
    try {
        await fetch("/api/logout", { method: "GET" });
        window.location.href = "/welcome";
    }
    catch (e) {
        notification("Error occurred while logging out - try again later!", "error");
        return;
    }
});
// Prevent reloading the page if there are unsaved changes
window.addEventListener("beforeunload", e => {
    if (saveManager.saved)
        return;
    e.preventDefault();
});
await UI.init();
// DEBUG
// saveManager.enterUnsavedState({
//     project: UI.activeProject!,
//     type: "edit",
//     target: "project",
//     delta: {},
// });
// DEBUG
// @ts-expect-error
window.dom = dom;
// @ts-expect-error
window.saveManager = saveManager;
// @ts-expect-error
window.UI = UI;
//# sourceMappingURL=home.js.map
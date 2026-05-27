import { dom } from "./dom.js";
import { notification } from "../../utils/notification.js";
import { UI } from "./UI/UI.js";

dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});

dom.logoutBtn.addEventListener("click", async () => {
    try {
        await fetch("/api/logout", { method: "GET" });
        window.location.href = "/welcome";
    } catch (e) {
        notification("Error occurred while logging out - try again later!", "error");
        return;
    }
});

UI.init();

// DEBUG
// @ts-expect-error
window.dom = dom;
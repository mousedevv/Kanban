import { notification } from "../../../../utils/notification.js";
import { dom } from "../../dom.js";
import { columnService } from "../../services/columnService.js";
import { UI } from "../UI.js";

dom.windows.addColumn.form.addEventListener("submit", async e => {
    e.preventDefault();

    const name = dom.windows.addColumn.name.value;

    if (!name) return;

    const column = await columnService.addColumn(name);

    if (!column) {
        notification("Error occurred while adding the column - try again later!", "error");
        return;
    }

    // Close add column window and clear input
    closeAddColumnWindow();
});

// Close
dom.windows.addColumn.closeBtn.addEventListener("click", () => {
    closeAddColumnWindow();
});

function closeAddColumnWindow() {
    dom.windows.addColumn.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");
    // Clear input
    dom.windows.addColumn.name.value = "";
}
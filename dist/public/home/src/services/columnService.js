import { confirmPopup, notification } from '../../../utils/notification.js';
import { Column } from '../types/column.js';
import { UI } from '../UI/UI.js';
export const columnService = {
    columnMenuOptions: [
        {
            name: 'Delete column',
            event: async function (column) {
                const confirmation = await confirmPopup();
                if (!confirmation)
                    return;
                console.log("Deleting column " + column.name);
                columnService.deleteColumn(column);
            }
        }
    ],
    createDOMElement(column) {
        // <div class="col">
        //     <div class="titleRow">
        //         <div class="colTitle" contenteditable>Column 1 title</div>
        //         <button class="btn colSettingsBtn flex" id="col1settings">☰</button>
        //     </div>
        //     <div class="colSeparator"></div>
        // </div>
        const col = document.createElement('div');
        col.classList.add('col');
        const titleRow = document.createElement('div');
        titleRow.classList.add('titleRow');
        const colTitle = document.createElement('div');
        colTitle.classList.add('colTitle');
        colTitle.contentEditable = 'true';
        colTitle.textContent = column.name;
        const colSettingsBtn = document.createElement('button');
        colSettingsBtn.classList.add('btn', 'colSettingsBtn', 'flex');
        colSettingsBtn.textContent = '☰';
        this.createColumnMenu(column, colSettingsBtn);
        titleRow.appendChild(colTitle);
        titleRow.appendChild(colSettingsBtn);
        const colSeparator = document.createElement('div');
        colSeparator.classList.add('colSeparator');
        col.appendChild(titleRow);
        col.appendChild(colSeparator);
        return col;
    },
    createColumnMenu(column, columnMenuBtn) {
        const colMenu = document.createElement('div');
        colMenu.classList.add('colMenu');
        this.columnMenuOptions.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('colMenuOption');
            optionEl.textContent = option.name;
            optionEl.addEventListener('click', () => option.event(column));
            colMenu.appendChild(optionEl);
        });
        tippy(columnMenuBtn, {
            interactive: true,
            animation: "shift-away",
            duration: 250,
            arrow: false,
            placement: "right-end",
            content: colMenu,
        });
    },
    async addColumn(name) {
        try {
            const res = await fetch("/api/project/add-column", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_id: UI.activeProject.id, name: name }),
            });
            const rJ = await res.json();
            const column = new Column(rJ.id, rJ.project_id, rJ.name, []);
            // Add new column to activeProject columns and redraw
            UI.activeProject.columns.push(column);
            UI.draw(UI.activeProject);
            return column;
        }
        catch (e) {
            notification("Error occurred while adding the column - try again later!", "error");
            return;
        }
    },
    deleteColumn(column) {
        UI.activeProject.columns = UI.activeProject.columns.filter(col => col.id !== column.id);
        UI.draw(UI.activeProject);
    },
};
//# sourceMappingURL=columnService.js.map
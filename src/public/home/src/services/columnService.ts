declare const tippy: typeof import('tippy.js').default;

import { confirmPopup } from '../../../utils/notification.js';
import { saveManager } from '../saves/saveManager.js';
import { Column } from '../types/column.js';
import { UI } from '../UI/UI.js';

export const columnService = {
    columnMenuOptions: [
        {
            name: 'Delete column',
            event: async function (column: Column) {
                const confirmation = await confirmPopup();
                if (!confirmation) return;

                console.log("Deleting column " + column.name);
                saveManager.addChange({
                    project: UI.activeProject!,
                    type: "delete",
                    target: "column",
                    delta: {
                        column_id: column.id
                    }
                });

                // Change column locally
                UI.activeProject!.columns = UI.activeProject!.columns.filter(col => col.id !== column.id);

                UI.draw(UI.activeProject!);
            }
        }
    ],

    createDOMElement(column: Column): HTMLDivElement {
        const col = document.createElement('div');
        col.classList.add('col');

        const titleRow = document.createElement('div');
        titleRow.classList.add('titleRow');

        const colTitle = document.createElement('div');
        colTitle.classList.add('colTitle');
        colTitle.contentEditable = 'true';
        colTitle.textContent = column.name;
        colTitle.addEventListener('blur', () => {
            // Save change if name was changed, otherwise do nothing
            if (colTitle.textContent === column.name) return;
            saveManager.addChange({
                project: UI.activeProject!,
                type: "edit",
                target: "column",
                delta: {
                    name: colTitle.textContent!,
                    column_id: column.id,
                }
            });

            column.name = colTitle.textContent!;
        });

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

    createColumnMenu(column: Column, columnMenuBtn: HTMLButtonElement) {
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
}
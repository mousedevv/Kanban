export const columnService = {
    columnMenuOptions: [
        {
            name: 'Delete column',
            event: function () {
                // DEBUG
                console.log("Deleting column: " + this.name);
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
        this.createColumnMenu(colSettingsBtn);
        titleRow.appendChild(colTitle);
        titleRow.appendChild(colSettingsBtn);
        const colSeparator = document.createElement('div');
        colSeparator.classList.add('colSeparator');
        col.appendChild(titleRow);
        col.appendChild(colSeparator);
        return col;
    },
    createColumnMenu(columnMenuBtn) {
        const colMenu = document.createElement('div');
        colMenu.classList.add('colMenu');
        this.columnMenuOptions.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('colMenuOption');
            optionEl.textContent = option.name;
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
};
//# sourceMappingURL=columnService.js.map
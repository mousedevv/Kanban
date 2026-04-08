"use strict";
const dom = {
    sidebar: document.querySelector(".sidebar"),
    menuBtn: document.querySelector(".menuBtn"),
};
dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});
// Project placeholder - DEV
const project = {};
// function toggleMenu(btn) {
//     const menu = btn.nextElementSibling;
//     menu.classList.toggle("active");
//   }

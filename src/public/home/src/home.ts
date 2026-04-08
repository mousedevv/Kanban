const dom = {
    sidebar: document.querySelector(".sidebar")! as HTMLDivElement,
    menuBtn: document.querySelector(".menuBtn")! as HTMLDivElement,
}

dom.menuBtn.addEventListener("click", () => {
    dom.sidebar.classList.toggle("active");
});

// Project placeholder - DEV
const project = {

}

// function toggleMenu(btn) {
//     const menu = btn.nextElementSibling;
//     menu.classList.toggle("active");
//   }
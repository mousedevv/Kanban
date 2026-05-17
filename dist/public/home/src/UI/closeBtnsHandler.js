import { dom } from "../home.js";
console.log('xdd');
dom.windows.addTask.closeBtn.addEventListener("click", () => {
    console.log("test");
    dom.windows.addTask.wrapper.classList.add("hidden");
    dom.windows.wrapper.classList.add("hidden");
});
export default {};
//# sourceMappingURL=closeBtnsHandler.js.map
const loginBtn = document.querySelector(".loginBtn");
const registerBtn = document.querySelector(".registerBtn");
if (document.cookie) {
    window.location.href = "../home";
}
loginBtn.addEventListener("click", () => {
    window.location.href = "../auth/login";
});
registerBtn.addEventListener("click", () => {
    window.location.href = "../auth/register";
});
export {};
//# sourceMappingURL=welcome.js.map
const loginBtn = document.querySelector(".loginBtn") as HTMLButtonElement;
const registerBtn = document.querySelector(".registerBtn") as HTMLButtonElement;

if (document.cookie) {
    window.location.href = "../home";
}

loginBtn.addEventListener("click", () => {
    window.location.href = "../login";
});
registerBtn.addEventListener("click", () => {
    window.location.href = "../register";
});
"use strict";
const loginBtn = document.querySelector(".loginBtn");
const registerBtn = document.querySelector(".registerBtn");
if (document.cookie) {
    window.location.href = "../home";
}
loginBtn.addEventListener("click", () => {
    window.location.href = "../login/login";
});
registerBtn.addEventListener("click", () => {
    window.location.href = "../login/register";
});

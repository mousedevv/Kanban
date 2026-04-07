const $ = (selector: string) => document.querySelector(selector)! as HTMLElement;

import { notification } from "../../../utils/notification.js";
import { saveUserToLocalStorage } from "../../../cookiesUtils/userDataLocalStorage.js";

const dom = {
    form: $(".login") as HTMLFormElement,
    username: $("#username") as HTMLInputElement,
    password: $("#password") as HTMLInputElement,
    confirmBtn: $(".loginBtn") as HTMLButtonElement,
};

dom.form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = dom.username.value;
    const password = dom.password.value;

    // Fields validation
    // 1. Check empty fields
    if ([username, password].some(v => v.trim() === "")) {
        notification("Please fill in all the fields!", "warning");
        return;
    }

    // Limit requests - disable button for 1.5s after request
    dom.confirmBtn.disabled = true;
    dom.confirmBtn.style.filter = "blur(2px)";
    dom.confirmBtn.classList.remove("animateOnHover");
    setTimeout(() => {
        dom.confirmBtn.disabled = false;
        dom.confirmBtn.style.filter = "none";
        dom.confirmBtn.classList.add("animateOnHover");
    }, 1.5 * 1000);

    // window.location.origin to prevent fetching from 
    // "login/login/api/login" (relative path)
    const res = await fetch(window.location.origin + "/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    // Handle errors
    if (res.status === 403) {
        notification("Login failed - check your credentials!", "warning");
        return;
    } else if (res.status === 429) {
        notification("Too many attempts - try again later!", "warning");
        return;
    } else if (!res.ok) {
        notification("Something went wrong - try again later!", "warning");
        return;
    }

    const data = await res.json();

    saveUserToLocalStorage(data.username, data.UUID);

    window.location.href = "/home";
});
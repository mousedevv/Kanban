const $ = (selector) => document.querySelector(selector);
import { notification } from "../../../utils/notification.js";
import { saveUserToLocalStorage } from "../../../cookiesUtils/userDataLocalStorage.js";
const USERNAME_REGEX = /^(?=.*[A-Za-z]).{3,20}$/;
const PASSWORD_REGEX = /^\S{8,}$/;
const dom = {
    form: $(".register"),
    username: $("#username"),
    password: $("#password"),
    confirmPassword: $("#confirmPassword"),
    confirmBtn: $(".registerBtn"),
};
dom.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = dom.username.value;
    const password = dom.password.value;
    const confirmPassword = dom.confirmPassword.value;
    // Fields validation
    // 1. Check empty fields
    if ([username, password, confirmPassword].some(v => v.trim() === "")) {
        notification("Please fill in all the fields!", "warning");
        return;
    }
    // 2. Username: min 3 chars + at least 1 letter
    if (!USERNAME_REGEX.test(username)) {
        notification("Username must be at least 3 characters and contain a letter!", "warning");
        return;
    }
    // 3. Password: no spaces + min 8 chars
    if (!PASSWORD_REGEX.test(password)) {
        notification("Password must be at least 8 characters and contain no spaces!", "warning");
        return;
    }
    // 4. Confirm password
    if (password !== confirmPassword) {
        notification("Passwords must match!", "warning");
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
    // "login/register/api/register" (relative path)
    const res = await fetch(window.location.origin + "/api/register", {
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
    if (res.status === 409) {
        notification("Username is taken - try another one!", "warning");
        return;
    }
    else if (res.status === 429) {
        notification("Too many attempts - try again later!", "warning");
        return;
    }
    else if (!res.ok) {
        notification("Something went wrong - try again later!", "warning");
        return;
    }
    const data = await res.json();
    saveUserToLocalStorage(data.username, data.UUID);
    window.location.href = "/home";
});
//# sourceMappingURL=register.js.map
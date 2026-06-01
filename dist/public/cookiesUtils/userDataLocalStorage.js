export function loadUserLocalStorage() {
    const username = localStorage.getItem("username");
    const userUUID = localStorage.getItem("userUUID");
    return { username, userUUID };
}
export function saveUserToLocalStorage(username, userUUID) {
    localStorage.setItem("username", username);
    localStorage.setItem("userUUID", userUUID);
}
//# sourceMappingURL=userDataLocalStorage.js.map
export function loadUserLocalStorage() {
    const username = localStorage.getItem("username");
    const userUUID = localStorage.getItem("userUUID");
    return { username, userUUID };
}

export function saveUserToLocalStorage(username: string, userUUID: string) {
    localStorage.setItem("username", username);
    localStorage.setItem("userUUID", userUUID);
}


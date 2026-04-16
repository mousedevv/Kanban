export function setCookie(name, value, days) {
    if (!name || !value)
        return;
    const options = {
        name: value,
        path: "/",
    };
    if (days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to ms
        options.expires = d.toUTCString();
    }
    document.cookie = encodeCookie(options);
}
function encodeCookie(options) {
    if (!options)
        return "";
    let cookie = "";
    Object.entries(options).forEach(value => {
        cookie += `${encodeURIComponent(value[0])}=${encodeURIComponent(value[1])};`;
    });
    return cookie;
}
export function getCookie(name) {
    if (!name)
        return;
    const cookies = document.cookie.split(";");
    const searchedCookie = cookies.find(cookie => cookie.trim().split("=")[0] === name);
    if (searchedCookie)
        return searchedCookie.trim();
}
export function deleteCookie(name, path = "./") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}
//# sourceMappingURL=cookiesUtils.js.map
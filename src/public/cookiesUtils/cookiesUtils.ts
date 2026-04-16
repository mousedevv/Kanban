import { CookiesOptions } from "./types.js";

export function setCookie(name: string, value: string, days: number): void {
    if (!name || !value) return;

    const options: CookiesOptions = {
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

function encodeCookie(options: CookiesOptions): string {
    if (!options) return "";

    let cookie = "";

    Object.entries(options).forEach(value => {
        cookie += `${encodeURIComponent(value[0])}=${encodeURIComponent(value[1])};`;
    });

    return cookie;
}

export function getCookie(name: string): void | string {
    if (!name) return;

    const cookies = document.cookie.split(";");

    const searchedCookie = cookies.find(cookie => cookie.trim().split("=")[0] === name)

    if (searchedCookie) return searchedCookie.trim();
}

export function deleteCookie(name: string, path: string = "./"): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}
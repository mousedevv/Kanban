const TIME_TO_REDIRECT = 5; // in seconds
const HOME_PAGE_URL = "../../home";

import { Dom } from "../../types/types";

const dom: Dom = {
    timeToRedirect: document.querySelector(".timeToRedirect") as HTMLSpanElement,
};

let seconds = TIME_TO_REDIRECT;
const interval = setInterval(() => {
    seconds--;
    dom.timeToRedirect.textContent = `${seconds}...`;
    if (seconds <= 0) {
        clearInterval(interval);
        window.location.href = HOME_PAGE_URL;
    }
}, 1000);
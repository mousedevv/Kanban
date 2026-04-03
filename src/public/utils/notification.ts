declare const Swal: any;

const NOTIFICATION_BACKGROUND = "#121A20";
// const CLOSE_NOTIFICATION_BTN_BACKGROUND = "#4464AD";

const SwalTop = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: NOTIFICATION_BACKGROUND,
    color: "#FFFFFF",
    // Unknown type of toast (function argument)
    // @ts-ignore
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

// Notification at the right top of page
export function notification(
    title: string, 
    type: "success" | "error" | "warning" | "info" | "question",
    text?: string, 
) {
    SwalTop.fire({
        icon: type,
        title: title,
        text: text
    });
}
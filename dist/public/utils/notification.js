const NOTIFICATION_BACKGROUND = "#121A20";
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
export function notification(title, type, text) {
    SwalTop.fire({
        icon: type,
        title: title,
        text: text
    });
}
export async function confirmPopup() {
    const result = await Swal.fire({
        title: "Are you sure you wanna proceed?",
        text: "You won't be able to revert this!",
        icon: "warning",
        background: NOTIFICATION_BACKGROUND,
        color: "#FFFFFF",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });
    return result.isConfirmed;
}
//# sourceMappingURL=notification.js.map
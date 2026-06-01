declare const Swal: any;

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

export async function confirmPopup(type: "delete" | "discardChanges" = "delete"): Promise<boolean> {
    let title, text;
    switch (type) {
        case "delete":
            title = "Are you sure you want to delete this?";
            text = "This action cannot be undone!";
            break;
        case "discardChanges":
            title = "Are you sure you want to discard unsaved changes?";
            text = "All unsaved changes will be lost!";
            break;
        default:
            title = "Are you sure?";
            text = "";
    }

    const result = await Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
        background: NOTIFICATION_BACKGROUND,
        color: "#FFFFFF",
    });

    return result.isConfirmed;
}
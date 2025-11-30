export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
};

export const formatTime = (timeString) => {
    if (!timeString) return "";
    // Asumiendo formato HH:MM:SS
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return new Intl.DateTimeFormat("es-MX", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(date);
};

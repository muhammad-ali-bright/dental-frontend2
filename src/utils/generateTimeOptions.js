export const generateTimeOptions = () => {
    const times = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0); // 12:00 AM

    for (let i = 0; i < 48; i++) { // 48 half-hour blocks in 24 hours
        const hour = start.getHours();
        const minutes = start.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinutes} ${ampm}`);
        start.setMinutes(start.getMinutes() + 30);
    }

    return times;
};
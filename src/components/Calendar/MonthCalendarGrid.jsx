const MonthCalendarGrid = ({ year, month, days, incidents, onEdit }) => {
    const getIncidentsForDate = (day) => {
        const date = new Date(year, month, day);
        return incidents.filter(i => new Date(i.appointmentDate).toDateString() === date.toDateString());
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-2">
            {/* Day names row */}
            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {dayNames.map((day, index) => (
                    <div key={index}>{day}</div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (day === null) return <div key={index} className="h-20 sm:h-24"></div>;

                    const incidentsForDay = getIncidentsForDate(day);

                    return (
                        <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 h-28 p-1 text-sm flex flex-col"
                        >
                            {/* Date number, centered */}
                            <div className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                {day}
                            </div>

                            {/* Events */}
                            <div className="space-y-[2px] text-[11px] text-gray-700 dark:text-gray-200 overflow-hidden px-4">
                                {incidentsForDay.slice(0, 3).map((i, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => onEdit(i)}
                                        className="flex items-center gap-1 truncate cursor-pointer px-1 py-[2px] rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                                        <span className="truncate text-[11px]">&nbsp;&nbsp;{i.patient.name} - {formatTime(i.appointmentDate)}</span>
                                    </div>
                                ))}

                                {incidentsForDay.length > 3 && (
                                    <div className="text-blue-600 text-[10px] mt-1">+{incidentsForDay.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthCalendarGrid;

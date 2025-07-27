const MonthCalendarGrid = ({ year, month, days, incidents }) => {
    const getIncidentsForDate = (day) => {
        const date = new Date(year, month, day);
        return incidents.filter(i => new Date(i.appointmentDate).toDateString() === date.toDateString());
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
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 text-sm h-28 overflow-hidden">
                            <div className="font-medium text-gray-800 dark:text-white">{day}</div>
                            <div className="text-xs mt-1 space-y-1">
                                {incidentsForDay.slice(0, 2).map((i, idx) => (
                                    <div key={idx} className="text-gray-600 dark:text-gray-300 truncate">• {i.title}</div>
                                ))}
                                {incidentsForDay.length > 2 && (
                                    <div className="text-blue-500 text-[10px] mt-1">+{incidentsForDay.length - 2} more</div>
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

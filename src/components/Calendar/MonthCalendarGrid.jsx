// MonthCalendarGrid.jsx
const MonthCalendarGrid = ({ days, incidents, onEdit, role, studentColors, onAdd, isDark }) => {
    const getIncidentsForDate = (dateObj) => {
        return incidents.filter(i =>
            new Date(i.appointmentDate).toDateString() === dateObj.toDateString()
        );
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-2">
            <div className={`grid grid-cols-7 text-center text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {dayNames.map((day, index) => (
                    <div key={index}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (day === null) return <div key={index} className="h-20 sm:h-24"></div>;

                    const incidentsForDay = getIncidentsForDate(day);

                    return (
                        <div
                            key={index}
                            className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'}
                                h-28 p-1 text-sm flex flex-col transition-colors duration-150
                                ${role === "Student" ? (isDark ? 'cursor-pointer hover:bg-gray-800' : 'cursor-pointer hover:bg-blue-50') : ""}`}
                            onClick={
                                role === 'Student'
                                    ? () => {
                                        const clickedDate = new Date(day);
                                        clickedDate.setHours(9, 0, 0, 0); // default to 9:00 AM
                                        onAdd(clickedDate);
                                    }
                                    : undefined
                            }
                        >
                            <div className={`text-center text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {day.getDate()}
                            </div>

                            <div className={`flex flex-col justify-start min-h-[4.5rem] space-y-[2px] text-[11px] px-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                {incidentsForDay.slice(0, 3).map((i, idx) => {
                                    const sid = i.patient?.studentId;
                                    const colorClass =
                                        role === 'Professor' ? studentColors[sid] || 'bg-gray-500' : 'bg-blue-500';

                                    return (
                                        <div
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (role === 'Student') onEdit(i);
                                            }}
                                            className={`flex items-center gap-1 truncate px-1 py-[2px] rounded text-[11px] ${role === 'Student'
                                                ? isDark
                                                    ? 'hover:bg-blue-800 cursor-pointer transition-colors'
                                                    : 'hover:bg-blue-100 cursor-pointer transition-colors'
                                                : ''}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${colorClass}`} />
                                            <span className="truncate text-[11px]">&nbsp;&nbsp;{i.patient.name} - {formatTime(i.appointmentDate)}</span>
                                        </div>
                                    );
                                })}

                                {incidentsForDay.length > 3 && (
                                    <div className={`text-[10px] mt-auto pt-1 font-medium flex justify-center ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                                        +{incidentsForDay.length - 3} more
                                    </div>
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

// WeekCalendarGridSchedule.jsx
import React from 'react';
import { format, addHours, startOfDay, differenceInMinutes } from 'date-fns';
import { parseLocalDateTime } from '../../utils/dateUtils';

function assignOverlapColumns(appointments) {
    const sorted = [...appointments].sort((a, b) =>
        new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );

    const columns = [];

    sorted.forEach((current) => {
        const currentStart = new Date(current.appointmentDate);
        const currentEnd = new Date(current.endTime || currentStart);

        let placed = false;

        for (let i = 0; i < columns.length; i++) {
            const lastInColumn = columns[i][columns[i].length - 1];
            const lastEnd = new Date(lastInColumn.endTime || lastInColumn.appointmentDate);

            if (currentStart >= lastEnd) {
                columns[i].push(current);
                placed = true;
                break;
            }
        }

        if (!placed) {
            columns.push([current]);
        }
    });

    const result = [];
    columns.forEach((col, colIdx) => {
        col.forEach((appt) => {
            result.push({
                ...appt,
                _columnIndex: colIdx,
                _totalColumns: columns.length,
            });
        });
    });

    return result;
}

const WeekCalendarGridSchedule = ({ currentDate, incidents, role, onAdd, onEdit, studentColors, isDark }) => {
    const slotHeight = 64;
    const startHour = 0;
    const endHour = 24;

    const timeSlots = Array.from({ length: endHour - startHour }, (_, i) => addHours(startOfDay(new Date()), i));

    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return new Date(date);
    });

    const getAppointmentsForSlot = (day, slot) => {
        return incidents.filter(i => {
            const appt = new Date(i.appointmentDate);
            return (
                appt.getFullYear() === day.getFullYear() &&
                appt.getMonth() === day.getMonth() &&
                appt.getDate() === day.getDate() &&
                appt.getHours() === slot.getHours()
            );
        });
    };

    return (
        <div className={`overflow-y-auto max-h-[800px] border rounded-lg ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>
            <div className={`grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-10 border-b text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                <div className={`p-2 border-r text-center ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>Time</div>
                {weekDays.map((day, idx) => (
                    <div key={idx} className={`p-2 border-r text-center ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                        {format(day, `d (EEE)`)}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[80px_repeat(7,1fr)]">
                {timeSlots.map((slot, slotIdx) => (
                    <React.Fragment key={slotIdx}>
                        <div className={`h-16 flex items-center justify-center text-xs ${isDark ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'} border`}>
                            {format(slot, 'h:mm a')}
                        </div>

                        {weekDays.map((day, dayIdx) => {
                            const appointments = getAppointmentsForSlot(day, slot);
                            const processedAppointments = assignOverlapColumns(appointments);
                            return (
                                <div
                                    key={dayIdx}
                                    className={`h-16 relative border ${isDark ? 'border-gray-600' : 'border-gray-200'} ${role === 'Student' ? (isDark ? 'hover:bg-gray-800' : 'hover:bg-blue-50') : ''} ${role === 'Student' ? 'cursor-pointer' : ''}`}
                                    onClick={
                                        role === 'Student'
                                            ? () => {
                                                const dateStr = day.toISOString().split('T')[0];
                                                const timeStr = format(slot, 'h:mm a');
                                                const dateTime = parseLocalDateTime(dateStr, timeStr);
                                                onAdd(dateTime);
                                            }
                                            : undefined
                                    }
                                >
                                    {processedAppointments.map((appt, i) => {
                                        const start = new Date(appt.appointmentDate);
                                        const end = new Date(appt.endTime || start);
                                        const duration = Math.max(15, differenceInMinutes(end, start));
                                        const height = (duration / 60) * slotHeight;

                                        const sid = appt.patient?.studentId;
                                        const colorClass = role === 'Professor' ? studentColors[sid] || 'bg-gray-500' : 'bg-blue-600';

                                        const width = 100 / appt._totalColumns;
                                        const leftOffset = appt._columnIndex * width;

                                        return (
                                            <div
                                                key={i}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (role == "Student") onEdit(appt);
                                                }}
                                                className={`absolute text-white text-xs p-1 rounded shadow overflow-hidden flex items-center z-[1] ${colorClass}`}
                                                style={{
                                                    top: `${(start.getMinutes() / 60) * slotHeight}px`,
                                                    height: `${height}px`,
                                                    width: `${width}%`,
                                                    left: `${leftOffset}%`,
                                                }}
                                            >
                                                &nbsp;&nbsp;&nbsp;{appt.patient?.name || appt.patientId} - {appt.title}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default WeekCalendarGridSchedule;

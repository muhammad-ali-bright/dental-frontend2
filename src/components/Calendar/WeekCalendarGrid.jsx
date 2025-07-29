// WeekCalendarGridSchedule.jsx
import React from 'react';
import { format, addHours, startOfDay, differenceInMinutes } from 'date-fns';

const WeekCalendarGridSchedule = ({ currentDate, incidents, role, onAdd, onEdit, studentColors }) => {
    const slotHeight = 64;
    const startHour = 0;
    const endHour = 24;

    const timeSlots = Array.from({ length: endHour - startHour }, (_, i) => addHours(startOfDay(new Date()), i));

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
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
        <div className="overflow-y-auto max-h-[800px] border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 text-sm font-semibold">
                <div className="p-2 border-r border-gray-300 dark:border-gray-700 text-center">Time</div>
                {weekDays.map((day, idx) => (
                    <div key={idx} className="p-2 border-r border-gray-300 dark:border-gray-700 text-center">
                        {format(day, `d (EEE)`)}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[80px_repeat(7,1fr)]">
                {timeSlots.map((slot, slotIdx) => (
                    <React.Fragment key={slotIdx}>
                        <div className="border border-gray-200 dark:border-gray-600 h-16 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300">
                            {format(slot, 'h:mm a')}
                        </div>

                        {weekDays.map((day, dayIdx) => {
                            const appointments = getAppointmentsForSlot(day, slot);
                            return (
                                <div
                                    key={dayIdx}
                                    className={`border border-gray-200 dark:border-gray-600 h-16 relative ${role === 'Student' ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800' : ''}`}
                                    onClick={
                                        role === 'Student'
                                            ? () => {
                                                const dateTime = new Date(day);
                                                dateTime.setHours(slot.getHours());
                                                dateTime.setMinutes(slot.getMinutes());
                                                dateTime.setSeconds(0);
                                                dateTime.setMilliseconds(0);

                                                if (appointments.length > 0) {
                                                    onEdit(appointments[0]);
                                                } else {
                                                    onAdd(dateTime);
                                                }
                                            }
                                            : undefined
                                    }
                                >
                                    {appointments.map((appt, i) => {
                                        const start = new Date(appt.appointmentDate);
                                        const end = new Date(appt.endTime || start);
                                        const duration = Math.max(15, differenceInMinutes(end, start));
                                        const height = (duration / 60) * slotHeight;

                                        const sid = appt.patient?.studentId;
                                        const colorClass = role === 'Professor' ? studentColors[sid] || 'bg-gray-500' : 'bg-blue-600';

                                        return (
                                            <div
                                                key={i}
                                                className={`absolute left-1 right-1 text-white text-xs p-1 rounded shadow overflow-hidden flex items-center z-[1] ${colorClass}`}
                                                style={{
                                                    top: `${(start.getMinutes() / 60) * slotHeight}px`,
                                                    height: `${height}px`,
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
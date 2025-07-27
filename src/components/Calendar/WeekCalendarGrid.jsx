import React from 'react';
import { format, addMinutes, startOfDay } from 'date-fns';

const WeekCalendarGridSchedule = ({ currentDate, incidents }) => {
    const slotHeight = 48; // Each 30 min block is 48px
    const startHour = 0;   // Start at 12 AM
    const endHour = 24;    // End at 12 AM next day

    // Generate 30-min time slots from 12 AM to 11:30 PM
    const timeSlots = Array.from(
        { length: (endHour - startHour) * 2 },
        (_, i) => addMinutes(startOfDay(new Date()), i * 30)
    );

    // Generate week starting from Sunday
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    const getAppointmentsForDayAndTime = (date, time) => {
        const targetTime = time.getHours() + time.getMinutes() / 60;
        return incidents.filter(i => {
            const appt = new Date(i.appointmentDate);
            return (
                appt.toDateString() === date.toDateString() &&
                Math.abs((appt.getHours() + appt.getMinutes() / 60) - targetTime) < 0.01
            );
        });
    };

    return (
        <div className="overflow-y-auto max-h-[800px] border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            {/* Header: Days */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 text-sm font-semibold">
                <div className="p-2 border-r border-gray-300 dark:border-gray-700 text-center">Time</div>
                {weekDays.map((day, idx) => (
                    <div key={idx} className="p-2 border-r border-gray-300 dark:border-gray-700 text-center">
                        {format(day, 'EEE, MMM d')}
                    </div>
                ))}
            </div>

            {/* Time grid */}
            <div className="relative">
                {timeSlots.map((time, rowIdx) => (
                    <div
                        key={rowIdx}
                        className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700"
                        style={{ height: `${slotHeight}px` }}
                    >
                        {/* Time label */}
                        <div className="border-r border-gray-200 dark:border-gray-700 text-xs text-right pr-2 pt-2 text-gray-500 dark:text-gray-400">
                            {format(time, 'h:mm a')}
                        </div>

                        {/* Grid cells */}
                        {weekDays.map((day, colIdx) => {
                            const appointments = getAppointmentsForDayAndTime(day, time);
                            return (
                                <div
                                    key={colIdx}
                                    className="border-r border-gray-200 dark:border-gray-700 relative hover:bg-blue-50 dark:hover:bg-gray-800"
                                >
                                    {appointments.map((appt, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute inset-1 bg-blue-500 text-white text-xs p-1 rounded shadow overflow-hidden"
                                            title={appt.title}
                                        >
                                            {appt.title}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekCalendarGridSchedule;

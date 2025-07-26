// src/components/Calendar/FullCalendarComponent.tsx
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { formatTime } from '../../utils/dateUtils';

const FullCalendarComponent = ({ incidents, onEventClick }) => {
    const events = incidents.map(incident => ({
        id: incident.id,
        title: incident.title,
        date: incident.appointmentDate,
        extendedProps: {
            patientId: incident.patientId
        }
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow border dark:border-gray-700">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                height="auto"
                eventClick={({ event }) => {
                    const { id, title, start, extendedProps } = event;
                    onEventClick?.({
                        id,
                        title,
                        date: start,
                        patientId: extendedProps.patientId
                    });
                }}
                eventContent={(arg) => (
                    <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">{arg.event.title}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                            {formatTime(arg.event.start)}
                        </p>
                    </div>
                )}
            />
        </div>
    );
};

export default FullCalendarComponent;

// components/Calendar/FullCalendarView.jsx
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const FullCalendarView = ({ incidents }) => {
    const events = incidents.map((incident) => ({
        id: incident.id,
        title: incident.title,
        start: incident.appointmentDate,
        end: incident.appointmentDate,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-fade-in-up">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                height="auto"
            />
        </div>
    );
};

export default FullCalendarView;

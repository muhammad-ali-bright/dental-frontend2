import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentModal from '../Appointments/AppointmentModal';
import MonthCalendarGrid from './MonthCalendarGrid';
import WeekCalendarGrid from './WeekCalendarGrid';
import { generateCalendarDays, getStartAndEndOfMonth, getStartAndEndOfWeek } from '../../utils/dateUtils';
import { updateIncidentAPI, createIncidentAPI } from '../../api/appointments';
import { parseLocalDateTime } from '../../utils/dateUtils';
import { toast } from 'react-hot-toast';

const CalendarView = () => {
  const {
    dropdownPatients,
    incidents,
    fetchIncidentsByRange,
    isDark
  } = useData();
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);

  const handleAdd = (slotTime) => {
    setSelectedAppointment(null);
    setSelectedSlot(slotTime);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    const amount = direction === 'next' ? 1 : -1;

    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + amount);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + amount * 7);
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    if (today.toDateString() !== currentDate.toDateString()) {
      setCurrentDate(today);
    }
  };

  const handleSaveAppointment = async (incidentData) => {
    try {
      const isEditing = !!selectedAppointment;
      const newStart = parseLocalDateTime(incidentData.date, incidentData.startTime);
      const newEnd = parseLocalDateTime(incidentData.date, incidentData.endTime);

      const studentAppointments = incidents.filter(i => i.patient?.studentId === user.id);

      const hasOverlap = studentAppointments.some((appt) => {
        const existingStart = new Date(appt.appointmentDate);
        const existingEnd = new Date(appt.endTime || existingStart);

        if (isEditing && appt.id === selectedAppointment.id) return false;

        return newStart < existingEnd && newEnd > existingStart;
      });

      if (user.role === 'Student' && hasOverlap) {
        toast.error("You already have an appointment in this time range.");
        return;
      }

      if (isEditing) {
        await updateIncidentAPI(selectedAppointment.id, incidentData);
        toast.success("Appointment updated successfully");
      } else {
        await createIncidentAPI(incidentData);
        toast.success("Appointment created successfully");
      }

      setIsModalOpen(false);
      setSelectedAppointment(null);
      setSelectedSlot(null);

      fetchCurrentRange();
    } catch (err) {
      console.error("Error saving incident:", err);
      toast.error("Failed to save incident");
    }
  };

  const fetchCurrentRange = () => {
    if (!currentDate || !view) return;

    let start, end;

    if (view === 'month') {
      ({ start, end } = getStartAndEndOfMonth(currentDate));
    } else {
      ({ start, end } = getStartAndEndOfWeek(currentDate));
    }

    if (!start || !end) return;

    fetchIncidentsByRange(start.toISOString(), end.toISOString());
  };

  useEffect(() => {
    fetchCurrentRange();
  }, [currentDate, view]);

  const studentColors = {};
  const colorPalette = [
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-pink-600',
    'bg-purple-600',
    'bg-indigo-600',
    'bg-red-600',
    'bg-teal-600',
  ];
  let colorIndex = 0;

  if (user?.role === 'Professor') {
    incidents.forEach((i) => {
      const sid = i.patient?.studentId;
      if (sid && !studentColors[sid]) {
        studentColors[sid] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
      }
    });
  }

  return (
    <div className={`rounded-lg shadow-sm border animate-fade-in-up ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-lg sm:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className={`px-3 py-1.5 text-sm rounded-md ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 hover:bg-blue-500'}`}>
            Today
          </button>
          <button onClick={() => setView('month')} className={`px-3 py-1.5 text-sm rounded-md ${view === 'month' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            Month
          </button>
          <button onClick={() => setView('week')} className={`px-3 py-1.5 text-sm rounded-md ${view === 'week' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            Week
          </button>
          <button onClick={() => navigateDate('prev')} aria-label="Previous month" className={`p-2 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <button onClick={() => navigateDate('next')} className={`p-2 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      <div className="p-0 sm:p-4">
        {view === 'month' ? (
          <MonthCalendarGrid
            year={year}
            month={month}
            days={days}
            incidents={incidents}
            onEdit={handleEdit}
            onAdd={handleAdd}
            role={user?.role}
            studentColors={studentColors}
            isDark = {isDark}
          />
        ) : (
          <WeekCalendarGrid
            currentDate={currentDate}
            incidents={incidents}
            role={user?.role}
            onAdd={handleAdd}
            onEdit={handleEdit}
            studentColors={studentColors}
            isDark = {isDark}
          />
        )}

        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
            setSelectedSlot(null);
          }}
          onSave={handleSaveAppointment}
          appointment={selectedAppointment}
          patients={dropdownPatients}
          selectedSlot={selectedSlot}
          isDark = {isDark}
        />
      </div>
    </div>
  );
};

export default CalendarView;
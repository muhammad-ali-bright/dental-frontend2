import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import AppointmentModal from '../Appointments/AppointmentModal';
import MonthCalendarGrid from './MonthCalendarGrid';
import WeekCalendarGrid from './WeekCalendarGrid';
import { generateCalendarDays, getStartAndEndOfMonth, getStartAndEndOfWeek } from '../../utils/dateUtils';
import { updateIncidentAPI, createIncidentAPI } from '../../api/appointments';
import { toast } from 'react-hot-toast';

const CalendarView = () => {
  const {
    dropdownPatients,
    incidents,
    fetchIncidentsByRange
  } = useData();

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
      if (selectedAppointment) {
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

  // Re-fetch on currentDate or view change
  useEffect(() => {
    fetchCurrentRange();
  }, [currentDate, view]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in-up">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1.5 text-sm rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-500">
            Today
          </button>
          <button onClick={() => setView('month')} className={`px-3 py-1.5 text-sm rounded-md ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>
            Month
          </button>
          <button onClick={() => setView('week')} className={`px-3 py-1.5 text-sm rounded-md ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>
            Week
          </button>
          <button onClick={() => navigateDate('prev')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={() => navigateDate('next')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-0 sm:p-4">
        {view === 'month' ? (
          <MonthCalendarGrid year={year} month={month} days={days} incidents={incidents} onEdit={handleEdit} />
        ) : (
          <WeekCalendarGrid
            currentDate={currentDate}
            incidents={incidents}
            onAdd={handleAdd}
            onEdit={handleEdit}
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
        />
      </div>
    </div>
  );
};

export default CalendarView;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { generateCalendarDays, formatTime } from '../../utils/dateUtils';
import { useData } from '../../contexts/DataContext';

const CalendarComponent = ({ incidents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const { getPatientById } = useData();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getIncidentsForDate = (day) => {
    const date = new Date(year, month, day);
    return incidents.filter(incident => {
      const incidentDate = new Date(incident.appointmentDate);
      return incidentDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
  };

  const handleDateHover = (day = null) => {
    if (day) {
      const date = new Date(year, month, day);
      setHoveredDate(date);
    } else {
      setHoveredDate(null);
    }
  };

  const selectedDateIncidents = selectedDate ? getIncidentsForDate(selectedDate.getDate()) : [];
  const hoveredDateIncidents = hoveredDate ? getIncidentsForDate(hoveredDate.getDate()) : [];
  const displayIncidents = hoveredDate ? hoveredDateIncidents : selectedDateIncidents;
  const displayDate = hoveredDate || selectedDate;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
    dark:border-gray-700 animate-fade-in-up">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all 
              duration-300 transform hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 
              transform hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        <div className="xl:col-span-2">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-10 sm:h-12"></div>;
              }

              const dayIncidents = getIncidentsForDate(day);
              const isSelected = selectedDate?.getDate() === day;
              const isHovered = hoveredDate?.getDate() === day;
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => handleDateHover(day)}
                  onMouseLeave={() => handleDateHover(null)}
                  className={`relative h-10 sm:h-12 p-1 text-xs sm:text-sm rounded-md transition-all duration-300 
                    transform hover:scale-105
                    ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 shadow-md' : ''}
                    ${isHovered && !isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : ''}
                    ${!isSelected && !isHovered ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                    ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold ring-2 ring-blue-300 dark:ring-blue-600' : ''}`}
                >
                  <div className="text-center text-gray-900 dark:text-white">{day}</div>
                  {dayIncidents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                        isSelected || isHovered ? 'bg-blue-600 dark:bg-blue-400 scale-125' : 'bg-blue-500'
                      }`}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 sticky top-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
              {displayDate ? (
                <>
                  Appointments for {displayDate.toLocaleDateString()}
                  {hoveredDate && (
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-2">(hover)</span>
                  )}
                </>
              ) : (
                'Select or hover a date to view appointments'
              )}
            </h3>

            {displayDate && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayIncidents.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">No appointments scheduled</p>
                ) : (
                  displayIncidents.map((incident, index) => {
                    const patient = getPatientById(incident.patientId);
                    return (
                      <div
                        key={incident.id}
                        className="bg-white dark:bg-gray-600 p-3 rounded-md shadow-sm transition-all duration-300 
                        transform hover:scale-105 hover:shadow-md animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start space-x-2">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">{patient?.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{incident.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                              {formatTime(incident.appointmentDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;

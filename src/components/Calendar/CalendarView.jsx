import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MonthCalendarGrid from './MonthCalendarGrid';
import WeekCalendarGridSchedule from './WeekCalendarGrid';
import { generateCalendarDays } from '../../utils/dateUtils';

const CalendarView = ({ incidents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in-up">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Today</button>
          <button onClick={() => setView('month')} className={`px-3 py-1.5 text-sm rounded-md ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>Month</button>
          <button onClick={() => setView('week')} className={`px-3 py-1.5 text-sm rounded-md ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>Week</button>
          <button onClick={() => navigateMonth('prev')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={() => navigateMonth('next')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div className="p-0 sm:p-4">
        {view === 'month' ? (
          <MonthCalendarGrid year={year} month={month} days={days} incidents={incidents} />
        ) : (
          <WeekCalendarGridSchedule currentDate={currentDate} incidents={incidents} />
        )}
      </div>
    </div>
  );
};

export default CalendarView;

import React from 'react';
import Layout from '../components/Layout/Layout';
import CalendarComponent from '../components/Calendar/CalendarComponent';
import { useData } from '../contexts/DataContext';

const CalendarPage = () => {
  const { incidents } = useData();

  const scrollToToday = () => {
    const todayButton = document.querySelector('#calendar-today-button');
    if (todayButton) todayButton.click();
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] relative">
        <div className="px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-0">
          <div className="mb-2 sm:mb-4 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
              View and manage appointments in calendar format
            </p>
          </div>
        </div>

        {/* Sticky Today Button */}
        <button
          onClick={scrollToToday}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300"
        >
          Today
        </button>

        {/* Fill vertical space */}
        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 pb-6">
          <CalendarComponent incidents={incidents} />
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;

import React from 'react';
import Layout from '../components/Layout/Layout';
import CalendarView from '../components/Calendar/CalendarView';
import { useData } from '../contexts/DataContext';

const CalendarPage = () => {
  const { incidents, isDark } = useData();

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Calendar
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage patient appointments and treatments
              </p>
            </div>
          </div>
        </div>

        <CalendarView incidents={incidents} isDark={isDark} />
      </div>
    </Layout>
  );
};

export default CalendarPage;
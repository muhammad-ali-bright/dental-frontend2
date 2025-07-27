import React from 'react';
import Layout from '../components/Layout/Layout';
import CalendarView from '../components/Calendar/CalendarView';
import { useData } from '../contexts/DataContext';

const CalendarPage = () => {
  const { incidents } = useData();

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Manage patient appointments and treatments</p>
            </div>
          </div>
        </div>

        <CalendarView incidents={incidents} />
      </div>
    </Layout>
  );
};

export default CalendarPage;
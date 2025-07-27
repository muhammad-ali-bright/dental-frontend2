import React from 'react';
import Layout from '../components/Layout/Layout';
import CalendarView from '../components/Calendar/CalendarView';
import { useData } from '../contexts/DataContext';

const CalendarPage = () => {
  const { incidents } = useData();

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <CalendarView incidents={incidents} />
      </div>
    </Layout>
  );
};

export default CalendarPage;
import React from 'react';
import CalendarComponent from './CalendarComponent';

const CalendarPage = ({ incidents }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 flex items-center px-6 bg-gray-900 text-white shadow-md">
        <h1 className="text-lg font-semibold">ENTNT Dental Center</h1>
        {/* Add your nav items like Dashboard, Patients, Logout, etc. here */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <CalendarComponent incidents={incidents} />
      </main>
    </div>
  );
};

export default CalendarPage;

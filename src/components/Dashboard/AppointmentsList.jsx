import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { fetchPatientByIdAPI } from '../../api/patients';

const AppointmentsList = ({ appointments, title, isDark }) => {
  const [patientMap, setPatientMap] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      const newMap = {};
      for (const apt of appointments) {
        const res = await fetchPatientByIdAPI(apt.patientId);
        newMap[apt.id] = res.data;
      }
      setPatientMap(newMap);
    };
    if (appointments.length) fetchPatients();
  }, [appointments]);

  const getStatusColor = (status) => {
    if (isDark) {
      switch (status) {
        case 'Scheduled': return 'bg-blue-900/20 text-blue-400';
        case 'In Progress': return 'bg-yellow-900/20 text-yellow-400';
        case 'Completed': return 'bg-green-900/20 text-green-400';
        case 'Cancelled': return 'bg-red-900/20 text-red-400';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch (status) {
        case 'Scheduled': return 'bg-blue-100 text-blue-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <div
      className={`
        rounded-lg shadow-sm border transition-colors
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      <div className={`px-4 sm:px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-base sm:text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      </div>

      <div className={`divide-y max-h-96 overflow-y-auto ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {appointments.length === 0 ? (
          <div className={`p-4 sm:p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm sm:text-base">No appointments scheduled</p>
          </div>
        ) : (
          appointments.map((appointment) => {
            const patient = patientMap[appointment.id];
            return (
              <div
                key={appointment.id}
                className={`p-3 sm:p-4 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {patient?.name || 'Unknown Patient'}
                      </p>
                      <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {appointment.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-left sm:text-right">
                      <p className={`text-xs sm:text-sm font-medium flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className={`text-xs sm:text-sm flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {formatTime(appointment.appointmentDate)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        appointment.status
                      )} self-start sm:self-center`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;

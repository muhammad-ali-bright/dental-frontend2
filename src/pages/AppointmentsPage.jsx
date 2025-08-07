import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import AppointmentModal from '../components/Appointments/AppointmentModal';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatTime } from '../utils/dateUtils';
import { createIncidentAPI, updateIncidentAPI, deleteIncidentAPI, updateIncidentStatusAPI } from '../api/appointments';
import PaginationFooter from "../components/Layout/PaginationFooter";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { todayIncidents, incidents, totalCount, filteredTotalCount, overdueCount, completedCount, dropdownPatients, fetchIncidents, isDark } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(undefined);

  // Pagination Settings
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredTotalCount / pageSize));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const delay = setTimeout(() => {
      reloadAppointments();
    }, 400);
    return () => clearTimeout(delay);
  }, [currentPage, pageSize, statusFilter, dateFilter, searchTerm]);

  const reloadAppointments = () => {
    fetchIncidents(currentPage, pageSize, statusFilter, dateFilter, searchTerm);
  };

  const handleAddIncident = () => {
    setSelectedIncident(undefined);
    setIsModalOpen(true);
  };

  const handleEditIncident = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleDeleteIncident = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteIncidentAPI(incidentId);
        toast.success('Appointment deleted successfully');

        // Go to previous page if this was the last item
        if (incidents.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          reloadAppointments();
        }

      } catch (err) {
        console.error('Failed to delete appointment:', err);
        toast.error('Could not delete appointment');
      }
    }
  };

  const handleSaveIncident = async (incidentData) => {
    try {
      if (selectedIncident) {
        await updateIncidentAPI(selectedIncident.id, incidentData);
        toast.success("Appointment updated successfully");
      } else {
        await createIncidentAPI(incidentData);
        toast.success("Appointment created successfully");
      }

      // Close modal, reset state, or refresh list
      setIsModalOpen(false);
      reloadAppointments();
    } catch (err) {
      console.error("Error saving incident:", err);
      toast.error("Failed to save incident");
    }
  };

  const handleQuickStatusUpdate = async (incidentId, newStatus) => {
    try {
      await updateIncidentStatusAPI(incidentId, { status: newStatus });
      toast.success('Appointment status updated');
      reloadAppointments();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Could not update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <Calendar className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Appointments
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage patient appointments and treatments
              </p>
            </div>
            {
              user.role == "Student" && <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAddIncident}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium 
                rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all 
                duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse-glow w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appointment
                </button>
              </div>
            }
          </div>
        </div>

        {/* Appointment Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCount}</div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Appointments</div>
          </div>
          <div className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{todayIncidents.length}</div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Today's Appointments</div>
          </div>
          <div className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedCount}</div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Completed</div>
          </div>
          <div className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueCount}</div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</div>
          </div>
        </div>

        <div
          className={`rounded-lg shadow-sm border animate-fade-in-up ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          style={{ animationDelay: '200ms' }}
        >
          <div className={`p-4 sm:p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative max-w-md flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md leading-5 sm:text-sm transition-all duration-300
          ${isDark ?
                      'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:placeholder-gray-300' :
                      'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:placeholder-gray-400'} 
          border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-2 text-sm rounded-md transition-all duration-300
            ${isDark ?
                        'border-gray-600 bg-gray-700 text-white' :
                        'border-gray-300 bg-white text-gray-900'} 
            border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="all">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-md transition-all duration-300
          ${isDark ?
                      'border-gray-600 bg-gray-700 text-white' :
                      'border-gray-300 bg-white text-gray-900'} 
          border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="overdue">Overdue</option>
                </select>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-sm rounded-md transition-all duration-300
          ${isDark ?
                      'border-gray-600 bg-gray-700 text-white' :
                      'border-gray-300 bg-white text-gray-900'} 
          border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>{size} / page</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {incidents.map((incident, index) => {
                const patient = incident.patient;
                return (
                  <div
                    key={incident.id}
                    className={`p-4 transition-all duration-300 animate-fade-in-up ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div
                          className={`p-2 rounded-md transition-all duration-300 hover:shadow-md ${isDark ? 'hover:bg-blue-900/20' : 'hover:bg-blue-50'
                            }`}
                        >
                          <div
                            className={`text-sm font-medium truncate transition-colors duration-300 ${isDark
                              ? 'text-white hover:text-blue-400'
                              : 'text-gray-900 hover:text-blue-600'
                              }`}
                          >
                            {patient?.name || 'Unknown Patient'}
                          </div>
                          <div className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {incident.title}
                          </div>
                          {incident.description && (
                            <div
                              className={`text-sm truncate ${isDark ? 'text-gray-500' : 'text-gray-400'
                                }`}
                            >
                              {incident.description}
                            </div>
                          )}
                        </div>

                        <div
                          className={`mt-2 grid grid-cols-2 gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(incident.appointmentDate)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(incident.appointmentDate)}
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span>{' '}
                            {incident.cost ? `$${incident.cost.toFixed(2)}` : '-'}
                          </div>
                          <div>{/* Files placeholder */}</div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full flex items-center transition-all duration-300 hover:scale-105 ${getStatusColor(
                              incident.status
                            )}`}
                          >
                            {getStatusIcon(incident.status)}
                            <span className="ml-1">{incident.status}</span>
                          </span>

                          <div className="flex space-x-1">
                            {incident.status === 'Scheduled' && (
                              <button
                                onClick={() => handleQuickStatusUpdate(incident.id, 'In Progress')}
                                className={`px-2 py-1 text-xs rounded transition-colors ${isDark
                                  ? 'bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/40'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  }`}
                              >
                                Start
                              </button>
                            )}
                            {incident.status === 'In Progress' && (
                              <button
                                onClick={() => handleQuickStatusUpdate(incident.id, 'Completed')}
                                className={`px-2 py-1 text-xs rounded transition-colors ${isDark
                                  ? 'bg-green-900/20 text-green-400 hover:bg-green-900/40'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditIncident(incident)}
                          className={`transition-all duration-300 transform hover:scale-110 p-2 rounded-md ${isDark
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                            : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                            }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIncident(incident.id)}
                          className={`transition-all duration-300 transform hover:scale-110 p-2 rounded-md ${isDark
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                            : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className={`min-w-full divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  {user.role !== "Student" && (
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                      Student
                    </th>
                  )}
                  {["Patient & Treatment", "Date & Time", "Status", "Cost"].map((heading) => (
                    <th key={heading} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                      {heading}
                    </th>
                  ))}
                  {user.role === "Student" && (
                    <>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Quick Actions
                      </th>
                      <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Actions
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className={`${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {incidents.map((incident, index) => {
                  const patient = incident.patient;
                  return (
                    <tr
                      key={incident.id}
                      className={`transition-all duration-300 animate-fade-in-up ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      {user?.role !== "Student" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`p-2 rounded-md transition-all duration-300 hover:shadow-md ${isDark ? 'hover:bg-blue-900/20' : 'hover:bg-blue-50'}`}>
                            <div className={`text-sm font-medium ${isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors duration-300`}>
                              {incident.user?.name || 'Unknown User'}
                            </div>
                            <div className={`text-sm max-w-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {incident.user?.email}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Patient & Treatment */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`p-2 rounded-md transition-all duration-300 hover:shadow-md ${isDark ? 'hover:bg-blue-900/20' : 'hover:bg-blue-50'}`}>
                          <div className={`text-sm font-medium ${isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors duration-300`}>
                            {patient?.name || 'Unknown Patient'}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{incident.title}</div>
                          {incident.description && (
                            <div className={`text-sm max-w-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {incident.description}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(incident.appointmentDate)}
                        </div>
                        <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(incident.appointmentDate)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105 flex items-center w-fit ${getStatusColor(incident.status)}`}>
                          {getStatusIcon(incident.status)}
                          <span className="ml-1">{incident.status}</span>
                        </span>
                      </td>

                      {/* Cost */}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {incident.cost ? `$${incident.cost.toFixed(2)}` : '-'}
                      </td>

                      {/* Student Actions */}
                      {user.role === "Student" && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {incident.status === 'Scheduled' && (
                                <button
                                  onClick={() => handleQuickStatusUpdate(incident.id, 'In Progress')}
                                  className="px-2 py-1 text-xs rounded transition-colors bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/40"
                                >
                                  Start
                                </button>
                              )}
                              {incident.status === 'In Progress' && (
                                <button
                                  onClick={() => handleQuickStatusUpdate(incident.id, 'Completed')}
                                  className="px-2 py-1 text-xs rounded transition-colors bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditIncident(incident)}
                                className={`transition-all transform p-1 rounded-md hover:scale-110 ${isDark ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteIncident(incident.id)}
                                className={`transition-all transform p-1 rounded-md hover:scale-110 ${isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-900 hover:bg-red-50'}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>


          {incidents.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                No appointments found
              </p>
            </div>
          )}
        </div>

        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={filteredTotalCount}
          onPageChange={(page) => setCurrentPage(page)}
          isDark={isDark}
        />

        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveIncident}
          patients={dropdownPatients}
          appointment={selectedIncident}
          isDark={isDark}
        />
      </div>
    </Layout>
  );
};

export default AppointmentsPage;
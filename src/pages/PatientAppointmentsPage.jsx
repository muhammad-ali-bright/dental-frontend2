import React, { useState } from 'react';
import { Search, Calendar, Clock, DollarSign, FileText, Download, Star, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { formatDate, formatTime } from '../utils/dateUtils';
import { formatFileSize } from '../utils/fileUtils';

const PatientAppointmentsPage = () => {
  const { user } = useAuth();
  const { getPatientIncidents } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  const patientId = user?.patientId;
  const patientIncidents = patientId ? getPatientIncidents(patientId) : [];

  const filteredIncidents = patientIncidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const handleFeedbackSubmit = (appointmentId) => {
    // In a real app, this would send feedback to the server
    alert(`Thank you for your feedback! Rating: ${feedback.rating}/5`);
    setSelectedAppointment(null);
    setFeedback({ rating: 0, comment: '' });
  };

  const handleExportHistory = () => {
    const csvContent = [
      ['Date', 'Treatment', 'Status', 'Cost', 'Doctor Notes'],
      ...filteredIncidents.map(incident => [
        formatDate(incident.appointmentDate),
        incident.title,
        incident.status,
        incident.cost || 0,
        incident.comments || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_dental_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalSpent = patientIncidents
    .filter(apt => apt.status === 'Completed')
    .reduce((sum, apt) => sum + (apt.cost || 0), 0);

  const upcomingCount = patientIncidents.filter(apt =>
    new Date(apt.appointmentDate) > new Date() && apt.status === 'Scheduled'
  ).length;

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">View your appointment history and upcoming treatments</p>
            </div>
            <button
              onClick={handleExportHistory}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export History
            </button>
          </div>
        </div>

        {/* Patient Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{patientIncidents.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Appointments</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{upcomingCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Upcoming</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">${totalSpent.toFixed(2)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Investment</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative max-w-md flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white transition-all duration-300"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No appointments found</p>
              </div>
            ) : (
              filteredIncidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                        {incident.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)} transition-all duration-300 hover:scale-105 self-start sm:self-center`}>
                          {incident.status}
                        </span>
                        {incident.status === 'Completed' && (
                          <button
                            onClick={() => setSelectedAppointment(incident)}
                            className="flex items-center px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Rate
                          </button>
                        )}
                      </div>
                    </div>

                    {incident.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{incident.description}</p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{formatDate(incident.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{formatTime(incident.appointmentDate)}</span>
                      </div>
                      {incident.cost && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">${incident.cost.toFixed(2)}</span>
                        </div>
                      )}
                      {incident.files.length > 0 && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{incident.files.length} files</span>
                        </div>
                      )}
                    </div>

                    {incident.treatment && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Treatment:</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400">{incident.treatment}</p>
                      </div>
                    )}

                    {incident.comments && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Doctor's Notes:</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{incident.comments}</p>
                      </div>
                    )}

                    {incident.nextAppointmentDate && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                        <h4 className="text-sm font-medium text-green-900 dark:text-green-300">Next Appointment:</h4>
                        <p className="text-sm text-green-800 dark:text-green-400">
                          {formatDate(incident.nextAppointmentDate)} at {formatTime(incident.nextAppointmentDate)}
                        </p>
                      </div>
                    )}

                    {incident.files.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Medical Documents:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {incident.files.map((file, fileIndex) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md animate-fade-in-up"
                              style={{ animationDelay: `${400 + fileIndex * 50}ms` }}
                            >
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">({formatFileSize(file.size)})</span>
                              </div>
                              <button
                                onClick={() => handleFileDownload(file)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0 ml-2"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feedback Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Rate Your Experience
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                How was your treatment: {selectedAppointment.title}?
              </p>

              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className={`p-1 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share your feedback (optional)"
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFeedbackSubmit(selectedAppointment.id)}
                  disabled={feedback.rating === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientAppointmentsPage;
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import toast from "react-hot-toast";
import { useLocation, useNavigate } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import PatientModal from '../components/Patients/PatientModal';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { formatDateTime } from '../utils/dateUtils';

import {
  createPatientAPI,
  updatePatientAPI,
  fetchPatientsAPI,
  deletePatientAPI,
} from '../api/patients';
import { fetchPatientIncidentsAPI } from "../api/appointments";
import PaginationFooter from '../components/Layout/PaginationFooter';

const PatientsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const showModal = queryParams.get('openModal') === '1';

  const { user } = useAuth();
  const { setDropdownPatients } = useData();
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [adultCount, setAdultCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(showModal || false);
  const [selectedPatient, setSelectedPatient] = useState(undefined);
  const [incidentSummaries, setIncidentSummaries] = useState({});

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name'); // or 'createdAt'
  const [sortOrder, setSortOrder] = useState('asc');

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage, pageSize, sortField, sortOrder, user?.role, user?.id]);

  useEffect(() => {
    if (showModal) setIsModalOpen(true);
  }, [showModal])

  const fetchPatients = async () => {
    if (!user) return;

    try {
      // 1. Fetch Patients
      const { data } = await fetchPatientsAPI({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      });

      const newTotalPages = Math.max(1, Math.ceil(data.totalCount / pageSize));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      } else {
        setPatients(data.patients);
        setTotalCount(data.totalCount);
      }

      setChildrenCount(data.childrenCount);
      setAdultCount(data.adultCount);
      setSeniorCount(data.seniorCount);

      // 2. Fetch Incident Summaries for Each Patient
      const summaries = {};
      for (const patient of data.patients) {
        try {
          const res = await fetchPatientIncidentsAPI(patient.id);
          summaries[patient.id] = res.data;
        } catch (err) {
          console.error(`Failed to fetch incidents for ${patient.name}:`, err);
        }
      }

      setIncidentSummaries(summaries);

    } catch (err) {
      console.error('Failed to fetch patients or incidents', err);
      toast.error('Could not load patients or incident summaries');
    }
  };

  const handleAddPatient = () => {
    setSelectedPatient(undefined);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = async (patientId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this patient? This will also delete all associated appointments.'
    );
    if (!confirm) return;

    try {
      const { data: dropDownPatients } = await deletePatientAPI(patientId);
      setDropdownPatients(dropDownPatients);
      toast.success('Patient deleted successfully');

      if (patients.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1); // this will trigger fetchPatients from useEffect
      } else {
        await fetchPatients(); // refresh list if not the last item
      }
    } catch (err) {
      console.error('Failed to delete patient:', err);
      toast.error('Error deleting patient');
    }
  };

  const normalizePatientPayload = (data) => ({
    ...data,
    dob: data.dob.split('T')[0], // 'YYYY-MM-DD' only
  });

  const handleSavePatient = async (patientData) => {
    try {
      const payload = normalizePatientPayload(patientData);
      if (selectedPatient) {
        const { data: dropDownPatients } = await updatePatientAPI(selectedPatient.id, payload);
        setDropdownPatients(dropDownPatients);
        toast.success("Updated Successfully");
      } else {
        const { data: dropDownPatients } = await createPatientAPI(payload);
        setDropdownPatients(dropDownPatients);
        toast.success("Created Successfully")
      }
      setIsModalOpen(false);

      fetchPatients();
    } catch (err) {
      console.error('Error saving patient:', err);
      toast.error('Failed to save patient.');
    }
  };

  const handleCallPatient = (contact) => {
    window.open(`tel:${contact}`);
  };

  const handleEmailPatient = (email) => {
    window.open(`mailto:${email}`);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Manage your patient database</p>
            </div>
            {
              user.role == "Student" && <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAddPatient}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse-glow w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </button>
              </div>
            }
          </div>
        </div>

        {/* Patient Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Patients</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {childrenCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Children</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {adultCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Adults</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {seniorCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Seniors</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Page size */}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>{size} / page</option>
                  ))}
                </select>

                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="createdAt">Sort by Created At</option>
                </select>

                {/* Toggle Icon for Sort Order */}
                <button
                  onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? '▲' : '▼'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {patients.map((patient, index) => {
                const summary = incidentSummaries[patient.id];
                const totalIncidents = summary?.totalIncidents || 0;
                const nextVisit = summary?.nextScheduledAppointment
                  ? formatDateTime(summary.nextScheduledAppointment)
                  : 'No visits';
                return (
                  <div
                    key={patient.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-all duration-300 hover:shadow-md cursor-pointer">
                          <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 truncate">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{patient.email}</div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Contact:</span> {patient.contact}
                          </div>
                          <div>
                            <span className="font-medium">Date of Birth: </span>
                            {
                              new Date(patient.dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })
                            }
                          </div>
                          <div>
                            <span className="font-medium">Appointments:</span> {totalIncidents}
                          </div>
                          <div>
                            <span className="font-medium">First Upcoming:</span> {nextVisit}
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => handleCallPatient(patient.contact)}
                            className="flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </button>
                          <button
                            onClick={() => handleEmailPatient(patient.email)}
                            className="flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-110 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
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
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {
                    user.role != "Student" && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                  }
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Appointments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    First Upcoming
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quick Actions
                  </th>
                  {
                    user.role == "Student" && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  }
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {patients.map((patient, index) => {
                  const summary = incidentSummaries[patient.id];
                  const totalIncidents = summary?.totalIncidents || 0;
                  const nextVisit = summary?.nextScheduledAppointment
                    ? formatDateTime(summary.nextScheduledAppointment)
                    : 'No visits';

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      {
                        user.role != "Student" && <td className="px-6 py-4 whitespace-nowrap">
                          <div className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-all duration-300 hover:shadow-md cursor-pointer">
                            <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                              {patient.user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{patient.user.email}</div>
                          </div>
                        </td>
                      }
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-all duration-300 hover:shadow-md cursor-pointer">
                          <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{patient.contact}</div>
                        {patient.emergencyContact && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">Emergency: {patient.emergencyContact}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(patient.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {totalIncidents} total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {nextVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCallPatient(patient.contact)}
                            className="flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </button>
                          <button
                            onClick={() => handleEmailPatient(patient.email)}
                            className="flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </button>
                        </div>
                      </td>
                      {
                        user.role == "Student" && <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-110 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {patients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No patients found</p>
            </div>
          )}
        </div>

        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(page) => setCurrentPage(page)}
        />

        <PatientModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            navigate('/patients'); // Optional: clear ?openModal=1 from URL
          }}
          onSave={handleSavePatient}
          patient={selectedPatient}
        />
      </div>
    </Layout>
  );
};

export default PatientsPage;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import AppointmentsList from '../components/Dashboard/AppointmentsList';
import FloatingActionButton from '../components/Dashboard/FloatingActionButton';
import { fetchPatientByIdAPI } from '../api/patients';
import { Calendar, Clock, DollarSign, FileText, Heart, Shield, Award, TrendingUp } from 'lucide-react';

const PatientDashboardPage = () => {
  const { user } = useAuth();
  const { getPatientIncidents } = useData();
  const [isLoaded, setIsLoaded] = useState(false);
  const [healthTip, setHealthTip] = useState('');

  useEffect(() => {
    // Trigger staggered animations
    const timer = setTimeout(() => setIsLoaded(true), 200);

    // Set random health tip
    const tips = [
      "Brush your teeth twice daily for optimal oral health!",
      "Don't forget to floss - it prevents gum disease.",
      "Regular dental checkups can prevent serious issues.",
      "Limit sugary drinks to protect your teeth.",
      "Use fluoride toothpaste for stronger enamel."
    ];
    setHealthTip(tips[Math.floor(Math.random() * tips.length)]);

    return () => clearTimeout(timer);
  }, []);

  const patientId = user?.patientId;
  const { data: patient } = patientId ? fetchPatientByIdAPI(patientId) : null;
  const patientIncidents = patientId ? getPatientIncidents(patientId) : [];

  const upcomingAppointments = patientIncidents.filter(
    incident => new Date(incident.appointmentDate) > new Date()
  );
  const completedAppointments = patientIncidents.filter(incident => incident.status === 'Completed');
  const totalCost = completedAppointments.reduce((sum, incident) => sum + (incident.cost || 0), 0);
  const totalFiles = patientIncidents.reduce((sum, incident) => sum + incident.files.length, 0);

  // Calculate health score based on appointment frequency
  const lastVisit = completedAppointments.length > 0
    ? completedAppointments.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())[0]
    : null;

  const daysSinceLastVisit = lastVisit
    ? Math.floor((new Date().getTime() - new Date(lastVisit.appointmentDate).getTime()) / (1000 * 60 * 60 * 24))
    : 365;

  const healthScore = Math.max(0, Math.min(100, 100 - (daysSinceLastVisit / 180) * 100));

  const statsData = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      delay: 100
    },
    {
      title: 'Completed Treatments',
      value: completedAppointments.length,
      icon: Clock,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      delay: 200
    },
    {
      title: 'Total Investment',
      value: `$${totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      delay: 300
    },
    {
      title: 'Health Score',
      value: `${Math.round(healthScore)}%`,
      icon: Heart,
      color: 'bg-gradient-to-r from-red-500 to-pink-600',
      delay: 400
    }
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header Section with Enhanced Animation */}
        <div className={`mb-6 sm:mb-8 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            {/* Floating Background Element */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full opacity-20 animate-float animation-delay-500"></div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-right animation-delay-200 relative z-10">
              Welcome, {patient?.name || user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base animate-fade-in-right animation-delay-400 relative z-10">
              Here's an overview of your dental care journey.
            </p>
          </div>
        </div>

        {/* Health Tip Banner */}
        <div className={`mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700 transition-all duration-700 transform hover:shadow-lg ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 animate-pulse" />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Daily Health Tip</h3>
              <p className="text-sm text-green-700 dark:text-green-400">{healthTip}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards with Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${stat.delay}ms` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Health Progress Section */}
        <div className={`mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-700 transform hover:shadow-xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Your Dental Health Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(healthScore)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Health Score</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${healthScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-300">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedAppointments.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Treatments Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalFiles}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Medical Documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Lists with Enhanced Animation */}
        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <div className="transform transition-all duration-500 hover:scale-105 hover-lift animate-fade-in-left animation-delay-700">
            <div className="relative overflow-hidden rounded-lg hover:shadow-xl transition-shadow duration-300">
              <AppointmentsList
                appointments={upcomingAppointments.slice(0, 10)}
                title="Your Upcoming Appointments"
              />
            </div>
          </div>
          <div className="transform transition-all duration-500 hover:scale-105 hover-lift animate-fade-in-right animation-delay-800">
            <div className="relative overflow-hidden rounded-lg hover:shadow-xl transition-shadow duration-300">
              <AppointmentsList
                appointments={completedAppointments.slice(0, 10)}
                title="Recent Completed Treatments"
              />
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton userRole={user?.role} />
      </div>
    </Layout>
  );
};

export default PatientDashboardPage;
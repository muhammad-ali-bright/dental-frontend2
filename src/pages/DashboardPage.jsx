import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import AppointmentsList from '../components/Dashboard/AppointmentsList';
import FloatingActionButton from '../components/Dashboard/FloatingActionButton';
import { Calendar, Users, DollarSign, Activity, Bell, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { dropdownPatients, incidents, todayIncidentsCount } = useData();
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Trigger staggered animations
    const timer = setTimeout(() => setIsLoaded(true), 200);

    // Generate notifications
    const upcomingToday = incidents.filter(incident => {
      const today = new Date().toDateString();
      const appointmentDate = new Date(incident.appointmentDate).toDateString();
      return appointmentDate === today && incident.status === 'Scheduled';
    });

    const overdue = incidents.filter(incident => {
      const now = new Date();
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate < now && incident.status === 'Scheduled';
    });

    const newNotifications = [
      ...upcomingToday.map(apt => ({
        id: `today-${apt.id}`,
        type: 'info',
        message: `Appointment today: ${apt.title}`,
        time: '2 hours ago'
      })),
      ...overdue.map(apt => ({
        id: `overdue-${apt.id}`,
        type: 'warning',
        message: `Overdue appointment: ${apt.title}`,
        time: '1 day ago'
      }))
    ];

    setNotifications(newNotifications.slice(0, 5));

    return () => clearTimeout(timer);
  }, [incidents]);

  const upcomingAppointments = [];
  const completedAppointments = incidents.filter(i => i.status === 'Completed');
  const totalRevenue = completedAppointments.reduce((sum, incident) => sum + (incident.cost || 0), 0);
  const pendingAppointments = incidents.filter(i => i.status === 'Scheduled' || i.status === 'In Progress');

  // Calculate monthly growth
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthRevenue = completedAppointments
    .filter(apt => {
      const date = new Date(apt.appointmentDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, apt) => sum + (apt.cost || 0), 0);

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthRevenue = completedAppointments
    .filter(apt => {
      const date = new Date(apt.appointmentDate);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    })
    .reduce((sum, apt) => sum + (apt.cost || 0), 0);

  const revenueGrowth = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : '0';

  const statsData = [
    {
      title: 'Total Patients',
      value: dropdownPatients.length,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: { value: '12%', isPositive: true },
      delay: 100
    },
    {
      title: 'Today\'s Appointments',
      value: todayIncidentsCount,
      icon: Calendar,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: { value: '8%', isPositive: true },
      delay: 200
    },
    {
      title: 'Monthly Revenue',
      value: `$${thisMonthRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      trend: { value: `${revenueGrowth}%`, isPositive: parseFloat(revenueGrowth) >= 0 },
      delay: 300
    },
    {
      title: 'Pending Treatments',
      value: pendingAppointments.length,
      icon: Activity,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      trend: { value: '5%', isPositive: false },
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
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 animate-float animation-delay-500"></div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-right animation-delay-200 relative z-10">
              Welcome back, {user?.name || user?.email}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base animate-fade-in-right animation-delay-400 relative z-10">
              Here's what's happening with your dental practice today.
            </p>
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

        {/* Quick Actions Panel */}
        <div className={`mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Add Patient</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-green-50 dark:hover:bg-green-900/20">
              <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Calendar</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Appointments</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Billing</span>
            </button>
          </div>
        </div>

        {/* Appointments Lists with Enhanced Animation */}
        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <div className="transform transition-all duration-500 hover:scale-105 hover-lift animate-fade-in-left animation-delay-700">
            <div className="relative overflow-hidden rounded-lg hover:shadow-xl transition-shadow duration-300">
              <AppointmentsList
                appointments={upcomingAppointments}
                title="Upcoming Appointments"
              />
            </div>
          </div>
          <div className="transform transition-all duration-500 hover:scale-105 hover-lift animate-fade-in-right animation-delay-800">
            <div className="relative overflow-hidden rounded-lg hover:shadow-xl transition-shadow duration-300">
              <AppointmentsList
                appointments={completedAppointments.slice(0, 10)}
                title="Recent Completed Appointments"
              />
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className={`mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-700 transform hover:shadow-xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Practice Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-300">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{((completedAppointments.length / incidents.length) * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">${(totalRevenue / Math.max(completedAppointments.length, 1)).toFixed(0)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Treatment Value</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dropdownPatients.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Patients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton userRole={user?.role} />
      </div>
    </Layout>
  );
};

export default DashboardPage;
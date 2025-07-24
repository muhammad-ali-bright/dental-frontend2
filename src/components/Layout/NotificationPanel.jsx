import React, { useState, useEffect } from 'react';
import { Bell, Calendar, AlertTriangle, Clock, X, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatTime } from '../../utils/dateUtils';

const NotificationPanel = () => {
  const { incidents, patients, getPatientById } = useData();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const generateNotifications = () => {
      const now = new Date();
      const today = now.toDateString();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
      
      const newNotifications = [];

      // Today's appointments
      const todayAppointments = incidents.filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate).toDateString();
        return appointmentDate === today && incident.status === 'Scheduled';
      });

      todayAppointments.forEach(apt => {
        const patient = getPatientById(apt.patientId);
        newNotifications.push({
          id: `today-${apt.id}`,
          type: 'info',
          icon: Calendar,
          title: 'Appointment Today',
          message: user?.role === 'Admin' 
            ? `${patient?.name || 'Patient'} - ${apt.title} at ${formatTime(apt.appointmentDate)}`
            : `${apt.title} at ${formatTime(apt.appointmentDate)}`,
          time: formatTime(apt.appointmentDate),
          priority: 'high'
        });
      });

      // Tomorrow's appointments
      const tomorrowAppointments = incidents.filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate).toDateString();
        return appointmentDate === tomorrow && incident.status === 'Scheduled';
      });

      tomorrowAppointments.slice(0, 2).forEach(apt => {
        const patient = getPatientById(apt.patientId);
        newNotifications.push({
          id: `tomorrow-${apt.id}`,
          type: 'info',
          icon: Clock,
          title: 'Appointment Tomorrow',
          message: user?.role === 'Admin' 
            ? `${patient?.name || 'Patient'} - ${apt.title}`
            : `${apt.title} at ${formatTime(apt.appointmentDate)}`,
          time: 'Tomorrow',
          priority: 'medium'
        });
      });

      // Overdue appointments (Admin only)
      if (user?.role === 'Admin') {
        const overdue = incidents.filter(incident => {
          const appointmentDate = new Date(incident.appointmentDate);
          return appointmentDate < now && incident.status === 'Scheduled';
        });

        overdue.slice(0, 3).forEach(apt => {
          const patient = getPatientById(apt.patientId);
          const daysOverdue = Math.floor((now - new Date(apt.appointmentDate)) / (1000 * 60 * 60 * 24));
          newNotifications.push({
            id: `overdue-${apt.id}`,
            type: 'warning',
            icon: AlertTriangle,
            title: 'Overdue Appointment',
            message: `${patient?.name || 'Patient'} - ${apt.title} (${daysOverdue} days overdue)`,
            time: `${daysOverdue} days ago`,
            priority: 'high'
          });
        });
      }

      // Completed treatments (Patient only)
      if (user?.role === 'Patient') {
        const recentCompleted = incidents.filter(incident => {
          const appointmentDate = new Date(incident.appointmentDate);
          const daysSince = (now - appointmentDate) / (1000 * 60 * 60 * 24);
          return incident.status === 'Completed' && daysSince <= 7 && daysSince >= 0;
        });

        recentCompleted.slice(0, 2).forEach(apt => {
          newNotifications.push({
            id: `completed-${apt.id}`,
            type: 'success',
            icon: CheckCircle,
            title: 'Treatment Completed',
            message: `${apt.title} - Please rate your experience`,
            time: formatDate(apt.appointmentDate),
            priority: 'medium'
          });
        });
      }

      // System notifications
      if (user?.role === 'Admin') {
        const totalPatients = patients.length;
        const thisMonthAppointments = incidents.filter(apt => {
          const date = new Date(apt.appointmentDate);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

        if (totalPatients > 0 && thisMonthAppointments > 0) {
          newNotifications.push({
            id: 'system-stats',
            type: 'info',
            icon: Bell,
            title: 'Practice Update',
            message: `${thisMonthAppointments} appointments this month with ${totalPatients} active patients`,
            time: 'System',
            priority: 'low'
          });
        }
      }

      // Sort by priority and limit to 8 notifications
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return newNotifications
        .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        .slice(0, 8);
    };

    setNotifications(generateNotifications());
  }, [incidents, patients, user, getPatientById]);

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'info': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-110 hover:shadow-lg
          ${isOpen 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }
        `}
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full 
          flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border 
          border-gray-200 dark:border-gray-700 z-50 animate-fade-in-down">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification, index) => {
                    const IconComponent = notification.icon;
                    return (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-l-4 ${getNotificationColor(notification.type)} hover:bg-opacity-80 
                        transition-all duration-300 animate-fade-in-up`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getIconColor(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setNotifications([])}
                  className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 
                  dark:hover:text-blue-300 transition-colors"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
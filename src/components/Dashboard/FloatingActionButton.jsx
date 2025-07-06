import React, { useState } from 'react';
import { Plus, Calendar, Users, FileText, Phone, MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = ({ userRole = 'Admin' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const adminActions = [
    {
      icon: Users,
      label: 'Add Patient',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        navigate('/patients');
        setTimeout(() => {
          const addButton = document.querySelector('[data-action="add-patient"]');
          if (addButton) addButton.click();
        }, 100);
      }
    },
    {
      icon: Calendar,
      label: 'Schedule Appointment',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        navigate('/appointments');
        setTimeout(() => {
          const addButton = document.querySelector('[data-action="add-appointment"]');
          if (addButton) addButton.click();
        }, 100);
      }
    },
    {
      icon: FileText,
      label: 'View Reports',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => {
        navigate('/calendar');
      }
    },
    {
      icon: Phone,
      label: 'Emergency Contact',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => {
        window.open('tel:+1-555-DENTAL');
      }
    }
  ];

  const patientActions = [
    {
      icon: Calendar,
      label: 'My Appointments',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        navigate('/my-appointments');
      }
    },
    {
      icon: FileText,
      label: 'Medical Records',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        navigate('/my-appointments');
      }
    },
    {
      icon: MessageCircle,
      label: 'Contact Clinic',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => {
        window.open('mailto:contact@entntdental.com');
      }
    },
    {
      icon: Phone,
      label: 'Emergency Call',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => {
        window.open('tel:+1-555-DENTAL');
      }
    }
  ];

  const actions = userRole === 'Admin' ? adminActions : patientActions;

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action) => {
    action.action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action Buttons */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in-up">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-3 animate-slide-in-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1 rounded-lg 
                text-sm font-medium whitespace-nowrap shadow-lg">
                  {action.label}
                </span>
                <button
                  onClick={() => handleActionClick(action)}
                  className={`
                    w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl 
                    flex items-center justify-center text-white
                    ${action.color}
                  `}
                  title={action.label}
                >
                  <IconComponent className="w-6 h-6" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainButtonClick}
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl flex 
          items-center justify-center text-white animate-float
          ${isExpanded 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }
        `}
        title={isExpanded ? 'Close' : 'Quick Actions'}
      >
        {isExpanded ? (
          <X className="w-7 h-7 transition-transform duration-300" />
        ) : (
          <Plus className="w-7 h-7 transition-transform duration-300" />
        )}
        
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
        )}
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
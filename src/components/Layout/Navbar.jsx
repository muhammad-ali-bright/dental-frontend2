import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Calendar, Users, BarChart3, Home, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ isDark, onThemeToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const adminNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/calendar', label: 'Calendar', icon: BarChart3 },
  ];

  const patientNavItems = [
    { path: '/patient-dashboard', label: 'My Dashboard', icon: Home },
    { path: '/my-appointments', label: 'My Appointments', icon: Calendar },
  ];

  const navItems = user?.role === 'Student' ? adminNavItems : patientNavItems;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled
        ? `${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-lg border-b ${isDark ? 'border-gray-700' :
          'border-gray-200'}`
        : `${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm`
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-center">
                <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-600'} tracking-tight`}>
                  ENTNT
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} -mt-1`}>
                  Dental Center
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform 
                        hover:scale-105
                        ${isActive(item.path)
                          ? `${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} shadow-md`
                          : `${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' :
                            'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <NotificationPanel />
            <div className="flex items-center">
              <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} hidden xl:block`}>
                {user?.name || user?.email}
              </span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-blue-600 text-white' :
                'bg-blue-100 text-blue-800'}`}>
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className={`
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105
                ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' :
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden xl:block">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <NotificationPanel />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`
                p-2 rounded-md transition-all duration-300
                ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' :
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className={`px-3 py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} mb-2`}>
                <div className="flex items-center">
                  <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                  <div>
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user?.name || user?.email}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300
                      ${isActive(item.path)
                        ? `${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} shadow-md`
                        : `${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' :
                          'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-all 
                  duration-300 mt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4
                  ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' :
                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-110 hover:shadow-lg
        ${isDark 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
        }
      `}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative">
        {isDark ? (
          <Sun className="w-5 h-5 transition-all duration-300 transform rotate-0 hover:rotate-12" />
        ) : (
          <Moon className="w-5 h-5 transition-all duration-300 transform rotate-0 hover:-rotate-12" />
        )}
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'shadow-lg shadow-yellow-400/20' 
          : 'shadow-lg shadow-blue-400/20'
      } opacity-0 hover:opacity-100`}></div>
    </button>
  );
};

export default ThemeToggle;
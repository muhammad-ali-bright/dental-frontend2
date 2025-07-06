import React, { useState } from 'react';

const StatsCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 
      transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white 
      hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 animate-fade-in-up cursor-pointer group hover-lift 
      stagger-item overflow-hidden relative"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Effect */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${isHovered ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10' : ''}`}></div>
      
      {/* Floating BackG Elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 
      transform transition-all duration-500 group-hover:scale-150 group-hover:rotate-45"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 
          dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white mt-1 group-hover:text-blue-700 
          dark:group-hover:text-blue-300 transition-colors duration-300 truncate animate-scale-in animation-delay-200">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 animate-fade-in-left animation-delay-400">
              <span className={`text-xs sm:text-sm font-medium transition-all duration-300 
                ${trend.isPositive ? 'text-green-600 group-hover:text-green-700' : 'text-red-600 group-hover:text-red-700'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline 
              group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} transform transition-all duration-500 group-hover:scale-110 
        group-hover:rotate-12 flex-shrink-0 ml-2 hover-glow animate-bounce-in animation-delay-300`}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      
      {/* Progress Bar  */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 
      group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      {/* Subtle Glow  */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${isHovered ? 'shadow-lg shadow-blue-500/20' : ''}`}></div>
    </div>
  );
};

export default StatsCard;
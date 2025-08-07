import React, { useState } from 'react';

const StatsCard = ({ title, value, icon: Icon, color, trend, delay = 0, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        rounded-lg shadow-sm p-4 sm:p-6 border transition-all duration-500 transform cursor-pointer group overflow-hidden relative
        hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br
        ${isDark
          ? 'bg-gray-800 border-gray-700 hover:from-gray-800 hover:to-gray-700'
          : 'bg-white border-gray-200 hover:from-white hover:to-blue-50'
        }
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Overlay Effect */}
      {isHovered && !isDark && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 transition-all duration-500"></div>
      )}

      {/* Floating Glow Orb */}
      <div
        className={`
          absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 transform transition-all duration-500 
          group-hover:scale-150 group-hover:rotate-45
          ${isDark ? 'bg-blue-900' : 'bg-blue-100'}
        `}
      ></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={`
              text-xs sm:text-sm font-medium truncate transition-colors duration-300
              ${isDark ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}
            `}
          >
            {title}
          </p>
          <p
            className={`
              text-lg sm:text-2xl font-semibold mt-1 truncate animate-scale-in animation-delay-200 transition-colors duration-300
              ${isDark ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-700'}
            `}
          >
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 animate-fade-in-left animation-delay-400">
              <span
                className={`
                  text-xs sm:text-sm font-medium transition-all duration-300
                  ${trend.isPositive ? 'text-green-600 group-hover:text-green-700' : 'text-red-600 group-hover:text-red-700'}
                `}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
              <span
                className={`
                  text-xs sm:text-sm ml-1 hidden sm:inline transition-colors duration-300
                  ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}
                `}
              >
                vs last month
              </span>
            </div>
          )}
        </div>

        <div
          className={`
            p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12
            ${color}
          `}
        >
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

      {/* Glow only in light mode */}
      {isHovered && !isDark && (
        <div className="absolute inset-0 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-500"></div>
      )}
    </div>
  );
};

export default StatsCard;

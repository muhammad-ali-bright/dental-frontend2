import React from 'react';
import { Heart, Stethoscope } from 'lucide-react';

const LoadingOverlay = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className={`loading-overlay ${!isVisible ? 'fade-out' : ''}`}>
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce-in">
            <Stethoscope className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center 
          animate-pulse animation-delay-500">
            <Heart className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-white mb-6">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in-up animation-delay-300">
            ENTNT
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-up animation-delay-500">
            Dental Center
          </p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center space-x-2 animate-fade-in-up animation-delay-700">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-400"></div>
        </div>
        
        <p className="text-white opacity-75 mt-4 animate-fade-in-up animation-delay-1000">
          Loading your dental care experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
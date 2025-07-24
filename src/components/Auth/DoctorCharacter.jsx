import React, { useState, useEffect } from 'react';

const DoctorCharacter = ({ isPasswordVisible, isTypingPassword }) => {
  const [eyeState, setEyeState] = useState('open');

  useEffect(() => {
    if (isTypingPassword && !isPasswordVisible) {
      setEyeState('closed');
    } else if (isTypingPassword && isPasswordVisible) {
      setEyeState('peek');
    } else {
      setEyeState('open');
    }
  }, [isTypingPassword, isPasswordVisible]);

  const getEyeStyle = () => {
    switch (eyeState) {
      case 'closed':
        return 'h-1';
      case 'peek':
        return 'h-2';
      default:
        return 'h-3';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="relative">
        {/* Doctor Head */}
        <div className="w-24 h-24 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full relative">
          {/* Hair */}
          <div className="absolute -top-2 left-2 w-20 h-12 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-full"></div>
          
          {/* Eyes */}
          <div className="absolute top-8 left-7 flex space-x-4">
            <div className={`w-3 bg-gray-800 rounded-full transition-all duration-300 ${getEyeStyle()}`}></div>
            <div className={`w-3 bg-gray-800 rounded-full transition-all duration-300 ${getEyeStyle()}`}></div>
          </div>
          
          {/* Nose */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-pink-400 rounded-full"></div>
          
          {/* Mouth */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-400 rounded-full"></div>
          
          
        </div>
        
        
        
        {/* Animation effects */}
        <div className={`absolute -top-2 -left-2 w-28 h-28 rounded-full bg-blue-200 opacity-20 animate-pulse ${eyeState === 'open' ? 'block' : 'hidden'}`}></div>
      </div>
      
      <p className="text-sm text-gray-600 mt-2 text-center">
        {eyeState === 'closed' ? 'I won\'t peek!' : eyeState === 'peek' ? 'Just checking...' : 'Welcome to ENTNT Dental!'}
      </p>
    </div>
  );
};

export default DoctorCharacter;
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import LoadingOverlay from './LoadingOverlay';

const Layout = ({ children }) => {
  // const [isDark, setIsDark] = useState(false);
  const isDark = true;
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    // setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc';
    }
    
    setIsInitialized(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    // setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc';
    }
  };

  if (!isInitialized) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <div className={`min-h-screen theme-transition ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Animated BackG Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Main BackG Image */}
          <div 
            className="absolute inset-0 z-0 opacity-5 theme-transition"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Floating Shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full 
          opacity-20 animate-float animation-delay-1000"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-lg 
          opacity-20 animate-float animation-delay-2000 rotate-45"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-200 dark:bg-green-800 opacity-20 animate-morph"></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full 
          opacity-20 animate-float animation-delay-500"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 
          rounded-full opacity-10 animate-pulse animation-delay-1000"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400 to-blue-600 
          rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r 
          from-purple-400 to-pink-600 rounded-full opacity-5 animate-spin animation-duration-20000"></div>
        </div>
        
        <Navbar isDark={isDark} onThemeToggle={toggleTheme} />
        <main className="relative z-10 pt-16 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className={`theme-transition page-transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we have a section to scroll to from navigation
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Home Section */}
      <section id="home" className="min-h-screen pt-16 bg-gray-50">
        {/* Your existing home content */}
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-16 bg-white">
        {/* Your existing about content */}
      </section>

      {/* Popular Destinations Section */}
      <section id="destinations" className="min-h-screen py-16 bg-gray-50">
        {/* Your existing destinations content */}
      </section>

      {/* Guides Section */}
      <section id="guides" className="min-h-screen py-16 bg-white">
        {/* Your existing guides content */}
      </section>
    </div>
  );
};

export default HomePage; 
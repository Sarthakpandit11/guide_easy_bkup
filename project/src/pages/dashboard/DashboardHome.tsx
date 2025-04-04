import React from 'react';
import { Search, MapPin, Calendar, Star, User } from 'lucide-react';

const DashboardHome = () => {
  // Get user data from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userName = user ? user.full_name : 'Guest';

  const upcomingTours = [
    {
      id: 1,
      destination: 'Everest Base Camp',
      date: '2024-04-15',
      guide: 'Pemba Sherpa',
      status: 'Confirmed'
    },
    {
      id: 2,
      destination: 'Annapurna Circuit',
      date: '2024-05-20',
      guide: 'Maya Tamang',
      status: 'Pending'
    }
  ];

  const pastTours = [
    {
      id: 1,
      destination: 'Pokhara',
      date: '2024-01-10',
      guide: 'Raj Gurung',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      destination: 'Kathmandu Valley',
      date: '2023-12-15',
      guide: 'Maya Tamang',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const recommendations = [
    {
      id: 1,
      destination: 'Chitwan National Park',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
      description: 'Experience wildlife in their natural habitat'
    },
    {
      id: 2,
      destination: 'Lumbini',
      image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800',
      description: 'Visit the birthplace of Buddha'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back, {userName}! 👋</h1>
          <p className="text-lg text-gray-600">Ready for your next adventure? Explore new destinations and plan your upcoming tours.</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for destinations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Upcoming Tours */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {upcomingTours.map(tour => (
          <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{tour.destination}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {tour.date}
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {tour.guide}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                tour.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tour.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Past Tours */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {pastTours.map(tour => (
          <div key={tour.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={tour.image}
              alt={tour.destination}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{tour.destination}</h3>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {tour.date}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {tour.guide}
              </div>
              <div className="mt-2 flex items-center">
                {[...Array(tour.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map(rec => (
          <div key={rec.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={rec.image}
              alt={rec.destination}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{rec.destination}</h3>
              <p className="mt-2 text-sm text-gray-500">{rec.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
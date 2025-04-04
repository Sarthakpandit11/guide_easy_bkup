import React from 'react';
import { Calendar, MapPin, User, Star } from 'lucide-react';

const BookedTours = () => {
  const tours = [
    {
      id: 1,
      destination: 'Everest Base Camp',
      startDate: '2024-04-15',
      endDate: '2024-04-28',
      guide: 'Pemba Sherpa',
      status: 'Upcoming',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      destination: 'Pokhara',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
      guide: 'Raj Gurung',
      status: 'Completed',
      rating: 5,
      price: 800,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Booked Tours</h1>
      
      <div className="space-y-6">
        {tours.map(tour => (
          <div key={tour.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48"
                  src={tour.image}
                  alt={tour.destination}
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{tour.destination}</h2>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {tour.startDate} - {tour.endDate}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {tour.guide}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      ${tour.price}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    tour.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {tour.status}
                  </span>
                </div>
                
                {tour.status === 'Completed' && (
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Your Rating:</span>
                      {[...Array(tour.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookedTours;
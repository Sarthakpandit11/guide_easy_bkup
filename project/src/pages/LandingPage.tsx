import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Mount Everest Base Camp',
    image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=800',
    description: 'Trek to the base of the world\'s highest peak.',
    location: 'Solukhumbu District'
  },
  {
    id: 2,
    name: 'Pokhara',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    description: 'Scenic lakeside city with mountain views.',
    location: 'Gandaki Province'
  },
  {
    id: 3,
    name: 'Kathmandu Durbar Square',
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800',
    description: 'Ancient royal palace complex with temples.',
    location: 'Kathmandu'
  }
];

const guides = [
  {
    id: 1,
    name: 'Pemba Sherpa',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    expertise: 'Mountain Trekking',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Maya Tamang',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    expertise: 'Cultural Tours',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Raj Gurung',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    expertise: 'Adventure Sports',
    rating: 4.7
  }
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section 
        id="home"
        className="relative h-[600px] bg-cover bg-center scroll-mt-16"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">
              Discover Nepal with Local Experts
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Experience the beauty, culture, and adventure of Nepal with our professional guides.
              From mountain treks to cultural tours, we've got you covered.
            </p>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section 
        id="about"
        className="py-16 bg-gray-50 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          <div className="prose max-w-none">
            <p className="text-center text-lg text-gray-600">
              NepalGuide is your trusted partner for exploring the beauty and culture of Nepal. 
              We connect tourists with experienced local guides who are passionate about sharing 
              their knowledge and love for this beautiful country.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section 
        id="popular-destinations"
        className="py-16 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map(destination => (
              <div key={destination.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{destination.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section 
        id="guides"
        className="py-16 bg-gray-50 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Expert Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guides.map(guide => (
              <div key={guide.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{guide.name}</h3>
                  <p className="text-gray-600 mb-4">{guide.expertise}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="ml-1">{guide.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-1" />
                      <span>100+ tours</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore Nepal?
          </h2>
          <p className="text-xl text-white mb-8">
            Join us today and discover the wonders of Nepal with our expert guides.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
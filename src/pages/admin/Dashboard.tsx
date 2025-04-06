import React, { useState, useEffect, Suspense } from 'react';
import { Users, Calendar, CheckCircle, TrendingUp, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import DashboardCharts from '../../components/charts/DashboardCharts';

// Lazy load chart components
const ChartComponents = React.lazy(() => import('../../components/charts/DashboardCharts'));

// Define interfaces for our data structures
interface Booking {
  id: number;
  tourist: string;
  guide: string;
  date: string;
  status: string;
}

interface Guide {
  name: string;
  bookings: number;
  rating: number;
}

interface RegionData {
  name: string;
  value: number;
}

interface DashboardData {
  totalUsers: number;
  totalBookings: number;
  totalGuides: number;
  totalTourists: number;
  totalRevenue: number;
  recentBookings: Booking[];
  topGuides: Guide[];
  bookingTrends: { name: string; bookings: number; }[];
  touristsByRegion: RegionData[];
  latestBookings: {
    id: number;
    touristName: string;
    guideName: string;
    date: string;
    status: string;
  }[];
}

// Sample data - replace with actual API calls
const bookingTrendData = [
  { name: 'Jan', bookings: 65 },
  { name: 'Feb', bookings: 59 },
  { name: 'Mar', bookings: 80 },
  { name: 'Apr', bookings: 81 },
  { name: 'May', bookings: 56 },
  { name: 'Jun', bookings: 55 },
  { name: 'Jul', bookings: 40 },
  { name: 'Aug', bookings: 65 },
  { name: 'Sep', bookings: 59 },
  { name: 'Oct', bookings: 80 },
  { name: 'Nov', bookings: 81 },
  { name: 'Dec', bookings: 56 },
];

const topGuidesData: Guide[] = [
  { name: 'John Doe', bookings: 120, rating: 4.8 },
  { name: 'Jane Smith', bookings: 98, rating: 4.7 },
  { name: 'Mike Johnson', bookings: 86, rating: 4.6 },
  { name: 'Sarah Williams', bookings: 75, rating: 4.9 },
  { name: 'David Brown', bookings: 65, rating: 4.5 },
];

const touristsByRegionData: RegionData[] = [
  { name: 'North America', value: 400 },
  { name: 'Europe', value: 300 },
  { name: 'Asia', value: 300 },
  { name: 'Africa', value: 200 },
  { name: 'South America', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const recentSignups = [
  { id: 1, name: 'Alice Cooper', email: 'alice@example.com', role: 'Tourist', date: '2023-06-15' },
  { id: 2, name: 'Bob Wilson', email: 'bob@example.com', role: 'Guide', date: '2023-06-14' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Tourist', date: '2023-06-13' },
  { id: 4, name: 'David Miller', email: 'david@example.com', role: 'Guide', date: '2023-06-12' },
  { id: 5, name: 'Eve Johnson', email: 'eve@example.com', role: 'Tourist', date: '2023-06-11' },
];

const latestBookings = [
  { id: 1, tourist: 'Alice Cooper', guide: 'John Doe', date: '2023-06-15', status: 'Confirmed' },
  { id: 2, tourist: 'Bob Wilson', guide: 'Jane Smith', date: '2023-06-14', status: 'Pending' },
  { id: 3, tourist: 'Carol Davis', guide: 'Mike Johnson', date: '2023-06-13', status: 'Completed' },
  { id: 4, tourist: 'David Miller', guide: 'Sarah Williams', date: '2023-06-12', status: 'Cancelled' },
  { id: 5, tourist: 'Eve Johnson', guide: 'David Brown', date: '2023-06-11', status: 'Confirmed' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        const mockData: DashboardData = {
          totalUsers: 1250,
          totalBookings: 150,
          totalGuides: 25,
          totalTourists: 75,
          totalRevenue: 25000,
          recentBookings: latestBookings,
          topGuides: topGuidesData,
          bookingTrends: bookingTrendData,
          touristsByRegion: touristsByRegionData,
          latestBookings: [
            {
              id: 1,
              touristName: 'Alice Cooper',
              guideName: 'John Doe',
              date: '2024-03-15',
              status: 'Confirmed'
            },
            {
              id: 2,
              touristName: 'Bob Wilson',
              guideName: 'Jane Smith',
              date: '2024-03-14',
              status: 'Pending'
            },
            {
              id: 3,
              touristName: 'Carol White',
              guideName: 'Mike Johnson',
              date: '2024-03-13',
              status: 'Completed'
            }
          ]
        };

        setDashboardData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome, {user?.full_name || 'Admin'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This is your admin dashboard. Here you can manage users, bookings, and monitor system activity.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Users</h2>
            <p className="text-blue-600 dark:text-blue-400">Manage user accounts and permissions.</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">Bookings</h2>
            <p className="text-green-600 dark:text-green-400">View and manage tour bookings.</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">Reports</h2>
            <p className="text-purple-600 dark:text-purple-400">Access system reports and analytics.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardData.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardData.totalBookings}</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Guides</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardData.totalGuides}</h3>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tourists</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardData.totalTourists}</h3>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }>
        <DashboardCharts
          bookingTrends={dashboardData.bookingTrends}
          touristsByRegion={dashboardData.touristsByRegion}
          topGuides={dashboardData.topGuides}
        />
      </Suspense>

      {/* Top Guides Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Performing Guides</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Guide Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.topGuides.map((guide, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {guide.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {guide.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {guide.rating} / 5.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Bookings</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('tourist')}
                >
                  <div className="flex items-center">
                    Tourist
                    {sortBy === 'tourist' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('guide')}
                >
                  <div className="flex items-center">
                    Guide
                    {sortBy === 'guide' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortBy === 'status' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.recentBookings
                .filter(booking => 
                  booking.tourist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  booking.guide.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  booking.status.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => {
                  if (sortBy === 'tourist') {
                    return sortOrder === 'asc' 
                      ? a.tourist.localeCompare(b.tourist)
                      : b.tourist.localeCompare(a.tourist);
                  } else if (sortBy === 'guide') {
                    return sortOrder === 'asc'
                      ? a.guide.localeCompare(b.guide)
                      : b.guide.localeCompare(a.guide);
                  } else if (sortBy === 'date') {
                    return sortOrder === 'asc'
                      ? new Date(a.date).getTime() - new Date(b.date).getTime()
                      : new Date(b.date).getTime() - new Date(a.date).getTime();
                  } else if (sortBy === 'status') {
                    return sortOrder === 'asc'
                      ? a.status.localeCompare(b.status)
                      : b.status.localeCompare(a.status);
                  }
                  return 0;
                })
                .map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.tourist}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {booking.guide}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Latest Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tourist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Guide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.latestBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.touristName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.guideName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { BarChart2, Users, Calendar, TrendingUp } from 'lucide-react';

interface BookingTrend {
  month: string;
  bookings: number;
  revenue: number;
}

interface RevenueOverview {
  category: string;
  amount: number;
}

const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for booking trends
  const bookingTrends: BookingTrend[] = [
    { month: 'Jan', bookings: 120, revenue: 12000 },
    { month: 'Feb', bookings: 150, revenue: 15000 },
    { month: 'Mar', bookings: 180, revenue: 18000 },
    { month: 'Apr', bookings: 200, revenue: 20000 },
    { month: 'May', bookings: 220, revenue: 22000 },
    { month: 'Jun', bookings: 250, revenue: 25000 },
  ];

  // Mock data for revenue overview
  const revenueOverview: RevenueOverview[] = [
    { category: 'City Tours', amount: 50000 },
    { category: 'Adventure Tours', amount: 35000 },
    { category: 'Cultural Tours', amount: 45000 },
    { category: 'Beach Tours', amount: 30000 },
  ];

  const guidePerformanceData = [
    { name: 'John Doe', tours: 15, rating: 4.8 },
    { name: 'Jane Smith', tours: 12, rating: 4.9 },
    { name: 'Mike Johnson', tours: 10, rating: 4.7 },
    { name: 'Sarah Wilson', tours: 8, rating: 4.6 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart2 className="h-8 w-8 text-blue-500 mr-2" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports & Insights</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Statistics Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">0%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </div>
        </div>
        
        {/* Active Guides Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Users className="h-6 w-6 text-green-500 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Guides</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">0%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </div>
        </div>
        
        {/* Total Bookings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Calendar className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">0%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </div>
        </div>
        
        {/* Revenue Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <TrendingUp className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">$0</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">0%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder for user growth</p>
          </div>
        </div>
        
        {/* Booking Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Booking Trends</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder for booking trends</p>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder for revenue overview</p>
          </div>
        </div>
        
        {/* Guide Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Guide Performance</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder for guide performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 
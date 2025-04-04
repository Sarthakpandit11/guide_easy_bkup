import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      change: '+12%',
      timeframe: 'from last month',
    },
    {
      title: 'Active Tours',
      value: '45',
      icon: Calendar,
      change: '+5%',
      timeframe: 'from last month',
    },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: DollarSign,
      change: '+18%',
      timeframe: 'from last month',
    },
    {
      title: 'Growth',
      value: '24%',
      icon: TrendingUp,
      change: '+2%',
      timeframe: 'from last month',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="ml-2 text-gray-500">{stat.timeframe}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Add activity items here */}
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 
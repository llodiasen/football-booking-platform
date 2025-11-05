import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ArrowUpRight,
  Search,
  ChevronDown
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { reservationAPI, terrainAPI } from '../../services/api';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newBooking: 24,
    totalRevenue: 13450,
    totalReserved: 90,
    maxReserved: 100,
    newBookingChange: 20,
    revenueChange: 20,
    reservedChange: 20
  });
  const [recentReservations, setRecentReservations] = useState([]);

  // Données pour le graphique
  const visitorData = [
    { month: 'Jan', visitors: 20 },
    { month: 'Feb', visitors: 30 },
    { month: 'Mar', visitors: 45 },
    { month: 'Apr', visitors: 40 },
    { month: 'May', visitors: 60 },
    { month: 'Jun', visitors: 70 },
    { month: 'Jul', visitors: 80 },
    { month: 'Aug', visitors: 65 },
    { month: 'Sep', visitors: 75 },
    { month: 'Oct', visitors: 70 },
    { month: 'Nov', visitors: 85 },
    { month: 'Dec', visitors: 90 }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const reservations = await reservationAPI.getAll();
      
      // Calculer les statistiques réelles
      const allReservations = reservations.data?.data || [];
      const confirmedReservations = allReservations.filter(r => r.status === 'confirmed');
      const totalRevenue = confirmedReservations.reduce((acc, res) => acc + (res.totalPrice || 0), 0);

      setStats({
        ...stats,
        newBooking: allReservations.filter(r => r.status === 'pending').length,
        totalRevenue: totalRevenue,
        totalReserved: confirmedReservations.length,
        maxReserved: 100
      });

      setRecentReservations(allReservations.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-72 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Reservation Dashboard</h1>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* New Booking */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">New Booking</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.newBooking}</p>
                </div>
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  {stats.newBookingChange}%
                </div>
              </div>
              <Link to="/admin/reservations" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Details &gt;
              </Link>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$ {formatPrice(stats.totalRevenue)}</p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  {stats.revenueChange}%
                </div>
              </div>
              <Link to="/admin/revenue" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Details &gt;
              </Link>
            </div>

            {/* Total Reserved */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reserved</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalReserved} / {stats.maxReserved}</p>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  {stats.reservedChange}%
                </div>
              </div>
              <Link to="/admin/reservations" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Details &gt;
              </Link>
            </div>
          </div>

          {/* Visitor Statistics Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Visitor Statistics</h2>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#999" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#999" 
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="url(#colorVisitors)" 
                    strokeWidth={3}
                    dot={{ fill: '#9333ea', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking List Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Booking List</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        Booking Name
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        Status
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        Venue
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        Date
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        Time
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentReservations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        Aucune réservation disponible
                      </td>
                    </tr>
                  ) : (
                    recentReservations.map((reservation) => (
                      <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {reservation.client?.firstName} {reservation.client?.lastName}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : reservation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {reservation.status === 'confirmed' ? 'Booked' :
                             reservation.status === 'pending' ? 'Pending' : 'Canceled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {reservation.terrain?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(reservation.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {reservation.startTime}-{reservation.endTime}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

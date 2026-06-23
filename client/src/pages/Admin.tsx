import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Link as LinkIcon, MousePointerClick, Activity, AlertCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';

// Types for your admin data
interface SystemStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  activeUsers24h: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  linkCount: number;
  status: 'active' | 'suspended';
}

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalLinks: 0,
    totalClicks: 0,
    activeUsers24h: 0,
  });

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  // 1. The Real-Time Fetch Function
  const fetchAdminData = async () => {
    try {
      // Fetch both stats and recent users at the same time
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),   // Your total links, clicks, users endpoint
        axios.get('/api/admin/recent-users') // Your latest signups endpoint
      ]);
      
      setStats(statsRes.data.data || statsRes.data);
      setRecentUsers(usersRes.data.data || usersRes.data);
      setError('');
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      // Only set error if we don't already have data to prevent the screen flashing
      if (stats.totalUsers === 0) setError("Failed to connect to admin services.");
    } finally {
      setLoading(false);
    }
  };

  // 2. The Polling Interval (The "Real-Time" Magic)
  useEffect(() => {
    // Fetch immediately on load
    fetchAdminData();

    // Fetch new data every 5 seconds silently in the background
    const interval = setInterval(() => {
      fetchAdminData();
    }, 5000);

    // Clean up the interval when leaving the admin page
    return () => clearInterval(interval);
  }, []);

  const AdminStatCard = ({ title, value, icon, trend, color }: any) => (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        {trend && (
          <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
            <ArrowUpRight size={14} className="mr-1" /> {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-black text-white tracking-tight">{value.toLocaleString()}</h3>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">{title}</p>
    </div>
  );

  if (loading) return <div className="p-10 text-center text-gray-500">Loading live system metrics...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-brand-500" /> Admin Control Center
        </h1>
        <p className="text-gray-400 mt-1">Live platform-wide metrics, system health, and user management.</p>
      </div>

      {/* Top System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={24} className="text-blue-400" />} 
          color="bg-blue-500/10"
        />
        <AdminStatCard 
          title="System Links" 
          value={stats.totalLinks} 
          icon={<LinkIcon size={24} className="text-brand-400" />} 
          color="bg-brand-500/10"
        />
        <AdminStatCard 
          title="Global Clicks" 
          value={stats.totalClicks} 
          icon={<MousePointerClick size={24} className="text-purple-400" />} 
          color="bg-purple-500/10"
        />
        <AdminStatCard 
          title="Active Users (24h)" 
          value={stats.activeUsers24h} 
          icon={<Activity size={24} className="text-emerald-400" />} 
          color="bg-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Users Table */}
        <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
            <h2 className="font-bold text-white">Recent Signups</h2>
            <button className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">View All Users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/80 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Total Links</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr key={user.id || user.email} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-200">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{user.joinedAt}</td>
                      <td className="px-6 py-4 text-gray-300 font-mono">{user.linkCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: System Alerts & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">API Servers</span>
                <span className="flex items-center text-emerald-400 text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Database Load</span>
                <span className="text-emerald-400 text-sm font-medium">Normal</span>
              </div>
            </div>
          </div>

          {/* Admin Alerts Widget */}
          <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6">
            <h2 className="font-bold text-red-400 flex items-center gap-2 mb-4">
              <AlertCircle size={18} /> Active Alerts
            </h2>
            <div className="space-y-3">
              {stats.totalClicks > 10000 ? (
                 <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/30">
                  <p className="text-sm text-red-300 font-medium">High Traffic Volume</p>
                  <p className="text-xs text-red-400/70 mt-1">System is processing over 10,000 clicks.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active alerts right now.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { UrlForm } from '../components/UrlForm';
import { UrlTable } from '../components/UrlTable';
import { SkeletonCard, ToastContainer } from '../components/index';
import  TopPerformance  from '../components/TopPerformance'; 
import { useUrls } from '../hooks/useUrls';
import { useToast } from '../hooks/useToast';
import { isExpired } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const StatCard: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode; }> = ({ label, value, color, icon }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { urls, loading, createUrl, updateUrl, deleteUrl, refetch } = useUrls();
  const { toasts, show, remove } = useToast();
  const { user } = useAuth();

  // Live auto-refresh polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (refetch) refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Derived metrics recalculated instantly on live updates
  const totalClicks = urls.reduce((acc, u) => acc + u.clickCount, 0);
  const activeCount = urls.filter((u) => u.status === 'active' && !isExpired(u.expiryDate)).length;
  const expiredCount = urls.filter((u) => isExpired(u.expiryDate)).length;
  
  // Real-time Top Performance Calculation
  const topLink = [...urls].sort((a, b) => b.clickCount - a.clickCount)[0];

  const handleCreate = async (data: { originalUrl: string; customAlias?: string; expiryDate?: string; tags?: string[] }) => {
    try {
      await createUrl(data);
      show('Short link created!', 'success');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to create URL';
      show(msg || 'Failed to create URL', 'error');
      throw err;
    }
  };

  const handleUpdate = async (id: string, data: { originalUrl?: string; status?: 'active' | 'disabled'; expiryDate?: string | null; }) => {
    try {
      await updateUrl(id, data);
      show('Link updated', 'success');
    } catch {
      show('Failed to update link', 'error');
      throw new Error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      show('Link deleted', 'success');
    } catch {
      show('Failed to delete link', 'error');
      throw new Error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="ml-64 p-8 grid grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome Back, {user?.name || 'User'} </h1>
            <p className="text-gray-400 mt-1">Here's what's happening with your links today.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {loading && urls.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard label="Total URLs" value={urls.length} color="bg-brand-900/50" icon={<span className="text-brand-400">🔗</span>} />
                <StatCard label="Total Clicks" value={totalClicks} color="bg-purple-900/50" icon={<span className="text-purple-400">✨</span>} />
                <StatCard label="Active Links" value={activeCount} color="bg-green-900/50" icon={<span className="text-green-400">✔️</span>} />
                <StatCard label="Expired Links" value={expiredCount} color="bg-yellow-900/50" icon={<span className="text-yellow-400">⏳</span>} />
              </>
            )}
          </div>

          <UrlForm onCreate={handleCreate} />
          <UrlTable urls={urls} loading={loading} onDelete={handleDelete} onUpdate={handleUpdate} onCopied={() => show('Copied!', 'success')} />
        </div>

        {/* Right Column: Dynamic Widgets */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Swapped raw layout with clean, dynamic TopPerformance component */}
          <TopPerformance 
            clicks={topLink ? topLink.clickCount : 0} 
            shortPath={topLink ? topLink.shortCode : 'No links'} 
            isLoading={loading && urls.length === 0}
          />
          
          <div className="card p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <h3 className="text-white font-bold mb-4">Recent Activity</h3>
            <div className="relative pl-6 border-l border-gray-800">
              <div className="absolute -left-1.5 top-1 w-3 h-3 bg-brand-600 rounded-full"></div>
              <p className="text-sm text-white font-medium">System Online</p>
              <p className="text-xs text-gray-500">Live monitoring active</p>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Nav link helper
  const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        isActive(to) 
        ? 'bg-brand-600/10 text-brand-400' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-30">
      
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800/50 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
            SmartLink
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8">
        
        {/* Menu Section */}
        <div>
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
          <div className="space-y-1">
            <NavItem to="/dashboard">📊 Dashboard</NavItem>
            <NavItem to="/settings">⚙️ Settings</NavItem>
          </div>
        </div>

       </nav>

      {/* User Profile & Logout at the Bottom */}
      <div className="p-4 border-t border-gray-800/50 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 bg-brand-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
// import { useToast } from '../hooks/useToast'; 
import { User, Lock, Key, Bell, Save, Copy, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  // const { show } = useToast(); 
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'api'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  //  NEW: Avatar State and Ref
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Use this to send to your backend
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock API Key
  const apiKey = "sk_live_59fb2a...9834x";

  // --- NEW: Avatar Handlers ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit.");
        return;
      }
      
      // Create a local URL for immediate preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setAvatarFile(file); // Store the actual file for API submission
    }
  };

  // Handlers
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call: 
    // If you have an avatarFile, you'd typically use FormData here
    // const formData = new FormData();
    // formData.append('name', profileData.name);
    // if (avatarFile) formData.append('avatar', avatarFile);
    // await axios.put('/api/users/profile', formData)
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!'); 
    }, 800);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    }, 800);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Reusable Tab Button Component
  const TabButton = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20 shadow-inner' 
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile, security preferences, and API access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Inner Sidebar (Navigation) */}
        <div className="md:col-span-3 space-y-2">
          <TabButton id="profile" label="My Profile" icon={User} />
          <TabButton id="security" label="Security" icon={Lock} />
          <TabButton id="api" label="Developer API" icon={Key} />
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9">
          
          {/* PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <div className="bg-[#11131e]/50 border border-gray-900 rounded-2xl p-8 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-gray-400" /> Profile Information
              </h2>
              
              <div className="flex items-center gap-6 mb-8">
                {/* --- UPDATED: Avatar Display --- */}
                <div 
                  className="w-20 h-20 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    profileData.name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  {/* --- NEW: Hidden File Input --- */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept=".jpg,.jpeg,.png,.gif" 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={handleAvatarClick}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors border border-gray-700"
                  >
                    Change Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-[#0b0c14] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled
                      className="w-full bg-[#0b0c14] border border-gray-800 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-600 mt-1">Contact support to change your email.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800/50 flex justify-end">
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-[#11131e]/50 border border-gray-900 rounded-2xl p-8 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock size={20} className="text-gray-400" /> Update Password
              </h2>
              
              <form onSubmit={handleSecuritySubmit} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                    className="w-full bg-[#0b0c14] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                    className="w-full bg-[#0b0c14] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    className="w-full bg-[#0b0c14] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-gray-800/50 flex justify-end">
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
                    <Save size={16} /> {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'api' && (
            <div className="bg-[#11131e]/50 border border-gray-900 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Key size={20} className="text-gray-400" /> Developer API
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Use this key to create short links directly from your own applications.</p>
                </div>
                <button className="text-sm text-brand-400 hover:text-brand-300 font-medium">Read Docs</button>
              </div>
              
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Secret Key</label>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-[#0b0c14] border border-gray-800 rounded-lg p-3 text-brand-400 font-mono text-sm tracking-widest blur-[4px] hover:blur-none transition-all duration-300">
                    {apiKey}
                  </code>
                  <button 
                    onClick={handleCopyKey}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                  >
                    {copiedKey ? <><Check size={16} className="text-emerald-400"/> Copied</> : <><Copy size={16} /> Copy</>}
                  </button>
                </div>
                <p className="text-xs text-amber-500/80 mt-3 flex items-center gap-1.5">
                  <Bell size={12} /> Hover over the key to reveal it. Do not share this key with anyone.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center">
                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                  Revoke Key
                </button>
                <button className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                  Generate New Key
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
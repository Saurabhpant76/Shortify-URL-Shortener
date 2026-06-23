import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Copy, Trash2, BarChart2, QrCode, X, Check } from 'lucide-react';

interface UrlLink {
  _id?: string;
  id: string;
  shortCode: string;   // Matched to backend schema
  originalUrl: string;
  clickCount: number;  // Matched to backend schema
  createdAt: string;
}

const Links: React.FC = () => {
  const [links, setLinks] = useState<UrlLink[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get('/api/links');
        setLinks(response.data);
      } catch (err) {
        console.error("Failed to fetch links", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleCopy = async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;
    setIsCreating(true);
    try {
      const response = await axios.post('/api/links', { originalUrl: targetUrl });
      setLinks(prevLinks => [response.data, ...prevLinks]);
      setIsModalOpen(false);
      setTargetUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <div className="text-center p-10 text-white">Loading your links...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="ml-64 p-8 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-400 text-sm">Manage, share, and track all your active short redirects.</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create New Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {links.length === 0 ? (
            <p className="text-gray-500 text-center py-10 col-span-2">No links created yet.</p>
          ) : (
            links.map((link) => {
              const currentId = link._id || link.id;
              // Generates the accurate dynamic redirection endpoint layout address string
              const fullShortUrl = `http://10.10.120.204:5000/${link.shortCode}`;

              return (
                <div key={currentId} className="bg-[#11131e]/50 border border-gray-900 rounded-2xl p-6 shadow-xl max-w-md">
                  
                  {/* Header details metric */}
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Original Target</p>
                      <p className="font-bold text-gray-200 truncate text-[15px]" title={link.originalUrl}>
                        {link.originalUrl}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">CLICKS</p>
                      <p className="text-2xl font-black text-emerald-400 leading-none">{link.clickCount || 0}</p>
                    </div>
                  </div>

                  {/* Inner Box and copy action row */}
                  <div className="bg-[#0b0c14] border border-gray-900 rounded-xl p-2.5 flex justify-between items-center mb-6">
                    <span className="text-blue-500 font-medium text-sm pl-2 truncate">{fullShortUrl}</span>
                    <button 
                      onClick={() => handleCopy(fullShortUrl, currentId)}
                      className="flex items-center gap-1.5 bg-[#1a1d2d] border border-gray-800 px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-200 hover:bg-gray-800 transition-colors shrink-0"
                    >
                      {copiedId === currentId ? (
                        <>
                          <Check size={13} className="text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Date and icon actions group */}
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-xs font-medium tracking-wide">
                      {link.createdAt ? new Date(link.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'Jun 15, 2026, 01:03 PM'}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-[#1a1d2d]/60 border border-gray-800/40 text-gray-400 hover:text-white rounded-xl transition-colors">
                        <QrCode size={15} />
                      </button>
                      <button className="p-2 bg-[#1a1d2d]/60 border border-gray-800/40 text-gray-400 hover:text-white rounded-xl transition-colors">
                        <BarChart2 size={15} />
                      </button>
                      <button className="p-2 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/30 rounded-xl transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Modal section remains identical layout logic structure hook */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1c24] border border-gray-700 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create Short Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateLink}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Destination URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://example.com/long-url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {isCreating ? 'Shortening...' : 'Shorten'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;
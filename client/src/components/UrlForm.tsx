import React, { useState } from 'react';
import { Spinner } from './Loaders';

interface UrlFormProps {
  // Update: added tags?: string[] to the interface
  onCreate: (data: { originalUrl: string; customAlias?: string; expiryDate?: string; tags?: string[] }) => Promise<void>;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onCreate }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState('');
  const [utmSource, setUtmSource] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!originalUrl) { setError('Please enter a URL'); return; }

    setLoading(true);
    try {
      // Tags processing: split by comma, trim spaces, and filter empty ones
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await onCreate({
        originalUrl,
        customAlias: customAlias || undefined,
        expiryDate: expiryDate || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined, 
      });
      
      // Reset form on success
      setOriginalUrl(''); setCustomAlias(''); setExpiryDate(''); 
      setPassword(''); setTags(''); setUtmSource('');
      setShowAdvanced(false);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to shorten URL';
      setError(msg || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Create Short Link</h2>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'single' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Single Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'bulk' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Bulk CSV
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main URL Input */}
        <div>
          <label className="label">Destination URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              type="url"
              className="input pl-10 py-3 w-full bg-gray-900 focus:bg-gray-800 border-gray-700"
              placeholder="https://example.com/your-very-long-url-path..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required={activeTab === 'single'}
              disabled={activeTab === 'bulk'}
            />
          </div>
          {activeTab === 'bulk' && <p className="text-xs text-brand-400 mt-2">Upload feature coming soon!</p>}
        </div>

        {/* Advanced Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <div className={`p-1 bg-gray-800 rounded transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          Advanced Options (Tags, Password, UTM)
        </button>

        {/* Advanced Fields Accordion */}
        {showAdvanced && (
          <div className="grid sm:grid-cols-2 gap-5 pt-3 pb-2 animate-fade-in border-t border-gray-800">
            <div>
              <label className="label">Custom Alias</label>
              <input className="input bg-gray-900" placeholder="e.g. my-promo" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} maxLength={30} />
            </div>
            <div>
              <label className="label">Tags / Folder</label>
              <input className="input bg-gray-900" placeholder="Marketing, Social" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div>
              <label className="label text-brand-400">🔒 Password Protection</label>
              <input type="password" className="input bg-gray-900 border-brand-900/30 focus:border-brand-500" placeholder="Leave blank for public" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="label">Expiry Date</label>
              <input type="date" className="input bg-gray-900" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">UTM Source</label>
              <input className="input bg-gray-900" placeholder="e.g. twitter, newsletter" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-400 animate-fade-in bg-red-900/20 p-3 rounded-lg border border-red-800/50">{error}</p>}

        {/* Full Width Submit Button */}
        <button type="submit" disabled={loading || activeTab === 'bulk'} className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2">
          {loading ? <Spinner size="sm" /> : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Short Link
            </>
          )}
        </button>
      </form>
    </div>
  );
};
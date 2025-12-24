
import React, { useState } from 'react';
import { Category, JobEntry, AdSettings, IndianState } from '../types';
import { addJob, getJobs, deleteJob, getAdSettings, saveAdSettings } from '../db';
import { summarizeJobNotification, searchLatestJobs } from '../geminiService';

interface AdminPanelProps {
  onUpdate: () => void;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'monetization'>('jobs');
  const [formData, setFormData] = useState<Partial<JobEntry>>({
    title: '',
    department: '',
    category: Category.LATEST_JOB,
    state: 'Others',
    link: '',
    isUrgent: false,
    totalPosts: '',
    eligibility: '',
    ageLimit: '',
    fee: '',
    importantDates: ''
  });
  
  const [rawText, setRawText] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState(getJobs());
  const [adSettings, setAdSettings] = useState<AdSettings>(getAdSettings());
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      showNotification('लॉगिन सफल!');
    } else {
      showNotification('पासवर्ड गलत है!', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob(formData as any);
    setFormData({
      title: '', department: '', category: Category.LATEST_JOB, state: 'Others',
      link: '', isUrgent: false, totalPosts: '', eligibility: '', ageLimit: '',
      fee: '', importantDates: ''
    });
    setJobs(getJobs());
    onUpdate();
    showNotification('जॉब सफलतापूर्वक जोड़ी गई!');
  };

  const handleAISummarize = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const summary = await summarizeJobNotification(rawText);
      setFormData({
        ...formData,
        title: summary.postName,
        totalPosts: summary.totalPosts,
        eligibility: summary.eligibility,
        ageLimit: summary.ageLimit,
        fee: summary.fee,
        importantDates: summary.importantDates
      });
      showNotification('AI ने डेटा निकाल लिया है!');
    } catch (err) {
      showNotification('AI एरर!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!searchDept.trim()) return;
    setLoading(true);
    try {
      const result = await searchLatestJobs(searchDept);
      setFormData({
        ...formData,
        title: result.data.postName,
        department: searchDept,
        totalPosts: result.data.totalPosts,
        eligibility: result.data.eligibility,
        ageLimit: result.data.ageLimit,
        fee: result.data.fee,
        importantDates: result.data.importantDates,
        link: result.data.officialUrl
      });
      showNotification('AI ने इंटरनेट से जॉब ढूंढ ली है! ✨');
    } catch (err) {
      showNotification('जॉब नहीं मिली। मैन्युअल प्रयास करें।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if(confirm('डिलीट करें?')) {
      deleteJob(id);
      setJobs(getJobs());
      onUpdate();
    }
  };

  const states: IndianState[] = ['Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'MP', 'Haryana', 'Others'];

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-white p-10 rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm">
          <h2 className="text-xl font-black text-center mb-6">ADMIN PORTAL LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Password" className="w-full p-4 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-red-600 text-white font-black rounded-lg">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border">
      {notification && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-2xl z-[100] font-bold text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-blue-900">ADMIN CONTROL PANEL</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded">
           <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 rounded text-xs font-black uppercase ${activeTab === 'jobs' ? 'bg-blue-900 text-white' : ''}`}>Post Updates</button>
           <button onClick={() => setActiveTab('monetization')} className={`px-4 py-2 rounded text-xs font-black uppercase ${activeTab === 'monetization' ? 'bg-green-600 text-white' : ''}`}>Ads/Revenue</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Search & Form */}
        <div className="space-y-6">
           <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="text-sm font-black mb-2 text-blue-800 uppercase">AI Job Auto-Finder (New)</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Department (e.g. SSC, UP Police)" className="flex-1 p-2 border rounded text-sm" value={searchDept} onChange={(e) => setSearchDept(e.target.value)} />
                <button onClick={handleAISearch} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-black uppercase disabled:opacity-50">
                   {loading ? 'Finding...' : 'Auto-Find'}
                </button>
              </div>
              <p className="text-[9px] text-blue-400 mt-2 font-bold italic">*This uses Gemini AI to search the web and fill the form automatically.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                 <select className="p-2 border rounded text-xs font-bold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <select className="p-2 border rounded text-xs font-bold" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value as IndianState})}>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
              <input type="text" placeholder="Post Title" className="w-full p-2 border rounded font-bold text-sm" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <input type="text" placeholder="Apply Link" className="w-full p-2 border rounded text-sm" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} required />
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                <input type="checkbox" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
                <label className="text-[10px] font-black uppercase text-red-600">Urgent Flash Update</label>
              </div>
              <button type="submit" className="w-full py-3 bg-red-600 text-white font-black rounded uppercase shadow-lg hover:bg-red-700 transition">Publish Update</button>
           </form>
        </div>

        {/* Live List */}
        <div className="border rounded-xl overflow-hidden bg-gray-50 flex flex-col h-[600px]">
           <div className="bg-gray-800 text-white p-3 text-xs font-black uppercase">Live Postings ({jobs.length})</div>
           <div className="flex-1 overflow-y-auto divide-y">
              {jobs.map(job => (
                <div key={job.id} className="p-3 hover:bg-white transition flex justify-between items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[11px] text-blue-900 uppercase truncate">{job.title}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{job.category}</p>
                  </div>
                  <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-700 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

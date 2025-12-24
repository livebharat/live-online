
import React, { useState } from 'react';
import { Category, JobEntry, AdSettings, IndianState } from '../types';
import { addJob, getJobs, deleteJob, getAdSettings, saveAdSettings } from '../db';
import { summarizeJobNotification, searchLatestJobs } from '../geminiService';

interface AdminPanelProps {
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'ai_scanner' | 'list'>('manual');
  const [loading, setLoading] = useState(false);
  const [searchDept, setSearchDept] = useState('');
  
  const [formData, setFormData] = useState<Partial<JobEntry>>({
    title: '',
    department: '',
    category: Category.LATEST_JOB,
    state: 'Others',
    link: '',
    isUrgent: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
  };

  const handleAIScan = async () => {
    if (!searchDept) return;
    setLoading(true);
    try {
      const result = await searchLatestJobs(searchDept);
      setFormData({
        ...formData,
        title: result.data.postName,
        department: searchDept,
        link: result.data.officialUrl,
        totalPosts: result.data.totalPosts,
        eligibility: result.data.eligibility,
        ageLimit: result.data.ageLimit,
        fee: result.data.fee,
        importantDates: result.data.importantDates
      });
      alert('AI ने डेटा स्कैन कर लिया है! फॉर्म चेक करें।');
      setActiveTab('manual');
    } catch (e) {
      alert('स्कैनिंग विफल हुई।');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob(formData as any);
    setFormData({ title: '', department: '', category: Category.LATEST_JOB, state: 'Others', link: '', isUrgent: false });
    onUpdate();
    alert('जॉब सेव हो गई!');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center py-20 animate-fadeIn">
        <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-red-600 w-full max-w-sm text-center">
          <div className="bg-red-600 text-white w-16 h-16 rounded-xl mx-auto flex items-center justify-center text-3xl font-black mb-6">S</div>
          <h2 className="text-xl font-black mb-6 uppercase tracking-tighter">Admin Portal Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Admin Password" className="w-full p-4 border rounded-xl font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-blue-900 text-white font-black rounded-xl hover:bg-red-600 transition shadow-lg">AUTHENTICATE</button>
          </form>
          <p className="text-[10px] text-gray-400 mt-6 font-black uppercase tracking-widest">Protected by Sarkari Portal AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border">
      <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
         <h2 className="text-2xl font-black italic uppercase tracking-tighter">System Control Panel</h2>
         <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
            <button onClick={() => setActiveTab('ai_scanner')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${activeTab === 'ai_scanner' ? 'bg-red-600 text-white' : ''}`}>AI Scanner</button>
            <button onClick={() => setActiveTab('manual')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${activeTab === 'manual' ? 'bg-red-600 text-white' : ''}`}>Form</button>
            <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${activeTab === 'list' ? 'bg-red-600 text-white' : ''}`}>History</button>
         </div>
      </div>

      <div className="p-8">
        {activeTab === 'ai_scanner' && (
          <div className="max-w-xl mx-auto space-y-6 text-center py-10">
             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl animate-pulse">✨</span>
             </div>
             <h3 className="text-2xl font-black text-blue-900">AI Auto-Pilot Mode</h3>
             <p className="text-sm text-gray-500 font-bold italic">बस विभाग का नाम लिखें, AI खुद ही इंटरनेट से लेटेस्ट नोटिफिकेशन ढूंढ लाएगा।</p>
             <div className="flex gap-2 bg-gray-50 p-4 rounded-2xl border">
                <input type="text" placeholder="e.g. SSC, Railway, UP Police..." className="flex-1 p-3 rounded-xl border-2 focus:border-red-600 outline-none font-bold" value={searchDept} onChange={(e) => setSearchDept(e.target.value)} />
                <button onClick={handleAIScan} disabled={loading} className="bg-red-600 text-white px-8 rounded-xl font-black uppercase disabled:opacity-50">
                   {loading ? 'Scanning...' : 'Start Search'}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <input type="text" placeholder="Job Title" className="w-full p-4 border rounded-xl font-black text-blue-900" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                <input type="text" placeholder="Department" className="w-full p-4 border rounded-xl font-bold" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                <input type="text" placeholder="Apply URL" className="w-full p-4 border rounded-xl font-bold" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
             </div>
             <div className="space-y-4">
                <select className="w-full p-4 border rounded-xl font-black" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})}>
                   {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                   <input type="checkbox" className="w-6 h-6 rounded-lg" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
                   <label className="font-black uppercase text-red-600 text-xs">Urgent Flash Notification</label>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-900 text-white font-black rounded-xl shadow-2xl uppercase tracking-widest hover:bg-red-600 transition">Publish Live</button>
             </div>
          </form>
        )}

        {activeTab === 'list' && (
          <div className="divide-y border rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto no-scrollbar">
             {getJobs().map(job => (
               <div key={job.id} className="p-4 flex justify-between items-center bg-gray-50 hover:bg-white transition">
                  <div>
                    <p className="font-black text-blue-900 uppercase text-xs">{job.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{job.category}</p>
                  </div>
                  <button onClick={() => { if(confirm('Delete?')) { deleteJob(job.id); onUpdate(); } }} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

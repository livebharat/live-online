
import React, { useState } from 'react';
import { Category, JobEntry, AdSettings, IndianState, Qualification } from '../types';
import { addJob, getJobs, deleteJob, getAdSettings, saveAdSettings } from '../db';
import { searchLatestJobs } from '../geminiService';

interface AdminPanelProps {
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'auto_sync' | 'list'>('auto_sync');

  const [formData, setFormData] = useState<Partial<JobEntry>>({
    title: '',
    department: '',
    category: Category.LATEST_JOB,
    state: 'Others',
    qualification: '12th Pass',
    link: '',
    isUrgent: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
  };

  const handleAutoSync = async () => {
    setLoading(true);
    try {
      // Simulate/Trigger AI to find latest 5 jobs
      const departments = ['SSC', 'UPSC', 'UP Police', 'Railway', 'Indian Army'];
      for (const dept of departments) {
        const result = await searchLatestJobs(dept);
        addJob({
          title: result.data.postName,
          department: dept,
          category: Category.LATEST_JOB,
          state: 'Others',
          qualification: 'Graduate',
          link: result.data.officialUrl,
          description: result.data.importantDates,
          lastDate: result.data.importantDates,
          totalPosts: result.data.totalPosts,
          eligibility: result.data.eligibility,
          ageLimit: result.data.ageLimit,
          fee: result.data.fee,
          importantDates: result.data.importantDates
        } as any);
      }
      onUpdate();
      alert('AI Sync Successful! 5 New Jobs Added Automatically.');
      setActiveTab('list');
    } catch (e) {
      alert('Error during AI Sync');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob(formData as any);
    setFormData({ title: '', department: '', category: Category.LATEST_JOB, state: 'Others', qualification: '12th Pass', link: '', isUrgent: false });
    onUpdate();
    alert('Job Published!');
    setActiveTab('list');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center py-20 animate-fadeIn">
        <div className="bg-white p-10 rounded shadow-2xl border-t-8 border-[#ff0000] w-full max-w-sm text-center">
          <h2 className="text-xl font-black mb-6 uppercase">Admin Authentication</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Password" className="w-full p-4 border rounded font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-[#000080] text-white font-black rounded hover:bg-red-600 transition">LOGIN</button>
          </form>
          <p className="text-[10px] mt-4 text-gray-400">Default: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-2xl border-2 border-[#000080] overflow-hidden">
      <div className="bg-[#000080] text-white p-4 flex justify-between items-center">
         <h2 className="font-black uppercase italic">Dashboard Control</h2>
         <div className="flex gap-1">
            <button onClick={() => setActiveTab('auto_sync')} className={`px-4 py-2 rounded text-[10px] font-black uppercase ${activeTab === 'auto_sync' ? 'bg-red-600' : 'bg-white/10'}`}>AI Auto-Sync</button>
            <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded text-[10px] font-black uppercase ${activeTab === 'form' ? 'bg-red-600' : 'bg-white/10'}`}>Manual Post</button>
            <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded text-[10px] font-black uppercase ${activeTab === 'list' ? 'bg-red-600' : 'bg-white/10'}`}>Live List</button>
         </div>
      </div>

      <div className="p-8">
        {activeTab === 'auto_sync' && (
          <div className="text-center space-y-6 py-10">
             <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto border-4 border-red-600 animate-pulse">
                <span className="text-4xl">🚀</span>
             </div>
             <h3 className="text-2xl font-black text-blue-900 uppercase">One-Click AI Sync</h3>
             <p className="text-sm font-bold text-gray-500 max-w-lg mx-auto leading-relaxed">Gemini AI will now crawl the web for the latest notifications from SSC, UPSC, Army, and Railways and add them automatically to your portal.</p>
             <button onClick={handleAutoSync} disabled={loading} className="bg-red-600 text-white px-12 py-5 rounded-full font-black uppercase shadow-2xl hover:scale-105 transition disabled:opacity-50 tracking-widest">
                {loading ? 'AI IS CRAWLING THE WEB...' : 'START AI AUTOMATIC SYNC'}
             </button>
          </div>
        )}

        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Job Title" className="p-3 border rounded font-black uppercase text-xs" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
             <input type="text" placeholder="Dept Name" className="p-3 border rounded font-bold" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
             <select className="p-3 border rounded font-bold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})}>
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
             </select>
             <select className="p-3 border rounded font-bold" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value as Qualification})}>
                {['10th Pass', '12th Pass', 'ITI/Diploma', 'Graduate', 'Post Graduate'].map(q => <option key={q} value={q}>{q}</option>)}
             </select>
             <input type="text" placeholder="URL" className="p-3 border rounded" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} required />
             <div className="bg-red-50 p-3 rounded flex items-center gap-2 border border-red-200">
                <input type="checkbox" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
                <label className="text-[10px] font-black uppercase text-red-600">Flash News Item</label>
             </div>
             <button type="submit" className="md:col-span-2 py-4 bg-green-600 text-white font-black uppercase rounded shadow-lg">Publish Now</button>
          </form>
        )}

        {activeTab === 'list' && (
          <div className="divide-y border rounded overflow-hidden max-h-[500px] overflow-y-auto no-scrollbar">
             {getJobs().map(j => (
               <div key={j.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <span className="font-black text-[10px] text-blue-900 uppercase truncate">{j.title}</span>
                  <button onClick={() => { if(confirm('Delete?')) { deleteJob(j.id); onUpdate(); } }} className="text-red-600 font-black text-[10px] border border-red-600 px-2 py-1 rounded">DEL</button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

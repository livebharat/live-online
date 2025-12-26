
import React, { useState } from 'react';
import { Category, JobEntry, IndianState, Qualification } from '../types';
import { addJob, getJobs, deleteJob } from '../db';

interface AdminPanelProps {
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  
  const [formData, setFormData] = useState<Partial<JobEntry>>({
    title: '',
    department: '',
    category: Category.LATEST_JOB,
    state: 'Others',
    qualification: '12th Pass',
    link: '',
    isUrgent: false,
    totalPosts: '',
    eligibility: '',
    ageLimit: '',
    fee: '',
    importantDates: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Invalid Admin Password');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.link) {
      alert('Title and Link are required!');
      return;
    }
    addJob(formData as any);
    setFormData({ 
      title: '', department: '', category: Category.LATEST_JOB, 
      state: 'Others', qualification: '12th Pass', link: '', 
      isUrgent: false, totalPosts: '', eligibility: '', 
      ageLimit: '', fee: '', importantDates: '' 
    });
    onUpdate();
    alert('Post Published Successfully to ' + formData.category);
    setActiveTab('manage');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-white p-10 rounded-xl shadow-2xl border-t-8 border-[#ff0000] w-full max-w-sm">
          <h2 className="text-2xl font-black mb-6 text-center text-[#000080] uppercase">ADMIN ACCESS</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              className="w-full p-4 border-2 rounded-lg font-bold outline-none focus:border-[#ff0000]" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit" className="w-full py-4 bg-[#000080] text-white font-black rounded-lg hover:bg-[#ff0000] transition-colors shadow-lg">LOGIN TO PANEL</button>
          </form>
          <p className="text-[10px] text-center mt-6 text-gray-400 font-bold">WWW.SARKARIRESULTIVE.XYZ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-[#000080] overflow-hidden">
      <div className="bg-[#000080] text-white p-5 flex justify-between items-center">
        <h2 className="text-xl font-black italic uppercase">System Control Panel</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('create')} 
            className={`px-6 py-2 rounded font-black text-xs uppercase transition ${activeTab === 'create' ? 'bg-[#ff0000]' : 'hover:bg-white/10'}`}
          >
            New Post
          </button>
          <button 
            onClick={() => setActiveTab('manage')} 
            className={`px-6 py-2 rounded font-black text-xs uppercase transition ${activeTab === 'manage' ? 'bg-[#ff0000]' : 'hover:bg-white/10'}`}
          >
            Manage Posts
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'create' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-500 uppercase">Primary Details</label>
                <input type="text" placeholder="Post Title (e.g., SSC GD Online Form)" className="w-full p-3 border-2 rounded font-bold uppercase text-xs" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                <input type="text" placeholder="Department (e.g., SSC)" className="w-full p-3 border-2 rounded font-bold" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                <input type="text" placeholder="Official/Apply Link" className="w-full p-3 border-2 rounded font-bold" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-3 border-2 rounded font-black text-xs uppercase" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="p-3 border-2 rounded font-black text-xs uppercase" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value as Qualification})}>
                    {['10th Pass', '12th Pass', 'ITI/Diploma', 'Graduate', 'Post Graduate'].map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-500 uppercase">Notification Specifics (Optional)</label>
                <input type="text" placeholder="Total Posts" className="w-full p-3 border-2 rounded font-bold" value={formData.totalPosts} onChange={(e) => setFormData({...formData, totalPosts: e.target.value})} />
                <input type="text" placeholder="Eligibility" className="w-full p-3 border-2 rounded font-bold" value={formData.eligibility} onChange={(e) => setFormData({...formData, eligibility: e.target.value})} />
                <input type="text" placeholder="Age Limit" className="w-full p-3 border-2 rounded font-bold" value={formData.ageLimit} onChange={(e) => setFormData({...formData, ageLimit: e.target.value})} />
                <input type="text" placeholder="Important Dates" className="w-full p-3 border-2 rounded font-bold" value={formData.importantDates} onChange={(e) => setFormData({...formData, importantDates: e.target.value})} />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-100 flex items-center gap-4">
              <input type="checkbox" className="w-6 h-6" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
              <label className="text-xs font-black text-[#ff0000] uppercase">Show in Breaking News / Flash Updates</label>
            </div>

            <button type="submit" className="w-full py-5 bg-[#000080] text-white font-black text-xl rounded-lg hover:bg-[#ff0000] transition-all shadow-xl border-b-8 border-black/20 uppercase">
              PUBLISH LIVE TO {formData.category}
            </button>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase">
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {getJobs().map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="p-4 font-black text-[#000080] text-xs uppercase truncate max-w-[300px]">{job.title}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-3 py-1 rounded-full uppercase">{job.category}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => { if(confirm('Delete this post?')) { deleteJob(job.id); onUpdate(); } }} 
                        className="text-[#ff0000] font-black text-[10px] border-2 border-[#ff0000] px-4 py-1.5 rounded-lg hover:bg-[#ff0000] hover:text-white transition-all"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

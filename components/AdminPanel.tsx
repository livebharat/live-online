
import React, { useState, useEffect } from 'react';
import { Category, JobEntry, AdSettings, IndianState } from '../types';
import { addJob, getJobs, deleteJob, getAdSettings, saveAdSettings } from '../db';
import { summarizeJobNotification } from '../geminiService';

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
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'monetization'>('jobs');
  const [formData, setFormData] = useState<Partial<JobEntry>>({
    title: '',
    department: '',
    category: Category.LATEST_JOB,
    state: 'Others',
    lastDate: '',
    link: '',
    description: '',
    isUrgent: false,
    totalPosts: '',
    eligibility: '',
    ageLimit: '',
    fee: '',
    importantDates: ''
  });
  const [rawText, setRawText] = useState('');
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
      setLoginError('');
      showNotification('सफलतापूर्वक लॉगिन किया गया!');
    } else {
      setLoginError('गलत पासवर्ड! कृपया सही पासवर्ड डालें।');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    showNotification('लॉगआउट कर दिया गया है।');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob(formData as any);
    setFormData({
      title: '',
      department: '',
      category: Category.LATEST_JOB,
      state: 'Others',
      lastDate: '',
      link: '',
      description: '',
      isUrgent: false,
      totalPosts: '',
      eligibility: '',
      ageLimit: '',
      fee: '',
      importantDates: ''
    });
    setJobs(getJobs());
    onUpdate();
    showNotification('जॉब सफलतापूर्वक पोर्टल पर जोड़ दी गई है! ✅');
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
        importantDates: summary.importantDates,
        lastDate: summary.importantDates.match(/\d{2}-\d{2}-\d{4}/)?.[0] || 'Check Details'
      });
      setRawText('');
      showNotification('AI ने डेटा सफलतापूर्वक निकाल लिया है! ✨');
    } catch (err) {
      console.error(err);
      showNotification('AI ने काम नहीं किया। कृपया मैन्युअल एंट्री करें।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if(confirm('क्या आप वाकई इसे डिलीट करना चाहते हैं?')) {
      deleteJob(id);
      setJobs(getJobs());
      onUpdate();
      showNotification('आइटम सफलतापूर्वक डिलीट कर दिया गया। 🗑️');
    }
  };

  // Fixed error: Added missing handleSaveAds function
  const handleSaveAds = () => {
    saveAdSettings(adSettings);
    showNotification('विज्ञापन सेटिंग्स सुरक्षित कर दी गई हैं! 💰');
  };

  const states: IndianState[] = ['Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'MP', 'Haryana', 'Others'];

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border border-gray-200 relative">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center py-20">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
            <h2 className="text-2xl font-black text-gray-800 text-center mb-8 uppercase tracking-tighter">Admin Control Center</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" placeholder="Admin Password" className="w-full p-4 border-2 rounded-xl focus:border-red-600 outline-none transition" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
              <button type="submit" className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 shadow-lg">AUTHENTICATE</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {notification && (
            <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] font-bold text-white transition-all animate-pulse ${notification.type === 'success' ? 'bg-blue-600' : 'bg-red-600'}`}>
              {notification.message}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-black text-red-600 uppercase">एडमिन डैशबोर्ड</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('jobs')} className={`px-6 py-2 rounded-md font-bold ${activeTab === 'jobs' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600'}`}>जॉब जोड़ें</button>
              <button onClick={() => setActiveTab('monetization')} className={`px-6 py-2 rounded-md font-bold ${activeTab === 'monetization' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600'}`}>कमाई (Ads)</button>
              <button onClick={handleLogout} className="ml-2 px-4 py-2 text-xs font-bold text-gray-400">Logout</button>
            </div>
          </div>
          
          {activeTab === 'jobs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-2">🤖 AI स्मार्ट एंट्री</h3>
                <textarea className="w-full h-48 p-3 border border-blue-300 rounded-lg mb-3" placeholder="नोटिफिकेशन टेक्स्ट पेस्ट करें..." value={rawText} onChange={(e) => setRawText(e.target.value)} />
                <button onClick={handleAISummarize} disabled={loading} className="w-full py-3 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                  {loading ? 'प्रक्रिया चल रही है...' : 'AI से डेटा भरें'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                   <select className="p-3 border rounded-lg bg-white font-bold text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})}>
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                   <select className="p-3 border rounded-lg bg-white font-bold text-sm" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value as IndianState})}>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
                <input type="text" placeholder="जॉब का शीर्षक (Title)" className="w-full p-3 border rounded-lg font-bold" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                <input type="text" placeholder="विभाग (Department)" className="w-full p-3 border rounded-lg" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
                <input type="text" placeholder="लिंक (Apply Link)" className="w-full p-3 border rounded-lg" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} required />
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-100">
                   <input type="checkbox" id="urg" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
                   <label htmlFor="urg" className="text-xs font-black text-red-600 uppercase">Urgent Posting (High Priority)</label>
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white font-black rounded-lg hover:bg-red-700 shadow-xl transition">पब्लिश करें</button>
              </form>

              <div className="col-span-full mt-10">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 flex items-center justify-between">
                  लाइव लिस्टिंग ({jobs.length})
                  <span className="text-xs font-normal text-gray-400">Manage all your active posts here</span>
                </h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 uppercase text-[10px] font-black">
                      <tr>
                        <th className="p-4 border">Title</th>
                        <th className="p-4 border">State</th>
                        <th className="p-4 border text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {jobs.map(job => (
                        <tr key={job.id} className="hover:bg-red-50 transition">
                          <td className="p-4 border font-bold text-blue-900 text-sm">{job.title}</td>
                          <td className="p-4 border text-xs font-bold text-gray-500">{job.state || 'India'}</td>
                          <td className="p-4 border text-center">
                            <button onClick={() => handleDelete(job.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-[10px] font-black hover:bg-red-600 hover:text-white transition">DELETE</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border shadow-lg space-y-6">
              <h3 className="text-2xl font-black text-center text-green-700 uppercase">AdSense Control</h3>
              <div className="space-y-4">
                 <label className="text-xs font-black uppercase text-gray-500">Publisher ID</label>
                 <input type="text" placeholder="ca-pub-XXXXXXXX" className="w-full p-4 border rounded-xl font-mono text-center text-lg" value={adSettings.publisherId} onChange={(e) => setAdSettings({...adSettings, publisherId: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {['topAdEnabled', 'sideAdsEnabled', 'inlineAdsEnabled'].map(key => (
                   <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                      <input type="checkbox" checked={(adSettings as any)[key]} onChange={(e) => setAdSettings({...adSettings, [key]: e.target.checked})} />
                      <label className="text-[10px] font-black uppercase">{key.replace('Enabled', '')}</label>
                   </div>
                 ))}
              </div>
              <button onClick={handleSaveAds} className="w-full py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 shadow-lg">SAVE AD SETTINGS</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;

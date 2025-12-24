
import React, { useState, useEffect } from 'react';
import { getJobs, getAdSettings } from './db';
import { JobEntry, Category, AdSettings, View, IndianState } from './types';
import JobTicker from './components/JobTicker';
import JobGrid from './components/JobGrid';
import AdminPanel from './components/AdminPanel';
import AdUnit from './components/AdUnit';
import JobDetail from './components/JobDetail';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>(getAdSettings());
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeStateTab, setActiveStateTab] = useState<IndianState | 'All'>('All');
  const [search, setSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedJob, setSelectedJob] = useState<JobEntry | null>(null);

  const refreshData = () => {
    setJobs(getJobs());
    setAdSettings(getAdSettings());
  };

  useEffect(() => {
    refreshData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                          j.department.toLowerCase().includes(search.toLowerCase());
    const matchesState = activeStateTab === 'All' || j.state === activeStateTab;
    return matchesSearch && matchesState;
  });

  const stateTabs: (IndianState | 'All')[] = ['All', 'Uttar Pradesh', 'Bihar', 'Delhi', 'MP', 'Rajasthan', 'Haryana'];

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setView('category_view');
    scrollToTop();
  };

  const renderContent = () => {
    if (view === 'category_view' && selectedCategory) {
      const catJobs = jobs.filter(j => j.category === selectedCategory);
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-red-600">
            <h2 className="text-3xl font-black text-blue-900 uppercase italic flex items-center gap-3">
               <span className="bg-red-600 text-white p-2 rounded-lg text-sm">SEC</span>
               {selectedCategory}
            </h2>
            <p className="text-gray-400 font-bold text-xs mt-2 uppercase tracking-widest">Showing all recent updates in this section</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
             <table className="w-full text-left">
                <thead className="bg-blue-900 text-white uppercase text-xs font-black">
                  <tr>
                    <th className="p-4">Update Description</th>
                    <th className="p-4 hidden md:table-cell">Post Date</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {catJobs.length > 0 ? catJobs.map(job => (
                    <tr key={job.id} className="hover:bg-blue-50 transition">
                      <td className="p-4">
                        <p className="font-black text-blue-800 uppercase text-sm leading-tight">{job.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{job.department}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded">{job.postedDate}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedJob(job)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-blue-900 transition">View Details</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="p-20 text-center font-black text-gray-300 uppercase">No updates found in this category</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'admin': return <AdminPanel onUpdate={refreshData} />;
      case 'about': return <div className="p-10 bg-white shadow-2xl rounded-3xl border-t-8 border-indigo-600 max-w-4xl mx-auto text-center"><h2 className="text-4xl font-black mb-6 uppercase text-indigo-900">About Sarkari Portal AI</h2><p className="text-gray-600 font-bold text-lg leading-relaxed">We are India's first AI-powered job aggregator. Our system scans thousands of government gazettes daily to bring you the fastest notifications.</p></div>;
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="shrink-0">
              <AdUnit type="sidebar" publisherId={adSettings.publisherId} visible={adSettings.isEnabled && adSettings.sideAdsEnabled} />
            </aside>

            <div className="flex-1 space-y-8">
              {/* Iconic Featured Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5">
                 {['SSC GD', 'UP POLICE', 'RPF 2024', 'CTET JULY', 'ARMY RALLY', 'BPSC 70TH', 'UPSC 2024', 'IBPS PO'].map(tag => (
                   <button key={tag} className="bg-blue-900 text-white font-black text-[9px] py-2.5 rounded-lg shadow-md hover:bg-red-600 transform hover:-translate-y-1 transition-all uppercase">{tag}</button>
                 ))}
              </div>

              {/* State Navigation */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 p-3 rounded-2xl flex gap-2 overflow-x-auto no-scrollbar shadow-2xl border-b-4 border-red-600">
                 {stateTabs.map(tab => (
                   <button 
                    key={tab} 
                    onClick={() => setActiveStateTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all whitespace-nowrap border-2 ${activeStateTab === tab ? 'bg-white text-blue-900 border-white shadow-lg scale-105' : 'text-blue-100 border-blue-800 hover:border-white'}`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>

              <JobGrid jobs={filteredJobs} onJobClick={(job) => setSelectedJob(job)} onCategoryViewAll={handleCategoryClick} />

              <AdUnit type="rectangle" publisherId={adSettings.publisherId} visible={adSettings.isEnabled && adSettings.inlineAdsEnabled} />

              {/* Bottom Multi-Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Syllabus', cat: Category.SYLLABUS, color: 'border-green-600', header: 'bg-green-600' },
                    { title: 'Admission', cat: Category.ADMISSION, color: 'border-orange-500', header: 'bg-orange-500' },
                    { title: 'Answer Key', cat: Category.ANSWER_KEY, color: 'border-purple-600', header: 'bg-purple-600' }
                  ].map(({ title, cat, color, header }) => (
                    <section key={cat} className={`bg-white border-2 ${color} rounded-2xl shadow-xl overflow-hidden flex flex-col h-[400px]`}>
                      <div className={`${header} text-white p-3 font-black text-center uppercase tracking-widest text-xs flex justify-between items-center px-4`}>
                        {title}
                        <button onClick={() => handleCategoryClick(cat)} className="bg-white/20 px-2 py-0.5 rounded text-[8px] hover:bg-white/40">ALL</button>
                      </div>
                      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
                        {jobs.filter(j => j.category === cat).slice(0, 8).map(j => (
                          <button key={j.id} onClick={() => setSelectedJob(j)} className="block w-full text-left text-blue-900 hover:text-red-600 text-[12px] border-b border-gray-50 pb-2 font-black uppercase transition-all group">
                             <span className="text-red-600 group-hover:mr-2 transition-all">»</span> {j.title}
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
              </div>
            </div>

            <aside className="shrink-0">
              <AdUnit type="sidebar" publisherId={adSettings.publisherId} visible={adSettings.isEnabled && adSettings.sideAdsEnabled} />
            </aside>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100/50 select-none">
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
         <button onClick={scrollToTop} className={`bg-red-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-900 transition-all border-4 border-white ${showScrollTop ? 'scale-100' : 'scale-0'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"/></svg>
         </button>
      </div>

      {/* Top Header Information */}
      <div className="bg-blue-950 text-white text-[10px] font-black py-1.5 px-4 flex justify-between items-center z-[100] border-b border-blue-900">
         <div className="flex gap-5">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-400"></span> NETWORK LIVE</span>
            <span className="hidden md:inline text-blue-400 tracking-tighter">OFFICIAL SARKARI PORTAL AGGREGATOR AI 3.0</span>
         </div>
         <div className="flex gap-4 items-center">
            <span className="text-yellow-400 bg-blue-900 px-2 py-0.5 rounded">{currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
            <span className="font-mono text-white opacity-90">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
         </div>
      </div>
      
      {/* Brand Header */}
      <header className="bg-white shadow-2xl sticky top-0 z-50 border-b-[6px] border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => {setView('home'); scrollToTop();}}>
            <div className="bg-red-600 p-4 rounded-2xl shadow-xl transform group-hover:scale-105 transition duration-500 relative">
                <span className="text-white text-5xl font-black italic leading-none drop-shadow-md">S</span>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-red-600 tracking-tighter leading-none italic uppercase">SARKARI PORTAL</h1>
              <p className="text-[11px] font-black text-blue-900 tracking-[0.4em] uppercase mt-1 opacity-70">India's Smartest Education Hub</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl w-full">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Find Result, Admit Card, New Jobs..." 
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-3xl focus:border-red-600 focus:outline-none transition-all shadow-inner bg-gray-50 focus:bg-white text-sm font-black" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <svg className="w-6 h-6 absolute left-4 top-4 text-gray-300 group-focus-within:text-red-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView('admin')} className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg">Admin</button>
          </div>
        </div>
        
        {/* Navigation Bar */}
        <nav className="bg-blue-950 text-white overflow-x-auto no-scrollbar shadow-inner border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 flex whitespace-nowrap">
            <button onClick={() => {setView('home'); scrollToTop();}} className={`px-8 py-5 font-black text-[12px] hover:bg-red-600 transition-all border-r border-white/5 uppercase tracking-tighter ${view === 'home' ? 'bg-red-600' : ''}`}>HOME</button>
            {[Category.LATEST_JOB, Category.RESULT, Category.ADMIT_CARD, Category.ANSWER_KEY, Category.SYLLABUS, Category.ADMISSION].map(item => (
              <button key={item} onClick={() => handleCategoryClick(item)} className="px-8 py-5 font-black text-[12px] hover:bg-red-600 transition-all border-r border-white/5 last:border-0 uppercase tracking-tighter">{item}</button>
            ))}
          </div>
        </nav>
      </header>

      {view === 'home' && <JobTicker jobs={jobs} />}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 relative min-h-[70vh] pb-24">
        {renderContent()}
      </main>

      {/* Footer Design */}
      <footer className="bg-blue-950 text-white py-24 border-t-[12px] border-red-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          <div className="space-y-6">
            <h4 className="text-5xl font-black text-red-600 italic tracking-tighter">SARKARI PORTAL</h4>
            <p className="text-blue-200 text-sm font-bold leading-relaxed max-w-sm">We provide standard alerts and information about government sector jobs. Our automated AI system brings the fastest updates on your screen.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
               <h5 className="font-black text-white uppercase text-base border-b-2 border-red-600 inline-block pb-1">Quick Tabs</h5>
               <ul className="text-xs text-blue-400 font-black space-y-4 uppercase tracking-widest">
                 <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer">Live Results</li>
                 <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer">Admit Cards</li>
                 <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer">New Jobs</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h5 className="font-black text-white uppercase text-base border-b-2 border-red-600 inline-block pb-1">Support</h5>
               <ul className="text-xs text-blue-400 font-black space-y-4 uppercase tracking-widest">
                 <li onClick={() => setView('about')} className="hover:text-yellow-400 cursor-pointer">About Us</li>
                 <li onClick={() => setView('contact')} className="hover:text-yellow-400 cursor-pointer">Contact</li>
               </ul>
            </div>
          </div>
          <div className="bg-blue-900/50 p-10 rounded-[40px] border border-white/10 space-y-4 shadow-2xl">
             <h5 className="font-black uppercase text-base text-yellow-400 tracking-tighter">Smart Disclaimer</h5>
             <p className="text-[10px] text-blue-100 leading-relaxed font-bold">This is an automated portal. Information is gathered from public domains. Please verify every detail with official government gazettes before applying. We do not provide jobs directly.</p>
          </div>
        </div>
        <div className="text-center mt-20 pt-8 border-t border-blue-900 text-[11px] text-blue-600 uppercase font-black tracking-[0.6em]">
          Copyright © 2024 - INDIA'S NO.1 JOB PORTAL - AI POWERED
        </div>
      </footer>
    </div>
  );
};

export default App;

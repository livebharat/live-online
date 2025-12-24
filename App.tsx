
import React, { useState, useEffect } from 'react';
import { getJobs, getAdSettings } from './db';
import { JobEntry, Category, AdSettings, View, IndianState } from './types';
import JobTicker from './components/JobTicker';
import JobGrid from './components/JobGrid';
import AdminPanel from './components/AdminPanel';
import AdUnit from './components/AdUnit';
import JobDetail from './components/JobDetail';

// Defined stateTabs constant to fix ReferenceError on line 137
const stateTabs: (IndianState | 'All')[] = ['All', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'MP', 'Haryana', 'Others'];

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

  const jobsToday = jobs.filter(j => j.postedDate === new Date().toISOString().split('T')[0]).length;

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setView('category_view');
    scrollToTop();
  };

  const renderContent = () => {
    if (view === 'category_view' && selectedCategory) {
      const catJobs = jobs.filter(j => j.category === selectedCategory);
      return (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-[12px] border-red-600">
            <h2 className="text-3xl font-black text-blue-900 uppercase italic flex items-center gap-4">
               <div className="bg-red-600 text-white p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
               </div>
               {selectedCategory} Section
            </h2>
            <p className="text-gray-500 font-bold text-sm mt-3 uppercase tracking-[0.2em]">Browsing {catJobs.length} active updates</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
             <table className="w-full text-left">
                <thead className="bg-blue-900 text-white uppercase text-xs font-black">
                  <tr>
                    <th className="p-5">Update Details</th>
                    <th className="p-5 hidden md:table-cell">Posting Date</th>
                    <th className="p-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {catJobs.length > 0 ? catJobs.map(job => (
                    <tr key={job.id} className="hover:bg-red-50/50 transition-colors group">
                      <td className="p-5">
                        <p className="font-black text-blue-900 uppercase text-base leading-tight group-hover:text-red-600 transition-colors">{job.title}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase mt-1.5 flex items-center gap-2">
                           <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{job.department}</span>
                           <span className="text-gray-300">|</span>
                           <span>{job.state || 'All India'}</span>
                        </p>
                      </td>
                      <td className="p-5 hidden md:table-cell">
                        <span className="font-mono text-gray-400 text-sm">{job.postedDate}</span>
                      </td>
                      <td className="p-5 text-center">
                        <button onClick={() => setSelectedJob(job)} className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase hover:bg-blue-900 transition-all shadow-md active:scale-95">Open Info</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="p-32 text-center font-black text-gray-200 uppercase text-2xl tracking-tighter">No Recent Content</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'admin': return <AdminPanel onUpdate={refreshData} />;
      case 'about': return <div className="p-12 bg-white shadow-2xl rounded-[40px] border-t-8 border-indigo-600 max-w-4xl mx-auto"><h2 className="text-4xl font-black mb-8 uppercase text-indigo-950 italic">Who We Are</h2><div className="space-y-4 text-gray-600 font-medium text-lg"><p>Sarkari Portal AI is a technology-driven aggregator designed to eliminate the lag between government notifications and student awareness.</p><p>We use Gemini AI models to parse PDF notifications and extract critical data like fees, age limits, and important dates automatically.</p></div></div>;
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="shrink-0">
              <AdUnit type="sidebar" publisherId={adSettings.publisherId} visible={adSettings.isEnabled && adSettings.sideAdsEnabled} />
            </aside>

            <div className="flex-1 space-y-10">
              {/* Trending "Flash" Grid */}
              <div className="bg-yellow-400 p-1 rounded-2xl shadow-xl">
                 <div className="bg-white rounded-xl p-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {jobs.filter(j => j.isUrgent).slice(0, 6).map(job => (
                      <button key={job.id} onClick={() => setSelectedJob(job)} className="group relative bg-red-50 border-2 border-red-600 p-3 rounded-lg text-center hover:bg-red-600 transition-all">
                        <span className="absolute -top-2 -left-2 bg-yellow-400 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-red-600 animate-bounce">FLASH</span>
                        <p className="text-blue-900 font-black text-[10px] uppercase leading-tight group-hover:text-white transition-colors">{job.title}</p>
                      </button>
                    ))}
                    {Array.from({ length: Math.max(0, 6 - jobs.filter(j => j.isUrgent).length) }).map((_, i) => (
                      <div key={i} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg h-[60px] flex items-center justify-center">
                        <span className="text-[8px] font-black text-gray-300 uppercase">Upcoming Slot</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Enhanced State Navigation */}
              <div className="relative group">
                <div className="bg-blue-900 p-3 rounded-2xl flex gap-2 overflow-x-auto no-scrollbar shadow-2xl">
                   {stateTabs.map(tab => (
                     <button 
                      key={tab} 
                      onClick={() => setActiveStateTab(tab)}
                      className={`px-6 py-3 rounded-xl text-[12px] font-black uppercase transition-all whitespace-nowrap border-b-4 ${activeStateTab === tab ? 'bg-white text-blue-900 border-yellow-500 shadow-lg -translate-y-1' : 'text-blue-200 border-blue-950 hover:text-white'}`}
                     >
                       {tab} {tab !== 'All' ? 'Jobs' : ''}
                     </button>
                   ))}
                </div>
              </div>

              <JobGrid jobs={filteredJobs} onJobClick={(job) => setSelectedJob(job)} onCategoryViewAll={handleCategoryClick} />

              <AdUnit type="rectangle" publisherId={adSettings.publisherId} visible={adSettings.isEnabled && adSettings.inlineAdsEnabled} />

              {/* Sectional Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Syllabus', cat: Category.SYLLABUS, color: 'border-green-600', head: 'bg-green-600' },
                    { title: 'Admission', cat: Category.ADMISSION, color: 'border-orange-500', head: 'bg-orange-500' },
                    { title: 'Results Archive', cat: Category.RESULT, color: 'border-purple-600', head: 'bg-purple-600' }
                  ].map(({ title, cat, color, head }) => (
                    <section key={cat} className={`bg-white border-2 ${color} rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[400px]`}>
                      <div className={`${head} text-white p-4 font-black text-center uppercase tracking-widest text-xs flex justify-between items-center shadow-inner`}>
                        {title}
                        <button onClick={() => handleCategoryClick(cat)} className="bg-black/20 px-2 py-0.5 rounded hover:bg-black/40 text-[9px]">VIEW ALL</button>
                      </div>
                      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar bg-gray-50/30">
                        {jobs.filter(j => j.category === cat).slice(0, 10).map(j => (
                          <button key={j.id} onClick={() => setSelectedJob(j)} className="block w-full text-left text-blue-900 hover:text-red-600 text-[13px] border-b border-gray-100 pb-2.5 font-black uppercase transition-all group">
                             <span className="text-gray-300 group-hover:text-red-600 transition-colors mr-1">●</span> {j.title}
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
    <div className="min-h-screen flex flex-col font-sans bg-[#f4f7f6] select-none text-gray-800">
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}

      {/* Top Utilities Bar */}
      <div className="bg-blue-950 text-white text-[10px] font-black py-2 px-6 flex justify-between items-center z-[100] border-b border-white/5">
         <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span> 
               SYSTEM: OPERATIONAL
            </span>
            <span className="hidden lg:inline text-blue-300 opacity-60 uppercase tracking-widest">Sarkari Portal AI v3.1 | Automated Indexing</span>
         </div>
         <div className="flex gap-6 items-center">
            <div className="flex gap-2">
               <span className="bg-blue-900 px-3 py-0.5 rounded-full text-blue-200">Total: {jobs.length}</span>
               <span className="bg-red-600 px-3 py-0.5 rounded-full text-white">Today: {jobsToday}</span>
            </div>
            <span className="font-mono text-yellow-400">{currentTime.toLocaleTimeString('en-IN')}</span>
         </div>
      </div>
      
      {/* Main Header */}
      <header className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50 border-b-8 border-red-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={() => {setView('home'); scrollToTop();}}>
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-5 rounded-3xl shadow-2xl transform group-hover:rotate-6 transition duration-500 relative overflow-hidden">
                <span className="text-white text-5xl font-black italic drop-shadow-2xl">S</span>
                <div className="absolute top-0 right-0 w-full h-full bg-white/10 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-red-600 tracking-tighter leading-none italic uppercase">SARKARI PORTAL</h1>
              <p className="text-[12px] font-black text-blue-900 tracking-[0.4em] uppercase mt-1.5 opacity-80">India's Leading AI Job Engine</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Ex: SSC GD, Army, UP Result, CTET..." 
                className="w-full pl-14 pr-6 py-4.5 border-2 border-gray-100 rounded-[2rem] focus:border-blue-900 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-inner bg-gray-50 focus:bg-white text-base font-black placeholder:text-gray-300" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <svg className="w-7 h-7 absolute left-5 top-4.5 text-gray-300 group-focus-within:text-blue-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setView('admin')} className="bg-blue-900 text-white px-10 py-4.5 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95 border-b-4 border-blue-950">
              Admin Log
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="bg-blue-900 text-white overflow-x-auto no-scrollbar border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex whitespace-nowrap">
            <button onClick={() => {setView('home'); scrollToTop();}} className={`px-10 py-5 font-black text-[13px] hover:bg-red-600 transition-all border-r border-white/5 uppercase tracking-tighter ${view === 'home' ? 'bg-red-600' : ''}`}>DASHBOARD</button>
            {[Category.LATEST_JOB, Category.RESULT, Category.ADMIT_CARD, Category.ANSWER_KEY, Category.SYLLABUS, Category.ADMISSION].map(item => (
              <button key={item} onClick={() => handleCategoryClick(item)} className="px-10 py-5 font-black text-[13px] hover:bg-red-600 transition-all border-r border-white/5 last:border-0 uppercase tracking-tighter">{item}</button>
            ))}
          </div>
        </nav>
      </header>

      {view === 'home' && <JobTicker jobs={jobs} />}

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 relative min-h-[80vh] pb-32">
        {renderContent()}
      </main>

      <footer className="bg-blue-950 text-white py-32 border-t-[16px] border-red-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <h4 className="text-6xl font-black text-red-600 italic tracking-tighter drop-shadow-xl">SARKARI PORTAL</h4>
            <p className="text-blue-200 text-lg font-bold leading-relaxed max-w-lg opacity-80">Leveraging Artificial Intelligence to automate the delivery of government notification updates. Millions of students trust us for speed, accuracy, and ease of use.</p>
            <div className="flex gap-4">
               {['FB', 'TW', 'YT', 'IG'].map(s => (
                 <div key={s} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xs hover:bg-red-600 transition-colors cursor-pointer border border-white/10">{s}</div>
               ))}
            </div>
          </div>
          <div className="space-y-8">
             <h5 className="font-black text-white uppercase text-xl border-l-8 border-red-600 pl-4">Portal Map</h5>
             <ul className="text-sm text-blue-400 font-black space-y-5 uppercase tracking-widest">
               <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer transition">Real-time Results</li>
               <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer transition">E-Admit Cards</li>
               <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer transition">New Vacancies</li>
               <li onClick={() => setView('home')} className="hover:text-yellow-400 cursor-pointer transition">Answer Keys</li>
             </ul>
          </div>
          <div className="space-y-8">
             <h5 className="font-black text-white uppercase text-xl border-l-8 border-red-600 pl-4">Support Hub</h5>
             <ul className="text-sm text-blue-400 font-black space-y-5 uppercase tracking-widest">
               <li onClick={() => setView('about')} className="hover:text-yellow-400 cursor-pointer transition">Company Info</li>
               <li onClick={() => setView('contact')} className="hover:text-yellow-400 cursor-pointer transition">Contact Desk</li>
               <li className="hover:text-yellow-400 cursor-pointer transition">Privacy Policy</li>
               <li className="hover:text-yellow-400 cursor-pointer transition">Disclaimer</li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 px-6">
           <div className="bg-red-900/20 p-10 rounded-[3rem] border border-red-900/50">
              <h6 className="text-yellow-400 font-black mb-3 uppercase tracking-widest">AI Safety Notice</h6>
              <p className="text-xs text-blue-100/60 leading-relaxed font-bold">This portal is an independent aggregator. While our AI models (Gemini Flash) strive for perfect data extraction, we strongly advise all users to verify details against official PDF notifications and government websites. We are not a government agency.</p>
           </div>
        </div>
        <div className="text-center mt-20 pt-10 border-t border-white/5 text-[12px] text-blue-700 uppercase font-black tracking-[0.8em]">
          Copyright © 2024-25 - WWW.SARKARIPORTALAI.COM - THE AI ADVANTAGE
        </div>
      </footer>
      
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-10 right-10 bg-red-600 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:bg-blue-900 transition-all z-[100] border-4 border-white animate-pulse">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"/></svg>
        </button>
      )}
    </div>
  );
};

export default App;

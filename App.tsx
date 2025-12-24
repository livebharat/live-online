
import React, { useState, useEffect } from 'react';
import { getJobs, getAdSettings } from './db';
import { JobEntry, Category, AdSettings, View, IndianState } from './types';
import JobTicker from './components/JobTicker';
import JobGrid from './components/JobGrid';
import AdminPanel from './components/AdminPanel';
import AdUnit from './components/AdUnit';
import JobDetail from './components/JobDetail';

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
          <div className="bg-white p-6 rounded-lg shadow-xl border-t-[10px] border-red-600">
            <h2 className="text-3xl font-black text-blue-900 uppercase italic">{selectedCategory} Section</h2>
            <p className="text-gray-400 font-bold text-xs mt-2 uppercase tracking-widest">Displaying latest {selectedCategory} notifications</p>
          </div>
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-blue-900 text-white uppercase text-xs font-black">
                  <tr>
                    <th className="p-5">Post Description</th>
                    <th className="p-5 hidden md:table-cell">Posting Date</th>
                    <th className="p-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {catJobs.length > 0 ? catJobs.map(job => (
                    <tr key={job.id} className="hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => setSelectedJob(job)}>
                      <td className="p-5">
                        <p className="font-black text-blue-800 uppercase text-sm group-hover:text-red-600">{job.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{job.department}</p>
                      </td>
                      <td className="p-5 hidden md:table-cell">
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded font-black">{job.postedDate}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-md">Open</span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="p-20 text-center font-black text-gray-300 uppercase">No updates available in this section</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'admin': return <AdminPanel onUpdate={refreshData} />;
      default:
        return (
          <div className="space-y-8">
            {/* Iconic 8-Box Header (The real Sarkari Result look) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2">
               {[
                 { name: 'UP Police Cons.', color: 'bg-[#FF5722]' },
                 { name: 'SSC GD 2024', color: 'bg-[#2196F3]' },
                 { name: 'RPF Constable', color: 'bg-[#4CAF50]' },
                 { name: 'CTET Jan 2024', color: 'bg-[#9C27B0]' },
                 { name: 'Army Agniveer', color: 'bg-[#3F51B5]' },
                 { name: 'BPSC 70th Pre', color: 'bg-[#E91E63]' },
                 { name: 'Railway ALP', color: 'bg-[#009688]' },
                 { name: 'UPSC CSE 2024', color: 'bg-[#795548]' }
               ].map((box, i) => (
                 <button key={i} className={`${box.color} text-white font-black text-[11px] md:text-[13px] py-6 rounded-lg shadow-lg hover:scale-[1.02] transition-transform uppercase border-b-4 border-black/20 italic tracking-tighter`}>
                   {box.name}
                 </button>
               ))}
            </div>

            {/* Quick State Navigation */}
            <div className="bg-white p-2 rounded-xl shadow-md border-2 border-blue-900 flex gap-1 overflow-x-auto no-scrollbar">
               {stateTabs.map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveStateTab(tab)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeStateTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-blue-900 hover:bg-gray-100'}`}
                 >
                   {tab} Jobs
                 </button>
               ))}
            </div>

            {/* Featured Selection Box */}
            <div className="bg-white border-2 border-red-600 rounded-xl overflow-hidden shadow-xl">
               <div className="bg-red-600 text-white p-2 text-center font-black uppercase text-xs tracking-widest italic animate-pulse">
                  Hot New Vacancies / Results / Admit Cards
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x border-b">
                  {jobs.filter(j => j.isUrgent).slice(0, 6).map(job => (
                    <button key={job.id} onClick={() => setSelectedJob(job)} className="p-4 hover:bg-blue-50 transition group flex items-center justify-between">
                       <p className="text-blue-900 font-black text-[12px] uppercase group-hover:text-red-600 truncate">{job.title}</p>
                       <span className="text-red-600 text-[10px] font-black">»</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Main 3-Column Table Grid */}
            <JobGrid jobs={filteredJobs} onJobClick={setSelectedJob} onCategoryViewAll={handleCategoryClick} />

            {/* Lower Info Grid (Syllabus, etc.) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { cat: Category.SYLLABUS, head: 'bg-[#333]', border: 'border-gray-800' },
                 { cat: Category.ADMISSION, head: 'bg-[#FF9800]', border: 'border-orange-600' },
                 { cat: Category.ANSWER_KEY, head: 'bg-[#8BC34A]', border: 'border-green-600' }
               ].map(item => (
                 <div key={item.cat} className={`bg-white border-2 ${item.border} rounded-lg shadow-lg flex flex-col min-h-[400px]`}>
                    <div className={`${item.head} text-white p-3 text-center font-black uppercase text-xs flex justify-between px-5 items-center`}>
                       {item.cat}
                       <button onClick={() => handleCategoryClick(item.cat)} className="text-[8px] border border-white/30 px-2 py-0.5 rounded hover:bg-white/10 transition">ALL</button>
                    </div>
                    <div className="p-3 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                      {jobs.filter(j => j.category === item.cat).slice(0, 10).map(job => (
                        <button key={job.id} onClick={() => setSelectedJob(job)} className="block w-full text-left text-blue-800 hover:text-red-600 text-[12px] font-black border-b border-gray-50 pb-2 truncate">
                           <span className="text-red-600 font-bold mr-1">●</span> {job.title}
                        </button>
                      ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans select-none">
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}

      {/* Top Professional Ticker */}
      <JobTicker jobs={jobs} />

      {/* Header with Logo and Search */}
      <header className="bg-white shadow-lg border-b-[6px] border-blue-900 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => {setView('home'); scrollToTop();}}>
             <div className="bg-red-600 text-white text-5xl font-black italic p-4 rounded-2xl shadow-2xl transform group-hover:rotate-3 transition duration-300">S</div>
             <div>
               <h1 className="text-4xl font-black text-red-600 italic tracking-tighter leading-none uppercase">SARKARI PORTAL</h1>
               <p className="text-[11px] font-black text-blue-900 uppercase tracking-[0.3em] mt-1 opacity-70">India's Smartest Job Engine</p>
             </div>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find Result, Admit Card, Latest Jobs..." 
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-red-600 focus:outline-none transition-all shadow-inner bg-gray-50 font-black text-sm" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <svg className="w-6 h-6 absolute left-4 top-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView(view === 'admin' ? 'home' : 'admin')} className="bg-blue-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-red-600 transition border-b-4 border-black/20">
              Admin Access
            </button>
          </div>
        </div>

        {/* Professional Navigation Bar */}
        <nav className="bg-blue-950 text-white border-t border-white/5 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex whitespace-nowrap">
            <button onClick={() => {setView('home'); scrollToTop();}} className={`px-10 py-5 font-black text-[12px] hover:bg-red-600 transition-all uppercase border-r border-white/5 ${view === 'home' ? 'bg-red-600' : ''}`}>Dashboard</button>
            {[Category.LATEST_JOB, Category.RESULT, Category.ADMIT_CARD, Category.ANSWER_KEY, Category.SYLLABUS, Category.ADMISSION].map(cat => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} className="px-10 py-5 font-black text-[12px] hover:bg-red-600 transition-all uppercase border-r border-white/5">{cat}</button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-1 pb-24">
        {renderContent()}
      </main>

      {/* Footer Design */}
      <footer className="bg-blue-950 text-white py-20 border-t-[14px] border-red-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="space-y-6">
              <h4 className="text-4xl font-black italic text-red-600 tracking-tighter uppercase">SARKARI PORTAL AI</h4>
              <p className="text-blue-100 font-bold text-sm leading-relaxed opacity-60">Leveraging AI to bring the fastest government job notifications to every student in India. Fast, Accurate, and Independent.</p>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <h5 className="font-black text-white uppercase text-base mb-6 border-b-2 border-red-600 inline-block pb-1">Quick Tabs</h5>
                 <ul className="text-blue-400 font-black text-xs space-y-4 uppercase tracking-widest">
                    <li className="hover:text-yellow-400 cursor-pointer transition">Home</li>
                    <li className="hover:text-yellow-400 cursor-pointer transition">About Us</li>
                    <li className="hover:text-yellow-400 cursor-pointer transition">Contact</li>
                 </ul>
              </div>
              <div>
                 <h5 className="font-black text-white uppercase text-base mb-6 border-b-2 border-red-600 inline-block pb-1">Policies</h5>
                 <ul className="text-blue-400 font-black text-xs space-y-4 uppercase tracking-widest">
                    <li className="hover:text-yellow-400 cursor-pointer transition">Privacy</li>
                    <li className="hover:text-yellow-400 cursor-pointer transition">Disclaimer</li>
                 </ul>
              </div>
           </div>
           <div className="bg-blue-900/50 p-8 rounded-3xl border border-white/10 text-center">
              <p className="text-[10px] text-blue-200 font-bold leading-relaxed uppercase opacity-50 mb-4">Official Verification Mandatory</p>
              <p className="text-[11px] font-black text-white italic">Verify details on official govt websites before applying. We are an aggregator, not a recruitment agency.</p>
           </div>
        </div>
        <div className="text-center mt-16 pt-10 border-t border-white/5 text-[11px] text-blue-700 font-black uppercase tracking-[0.8em]">
          Copyright © 2024 - WWW.SARKARIPORTALAI.COM
        </div>
      </footer>
      
      {/* Floating Scroll Top */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-red-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-900 transition-all z-[150] border-4 border-white animate-bounce">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"/></svg>
        </button>
      )}
    </div>
  );
};

export default App;

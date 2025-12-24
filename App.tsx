
import React, { useState, useEffect } from 'react';
import { getJobs, getAdSettings } from './db';
import { JobEntry, Category, AdSettings, View, IndianState, Qualification } from './types';
import JobTicker from './components/JobTicker';
import JobGrid from './components/JobGrid';
import AdminPanel from './components/AdminPanel';
import AdUnit from './components/AdUnit';
import JobDetail from './components/JobDetail';

const stateTabs: (IndianState | 'All')[] = ['All', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'MP', 'Haryana', 'Others'];
const qualList: Qualification[] = ['10th Pass', '12th Pass', 'ITI/Diploma', 'Graduate', 'Post Graduate'];

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>(getAdSettings());
  const [view, setView] = useState<'home' | 'admin' | 'category_view'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeStateTab, setActiveStateTab] = useState<IndianState | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobEntry | null>(null);

  const refreshData = () => {
    setJobs(getJobs());
    setAdSettings(getAdSettings());
  };

  useEffect(() => {
    refreshData();
    const handleScroll = () => {
      const btn = document.getElementById('scrollTop');
      if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                          j.department.toLowerCase().includes(search.toLowerCase());
    const matchesState = activeStateTab === 'All' || j.state === activeStateTab;
    return matchesSearch && matchesState;
  });

  const renderHome = () => (
    <div className="space-y-6">
      {/* 8 Iconic Colored Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
         {[
           { n: 'SSC GD 2024', c: 'bg-[#FF5722]' },
           { n: 'UP Police Result', c: 'bg-[#2196F3]' },
           { n: 'RPF Admit Card', c: 'bg-[#4CAF50]' },
           { n: 'UPSC CSE Pre', c: 'bg-[#9C27B0]' },
           { n: 'Railway ALP', c: 'bg-[#009688]' },
           { n: 'CTET Jan 2025', c: 'bg-[#E91E63]' },
           { n: 'Navy Agniveer', c: 'bg-[#3F51B5]' },
           { n: 'Army Bharti', c: 'bg-[#795548]' }
         ].map((box, i) => (
           <button key={i} className={`${box.c} text-white font-black text-[12px] md:text-[14px] py-6 px-2 rounded shadow-lg uppercase hover:scale-[1.03] transition-transform border-b-4 border-black/20 italic`}>
             {box.n}
           </button>
         ))}
      </div>

      {/* Breaking Ticker Section */}
      <div className="bg-white border-2 border-red-600 rounded overflow-hidden">
         <div className="bg-red-600 text-white p-1 text-center font-black uppercase text-[10px] animate-pulse">Important Breaking Updates</div>
         <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 divide-y md:divide-y-0 md:divide-x">
            {jobs.filter(j => j.isUrgent).slice(0, 6).map(job => (
              <button key={job.id} onClick={() => setSelectedJob(job)} className="text-blue-800 font-black text-[11px] uppercase hover:text-red-600 text-left px-2 truncate">
                <span className="text-red-600 mr-1">»</span> {job.title}
              </button>
            ))}
         </div>
      </div>

      {/* Main Table Grid */}
      <JobGrid jobs={filteredJobs} onJobClick={setSelectedJob} onCategoryViewAll={(cat) => { setSelectedCategory(cat); setView('category_view'); scrollToTop(); }} />

      {/* Jobs by Qualification */}
      <div className="bg-white border-2 border-blue-900 rounded-lg shadow-xl overflow-hidden">
         <div className="bg-blue-900 text-white p-3 font-black uppercase text-center text-sm tracking-widest">Jobs by Qualification (10th/12th/Graduate)</div>
         <div className="grid grid-cols-2 md:grid-cols-5 p-4 gap-4">
            {qualList.map(q => (
              <div key={q} className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                 <h4 className="text-[10px] font-black uppercase text-red-600 mb-2">{q}</h4>
                 <div className="space-y-1">
                   {jobs.filter(j => j.qualification === q).slice(0, 3).map(job => (
                     <button key={job.id} onClick={() => setSelectedJob(job)} className="block text-[9px] font-bold text-blue-800 hover:underline truncate w-full">{job.title}</button>
                   ))}
                   {jobs.filter(j => j.qualification === q).length === 0 && <span className="text-[8px] text-gray-300">Wait for updates</span>}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Extra Sections (Syllabus, etc) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[Category.SYLLABUS, Category.ANSWER_KEY, Category.ADMISSION].map(cat => (
           <div key={cat} className="bg-white border-2 border-gray-300 rounded overflow-hidden shadow-md min-h-[400px]">
              <div className="bg-gray-700 text-white p-2 text-center font-black uppercase text-xs">{cat}</div>
              <div className="p-2 space-y-2">
                 {jobs.filter(j => j.category === cat).slice(0, 10).map(j => (
                   <button key={j.id} onClick={() => setSelectedJob(j)} className="block w-full text-left text-blue-800 hover:text-red-600 text-[11px] font-bold border-b border-gray-50 pb-1.5 truncate">
                      <span className="text-red-600 font-bold mr-1">●</span> {j.title}
                   </button>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex flex-col font-sans select-none text-[#212121]">
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}

      <JobTicker jobs={jobs} />

      {/* Branding Header */}
      <header className="bg-white border-b-8 border-[#000080] shadow-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('home'); scrollToTop(); }}>
             <div className="bg-[#ff0000] text-white text-5xl font-black italic p-3 rounded leading-none shadow-lg">S</div>
             <div>
               <h1 className="text-4xl font-black text-[#ff0000] italic tracking-tighter leading-none uppercase">SARKARI PORTAL</h1>
               <p className="text-[10px] font-black text-[#000080] uppercase tracking-widest mt-1">WWW.SARKARIPORTALAI.COM</p>
             </div>
          </div>

          <div className="flex-1 max-w-lg w-full">
            <input 
              type="text" 
              placeholder="SSC GD, RPF, UP Result, ITI..." 
              className="w-full px-5 py-3 border-2 border-[#000080] rounded focus:outline-none font-bold text-sm bg-gray-50 shadow-inner" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView(view === 'admin' ? 'home' : 'admin')} className="bg-[#000080] text-white px-6 py-3 rounded font-black text-xs uppercase shadow-xl hover:bg-[#ff0000] transition">
               {view === 'admin' ? 'Public View' : 'Admin Panel'}
            </button>
          </div>
        </div>

        <nav className="bg-[#000080] text-white overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex whitespace-nowrap">
            <button onClick={() => { setView('home'); scrollToTop(); }} className={`px-8 py-4 font-black text-[11px] uppercase border-r border-white/5 hover:bg-red-600 ${view === 'home' ? 'bg-red-600' : ''}`}>HOME</button>
            {[Category.LATEST_JOB, Category.RESULT, Category.ADMIT_CARD, Category.ANSWER_KEY, Category.SYLLABUS, Category.ADMISSION].map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setView('category_view'); scrollToTop(); }} className="px-8 py-4 font-black text-[11px] uppercase border-r border-white/5 hover:bg-red-600">{cat}</button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto w-full p-4 flex-1">
        {view === 'admin' ? <AdminPanel onUpdate={refreshData} /> : renderHome()}
      </main>

      {/* Footer */}
      <footer className="bg-[#000080] text-white py-16 border-t-8 border-[#ff0000]">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
           <h2 className="text-4xl font-black italic text-[#ff0000] tracking-tighter">SARKARI PORTAL AI</h2>
           <p className="text-[12px] font-bold opacity-60 max-w-2xl mx-auto leading-relaxed uppercase">The fastest automated job portal in India. Powered by Gemini AI for instant result and admit card notifications.</p>
           <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="hover:text-red-500 cursor-pointer">About Us</span>
              <span className="hover:text-red-500 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-red-500 cursor-pointer">Contact Us</span>
              <span className="hover:text-red-500 cursor-pointer">Disclaimer</span>
           </div>
           <p className="text-[10px] text-gray-500 font-black">COPYRIGHT © 2024 WWW.SARKARIPORTALAI.COM - ALL RIGHTS RESERVED</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-10 right-5 flex flex-col gap-3 z-[100]">
         <button onClick={scrollToTop} id="scrollTop" className="bg-red-600 text-white p-3 rounded-full shadow-2xl hidden"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg></button>
         <a href="#" className="bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>
      </div>
    </div>
  );
};

export default App;

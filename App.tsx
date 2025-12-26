
import React, { useState, useEffect } from 'react';
import { getJobs, getAdSettings } from './db';
import { JobEntry, Category, AdSettings, View, IndianState, Qualification } from './types';
import JobTicker from './components/JobTicker';
import JobGrid from './components/JobGrid';
import AdminPanel from './components/AdminPanel';
import AdUnit from './components/AdUnit';
import JobDetail from './components/JobDetail';

const qualList: Qualification[] = ['10th Pass', '12th Pass', 'ITI/Diploma', 'Graduate', 'Post Graduate'];

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>(getAdSettings());
  const [view, setView] = useState<'home' | 'admin' | 'category_view'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
    return j.title.toLowerCase().includes(search.toLowerCase()) || 
           j.department.toLowerCase().includes(search.toLowerCase());
  });

  const renderHome = () => (
    <div className="space-y-6">
      <AdUnit type="leaderboard" />

      {/* Iconic Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
         {[
           { n: 'SSC GD 2025 Online', c: 'bg-[#ff5722]' },
           { n: 'UP Police Result', c: 'bg-[#2196f3]' },
           { n: 'RPF Constable Apply', c: 'bg-[#4caf50]' },
           { n: 'UPSC IAS Exam', c: 'bg-[#9c27b0]' },
           { n: 'Railway ALP Recruitment', c: 'bg-[#009688]' },
           { n: 'CTET Jan Exam Form', c: 'bg-[#e91e63]' },
           { n: 'Navy MR/SSR Bharti', c: 'bg-[#3f51b5]' },
           { n: 'Army Agniveer Rally', c: 'bg-[#795548]' }
         ].map((box, i) => (
           <button key={i} className={`${box.c} text-white font-black text-[12px] md:text-[15px] py-7 px-2 rounded-md shadow-xl uppercase hover:scale-[1.03] transition-transform border-b-4 border-black/30 italic tracking-tighter`}>
             {box.n}
           </button>
         ))}
      </div>

      {/* Breaking Updates */}
      <div className="bg-white border-2 border-[#ff0000] rounded-md overflow-hidden shadow-lg">
         <div className="bg-[#ff0000] text-white p-1 text-center font-black uppercase text-[11px] animate-pulse">Important Updates</div>
         <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 divide-y md:divide-y-0 md:divide-x border-b">
            {jobs.filter(j => j.isUrgent).slice(0, 6).map(job => (
              <button key={job.id} onClick={() => setSelectedJob(job)} className="text-[#000080] font-black text-[11px] uppercase hover:text-[#ff0000] text-left px-2 truncate leading-loose">
                <span className="text-[#ff0000] mr-1">»</span> {job.title}
              </button>
            ))}
         </div>
      </div>

      <JobGrid jobs={filteredJobs} onJobClick={setSelectedJob} onCategoryViewAll={(cat) => { setSelectedCategory(cat); setView('category_view'); scrollToTop(); }} />

      {/* Jobs by Qualification */}
      <div className="bg-white border-2 border-[#000080] rounded-lg shadow-xl overflow-hidden mt-8">
         <div className="bg-[#000080] text-white p-3 font-black uppercase text-center text-sm tracking-[0.2em] italic">Jobs by Qualification</div>
         <div className="grid grid-cols-2 md:grid-cols-5 p-4 gap-4 bg-gray-50">
            {qualList.map(q => (
              <div key={q} className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm hover:border-[#ff0000] transition-all">
                 <h4 className="text-[10px] font-black uppercase text-[#ff0000] mb-2">{q}</h4>
                 <div className="space-y-1.5">
                   {jobs.filter(j => j.qualification === q).slice(0, 3).map(job => (
                     <button key={job.id} onClick={() => setSelectedJob(job)} className="block text-[9px] font-bold text-[#000080] hover:underline truncate w-full border-b border-gray-50 pb-1">{job.title}</button>
                   ))}
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[Category.SYLLABUS, Category.ANSWER_KEY, Category.ADMISSION].map(cat => (
           <div key={cat} className="bg-white border-2 border-gray-300 rounded-md overflow-hidden shadow-md min-h-[400px]">
              <div className="bg-[#555] text-white p-2.5 text-center font-black uppercase text-xs border-b-2 border-black/10">{cat}</div>
              <div className="p-3 space-y-2.5">
                 {jobs.filter(j => j.category === cat).slice(0, 12).map(j => (
                   <button key={j.id} onClick={() => setSelectedJob(j)} className="block w-full text-left text-[#000080] hover:text-[#ff0000] text-[12px] font-black border-b border-gray-100 pb-2 truncate">
                      <span className="text-[#ff0000] font-bold mr-1.5">●</span> {j.title}
                   </button>
                 ))}
              </div>
           </div>
         ))}
      </div>
      
      <AdUnit type="rectangle" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col font-sans select-none text-[#333]">
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}

      <JobTicker jobs={jobs} />

      <header className="bg-white border-b-8 border-[#000080] shadow-2xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView('home'); scrollToTop(); }}>
             <div className="bg-[#ff0000] text-white text-6xl font-black italic p-4 rounded-lg leading-none shadow-2xl">S</div>
             <div>
               <h1 className="text-4xl md:text-5xl font-black text-[#ff0000] italic tracking-tighter leading-none uppercase">SARKARI RESULT LIVE</h1>
               <p className="text-[11px] font-black text-[#000080] uppercase tracking-[0.4em] mt-2 opacity-80">WWW.SARKARIRESULTIVE.XYZ</p>
             </div>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <input 
              type="text" 
              placeholder="Search Latest Jobs, Results, Admit Card..." 
              className="w-full px-6 py-4 border-2 border-[#000080] rounded-full focus:outline-none font-black text-sm bg-gray-50 shadow-inner" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setView(view === 'admin' ? 'home' : 'admin')} className="bg-[#000080] text-white px-10 py-4 rounded-full font-black text-xs uppercase shadow-xl hover:bg-[#ff0000] transition-all transform hover:scale-105 border-b-4 border-black/20">
               {view === 'admin' ? 'HOME PAGE' : 'ADMIN PANEL'}
            </button>
          </div>
        </div>

        <nav className="bg-[#000080] text-white overflow-x-auto no-scrollbar border-t border-white/10">
          <div className="max-w-7xl mx-auto flex whitespace-nowrap">
            <button onClick={() => { setView('home'); scrollToTop(); }} className={`px-10 py-5 font-black text-[12px] uppercase border-r border-white/5 hover:bg-[#ff0000] ${view === 'home' ? 'bg-[#ff0000]' : ''}`}>HOME</button>
            {[Category.LATEST_JOB, Category.RESULT, Category.ADMIT_CARD, Category.ANSWER_KEY, Category.SYLLABUS, Category.ADMISSION].map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setView('category_view'); scrollToTop(); }} className="px-10 py-5 font-black text-[12px] uppercase border-r border-white/5 hover:bg-[#ff0000]">{cat}</button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-1">
        {view === 'admin' ? <AdminPanel onUpdate={refreshData} /> : renderHome()}
      </main>

      <footer className="bg-[#000080] text-white py-20 border-t-[15px] border-[#ff0000]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
           <div className="space-y-6">
              <h2 className="text-5xl font-black italic text-[#ff0000] tracking-tighter uppercase">SR LIVE</h2>
              <p className="text-[13px] font-bold opacity-70 leading-relaxed uppercase">The fastest updates for Latest Jobs, Result and Admit Cards. We provide official information gathered from Government gazettes.</p>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <h5 className="font-black text-white uppercase text-sm mb-6 border-b-2 border-[#ff0000] inline-block pb-1">LINKS</h5>
                 <ul className="text-gray-400 font-black text-[11px] space-y-4 uppercase">
                    <li>Result 2024</li>
                    <li>Admit Card</li>
                    <li>Latest Job</li>
                 </ul>
              </div>
              <div>
                 <h5 className="font-black text-white uppercase text-sm mb-6 border-b-2 border-[#ff0000] inline-block pb-1">INFO</h5>
                 <ul className="text-gray-400 font-black text-[11px] space-y-4 uppercase">
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                    <li>Disclaimer</li>
                 </ul>
              </div>
           </div>
           <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center">
              <p className="text-[12px] font-black italic text-gray-200">"Verify all information on official Government websites. WWW.SARKARIRESULTIVE.XYZ is a news information portal."</p>
           </div>
        </div>
        <div className="text-center mt-20 pt-10 border-t border-white/5">
           <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.8em]">COPYRIGHT © 2024 - WWW.SARKARIRESULTIVE.XYZ</p>
        </div>
      </footer>

      <div className="fixed bottom-10 right-8 flex flex-col gap-4 z-[150]">
         <a href="#" className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
         </a>
         <button onClick={scrollToTop} id="scrollTop" className="bg-[#ff0000] text-white p-4 rounded-full shadow-2xl hidden hover:bg-[#000080]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"/></svg>
         </button>
      </div>
    </div>
  );
};

export default App;

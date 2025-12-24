
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
          <div className="bg-white p-6 rounded-lg shadow border-t-8 border-red-600">
            <h2 className="text-2xl font-black text-blue-900 uppercase">{selectedCategory} Update History</h2>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-blue-900 text-white uppercase text-xs">
                  <tr>
                    <th className="p-4">Post Name</th>
                    <th className="p-4">Posted Date</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {catJobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-blue-800 uppercase text-sm">{job.title}</td>
                      <td className="p-4 text-xs font-bold text-gray-500">{job.postedDate}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedJob(job)} className="bg-red-600 text-white px-4 py-1.5 rounded font-black text-[10px] uppercase">Details</button>
                      </td>
                    </tr>
                  ))}
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
          <div className="space-y-6">
            {/* Quick Link Buttons (Sarkari Result Style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1">
               {['SSC GD', 'UP Police', 'RPF Const.', 'CTET 2024', 'Army Rally', 'Railway', 'UPSC', 'IBPS'].map(tag => (
                 <button key={tag} className="bg-blue-900 text-white font-black text-[10px] py-3 rounded hover:bg-red-600 transition uppercase shadow-sm">{tag}</button>
               ))}
            </div>

            {/* Featured Box (Like the real site) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {jobs.filter(j => j.isUrgent).slice(0, 8).map(job => (
                 <button key={job.id} onClick={() => setSelectedJob(job)} className="bg-white border-2 border-red-600 p-3 text-center rounded hover:shadow-lg transition group">
                   <p className="text-blue-900 font-black text-[11px] uppercase group-hover:text-red-600">{job.title}</p>
                 </button>
               ))}
            </div>

            <JobGrid jobs={filteredJobs} onJobClick={setSelectedJob} onCategoryViewAll={handleCategoryClick} />

            {/* Other Sections (Syllabus, Answer Key) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[Category.SYLLABUS, Category.ADMISSION, Category.ANSWER_KEY].map(cat => (
                 <div key={cat} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-700 text-white p-2 text-center font-black text-xs uppercase">{cat}</div>
                    <div className="p-2 space-y-2">
                      {jobs.filter(j => j.category === cat).slice(0, 8).map(job => (
                        <button key={job.id} onClick={() => setSelectedJob(job)} className="block w-full text-left text-blue-800 hover:text-red-600 text-[11px] font-bold border-b border-gray-50 pb-1.5 truncate">
                           <span className="text-red-600 mr-1">»</span> {job.title}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => handleCategoryClick(cat)} className="w-full py-2 bg-gray-100 text-[9px] font-black uppercase text-gray-500 hover:bg-gray-200">View All</button>
                 </div>
               ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col font-sans text-gray-900">
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}

      {/* Ticker */}
      <div className="bg-blue-900 text-white flex overflow-hidden whitespace-nowrap py-2 border-b-2 border-yellow-400 text-xs font-black">
         <div className="bg-red-600 px-4 py-1 italic shrink-0 z-10 animate-pulse">FLASH UPDATES:</div>
         <div className="animate-marquee inline-block pl-4">
            {jobs.slice(0, 10).map(j => (
              <span key={j.id} className="mx-8 uppercase">● {j.title} ({j.category})</span>
            ))}
         </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
             <div className="bg-red-600 text-white text-5xl font-black italic p-3 rounded-lg leading-none shadow-xl">S</div>
             <div>
               <h1 className="text-4xl font-black text-red-600 italic tracking-tighter leading-none">SARKARI PORTAL</h1>
               <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mt-1">WWW.SARKARIPORTALAI.COM</p>
             </div>
          </div>

          <div className="flex-1 max-w-lg w-full">
            <input type="text" placeholder="Search Result, Admit Card, Jobs..." className="w-full px-5 py-3 border-2 border-blue-900 rounded-lg focus:outline-none font-bold text-sm bg-gray-50" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <button onClick={() => setView(view === 'admin' ? 'home' : 'admin')} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-black text-xs uppercase border-b-4 border-blue-950 hover:bg-red-600 transition">
            Admin Login
          </button>
        </div>

        <nav className="bg-blue-950 text-white overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto flex whitespace-nowrap">
            <button onClick={() => setView('home')} className="px-6 py-4 font-black text-xs uppercase hover:bg-red-600 border-r border-white/5">Home</button>
            {Object.values(Category).slice(0, 6).map(cat => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} className="px-6 py-4 font-black text-xs uppercase hover:bg-red-600 border-r border-white/5">{cat}</button>
            ))}
          </div>
        </nav>
      </header>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-1">
        {renderContent()}
      </main>

      {/* Sticky Social Icons */}
      <div className="fixed bottom-10 left-5 flex flex-col gap-3 z-50">
         <a href="#" className="bg-green-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition animate-bounce">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
         </a>
      </div>

      <footer className="bg-blue-900 text-white py-12 border-t-8 border-red-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div>
              <h4 className="text-2xl font-black italic text-red-500">SARKARI PORTAL AI</h4>
              <p className="text-xs font-bold text-gray-300 mt-2 leading-relaxed">India's Leading automated portal for all latest jobs, admit card and results information.</p>
           </div>
           <div className="text-center">
              <h5 className="font-black uppercase text-sm mb-4">Quick Links</h5>
              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold">
                 <span>Home</span><span>About Us</span><span>Contact Us</span><span>Privacy Policy</span>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-gray-400">© 2024 WWW.SARKARIPORTALAI.COM</p>
              <p className="text-[9px] text-gray-500 mt-1 uppercase italic">Powered by Gemini Flash AI</p>
           </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;

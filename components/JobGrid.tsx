
import React from 'react';
import { JobEntry, Category } from '../types';

interface JobGridProps {
  jobs: JobEntry[];
  onJobClick: (job: JobEntry) => void;
  onCategoryViewAll: (cat: Category) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ jobs, onJobClick, onCategoryViewAll }) => {
  const categoriesToDisplay = [
    { title: 'RESULTS', cat: Category.RESULT, color: 'border-red-600', headerBg: 'bg-red-600' },
    { title: 'ADMIT CARD', cat: Category.ADMIT_CARD, color: 'border-blue-700', headerBg: 'bg-blue-700' },
    { title: 'LATEST JOBS', cat: Category.LATEST_JOB, color: 'border-green-700', headerBg: 'bg-green-700' }
  ];

  const getJobsByCategory = (cat: Category) => {
    return jobs.filter(j => j.category === cat).slice(0, 18);
  };

  const isRecentlyPosted = (dateStr: string) => {
    const postedDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categoriesToDisplay.map(({ title, cat, color, headerBg }) => (
        <div key={cat} className={`bg-white border-2 ${color} rounded-2xl shadow-xl overflow-hidden flex flex-col transform hover:shadow-2xl transition-all duration-300`}>
          <div className={`${headerBg} text-white p-4 text-center font-black text-lg uppercase shadow-inner tracking-widest flex justify-between items-center px-6`}>
            <span>{title}</span>
            <button 
              onClick={() => onCategoryViewAll(cat)}
              className="bg-white/20 hover:bg-white/40 text-[9px] px-2 py-0.5 rounded transition uppercase"
            >
              All
            </button>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[600px] no-scrollbar">
            {getJobsByCategory(cat).length > 0 ? (
              getJobsByCategory(cat).map(job => (
                <div 
                  key={job.id} 
                  onClick={() => onJobClick(job)}
                  className="group p-4 hover:bg-blue-50 transition-all border-l-[6px] border-transparent hover:border-blue-600 cursor-pointer flex flex-col gap-1"
                >
                  <div className="flex items-start gap-2">
                    <p className="text-blue-900 group-hover:text-red-700 font-black text-[13px] leading-tight flex-1 uppercase tracking-tighter">
                      {job.title}
                    </p>
                    {isRecentlyPosted(job.postedDate) && (
                      <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse border border-white mt-0.5 shadow-sm uppercase shrink-0">New</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{job.department.split(' ').slice(0,2).join(' ')}</span>
                      <svg className="w-4 h-4 text-blue-200 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-300 font-black uppercase text-xs italic tracking-widest">No Updates Available</div>
            )}
          </div>
          <div className="p-3 bg-gray-50 text-center border-t-2 border-gray-100">
            <button 
              onClick={() => onCategoryViewAll(cat)}
              className="text-[11px] font-black text-red-600 hover:text-blue-700 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition"
            >
               Browse Full List
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobGrid;

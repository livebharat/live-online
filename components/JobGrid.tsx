
import React from 'react';
import { JobEntry, Category } from '../types';

interface JobGridProps {
  jobs: JobEntry[];
  onJobClick: (job: JobEntry) => void;
  onCategoryViewAll: (cat: Category) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ jobs, onJobClick, onCategoryViewAll }) => {
  const sections = [
    { title: 'RESULTS', cat: Category.RESULT, color: 'border-red-600', headBg: 'bg-red-600' },
    { title: 'ADMIT CARD', cat: Category.ADMIT_CARD, color: 'border-blue-700', headBg: 'bg-blue-700' },
    { title: 'LATEST JOBS', cat: Category.LATEST_JOB, color: 'border-green-700', headBg: 'bg-green-700' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map(sec => (
        <div key={sec.cat} className={`bg-white border-2 ${sec.color} rounded-lg shadow-md flex flex-col min-h-[500px]`}>
          <div className={`${sec.headBg} text-white text-center font-black p-2 uppercase text-sm flex justify-between px-4 items-center`}>
             <span>{sec.title}</span>
             <button onClick={() => onCategoryViewAll(sec.cat)} className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded hover:bg-white/30 transition">ALL</button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {jobs.filter(j => j.category === sec.cat).slice(0, 15).map(job => (
              <button 
                key={job.id} 
                onClick={() => onJobClick(job)}
                className="w-full text-left p-2.5 px-4 hover:bg-blue-50 transition border-l-4 border-transparent hover:border-blue-600"
              >
                <div className="flex items-start gap-2">
                  <span className="text-blue-800 font-bold text-[11px] uppercase leading-tight">{job.title}</span>
                  {new Date(job.postedDate).getTime() > Date.now() - 3*24*60*60*1000 && (
                    <span className="bg-red-600 text-white text-[7px] px-1 rounded animate-pulse shrink-0 mt-0.5">NEW</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="bg-gray-50 p-2 text-center border-t">
            <button onClick={() => onCategoryViewAll(sec.cat)} className="text-[10px] font-black text-red-600 hover:underline uppercase">View Full List »</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobGrid;

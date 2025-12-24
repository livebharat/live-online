
import React, { useState } from 'react';
import { JobEntry } from '../types';

interface JobDetailProps {
  job: JobEntry;
  onClose: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);

  const details = [
    { label: 'Post Name', value: job.title },
    { label: 'Department / Organization', value: job.department },
    { label: 'State / Region', value: job.state || 'All India' },
    { label: 'Total Vacancy', value: job.totalPosts || 'Refer Notification' },
    { label: 'Educational Qualification', value: job.eligibility || 'Check Notification' },
    { label: 'Age Limit (Maximum)', value: job.ageLimit || 'As per Rules' },
    { label: 'Application Fee', value: job.fee || 'Check Details' },
    { label: 'Important Dates', value: job.importantDates || job.lastDate },
  ];

  const handlePrint = () => window.print();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#job-${job.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Sarkari Result Update: ${job.title} at ${job.department}. Check details here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-sm overflow-hidden animate-fadeIn">
      <div className="bg-white w-full max-w-6xl max-h-[96vh] overflow-y-auto rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-t-[16px] border-red-700 print:shadow-none print:border-0 print:max-h-none print:static">
        
        {/* Detail Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50 sticky top-0 z-20 print:hidden backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="bg-red-600 text-white text-[11px] px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-wider">Flash Update</span>
            <h2 className="text-xl font-black text-blue-950 uppercase tracking-tighter truncate max-w-[150px] md:max-w-xl">{job.title}</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={copyToClipboard} className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-black text-[10px] uppercase flex items-center gap-2">
               {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button onClick={handlePrint} className="p-2.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all shadow-sm">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            </button>
            <button onClick={onClose} className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="p-8 md:p-14 space-y-12">
          {/* Header Branding */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-red-700 tracking-tighter uppercase italic">{job.department}</h1>
            <div className="inline-block px-10 py-3 bg-blue-900 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl">
              {job.title} Recruitment 2024-25
            </div>
            <div className="flex justify-center items-center gap-4 text-gray-400 font-bold uppercase text-[12px] tracking-[0.4em]">
               <div className="h-px w-10 bg-gray-200"></div>
               SarkariPortalAI.com Exclusive
               <div className="h-px w-10 bg-gray-200"></div>
            </div>
          </div>

          {/* Core Table */}
          <div className="overflow-hidden border-4 border-blue-900 rounded-[2rem] shadow-2xl bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                   <th colSpan={2} className="p-5 text-center uppercase tracking-[0.3em] font-black text-xl italic shadow-inner">Official Notification Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-blue-900/10">
                {details.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                    <td className="p-6 border-r-4 border-blue-900/5 font-black text-red-600 uppercase text-xs md:text-sm w-1/3 leading-tight tracking-tighter">{item.label}</td>
                    <td className="p-6 font-bold text-blue-950 text-base md:text-lg">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Hub */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={shareWhatsApp} className="flex items-center justify-center gap-4 bg-green-600 text-white p-6 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-xl border-b-[8px] border-green-800">
                 WhatsApp Update
              </button>
              <a href="#" className="flex items-center justify-center gap-4 bg-blue-600 text-white p-6 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl border-b-[8px] border-blue-800">
                 Telegram Alert
              </a>
            </div>
            <div className="bg-yellow-50 border-4 border-yellow-200 rounded-3xl p-6 flex flex-col justify-center text-center">
               <p className="text-yellow-800 font-black text-xs uppercase tracking-widest mb-2">Notice ID</p>
               <p className="font-mono font-black text-blue-900 text-xl">SPAI-{job.id}</p>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-200 p-8 md:p-14 rounded-[3rem] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-3xl font-black text-red-700 uppercase underline decoration-blue-900 decoration-8 underline-offset-[12px] italic">Useful Link Station</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href={job.link} target="_blank" className="bg-red-600 text-white font-black py-6 rounded-2xl hover:bg-red-700 shadow-2xl transition transform active:scale-95 text-xl tracking-tighter border-b-[10px] border-red-900 uppercase">Apply Now</a>
              <a href={job.link} target="_blank" className="bg-blue-900 text-white font-black py-6 rounded-2xl hover:bg-blue-950 shadow-2xl transition transform active:scale-95 text-xl tracking-tighter border-b-[10px] border-blue-950 uppercase">Notification</a>
              <a href={job.link} target="_blank" className="bg-green-700 text-white font-black py-6 rounded-2xl hover:bg-green-800 shadow-2xl transition transform active:scale-95 text-xl tracking-tighter border-b-[10px] border-green-900 uppercase">Web Portal</a>
            </div>
          </div>
        </div>

        <div className="bg-blue-900 text-white py-10 px-8 text-center">
          <p className="font-black text-[12px] uppercase tracking-[0.5em] opacity-60 mb-2">Official Data Aggregator</p>
          <p className="font-black text-base italic">WWW.SARKARIPORTALAI.COM</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

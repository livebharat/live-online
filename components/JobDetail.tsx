
import React from 'react';
import { JobEntry } from '../types';

interface JobDetailProps {
  job: JobEntry;
  onClose: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onClose }) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-md overflow-hidden">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border-t-[12px] border-red-700 print:shadow-none print:border-0 print:max-h-none print:static">
        
        {/* Header - Hidden on Print */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE UPDATE</span>
            <h2 className="text-lg font-black text-blue-900 uppercase tracking-tight truncate max-w-[200px] md:max-w-md">{job.title}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            </button>
            <button onClick={onClose} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          {/* Main Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-red-700 tracking-tighter uppercase">{job.department}</h1>
            <div className="inline-block px-6 py-2 bg-blue-900 text-white rounded-full font-bold text-sm uppercase tracking-widest">
              {job.title} Recruitment 2024
            </div>
            <p className="text-gray-500 font-bold uppercase text-[10px]">Short Details of Notification - SarkariPortalAI.com</p>
          </div>

          {/* Table */}
          <div className="overflow-hidden border-2 border-blue-900 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                   <th colSpan={2} className="p-3 text-center uppercase tracking-[0.2em] font-black italic">Recruitment Information Table</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}>
                    <td className="p-4 border-b border-r-2 border-blue-900/10 font-black text-red-600 uppercase text-[11px] w-1/3 leading-tight">{item.label}</td>
                    <td className="p-4 border-b border-blue-900/10 font-bold text-blue-900 text-sm md:text-base">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Social Links Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
            <a href="#" className="flex items-center justify-center gap-3 bg-green-600 text-white p-4 rounded-xl font-black hover:bg-green-700 transition shadow-lg border-b-4 border-green-800">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
               Join WhatsApp Group
            </a>
            <a href="#" className="flex items-center justify-center gap-3 bg-blue-500 text-white p-4 rounded-xl font-black hover:bg-blue-600 transition shadow-lg border-b-4 border-blue-800">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.257.257-.527.257l.189-2.91 5.305-4.79c.23-.205-.05-.318-.356-.117l-6.557 4.127-2.822-.882c-.614-.19-.626-.614.128-.908l11.03-4.25c.51-.19.957.114.81.882z"/></svg>
               Telegram Channel
            </a>
          </div>

          {/* Action Buttons */}
          <div className="bg-red-50 border-2 border-red-200 p-6 md:p-10 rounded-2xl text-center space-y-6">
            <h3 className="text-xl font-black text-red-700 uppercase underline decoration-blue-900 underline-offset-8">Important Links Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href={job.link} target="_blank" className="bg-red-600 text-white font-black py-5 rounded-lg hover:bg-red-700 shadow-xl transition transform active:scale-95 text-lg">Apply Online</a>
              <a href={job.link} target="_blank" className="bg-blue-800 text-white font-black py-5 rounded-lg hover:bg-blue-900 shadow-xl transition transform active:scale-95 text-lg">Download Notification</a>
              <a href={job.link} target="_blank" className="bg-green-700 text-white font-black py-5 rounded-lg hover:bg-green-800 shadow-xl transition transform active:scale-95 text-lg">Official Website</a>
            </div>
          </div>
        </div>

        <div className="bg-blue-900 text-white p-6 text-center font-bold text-[10px] uppercase tracking-[0.3em]">
          Copyright © 2024 SarkariPortalAI.com - All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

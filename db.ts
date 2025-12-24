
import { JobEntry, Category, AdSettings } from './types';

const DB_KEY = 'sarkari_portal_jobs';
const AD_KEY = 'sarkari_portal_ads';

const INITIAL_JOBS: JobEntry[] = [
  {
    id: '1',
    title: 'SSC CGL 2024 Tier 1 Result',
    department: 'Staff Selection Commission',
    category: Category.RESULT,
    lastDate: '-',
    link: '#',
    description: 'SSC CGL 2024 Tier 1 exam results are out now.',
    postedDate: '2024-05-15'
  },
  {
    id: '2',
    title: 'UPSC Civil Services Prelims 2024 Admit Card',
    department: 'Union Public Service Commission',
    category: Category.ADMIT_CARD,
    lastDate: '2024-06-16',
    link: '#',
    description: 'Download your UPSC IAS/IFS Prelims admit card.',
    postedDate: '2024-05-10'
  }
];

const INITIAL_ADS: AdSettings = {
  publisherId: '',
  isEnabled: false,
  topAdEnabled: true,
  sideAdsEnabled: true,
  inlineAdsEnabled: true
};

export const getJobs = (): JobEntry[] => {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }
  return JSON.parse(stored);
};

export const getAdSettings = (): AdSettings => {
  const stored = localStorage.getItem(AD_KEY);
  if (!stored) {
    localStorage.setItem(AD_KEY, JSON.stringify(INITIAL_ADS));
    return INITIAL_ADS;
  }
  return JSON.parse(stored);
};

export const saveAdSettings = (settings: AdSettings) => {
  localStorage.setItem(AD_KEY, JSON.stringify(settings));
};

export const addJob = (job: Omit<JobEntry, 'id' | 'postedDate'>): JobEntry => {
  const jobs = getJobs();
  const newJob: JobEntry = {
    ...job,
    id: Date.now().toString(),
    postedDate: new Date().toISOString().split('T')[0]
  };
  const updated = [newJob, ...jobs];
  localStorage.setItem(DB_KEY, JSON.stringify(updated));
  return newJob;
};

export const deleteJob = (id: string) => {
  const jobs = getJobs();
  const updated = jobs.filter(j => j.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(updated));
};


export enum Category {
  LATEST_JOB = 'Latest Jobs',
  ADMIT_CARD = 'Admit Card',
  RESULT = 'Result',
  ANSWER_KEY = 'Answer Key',
  SYLLABUS = 'Syllabus',
  ADMISSION = 'Admission',
  CERTIFICATE = 'Certificate Verification',
  IMPORTANT = 'Important'
}

export type Qualification = '10th Pass' | '12th Pass' | 'ITI/Diploma' | 'Graduate' | 'Post Graduate';

export type IndianState = 'Uttar Pradesh' | 'Bihar' | 'Delhi' | 'Rajasthan' | 'MP' | 'Haryana' | 'Others';

export type View = 'home' | 'admin' | 'contact' | 'privacy' | 'disclaimer' | 'about' | 'category_view';

export interface JobEntry {
  id: string;
  title: string;
  department: string;
  category: Category;
  state?: IndianState;
  qualification?: Qualification;
  lastDate: string;
  link: string;
  description: string;
  postedDate: string;
  isUrgent?: boolean;
  // AI Extracted Details
  totalPosts?: string;
  eligibility?: string;
  ageLimit?: string;
  fee?: string;
  importantDates?: string;
}

export interface AdSettings {
  publisherId: string;
  isEnabled: boolean;
  topAdEnabled: boolean;
  sideAdsEnabled: boolean;
  inlineAdsEnabled: boolean;
}

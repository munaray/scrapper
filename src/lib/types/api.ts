export enum TaskStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  PAUSED = "paused"
}

export interface TaskInfo {
  task_id: string;
  url: string;
  status: TaskStatus;
  worker_id?: number;
  started_at?: string;
  completed_at?: string;
  jobs_found: number;
  error?: string;
  progress_percent: number;
}

export interface BatchInfo {
  batch_id: string;
  total_urls: number;
  completed_urls: number;
  failed_urls: number;
  pending_urls: number;
  running_urls: number;
  status: TaskStatus;
  workers_active: number;
  started_at: string;
  estimated_completion?: string;
  total_jobs_found: number;
}

export interface ResourceInfo {
  cpu_percent: number;
  memory_percent: number;
  memory_available_gb: number;
  memory_total_gb: number;
  recommended_workers: number;
  max_workers: number;
  current_workers: number;
  is_busy: boolean;
}

export interface BatchScrapeRequest {
  urls: string[];
  max_workers?: number;
  max_records_per_file?: number;
  priority?: number;
}

export interface BatchScrapeResponse {
  success: boolean;
  message: string;
  batch_id?: string;
  batch_info?: BatchInfo;
  resource_info?: ResourceInfo;
}

export interface SingleScrapeRequest {
  url: string;
}

export interface SingleScrapeResponse {
  success: boolean;
  message: string;
  url: string;
  task_id?: string;
  jobs_found: number;
  jobs: any[];
  error?: string;
  duration_seconds: number;
}

export interface ProgressResponse {
  is_running: boolean;
  batch_info?: BatchInfo;
  tasks: TaskInfo[];
  resource_info?: ResourceInfo;
}

export interface StopRequest {
  batch_id?: string;
  force?: boolean;
}

export interface StopResponse {
  success: boolean;
  message: string;
  stopped_tasks: number;
}

export interface StatusResponse {
  is_running: boolean;
  batch_id?: string;
  total_urls?: number;
  completed_urls?: number;
  failed_urls?: number;
  pending_urls?: number;
  running_urls?: number;
  progress_percent?: number;
  workers_active?: number;
  total_jobs_found?: number;
  message?: string;
}

export interface BatchHistoryResponse {
  batches: Array<{
    batch_id: string;
    status: string;
    total_urls: number;
    completed_urls: number;
    failed_urls: number;
    total_jobs_found: number;
    created_at: string;
    completed_at?: string;
  }>;
}

export interface BatchDetailsResponse {
  batch: BatchInfo;
  tasks: TaskInfo[];
}

export interface Job {
  _id?: string;
  id?: string;
  title: string;
  company?: string;
  company_name?: string;
  url: string;
  description: string;
  location?: string | {
    address?: string;
    city?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
  city?: string;
  region?: string;
  country?: string;
  remote_option?: string;
  job_type?: string;
  contract_type?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
  application_method?: any;
  is_easy_apply?: boolean;
  posted_date?: string;
  post_date?: any;
  scraped_at?: string;
  batch_id?: string;
  source_url?: string;
  main_domain?: string;
  skills?: string[];
  requirements?: string[];
  benefits?: string[];
  ats_detected?: boolean;
  is_ats?: boolean;
  ats_system?: string;
  ats_provider?: string;
}

export interface JobsListResponse {
  success: boolean;
  total_count: number;
  jobs: Job[];
  page: number;
  page_size: number;
  total_pages: number;
}

export interface JobStatsResponse {
  total_jobs: number;
  unique_companies: number;
  unique_locations: number;
  top_locations: Array<{ location: string; count: number }>;
  top_companies: Array<{ company: string; count: number }>;
  top_skills: Array<{ skill: string; count: number }>;
}

export type SortableColumn = 'title' | 'company' | 'location' | 'posted_date' | 'salary';

export interface SortConfig {
  column: SortableColumn | null;
  direction: 'asc' | 'desc' | null;
}

export interface JobFilters {
  jobType: string;
  remoteOption: string;
  salaryMin: number | null;
  salaryMax: number | null;
  atsDetected: boolean | null;
  easyApply: boolean | null;
  contractType: string;
}

export const JOB_TYPE_OPTIONS = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'] as const;
export const REMOTE_OPTIONS = ['All', 'Remote', 'On-site', 'Hybrid'] as const;
export const CONTRACT_TYPE_OPTIONS = ['All', 'Permanent', 'Fixed-term', 'Temporary', 'Freelance'] as const;

import type { Job, JobFilters } from '@/lib/types/api';
import { getSalaryInfo } from './job-helpers';

export function applyClientFilters(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter(job => {
    // Job Type filter
    if (filters.jobType && filters.jobType !== 'All') {
      if (job.job_type !== filters.jobType) return false;
    }

    // Remote Option filter
    if (filters.remoteOption && filters.remoteOption !== 'All') {
      if (job.remote_option !== filters.remoteOption) return false;
    }

    // Salary Range filter
    if (filters.salaryMin !== null || filters.salaryMax !== null) {
      const salaryInfo = getSalaryInfo(job);
      if (!salaryInfo.min && !salaryInfo.max) return false;
      const jobSalary = salaryInfo.max || salaryInfo.min || 0;
      if (filters.salaryMin && jobSalary < filters.salaryMin) return false;
      if (filters.salaryMax && jobSalary > filters.salaryMax) return false;
    }

    // ATS Detected filter
    if (filters.atsDetected !== null) {
      const isAts = job.ats_detected || job.is_ats || false;
      if (isAts !== filters.atsDetected) return false;
    }

    // Easy Apply filter
    if (filters.easyApply !== null) {
      if (job.is_easy_apply !== filters.easyApply) return false;
    }

    // Contract Type filter
    if (filters.contractType && filters.contractType !== 'All') {
      if (job.contract_type !== filters.contractType) return false;
    }

    return true;
  });
}

export function getActiveFilterCount(filters: JobFilters): number {
  let count = 0;
  if (filters.jobType && filters.jobType !== 'All') count++;
  if (filters.remoteOption && filters.remoteOption !== 'All') count++;
  if (filters.salaryMin !== null) count++;
  if (filters.salaryMax !== null) count++;
  if (filters.atsDetected !== null) count++;
  if (filters.easyApply !== null) count++;
  if (filters.contractType && filters.contractType !== 'All') count++;
  return count;
}

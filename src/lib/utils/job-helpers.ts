import type { Job } from '@/lib/types/api';

export function getJobId(job: Job): string {
  return job.id || job._id || job.url || '';
}

export function getCompanyName(job: Job): string {
  return job.company || job.company_name || 'Unknown Company';
}

export function getLocationString(job: Job): string | null {
  if (!job.location) return null;

  if (typeof job.location === 'string') {
    return job.location;
  }

  // Extract from nested location object
  const { address, city, region, country } = job.location;

  if (address) return address;

  // Build location string from components
  const parts = [city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export function getSalaryInfo(job: Job): {
  min?: number;
  max?: number;
  currency?: string;
  period?: string;
} {
  // Check if salary is nested object (backend format)
  if (job.salary && typeof job.salary === 'object') {
    return {
      min: job.salary.min,
      max: job.salary.max,
      currency: job.salary.currency,
      period: job.salary.period,
    };
  }

  // Check if salary is flat fields (frontend format)
  return {
    min: job.salary_min,
    max: job.salary_max,
    currency: job.salary_currency,
    period: job.salary_period,
  };
}

export function getPostedDate(job: Job): string | null {
  // Check direct posted_date field
  if (job.posted_date) {
    const date = new Date(job.posted_date);
    return isNaN(date.getTime()) ? null : job.posted_date;
  }

  // Check nested post_date object
  if (job.post_date && typeof job.post_date === 'object') {
    const isoDate = job.post_date.iso_format;
    if (isoDate) {
      const date = new Date(isoDate);
      return isNaN(date.getTime()) ? null : isoDate;
    }
  }

  return null;
}

export function getScrapedAt(job: Job): string {
  if (job.scraped_at) {
    const date = new Date(job.scraped_at);
    return isNaN(date.getTime()) ? new Date().toISOString() : job.scraped_at;
  }
  return new Date().toISOString();
}

export function isAtsDetected(job: Job): boolean {
  return job.ats_detected || job.is_ats || false;
}

export function getAtsSystem(job: Job): string | undefined {
  return job.ats_system || job.ats_provider || undefined;
}

export function getApplicationMethod(job: Job): string | null {
  if (!job.application_method) return null;

  // If it's already a string, return it
  if (typeof job.application_method === 'string') {
    return job.application_method;
  }

  // If it's an object, extract the type or instructions
  if (typeof job.application_method === 'object') {
    const method = job.application_method as any;
    return method.type || method.instructions || 'See job posting';
  }

  return null;
}

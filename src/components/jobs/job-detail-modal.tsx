'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/types/api';
import {
  MapPin,
  Building2,
  DollarSign,
  Clock,
  ExternalLink,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatSalary, formatRelativeTime } from '@/lib/utils/formatters';
import {
  getCompanyName,
  getLocationString,
  getSalaryInfo,
  getPostedDate,
  getScrapedAt,
  isAtsDetected,
  getAtsSystem,
  getApplicationMethod,
} from '@/lib/utils/job-helpers';

interface JobDetailModalProps {
  job: Job;
  open: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, open, onClose }: JobDetailModalProps) {
  const salaryInfo = getSalaryInfo(job);
  const salary = formatSalary(
    salaryInfo.min,
    salaryInfo.max,
    salaryInfo.currency,
    salaryInfo.period
  );
  const location = getLocationString(job);
  const company = getCompanyName(job);
  const postedDate = getPostedDate(job);
  const scrapedAt = getScrapedAt(job);
  const atsDetected = isAtsDetected(job);
  const atsSystem = getAtsSystem(job);
  const applicationMethod = getApplicationMethod(job);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                {company}
              </DialogDescription>
            </div>
            {job.is_easy_apply && (
              <Badge variant="secondary" className="shrink-0">
                Easy Apply
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {location && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}

            {salary && (
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <DollarSign className="h-4 w-4" />
                <span>{salary}</span>
              </div>
            )}

            {postedDate && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Clock className="h-4 w-4" />
                <span>Posted {formatRelativeTime(postedDate)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {job.job_type && (
              <Badge variant="outline">
                <Briefcase className="mr-1 h-3 w-3" />
                {job.job_type}
              </Badge>
            )}
            {job.contract_type && (
              <Badge variant="outline">{job.contract_type}</Badge>
            )}
            {job.remote_option && (
              <Badge variant="outline">{job.remote_option}</Badge>
            )}
            {atsDetected && (
              <Badge variant="secondary">
                <AlertCircle className="mr-1 h-3 w-3" />
                ATS: {atsSystem || 'Detected'}
              </Badge>
            )}
          </div>

          {job.description && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Job Description
              </h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Benefits
              </h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <div className="mb-4 grid gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Scraped {formatRelativeTime(scrapedAt)}</span>
              </div>
              {applicationMethod && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Application method:</span>
                  <span>{applicationMethod}</span>
                </div>
              )}
            </div>

            <Button asChild className="w-full">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types/api';
import { MapPin, Building2, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { formatSalary, formatRelativeTime } from '@/lib/utils/formatters';
import {
  getCompanyName,
  getLocationString,
  getSalaryInfo,
  getPostedDate,
} from '@/lib/utils/job-helpers';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card
        className="group relative h-full cursor-pointer overflow-hidden border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
        onClick={onClick}
      >
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {job.title}
            </h3>
            {job.is_easy_apply && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Easy Apply
              </Badge>
            )}
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{company}</span>
          </div>

          {location && (
            <div className="mb-2 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
              {job.remote_option && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {job.remote_option}
                </Badge>
              )}
            </div>
          )}

          {salary && (
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <DollarSign className="h-4 w-4 shrink-0" />
              <span className="truncate">{salary}</span>
            </div>
          )}

          {postedDate && (
            <div className="mb-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Posted {formatRelativeTime(postedDate)}</span>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-4">
            {job.job_type && (
              <Badge variant="outline" className="text-xs">
                {job.job_type}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-xs text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-400">
              <span>View details</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

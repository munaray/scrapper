'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types/api';
import { getCompanyName, getLocationString, getSalaryInfo, getPostedDate } from '@/lib/utils/job-helpers';
import { formatSalary, formatRelativeTime } from '@/lib/utils/formatters';

interface JobTableRowProps {
  job: Job;
  onClick: () => void;
}

export function JobTableRow({ job, onClick }: JobTableRowProps) {
  const company = getCompanyName(job);
  const location = getLocationString(job);
  const salaryInfo = getSalaryInfo(job);
  const postedDate = getPostedDate(job);
  const skills = job.skills?.slice(0, 3) || [];
  const remainingSkills = (job.skills?.length || 0) - 3;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer border-b border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
      onClick={onClick}
    >
      <td className="sticky left-0 bg-white px-4 py-4 dark:bg-neutral-900">
        <div className="line-clamp-2 font-medium text-neutral-900 dark:text-neutral-50">
          {job.title}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
        {company || '—'}
      </td>
      <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
        {location || '—'}
      </td>
      <td className="px-4 py-4">
        {job.job_type && <Badge variant="outline">{job.job_type}</Badge>}
      </td>
      <td className="px-4 py-4">
        {job.remote_option && <Badge variant="secondary">{job.remote_option}</Badge>}
      </td>
      <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
        {formatSalary(salaryInfo.min, salaryInfo.max, salaryInfo.currency, salaryInfo.period) || '—'}
      </td>
      <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
        {postedDate ? formatRelativeTime(new Date(postedDate)) : '—'}
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {remainingSkills > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{remainingSkills}
            </Badge>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

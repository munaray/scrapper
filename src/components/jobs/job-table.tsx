'use client';

import { Table, TableBody, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { TableHeader } from './table-header';
import { JobTableRow } from './job-table-row';
import { Skeleton } from '@/components/ui/skeleton';
import type { Job, SortConfig, SortableColumn } from '@/lib/types/api';
import { getJobId } from '@/lib/utils/job-helpers';

interface JobTableProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  sortConfig: SortConfig;
  onSort: (column: SortableColumn) => void;
  loading?: boolean;
}

export function JobTable({ jobs, onJobClick, sortConfig, onSort, loading }: JobTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <Table>
        <ShadcnTableHeader>
          <TableRow>
            <TableHeader column="title" label="Job Title" sortConfig={sortConfig} onSort={onSort} />
            <TableHeader column="company" label="Company" sortConfig={sortConfig} onSort={onSort} />
            <TableHeader column="location" label="Location" sortConfig={sortConfig} onSort={onSort} />
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Remote
            </th>
            <TableHeader column="salary" label="Salary" sortConfig={sortConfig} onSort={onSort} />
            <TableHeader column="posted_date" label="Posted" sortConfig={sortConfig} onSort={onSort} />
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Skills
            </th>
          </TableRow>
        </ShadcnTableHeader>
        <TableBody>
          {jobs.map((job) => (
            <JobTableRow
              key={getJobId(job)}
              job={job}
              onClick={() => onJobClick(job)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

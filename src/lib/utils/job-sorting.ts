import type { Job, SortConfig, SortableColumn } from '@/lib/types/api';
import { getCompanyName, getLocationString, getSalaryInfo, getPostedDate } from './job-helpers';

export function sortJobs(jobs: Job[], sortConfig: SortConfig): Job[] {
  if (!sortConfig.column || !sortConfig.direction) return jobs;

  return [...jobs].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortConfig.column) {
      case 'title':
        aValue = a.title ? a.title.toLowerCase() : '';
        bValue = b.title ? b.title.toLowerCase() : '';
        break;
      case 'company':
        aValue = getCompanyName(a) ? getCompanyName(a).toLowerCase() : '';
        bValue = getCompanyName(b) ? getCompanyName(b).toLowerCase() : '';
        break;
      case 'location':
        aValue = getLocationString(a)?.toLowerCase() || '';
        bValue = getLocationString(b)?.toLowerCase() || '';
        break;
      case 'posted_date':
        aValue = getPostedDate(a) ? new Date(getPostedDate(a)!).getTime() : 0;
        bValue = getPostedDate(b) ? new Date(getPostedDate(b)!).getTime() : 0;
        break;
      case 'salary':
        const aSalary = getSalaryInfo(a);
        const bSalary = getSalaryInfo(b);
        aValue = aSalary.max || aSalary.min || 0;
        bValue = bSalary.max || bSalary.min || 0;
        break;
      default:
        return 0;
    }

    // Handle empty values - push to end
    if (!aValue && aValue !== 0) return 1;
    if (!bValue && bValue !== 0) return -1;

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function getNextSortDirection(
  currentColumn: SortableColumn | null,
  currentDirection: 'asc' | 'desc' | null,
  clickedColumn: SortableColumn
): 'asc' | 'desc' | null {
  if (currentColumn !== clickedColumn) return 'asc';
  if (currentDirection === null) return 'asc';
  if (currentDirection === 'asc') return 'desc';
  return null;
}

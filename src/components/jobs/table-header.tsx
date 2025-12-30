import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { SortableColumn, SortConfig } from '@/lib/types/api';

interface TableHeaderProps {
  column: SortableColumn;
  label: string;
  sortConfig: SortConfig;
  onSort: (column: SortableColumn) => void;
  sortable?: boolean;
}

export function TableHeader({ column, label, sortConfig, onSort, sortable = true }: TableHeaderProps) {
  const isSorted = sortConfig.column === column;
  const direction = isSorted ? sortConfig.direction : null;

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ${
        sortable ? 'cursor-pointer select-none hover:bg-neutral-50 dark:hover:bg-neutral-800' : ''
      }`}
      onClick={() => sortable && onSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortable && (
          <span className="text-neutral-400">
            {!isSorted && <ArrowUpDown className="h-4 w-4" />}
            {isSorted && direction === 'asc' && <ArrowUp className="h-4 w-4" />}
            {isSorted && direction === 'desc' && <ArrowDown className="h-4 w-4" />}
          </span>
        )}
      </div>
    </th>
  );
}

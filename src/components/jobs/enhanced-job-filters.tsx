'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { JobFilters } from '@/lib/types/api';
import { JOB_TYPE_OPTIONS, REMOTE_OPTIONS, CONTRACT_TYPE_OPTIONS } from '@/lib/types/api';

interface EnhancedJobFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  activeFilterCount: number;
}

export function EnhancedJobFilters({ filters, onFilterChange, activeFilterCount }: EnhancedJobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<JobFilters>(filters);

  const handleChange = (updates: Partial<JobFilters>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const cleared: JobFilters = {
      jobType: '',
      remoteOption: '',
      salaryMin: null,
      salaryMax: null,
      atsDetected: null,
      easyApply: null,
      contractType: '',
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Job Type */}
      <div className="w-40">
        <Select
          value={localFilters.jobType}
          onValueChange={(value) => handleChange({ jobType: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Remote Option */}
      <div className="w-40">
        <Select
          value={localFilters.remoteOption}
          onValueChange={(value) => handleChange({ remoteOption: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Remote" />
          </SelectTrigger>
          <SelectContent>
            {REMOTE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contract Type */}
      <div className="w-40">
        <Select
          value={localFilters.contractType}
          onValueChange={(value) => handleChange({ contractType: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Contract" />
          </SelectTrigger>
          <SelectContent>
            {CONTRACT_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Salary Min */}
      <div className="w-32">
        <Input
          type="number"
          placeholder="Min Salary"
          className="h-9"
          value={localFilters.salaryMin || ''}
          onChange={(e) =>
            handleChange({ salaryMin: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      {/* Salary Max */}
      <div className="w-32">
        <Input
          type="number"
          placeholder="Max Salary"
          className="h-9"
          value={localFilters.salaryMax || ''}
          onChange={(e) =>
            handleChange({ salaryMax: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      {/* ATS Detected Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="ats-detected"
          checked={localFilters.atsDetected === true}
          onCheckedChange={(checked) =>
            handleChange({ atsDetected: checked ? true : null })
          }
        />
        <label
          htmlFor="ats-detected"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          ATS Only
        </label>
      </div>

      {/* Easy Apply Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="easy-apply"
          checked={localFilters.easyApply === true}
          onCheckedChange={(checked) =>
            handleChange({ easyApply: checked ? true : null })
          }
        />
        <label
          htmlFor="easy-apply"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Easy Apply
        </label>
      </div>

      {/* Clear Button and Badge */}
      <div className="ml-auto flex items-center gap-2">
        {activeFilterCount > 0 && (
          <>
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}
            </Badge>
            <Button onClick={handleClear} variant="outline" size="sm" className="h-9">
              <X className="h-4 w-4" />
              Clear
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

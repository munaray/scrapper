'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface JobFiltersProps {
  filters: {
    location: string;
    company: string;
  };
  onFilterChange: (filters: { location: string; company: string }) => void;
}

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = { location: '', company: '' };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = localFilters.location || localFilters.company;

  return (
    <Card className="mb-6 border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="location-filter"
            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Location
          </label>
          <Input
            id="location-filter"
            type="text"
            placeholder="Search by location (e.g., New York)"
            value={localFilters.location}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, location: e.target.value })
            }
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="company-filter"
            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Company
          </label>
          <Input
            id="company-filter"
            type="text"
            placeholder="Search by company name"
            value={localFilters.company}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, company: e.target.value })
            }
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          {hasActiveFilters && (
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

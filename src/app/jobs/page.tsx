"use client";

import { useState, useEffect, useMemo } from "react";
import { scraperApi } from "@/lib/api/scraper";
import type { Job, JobsListResponse, JobFilters, SortConfig, SortableColumn } from "@/lib/types/api";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { JobTable } from "@/components/jobs/job-table";
import { EnhancedJobFilters } from "@/components/jobs/enhanced-job-filters";
import { JobDetailModal } from "@/components/jobs/job-detail-modal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { applyClientFilters, getActiveFilterCount } from "@/lib/utils/job-filters";
import { sortJobs, getNextSortDirection } from "@/lib/utils/job-sorting";

export default function JobsPage() {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [pageSize] = useState(20);

	const [filters, setFilters] = useState<JobFilters>({
		jobType: '',
		remoteOption: '',
		salaryMin: null,
		salaryMax: null,
		atsDetected: null,
		easyApply: null,
		contractType: '',
	});

	const [sortConfig, setSortConfig] = useState<SortConfig>({
		column: null,
		direction: null,
	});

	const fetchJobs = async () => {
		try {
			setLoading(true);
			setError(null);

			const params = {
				page,
				page_size: pageSize,
			};

			const response: JobsListResponse = await scraperApi.getJobs(params);

			setJobs(response.jobs);
			setTotalPages(response.total_pages);
			setTotalCount(response.total_count);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch jobs"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, [page]);

	const processedJobs = useMemo(() => {
		let filtered = applyClientFilters(jobs, filters);
		let sorted = sortJobs(filtered, sortConfig);
		return sorted;
	}, [jobs, filters, sortConfig]);

	const handleFilterChange = (newFilters: JobFilters) => {
		setFilters(newFilters);
	};

	const handleSort = (column: SortableColumn) => {
		const newDirection = getNextSortDirection(sortConfig.column, sortConfig.direction, column);
		setSortConfig({
			column: newDirection === null ? null : column,
			direction: newDirection,
		});
	};

	const handlePreviousPage = () => {
		if (page > 1) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (page < totalPages) setPage(page + 1);
	};

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-400">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
						Job Listings
					</h1>
					<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
						Browse {totalCount.toLocaleString()} scraped job
						opportunities
					</p>
				</div>

				<EnhancedJobFilters
					filters={filters}
					onFilterChange={handleFilterChange}
					activeFilterCount={getActiveFilterCount(filters)}
				/>

				{error && (
					<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
						{error}
					</div>
				)}

				{processedJobs.length === 0 && !loading ? (
					<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
						<p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
							No jobs found
						</p>
						<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
							Try adjusting your filters or check back later
						</p>
					</div>
				) : (
					<>
						<JobTable
							jobs={processedJobs}
							onJobClick={setSelectedJob}
							sortConfig={sortConfig}
							onSort={handleSort}
							loading={loading}
						/>

						{totalPages > 1 && (
							<div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-800">
								<div className="text-sm text-neutral-600 dark:text-neutral-400">
									Page {page} of {totalPages}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handlePreviousPage}
										disabled={page === 1}>
										<ChevronLeft className="h-4 w-4" />
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleNextPage}
										disabled={page === totalPages}>
										Next
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}

				{selectedJob && (
					<JobDetailModal
						job={selectedJob}
						open={!!selectedJob}
						onClose={() => setSelectedJob(null)}
					/>
				)}
			</div>
		</DashboardLayout>
	);
}

"use client";

import { useState, useEffect } from "react";
import { scraperApi } from "@/lib/api/scraper";
import type { Job, JobsListResponse } from "@/lib/types/api";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobDetailModal } from "@/components/jobs/job-detail-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getJobId } from "@/lib/utils/job-helpers";

export default function JobsPage() {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [pageSize] = useState(20);

	const [filters, setFilters] = useState({
		location: "",
		company: "",
	});

	const fetchJobs = async () => {
		try {
			setLoading(true);
			setError(null);

			const params = {
				page,
				page_size: pageSize,
				...(filters.location && { location: filters.location }),
				...(filters.company && { company: filters.company }),
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
	}, [page, filters]);

	const handleFilterChange = (newFilters: {
		location: string;
		company: string;
	}) => {
		setFilters(newFilters);
		setPage(1);
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

				<JobFilters
					onFilterChange={handleFilterChange}
					filters={filters}
				/>

				{error && (
					<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
						{error}
					</div>
				)}

				{loading ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-64 rounded-lg" />
						))}
					</div>
				) : jobs.length === 0 ? (
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
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{jobs.map((job) => (
								<JobCard
									key={getJobId(job)}
									job={job}
									onClick={() => setSelectedJob(job)}
								/>
							))}
						</div>

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

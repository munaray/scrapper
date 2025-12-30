import { apiClient } from './client';
import type {
  BatchScrapeRequest,
  BatchScrapeResponse,
  SingleScrapeRequest,
  SingleScrapeResponse,
  ProgressResponse,
  StopRequest,
  StopResponse,
  ResourceInfo,
  StatusResponse,
  BatchHistoryResponse,
  BatchDetailsResponse,
  JobsListResponse,
  JobStatsResponse,
} from '@/lib/types/api';

export const scraperApi = {
  async startBatch(request: BatchScrapeRequest): Promise<BatchScrapeResponse> {
    return apiClient.post<BatchScrapeResponse>('/scrape/batch', request);
  },

  async scrapeSingleUrl(url: string): Promise<SingleScrapeResponse> {
    return apiClient.post<SingleScrapeResponse>('/scrape/single', { url });
  },

  async getProgress(): Promise<ProgressResponse> {
    return apiClient.get<ProgressResponse>('/scrape/progress');
  },

  async getStatus(): Promise<StatusResponse> {
    return apiClient.get<StatusResponse>('/scrape/status');
  },

  async stopBatch(request?: StopRequest): Promise<StopResponse> {
    return apiClient.post<StopResponse>('/scrape/stop', request);
  },

  async getResources(): Promise<ResourceInfo> {
    return apiClient.get<ResourceInfo>('/scrape/resources');
  },

  async getHistory(limit: number = 10): Promise<BatchHistoryResponse> {
    return apiClient.get<BatchHistoryResponse>(`/scrape/history?limit=${limit}`);
  },

  async getBatchDetails(batchId: string): Promise<BatchDetailsResponse> {
    return apiClient.get<BatchDetailsResponse>(`/scrape/batch/${batchId}`);
  },

  async getJobs(params?: {
    page?: number;
    page_size?: number;
    location?: string;
    company?: string;
  }): Promise<JobsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.location) queryParams.append('location', params.location);
    if (params?.company) queryParams.append('company', params.company);

    const query = queryParams.toString();
    const url = query ? `/scrape/jobs?${query}` : '/scrape/jobs';
    return apiClient.get<JobsListResponse>(url);
  },

  async getJobStats(): Promise<JobStatsResponse> {
    return apiClient.get<JobStatsResponse>('/scrape/jobs/stats');
  },
};

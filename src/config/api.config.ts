export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://4.234.160.101:8020',
  TIMEOUT: 60000, // 60 seconds - increased for slow progress queries
  POLLING_INTERVALS: {
    PROGRESS: 5000,    // 5s - reduced from 2s to avoid excessive requests
    STATUS: 10000,     // 10s - reduced frequency
    RESOURCES: 10000,  // 10s
  }
} as const;

// lib/reportStats.ts
type ReportStatsListener = (stats: { 
  totalReports: number; 
  categoryCounts: { guide: number; event: number; puzzle: number; build: number } 
}) => void;

let totalReports = 0;
let categoryCounts = {
  guide: 0,
  event: 0,
  puzzle: 0,
  build: 0,
};
let listeners: ReportStatsListener[] = [];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchReportStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/reports?page=1&limit=1000`);
    if (response.ok) {
      const data = await response.json();
      if (data.reports && Array.isArray(data.reports)) {
        const total = data.pagination?.totalItems || data.reports.length;
        const counts = {
          guide: data.reports.filter((r: any) => r.type === 'guide').length,
          event: data.reports.filter((r: any) => r.type === 'event').length,
          puzzle: data.reports.filter((r: any) => r.type === 'puzzle').length,
          build: data.reports.filter((r: any) => r.type === 'build').length,
        };
        
        totalReports = total;
        categoryCounts = counts;
        
        // Notify all listeners
        listeners.forEach(listener => listener({ totalReports, categoryCounts }));
        
        // Dispatch global event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('reportStatsUpdated', { 
            detail: { totalReports, categoryCounts } 
          }));
        }
        
        console.log('📊 Report stats updated:', { total, counts });
      }
    }
  } catch (error) {
    console.error('Error fetching report stats:', error);
  }
}

export function subscribeToReportStats(listener: ReportStatsListener) {
  listeners.push(listener);
  listener({ totalReports, categoryCounts });
  
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function getCurrentStats() {
  return { totalReports, categoryCounts };
}

// Auto-refresh every 10 seconds
if (typeof window !== 'undefined') {
  fetchReportStats();
  setInterval(fetchReportStats, 10000);
}
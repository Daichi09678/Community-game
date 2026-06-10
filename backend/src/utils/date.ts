export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatRelativeDate(date: Date | null | undefined | string): string {
  if (!date) return 'Just now';
  let dateObj: Date;
  if (date instanceof Date) dateObj = date;
  else dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Just now';
  const diffHours = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function formatDateTime(date: Date | null | undefined | string): string {
  if (!date) return 'N/A';
  let dateObj: Date;
  if (date instanceof Date) dateObj = date;
  else dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return dateObj.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
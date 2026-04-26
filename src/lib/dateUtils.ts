// src/lib/dateUtils.ts
export const getDateRange = (range: string) => {
  const now = new Date();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  if (range === 'today') {
    const today = formatDate(now);
    return { startDate: today, endDate: today };
  }
  if (range === 'week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now.setDate(diff));
    const end = new Date(now.setDate(diff + 6));
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }
  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }
  return { startDate: undefined, endDate: undefined };
};
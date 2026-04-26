import { useState, useMemo } from 'react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

export type DateRange = 'today' | 'week' | 'month';

export const useTableFilters = () => {
  const [range, setRange] = useState<DateRange>('month');

  const dates = useMemo(() => {
    const now = new Date();
    switch (range) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case 'month':
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [range]);

  return {
    range,
    setRange,
    startDate: format(dates.start, 'yyyy-MM-dd HH:mm:ss'),
    endDate: format(dates.end, 'yyyy-MM-dd HH:mm:ss')
  };
};
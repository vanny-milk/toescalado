import { useState, useMemo, useCallback } from 'react';
import { getCalendarWeeks } from '../utils/dateUtils';
import type { CalendarWeek } from '../utils/dateUtils';

export function useCalendar(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const nextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarWeeks: CalendarWeek[] = useMemo(() => {
    return getCalendarWeeks(year, month);
  }, [year, month]);

  return {
    currentDate,
    nextMonth,
    prevMonth,
    calendarWeeks,
    year,
    month
  };
}

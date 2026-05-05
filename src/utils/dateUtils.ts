export type CalendarDay = {
  dayNumber: number;
  isValid: boolean;
};

export type CalendarWeek = {
  weekNo: number;
  days: CalendarDay[];
};

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Convert Sunday (0) to 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // Set to nearest Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getCalendarWeeks(year: number, month: number): CalendarWeek[] {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: CalendarWeek[] = [];

  for (let weekIdx = 0; weekIdx < 6; weekIdx++) {
    const days: CalendarDay[] = [];
    let hasValidDay = false;

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const dayNumber = weekIdx * 7 + dayIdx - firstDayOfMonth + 1;
      const isValid = dayNumber > 0 && dayNumber <= daysInMonth;
      if (isValid) hasValidDay = true;
      days.push({ dayNumber, isValid });
    }

    if (weekIdx > 0 && !hasValidDay) continue;

    const firstValidDay = days.find(d => d.isValid)?.dayNumber || 1;
    const weekDate = new Date(year, month, firstValidDay);
    const weekNo = getWeekNumber(weekDate);

    weeks.push({ weekNo, days });
  }

  return weeks;
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora mesmo';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours} h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `há ${diffInDays} d`;
  
  return new Date(date).toLocaleDateString('pt-BR');
}

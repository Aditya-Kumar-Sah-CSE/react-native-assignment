import { Shift, ShiftSection } from '../types/shift';

/**
 * Format timestamp into 24h time: e.g. "14:00"
 */
export const formatTime = (timestamp: number): string => {
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format shift time range: e.g. "14:00-16:00"
 */
export const formatShiftTimeRange = (startTime: number, endTime: number): string => {
  return `${formatTime(startTime)}-${formatTime(endTime)}`;
};

/**
 * Determine date group label: "Today", "Tomorrow", or "September 22"
 */
export const getDateLabel = (timestamp: number): string => {
  const target = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(target, today)) {
    return 'Today';
  } else if (isSameDay(target, tomorrow)) {
    return 'Tomorrow';
  } else {
    // Format: "MMMM d", e.g. "September 22"
    return target.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  }
};

/**
 * Calculate total hours for an array of shifts
 */
export const calculateTotalHours = (shifts: Shift[]): number => {
  const totalMs = shifts.reduce((acc, s) => acc + (s.endTime - s.startTime), 0);
  const hours = totalMs / (1000 * 60 * 60);
  // Round to 1 decimal place or whole number
  return Math.round(hours * 10) / 10;
};

/**
 * Checks if a shift has already started
 */
export const hasShiftStarted = (shift: Shift): boolean => {
  return Date.now() > shift.startTime;
};

/**
 * Group shifts by Date for SectionList.
 * @param shifts Input shift array
 * @param includeSummary If true, appends "X shifts, Y h" to section subtitle (used in My shifts)
 */
export const groupShiftsByDate = (
  shifts: Shift[],
  includeSummary: boolean = false
): ShiftSection[] => {
  // Sort shifts chronologically by startTime
  const sorted = [...shifts].sort((a, b) => a.startTime - b.startTime);

  // Group by date key (YYYY-MM-DD)
  const map = new Map<string, { label: string; shifts: Shift[] }>();

  sorted.forEach((shift) => {
    const d = new Date(shift.startTime);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const label = getDateLabel(shift.startTime);

    if (!map.has(key)) {
      map.set(key, { label, shifts: [] });
    }
    map.get(key)!.shifts.push(shift);
  });

  const sections: ShiftSection[] = [];
  map.forEach(({ label, shifts: groupShifts }) => {
    let subtitle: string | undefined;
    if (includeSummary) {
      const count = groupShifts.length;
      const countStr = count === 1 ? '1 shift' : `${count} shifts`;
      const hours = calculateTotalHours(groupShifts);
      subtitle = `${countStr}, ${hours} h`;
    }

    sections.push({
      title: label,
      subtitle,
      data: groupShifts,
    });
  });

  return sections;
};


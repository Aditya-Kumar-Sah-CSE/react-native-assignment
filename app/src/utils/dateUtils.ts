import { Shift, ShiftSection } from '../types/shift';

/**
 * Optional default timezone for the application.
 * All shifts in this assignment are situated in Finnish cities (Helsinki, Tampere, Turku).
 * Setting to undefined uses the user's device local timezone.
 */
export const FINLAND_TIMEZONE = 'Europe/Helsinki';

/**
 * Format timestamp into 24h time: e.g. "14:00"
 * Supports optional timezone parameter (e.g. 'Europe/Helsinki' or device local if omitted).
 */
export const formatTime = (timestamp: number, timeZone?: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      ...(timeZone ? { timeZone } : {}),
    });
    return formatter.format(new Date(timestamp));
  } catch {
    const d = new Date(timestamp);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
};

/**
 * Format shift time range: e.g. "14:00-16:00"
 */
export const formatShiftTimeRange = (
  startTime: number,
  endTime: number,
  timeZone?: string
): string => {
  return `${formatTime(startTime, timeZone)}-${formatTime(endTime, timeZone)}`;
};

/**
 * Generate a timezone-aligned ISO calendar date key "YYYY-MM-DD"
 */
export const getDateKey = (timestamp: number, timeZone?: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(timeZone ? { timeZone } : {}),
    });
    return formatter.format(new Date(timestamp));
  } catch {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

/**
 * Determine date group label: "Today", "Tomorrow", or formatted date e.g. "November 24".
 * Accurately aligns calendar boundaries according to the active timezone.
 */
export const getDateLabel = (timestamp: number, timeZone?: string): string => {
  const now = Date.now();
  const todayKey = getDateKey(now, timeZone);
  const tomorrowKey = getDateKey(now + 24 * 60 * 60 * 1000, timeZone);
  const targetKey = getDateKey(timestamp, timeZone);

  if (targetKey === todayKey) {
    return 'Today';
  } else if (targetKey === tomorrowKey) {
    return 'Tomorrow';
  } else {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        ...(timeZone ? { timeZone } : {}),
      });
      return formatter.format(new Date(timestamp));
    } catch {
      return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
    }
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
 * Checks if a shift has already started (UTC epoch ms comparison)
 */
export const hasShiftStarted = (shift: Shift): boolean => {
  return Date.now() >= shift.startTime;
};

/**
 * Group shifts by Date for SectionList.
 * @param shifts Input shift array
 * @param includeSummary If true, appends "X shifts, Y h" to section subtitle (used in My shifts)
 * @param timeZone Optional timezone for date alignment
 */
export const groupShiftsByDate = (
  shifts: Shift[],
  includeSummary: boolean = false,
  timeZone?: string
): ShiftSection[] => {
  // Sort shifts chronologically by startTime
  const sorted = [...shifts].sort((a, b) => a.startTime - b.startTime);

  // Group by date key (YYYY-MM-DD)
  const map = new Map<string, { label: string; shifts: Shift[] }>();

  sorted.forEach((shift) => {
    const key = getDateKey(shift.startTime, timeZone);
    const label = getDateLabel(shift.startTime, timeZone);

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

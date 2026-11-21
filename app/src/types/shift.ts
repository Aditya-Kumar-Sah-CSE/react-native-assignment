export interface Shift {
  id: string;
  area: 'Helsinki' | 'Tampere' | 'Turku' | string;
  booked: boolean;
  startTime: number; // Unix timestamp ms
  endTime: number;   // Unix timestamp ms
}

export interface ShiftSection {
  title: string;
  subtitle?: string; // e.g. "2 shifts, 4 h"
  data: Shift[];
}


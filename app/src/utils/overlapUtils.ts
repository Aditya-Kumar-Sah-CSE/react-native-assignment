import { Shift } from '../types/shift';

/**
 * Determines whether candidateShift overlaps in time with ANY shift that is already booked.
 * 
 * Mathematical Interval Intersection Condition:
 * Two intervals [S1, E1] and [S2, E2] intersect iff:
 * S1 < E2 AND E1 > S2
 * 
 * Note: Overlap detection is global across ALL cities.
 */
export const isShiftOverlapping = (
  candidateShift: Shift,
  allBookedShifts: Shift[]
): boolean => {
  // A shift that is already booked is labeled as "Booked", not "Overlapping"
  if (candidateShift.booked) {
    return false;
  }

  return allBookedShifts.some((booked) => {
    // Never compare a shift to itself
    if (booked.id === candidateShift.id) {
      return false;
    }

    // Interval overlap condition
    return (
      booked.startTime < candidateShift.endTime &&
      booked.endTime > candidateShift.startTime
    );
  });
};


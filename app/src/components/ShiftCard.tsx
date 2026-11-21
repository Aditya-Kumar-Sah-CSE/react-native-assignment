import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shift } from '../types/shift';
import { Colors } from '../constants/colors';
import { formatShiftTimeRange, hasShiftStarted } from '../utils/dateUtils';
import { ActionButton } from './ActionButton';

interface ShiftCardProps {
  shift: Shift;
  isOverlapping?: boolean;
  showAreaSubtitle?: boolean;
  loading?: boolean;
  onBook?: (shift: Shift) => void;
  onCancel?: (shift: Shift) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  isOverlapping = false,
  showAreaSubtitle = false,
  loading = false,
  onBook,
  onCancel,
}) => {
  const isStarted = hasShiftStarted(shift);

  // Status label for Available shifts screen
  let statusText: string | null = null;
  let statusColor = Colors.textDark;

  if (shift.booked) {
    statusText = 'Booked';
    statusColor = Colors.textDark;
  } else if (isOverlapping) {
    statusText = 'Overlapping';
    statusColor = Colors.dangerRed;
  }

  // Button configuration
  const buttonType = shift.booked ? 'cancel' : 'book';
  const isDisabled = shift.booked
    ? isStarted
    : isOverlapping || isStarted;

  const handlePress = () => {
    if (shift.booked) {
      onCancel?.(shift);
    } else {
      onBook?.(shift);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Info: Time and optional Area subtitle */}
      <View style={styles.leftColumn}>
        <Text style={styles.timeText}>
          {formatShiftTimeRange(shift.startTime, shift.endTime)}
        </Text>
        {showAreaSubtitle ? (
          <Text style={styles.areaText}>{shift.area}</Text>
        ) : null}
      </View>

      {/* Middle Info: Status badge ("Booked", "Overlapping") */}
      <View style={styles.middleColumn}>
        {statusText ? (
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        ) : null}
      </View>

      {/* Right Column: Action Button */}
      <View style={styles.rightColumn}>
        <ActionButton
          type={buttonType}
          disabled={isDisabled}
          loading={loading}
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.borderGrey,
  },
  leftColumn: {
    flex: 1.2,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  areaText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  middleColumn: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});


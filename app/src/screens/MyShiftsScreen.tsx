import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftsApi } from '../api/shiftsApi';
import { Shift } from '../types/shift';
import { Colors } from '../constants/colors';
import { groupShiftsByDate } from '../utils/dateUtils';
import { DateSectionHeader } from '../components/DateSectionHeader';
import { ShiftCard } from '../components/ShiftCard';
import { NetworkBanner } from '../components/NetworkBanner';

export const MyShiftsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);

  // 1. Fetch all shifts
  const {
    data: shifts = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Shift[]>({
    queryKey: ['shifts'],
    queryFn: shiftsApi.getShifts,
  });

  // 2. Cancellation Mutation with 404 Auto-Recovery
  const cancelMutation = useMutation({
    mutationFn: (id: string) => shiftsApi.cancelShift(id),
    onMutate: (id) => {
      setActiveShiftId(id);
    },
    onSuccess: (updatedShift) => {
      queryClient.setQueryData<Shift[]>(['shifts'], (old = []) =>
        old.map((s) => (s.id === updatedShift.id ? updatedShift : s))
      );
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
    onError: (err: any) => {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('not found') || msg.includes('404')) {
        Alert.alert(
          'Shift Sync Error',
          'The server session was restarted and shift IDs were regenerated. Refreshing shifts now.'
        );
      } else {
        Alert.alert('Cancellation Error', msg || 'Could not cancel shift.');
      }
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
    onSettled: () => {
      setActiveShiftId(null);
    },
  });

  // 3. Filter for booked shifts and group by date
  const sections = useMemo(() => {
    const bookedShifts = shifts.filter((s) => s.booked);
    return groupShiftsByDate(bookedShifts, true);
  }, [shifts]);

  const handleCancel = (shift: Shift) => {
    cancelMutation.mutate(shift.id);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Initial Loading state
  if (isLoading && shifts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Network Error Banner */}
      {isError ? (
        <NetworkBanner
          message={(error as Error)?.message || 'Cannot reach mock server on port 8080.'}
          onRetry={handleRefresh}
        />
      ) : null}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title, subtitle } }) => (
          <DateSectionHeader title={title} subtitle={subtitle} />
        )}
        renderItem={({ item }) => (
          <ShiftCard
            shift={item}
            showAreaSubtitle={true}
            loading={activeShiftId === item.id}
            onCancel={handleCancel}
          />
        )}
        stickySectionHeadersEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={Colors.primaryBlue}
            colors={[Colors.primaryBlue]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No booked shifts yet</Text>
            <Text style={styles.emptySubtitle}>
              Check the "Available shifts" tab to book shifts.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.screenBg,
  },
  emptyContainer: {
    paddingVertical: 72,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

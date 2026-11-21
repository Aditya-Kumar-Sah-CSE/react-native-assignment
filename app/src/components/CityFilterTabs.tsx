import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface CityFilterTabsProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  counts: Record<string, number>;
}

export const CityFilterTabs: React.FC<CityFilterTabsProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  counts,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {cities.map((city) => {
          const isSelected = city === selectedCity;
          const count = counts[city] || 0;

          return (
            <TouchableOpacity
              key={city}
              style={[styles.tab, isSelected && styles.activeTab]}
              onPress={() => onSelectCity(city)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                {city} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.screenBg,
    borderBottomWidth: 1,
    borderColor: Colors.borderGrey,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: Colors.primaryBlue,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.primaryBlue,
    fontWeight: '700',
  },
});

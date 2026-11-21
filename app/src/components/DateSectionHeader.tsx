import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface DateSectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const DateSectionHeader: React.FC<DateSectionHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.headerBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderGrey,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
    marginLeft: 12,
  },
});


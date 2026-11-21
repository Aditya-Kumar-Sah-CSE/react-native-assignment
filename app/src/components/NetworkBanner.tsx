import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface NetworkBannerProps {
  message?: string;
  onRetry: () => void;
}

export const NetworkBanner: React.FC<NetworkBannerProps> = ({
  message = 'Cannot connect to Mock API on port 8080.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dangerRed,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  button: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  buttonText: {
    color: Colors.dangerRed,
    fontSize: 12,
    fontWeight: '700',
  },
});


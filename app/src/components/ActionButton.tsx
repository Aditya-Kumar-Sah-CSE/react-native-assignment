import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Spinner } from './Spinner';

export type ActionButtonType = 'book' | 'cancel';

interface ActionButtonProps {
  type: ActionButtonType;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onPress,
  disabled = false,
  loading = false,
}) => {
  const isBook = type === 'book';

  const containerStyles: StyleProp<ViewStyle> = [
    styles.container,
    isBook ? styles.bookBorder : styles.cancelBorder,
    disabled && styles.disabledBorder,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    isBook ? styles.bookText : styles.cancelText,
    disabled && styles.disabledText,
  ];

  const spinnerColor = isBook ? Colors.successGreen : Colors.dangerRed;

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <Spinner color={spinnerColor} size={20} />
      ) : (
        <Text style={textStyles}>{isBook ? 'Book' : 'Cancel'}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 96,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
  bookBorder: {
    borderColor: Colors.successGreenMedium,
  },
  bookText: {
    color: Colors.successGreen,
  },
  cancelBorder: {
    borderColor: Colors.dangerRed,
  },
  cancelText: {
    color: Colors.dangerRed,
  },
  disabledBorder: {
    borderColor: Colors.borderGrey,
    backgroundColor: Colors.white,
  },
  disabledText: {
    color: Colors.textMuted,
  },
});

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  style?: any;
  textOff?: string;
  textOn?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange, disabled, style, textOn="Yes", textOff="No" }) => {
  return (
    <View style={[styles.switchContainer, style, disabled && styles.switchDisabled]}>
      <TouchableOpacity
        style={[styles.segment, !value && styles.segmentSelectedOff, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}
        onPress={() => !disabled && onValueChange(false)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[styles.text, !value && styles.textSelectedOff]}>{textOff}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.segment, value && styles.segmentSelectedOn, { borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}
        onPress={() => !disabled && onValueChange(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[styles.text, value && styles.textSelectedOn]}>{textOn}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#23242a',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  segment: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  segmentSelectedOn: {
    backgroundColor: '#22c55e',
  },
  segmentSelectedOff: {
    backgroundColor: '#e6f0fa',
  },
  text: {
    color: '#888',
    fontWeight: '600',
    fontSize: 14,
  },
  textSelectedOn: {
    color: '#18181b',
  },
  textSelectedOff: {
    color: '#18181b',
  },
  switchDisabled: {
    opacity: 0.5,
  },
}); 
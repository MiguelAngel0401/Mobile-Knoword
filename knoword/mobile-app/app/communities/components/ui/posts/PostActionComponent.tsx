import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PostActionComponentProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export default function PostActionComponent({
  icon,
  label,
  onPress,
}: PostActionComponentProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ffffff',
  },
});
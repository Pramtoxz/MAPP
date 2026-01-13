import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';

interface StatCardProps {
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    marginBottom: 12,
  },
  value: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});

export default StatCard;

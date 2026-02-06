import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';

interface InfoItem {
  label: string;
  value: string | React.ReactNode;
}

interface OrderInfoSectionProps {
  items: InfoItem[];
}

export const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({ items }) => {
  return (
    <View style={styles.infoSection}>
      {items.map((item, index) => (
        <View key={index} style={styles.infoCard}>
          <Text style={styles.infoLabel}>{item.label}</Text>
          {typeof item.value === 'string' ? (
            <Text style={styles.infoValue}>{item.value}</Text>
          ) : (
            item.value
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  infoValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
});

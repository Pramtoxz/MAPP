import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { OrderSummary } from '../../../services';

interface FulfillmentSummaryProps {
  summary: OrderSummary;
}

export const FulfillmentSummary: React.FC<FulfillmentSummaryProps> = ({ summary }) => {
  return (
    <View style={styles.summarySection}>
      <Text style={styles.sectionTitle}>Ringkasan Fulfillment</Text>
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Item</Text>
          <Text style={styles.summaryValue}>{summary.totalItems} jenis</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Qty Order</Text>
          <Text style={styles.summaryValue}>{summary.totalQtyOrder} pcs</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.success }]}>Sudah Dikirim</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            {summary.totalQtyDelivered} pcs
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.warning }]}>Back Order</Text>
          <Text style={[styles.summaryValue, { color: colors.warning }]}>
            {summary.totalQtyBackOrder} pcs
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summarySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  summaryValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});

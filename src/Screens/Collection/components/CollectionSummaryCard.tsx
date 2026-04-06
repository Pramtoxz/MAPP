import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { CollectionSummary } from '../../../services';

interface CollectionSummaryCardProps {
  summary: CollectionSummary;
  formatPrice: (price: number) => string;
}

const CollectionSummaryCard: React.FC<CollectionSummaryCardProps> = ({
  summary,
  formatPrice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Total Tagihan</Text>
          <Text style={styles.value}>{formatPrice(summary.totalTagihan)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Terbayar</Text>
          <Text style={[styles.value, { color: colors.success }]}>
            {formatPrice(summary.totalTerbayar)}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Outstanding</Text>
          <Text style={[styles.value, { color: colors.warning }]}>
            {formatPrice(summary.totalOutstanding)}
          </Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Invoice Belum Lunas</Text>
          <Text style={[styles.value, { color: colors.error }]}>
            {summary.jumlahOutstanding}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  value: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGray,
    marginVertical: 12,
  },
});

export default CollectionSummaryCard;

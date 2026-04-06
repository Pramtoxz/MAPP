import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { InvoiceItem } from '../../../services';

interface InvoiceItemCardProps {
  item: InvoiceItem;
  formatPrice: (price: number) => string;
}

const InvoiceItemCard: React.FC<InvoiceItemCardProps> = ({ item, formatPrice }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.partCode}>{item.partCode}</Text>
          <Text style={styles.partName}>{item.partName}</Text>
        </View>
        <Text style={styles.qty}>x{item.qty}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Harga Satuan</Text>
        <Text style={styles.value}>{formatPrice(item.harga)}</Text>
      </View>
      {item.diskon > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Diskon</Text>
          <Text style={[styles.value, { color: colors.error }]}>
            -{formatPrice(item.diskon)}
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.labelBold}>Subtotal</Text>
        <Text style={styles.valueBold}>{formatPrice(item.subtotal)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  partCode: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginBottom: 4,
  },
  partName: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  qty: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.grayText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGray,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  value: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  labelBold: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  valueBold: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});

export default InvoiceItemCard;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { Invoice } from '../../../services';

interface InvoiceCardProps {
  invoice: Invoice;
  onPress: () => void;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onPress,
  formatPrice,
  formatDate,
  getStatusColor,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.invoiceNumber}>{invoice.noFaktur}</Text>
          <Text style={styles.date}>{formatDate(invoice.tanggal)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
          <Text style={styles.statusText}>{invoice.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>DO:</Text>
        <Text style={styles.infoValue}>{invoice.noDo}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>SO:</Text>
        <Text style={styles.infoValue}>{invoice.noSo}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Nilai Faktur</Text>
          <Text style={styles.priceValue}>{formatPrice(invoice.nilaiFaktur)}</Text>
        </View>
        {invoice.status === 'Outstanding' && (
          <View style={styles.saldoBox}>
            <Text style={styles.saldoLabel}>Sisa</Text>
            <Text style={styles.saldoValue}>{formatPrice(invoice.saldo)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
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
  },
  invoiceNumber: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  date: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGray,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
    width: 40,
  },
  infoValue: {
    flex: 1,
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  saldoBox: {
    backgroundColor: colors.backgroundWarning,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saldoLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.warning,
    marginBottom: 2,
  },
  saldoValue: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.bold,
    color: colors.warning,
  },
});

export default InvoiceCard;

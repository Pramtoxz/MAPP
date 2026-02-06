import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { DeliveryOrder } from '../../../services';

interface DeliveryOrderCardProps {
  delivery: DeliveryOrder;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
}

export const DeliveryOrderCard: React.FC<DeliveryOrderCardProps> = ({
  delivery,
  formatPrice,
  formatDate,
  getStatusColor,
}) => {
  return (
    <View style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <View>
          <Text style={styles.deliveryNo}>{delivery.noDo}</Text>
          <Text style={styles.deliveryDate}>{formatDate(delivery.tanggal)}</Text>
        </View>
        <View style={[styles.deliveryStatusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
          <Text style={styles.deliveryStatusText}>{delivery.status}</Text>
        </View>
      </View>

      <View style={styles.deliveryItems}>
        {delivery.items.map((item, itemIndex) => (
          <View key={itemIndex} style={styles.deliveryItem}>
            <View style={styles.deliveryItemHeader}>
              <Text style={styles.deliveryPartNumber}>{item.partNumber}</Text>
              <Text style={styles.deliveryQty}>x{item.qtyDo}</Text>
            </View>
            <Text style={styles.deliveryPartName} numberOfLines={1}>
              {item.partName}
            </Text>
            <View style={styles.deliveryItemFooter}>
              <Text style={styles.deliveryPrice}>{formatPrice(item.price)}</Text>
              <Text style={styles.deliverySubtotal}>{formatPrice(item.subtotal)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.deliveryTotal}>
        <Text style={styles.deliveryTotalLabel}>Total DO</Text>
        <Text style={styles.deliveryTotalValue}>{formatPrice(delivery.grandTotal)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deliveryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  deliveryNo: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  deliveryStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryStatusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  deliveryItems: {
    marginBottom: 12,
  },
  deliveryItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  deliveryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryPartNumber: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  deliveryQty: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  deliveryPartName: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
  },
  deliveryItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryPrice: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  deliverySubtotal: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  deliveryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  deliveryTotalLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
  deliveryTotalValue: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});

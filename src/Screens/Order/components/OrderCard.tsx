import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';
import { OrderWithDetails } from '../hooks/useOrderScreen';

interface OrderCardProps {
  order: OrderWithDetails;
  onPress: () => void;
  onBackOrderPress: () => void;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onBackOrderPress,
  formatPrice,
  formatDate,
  getStatusColor,
}) => {
  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.orderType}>{order.orderType}</Text>
      
      {order.fulfillment && (
        <View style={styles.fulfillmentInfo}>
          <View style={styles.fulfillmentRow}>
            <Text style={styles.fulfillmentLabel}>Total Order:</Text>
            <Text style={styles.fulfillmentValue}>{order.fulfillment.totalQtyOrder} pcs</Text>
          </View>
          <View style={styles.fulfillmentRow}>
            <Text style={[styles.fulfillmentLabel, { color: colors.success }]}>Delivered:</Text>
            <Text style={[styles.fulfillmentValue, { color: colors.success }]}>
              {order.fulfillment.totalQtyDelivered} pcs
            </Text>
          </View>
          {order.fulfillment.totalQtyBackOrder > 0 && (
            <View style={styles.fulfillmentRow}>
              <Text style={[styles.fulfillmentLabel, { color: colors.warning }]}>Back Order:</Text>
              <Text style={[styles.fulfillmentValue, { color: colors.warning }]}>
                {order.fulfillment.totalQtyBackOrder} pcs
              </Text>
            </View>
          )}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${((order.fulfillment.totalQtyDelivered || 0) / (order.fulfillment.totalQtyOrder || 1)) * 100}%`,
                  backgroundColor: order.fulfillment.isCompleted ? colors.success : colors.warning
                }
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.orderFooter}>
        <View style={styles.dateContainer}>
          <Image source={getImage('ic_date.png')} style={styles.calendarIcon} />
          <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
        </View>
        <Text style={styles.orderTotal}>{formatPrice(order.grandTotal)}</Text>
      </View>
      
      {order.hasBackOrder && (
        <TouchableOpacity 
          style={styles.backOrderButton}
          onPress={(e) => {
            e.stopPropagation();
            onBackOrderPress();
          }}
        >
          <Image source={getImage('ic_delivery.png')} style={styles.backOrderIcon} />
          <Text style={styles.backOrderText}>Lihat Back Order</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  orderType: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
  },
  fulfillmentInfo: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fulfillmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fulfillmentLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  fulfillmentValue: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 4,
    tintColor: colors.black,
  },
  orderDate: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  orderTotal: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  backOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundWarning,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 12,
  },
  backOrderIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 6,
    tintColor: colors.primary,
  },
  backOrderText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});

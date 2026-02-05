import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';

interface OrderItemCardProps {
  partNumber: string;
  partName: string;
  image?: string;
  price: number;
  orderQty: number;
  deliveryQty: number;
  backOrderQty: number;
  subtotal?: number;
  showProgress?: boolean;
  formatPrice: (price: number) => string;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  partNumber,
  partName,
  image,
  price,
  orderQty,
  deliveryQty,
  backOrderQty,
  subtotal,
  showProgress = true,
  formatPrice,
}) => {
  const calculateProgress = () => {
    if (orderQty === 0) return 0;
    return (deliveryQty / orderQty) * 100;
  };

  const getProgressColor = () => {
    if (backOrderQty === 0) return '#4CAF50';
    return '#FF9800';
  };

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemRow}>
        {image && (
          <Image 
            source={{ uri: image }} 
            style={styles.itemImage}
            defaultSource={getImage('es_no_data.webp')}
          />
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.partNumber}>{partNumber}</Text>
          <Text style={styles.partName} numberOfLines={2}>{partName}</Text>
          <Text style={styles.itemPrice}>{formatPrice(price)}</Text>
        </View>
      </View>

      <View style={styles.qtySection}>
        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Order Qty:</Text>
          <Text style={styles.qtyValue}>{orderQty} pcs</Text>
        </View>
        <View style={styles.qtyRow}>
          <Text style={[styles.qtyLabel, { color: '#4CAF50' }]}>Delivered:</Text>
          <Text style={[styles.qtyValue, { color: '#4CAF50' }]}>
            {deliveryQty} pcs
          </Text>
        </View>
        {backOrderQty > 0 && (
          <View style={styles.qtyRow}>
            <Text style={[styles.qtyLabel, { color: '#FF9800' }]}>Back Order:</Text>
            <Text style={[styles.qtyValue, { color: '#FF9800' }]}>
              {backOrderQty} pcs
            </Text>
          </View>
        )}
      </View>

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${calculateProgress()}%`,
                  backgroundColor: getProgressColor()
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {calculateProgress().toFixed(1)}%
          </Text>
        </View>
      )}

      {subtotal !== undefined && (
        <View style={styles.itemFooter}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.itemSubtotal}>{formatPrice(subtotal)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  partNumber: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  partName: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  qtySection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  qtyLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  qtyValue: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.grayText,
    width: 45,
    textAlign: 'right',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  subtotalLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  itemSubtotal: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});

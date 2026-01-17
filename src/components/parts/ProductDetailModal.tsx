import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';

interface ProductDetailModalProps {
  visible: boolean;
  onClose: () => void;
  product: {
    image: string;
    partNumber: string;
    name: string;
    description: string;
    price: number;
    isReady?: boolean;
  } | null;
  onAddToCart: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  onClose,
  product,
  onAddToCart,
}) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={getImage('ic_close_rounded.png')} style={styles.closeIcon} />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.image} />
            {!product.isReady && (
              <View style={styles.outOfStockOverlay}>
                <View style={styles.outOfStockBadge}>
                  <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.partNumber}>{product.partNumber}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Price</Text>
                <Text style={styles.infoValue}>{formatPrice(product.price)}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Stock</Text>
                <View style={[styles.statusBadge, product.isReady ? styles.statusReady : styles.statusNotReady]}>
                  <Text style={styles.statusText}>{product.isReady ? 'Ready' : 'Not Ready'}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.addButton, !product.isReady && styles.addButtonDisabled]} 
              onPress={product.isReady ? onAddToCart : undefined}
              disabled={!product.isReady}
            >
              <Text style={styles.addButtonText}>
                {product.isReady ? 'Add to Cart' : 'Stock Not Available'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#F5F5F5',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    transform: [{ rotate: '-15deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  outOfStockText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: 1.5,
  },
  content: {
    padding: 24,
  },
  partNumber: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  name: {
    fontSize: fonts.sizes.huge,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  description: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 24,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  statusReady: {
    backgroundColor: '#4CAF50',
  },
  statusNotReady: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.grayInactive,
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default ProductDetailModal;

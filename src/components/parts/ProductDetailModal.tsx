import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    isDiscontinued?: boolean;
    canOrder?: boolean;
    discontinuedMessage?: string;
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

  const canAddToCart = !product.isDiscontinued && (product.canOrder !== false);

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
            {product.isDiscontinued ? (
              <View style={styles.discontinuedOverlay}>
                <View style={styles.discontinuedBadge}>
                  <Text style={styles.discontinuedText}>DISCONTINUED</Text>
                </View>
              </View>
            ) : !product.isReady ? (
              <View style={styles.outOfStockOverlay}>
                <View style={styles.outOfStockBadge}>
                  <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.content}>
            <Text style={styles.partNumber}>{product.partNumber}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>

            {product.isDiscontinued && product.discontinuedMessage && (
              <View style={styles.warningBox}>
                <Image source={getImage('ic_warning.png')} style={styles.warningIcon} />
                <Text style={styles.warningText}>{product.discontinuedMessage}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Price</Text>
                <Text style={styles.infoValue}>{formatPrice(product.price)}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Stock</Text>
                <View style={[
                  styles.statusBadge, 
                  product.isDiscontinued 
                    ? styles.statusDiscontinued 
                    : product.isReady 
                      ? styles.statusReady 
                      : styles.statusNotReady
                ]}>
                  <Text style={styles.statusText}>
                    {product.isDiscontinued ? 'Discontinued' : product.isReady ? 'Ready' : 'Not Ready'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              onPress={onAddToCart}
              disabled={!canAddToCart}
            >
              <LinearGradient
                colors={canAddToCart ? [colors.primary, colors.primaryDark] : [colors.grayInactive, colors.grayInactive]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.addButton, !canAddToCart && styles.addButtonDisabled]}
              >
                <Text style={styles.addButtonText}>
                  {product.isDiscontinued 
                    ? 'Cannot Order (Discontinued)' 
                    : product.isReady 
                      ? 'Add to Cart' 
                      : 'Order (Stock Tidak Ready)'}
                </Text>
              </LinearGradient>
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
    backgroundColor: colors.backgroundGray,
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
    backgroundColor: colors.errorBadge,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    transform: [{ rotate: '-15deg' }],
    shadowColor: colors.shadow,
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
  discontinuedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discontinuedBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    transform: [{ rotate: '-15deg' }],
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  discontinuedText: {
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundWarning,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.textWarning,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
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
    backgroundColor: colors.success,
  },
  statusNotReady: {
    backgroundColor: colors.warning,
  },
  statusDiscontinued: {
    backgroundColor: colors.grayInactive,
  },
  statusText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  addButton: {
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default ProductDetailModal;

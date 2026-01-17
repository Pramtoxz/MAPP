import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';

interface ProductCardProps {
  image: string;
  partNumber: string;
  name: string;
  price: number;
  isReady?: boolean;
  onPress: () => void;
  onAddPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  partNumber,
  name,
  price,
  isReady = true,
  onPress,
  onAddPress,
}) => {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {!isReady && (
          <View style={styles.outOfStockOverlay}>
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.partNumber}>{partNumber}</Text>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          <TouchableOpacity 
            style={[styles.addButton, !isReady && styles.addButtonDisabled]} 
            onPress={isReady ? onAddPress : undefined}
            disabled={!isReady}
          >
            <Image source={getImage('ic_plus_en.png')} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  outOfStockText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: 1,
  },
  content: {
    padding: 12,
  },
  partNumber: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  name: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 8,
    minHeight: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.grayInactive,
    opacity: 0.5,
  },
  buttonIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});

export default ProductCard;

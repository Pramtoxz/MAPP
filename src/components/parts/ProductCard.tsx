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
  onPress: () => void;
  onAddPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  partNumber,
  name,
  price,
  onPress,
  onAddPress,
}) => {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.partNumber}>{partNumber}</Text>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
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
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    backgroundColor: '#F5F5F5',
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
  buttonIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});

export default ProductCard;

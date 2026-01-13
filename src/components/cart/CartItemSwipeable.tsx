import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';

interface CartItemSwipeableProps {
  item: {
    id: string;
    image: string;
    partNumber: string;
    name: string;
    price: number;
    quantity: number;
  };
  onMinus: (id: string) => void;
  onPlus: (id: string) => void;
  onQuantityChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number) => string;
}

const CartItemSwipeable: React.FC<CartItemSwipeableProps> = ({
  item,
  onMinus,
  onPlus,
  onQuantityChange,
  onDelete,
  formatPrice,
}) => {
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
        >
          <Image source={getImage('ic_file_delete.png')} style={styles.deleteIcon} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.partNumber}>{item.partNumber}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity style={styles.minusButton} onPress={() => onMinus(item.id)}>
            <Image source={getImage('ic_min_en.png')} style={styles.controlIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={item.quantity.toString()}
            onChangeText={(text) => onQuantityChange(item.id, text)}
            keyboardType="numeric"
            maxLength={6}
            selectTextOnFocus
          />
          <TouchableOpacity style={styles.plusButton} onPress={() => onPlus(item.id)}>
            <Image source={getImage('ic_plus_en.png')} style={styles.controlIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  partNumber: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  itemName: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  minusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  quantityInput: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    minWidth: 50,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
  },
  deleteAction: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20,
  },
  deleteIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: colors.white,
    marginBottom: 4,
  },
  deleteText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});

export default CartItemSwipeable;

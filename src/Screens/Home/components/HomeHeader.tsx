import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getImage } from '../../../assets/images';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';

interface HomeHeaderProps {
  cartCount: number;
  onCartPress: () => void;
  onNotificationPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  cartCount,
  onCartPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.headerTop}>
      <View style={styles.headerLeft}>
        <Image source={getImage('lg_honda.webp')} style={styles.logo} />
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
          <Image source={getImage('ic_cart_response.png')} style={styles.cartIcon} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
          <Image source={getImage('ic_notification.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.bold,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});

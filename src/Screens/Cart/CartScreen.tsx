import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import CartItemSwipeable from '../../components/cart/CartItemSwipeable';
import CustomAlert from '../../components/CustomAlert';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      partNumber: '17220-K56-N00',
      name: 'Element Cleaner',
      price: 23500,
      quantity: 12,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      partNumber: '08CJ-A-K56-N00',
      name: 'Coolant',
      price: 19500,
      quantity: 1,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      partNumber: '06465-K56-N00',
      name: 'Drive Belt',
      price: 95000,
      quantity: 2,
    },
  ]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);

  const handleMinus = (id: string) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const handlePlus = (id: string) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  };

  const handleQuantityChange = (id: string, text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const quantity = parseInt(numericValue) || 1;
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setCartItems(cartItems.filter(item => item.id !== itemToDelete));
    }
    setShowDeleteAlert(false);
    setItemToDelete(null);
    setShowSuccessAlert(true);
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setItemToDelete(null);
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim() === '') {
      return;
    }
    setDiscount(10);
    setVoucherApplied(true);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

      <Image
        source={getImage('bg_honda.webp')}
        style={styles.backgroundImage}
      />

      <Image source={getImage('ic_info_badge.png')} style={styles.badgeIcon} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <View style={styles.content}>
          <FlatList
            data={cartItems}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItemSwipeable
                item={item}
                onMinus={handleMinus}
                onPlus={handlePlus}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
                formatPrice={formatPrice}
              />
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomFiller} />

      <View style={styles.footer}>
        <View style={styles.voucherContainer}>
          <Image source={getImage('ic_promotion.png')} style={styles.ribbonIcon} />
          <TextInput
            style={styles.voucherInput}
            placeholder="Masukkan kode voucher"
            placeholderTextColor={colors.grayHint}
            value={voucherCode}
            onChangeText={setVoucherCode}
            editable={!voucherApplied}
          />
          <TouchableOpacity 
            style={[styles.applyButton, voucherApplied && styles.applyButtonDisabled]}
            onPress={handleApplyVoucher}
            disabled={voucherApplied}
          >
            <Text style={styles.applyButtonText}>
              {voucherApplied ? 'Diterapkan' : 'Terapkan'}
            </Text>
          </TouchableOpacity>
        </View>

        {voucherApplied && (
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Diskon ({discount}%)</Text>
            <Text style={styles.discountValue}>- {formatPrice(calculateDiscount())}</Text>
          </View>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
        </View>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create PO</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={showDeleteAlert}
        title="Hapus Item"
        message="Apakah Anda yakin ingin menghapus item ini dari keranjang?"
        type="confirm"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Hapus"
        cancelText="Batal"
      />

      <CustomAlert
        visible={showSuccessAlert}
        title="Berhasil"
        message="Item berhasil dihapus dari keranjang"
        type="success"
        onConfirm={() => setShowSuccessAlert(false)}
        confirmText="OK"
      />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
    marginLeft: 8,
  },
  headerRight: {
    width: 40,
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    minHeight: 600,
  },
  cartItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    resizeMode: 'cover',
    marginLeft: 32,
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
  bottomFiller: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350,
    backgroundColor: colors.white,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  voucherContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  ribbonIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  voucherInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: colors.grayInactive,
  },
  applyButtonText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  discountLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: '#FF6F00',
  },
  discountValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: '#FF6F00',
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: fonts.sizes.huge,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default CartScreen;

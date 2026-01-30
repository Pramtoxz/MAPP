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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import CartItemSwipeable from '../../components/cart/CartItemSwipeable';
import CustomAlert from '../../components/CustomAlert';
import SuccessModal from '../../components/SuccessModal';
import LoadingDialog from '../../components/LoadingDialog';
import { useCartScreen } from './hooks/useCartScreen';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const {
    cartItems,
    loading,
    refreshing,
    checkoutLoading,
    handleMinus,
    handlePlus,
    handleQuantityChange,
    handleDelete: deleteItem,
    handleCheckout,
    handleRefresh,
    calculateTotal,
    formatPrice,
  } = useCartScreen();

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    no_so: string;
    jenis_so: string;
    grand_total: number;
    status: string;
  } | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
    }
    setShowDeleteAlert(false);
    setItemToDelete(null);
    setShowSuccessAlert(true);
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setItemToDelete(null);
  };

  const handleCreatePO = () => {
    if (cartItems.length === 0) {
      setErrorMessage('Keranjang belanja kosong');
      setShowErrorAlert(true);
      return;
    }

    // Show confirmation dialog
    setShowCheckoutConfirm(true);
  };

  const confirmCreatePO = async () => {
    setShowCheckoutConfirm(false);
    
    const result = await handleCheckout();
    
    if (result.success && result.data) {
      setCheckoutData(result.data);
      setShowCheckoutSuccess(true);
    } else {
      setErrorMessage(result.error || 'Checkout gagal');
      setShowErrorAlert(true);
    }
  };

  const handleCheckoutSuccessConfirm = () => {
    setShowCheckoutSuccess(false);
    setCheckoutData(null);
    navigation.navigate('MainTabs', { screen: 'OrderTab' });
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

      {/* <Image source={getImage('ic_info_badge.png')} style={styles.badgeIcon} /> */}

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require('../../assets/lottie/rocket.json')}
                autoPlay
                loop
                style={styles.rocketLottie}
              />
              <Text style={styles.loadingText}>Memuat keranjang...</Text>
            </View>
          ) : cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
          ) : (
            <>
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
              <View style={styles.bottomSpacer} />
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.createButton, (checkoutLoading || cartItems.length === 0) && styles.createButtonDisabled]}
          onPress={handleCreatePO}
          disabled={checkoutLoading || cartItems.length === 0}
        >
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
        visible={showCheckoutConfirm}
        title="Konfirmasi Pesanan"
        message={`Apakah Anda yakin ingin membuat Purchase Order dengan total ${formatPrice(calculateTotal())}?`}
        type="confirm"
        onConfirm={confirmCreatePO}
        onCancel={() => setShowCheckoutConfirm(false)}
        confirmText="Ya, Buat PO"
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

      <SuccessModal
        visible={showCheckoutSuccess}
        title="Order Berhasil Dibuat!"
        message={checkoutData ? `No. SO: ${checkoutData.no_so}` : ''}
        onComplete={handleCheckoutSuccessConfirm}
        duration={2500}
      />

      <CustomAlert
        visible={showErrorAlert}
        title="Checkout Gagal"
        message={errorMessage}
        type="alert"
        onConfirm={() => setShowErrorAlert(false)}
        confirmText="OK"
      />

      <LoadingDialog visible={checkoutLoading} message="Memproses pesanan..." />
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
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
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
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: fonts.sizes.huge + 2,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: colors.grayInactive,
  },
  createButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  rocketLottie: {
    width: 200,
    height: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
  bottomSpacer: {
    height: 200,
  },
});

export default CartScreen;

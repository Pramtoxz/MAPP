import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { orderService, BackOrderResponse } from '../../services';
import { OrderItemCard, OrderInfoSection, BackOrderNotice } from './components';
import { LoadingOverlay } from '../Home/components/LoadingOverlay';

type BackOrderScreenRouteProp = RouteProp<RootStackParamList, 'BackOrder'>;
type BackOrderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const BackOrderScreen: React.FC = () => {
  const navigation = useNavigation<BackOrderScreenNavigationProp>();
  const route = useRoute<BackOrderScreenRouteProp>();
  const { orderNumber } = route.params;

  const [backOrder, setBackOrder] = useState<BackOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBackOrder();
  }, []);

  const loadBackOrder = async () => {
    setLoading(true);
    try {
      const result = await orderService.getBackOrderList(orderNumber);
      if (result.success && result.data) {
        setBackOrder(result.data);
      }
    } catch (error) {
      console.error('Error loading back order:', error);
    }
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={getImage('es_done.webp')} style={styles.emptyImage} />
      <Text style={styles.emptyText}>Semua item sudah dikirim</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image source={getImage('bg_honda.webp')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Back Order</Text>
        <View style={styles.headerRight} />
      </View>

      {backOrder ? (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <OrderInfoSection
            items={[
              { label: 'No. Order', value: backOrder.orderNumber },
              { label: 'Tanggal Order', value: formatDate(backOrder.orderDate) },
              { 
                label: 'Total Back Order', 
                value: (
                  <Text style={[styles.infoValue, { color: '#FF9800' }]}>
                    {backOrder.totalBackOrderQty} pcs
                  </Text>
                )
              },
            ]}
          />

          <BackOrderNotice />

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Item Back Order</Text>
            
            {backOrder.backOrderItems.length > 0 ? (
              backOrder.backOrderItems.map((item, index) => (
                <OrderItemCard
                  key={index}
                  partNumber={item.partNumber}
                  partName={item.partName}
                  image={item.image}
                  price={item.price}
                  orderQty={item.orderQty}
                  deliveryQty={item.deliveryQty}
                  backOrderQty={item.backOrderQty}
                  showProgress={false}
                  formatPrice={formatPrice}
                />
              ))
            ) : (
              renderEmptyState()
            )}
          </View>
        </ScrollView>
      ) : null}

      {loading && <LoadingOverlay />}
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  infoValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  itemsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
});

export default BackOrderScreen;

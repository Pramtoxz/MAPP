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
import { orderService, OrderDetail } from '../../services';
import {
  OrderInfoSection,
  FulfillmentSummary,
  BackOrderNotice,
  OrderItemCard,
  DeliveryOrderCard,
} from './components';
import { LoadingOverlay } from '../Home/components/LoadingOverlay';

type OrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;
type OrderDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailScreenNavigationProp>();
  const route = useRoute<OrderDetailScreenRouteProp>();
  const { orderNumber } = route.params;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'items' | 'delivery'>('items');

  useEffect(() => {
    loadOrderDetail();
  }, []);

  const loadOrderDetail = async () => {
    setLoading(true);
    try {
      const result = await orderService.getOrderDetail(orderNumber);
      if (result.success && result.data) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error('Error loading order detail:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting For Approval':
        return '#FF9800';
      case 'Approve':
        return '#4CAF50';
      case 'Reject':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderEmptyDelivery = () => (
    <View style={styles.emptyDelivery}>
      <Image source={getImage('es_no_data.webp')} style={styles.emptyImage} />
      <Text style={styles.emptyText}>Belum ada pengiriman</Text>
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
        <Text style={styles.headerTitle}>Detail Order</Text>
        <View style={styles.headerRight} />
      </View>

      {order ? (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <OrderInfoSection
            items={[
              { label: 'No. Order', value: order.orderNumber },
              { label: 'Jenis Order', value: order.orderType },
              { label: 'Tanggal Order', value: formatDate(order.orderDate) },
              {
                label: 'Status',
                value: (
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                ),
              },
            ]}
          />

          {order.summary && (
            <>
              <FulfillmentSummary summary={order.summary} />
              {order.summary.totalQtyBackOrder > 0 && <BackOrderNotice />}
            </>
          )}

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'items' && styles.tabActive]}
              onPress={() => setActiveTab('items')}
            >
              <Text style={[styles.tabText, activeTab === 'items' && styles.tabTextActive]}>
                Item Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'delivery' && styles.tabActive]}
              onPress={() => setActiveTab('delivery')}
            >
              <Text style={[styles.tabText, activeTab === 'delivery' && styles.tabTextActive]}>
                Delivery Orders ({order.deliveryOrders?.length || 0})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'items' ? (
            <View style={styles.itemsSection}>
              {order.items.map((item, index) => (
                <OrderItemCard
                  key={index}
                  partNumber={item.partNumber}
                  partName={item.partName}
                  image={item.image}
                  price={item.price}
                  orderQty={item.orderQty}
                  deliveryQty={item.deliveryQty}
                  backOrderQty={item.backOrderQty}
                  subtotal={item.subtotal}
                  formatPrice={formatPrice}
                />
              ))}
            </View>
          ) : (
            <View style={styles.deliverySection}>
              {order.deliveryOrders && order.deliveryOrders.length > 0 ? (
                order.deliveryOrders.map((delivery, index) => (
                  <DeliveryOrderCard
                    key={index}
                    delivery={delivery}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                  />
                ))
              ) : (
                renderEmptyDelivery()
              )}
            </View>
          )}

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.grandTotal)}</Text>
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  tabTextActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  itemsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  deliverySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyDelivery: {
    alignItems: 'center',
    paddingVertical: 40,
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
  totalSection: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  totalValue: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default OrderDetailScreen;

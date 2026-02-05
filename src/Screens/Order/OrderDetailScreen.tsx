import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { orderService, OrderDetail, OrderItem, DeliveryOrder } from '../../services';

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

  const calculateProgress = (delivered: number, total: number) => {
    if (total === 0) return 0;
    return (delivered / total) * 100;
  };

  const getProgressColor = (backOrderQty: number) => {
    if (backOrderQty === 0) return '#4CAF50';
    return '#FF9800';
  };

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Memuat detail order...</Text>
        </View>
      ) : order ? (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>No. Order</Text>
              <Text style={styles.infoValue}>{order.orderNumber}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Jenis Order</Text>
              <Text style={styles.infoValue}>{order.orderType}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Tanggal Order</Text>
              <Text style={styles.infoValue}>{formatDate(order.orderDate)}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
          </View>

          {order.summary && (
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Ringkasan Fulfillment</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Item</Text>
                  <Text style={styles.summaryValue}>{order.summary.totalItems} jenis</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Qty Order</Text>
                  <Text style={styles.summaryValue}>{order.summary.totalQtyOrder} pcs</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Sudah Dikirim</Text>
                  <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                    {order.summary.totalQtyDelivered} pcs
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: '#FF9800' }]}>Back Order</Text>
                  <Text style={[styles.summaryValue, { color: '#FF9800' }]}>
                    {order.summary.totalQtyBackOrder} pcs
                  </Text>
                </View>
              </View>

              {order.summary.totalQtyBackOrder > 0 && (
                <View style={styles.backOrderNotice}>
                  <Image source={getImage('ic_info_badge.png')} style={styles.noticeIcon} />
                  <Text style={styles.noticeText}>
                    Barang sedang dalam proses pengiriman. Silahkan hubungi sales untuk informasi lebih lanjut.
                  </Text>
                </View>
              )}
            </View>
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
              {order.items.map((item: OrderItem, index: number) => (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    {item.image && (
                      <Image 
                        source={{ uri: item.image }} 
                        style={styles.itemImage}
                        defaultSource={getImage('es_no_data.webp')}
                      />
                    )}
                    <View style={styles.itemInfo}>
                      <Text style={styles.partNumber}>{item.partNumber}</Text>
                      <Text style={styles.partName} numberOfLines={2}>{item.partName}</Text>
                      <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                    </View>
                  </View>

                  <View style={styles.qtySection}>
                    <View style={styles.qtyRow}>
                      <Text style={styles.qtyLabel}>Order Qty:</Text>
                      <Text style={styles.qtyValue}>{item.orderQty} pcs</Text>
                    </View>
                    <View style={styles.qtyRow}>
                      <Text style={[styles.qtyLabel, { color: '#4CAF50' }]}>Delivered:</Text>
                      <Text style={[styles.qtyValue, { color: '#4CAF50' }]}>
                        {item.deliveryQty} pcs
                      </Text>
                    </View>
                    {item.backOrderQty > 0 && (
                      <View style={styles.qtyRow}>
                        <Text style={[styles.qtyLabel, { color: '#FF9800' }]}>Back Order:</Text>
                        <Text style={[styles.qtyValue, { color: '#FF9800' }]}>
                          {item.backOrderQty} pcs
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${calculateProgress(item.deliveryQty, item.orderQty)}%`,
                            backgroundColor: getProgressColor(item.backOrderQty)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {calculateProgress(item.deliveryQty, item.orderQty).toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.itemFooter}>
                    <Text style={styles.subtotalLabel}>Subtotal</Text>
                    <Text style={styles.itemSubtotal}>{formatPrice(item.subtotal)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.deliverySection}>
              {order.deliveryOrders && order.deliveryOrders.length > 0 ? (
                order.deliveryOrders.map((delivery: DeliveryOrder, index: number) => (
                  <View key={index} style={styles.deliveryCard}>
                    <View style={styles.deliveryHeader}>
                      <View>
                        <Text style={styles.deliveryNo}>{delivery.noDo}</Text>
                        <Text style={styles.deliveryDate}>{formatDate(delivery.tanggal)}</Text>
                      </View>
                      <View style={[styles.deliveryStatusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
                        <Text style={styles.deliveryStatusText}>{delivery.status}</Text>
                      </View>
                    </View>

                    <View style={styles.deliveryItems}>
                      {delivery.items.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.deliveryItem}>
                          <View style={styles.deliveryItemHeader}>
                            <Text style={styles.deliveryPartNumber}>{item.partNumber}</Text>
                            <Text style={styles.deliveryQty}>x{item.qtyDo}</Text>
                          </View>
                          <Text style={styles.deliveryPartName} numberOfLines={1}>
                            {item.partName}
                          </Text>
                          <View style={styles.deliveryItemFooter}>
                            <Text style={styles.deliveryPrice}>{formatPrice(item.price)}</Text>
                            <Text style={styles.deliverySubtotal}>{formatPrice(item.subtotal)}</Text>
                          </View>
                        </View>
                      ))}
                    </View>

                    <View style={styles.deliveryTotal}>
                      <Text style={styles.deliveryTotalLabel}>Total DO</Text>
                      <Text style={styles.deliveryTotalValue}>{formatPrice(delivery.grandTotal)}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyDelivery}>
                  <Image source={getImage('es_no_data.webp')} style={styles.emptyImage} />
                  <Text style={styles.emptyText}>Belum ada pengiriman</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.grandTotal)}</Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Tidak ada data</Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.white,
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
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  infoValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
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
  summarySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  summaryValue: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  backOrderNotice: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  noticeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: '#E65100',
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
  itemCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  partNumber: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  partName: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  qtySection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  qtyLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  qtyValue: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.grayText,
    width: 45,
    textAlign: 'right',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  subtotalLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  itemSubtotal: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  deliverySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  deliveryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  deliveryNo: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  deliveryStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryStatusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  deliveryItems: {
    marginBottom: 12,
  },
  deliveryItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  deliveryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryPartNumber: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  deliveryQty: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  deliveryPartName: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
  },
  deliveryItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryPrice: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  deliverySubtotal: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  deliveryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  deliveryTotalLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
  deliveryTotalValue: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
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

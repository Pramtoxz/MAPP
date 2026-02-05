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
import { orderService, BackOrderResponse, BackOrderItem } from '../../services';

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Memuat back order...</Text>
        </View>
      ) : backOrder ? (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>No. Order</Text>
              <Text style={styles.infoValue}>{backOrder.orderNumber}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Tanggal Order</Text>
              <Text style={styles.infoValue}>{formatDate(backOrder.orderDate)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Total Back Order</Text>
              <Text style={[styles.infoValue, { color: '#FF9800' }]}>
                {backOrder.totalBackOrderQty} pcs
              </Text>
            </View>
          </View>

          <View style={styles.noticeSection}>
            <Image source={getImage('ic_info_badge.png')} style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Barang sedang dalam proses pengiriman. Silahkan hubungi sales untuk informasi lebih lanjut.
            </Text>
          </View>

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Item Back Order</Text>
            
            {backOrder.backOrderItems.length > 0 ? (
              backOrder.backOrderItems.map((item: BackOrderItem, index: number) => (
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
                    <View style={styles.qtyRow}>
                      <Text style={[styles.qtyLabel, { color: '#FF9800' }]}>Back Order:</Text>
                      <Text style={[styles.qtyValue, { color: '#FF9800' }]}>
                        {item.backOrderQty} pcs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusBadge}>
                    <Image source={getImage('ic_waiting_list.png')} style={styles.statusIcon} />
                    <Text style={styles.statusText}>Menunggu Pengiriman</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Image source={getImage('es_done.webp')} style={styles.emptyImage} />
                <Text style={styles.emptyText}>Semua item sudah dikirim</Text>
              </View>
            )}
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
  noticeSection: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
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
  itemsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 8,
  },
  statusIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  statusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: '#FF9800',
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

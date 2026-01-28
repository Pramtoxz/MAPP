import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { useOrderScreen } from './hooks/useOrderScreen';
import { Order } from '../../services';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const {
    orders,
    loading,
    handleOrderPress,
    formatPrice,
    formatDate,
    getStatusColor,
  } = useOrderScreen();

  const [activeTab, setActiveTab] = useState<'history' | 'backorder' | 'fulfillment'>('history');

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.orderType}>{item.orderType}</Text>
      <View style={styles.orderFooter}>
        <View style={styles.dateContainer}>
          <Image source={getImage('ic_calendar_form.png')} style={styles.calendarIcon} />
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
        </View>
        <Text style={styles.orderTotal}>{formatPrice(item.grandTotal)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={getImage('es_no_data.webp')} style={styles.emptyImage} />
      <Text style={styles.emptyText}>Belum ada order</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image source={getImage('bg_honda.webp')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order</Text>
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Total Receipt of Proccess</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_red.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>PO Created</Text>
              <Text style={styles.statValue}>{orders.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_black.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>SO</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_red.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>Packing</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_black.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>Delivery</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              PO History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'backorder' && styles.tabActive]}
            onPress={() => setActiveTab('backorder')}
          >
            <Text style={[styles.tabText, activeTab === 'backorder' && styles.tabTextActive]}>
              Back Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'fulfillment' && styles.tabActive]}
            onPress={() => setActiveTab('fulfillment')}
          >
            <Text style={[styles.tabText, activeTab === 'fulfillment' && styles.tabTextActive]}>
              Fulfillment
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  loadMoreButton: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  loadMoreText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  statsCard: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: 2,
  },
  statValue: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  orderType: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 4,
  },
  orderDate: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  orderTotal: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
});

export default OrderScreen;

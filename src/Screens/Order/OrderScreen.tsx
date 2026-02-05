import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { useOrderScreen, OrderWithDetails } from './hooks/useOrderScreen';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const {
    allOrders,
    loading,
    refreshing,
    handleOrderPress,
    handleRefresh,
    loadOrders,
    getHistoryOrders,
    getBackOrders,
    getFulfillmentOrders,
    formatPrice,
    formatDate,
    getStatusColor,
  } = useOrderScreen();

  const [activeTab, setActiveTab] = useState<'history' | 'backorder' | 'fulfillment'>('history');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const displayedOrders = useMemo(() => {
    switch (activeTab) {
      case 'history':
        return getHistoryOrders();
      case 'backorder':
        return getBackOrders();
      case 'fulfillment':
        return getFulfillmentOrders();
      default:
        return [];
    }
  }, [activeTab, allOrders]);

  const handleApplyFilter = () => {
    loadOrders(startDate, endDate);
    setShowDateFilter(false);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    loadOrders();
    setShowDateFilter(false);
  };

  const handleBackOrderPress = (order: OrderWithDetails) => {
    navigation.navigate('BackOrder', { orderNumber: order.orderNumber });
  };

  const renderOrderItem = ({ item }: { item: OrderWithDetails }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.orderType}>{item.orderType}</Text>
      
      {activeTab === 'backorder' && item.backOrderQty !== undefined && (
        <View style={styles.backOrderInfo}>
          <Image source={getImage('ic_waiting_list.png')} style={styles.infoIcon} />
          <Text style={styles.backOrderInfoText}>
            Back Order: {item.backOrderQty} pcs dari {item.totalQty} pcs
          </Text>
        </View>
      )}

      {activeTab === 'fulfillment' && item.deliveredQty !== undefined && (
        <View style={styles.fulfillmentInfo}>
          <View style={styles.fulfillmentRow}>
            <Text style={styles.fulfillmentLabel}>Total Order:</Text>
            <Text style={styles.fulfillmentValue}>{item.totalQty} pcs</Text>
          </View>
          <View style={styles.fulfillmentRow}>
            <Text style={[styles.fulfillmentLabel, { color: '#4CAF50' }]}>Delivered:</Text>
            <Text style={[styles.fulfillmentValue, { color: '#4CAF50' }]}>
              {item.deliveredQty} pcs
            </Text>
          </View>
          {item.backOrderQty !== undefined && item.backOrderQty > 0 && (
            <View style={styles.fulfillmentRow}>
              <Text style={[styles.fulfillmentLabel, { color: '#FF9800' }]}>Pending:</Text>
              <Text style={[styles.fulfillmentValue, { color: '#FF9800' }]}>
                {item.backOrderQty} pcs
              </Text>
            </View>
          )}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${((item.deliveredQty || 0) / (item.totalQty || 1)) * 100}%`,
                  backgroundColor: item.backOrderQty === 0 ? '#4CAF50' : '#FF9800'
                }
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.orderFooter}>
        <View style={styles.dateContainer}>
          <Image source={getImage('ic_calendar_form.png')} style={styles.calendarIcon} />
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
        </View>
        <Text style={styles.orderTotal}>{formatPrice(item.grandTotal)}</Text>
      </View>
      
      {activeTab === 'history' && item.hasBackOrder && (
        <TouchableOpacity 
          style={styles.backOrderButton}
          onPress={(e) => {
            e.stopPropagation();
            handleBackOrderPress(item);
          }}
        >
          <Image source={getImage('ic_waiting_list.png')} style={styles.backOrderIcon} />
          <Text style={styles.backOrderText}>Lihat Back Order</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    let emptyMessage = 'Belum ada order';
    
    switch (activeTab) {
      case 'backorder':
        emptyMessage = 'Tidak ada back order';
        break;
      case 'fulfillment':
        emptyMessage = 'Tidak ada order yang sudah dikirim';
        break;
    }

    return (
      <View style={styles.emptyContainer}>
        <Image source={getImage('es_no_data.webp')} style={styles.emptyImage} />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image source={getImage('bg_honda.webp')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowDateFilter(true)}
        >
          <Image source={getImage('ic_filter.png')} style={styles.filterIcon} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Total Receipt of Proccess</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_red.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>Total Order</Text>
              <Text style={styles.statValue}>{allOrders.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_black.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>Back Order</Text>
              <Text style={styles.statValue}>{getBackOrders().length}</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_red.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>Delivered</Text>
              <Text style={styles.statValue}>{getFulfillmentOrders().length}</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={getImage('ic_order_bg_black.png')} style={styles.statIcon} />
              <Text style={styles.statLabel}>Approve</Text>
              <Text style={styles.statValue}>
                {allOrders.filter(o => o.status === 'Approve').length}
              </Text>
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
            data={displayedOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>

      <Modal
        visible={showDateFilter}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Tanggal</Text>
              <TouchableOpacity onPress={() => setShowDateFilter(false)}>
                <Image source={getImage('ic_close_popup.png')} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Dari (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.dateInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="2026-01-01"
                placeholderTextColor={colors.grayText}
              />
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Sampai (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.dateInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="2026-12-31"
                placeholderTextColor={colors.grayText}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearFilter}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={handleApplyFilter}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  filterIcon: {
    width: 16,
    height: 16,
    tintColor: colors.white,
    resizeMode: 'contain',
    marginRight: 6,
  },
  filterText: {
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
  backOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 12,
  },
  backOrderIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  backOrderText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: '#FF9800',
  },
  backOrderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  infoIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  backOrderInfoText: {
    flex: 1,
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
    color: '#FF9800',
  },
  fulfillmentInfo: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fulfillmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fulfillmentLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  fulfillmentValue: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  closeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
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

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { useOrderScreen, OrderWithDetails } from './hooks/useOrderScreen';
import { LoadingOverlay } from '../Home/components/LoadingOverlay';
import {
  OrderCard,
  OrderStats,
  OrderTabs,
  DateFilterModal,
  EmptyOrderState,
} from './components';

dayjs.locale('id');

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type TabType = 'all' | 'pending' | 'back_order' | 'completed';

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const {
    allOrders,
    loading,
    refreshing,
    handleOrderPress,
    handleRefresh,
    handleFilterChange,
    formatPrice,
    formatDate,
    getStatusColor,
  } = useOrderScreen();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const displayedOrders = allOrders;

  const handleApplyFilter = () => {
    const startDateStr = dateRange.startDate 
      ? dayjs(dateRange.startDate).format('YYYY-MM-DD') 
      : '';
    const endDateStr = dateRange.endDate 
      ? dayjs(dateRange.endDate).format('YYYY-MM-DD') 
      : '';
    handleFilterChange(activeTab, startDateStr, endDateStr);
    setShowDateFilter(false);
  };

  const handleClearFilter = () => {
    setDateRange({
      startDate: undefined,
      endDate: undefined,
    });
    handleFilterChange(activeTab);
    setShowDateFilter(false);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const startDateStr = dateRange.startDate 
      ? dayjs(dateRange.startDate).format('YYYY-MM-DD') 
      : '';
    const endDateStr = dateRange.endDate 
      ? dayjs(dateRange.endDate).format('YYYY-MM-DD') 
      : '';
    handleFilterChange(tab, startDateStr, endDateStr);
  };

  const onDateRangeChange = (params: any) => {
    setDateRange({
      startDate: params.startDate,
      endDate: params.endDate,
    });
  };

  const renderOrderItem = ({ item }: { item: OrderWithDetails }) => (
    <OrderCard
      order={item}
      onPress={() => handleOrderPress(item)}
      onBackOrderPress={() => navigation.navigate('BackOrder', { orderNumber: item.orderNumber })}
      formatPrice={formatPrice}
      formatDate={formatDate}
      getStatusColor={getStatusColor}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image source={getImage('bg_honda3.png')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowDateFilter(true)}
        >
          <Image source={getImage('ic_date.png')} style={styles.filterIcon} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <OrderStats orders={allOrders} />
        
        <OrderTabs activeTab={activeTab} onTabChange={handleTabChange} />

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
          ListEmptyComponent={<EmptyOrderState activeTab={activeTab} />}
        />
      </View>

      <DateFilterModal
        visible={showDateFilter}
        dateRange={dateRange}
        onClose={() => setShowDateFilter(false)}
        onDateRangeChange={onDateRangeChange}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />

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
    height: 25,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default OrderScreen;

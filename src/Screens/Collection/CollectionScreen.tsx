import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { useCollectionScreen } from './hooks/useCollectionScreen';
import { LoadingOverlay } from '../Home/components';
import { DateFilterModal } from '../Order/components';
import {
  CollectionSummaryCard,
  CollectionTabs,
  InvoiceCard,
  EmptyCollectionState,
} from './components';

dayjs.locale('id');

type TabType = 'outstanding' | 'paid';

const CollectionScreen: React.FC = () => {
  const {
    allInvoices,
    summary,
    loading,
    refreshing,
    handleInvoicePress,
    handleRefresh,
    handleFilterChange,
    formatPrice,
    formatDate,
    getStatusColor,
  } = useCollectionScreen();

  const [activeTab, setActiveTab] = useState<TabType>('outstanding');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (dateRange.startDate && dateRange.endDate) {
      const startDateStr = dayjs(dateRange.startDate).format('YYYY-MM-DD');
      const endDateStr = dayjs(dateRange.endDate).format('YYYY-MM-DD');
      handleFilterChange(tab, startDateStr, endDateStr);
    } else {
      handleFilterChange(tab);
    }
  };

  const handleApplyFilter = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const startDateStr = dayjs(dateRange.startDate).format('YYYY-MM-DD');
      const endDateStr = dayjs(dateRange.endDate).format('YYYY-MM-DD');
      handleFilterChange(activeTab, startDateStr, endDateStr);
    }
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

  const onDateRangeChange = (params: any) => {
    setDateRange({
      startDate: params.startDate,
      endDate: params.endDate,
    });
  };

  const renderInvoiceItem = ({ item }: { item: any }) => (
    <InvoiceCard
      invoice={item}
      onPress={() => handleInvoicePress(item.noFaktur)}
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
        <Text style={styles.headerTitle}>Collection</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={allInvoices}
          renderItem={renderInvoiceItem}
          keyExtractor={(item) => item.noFaktur}
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
          ListHeaderComponent={
            <>
              {summary && (
                <CollectionSummaryCard summary={summary} formatPrice={formatPrice} />
              )}
              <CollectionTabs activeTab={activeTab} onTabChange={handleTabChange} />
              {activeTab === 'paid' && (
                <View style={styles.filterContainer}>
                  <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowDateFilter(true)}
                  >
                    <Image source={getImage('ic_date.png')} style={styles.filterIcon} />
                    <Text style={styles.filterText}>Filter Tanggal</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          }
          ListEmptyComponent={<EmptyCollectionState activeTab={activeTab} />}
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
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterIcon: {
    width: 16,
    height: 25,
    resizeMode: 'contain',
    marginRight: 8,
    tintColor: colors.primary,
  },
  filterText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});

export default CollectionScreen;

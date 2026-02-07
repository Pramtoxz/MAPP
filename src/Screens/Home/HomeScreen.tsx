import React from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { getImage } from '../../assets/images';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import ProductDetailModal from '../../components/parts/ProductDetailModal';
import QuantityModal from '../../components/parts/QuantityModal';
import SearchSuggestions from '../../components/parts/SearchSuggestions';
import FilterModal from '../../components/parts/FilterModal';
import { useHomeScreen } from './hooks/useHomeScreen';
import { colors } from '../../config/colors';
import {
  HomeHeader,
  SearchBar,
  CampaignSection,
  LoadingOverlay,
  ProductGrid,
} from './components';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  StackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    cartCount,
    detailModalVisible,
    quantityModalVisible,
    filterModalVisible,
    selectedProduct,
    products,
    campaigns,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    selectedVehicleType,
    selectedCategory,
    searchSuggestions,
    showSuggestions,
    searchingParts,
    refreshing,
    hasActiveFilters,
    handleProductPress,
    handleAddPress,
    handleAddToCart,
    handleConfirmQuantity,
    handleCloseDetailModal,
    handleCloseQuantityModal,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleSearch,
    handleSelectSuggestion,
    handleClearSearch,
    handleSearchSubmit,
    handleRefresh,
    loadMore,
  } = useHomeScreen();

  const handleEndReached = () => {
    if (hasMore && !loadingMore && !loading) {
      loadMore();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Image
        source={getImage('bg_honda3.png')}
        style={styles.backgroundImage}
      />

      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <HomeHeader
            cartCount={cartCount}
            onCartPress={() => navigation.navigate('Cart')}
          />

          <SearchBar
            searchQuery={searchQuery}
            hasActiveFilters={!!hasActiveFilters}
            onSearchChange={handleSearch}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={handleClearSearch}
            onFilterPress={handleOpenFilter}
          />
        </View>

        {showSuggestions && (
          <SearchSuggestions
            suggestions={searchSuggestions}
            loading={searchingParts}
            onSelect={handleSelectSuggestion}
          />
        )}
      </View>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <ProductGrid
          products={products}
          refreshing={refreshing}
          loadingMore={loadingMore}
          onRefresh={handleRefresh}
          onEndReached={handleEndReached}
          onProductPress={handleProductPress}
          onAddPress={handleAddPress}
          ListHeaderComponent={
            <CampaignSection
              campaigns={campaigns}
              onCampaignPress={(campaignId) => navigation.navigate('CampaignDetail', { campaignId })}
              onSeeMorePress={() => navigation.navigate('CampaignList')}
            />
          }
        />
      )}

      <ProductDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      <QuantityModal
        visible={quantityModalVisible}
        onClose={handleCloseQuantityModal}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={handleCloseFilter}
        selectedVehicleType={selectedVehicleType}
        selectedCategory={selectedCategory}
        onApply={handleApplyFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerWrapper: {
    backgroundColor: 'transparent',
    paddingBottom: 16,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});

export default HomeScreen;

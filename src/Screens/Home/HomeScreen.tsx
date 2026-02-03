import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { getImage } from '../../assets/images';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import ProductCard from '../../components/parts/ProductCard';
import CampaignSlider from '../../components/home/CampaignSlider';
import ProductDetailModal from '../../components/parts/ProductDetailModal';
import QuantityModal from '../../components/parts/QuantityModal';
import SearchSuggestions from '../../components/parts/SearchSuggestions';
import FilterModal from '../../components/parts/FilterModal';
import { useHomeScreen } from './hooks/useHomeScreen';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';

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

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.grayText }}>Loading more...</Text>
      </View>
    );
  };

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
        source={getImage('bg_honda.webp')}
        style={styles.backgroundImage}
      />

      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Image source={getImage('lg_honda.webp')} style={styles.logo} />
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => navigation.navigate('Cart')}
              >
                <Image source={getImage('ic_cart_response.png')} style={styles.cartIcon} />
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Image source={getImage('ic_notification.png')} style={styles.notificationIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Image source={getImage('ic_search.png')} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Parts Number / Parts Name"
              placeholderTextColor="#000"
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearSearch}
              >
                <Image source={getImage('ic_close_rounded.png')} style={styles.clearIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={handleOpenFilter}
            >
              <Image source={getImage('ic_filter.png')} style={styles.filterIcon} />
              {hasActiveFilters && <View style={styles.filterBadge} />}
            </TouchableOpacity>
          </View>
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
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <LottieView
            source={require('../../assets/lottie/rocket2.json')}
            autoPlay
            loop
            style={{ width: 500, height: 300 }}
          />
          <Text style={{ 
            marginTop: 32, 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: colors.primary 
          }}>
            Sedang Menyiapkan
          </Text>
          <Text style={{ 
            marginTop: 8, 
            fontSize: 14, 
            color: colors.grayText 
          }}>
            Mohon Tunggu Sebentar, Ga Bakal Lama Kok...
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          style={{ backgroundColor: colors.white }}
          contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 16, paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={{ marginHorizontal: -8, marginTop: -16 }}>
              <View style={styles.campaignSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Campaign</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('CampaignList')}>
                    <Text style={styles.seeMoreText}>See More &gt;</Text>
                  </TouchableOpacity>
                </View>
                {campaigns.length > 0 ? (
                  <View style={styles.campaignWrapper}>
                    <CampaignSlider
                      campaigns={campaigns}
                      onPress={(campaignId) => navigation.navigate('CampaignDetail', { campaignId })}
                      autoSlide={true}
                      interval={3000}
                    />
                  </View>
                ) : (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
              </View>
            </View>
          }
          columnWrapperStyle={styles.productRow}
          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <ProductCard
                image={item.image}
                partNumber={item.partNumber}
                name={item.name}
                price={item.price}
                isReady={item.isReady}
                onPress={() => handleProductPress(item)}
                onAddPress={() => handleAddPress(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: colors.grayText }}>No parts found</Text>
            </View>
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.bold,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.grayText,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  clearIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  campaignSection: {
    backgroundColor: colors.white,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  seeMoreText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  campaignWrapper: {
    marginBottom: 24,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productWrapper: {
    width: '48%',
    marginBottom: 16,
  },
});

export default HomeScreen;

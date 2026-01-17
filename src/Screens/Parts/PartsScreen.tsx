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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import ProductCard from '../../components/parts/ProductCard';
import CampaignSlider from '../../components/home/CampaignSlider';
import ProductDetailModal from '../../components/parts/ProductDetailModal';
import QuantityModal from '../../components/parts/QuantityModal';
import { usePartsScreen } from './hooks/usePartsScreen';
import { styles } from './styles/styles';
import { colors } from '../../config/colors';

type PartsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const PartsScreen: React.FC = () => {
  const navigation = useNavigation<PartsScreenNavigationProp>();
  const {
    cartCount,
    detailModalVisible,
    quantityModalVisible,
    selectedProduct,
    products,
    campaigns,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    handleProductPress,
    handleAddPress,
    handleAddToCart,
    handleConfirmQuantity,
    handleCloseDetailModal,
    handleCloseQuantityModal,
    handleSearch,
    loadMore,
  } = usePartsScreen();

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

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Back</Text>
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
          />
          <TouchableOpacity style={styles.filterButton}>
            <Image source={getImage('ic_filter.png')} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
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
          loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 16, color: colors.grayText }}>Loading parts...</Text>
            </View>
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: colors.grayText }}>No parts found</Text>
            </View>
          )
        }
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />

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
    </SafeAreaView>
  );
};

export default PartsScreen;

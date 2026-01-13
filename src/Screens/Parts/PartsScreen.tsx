import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import ProductCard from '../../components/parts/ProductCard';
import CampaignCard from '../../components/home/CampaignCard';
import ProductDetailModal from '../../components/parts/ProductDetailModal';
import QuantityModal from '../../components/parts/QuantityModal';

type PartsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const PartsScreen: React.FC = () => {
  const navigation = useNavigation<PartsScreenNavigationProp>();
  const [cartCount, setCartCount] = useState(3);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      partNumber: '17220-K56-N00',
      name: 'Element Cleaner',
      description: 'Air filter element for Honda motorcycles. High quality replacement part.',
      price: 23500,
      isReady: true,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      partNumber: '08CJ-A-K56-N00',
      name: 'Coolant',
      description: 'Premium coolant for Honda motorcycles. Prevents overheating.',
      price: 19500,
      isReady: false,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      partNumber: '17220-K56-N00',
      name: 'Element Cleaner',
      description: 'Air filter element for Honda motorcycles. High quality replacement part.',
      price: 23500,
      isReady: true,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      partNumber: '08CJ-A-K56-N00',
      name: 'Coolant',
      description: 'Premium coolant for Honda motorcycles. Prevents overheating.',
      price: 19500,
      isReady: true,
    },
  ];

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const handleAddPress = (product: any) => {
    setSelectedProduct(product);
    setQuantityModalVisible(true);
  };

  const handleAddToCart = () => {
    setDetailModalVisible(false);
    setSelectedProduct(null);
    setQuantityModalVisible(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    console.log(`Added ${quantity} items to cart`);
    setCartCount(cartCount + quantity);
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              placeholderTextColor={colors.black}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Image source={getImage('ic_filter.png')} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.campaignSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Campaign</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More &gt;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.campaignWrapper}>
            <CampaignCard
              badge="NEW CONTRACT"
              title="Gear Up & Get Rewarded"
              description="Ends Dec 31, 2025 • Target: 85% Reach"
              onPress={() => console.log('Campaign pressed')}
            />
          </View>
        </View>

        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.productRow}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard
                  image={item.image}
                  partNumber={item.partNumber}
                  name={item.name}
                  price={item.price}
                  onPress={() => handleProductPress(item)}
                  onAddPress={() => handleAddPress(item)}
                />
              </View>
            )}
          />
        </View>
        </View>
      </ScrollView>

      <ProductDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      <QuantityModal
        visible={quantityModalVisible}
        onClose={() => setQuantityModalVisible(false)}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
      />
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
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
    flexDirection: 'row',
    gap: 8,
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.black,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
    marginRight: 12,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
  content: {
    backgroundColor: colors.white,
  },
  campaignSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  seeMoreText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  campaignWrapper: {
    paddingHorizontal: 16,
  },
  productsContainer: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productWrapper: {
    width: '48%',
  },
});

export default PartsScreen;

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import ProductCard from '../../components/parts/ProductCard';
import CampaignCard from '../../components/home/CampaignCard';
import ProductDetailModal from '../../components/parts/ProductDetailModal';
import QuantityModal from '../../components/parts/QuantityModal';
import { mockProducts } from './hooks/data';
import { usePartsScreen } from './hooks/usePartsScreen';
import { styles } from './styles/styles';

type PartsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const PartsScreen: React.FC = () => {
  const navigation = useNavigation<PartsScreenNavigationProp>();
  const {
    cartCount,
    detailModalVisible,
    quantityModalVisible,
    selectedProduct,
    handleProductPress,
    handleAddPress,
    handleAddToCart,
    handleConfirmQuantity,
    handleCloseDetailModal,
    handleCloseQuantityModal,
  } = usePartsScreen();

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
              placeholderTextColor="#000"
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
              <TouchableOpacity onPress={() => navigation.navigate('CampaignList')}>
                <Text style={styles.seeMoreText}>See More &gt;</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.campaignWrapper}>
              <CampaignCard
                badge="NEW CONTRACT"
                title="Gear Up & Get Rewarded"
                description="Ends Dec 31, 2025 • Target: 85% Reach"
                onPress={() => navigation.navigate('CampaignDetail', { campaignId: '1' })}
              />
            </View>
          </View>

          <View style={styles.productsContainer}>
            <FlatList
              data={mockProducts}
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

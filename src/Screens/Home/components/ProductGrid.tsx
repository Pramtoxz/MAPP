import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import ProductCard from '../../../components/parts/ProductCard';
import { Part } from '../../../services';
import { colors } from '../../../config/colors';

interface ProductGridProps {
  products: Part[];
  refreshing: boolean;
  loadingMore: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  onProductPress: (product: Part) => void;
  onAddPress: (product: Part) => void;
  ListHeaderComponent?: React.ReactElement;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  refreshing,
  loadingMore,
  onRefresh,
  onEndReached,
  onProductPress,
  onAddPress,
  ListHeaderComponent,
}) => {
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No parts found</Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={ListHeaderComponent}
      columnWrapperStyle={styles.productRow}
      renderItem={({ item }) => (
        <View style={styles.productWrapper}>
          <ProductCard
            image={item.image}
            partNumber={item.partNumber}
            name={item.name}
            price={item.price}
            isReady={item.isReady}
            onPress={() => onProductPress(item)}
            onAddPress={() => onAddPress(item)}
          />
        </View>
      )}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    color: colors.grayText,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.grayText,
  },
});

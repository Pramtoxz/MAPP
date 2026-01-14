import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../../../components/parts/ProductCard';
import { Product } from '../hooks/data';

interface ProductListProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onAddPress: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductPress,
  onAddPress,
}) => {
  return (
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
              onPress={() => onProductPress(item)}
              onAddPress={() => onAddPress(item)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ProductList;

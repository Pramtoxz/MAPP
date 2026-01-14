import { useState } from 'react';
import { Product } from './data';

export const usePartsScreen = () => {
  const [cartCount, setCartCount] = useState(3);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const handleAddPress = (product: Product) => {
    setSelectedProduct(product);
    setQuantityModalVisible(true);
  };

  const handleAddToCart = () => {
    setDetailModalVisible(false);
    setQuantityModalVisible(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    console.log(`Added ${quantity} items to cart`);
    setCartCount(cartCount + quantity);
    setSelectedProduct(null);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };

  const handleCloseQuantityModal = () => {
    setQuantityModalVisible(false);
  };

  return {
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
  };
};

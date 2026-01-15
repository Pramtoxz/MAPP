import { useState, useEffect } from 'react';
import { partsService, cartService, campaignService, Part, Campaign } from '../../../services';

export const usePartsScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Part | null>(null);
  const [products, setProducts] = useState<Part[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadParts();
    loadCartCount();
    loadCampaigns();
  }, []);

  const loadParts = async () => {
    setLoading(true);
    const result = await partsService.getPartsList({ limit: 20 });
    setLoading(false);

    if (result.success && result.data) {
      setProducts(result.data.items);
    }
  };

  const loadCartCount = async () => {
    const result = await cartService.getCart();
    if (result.success && result.data) {
      setCartCount(result.data.summary.totalItems);
    }
  };

  const loadCampaigns = async () => {
    const result = await campaignService.getCampaignList();
    if (result.success && result.data) {
      setCampaigns(result.data);
    }
  };

  const handleProductPress = (product: Part) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const handleAddPress = (product: Part) => {
    setSelectedProduct(product);
    setQuantityModalVisible(true);
  };

  const handleAddToCart = () => {
    setDetailModalVisible(false);
    setQuantityModalVisible(true);
  };

  const handleConfirmQuantity = async (quantity: number) => {
    if (!selectedProduct) return;

    const result = await cartService.addToCart({
      partId: selectedProduct.id,
      quantity,
    });

    if (result.success) {
      await loadCartCount();
      setSelectedProduct(null);
    } else {
      console.error('Failed to add to cart:', result.error);
    }
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
    products,
    campaigns,
    loading,
    handleProductPress,
    handleAddPress,
    handleAddToCart,
    handleConfirmQuantity,
    handleCloseDetailModal,
    handleCloseQuantityModal,
    loadParts,
  };
};

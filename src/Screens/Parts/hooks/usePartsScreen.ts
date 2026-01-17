import { useState, useEffect, useCallback } from 'react';
import { partsService, cartService, campaignService, Part, Campaign } from '../../../services';

export const usePartsScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Part | null>(null);
  const [products, setProducts] = useState<Part[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  useEffect(() => {
    loadParts(true);
    loadCartCount();
    loadCampaigns();
  }, []);

  const loadParts = async (reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setCurrentPage(1);
      setProducts([]);
    } else {
      setLoadingMore(true);
    }

    const page = reset ? 1 : currentPage;
    const result = await partsService.getPartsList({
      page,
      limit: 20,
      search: searchQuery || undefined,
      category: selectedCategory,
      sortBy: 'nm_part',
      order: 'asc',
    });

    setLoading(false);
    setLoadingMore(false);

    if (result.success && result.data) {
      if (reset) {
        setProducts(result.data.items);
      } else {
        setProducts(prev => [...prev, ...result.data!.items]);
      }
      setHasMore(result.data.pagination.hasMore);
      setCurrentPage(result.data.pagination.currentPage);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setCurrentPage(prev => prev + 1);
      loadParts(false);
    }
  }, [loadingMore, hasMore, currentPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setTimeout(() => {
      loadParts(true);
    }, 500);
  }, []);

  const handleCategoryFilter = useCallback((category?: string) => {
    setSelectedCategory(category);
    loadParts(true);
  }, []);

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

  const handleProductPress = async (product: Part) => {
    // Load detail with stock info
    const result = await partsService.getPartDetail(product.partNumber);
    if (result.success && result.data) {
      setSelectedProduct(result.data);
      setDetailModalVisible(true);
    }
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
    handleCategoryFilter,
    loadMore,
    loadParts,
  };
};

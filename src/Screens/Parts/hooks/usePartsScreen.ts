import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { partsService, cartService, campaignService, Part, Campaign } from '../../../services';

export const usePartsScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Part | null>(null);
  const [products, setProducts] = useState<Part[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchSuggestions, setSearchSuggestions] = useState<Part[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingParts, setSearchingParts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadParts(true);
    loadCartCount();
    loadCampaigns();
  }, []);

  // Reload cart count setiap kali screen di-focus
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

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
      vehicle_type: selectedVehicleType,
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
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is empty, hide suggestions and load all parts
    if (!query.trim()) {
      setShowSuggestions(false);
      setSearchSuggestions([]);
      loadParts(true);
      return;
    }

    // Show suggestions after 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchingParts(true);
      const result = await partsService.getPartsList({
        page: 1,
        limit: 10,
        search: query,
      });
      
      setSearchingParts(false);
      if (result.success && result.data) {
        setSearchSuggestions(result.data.items);
        setShowSuggestions(result.data.items.length > 0);
      }
    }, 300);
  }, []);

  const handleSelectSuggestion = useCallback((part: Part) => {
    setSearchQuery(part.partNumber);
    setShowSuggestions(false);
    handleProductPress(part);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSearchSuggestions([]);
    loadParts(true);
  }, []);

  const handleOpenFilter = useCallback(() => {
    setFilterModalVisible(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setFilterModalVisible(false);
  }, []);

  const handleApplyFilter = useCallback((vehicleType?: string, category?: string) => {
    setSelectedVehicleType(vehicleType);
    setSelectedCategory(category);
    // Auto refresh parts list dengan filter baru
    setCurrentPage(1);
    setProducts([]);
    setLoading(true);
    
    // Load parts dengan filter baru
    const loadFilteredParts = async () => {
      const result = await partsService.getPartsList({
        page: 1,
        limit: 20,
        search: searchQuery || undefined,
        category: category,
        vehicle_type: vehicleType,
        sortBy: 'nm_part',
        order: 'asc',
      });

      setLoading(false);

      if (result.success && result.data) {
        setProducts(result.data.items);
        setHasMore(result.data.pagination.hasMore);
        setCurrentPage(result.data.pagination.currentPage);
      }
    };

    loadFilteredParts();
  }, [searchQuery]);

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

  const handleAddPress = async (product: Part) => {
    // Load detail with stock info
    const result = await partsService.getPartDetail(product.partNumber);
    if (result.success && result.data) {
      setSelectedProduct(result.data);
      
      // Jika stock tidak ready, tampilkan konfirmasi dulu
      if (!result.data.isReady) {
        setConfirmationVisible(true);
      } else {
        setQuantityModalVisible(true);
      }
    }
  };

  const handleAddToCart = () => {
    setDetailModalVisible(false);
    
    // Jika stock tidak ready, tampilkan konfirmasi dulu
    if (selectedProduct && !selectedProduct.isReady) {
      setConfirmationVisible(true);
    } else {
      setQuantityModalVisible(true);
    }
  };

  const handleConfirmOutOfStock = () => {
    setConfirmationVisible(false);
    setQuantityModalVisible(true);
  };

  const handleCancelOutOfStock = () => {
    setConfirmationVisible(false);
    setSelectedProduct(null);
  };

  const handleConfirmQuantity = async (quantity: number) => {
    if (!selectedProduct) return;

    const result = await cartService.addToCart({
      partId: selectedProduct.id,
      partNumber: selectedProduct.partNumber,
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadParts(true),
      loadCartCount(),
      loadCampaigns(),
    ]);
    setRefreshing(false);
  };

  const hasActiveFilters = selectedVehicleType || selectedCategory;

  return {
    cartCount,
    detailModalVisible,
    quantityModalVisible,
    filterModalVisible,
    confirmationVisible,
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
    handleConfirmOutOfStock,
    handleCancelOutOfStock,
    handleSearch,
    handleSelectSuggestion,
    handleClearSearch,
    handleRefresh,
    loadMore,
    loadParts,
  };
};

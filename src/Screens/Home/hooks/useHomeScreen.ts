import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { partsService, cartService, campaignService, Part, Campaign } from '../../../services';

export const useHomeScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadParts(true);
    loadCartCount();
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload cart count setiap kali screen di-focus
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  const loadParts = useCallback(async (reset: boolean = false) => {
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
  }, [currentPage, searchQuery, selectedCategory, selectedVehicleType]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setCurrentPage(prev => prev + 1);
      loadParts(false);
    }
  }, [loadingMore, hasMore, loadParts]);

  const handleProductPress = useCallback(async (product: Part) => {
    const result = await partsService.getPartDetail(product.partNumber);
    if (result.success && result.data) {
      setSelectedProduct(result.data);
      setDetailModalVisible(true);
    }
  }, []);

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
  }, [loadParts]);

  const handleSelectSuggestion = useCallback((part: Part) => {
    setSearchQuery(part.partNumber);
    setShowSuggestions(false);
    handleProductPress(part);
  }, [handleProductPress]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSearchSuggestions([]);
    loadParts(true);
  }, [loadParts]);

  const handleSearchSubmit = useCallback(() => {
    // Hide suggestions
    setShowSuggestions(false);
    setSearchSuggestions([]);
    
    // Load parts with current search query
    loadParts(true);
  }, [loadParts]);

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

  const handleAddPress = async (product: Part) => {
    // Prevent opening quantity modal if part is discontinued
    if (product.isDiscontinued) {
      return;
    }
    
    const result = await partsService.getPartDetail(product.partNumber);
    if (result.success && result.data) {
      setSelectedProduct(result.data);
      setQuantityModalVisible(true);
    }
  };

  const handleAddToCart = () => {
    // Prevent opening quantity modal if part is discontinued
    if (selectedProduct?.isDiscontinued) {
      return;
    }
    setDetailModalVisible(false);
    setQuantityModalVisible(true);
  };

  const handleConfirmQuantity = async (quantity: number) => {
    if (!selectedProduct) return;

    // Check if part is discontinued
    if (selectedProduct.isDiscontinued) {
      // Show error - part is discontinued
      return;
    }

    const result = await cartService.addToCart({
      partId: selectedProduct.id,
      partNumber: selectedProduct.partNumber,
      quantity,
    });

    if (result.success) {
      await loadCartCount();
      setSelectedProduct(null);
    } else {
      setQuantityModalVisible(false);
      setAlertMessage(result.error?.message || 'Gagal menambahkan item ke keranjang.');
      setAlertVisible(true);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };

  const handleCloseQuantityModal = () => {
    setQuantityModalVisible(false);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
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
    alertVisible,
    alertMessage,
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
    handleCloseAlert,
    loadMore,
    loadParts,
  };
};

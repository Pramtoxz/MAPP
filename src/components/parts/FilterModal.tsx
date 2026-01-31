import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Animated,
  Image,
} from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { VehicleType, Category } from '../../services/parts';
import { partsService } from '../../services';
import { getImage } from '../../assets/images';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedVehicleType?: string;
  selectedCategory?: string;
  onApply: (vehicleType?: string, category?: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedVehicleType,
  selectedCategory,
  onApply,
}) => {
  const [tempVehicleType, setTempVehicleType] = useState<VehicleType | undefined>();
  const [tempCategory, setTempCategory] = useState<Category | undefined>();
  
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  
  const [vehicleResults, setVehicleResults] = useState<VehicleType[]>([]);
  const [categoryResults, setCategoryResults] = useState<Category[]>([]);
  
  const [searchingVehicles, setSearchingVehicles] = useState(false);
  const [searchingCategories, setSearchingCategories] = useState(false);
  
  const vehicleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const categoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setVehicleSearchQuery('');
      setCategorySearchQuery('');
      setVehicleResults([]);
      setCategoryResults([]);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleVehicleSearch = (query: string) => {
    setVehicleSearchQuery(query);
    
    if (vehicleTimeoutRef.current) {
      clearTimeout(vehicleTimeoutRef.current);
    }

    if (query.length < 2) {
      setVehicleResults([]);
      return;
    }

    vehicleTimeoutRef.current = setTimeout(async () => {
      setSearchingVehicles(true);
      const result = await partsService.getVehicleTypes(query);
      setSearchingVehicles(false);
      
      if (result.success && result.data) {
        setVehicleResults(result.data);
      }
    }, 300);
  };

  const handleCategorySearch = (query: string) => {
    setCategorySearchQuery(query);
    
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }

    if (query.length < 2) {
      setCategoryResults([]);
      return;
    }

    categoryTimeoutRef.current = setTimeout(async () => {
      setSearchingCategories(true);
      const result = await partsService.getCategories(query);
      setSearchingCategories(false);
      
      if (result.success && result.data) {
        setCategoryResults(result.data);
      }
    }, 300);
  };

  const handleSelectVehicle = (vehicle: VehicleType) => {
    setTempVehicleType(vehicle);
    setVehicleSearchQuery('');
    setVehicleResults([]);
  };

  const handleSelectCategory = (category: Category) => {
    setTempCategory(category);
    setCategorySearchQuery('');
    setCategoryResults([]);
  };

  const handleApply = () => {
    onApply(tempVehicleType?.code, tempCategory?.code);
    handleClose();
  };

  const handleReset = () => {
    setTempVehicleType(undefined);
    setTempCategory(undefined);
    setVehicleSearchQuery('');
    setCategorySearchQuery('');
    setVehicleResults([]);
    setCategoryResults([]);
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        <Animated.View 
          style={[
            styles.container,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image source={getImage('ic_filter.png')} style={styles.headerIcon} />
              <Text style={styles.title}>Filter Parts</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
          >
            {/* Vehicle Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipe Motor</Text>
              
              {tempVehicleType ? (
                <View style={styles.selectedChip}>
                  <View style={styles.selectedChipContent}>
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                    <Text style={styles.selectedChipText}>{tempVehicleType.name}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setTempVehicleType(undefined)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.searchBox}>
                    <Image source={getImage('ic_search.png')} style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Cari tipe motor (contoh: beat, vario)"
                      placeholderTextColor={colors.grayHint}
                      value={vehicleSearchQuery}
                      onChangeText={handleVehicleSearch}
                    />
                    {searchingVehicles && (
                      <ActivityIndicator size="small" color={colors.primary} />
                    )}
                  </View>

                  {vehicleSearchQuery.length > 0 && vehicleSearchQuery.length < 2 && (
                    <Text style={styles.hintText}>Ketik minimal 2 karakter</Text>
                  )}

                  {vehicleResults.length > 0 && (
                    <View style={styles.resultsCard}>
                      <Text style={styles.resultsCount}>{vehicleResults.length} hasil ditemukan</Text>
                      {vehicleResults.map((vehicle, index) => (
                        <TouchableOpacity
                          key={`vehicle-${vehicle.code}-${index}`}
                          style={styles.resultItem}
                          onPress={() => handleSelectVehicle(vehicle)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.resultItemContent}>
                            <View style={styles.resultDot} />
                            <Text style={styles.resultItemText}>{vehicle.name}</Text>
                          </View>
                          <Text style={styles.resultArrow}>›</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {vehicleSearchQuery.length >= 2 && !searchingVehicles && vehicleResults.length === 0 && (
                    <View style={styles.emptyState}>
                      <Image source={getImage('es_no_data.webp')} style={styles.emptyStateImage} />
                      <Text style={styles.emptyStateTitle}>Tidak ditemukan</Text>
                      <Text style={styles.emptyStateDesc}>Coba kata kunci lain</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Category Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kelompok Part</Text>
              
              {tempCategory ? (
                <View style={styles.selectedChip}>
                  <View style={styles.selectedChipContent}>
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                    <Text style={styles.selectedChipText}>{tempCategory.name}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setTempCategory(undefined)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.searchBox}>
                    <Image source={getImage('ic_search.png')} style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Cari kelompok part (contoh: shock, oli)"
                      placeholderTextColor={colors.grayHint}
                      value={categorySearchQuery}
                      onChangeText={handleCategorySearch}
                    />
                    {searchingCategories && (
                      <ActivityIndicator size="small" color={colors.primary} />
                    )}
                  </View>

                  {categorySearchQuery.length > 0 && categorySearchQuery.length < 2 && (
                    <Text style={styles.hintText}>Ketik minimal 2 karakter</Text>
                  )}

                  {categoryResults.length > 0 && (
                    <View style={styles.resultsCard}>
                      <Text style={styles.resultsCount}>{categoryResults.length} hasil ditemukan</Text>
                      {categoryResults.map((category, index) => (
                        <TouchableOpacity
                          key={`category-${category.code}-${index}`}
                          style={styles.resultItem}
                          onPress={() => handleSelectCategory(category)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.resultItemContent}>
                            <View style={styles.resultDot} />
                            <Text style={styles.resultItemText}>{category.name}</Text>
                          </View>
                          <Text style={styles.resultArrow}>›</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {categorySearchQuery.length >= 2 && !searchingCategories && categoryResults.length === 0 && (
                    <View style={styles.emptyState}>
                      <Image source={getImage('es_no_data.webp')} style={styles.emptyStateImage} />
                      <Text style={styles.emptyStateTitle}>Tidak ditemukan</Text>
                      <Text style={styles.emptyStateDesc}>Coba kata kunci lain</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButton,
                (!tempVehicleType && !tempCategory) && styles.applyButtonDisabled
              ]}
              onPress={handleApply}
              activeOpacity={0.8}
              disabled={!tempVehicleType && !tempCategory}
            >
              <Text style={styles.applyButtonText}>
                {tempVehicleType || tempCategory ? 'Terapkan Filter' : 'Pilih Filter'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: colors.grayText,
    fontFamily: fonts.semibold,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: colors.grayText,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  hintText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayHint,
    marginTop: 8,
    marginLeft: 4,
  },
  resultsCard: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  resultsCount: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF5F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  resultItemText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
    flex: 1,
  },
  resultArrow: {
    fontSize: 24,
    color: colors.grayHint,
    marginLeft: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMark: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  selectedChipText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
    flex: 1,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 4,
  },
  emptyStateDesc: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayHint,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
    backgroundColor: colors.white,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  resetButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonDisabled: {
    backgroundColor: colors.grayBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  applyButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default FilterModal;

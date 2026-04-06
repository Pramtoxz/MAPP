import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { collectionService, Invoice, CollectionSummary } from '../../../services';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type FilterType = 'outstanding' | 'paid';

export const useCollectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<CollectionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('outstanding');

  const loadCollections = async (dari?: string, sampai?: string, filter?: FilterType) => {
    setLoading(true);
    try {
      const apiFilter = filter || currentFilter;
      const result = await collectionService.getCollectionsList({
        dari,
        sampai,
        filter: apiFilter as 'outstanding' | 'paid',
      });

      if (result.success && result.data) {
        setSummary(result.data.summary);
        
        if (apiFilter === 'outstanding') {
          setAllInvoices(result.data.outstanding);
        } else {
          setAllInvoices(result.data.paid);
        }
      } else {
        console.error('Failed to load collections:', result.error);
        setAllInvoices([]);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      setAllInvoices([]);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCollections(undefined, undefined, currentFilter);
    setRefreshing(false);
  };

  const handleFilterChange = (filter: FilterType, dari?: string, sampai?: string) => {
    setCurrentFilter(filter);
    loadCollections(dari, sampai, filter);
  };

  const handleInvoicePress = (noFaktur: string) => {
    navigation.navigate('InvoiceDetail', { noFaktur });
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Outstanding':
        return '#FF9800';
      case 'Paid':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  return {
    allInvoices,
    summary,
    loading,
    refreshing,
    currentFilter,
    handleInvoicePress,
    handleRefresh,
    handleFilterChange,
    loadCollections,
    formatPrice,
    formatDate,
    getStatusColor,
  };
};

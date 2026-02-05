import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { orderService, Order, OrderDetail } from '../../../services';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export interface OrderWithDetails extends Order {
  hasBackOrder?: boolean;
  backOrderQty?: number;
  deliveredQty?: number;
  totalQty?: number;
}

type FilterType = 'all' | 'pending' | 'completed' | 'back_order';

export const useOrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [allOrders, setAllOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (dari?: string, sampai?: string, filter?: FilterType) => {
    setLoading(true);
    try {
      const apiFilter = filter && filter !== 'all' ? filter : undefined;
      const result = await orderService.getOrderList({ 
        dari, 
        sampai,
        filter: apiFilter as 'pending' | 'completed' | 'back_order' | undefined
      });
      
      if (result.success && result.data) {
        const orders = (result.data.items || []).map(order => ({
          ...order,
          hasBackOrder: order.fulfillment ? order.fulfillment.totalQtyBackOrder > 0 : false,
          backOrderQty: order.fulfillment?.totalQtyBackOrder || 0,
          deliveredQty: order.fulfillment?.totalQtyDelivered || 0,
          totalQty: order.fulfillment?.totalQtyOrder || 0,
        }));
        setAllOrders(orders);
      } else {
        console.error('Failed to load orders:', result.error);
        setAllOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setAllOrders([]);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders(undefined, undefined, currentFilter);
    setRefreshing(false);
  };

  const handleFilterChange = (filter: FilterType, dari?: string, sampai?: string) => {
    setCurrentFilter(filter);
    loadOrders(dari, sampai, filter);
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderNumber: order.orderNumber });
  };

  const getHistoryOrders = () => {
    return allOrders;
  };

  const getBackOrders = () => {
    return allOrders.filter(order => order.hasBackOrder);
  };

  const getFulfillmentOrders = () => {
    return allOrders.filter(order => 
      order.deliveredQty !== undefined && order.deliveredQty > 0
    );
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
      case 'Waiting For Approval':
        return '#FF9800';
      case 'Approve':
        return '#4CAF50';
      case 'Reject':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return {
    allOrders,
    loading,
    refreshing,
    currentFilter,
    handleOrderPress,
    handleRefresh,
    handleFilterChange,
    loadOrders,
    getHistoryOrders,
    getBackOrders,
    getFulfillmentOrders,
    formatPrice,
    formatDate,
    getStatusColor,
  };
};

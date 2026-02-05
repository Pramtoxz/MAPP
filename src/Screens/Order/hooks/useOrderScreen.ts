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

export const useOrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [allOrders, setAllOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (dari?: string, sampai?: string) => {
    setLoading(true);
    try {
      const result = await orderService.getOrderList({ dari, sampai });
      if (result.success && result.data) {
        const ordersWithDetails = await Promise.all(
          (result.data.items || []).map(async (order) => {
            try {
              const detailResult = await orderService.getOrderDetail(order.orderNumber);
              if (detailResult.success && detailResult.data) {
                const detail = detailResult.data;
                return {
                  ...order,
                  hasBackOrder: detail.summary?.totalQtyBackOrder > 0,
                  backOrderQty: detail.summary?.totalQtyBackOrder || 0,
                  deliveredQty: detail.summary?.totalQtyDelivered || 0,
                  totalQty: detail.summary?.totalQtyOrder || 0,
                };
              }
            } catch (error) {
              console.error(`Error loading detail for ${order.orderNumber}:`, error);
            }
            return order;
          })
        );
        setAllOrders(ordersWithDetails);
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
    await loadOrders();
    setRefreshing(false);
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
    handleOrderPress,
    handleRefresh,
    loadOrders,
    getHistoryOrders,
    getBackOrders,
    getFulfillmentOrders,
    formatPrice,
    formatDate,
    getStatusColor,
  };
};

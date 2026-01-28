import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { orderService, Order } from '../../../services';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const useOrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (dari?: string, sampai?: string) => {
    setLoading(true);
    try {
      const result = await orderService.getOrderList({ dari, sampai });
      if (result.success && result.data) {
        setOrders(result.data.items || []);
      } else {
        console.error('Failed to load orders:', result.error);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderNumber: order.orderNumber });
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
      case 'Approved':
        return '#4CAF50';
      case 'Rejected':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return {
    orders,
    loading,
    handleOrderPress,
    loadOrders,
    formatPrice,
    formatDate,
    getStatusColor,
  };
};

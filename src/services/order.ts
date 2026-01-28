import { apiService } from './api';

export interface OrderItem {
  partNumber: string;
  partName: string;
  qty: string | number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: string;
  orderDate: string;
  grandTotal: number;
  status: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

interface OrderListResponse {
  items: Order[];
}

interface OrderListParams {
  dari?: string;
  sampai?: string;
}

class OrderService {
  async getOrderList(params?: OrderListParams) {
    const queryParams = new URLSearchParams();

    if (params?.dari) queryParams.append('dari', params.dari);
    if (params?.sampai) queryParams.append('sampai', params.sampai);

    const query = queryParams.toString();
    const endpoint = query ? `/orders?${query}` : '/orders';

    return apiService.get<OrderListResponse>(endpoint);
  }

  async getOrderDetail(noSo: string) {
    return apiService.get<OrderDetail>(`/orders/${noSo}`);
  }
}

export const orderService = new OrderService();

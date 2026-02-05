import { apiService } from './api';

export interface OrderItem {
  partNumber: string;
  partName: string;
  image?: string;
  orderQty: number;
  deliveryQty: number;
  backOrderQty: number;
  price: number;
  subtotal: number;
}

export interface DeliveryOrderItem {
  partNumber: string;
  partName: string;
  qtyDo: number;
  price: number;
  diskon: number;
  subtotal: number;
}

export interface DeliveryOrder {
  noDo: string;
  tanggal: string;
  status: string;
  grandTotal: number;
  items: DeliveryOrderItem[];
}

export interface OrderSummary {
  totalItems: number;
  totalQtyOrder: number;
  totalQtyDelivered: number;
  totalQtyBackOrder: number;
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
  summary: OrderSummary;
  items: OrderItem[];
  deliveryOrders: DeliveryOrder[];
}

export interface BackOrderItem {
  partNumber: string;
  partName: string;
  image?: string;
  orderQty: number;
  deliveryQty: number;
  backOrderQty: number;
  price: number;
}

export interface BackOrderResponse {
  orderNumber: string;
  orderDate: string;
  totalBackOrderQty: number;
  backOrderItems: BackOrderItem[];
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

  async getBackOrderList(noSo: string) {
    return apiService.get<BackOrderResponse>(`/orders/${noSo}/back-order`);
  }
}

export const orderService = new OrderService();

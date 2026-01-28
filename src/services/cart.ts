import { apiService } from './api';

export interface CartItem {
  id: string;
  partId: string;
  partNumber: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  isReady: boolean;
}

interface CartResponse {
  items: CartItem[];
  summary: {
    totalItems: number;
    totalPrice: number;
  };
}

interface AddToCartRequest {
  partId: string | number;
  partNumber: string;
  quantity: number;
}

interface UpdateCartRequest {
  quantity: number;
}

interface CheckoutResponse {
  no_so: string;
  jenis_so: string;
  grand_total: number;
  status: string;
}

class CartService {
  async getCart() {
    return apiService.get<CartResponse>('/cart');
  }

  async addToCart(data: AddToCartRequest) {
    return apiService.post<{ cartItemId: string; totalItems: number }>('/cart/add', data);
  }

  async updateCartItem(itemId: string, data: UpdateCartRequest) {
    return apiService.put(`/cart/${itemId}`, data);
  }

  async removeFromCart(itemId: string) {
    return apiService.delete(`/cart/${itemId}`);
  }

  async clearCart() {
    return apiService.delete('/cart/clear');
  }

  async checkout() {
    return apiService.post<CheckoutResponse>('/cart/checkout');
  }
}

export const cartService = new CartService();

import { useState, useEffect } from 'react';
import { cartService, CartItem } from '../../../services';

export const useCartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const result = await cartService.getCart();
      if (result.success && result.data) {
        setCartItems(result.data.items || []);
      } else {
        console.error('Failed to load cart:', result.error);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
    setLoading(false);
  };

  const handleMinus = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      const result = await cartService.updateCartItem(id, { quantity: newQuantity });
      if (result.success) {
        setCartItems(cartItems.map(i => 
          i.id === id ? { ...i, quantity: newQuantity, subtotal: i.price * newQuantity } : i
        ));
      } else {
        console.error('Failed to update cart:', result.error);
      }
    }
  };

  const handlePlus = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity + 1;
      const result = await cartService.updateCartItem(id, { quantity: newQuantity });
      if (result.success) {
        setCartItems(cartItems.map(i => 
          i.id === id ? { ...i, quantity: newQuantity, subtotal: i.price * newQuantity } : i
        ));
      } else {
        console.error('Failed to update cart:', result.error);
      }
    }
  };

  const handleQuantityChange = async (id: string, text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const quantity = parseInt(numericValue) || 1;
    const result = await cartService.updateCartItem(id, { quantity });
    if (result.success) {
      const item = cartItems.find(i => i.id === id);
      if (item) {
        setCartItems(cartItems.map(i => 
          i.id === id ? { ...i, quantity, subtotal: i.price * quantity } : i
        ));
      }
    } else {
      console.error('Failed to update cart:', result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await cartService.removeFromCart(id);
    if (result.success) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      console.error('Failed to delete item:', result.error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return {
    cartItems,
    loading,
    handleMinus,
    handlePlus,
    handleQuantityChange,
    handleDelete,
    calculateTotal,
    formatPrice,
  };
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const cartStore = (set: any, get: any) => ({
  items: [],

  addItem: (product: Product, variant?: ProductVariant, quantity = 1) => {
    set((state: CartStore) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant?.id === variant?.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
        return { items: newItems };
      }

      return {
        items: [...state.items, { product, variant, quantity }],
      };
    });
  },

  removeItem: (productId: string, variantId?: string) => {
    set((state: CartStore) => ({
      items: state.items.filter(
        (item) =>
          !(item.product.id === productId && item.variant?.id === variantId)
      ),
    }));
  },

  updateQuantity: (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      get().removeItem(productId, variantId);
      return;
    }

    set((state: CartStore) => ({
      items: state.items.map((item) =>
        item.product.id === productId && item.variant?.id === variantId
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    const items = get().items;
    return items.reduce((total: number, item: CartItem) => {
      const price = item.variant?.price || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    const items = get().items;
    return items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
  },
});

export const useCartStore = create<CartStore>()(
  typeof window !== 'undefined'
    ? persist(cartStore, { name: 'cart-storage' })
    : cartStore
);

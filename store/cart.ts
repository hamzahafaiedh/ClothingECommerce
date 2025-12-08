import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, AppliedDiscount } from '@/types';

interface CartStore {
  items: CartItem[];
  appliedDiscount: AppliedDiscount | null;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  hasProductWithDiscount: () => boolean;
}

const cartStore = (set: any, get: any) => ({
  items: [],
  appliedDiscount: null,

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

  clearCart: () => set({ items: [], appliedDiscount: null }),

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

  applyDiscount: (discount: AppliedDiscount) => set({ appliedDiscount: discount }),

  removeDiscount: () => set({ appliedDiscount: null }),

  hasProductWithDiscount: () => {
    const items = get().items;
    return items.some((item: CartItem) => item.product.discount);
  },
});

const createCartStore = () => {
  if (typeof window === 'undefined') {
    // Server-side: create a basic store without persistence
    return create<CartStore>()(cartStore);
  }

  // Client-side: create a store with persistence
  return create<CartStore>()(
    persist(cartStore, {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    })
  );
};

export const useCartStore = createCartStore();

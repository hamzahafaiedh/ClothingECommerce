import { Product, Discount } from '@/types';

export function isDiscountValid(discount: Discount): boolean {
  if (!discount.active) return false;

  const now = new Date();

  if (discount.starts_at) {
    const startsAt = new Date(discount.starts_at);
    if (now < startsAt) return false;
  }

  if (discount.expires_at) {
    const expiresAt = new Date(discount.expires_at);
    if (now > expiresAt) return false;
  }

  return true;
}

export function calculateDiscount(product: Product): {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  hasDiscount: boolean;
  discount?: Discount;
} {
  const originalPrice = product.price;

  if (!product.discount || !isDiscountValid(product.discount)) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      hasDiscount: false,
    };
  }

  const discount = product.discount;
  let discountAmount = 0;

  if (discount.discount_type === 'percentage') {
    discountAmount = (originalPrice * discount.value) / 100;
  } else if (discount.discount_type === 'fixed') {
    discountAmount = discount.value;
  }

  const discountedPrice = Math.max(0, originalPrice - discountAmount);

  return {
    originalPrice,
    discountedPrice,
    discountAmount,
    hasDiscount: true,
    discount,
  };
}

export function formatPrice(price: number, currency: string = 'TND'): string {
  return `${price.toFixed(2)} ${currency}`;
}

export function calculateDiscountCodeAmount(
  subtotal: number,
  discount: Discount
): number {
  if (!isDiscountValid(discount)) return 0;

  if (discount.discount_type === 'percentage') {
    return (subtotal * discount.value) / 100;
  } else if (discount.discount_type === 'fixed') {
    return Math.min(discount.value, subtotal);
  }

  return 0;
}

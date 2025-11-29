'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Discount } from '@/types';
import { calculateDiscountCodeAmount } from '@/lib/pricing';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, appliedDiscount, applyDiscount, removeDiscount } = useCartStore();
  const [discountCode, setDiscountCode] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const total = getTotal();
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const subtotalAfterDiscount = total - discountAmount;
  const shippingCost = subtotalAfterDiscount > 100 ? 0 : 7;
  const grandTotal = subtotalAfterDiscount + shippingCost;
  const currency = items[0]?.product.currency || 'TND';

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setApplyingDiscount(true);
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('code', discountCode.trim())
        .eq('active', true)
        .single();

      if (error || !data) {
        toast.error('Invalid discount code');
        return;
      }

      const discount = data as Discount;
      const now = new Date();

      if (discount.starts_at && new Date(discount.starts_at) > now) {
        toast.error('This discount is not yet active');
        return;
      }

      if (discount.expires_at && new Date(discount.expires_at) < now) {
        toast.error('This discount has expired');
        return;
      }

      const amount = calculateDiscountCodeAmount(total, discount);
      applyDiscount({ code: discountCode.trim(), discount, amount });
      toast.success(`Discount applied: ${discount.discount_type === 'percentage' ? `${discount.value}%` : `${discount.value} ${currency}`} off`);
      setDiscountCode('');
    } catch (error) {
      console.error('Error applying discount:', error);
      toast.error('Failed to apply discount code');
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    toast.success('Discount removed');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-neutral-300 mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h1>
          <p className="text-neutral-600 mb-6">Start adding some items to your cart!</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-neutral-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const price = item.variant?.price || item.product.price;
                const image = item.product.images?.[0]?.url || '/placeholder-product.jpg';

                return (
                  <motion.div
                    key={`${item.product.id}-${item.variant?.id || 'default'}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-neutral-900">
                              {item.product.title}
                            </h3>
                            {item.variant && (
                              <p className="text-sm text-neutral-600">{item.variant.name}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.variant?.id
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded hover:border-neutral-900 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.variant?.id
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded hover:border-neutral-900 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-neutral-900">
                              {(price * item.quantity).toFixed(2)} {currency}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {price.toFixed(2)} {currency} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} {currency}</span>
                </div>

                {/* Discount Code Section */}
                <div className="py-2">
                  {appliedDiscount ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            {appliedDiscount.code}
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-green-700">
                        {appliedDiscount.discount.discount_type === 'percentage'
                          ? `${appliedDiscount.discount.value}% off`
                          : `${appliedDiscount.discount.value} ${currency} off`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Discount Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                        <Button
                          size="sm"
                          onClick={handleApplyDiscount}
                          isLoading={applyingDiscount}
                          disabled={!discountCode.trim()}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {appliedDiscount && (
                  <div className="flex items-center justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-{discountAmount.toFixed(2)} {currency}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : shippingCost.toFixed(2) + ' ' + currency}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex items-center justify-between text-lg font-semibold text-neutral-900">
                    <span>Total</span>
                    <span>{grandTotal.toFixed(2)} {currency}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full mb-3">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <Button size="lg" variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {subtotalAfterDiscount < 100 && (
                <p className="text-sm text-neutral-600 mt-4 text-center">
                  Add {(100 - subtotalAfterDiscount).toFixed(2)} {currency} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

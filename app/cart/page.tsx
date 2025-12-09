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
      <div className="min-h-[70vh] bg-neutral-950 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-neutral-800">
            <ShoppingBag size={32} className="text-neutral-600 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-neutral-400 mb-6 sm:mb-8 text-sm sm:text-base">Start adding some items to your cart!</p>
          <Link href="/shop">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2"
        >
          Shopping Cart
        </motion.h1>
        <div className="w-12 sm:w-16 h-1 bg-amber-500 mb-6 sm:mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
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
                    className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-neutral-800"
                  >
                    <div className="flex gap-3 sm:gap-6">
                      {/* Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                              {item.product.title}
                            </h3>
                            {item.variant && (
                              <p className="text-xs sm:text-sm text-neutral-400">{item.variant.name}</p>
                            )}
                            {item.variant && item.variant.stock === 0 && (
                              <p className="text-xs sm:text-sm text-amber-400 font-medium">Out of Stock</p>
                            )}
                            {item.variant && item.variant.stock > 0 && item.variant.stock < item.quantity && (
                              <p className="text-xs sm:text-sm text-amber-400">Only {item.variant.stock} available</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="text-neutral-500 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.variant?.id
                                )
                              }
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-neutral-700 rounded hover:border-amber-500 transition-colors text-white"
                            >
                              <Minus size={12} className="sm:w-[14px] sm:h-[14px]" />
                            </button>
                            <span className="w-8 sm:w-12 text-center font-medium text-white text-sm sm:text-base">{item.quantity}</span>
                            <button
                              onClick={() => {
                                const maxStock = item.variant?.stock ?? 999;
                                if (item.quantity >= maxStock) {
                                  toast.error(`Only ${maxStock} items available in stock`);
                                  return;
                                }
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.variant?.id
                                );
                              }}
                              disabled={item.variant && item.quantity >= item.variant.stock}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-neutral-700 rounded hover:border-amber-500 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-amber-400 text-sm sm:text-base">
                              {(price * item.quantity).toFixed(2)} {currency}
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-500">
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
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-neutral-800 sticky top-20 lg:top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Order Summary</h2>

              <div className="space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center justify-between text-neutral-400 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span className="text-white">{total.toFixed(2)} {currency}</span>
                </div>

                {/* Discount Code Section */}
                <div className="py-2 sm:py-3 border-t border-neutral-800">
                  {appliedDiscount ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Tag size={14} className="text-amber-400 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium text-amber-400">
                            {appliedDiscount.code}
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          <X size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-amber-400/70">
                        {appliedDiscount.discount.discount_type === 'percentage'
                          ? `${appliedDiscount.discount.value}% off`
                          : `${appliedDiscount.discount.value} ${currency} off`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2">
                        Discount Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                          placeholder="Enter code"
                          className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 min-w-0"
                        />
                        <button
                          onClick={handleApplyDiscount}
                          disabled={!discountCode.trim() || applyingDiscount}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-black bg-amber-500 rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          {applyingDiscount ? '...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {appliedDiscount && (
                  <div className="flex items-center justify-between text-amber-400 font-medium text-sm sm:text-base">
                    <span>Discount</span>
                    <span>-{discountAmount.toFixed(2)} {currency}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-400 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="text-white">{shippingCost === 0 ? 'Free' : shippingCost.toFixed(2) + ' ' + currency}</span>
                </div>
                <div className="border-t border-neutral-800 pt-3">
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">{grandTotal.toFixed(2)} {currency}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full mb-2 sm:mb-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm sm:text-base">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <Button size="lg" variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800 text-sm sm:text-base">
                  Continue Shopping
                </Button>
              </Link>

              {subtotalAfterDiscount < 100 && (
                <p className="text-xs sm:text-sm text-neutral-500 mt-3 sm:mt-4 text-center">
                  Add <span className="text-amber-400 font-medium">{(100 - subtotalAfterDiscount).toFixed(2)} {currency}</span> more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

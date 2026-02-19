'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Customer, Discount } from '@/types';
import { MessageCircle, Mail, Tag, X, Shield, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateDiscountCodeAmount } from '@/lib/pricing';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, appliedDiscount, applyDiscount, removeDiscount } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [formData, setFormData] = useState<Customer>({
    full_name: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      postal: '',
      country: 'Tunisia',
    },
  });

  const total = getTotal();
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const subtotalAfterDiscount = total - discountAmount;
  const shippingCost = subtotalAfterDiscount > 100 ? 0 : 7;
  const grandTotal = subtotalAfterDiscount + shippingCost;
  const currency = items[0]?.product.currency || 'TND';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const createOrder = async () => {
    try {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
        ])
        .select()
        .single();

      if (customerError) throw customerError;

      const orderData: any = {
        customer_id: customer.id,
        status: 'pending',
        total: grandTotal,
        currency,
        payment_method: 'whatsapp',
        shipping: formData.address,
      };

      if (appliedDiscount) {
        orderData.notes = `Discount Code Applied: ${appliedDiscount.code} (${appliedDiscount.discount.discount_type === 'percentage' ? `${appliedDiscount.discount.value}%` : `${appliedDiscount.discount.value} ${currency}`} off - Saved ${discountAmount.toFixed(2)} ${currency})`;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant?.id,
        title: item.product.title + (item.variant ? ` - ${item.variant.name}` : ''),
        unit_price: item.variant?.price || item.product.price,
        quantity: item.quantity,
        total_price: (item.variant?.price || item.product.price) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of items) {
        if (item.variant?.id) {
          const { data: currentVariant } = await supabase
            .from('product_variants')
            .select('stock')
            .eq('id', item.variant.id)
            .single();

          if (currentVariant) {
            const newStock = Math.max(0, currentVariant.stock - item.quantity);
            await supabase
              .from('product_variants')
              .update({ stock: newStock })
              .eq('id', item.variant.id);
          }
        }
      }

      return order.id;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const handleWhatsAppCheckout = async () => {
    if (!formData.full_name || !formData.phone) {
      toast.error('Please fill in your name and phone number');
      return;
    }

    if (!formData.address?.street || !formData.address?.city) {
      toast.error('Please fill in your shipping address');
      return;
    }

    setLoading(true);

    try {
      const orderId = await createOrder();

      let message = `*New Order #${orderId.substring(0, 8)}*\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${formData.full_name}\n`;
      message += `Phone: ${formData.phone}\n`;
      if (formData.email) message += `Email: ${formData.email}\n`;
      message += `\n*Delivery Address:*\n`;
      message += `${formData.address?.street}\n`;
      message += `${formData.address?.city}, ${formData.address?.postal}\n`;
      message += `${formData.address?.country}\n\n`;

      message += `*Order Items:*\n`;
      items.forEach((item) => {
        const price = item.variant?.price || item.product.price;
        message += `• ${item.product.title}`;
        if (item.variant) message += ` (${item.variant.name})`;
        message += ` x${item.quantity} - ${(price * item.quantity).toFixed(2)} ${currency}\n`;
      });

      message += `\n*Subtotal:* ${total.toFixed(2)} ${currency}\n`;
      if (appliedDiscount) {
        message += `*Discount (${appliedDiscount.code}):* -${discountAmount.toFixed(2)} ${currency}\n`;
      }
      message += `*Shipping:* ${shippingCost === 0 ? 'Free' : shippingCost.toFixed(2) + ' ' + currency}\n`;
      message += `*Total:* ${grandTotal.toFixed(2)} ${currency}`;

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '21612345678';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      clearCart();
      window.open(whatsappUrl, '_blank');

      toast.success('Order created! Redirecting to WhatsApp...');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailCheckout = async () => {
    if (!formData.full_name || !formData.phone) {
      toast.error('Please fill in your name and phone number');
      return;
    }

    if (!formData.address?.street || !formData.address?.city) {
      toast.error('Please fill in your shipping address');
      return;
    }

    setLoading(true);

    try {
      const orderId = await createOrder();

      // Send email to store owner
      const orderEmailData = {
        orderId,
        customer: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        items: items.map((item) => ({
          title: item.product.title,
          variant: item.variant?.name,
          quantity: item.quantity,
          price: (item.variant?.price || item.product.price) * item.quantity,
        })),
        subtotal: total,
        discount: appliedDiscount
          ? { code: appliedDiscount.code, amount: discountAmount }
          : undefined,
        shipping: shippingCost,
        total: grandTotal,
        currency,
      };

      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderEmailData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      clearCart();
      toast.success('Order placed successfully! We will contact you soon.');
      router.push('/');
    } catch (error) {
      console.error('Email checkout error:', error);
      toast.error('Failed to place order. Please try again or use WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-6 sm:py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">Checkout</h1>
          <div className="w-12 sm:w-16 h-1 bg-amber-500 mb-6 sm:mb-8" />
        </motion.div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-3 sm:p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 text-center sm:text-left">
            <Shield size={18} className="text-amber-500 flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm text-neutral-300">Secure Checkout</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-3 sm:p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 text-center sm:text-left">
            <Truck size={18} className="text-amber-500 flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm text-neutral-300">Fast Delivery</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-3 sm:p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 text-center sm:text-left">
            <Clock size={18} className="text-amber-500 flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm text-neutral-300">Easy Returns</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-neutral-800"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1 h-4 sm:h-5 bg-amber-500 rounded-full" />
              Contact Information
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+216 12 345 678"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                  Email <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 text-sm sm:text-base"
                />
              </div>

              <div className="pt-4 sm:pt-6 border-t border-neutral-800">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-1 h-4 sm:h-5 bg-amber-500 rounded-full" />
                  Shipping Address
                </h2>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address?.street}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address?.city}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                    Postal Code <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="address.postal"
                    value={formData.address?.postal}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-neutral-500 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-neutral-800 sticky top-20 lg:top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Order Summary</h2>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-neutral-400 truncate flex-1">
                      {item.product.title} {item.variant && `(${item.variant.name})`} x{item.quantity}
                    </span>
                    <span className="text-white font-medium flex-shrink-0">
                      {((item.variant?.price || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-neutral-800 pt-2 sm:pt-3 space-y-2">
                  <div className="flex justify-between text-neutral-400 text-xs sm:text-sm">
                    <span>Subtotal</span>
                    <span className="text-white">{total.toFixed(2)} {currency}</span>
                  </div>

                  {/* Discount Code Section */}
                  <div className="py-2">
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
                        <label className="block text-xs sm:text-sm font-medium text-neutral-400 mb-1.5 sm:mb-2">
                          Discount Code <span className="text-neutral-600">(optional)</span>
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
                            className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-black bg-amber-500 rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0"
                          >
                            {applyingDiscount ? '...' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-amber-400 font-medium text-xs sm:text-sm">
                      <span>Discount</span>
                      <span>-{discountAmount.toFixed(2)} {currency}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400 text-xs sm:text-sm">
                    <span>Shipping</span>
                    <span className="text-white">{shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)} ${currency}`}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-neutral-800">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">{grandTotal.toFixed(2)} {currency}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Button
                  size="lg"
                  onClick={handleEmailCheckout}
                  isLoading={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm sm:text-base"
                >
                  <Mail size={18} className="mr-2 sm:w-5 sm:h-5" />
                  Place Order
                </Button>
                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-700" />
                  </div>
                  <span className="relative bg-neutral-900/50 px-3 text-xs text-neutral-500">or</span>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWhatsAppCheckout}
                  isLoading={loading}
                  className="w-full border-green-600 text-green-500 hover:bg-green-600 hover:text-white font-bold text-sm sm:text-base"
                >
                  <MessageCircle size={18} className="mr-2 sm:w-5 sm:h-5" />
                  Order via WhatsApp
                </Button>
              </div>

              <p className="text-[10px] sm:text-xs text-neutral-500 text-center mt-3 sm:mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

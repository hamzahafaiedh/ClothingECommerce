'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Customer, Discount } from '@/types';
import { MessageCircle, CreditCard, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateDiscountCodeAmount } from '@/lib/pricing';

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
      setLoading(true);

      // Create customer
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

      // Create order
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

      // Create order items
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

      // Update variant stock levels
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
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppCheckout = async () => {
    if (!formData.full_name || !formData.phone) {
      toast.error('Please fill in your name and phone number');
      return;
    }

    try {
      const orderId = await createOrder();

      // Generate WhatsApp message
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
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
    }
  };

  const handleStandardCheckout = async () => {
    if (!formData.full_name || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createOrder();
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-neutral-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+216 12 345 678"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <h2 className="text-xl font-semibold text-neutral-900 mb-4 pt-4">
                Shipping Address
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Street Address <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address?.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    City <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address?.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Postal Code <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="address.postal"
                    value={formData.address?.postal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between text-sm">
                    <span className="text-neutral-700">
                      {item.product.title} {item.variant && `(${item.variant.name})`} x{item.quantity}
                    </span>
                    <span className="text-neutral-900 font-medium">
                      {((item.variant?.price || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-neutral-200 pt-3 space-y-2">
                  <div className="flex justify-between text-neutral-600">
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
                          Discount Code <span className="text-neutral-500">(optional)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-w-0"
                          />
                          <button
                            onClick={handleApplyDiscount}
                            disabled={!discountCode.trim() || applyingDiscount}
                            className="px-3 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0"
                          >
                            {applyingDiscount ? '...' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-{discountAmount.toFixed(2)} {currency}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)} ${currency}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-neutral-900 pt-2">
                    <span>Total</span>
                    <span>{grandTotal.toFixed(2)} {currency}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleWhatsAppCheckout}
                  isLoading={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Order via WhatsApp
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleStandardCheckout}
                  isLoading={loading}
                  className="w-full"
                >
                  <CreditCard size={20} className="mr-2" />
                  Place Order
                </Button>
              </div>

              <p className="text-xs text-neutral-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

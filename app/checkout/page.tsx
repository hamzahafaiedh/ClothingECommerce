'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Customer } from '@/types';
import { MessageCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
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
  const shippingCost = total > 100 ? 0 : 7;
  const grandTotal = total + shippingCost;
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
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_id: customer.id,
            status: 'pending',
            total: grandTotal,
            currency,
            payment_method: 'whatsapp',
            shipping: formData.address,
          },
        ])
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
                  Email (optional)
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
                  Street Address
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
                    City
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
                    Postal Code
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

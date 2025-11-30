'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    // Refetch stats when the page becomes visible (e.g., when navigating back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats();
      }
    };

    // Refetch stats when the window regains focus
    const handleFocus = () => {
      fetchStats();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  async function fetchStats() {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch pending orders
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch revenue - ONLY from paid orders
      // Pending, shipped, delivered, and cancelled orders are NOT included in revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'paid');

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        pendingOrders: pendingCount || 0,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
    {
      title: 'Revenue',
      value: `${stats.revenue.toFixed(2)} TND`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
        Dashboard Overview
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-20 bg-neutral-200 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="text-neutral-600 text-sm font-medium mb-1">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-neutral-900">{card.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 transition-colors text-center"
          >
            <Package size={32} className="mx-auto mb-2 text-neutral-700" />
            <p className="font-medium">Manage Products</p>
          </a>
          <a
            href="/admin/orders"
            className="p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 transition-colors text-center"
          >
            <ShoppingCart size={32} className="mx-auto mb-2 text-neutral-700" />
            <p className="font-medium">View Orders</p>
          </a>
          <a
            href="/shop"
            className="p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 transition-colors text-center"
          >
            <TrendingUp size={32} className="mx-auto mb-2 text-neutral-700" />
            <p className="font-medium">Visit Store</p>
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingCart, LayoutDashboard, Settings, Tag, Percent } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Discounts', href: '/admin/discounts', icon: Percent },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen fixed">
          <div className="p-6">
            <h2 className="text-2xl font-display font-bold text-neutral-900">
              Admin Panel
            </h2>
          </div>

          <nav className="px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

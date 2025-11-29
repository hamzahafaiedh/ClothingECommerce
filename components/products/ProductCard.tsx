'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { ShoppingBag, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import { calculateDiscount } from '@/lib/pricing';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const mainImage = product.images?.[0]?.url || '/placeholder-product.jpg';
  const pricing = calculateDiscount(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.variants?.[0]);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Added to cart!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {product.title} has been added to your cart
              </p>
              <div className="mt-2">
                <Link href="/cart" onClick={() => toast.dismiss(t.id)}>
                  <button className="text-sm font-medium text-neutral-900 hover:text-neutral-700 underline">
                    View cart & checkout →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'bottom-right',
    });
  };

  return (
    <Link href={`/shop/${product.slug}`}>
      <Card hover className="group cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Discount Badge */}
          {pricing.hasDiscount && pricing.discount && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
              <Tag size={14} />
              {pricing.discount.discount_type === 'percentage'
                ? `-${pricing.discount.value}%`
                : `-${pricing.discount.value} ${product.currency}`}
            </div>
          )}

          {/* Quick Add Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-neutral-900 px-6 py-2.5 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 shadow-lg"
          >
            <ShoppingBag size={18} />
            Quick Add
          </motion.button>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-neutral-900 mb-1 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-neutral-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pricing.hasDiscount ? (
                <>
                  <span className="text-lg font-semibold text-red-600">
                    {pricing.discountedPrice.toFixed(2)} {product.currency}
                  </span>
                  <span className="text-sm text-neutral-500 line-through">
                    {pricing.originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold text-neutral-900">
                  {product.price.toFixed(2)} {product.currency}
                </span>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <span className="text-xs text-neutral-500">
                {product.variants.length} sizes
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

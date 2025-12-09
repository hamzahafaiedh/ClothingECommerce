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

  // Check if product is out of stock
  const isOutOfStock = product.variants && product.variants.length > 0
    ? product.variants.every(v => v.stock === 0)
    : (product.stock !== undefined && product.stock === 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    const availableVariant = product.variants?.find(v => v.stock > 0);
    addItem(product, availableVariant || product.variants?.[0]);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-neutral-900 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-amber-500/20`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                Added to cart!
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                {product.title} has been added to your cart
              </p>
              <div className="mt-2">
                <Link href="/cart" onClick={() => toast.dismiss(t.id)}>
                  <button className="text-sm font-medium text-amber-400 hover:text-amber-300 underline">
                    View cart & checkout →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-l border-neutral-800">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-neutral-400 hover:text-white focus:outline-none"
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
      <div className="group cursor-pointer bg-neutral-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-neutral-900/90 text-amber-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg border border-amber-500/30">
              Out of Stock
            </div>
          )}

          {/* Discount Badge */}
          {pricing.hasDiscount && pricing.discount && !isOutOfStock && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-amber-500 text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-0.5 sm:gap-1 shadow-lg">
              <Tag size={12} className="sm:w-[14px] sm:h-[14px]" />
              {pricing.discount.discount_type === 'percentage'
                ? `-${pricing.discount.value}%`
                : `-${pricing.discount.value} ${product.currency}`}
            </div>
          )}

          {/* Quick Add Button - Hidden on mobile, shown on hover for larger screens */}
          {!isOutOfStock && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center gap-1.5 sm:gap-2 shadow-lg hover:bg-amber-400 hidden sm:flex text-sm"
            >
              <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
              Quick Add
            </motion.button>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />
        </div>

        <div className="p-3 sm:p-4 lg:p-5">
          <h3 className="font-medium text-white mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors text-sm sm:text-base">
            {product.title}
          </h3>
          <p className="text-neutral-500 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
            {product.description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {pricing.hasDiscount ? (
                <>
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-400">
                    {pricing.discountedPrice.toFixed(2)} {product.currency}
                  </span>
                  <span className="text-xs sm:text-sm text-neutral-600 line-through">
                    {pricing.originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-sm sm:text-base lg:text-lg font-bold text-white">
                  {product.price.toFixed(2)} {product.currency}
                </span>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <span className="text-[10px] sm:text-xs text-neutral-500 bg-neutral-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                {product.variants.length} sizes
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const mainImage = product.images?.[0]?.url || '/placeholder-product.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.variants?.[0]);
    toast.success('Added to cart!', {
      duration: 2000,
      position: 'bottom-center',
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
            <span className="text-lg font-semibold text-neutral-900">
              {product.price.toFixed(2)} {product.currency}
            </span>
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

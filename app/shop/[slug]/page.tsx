'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/types';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Check, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import { calculateDiscount } from '@/lib/pricing';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const pricing = product ? calculateDiscount(product) : null;

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    setLoading(true);

    const { data } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        category:categories(*),
        discount:discounts(*)
      `)
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (data) {
      const formattedProduct = {
        ...data,
        images: data.images.sort((a: any, b: any) => a.order - b.order),
      };
      setProduct(formattedProduct);
      if (formattedProduct.variants && formattedProduct.variants.length > 0) {
        setSelectedVariant(formattedProduct.variants[0]);
      }
    }

    setLoading(false);
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedVariant || undefined, quantity);
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
                {quantity} × {product.title} added to your cart
              </p>
              <div className="mt-2 flex gap-2">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-200 rounded-xl animate-shimmer" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-neutral-200 rounded-lg animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-neutral-200 rounded animate-shimmer w-3/4" />
              <div className="h-4 bg-neutral-200 rounded animate-shimmer w-1/2" />
              <div className="h-20 bg-neutral-200 rounded animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Product not found</h1>
          <p className="text-neutral-600">This product may have been removed or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-white rounded-xl overflow-hidden"
            >
              <Image
                src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.images?.[selectedImage]?.alt || product.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-sm text-neutral-500 uppercase tracking-wide mb-2">
                  {product.category.name}
                </p>
              )}
              <h1 className="text-4xl font-display font-bold text-neutral-900 mb-4">
                {product.title}
              </h1>

              {/* Price with Discount */}
              <div className="flex items-center gap-3">
                {pricing?.hasDiscount ? (
                  <>
                    <div className="text-3xl font-bold text-red-600">
                      {pricing.discountedPrice.toFixed(2)} {product.currency}
                    </div>
                    <div className="text-2xl text-neutral-500 line-through">
                      {pricing.originalPrice.toFixed(2)} {product.currency}
                    </div>
                    {pricing.discount && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Tag size={14} />
                        {pricing.discount.discount_type === 'percentage'
                          ? `-${pricing.discount.value}%`
                          : `-${pricing.discount.value} ${product.currency}`}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-3xl font-bold text-neutral-900">
                    {currentPrice.toFixed(2)} {product.currency}
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="prose prose-neutral">
                <p className="text-neutral-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variants/Sizes */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Select Size
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.active || variant.stock === 0}
                      className={`relative px-4 py-3 rounded-lg border-2 font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        selectedVariant?.id === variant.id
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 hover:border-neutral-900'
                      }`}
                    >
                      {variant.name}
                      {selectedVariant?.id === variant.id && (
                        <Check size={16} className="absolute top-1 right-1" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant && selectedVariant.stock < 5 && selectedVariant.stock > 0 && (
                  <p className="text-sm text-orange-600 mt-2">
                    Only {selectedVariant.stock} left in stock
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors font-semibold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-semibold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={selectedVariant ? selectedVariant.stock === 0 : false}
              className="w-full"
            >
              <ShoppingBag size={20} className="mr-2" />
              {selectedVariant && selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* Additional Info */}
            <div className="border-t border-neutral-200 pt-6 space-y-4 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                <span>Free shipping on orders over 100 {product.currency}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                <span>Easy returns within 14 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                <span>Authentic products guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

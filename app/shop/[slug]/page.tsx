'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/types';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Check, Tag, ChevronLeft } from 'lucide-react';
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

  const currentPrice = selectedVariant?.price ?? product?.price ?? 0;

  const pricing = product && product.discount ? (() => {
    const basePrice = currentPrice;
    let discountedPrice = basePrice;

    if (product.discount.discount_type === 'percentage') {
      discountedPrice = basePrice * (1 - product.discount.value / 100);
    } else {
      discountedPrice = basePrice - product.discount.value;
    }

    return {
      originalPrice: basePrice,
      discountedPrice: Math.max(0, discountedPrice),
      hasDiscount: true,
      discount: product.discount
    };
  })() : {
    originalPrice: currentPrice,
    discountedPrice: currentPrice,
    hasDiscount: false,
    discount: null
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (selectedVariant && selectedVariant.stock < quantity) {
      toast.error(`Only ${selectedVariant.stock} items available in stock`);
      return;
    }

    if (!selectedVariant && product.stock < quantity) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    addItem(product, selectedVariant || undefined, quantity);
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
                {quantity} × {product.title} added to your cart
              </p>
              <div className="mt-2 flex gap-2">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-square bg-neutral-900 rounded-xl animate-pulse" />
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-neutral-900 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="h-8 bg-neutral-900 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-neutral-900 rounded animate-pulse w-1/2" />
              <div className="h-20 bg-neutral-900 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Product not found</h1>
          <p className="text-neutral-400 mb-6 text-sm sm:text-base">This product may have been removed or doesn't exist.</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-1 sm:gap-2 text-neutral-400 hover:text-amber-400 transition-colors mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base"
        >
          <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800"
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
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-1 sm:ring-offset-2 ring-offset-neutral-950'
                        : 'border-neutral-800 hover:border-neutral-600'
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
          <div className="space-y-4 sm:space-y-6">
            <div>
              {product.category && (
                <p className="text-xs sm:text-sm text-amber-400 uppercase tracking-wider mb-1 sm:mb-2 font-medium">
                  {product.category.name}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3 sm:mb-4">
                {product.title}
              </h1>

              {/* Price with Discount */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {pricing?.hasDiscount ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                      {pricing.discountedPrice.toFixed(2)} {product.currency}
                    </div>
                    <div className="text-lg sm:text-2xl text-neutral-500 line-through">
                      {pricing.originalPrice.toFixed(2)} {product.currency}
                    </div>
                    {pricing.discount && (
                      <div className="bg-amber-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
                        <Tag size={12} className="sm:w-[14px] sm:h-[14px]" />
                        {pricing.discount.discount_type === 'percentage'
                          ? `-${pricing.discount.value}%`
                          : `-${pricing.discount.value} ${product.currency}`}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {currentPrice.toFixed(2)} {product.currency}
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="border-t border-neutral-800 pt-4 sm:pt-6">
                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">{product.description}</p>
              </div>
            )}

            {/* Variants/Sizes */}
            {product.variants && product.variants.length > 0 && (
              <div className="border-t border-neutral-800 pt-4 sm:pt-6">
                <label className="block text-sm font-semibold text-white mb-3 sm:mb-4">
                  Select Size
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.active || variant.stock === 0}
                      className={`relative px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base ${
                        selectedVariant?.id === variant.id
                          ? 'border-amber-500 bg-amber-500 text-black'
                          : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      {variant.name}
                      {selectedVariant?.id === variant.id && (
                        <Check size={14} className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant && selectedVariant.stock < 5 && selectedVariant.stock > 0 && (
                  <p className="text-xs sm:text-sm text-amber-400 mt-2 sm:mt-3">
                    Only {selectedVariant.stock} left in stock
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="border-t border-neutral-800 pt-4 sm:pt-6">
              <label className="block text-sm font-semibold text-white mb-3 sm:mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-neutral-700 rounded-lg hover:border-amber-500 transition-colors font-semibold text-white"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant ? selectedVariant.stock : product?.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    const maxStock = selectedVariant ? selectedVariant.stock : (product?.stock || 999);
                    setQuantity(Math.min(value, maxStock));
                  }}
                  className="w-16 sm:w-20 h-10 sm:h-12 text-center border-2 border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold bg-transparent text-white text-sm sm:text-base"
                />
                <button
                  onClick={() => {
                    const maxStock = selectedVariant ? selectedVariant.stock : (product?.stock || 999);
                    setQuantity(Math.min(quantity + 1, maxStock));
                  }}
                  disabled={(selectedVariant && quantity >= selectedVariant.stock) || (!selectedVariant && product && quantity >= product.stock)}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-neutral-700 rounded-lg hover:border-amber-500 transition-colors font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={selectedVariant ? selectedVariant.stock === 0 : (product ? product.stock === 0 : false)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm sm:text-base"
            >
              <ShoppingBag size={18} className="mr-2 sm:w-[20px] sm:h-[20px]" />
              {(selectedVariant && selectedVariant.stock === 0) || (!selectedVariant && product && product.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* Additional Info */}
            <div className="border-t border-neutral-800 pt-4 sm:pt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-neutral-400">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full flex-shrink-0" />
                <span>Free shipping on orders over 100 {product.currency}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full flex-shrink-0" />
                <span>Easy returns within 14 days</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full flex-shrink-0" />
                <span>Authentic products guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

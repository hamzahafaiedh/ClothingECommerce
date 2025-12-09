'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [selectedGender, setSelectedGender] = useState<string | null>(
    searchParams.get('gender')
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, selectedGender, sortBy]);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (data) setCategories(data);
  }

  async function fetchProducts() {
    setLoading(true);

    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        category:categories(*),
        discount:discounts(*)
      `)
      .eq('active', true);

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    if (selectedGender) {
      // Include both the selected gender AND unisex products (null gender)
      query = query.or(`gender.eq.${selectedGender},gender.is.null`);
    }

    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;

    if (data) {
      setProducts(data.map(product => ({
        ...product,
        images: product.images.sort((a: any, b: any) => a.order - b.order),
      })));
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Banner - Image Placeholder */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/shop-banner.jpg')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 sm:mb-4">
              Shop Collection
            </h1>
            <div className="w-16 sm:w-20 h-1 bg-amber-500 mx-auto mb-2 sm:mb-4" />
            <p className="text-neutral-300 text-sm sm:text-base lg:text-lg">
              {products.length} products available
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden px-3 sm:px-4 py-2 border border-neutral-700 rounded-lg flex items-center gap-1.5 sm:gap-2 text-neutral-300 hover:border-amber-500 hover:text-amber-400 transition-colors text-sm sm:text-base"
            >
              <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
              Filters
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 sm:px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-300 text-sm sm:text-base"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
                <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full" />
                  Gender
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedGender(null)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      !selectedGender
                        ? 'bg-amber-500 text-black font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedGender('men')}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      selectedGender === 'men'
                        ? 'bg-amber-500 text-black font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    Men
                  </button>
                  <button
                    onClick={() => setSelectedGender('women')}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      selectedGender === 'women'
                        ? 'bg-amber-500 text-black font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    Women
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
                <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      !selectedCategory
                        ? 'bg-amber-500 text-black font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-amber-500 text-black font-medium'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => setFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="bg-neutral-900 h-full w-[280px] sm:w-80 p-4 sm:p-6 border-r border-neutral-800 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-semibold text-base sm:text-lg text-white">Filters</h3>
                    <button onClick={() => setFilterOpen(false)} className="text-neutral-400 hover:text-white">
                      <X size={22} className="sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h4 className="font-semibold mb-2 sm:mb-3 text-amber-400 text-sm sm:text-base">Gender</h4>
                      <div className="space-y-1 sm:space-y-2">
                        <button
                          onClick={() => {
                            setSelectedGender(null);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${
                            !selectedGender
                              ? 'bg-amber-500 text-black font-medium'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGender('men');
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${
                            selectedGender === 'men'
                              ? 'bg-amber-500 text-black font-medium'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          Men
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGender('women');
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${
                            selectedGender === 'women'
                              ? 'bg-amber-500 text-black font-medium'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          Women
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 sm:mb-3 text-amber-400 text-sm sm:text-base">Categories</h4>
                      <div className="space-y-1 sm:space-y-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${
                            !selectedCategory
                              ? 'bg-amber-500 text-black font-medium'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          All Products
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${
                              selectedCategory === category.id
                                ? 'bg-amber-500 text-black font-medium'
                                : 'text-neutral-300 hover:bg-neutral-800'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                    <div className="aspect-[3/4] bg-neutral-800 animate-pulse" />
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="h-4 bg-neutral-800 rounded animate-pulse" />
                      <div className="h-3 bg-neutral-800 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <p className="text-neutral-400 text-base sm:text-lg">No products found</p>
                <p className="text-neutral-600 mt-2 text-sm sm:text-base">Try adjusting your filters</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

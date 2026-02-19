'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Package, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query) ||
      (product.category?.name?.toLowerCase().includes(query) ?? false)
    );
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        category:categories(*)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data as any);
    }
    setLoading(false);
  }

  const openDeleteModal = (product: Product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, product: null });
  };

  async function deleteProduct() {
    if (!deleteModal.product) return;

    setDeleting(true);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteModal.product.id);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted successfully');
      fetchProducts();
      closeDeleteModal();
    }
    setDeleting(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Products
        </h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-200 rounded animate-shimmer" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map((product) => {
                const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                const isOutOfStock = product.variants && product.variants.length > 0
                  ? product.variants.every(v => v.stock === 0)
                  : false;
                const hasLowStock = totalStock > 0 && totalStock <= 5;

                return (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0]?.url && (
                            <Image
                              src={product.images[0].url}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{product.title}</p>
                          <p className="text-sm text-neutral-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-900">
                        {product.price.toFixed(2)} {product.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.variants && product.variants.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              isOutOfStock ? 'text-red-600' : hasLowStock ? 'text-orange-600' : 'text-neutral-900'
                            }`}>
                              {totalStock} total
                            </span>
                            {isOutOfStock && (
                              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                            {hasLowStock && !isOutOfStock && (
                              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                Low Stock
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500">
                            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">No variants</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button
                            className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600">No products yet</p>
              <Link href="/admin/products/new">
                <Button className="mt-4">
                  <Plus size={20} className="mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          )}

          {products.length > 0 && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600">No products match your search</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Delete Product"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-neutral-900 font-medium">
                Are you sure you want to delete this product?
              </p>
              {deleteModal.product && (
                <p className="text-sm text-neutral-600 mt-1">
                  &quot;{deleteModal.product.title}&quot; will be permanently removed.
                </p>
              )}
              <p className="text-sm text-neutral-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteProduct}
              isLoading={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

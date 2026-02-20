'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    currency: 'TND',
    category_id: '',
    gender: '',
    discount_id: '',
    stock: '0',
    active: true,
    is_new_arrival: false,
  });
  const [images, setImages] = useState<string[]>(['']);
  const [variants, setVariants] = useState<Array<{ id?: string; name: string; price: string; stock: string }>>([
    { name: '', price: '', stock: '0' },
  ]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchDiscounts();
  }, [productId]);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true});

    if (data) {
      setCategories(data);
    }
  }

  async function fetchDiscounts() {
    const { data } = await supabase
      .from('discounts')
      .select('id, code, description, discount_type, value, active')
      .eq('active', true)
      .is('code', null)
      .order('created_at', { ascending: false });

    if (data) {
      setDiscounts(data);
    }
  }

  async function fetchProduct() {
    setFetching(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('id', productId)
      .single();

    if (error || !data) {
      toast.error('Product not found');
      router.push('/admin/products');
      return;
    }

    setFormData({
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      price: data.price.toString(),
      currency: data.currency,
      category_id: data.category_id || '',
      gender: data.gender || '',
      discount_id: data.discount_id || '',
      stock: data.stock?.toString() || '0',
      active: data.active,
      is_new_arrival: data.is_new_arrival || false,
    });

    if (data.images && data.images.length > 0) {
      setImages(data.images.sort((a: any, b: any) => a.order - b.order).map((img: any) => img.url));
    }

    if (data.variants && data.variants.length > 0) {
      setVariants(
        data.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          price: v.price?.toString() || '',
          stock: v.stock.toString(),
        }))
      );
    }

    setFetching(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', stock: '0' }]);
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate at least one image
    const validImages = images.filter((img) => img.trim() !== '');
    if (validImages.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setLoading(true);

    try {
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          category_id: formData.category_id || null,
          gender: formData.gender || null,
          discount_id: formData.discount_id || null,
          stock: parseInt(formData.stock) || 0,
          active: formData.active,
          is_new_arrival: formData.is_new_arrival,
        })
        .eq('id', productId);

      if (productError) throw productError;

      // Delete old images
      await supabase.from('product_images').delete().eq('product_id', productId);

      // Add new images
      const validImages = images.filter((img) => img.trim() !== '');
      if (validImages.length > 0) {
        const imageInserts = validImages.map((url, index) => ({
          product_id: productId,
          url,
          order: index,
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      // Handle variants
      const existingVariantIds = variants.filter((v) => v.id).map((v) => v.id);

      // Delete removed variants
      if (existingVariantIds.length > 0) {
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', productId)
          .not('id', 'in', `(${existingVariantIds.join(',')})`);
      } else {
        await supabase.from('product_variants').delete().eq('product_id', productId);
      }

      // Update/Insert variants
      const validVariants = variants.filter((v) => v.name.trim() !== '');
      for (const variant of validVariants) {
        const variantData = {
          product_id: productId,
          name: variant.name,
          price: variant.price ? parseFloat(variant.price) : null,
          stock: parseInt(variant.stock) || 0,
        };

        if (variant.id) {
          // Update existing
          await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', variant.id);
        } else {
          // Insert new
          await supabase.from('product_variants').insert([variantData]);
        }
      }

      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Edit Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-neutral-50 cursor-not-allowed"
                required
                disabled
              />
              <p className="text-xs text-neutral-500 mt-1">
                Auto-generated from title
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description <span className="text-neutral-500">(optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category <span className="text-neutral-500">(optional)</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Gender <span className="text-neutral-500">(optional)</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="">All / Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                >
                  <option value="TND">TND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  For products without variants
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Discount (Optional)
              </label>
              <select
                name="discount_id"
                value={formData.discount_id}
                onChange={(e) =>
                  setFormData({ ...formData, discount_id: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="">No discount</option>
                {discounts.map((discount) => (
                  <option key={discount.id} value={discount.id}>
                    {discount.code || discount.description || 'Unnamed discount'} - {discount.discount_type === 'percentage' ? `${discount.value}%` : `${discount.value} TND`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-1">
                Select a discount to apply to this product. <Link href="/admin/discounts" className="text-neutral-900 underline">Manage discounts</Link>
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                />
                <label htmlFor="active" className="text-sm text-neutral-700">
                  Active (visible in store)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_new_arrival"
                  checked={formData.is_new_arrival}
                  onChange={(e) =>
                    setFormData({ ...formData, is_new_arrival: e.target.checked })
                  }
                  className="w-4 h-4 text-amber-500 border-neutral-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="is_new_arrival" className="text-sm text-neutral-700">
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium mr-1">NEW</span>
                  Mark as New Arrival
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">Images *</h2>
            <p className="text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200">
              ℹ️ Maximum 32MB per image
            </p>
          </div>
          <ImageUpload images={images} onChange={setImages} />
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Variants (Sizes/Colors)
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Leave empty if product has no variants. Use the main stock field above instead.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus size={18} className="mr-2" />
              Add Variant
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                  placeholder="Name (e.g., Size M, Black)"
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', e.target.value)}
                  placeholder="Price (optional)"
                  step="0.01"
                  className="w-32 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                  placeholder="Stock"
                  className="w-24 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  min="0"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-3 text-neutral-600 hover:text-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            At least one variant with stock quantity is required. Leave price empty to use the base product price
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" isLoading={loading}>
            Save Changes
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

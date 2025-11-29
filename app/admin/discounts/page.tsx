'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Discount } from '@/types';
import { Plus, Edit, Trash2, Percent, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; discount: Discount | null }>({
    isOpen: false,
    discount: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; discount: Discount | null }>({
    isOpen: false,
    discount: null,
  });
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    value: '',
    active: true,
    starts_at: '',
    expires_at: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  async function fetchDiscounts() {
    setLoading(true);
    const { data } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setDiscounts(data);
    }
    setLoading(false);
  }

  const openCreateModal = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      value: '',
      active: true,
      starts_at: '',
      expires_at: '',
    });
    setEditModal({ isOpen: true, discount: null });
  };

  const openEditModal = (discount: Discount) => {
    setFormData({
      code: discount.code || '',
      description: discount.description || '',
      discount_type: discount.discount_type,
      value: discount.value.toString(),
      active: discount.active,
      starts_at: discount.starts_at ? discount.starts_at.split('T')[0] : '',
      expires_at: discount.expires_at ? discount.expires_at.split('T')[0] : '',
    });
    setEditModal({ isOpen: true, discount });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, discount: null });
  };

  const openDeleteModal = (discount: Discount) => {
    setDeleteModal({ isOpen: true, discount });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, discount: null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.value) {
      toast.error('Please fill in the discount value');
      return;
    }

    setSaving(true);

    try {
      const discountData = {
        code: formData.code || null,
        description: formData.description || null,
        discount_type: formData.discount_type,
        value: parseFloat(formData.value),
        active: formData.active,
        starts_at: formData.starts_at || null,
        expires_at: formData.expires_at || null,
      };

      if (editModal.discount) {
        const { error } = await supabase
          .from('discounts')
          .update(discountData)
          .eq('id', editModal.discount.id);

        if (error) throw error;
        toast.success('Discount updated successfully!');
      } else {
        const { error } = await supabase
          .from('discounts')
          .insert([discountData]);

        if (error) throw error;
        toast.success('Discount created successfully!');
      }

      fetchDiscounts();
      closeEditModal();
    } catch (error: any) {
      console.error('Error saving discount:', error);
      toast.error(error.message || 'Failed to save discount');
    } finally {
      setSaving(false);
    }
  };

  async function deleteDiscount() {
    if (!deleteModal.discount) return;

    setDeleting(true);
    const { error } = await supabase
      .from('discounts')
      .delete()
      .eq('id', deleteModal.discount.id);

    if (error) {
      toast.error('Failed to delete discount');
    } else {
      toast.success('Discount deleted successfully');
      fetchDiscounts();
      closeDeleteModal();
    }
    setDeleting(false);
  }

  const isDiscountActive = (discount: Discount) => {
    if (!discount.active) return false;
    const now = new Date();
    if (discount.starts_at && new Date(discount.starts_at) > now) return false;
    if (discount.expires_at && new Date(discount.expires_at) < now) return false;
    return true;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Discounts
        </h1>
        <Button onClick={openCreateModal}>
          <Plus size={20} className="mr-2" />
          Add Discount
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-200 rounded animate-shimmer" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Valid Period
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
              {discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Percent size={18} className="text-neutral-400" />
                      <span className="font-medium text-neutral-900">
                        {discount.code || <em className="text-neutral-400">No code</em>}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600 capitalize">
                      {discount.discount_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-neutral-900">
                      {discount.discount_type === 'percentage' ? `${discount.value}%` : `${discount.value} TND`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-600">
                      {discount.starts_at && (
                        <div>From: {new Date(discount.starts_at).toLocaleDateString()}</div>
                      )}
                      {discount.expires_at && (
                        <div>Until: {new Date(discount.expires_at).toLocaleDateString()}</div>
                      )}
                      {!discount.starts_at && !discount.expires_at && <em>No limits</em>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        isDiscountActive(discount)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {isDiscountActive(discount) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(discount)}
                        className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(discount)}
                        className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {discounts.length === 0 && (
            <div className="text-center py-12">
              <Percent size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600">No discounts yet</p>
              <Button className="mt-4" onClick={openCreateModal}>
                <Plus size={20} className="mr-2" />
                Add Your First Discount
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        title={editModal.discount ? 'Edit Discount' : 'Create Discount'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Discount Code (Optional)
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g., SUMMER2024"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Leave empty for automatic product discounts
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              placeholder="e.g., Summer sale - 20% off all items"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Value *
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                step="0.01"
                placeholder={formData.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Starts At (Optional)
              </label>
              <input
                type="date"
                name="starts_at"
                value={formData.starts_at}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Expires At (Optional)
              </label>
              <input
                type="date"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
            />
            <label htmlFor="active" className="text-sm text-neutral-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeEditModal}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={saving}>
              {editModal.discount ? 'Update' : 'Create'} Discount
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Delete Discount"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-neutral-900 font-medium">
                Are you sure you want to delete this discount?
              </p>
              {deleteModal.discount && (
                <p className="text-sm text-neutral-600 mt-1">
                  {deleteModal.discount.code || 'This discount'} will be removed from all products.
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
              onClick={deleteDiscount}
              isLoading={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Discount
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

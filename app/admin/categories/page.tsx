'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Tag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; category: Category | null }>({
    isOpen: false,
    category: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: Category | null }>({
    isOpen: false,
    category: null,
  });
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (data) {
      setCategories(data);
    }
    setLoading(false);
  }

  const openCreateModal = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditModal({ isOpen: true, category: null });
  };

  const openEditModal = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setEditModal({ isOpen: true, category });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, category: null });
    setFormData({ name: '', slug: '', description: '' });
  };

  const openDeleteModal = (category: Category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, category: null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      if (editModal.category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
          })
          .eq('id', editModal.category.id);

        if (error) throw error;
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([
            {
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
            },
          ]);

        if (error) throw error;
        toast.success('Category created successfully!');
      }

      fetchCategories();
      closeEditModal();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  async function deleteCategory() {
    if (!deleteModal.category) return;

    setDeleting(true);
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', deleteModal.category.id);

    if (error) {
      toast.error('Failed to delete category');
    } else {
      toast.success('Category deleted successfully');
      fetchCategories();
      closeDeleteModal();
    }
    setDeleting(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Categories
        </h1>
        <Button onClick={openCreateModal}>
          <Plus size={20} className="mr-2" />
          Add Category
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
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={18} className="text-neutral-400" />
                      <span className="font-medium text-neutral-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{category.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">
                      {category.description || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
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

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Tag size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600">No categories yet</p>
              <Button className="mt-4" onClick={openCreateModal}>
                <Plus size={20} className="mr-2" />
                Add Your First Category
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        title={editModal.category ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              Auto-generated from name
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
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeEditModal}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={saving}>
              {editModal.category ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Delete Category"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-neutral-900 font-medium">
                Are you sure you want to delete this category?
              </p>
              {deleteModal.category && (
                <p className="text-sm text-neutral-600 mt-1">
                  &quot;{deleteModal.category.name}&quot; will be permanently removed.
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
              onClick={deleteCategory}
              isLoading={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

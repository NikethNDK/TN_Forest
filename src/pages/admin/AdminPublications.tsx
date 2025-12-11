import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import {
  getPublications,
  addCategory,
  deleteCategory,
  addPublication,
  updatePublication,
  deletePublication
} from '../../services/admin/adminDataService';
import { uploadPDFFile } from '../../services/admin/fileUploadService';
import Modal from '../../components/admin/Modal';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { FormField, EmptyState } from '../../components/common';
import type { Publication } from '../../types';

const AdminPublications: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [publications, setPublications] = useState(getPublications());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    category: '',
    journal: '',
    description: '',
    pdfUrl: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', showForm: false });
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deletingPublicationId, setDeletingPublicationId] = useState<number | null>(null);

  const filteredPublications = publications.items.filter((pub: Publication) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCategory = () => {
    if (categoryForm.name.trim()) {
      const updated = addCategory(categoryForm.name.trim());
      setPublications({ ...publications, categories: updated });
      setCategoryForm({ name: '', showForm: false });
      showToast('Category added successfully', 'success');
    } else {
      showToast('Please enter a category name', 'error');
    }
  };

  const handleDeleteCategory = (category: string) => {
    confirmation.confirm(
      {
        title: 'Delete Category',
        message: `Are you sure you want to delete the category "${category}"? Publications in this category will not be deleted.`,
        variant: 'warning'
      },
      () => {
        setDeletingCategory(category);
        try {
          const updated = deleteCategory(category);
          setPublications({ ...publications, categories: updated });
          showToast('Category deleted successfully', 'success');
        } catch (error) {
          showToast('Failed to delete category', 'error');
        } finally {
          setDeletingCategory(null);
        }
      }
    );
  };

  const handleAddPublication = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      category: publications.categories[0] || '',
      journal: '',
      description: '',
      pdfUrl: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditPublication = (id: number) => {
    const pub = publications.items.find((p: Publication) => p.id === id);
    if (pub) {
      setFormData({
        title: pub.title,
        year: pub.year,
        category: pub.category,
        journal: pub.journal || '',
        description: pub.description || '',
        pdfUrl: pub.pdfUrl || ''
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleSavePublication = async () => {
    if (!formData.title || !formData.category) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingId !== null) {
        const updated = updatePublication(editingId, formData);
        setPublications({ ...publications, items: updated });
        showToast('Publication updated successfully', 'success');
      } else {
        const updated = addPublication(formData);
        setPublications({ ...publications, items: updated });
        showToast('Publication added successfully', 'success');
      }
      handleCancelPublication();
    } catch (error) {
      showToast('Failed to save publication', 'error');
    }
  };

  const handleCancelPublication = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      category: '',
      journal: '',
      description: '',
      pdfUrl: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeletePublication = (id: number) => {
    confirmation.confirm(
      {
        title: 'Delete Publication',
        message: 'Are you sure you want to delete this publication?',
        variant: 'danger'
      },
      () => {
        setDeletingPublicationId(id);
        try {
          const updated = deletePublication(id);
          setPublications({ ...publications, items: updated });
          showToast('Publication deleted successfully', 'success');
        } catch (error) {
          showToast('Failed to delete publication', 'error');
        } finally {
          setDeletingPublicationId(null);
        }
      }
    );
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadPDFFile(file, 'Publications');
        if (result.success && result.path) {
          setFormData({ ...formData, pdfUrl: result.path });
          showToast('PDF uploaded successfully', 'success');
        } else {
          showToast(result.error || 'Failed to upload PDF', 'error');
        }
      } catch (error) {
        showToast('Failed to upload PDF', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.close}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title || 'Confirm Action'}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
        isLoading={deletingCategory !== null || deletingPublicationId !== null}
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Publications Management</h1>
        <p className="text-gray-600">Manage publication categories and listings</p>
      </div>

      <div className="space-y-8">
        {/* Categories Management */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-900">Categories</h2>
            <button
              onClick={() => setCategoryForm({ name: '', showForm: true })}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>

          <Modal
            isOpen={categoryForm.showForm}
            onClose={() => setCategoryForm({ name: '', showForm: false })}
            title="Add Category"
            size="sm"
          >
            <div className="space-y-4">
              <FormField label="Category Name" required>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Research Paper"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </FormField>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setCategoryForm({ name: '', showForm: false })}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>

          <div className="flex flex-wrap gap-2">
            {publications.categories.map((category: string) => (
              <div
                key={category}
                className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  disabled={deletingCategory === category}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publications Management */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-900">Publications</h2>
            <button
              onClick={handleAddPublication}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Publication
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {publications.categories.map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Publication Form Modal */}
          <Modal
            isOpen={showForm}
            onClose={handleCancelPublication}
            title={editingId !== null ? 'Edit Publication' : 'Add Publication'}
            size="lg"
          >
            <div className="space-y-4">
                <FormField label="Title" required>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Year">
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </FormField>
                  <FormField label="Category" required>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {publications.categories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
                <FormField label="Journal / Publication Source">
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    placeholder="e.g., ஓர் எளிய வழிகாட்டி"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </FormField>
                <FormField label="Description">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </FormField>
                <FormField label="PDF URL or Upload">
                  <input
                    type="text"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="Enter PDF URL or upload file"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </FormField>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSavePublication}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelPublication}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </Modal>

          {/* Publications List */}
          <div className="space-y-4">
            {filteredPublications.map((publication: Publication) => (
              <div
                key={publication.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-green-900">{publication.title}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {publication.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>Year: {publication.year}</span>
                    </div>
                    {publication.description && (
                      <p className="text-gray-600 mb-2">{publication.description}</p>
                    )}
                    {publication.pdfUrl && (
                      <a
                        href={publication.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditPublication(publication.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePublication(publication.id)}
                      disabled={deletingPublicationId === publication.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPublications.length === 0 && (
              <EmptyState message="No publications found matching your criteria." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPublications;


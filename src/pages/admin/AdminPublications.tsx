import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import {
  addPublication,
  updatePublication,
  deletePublication,
  subscribeToPublications
} from '../../services/firebase/publicationService';
import {
  getCategories,
  addCategory,
  deleteCategory
} from '../../services/firebase/publicationCategoryService';
import { uploadPDFFile } from '../../services/admin/fileUploadService';
import { deleteCloudinaryImage } from '../../config/firebase';
import Modal from '../../components/admin/Modal';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { FormField, EmptyState } from '../../components/common';
import type { Publication } from '../../types';

const AdminPublications: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingPublications, setIsLoadingPublications] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    category: '',
    journal: '',
    description: '',
    pdfUrl: '',
    pdfPublicId: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', showForm: false });
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deletingPublicationId, setDeletingPublicationId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories', 'error');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Subscribe to publications for real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToPublications(
      (pubs) => {
        setPublications(pubs);
        setIsLoadingPublications(false);
      },
      (error) => {
        console.error('Error in publications subscription:', error);
        setIsLoadingPublications(false);
        showToast('Failed to load publications', 'error');
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredPublications = publications.filter((pub: Publication) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCategory = async () => {
    if (categoryForm.name.trim()) {
      try {
        const updated = await addCategory(categoryForm.name.trim());
        setCategories(updated);
        setCategoryForm({ name: '', showForm: false });
        showToast('Category added successfully', 'success');
      } catch (error) {
        showToast('Failed to add category', 'error');
      }
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
      async () => {
        setDeletingCategory(category);
        try {
          const updated = await deleteCategory(category);
          setCategories(updated);
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
      category: categories[0] || '',
      journal: '',
      description: '',
      pdfUrl: '',
      pdfPublicId: ''
    });
    setEditingId(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setShowForm(true);
  };

  const handleEditPublication = (id: string) => {
    const pub = publications.find((p: Publication) => p.id === id);
    if (pub) {
      setFormData({
        title: pub.title,
        year: pub.year,
        category: pub.category,
        journal: pub.journal || '',
        description: pub.description || '',
        pdfUrl: pub.pdfUrl || '',
        pdfPublicId: pub.pdfPublicId || ''
      });
      setEditingId(id);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(null);
      setShowForm(true);
    }
  };

  const handleSavePublication = async () => {
    if (!formData.title || !formData.category) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (isUploading) {
      showToast('Please wait for PDF upload to complete', 'error');
      return;
    }

    try {
      if (editingId !== null) {
        await updatePublication(editingId, {
          title: formData.title,
          year: formData.year,
          category: formData.category,
          journal: formData.journal,
          description: formData.description,
          pdfUrl: formData.pdfUrl,
          pdfPublicId: formData.pdfPublicId
        });
        showToast('Publication updated successfully', 'success');
      } else {
        await addPublication({
          title: formData.title,
          year: formData.year,
          category: formData.category,
          journal: formData.journal,
          description: formData.description,
          pdfUrl: formData.pdfUrl,
          pdfPublicId: formData.pdfPublicId
        });
        showToast('Publication added successfully', 'success');
      }
      handleCancelPublication();
    } catch (error) {
      console.error('Error saving publication:', error);
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
      pdfUrl: '',
      pdfPublicId: ''
    });
    setEditingId(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setShowForm(false);
  };

  const handleDeletePublication = (id: string) => {
    confirmation.confirm(
      {
        title: 'Delete Publication',
        message: 'Are you sure you want to delete this publication?',
        variant: 'danger'
      },
      async () => {
        setDeletingPublicationId(id);
        try {
          // Find publication to get pdfPublicId
          const pub = publications.find((p: Publication) => p.id === id);
          
          // Delete PDF from Cloudinary if it exists
          if (pub?.pdfPublicId) {
            try {
              await deleteCloudinaryImage({ publicId: pub.pdfPublicId });
            } catch (cloudinaryError) {
              // Log but continue with Firestore deletion
              console.error('Error deleting PDF from Cloudinary:', cloudinaryError);
            }
          }
          
          // Delete from Firestore
          await deletePublication(id);
          showToast('Publication deleted successfully', 'success');
        } catch (error) {
          console.error('Error deleting publication:', error);
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
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      try {
        const result = await uploadPDFFile(
          file, 
          'tn-forest/publications',
          (progress) => {
            setUploadProgress(progress);
          }
        );
        
        if (result.success && result.path) {
          setFormData({ 
            ...formData, 
            pdfUrl: result.path,
            pdfPublicId: result.publicId || ''
          });
          setUploadProgress(100);
          showToast('PDF uploaded successfully', 'success');
        } else {
          const errorMsg = result.error || 'Failed to upload PDF';
          setUploadError(errorMsg);
          showToast(errorMsg, 'error');
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to upload PDF';
        setUploadError(errorMsg);
        showToast('Failed to upload PDF', 'error');
      } finally {
        setIsUploading(false);
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
            {isLoadingCategories ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : (
              categories.map((category: string) => (
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
            ))
            )}
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
                {categories.map((category: string) => (
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
                      {categories.map((cat: string) => (
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
                    onChange={(e) => {
                      setFormData({ ...formData, pdfUrl: e.target.value });
                      setUploadError(null);
                    }}
                    placeholder="Enter PDF URL or upload file"
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed mb-2"
                  />
                  
                  {/* Upload Progress/Status */}
                  {isUploading && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-700 font-medium">
                          Uploading PDF... {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {!isUploading && formData.pdfUrl && !uploadError && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          PDF uploaded successfully
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {uploadError && !isUploading && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700 font-medium">
                          {uploadError}
                        </span>
                      </div>
                    </div>
                  )}
                </FormField>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSavePublication}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    onClick={handleCancelPublication}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </Modal>

          {/* Publications List */}
          <div className="space-y-4">
            {isLoadingPublications ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading publications...</p>
              </div>
            ) : filteredPublications.length > 0 ? (
              filteredPublications.map((publication: Publication, index: number) => (
                <div
                  key={publication.id || `pub-${index}`}
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
                    {publication.id && (
                      <>
                        <button
                          onClick={() => handleEditPublication(publication.id!)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePublication(publication.id!)}
                          disabled={deletingPublicationId === publication.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
            ) : (
              <EmptyState message="No publications found matching your criteria." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPublications;


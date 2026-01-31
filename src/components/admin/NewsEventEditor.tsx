import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import type { NewsItem, Event } from '../../types';
import Modal from './Modal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useConfirmation } from '../../hooks/useConfirmation';
import { uploadPDFFile } from '../../services/admin/fileUploadService';

interface NewsEventEditorProps<T extends NewsItem | Event> {
  items: T[];
  onItemsChange?: (items: T[]) => void;  // Optional for backward compatibility
  onAdd?: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<void>;
  onEdit?: (id: string, item: Partial<T>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  title: string;
  itemType: 'news' | 'event';
  isLoading?: boolean;
}

const NewsEventEditor = <T extends NewsItem | Event>({
  items,
  onItemsChange,
  onAdd,
  onEdit,
  onDelete,
  title,
  itemType,
  isLoading = false
}: NewsEventEditorProps<T>) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadPdfProgress, setUploadPdfProgress] = useState(0);
  const [uploadPdfError, setUploadPdfError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const confirmation = useConfirmation();

  const handleAdd = () => {
    const newItem = {
      date: '',
      title: '',
      excerpt: '',
      link: undefined,
      pdfUrl: undefined,
      pdfPublicId: undefined
    } as T;
    setFormData(newItem);
    setEditingId(null);
    setShowForm(true);
    setUploadPdfError(null);
    pdfInputRef.current?.setAttribute('value', '');
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setFormData({ ...item });
      setEditingId(id);
      setShowForm(true);
      setUploadPdfError(null);
      pdfInputRef.current?.setAttribute('value', '');
    }
  };

  const handleLinkChange = (value: string) => {
    const trimmed = value.trim() || undefined;
    setFormData({
      ...formData!,
      link: trimmed,
      pdfUrl: trimmed ? undefined : formData?.pdfUrl,
      pdfPublicId: trimmed ? undefined : formData?.pdfPublicId
    } as T);
    if (trimmed && pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    if (file.type !== 'application/pdf') {
      setUploadPdfError('Please select a PDF file.');
      return;
    }
    setUploadPdfError(null);
    setIsUploadingPdf(true);
    setUploadPdfProgress(0);
    try {
      const result = await uploadPDFFile(
        file,
        'tn-forest/news-events-pdf',
        (progress) => setUploadPdfProgress(progress)
      );
      if (result.success && result.path && result.publicId !== undefined) {
        setFormData({
          ...formData,
          pdfUrl: result.path,
          pdfPublicId: result.publicId || '',
          link: undefined
        } as T);
      } else {
        setUploadPdfError(result.error || 'Failed to upload PDF');
      }
    } catch (err) {
      setUploadPdfError(err instanceof Error ? err.message : 'Failed to upload PDF');
    } finally {
      setIsUploadingPdf(false);
      setUploadPdfProgress(0);
      e.target.value = '';
    }
  };

  const handleRemovePdf = () => {
    setFormData({
      ...formData!,
      pdfUrl: undefined,
      pdfPublicId: undefined
    } as T);
    pdfInputRef.current?.setAttribute('value', '');
    setUploadPdfError(null);
  };

  const handleSave = async () => {
    if (!formData || !formData.title.trim()) return;

    setIsSaving(true);
    try {
      if (editingId && onEdit) {
        await onEdit(editingId, {
          date: formData.date,
          title: formData.title,
          excerpt: formData.excerpt,
          link: formData.link ?? '',
          pdfUrl: formData.pdfUrl ?? '',
          pdfPublicId: formData.pdfPublicId ?? ''
        } as Partial<T>);
      } else if (onAdd) {
        await onAdd({
          date: formData.date,
          title: formData.title,
          excerpt: formData.excerpt,
          link: formData.link ?? '',
          pdfUrl: formData.pdfUrl ?? '',
          pdfPublicId: formData.pdfPublicId ?? ''
        } as Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
      } else if (onItemsChange) {
        // Fallback to old behavior
        if (editingId) {
          const index = items.findIndex(i => i.id === editingId);
          if (index !== -1) {
            const updated = [...items];
            updated[index] = formData;
            onItemsChange(updated);
          }
        } else {
          onItemsChange([...items, formData]);
        }
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving item:', error);
      // Error will be handled by parent component via toast
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.id === id);
    confirmation.confirm(
      {
        title: `Delete ${itemType === 'news' ? 'News' : 'Event'}`,
        message: `Are you sure you want to delete "${item?.title || 'this item'}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      },
      async () => {
        try {
          setDeletingId(id);
          if (onDelete) {
            await onDelete(id);
          } else if (onItemsChange) {
            // Fallback to old behavior
            const updated = items.filter(item => item.id !== id);
            onItemsChange(updated);
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          // Error will be handled by parent component via toast
          throw error;
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.close}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title || 'Confirm Action'}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
        isLoading={deletingId !== null}
      />
      <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-green-900">{title}</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add {itemType === 'news' ? 'News' : 'Event'}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingId !== null ? `Edit ${itemType === 'news' ? 'News' : 'Event'}` : `Add ${itemType === 'news' ? 'News' : 'Event'}`}
        size="md"
        closeOnOutsideClick={false}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={formData?.date || ''}
              onChange={(e) => setFormData({ ...formData!, date: e.target.value } as T)}
              placeholder="e.g., Oct 10, 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData?.title || ''}
              onChange={(e) => setFormData({ ...formData!, title: e.target.value } as T)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              value={formData?.excerpt || ''}
              onChange={(e) => setFormData({ ...formData!, excerpt: e.target.value } as T)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter brief description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link (Optional — use either link or PDF, not both)
            </label>
            <input
              type="text"
              value={formData?.link || ''}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="/news/article-name or https://example.com"
              disabled={!!formData?.pdfUrl}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF (Optional — use either link or PDF, not both)
            </label>
            {formData?.pdfUrl && !isUploadingPdf && (
              <div className="mb-2 p-2 bg-green-50 rounded-lg flex items-center justify-between gap-2">
                <a
                  href={formData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline flex items-center gap-1 truncate"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{formData.pdfUrl.split('/').pop() || 'PDF'}</span>
                </a>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
            {!formData?.pdfUrl && (
              <div className="space-y-2">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfSelect}
                  className="hidden"
                  disabled={!!formData?.link || isUploadingPdf}
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={!!formData?.link || isUploadingPdf}
                  className="relative w-full min-h-[42px] px-4 py-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors overflow-hidden"
                >
                  {isUploadingPdf ? (
                    <>
                      <span className="relative z-10">Uploading… {uploadPdfProgress}%</span>
                      <span
                        className="absolute inset-y-0 left-0 bg-green-200 transition-all duration-300"
                        style={{ width: `${uploadPdfProgress}%` }}
                      />
                    </>
                  ) : (
                    'Choose PDF to upload'
                  )}
                </button>
                {isUploadingPdf && (
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all duration-300"
                      style={{ width: `${uploadPdfProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            {uploadPdfError && <p className="text-sm text-red-600 mt-1">{uploadPdfError}</p>}
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving || !formData?.title.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-3">
        {isLoading && items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Loading {itemType}...</p>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id || Math.random()}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                <h4 className="font-semibold text-green-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.excerpt}</p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                    {item.link}
                  </a>
                )}
                {item.pdfUrl && !item.link && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline inline-flex items-center gap-1">
                    <FileText className="h-4 w-4" /> View PDF
                  </a>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => item.id && handleEdit(item.id)}
                  disabled={!item.id}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id)}
                  disabled={!item.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No {itemType} items yet. Click "Add {itemType === 'news' ? 'News' : 'Event'}" to create one.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default NewsEventEditor;


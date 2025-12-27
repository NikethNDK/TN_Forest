import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { NewsItem, Event } from '../../types';
import Modal from './Modal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useConfirmation } from '../../hooks/useConfirmation';

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
  const confirmation = useConfirmation();

  const handleAdd = () => {
    const newItem = {
      date: '',
      title: '',
      excerpt: '',
      link: undefined
    } as T;
    setFormData(newItem);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setFormData({ ...item });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleSave = async () => {
    if (!formData || !formData.title.trim()) return;

    setIsSaving(true);
    try {
      if (editingId && onEdit) {
        // Edit existing item
        await onEdit(editingId, {
          date: formData.date,
          title: formData.title,
          excerpt: formData.excerpt,
          link: formData.link
        } as Partial<T>);
      } else if (onAdd) {
        // Add new item
        await onAdd({
          date: formData.date,
          title: formData.title,
          excerpt: formData.excerpt,
          link: formData.link
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
              Link (Optional)
            </label>
            <input
              type="text"
              value={formData?.link || ''}
              onChange={(e) => setFormData({ ...formData!, link: e.target.value.trim() || undefined } as T)}
              placeholder="/news/article-name or https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
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


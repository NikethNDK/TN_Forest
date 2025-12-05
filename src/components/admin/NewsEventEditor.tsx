import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { NewsItem, Event } from '../../types';
import Modal from './Modal';

interface NewsEventEditorProps<T extends NewsItem | Event> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  title: string;
  itemType: 'news' | 'event';
}

const NewsEventEditor = <T extends NewsItem | Event>({
  items,
  onItemsChange,
  title,
  itemType
}: NewsEventEditorProps<T>) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    const newItem = {
      date: '',
      title: '',
      excerpt: '',
      link: ''
    } as T;
    setFormData(newItem);
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEdit = (index: number) => {
    setFormData({ ...items[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData) return;

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = formData;
      onItemsChange(updated);
    } else {
      onItemsChange([...items, formData]);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setFormData(null);
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleDelete = (index: number) => {
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      const updated = items.filter((_, i) => i !== index);
      onItemsChange(updated);
    }
  };

  return (
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
        title={editingIndex !== null ? `Edit ${itemType === 'news' ? 'News' : 'Event'}` : `Add ${itemType === 'news' ? 'News' : 'Event'}`}
        size="md"
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
              Link
            </label>
            <input
              type="text"
              value={formData?.link || ''}
              onChange={(e) => setFormData({ ...formData!, link: e.target.value } as T)}
              placeholder="/news/article-name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                <h4 className="font-semibold text-green-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.excerpt}</p>
                <a href={item.link} className="text-sm text-green-600 hover:underline">
                  {item.link}
                </a>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  );
};

export default NewsEventEditor;


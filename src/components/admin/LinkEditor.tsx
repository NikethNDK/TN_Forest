import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ImportantLink } from '../../types';
import ImageUploader from './ImageUploader';
import Modal from './Modal';

interface LinkEditorProps {
  links: ImportantLink[];
  onLinksChange: (links: ImportantLink[]) => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({
  links,
  onLinksChange
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ImportantLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    const newLink: ImportantLink = {
      title: '',
      url: '',
      icon: ''
    };
    setFormData(newLink);
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEdit = (index: number) => {
    setFormData({ ...links[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData) return;

    if (editingIndex !== null) {
      const updated = [...links];
      updated[editingIndex] = formData;
      onLinksChange(updated);
    } else {
      onLinksChange([...links, formData]);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setFormData(null);
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      const updated = links.filter((_, i) => i !== index);
      onLinksChange(updated);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= links.length) return;

    const updated = [...links];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onLinksChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-green-900">Useful Links Carousel</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingIndex !== null ? 'Edit Link' : 'Add Link'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData?.title || ''}
              onChange={(e) => setFormData({ ...formData!, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Tamil Nadu Forest Department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              type="text"
              value={formData?.url || ''}
              onChange={(e) => setFormData({ ...formData!, url: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (URL or upload)
            </label>
            <input
              type="text"
              value={formData?.icon || ''}
              onChange={(e) => setFormData({ ...formData!, icon: e.target.value })}
              placeholder="https://example.com/icon.png or upload image"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
            />
            <ImageUploader
              currentImage={formData?.icon}
              onImageChange={(imagePath) => setFormData({ ...formData!, icon: imagePath })}
              directory="links"
              label="Or upload icon image"
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
        {links.map((link, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === links.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                {link.icon && (
                  <img src={link.icon} alt="" className="w-12 h-12 object-contain" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900">{link.title}</h4>
                  <a href={link.url} className="text-sm text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
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

        {links.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No links yet. Click "Add Link" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkEditor;


import React, { useState } from 'react';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import Modal from './Modal';

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface CustomFieldEditorProps {
  fields: CustomField[];
  onFieldsChange: (fields: CustomField[]) => void;
  label?: string;
}

const CustomFieldEditor: React.FC<CustomFieldEditorProps> = ({
  fields,
  onFieldsChange,
  label = 'Custom Fields'
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const handleAdd = () => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      label: '',
      value: ''
    };
    onFieldsChange([...fields, newField]);
    setEditingId(newField.id);
    setEditingField(newField);
  };

  const handleEdit = (field: CustomField) => {
    setEditingId(field.id);
    setEditingField({ ...field });
  };

  const handleSave = () => {
    if (editingField) {
      const updated = fields.map(f => 
        f.id === editingField.id ? editingField : f
      );
      onFieldsChange(updated);
    }
    setEditingId(null);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingField(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      onFieldsChange(fields.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-green-900">{label}</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Field
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="font-semibold text-green-900">{field.label || 'Untitled Field'}:</span>
                <span className="ml-2 text-gray-600">{field.value || 'No value'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(field)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(field.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <Modal
          isOpen={editingId !== null}
          onClose={handleCancel}
          title={editingId ? 'Edit Custom Field' : 'Add Custom Field'}
          size="sm"
        >
          {editingField && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Label (Title) *
                </label>
                <input
                  type="text"
                  value={editingField.label || ''}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  placeholder="e.g., Area, District, Range"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value (Content) *
                </label>
                <input
                  type="text"
                  value={editingField.value || ''}
                  onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  placeholder="Enter the value"
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
          )}
        </Modal>

        {fields.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>No custom fields yet. Click "Add Field" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomFieldEditor;


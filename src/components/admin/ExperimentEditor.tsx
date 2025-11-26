import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import type { Experiment } from '../../types';
import ImageUploader from './ImageUploader';
import { uploadPDFFile } from '../../services/admin/fileUploadService';

interface ExperimentEditorProps {
  experiments: Experiment[];
  onExperimentsChange: (experiments: Experiment[]) => void;
}

const ExperimentEditor: React.FC<ExperimentEditorProps> = ({
  experiments,
  onExperimentsChange
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Experiment>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    imagePath: undefined,
    pdfPath: undefined
  });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      imagePath: undefined,
      pdfPath: undefined
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (experiment: Experiment) => {
    setFormData({
      title: experiment.title,
      description: experiment.description || '',
      year: experiment.year || new Date().getFullYear(),
      imagePath: experiment.imagePath,
      pdfPath: experiment.pdfPath
    });
    setEditingId(experiment.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    const experimentData: Experiment = {
      id: editingId || Math.max(...experiments.map(e => e.id || 0), 0) + 1,
      title: formData.title!,
      description: formData.description,
      year: formData.year || new Date().getFullYear(),
      imagePath: formData.imagePath,
      pdfPath: formData.pdfPath
    };

    if (editingId !== null) {
      const updated = experiments.map(e => 
        e.id === editingId ? experimentData : e
      );
      onExperimentsChange(updated);
    } else {
      onExperimentsChange([...experiments, experimentData]);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      imagePath: undefined,
      pdfPath: undefined
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this experiment?')) {
      onExperimentsChange(experiments.filter(e => e.id !== id));
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadPDFFile(file, 'experiments');
      if (result.success && result.path) {
        setFormData({ ...formData, pdfPath: result.path });
      } else {
        alert(result.error || 'Failed to upload PDF');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-green-900">Experiments</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Experiment
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-green-200">
          <h4 className="font-semibold text-green-900 mb-4">
            {editingId !== null ? 'Edit' : 'Add'} Experiment
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={formData.year || new Date().getFullYear()}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <ImageUploader
                currentImage={formData.imagePath}
                onImageChange={(imagePath) => setFormData({ ...formData, imagePath })}
                directory="experiments"
                label="Experiment Image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF Link (URL or upload)
              </label>
              <input
                type="text"
                value={formData.pdfPath || ''}
                onChange={(e) => setFormData({ ...formData, pdfPath: e.target.value })}
                placeholder="Enter PDF URL or upload file"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePDFUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {experiments.map((experiment) => (
          <div
            key={experiment.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {experiment.imagePath && (
                <img
                  src={experiment.imagePath}
                  alt={experiment.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">{experiment.title}</h4>
                {experiment.year && (
                  <p className="text-sm text-gray-500 mb-2">Year: {experiment.year}</p>
                )}
                {experiment.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{experiment.description}</p>
                )}
                {experiment.pdfPath && (
                  <a
                    href={experiment.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    View PDF
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(experiment)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(experiment.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {experiments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No experiments yet. Click "Add Experiment" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentEditor;


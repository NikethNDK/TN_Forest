import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import type { Experiment } from '../../types';
import ImageUploader from './ImageUploader';
import { uploadPDFFile } from '../../services/admin/fileUploadService';
import {
  subscribeToExperiments,
  addExperiment,
  updateExperiment,
  deleteExperiment
} from '../../services/firebase/experimentService';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Modal from './Modal';

interface ExperimentEditorProps {
  divisionId: string;
  centerId: string;
}

const ExperimentEditor: React.FC<ExperimentEditorProps> = ({
  divisionId,
  centerId
}) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experiment>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    imageUrl: undefined,
    imagePublicId: undefined,
    pdfUrl: undefined,
    pdfPublicId: undefined
  });
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirmation = useConfirmation();

  // Subscribe to experiments
  useEffect(() => {
    if (!divisionId || !centerId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToExperiments(
      divisionId,
      centerId,
      (experimentsData) => {
        setExperiments(experimentsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading experiments:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [divisionId, centerId]);

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      imageUrl: undefined,
      imagePublicId: undefined,
      pdfUrl: undefined,
      pdfPublicId: undefined
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (experiment: Experiment) => {
    setFormData({
      title: experiment.title,
      description: experiment.description || '',
      year: experiment.year || new Date().getFullYear(),
      imageUrl: experiment.imageUrl || experiment.imagePath,
      imagePublicId: experiment.imagePublicId,
      pdfUrl: experiment.pdfUrl || experiment.pdfPath,
      pdfPublicId: experiment.pdfPublicId
    });
    setEditingId(experiment.id?.toString() || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    if (!divisionId || !centerId) {
      alert('Division or center ID missing');
      return;
    }

    try {
      const experimentData: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title!,
        description: formData.description,
        year: formData.year || new Date().getFullYear(),
        imageUrl: formData.imageUrl,
        imagePublicId: formData.imagePublicId,
        pdfUrl: formData.pdfUrl,
        pdfPublicId: formData.pdfPublicId
      };

      if (editingId) {
        await updateExperiment(divisionId, centerId, editingId, experimentData);
      } else {
        await addExperiment(divisionId, centerId, experimentData);
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error saving experiment:', error);
      alert('Failed to save experiment');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      imageUrl: undefined,
      imagePublicId: undefined,
      pdfUrl: undefined,
      pdfPublicId: undefined
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (experiment: Experiment) => {
    if (!experiment.id) return;
    
    const experimentId = experiment.id.toString();
    confirmation.confirm(
      {
        title: 'Delete Experiment',
        message: 'Are you sure you want to delete this experiment? The PDF and image will also be deleted from Cloudinary.',
        variant: 'danger'
      },
      async () => {
        setDeletingId(experimentId);
        try {
          await deleteExperiment(
            divisionId,
            centerId,
            experimentId,
            experiment.pdfPublicId,
            experiment.imagePublicId
          );
        } catch (error) {
          console.error('Error deleting experiment:', error);
          alert('Failed to delete experiment');
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadPDFFile(file, 'tn-forest/documents/experiments');
        if (result.success && result.path && result.publicId) {
          setFormData({ 
            ...formData, 
            pdfUrl: result.path,
            pdfPublicId: result.publicId
          });
        } else {
          alert(result.error || 'Failed to upload PDF');
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('Failed to upload PDF');
      }
    }
  };

  return (
    <div className="space-y-4">
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

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingId !== null ? 'Edit Experiment' : 'Add Experiment'}
        size="lg"
      >
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
              placeholder="Enter experiment title"
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
              placeholder="Enter experiment description"
            />
          </div>
          <div>
            <ImageUploader
              currentImage={formData.imageUrl}
              onImageChange={(imagePath, publicId) => {
                setFormData({ 
                  ...formData, 
                  imageUrl: imagePath,
                  imagePublicId: publicId
                });
              }}
              directory="tn-forest/images/experiments"
              label="Experiment Image"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF (Upload file)
            </label>
            {formData.pdfUrl && (
              <div className="mb-2 p-2 bg-green-50 rounded-lg">
                <a
                  href={formData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Current PDF: {formData.pdfUrl.split('/').pop()}
                </a>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
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

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <p>Loading experiments...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiments.map((experiment) => {
            const experimentId = experiment.id?.toString();
            const imageUrl = experiment.imageUrl || experiment.imagePath;
            const pdfUrl = experiment.pdfUrl || experiment.pdfPath;
            
            return (
              <div
                key={experimentId || experiment.title}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
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
                    {pdfUrl && (
                      <a
                        href={pdfUrl}
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
                      onClick={() => handleDelete(experiment)}
                      disabled={deletingId === experimentId}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {experiments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No experiments yet. Click "Add Experiment" to create one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperimentEditor;

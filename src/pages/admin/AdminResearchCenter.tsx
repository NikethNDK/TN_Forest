import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react';
import {
  subscribeToDivision
} from '../../services/firebase/divisionService';
import {
  subscribeToResearchCenters,
  deleteResearchCenter
} from '../../services/firebase/researchCenterService';
import {
  subscribeToGeneticResources,
  addGeneticResource,
  updateGeneticResource,
  deleteGeneticResource
} from '../../services/firebase/geneticResourceService';
import { uploadPDFFile } from '../../services/admin/fileUploadService';
import { deleteFileFromStorage } from '../../services/firebase/storageService';
import ExperimentEditor from '../../components/admin/ExperimentEditor';
import Modal from '../../components/admin/Modal';
import { FormField } from '../../components/common';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import type { ResearchCenter, Division, GeneticResource } from '../../types';

const GENETIC_RESOURCES_PDF_DIR = 'tn-forest/documents/genetic-resources';

const AdminResearchCenter: React.FC = () => {
  const { divisionSlug, centerId } = useParams<{ divisionSlug: string; centerId: string }>();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [deleting, setDeleting] = useState(false);
  
  const [division, setDivision] = useState<Division | null>(null);
  const [center, setCenter] = useState<ResearchCenter | null>(null);
  const [geneticResources, setGeneticResources] = useState<GeneticResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCenter, setIsLoadingCenter] = useState(true);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [resourceFormData, setResourceFormData] = useState({ name: '', pdfUrl: '', pdfPublicId: '' });
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  // Subscribe to division
  useEffect(() => {
    if (!divisionSlug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToDivision(
      divisionSlug,
      (divisionData) => {
        setDivision(divisionData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading division:', error);
        showToast('Failed to load division', 'error');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [divisionSlug]);

  // Subscribe to research centers to find the specific center
  useEffect(() => {
    if (!division?.id || !centerId) {
      setIsLoadingCenter(false);
      return;
    }

    setIsLoadingCenter(true);
    const unsubscribe = subscribeToResearchCenters(
      division.id,
      (centers) => {
        const foundCenter = centers.find(c => c.id === centerId || c.id?.toString() === centerId);
        setCenter(foundCenter || null);
        setIsLoadingCenter(false);
      },
      (error) => {
        console.error('Error loading research center:', error);
        showToast('Failed to load research center', 'error');
        setIsLoadingCenter(false);
      }
    );

    return () => unsubscribe();
  }, [division?.id, centerId]);

  // Subscribe to genetic resources for this center
  useEffect(() => {
    if (!division?.id || !centerId) return;
    const divisionId = division.id.toString();
    const unsubscribe = subscribeToGeneticResources(
      divisionId,
      centerId,
      (resources) => setGeneticResources(resources),
      (error) => {
        console.error('Error loading genetic resources:', error);
        showToast('Failed to load genetic resources', 'error');
      }
    );
    return () => unsubscribe();
  }, [division?.id, centerId]);

  const handleAddResource = () => {
    setResourceFormData({ name: '', pdfUrl: '', pdfPublicId: '' });
    setEditingResourceId(null);
    setIsUploadingPdf(false);
    setUploadProgress(0);
    setUploadError(null);
    setShowResourceForm(true);
  };

  const handleEditResource = (resource: GeneticResource) => {
    if (!resource.id) return;
    setResourceFormData({
      name: resource.name,
      pdfUrl: resource.pdfUrl || '',
      pdfPublicId: resource.pdfPublicId || ''
    });
    setEditingResourceId(resource.id);
    setIsUploadingPdf(false);
    setUploadProgress(0);
    setUploadError(null);
    setShowResourceForm(true);
  };

  const handleSaveResource = async () => {
    if (!resourceFormData.name.trim()) {
      showToast('Please enter a name', 'error');
      return;
    }
    if (!division?.id || !centerId) return;
    if (isUploadingPdf) {
      showToast('Please wait for PDF upload to complete', 'error');
      return;
    }
    const divisionId = division.id.toString();
    try {
      if (editingResourceId) {
        await updateGeneticResource(divisionId, centerId, editingResourceId, {
          name: resourceFormData.name.trim(),
          pdfUrl: resourceFormData.pdfUrl,
          pdfPublicId: resourceFormData.pdfPublicId || undefined
        });
        showToast('Genetic resource updated successfully', 'success');
      } else {
        await addGeneticResource(divisionId, centerId, {
          name: resourceFormData.name.trim(),
          pdfUrl: resourceFormData.pdfUrl,
          pdfPublicId: resourceFormData.pdfPublicId || undefined
        });
        showToast('Genetic resource added successfully', 'success');
      }
      setShowResourceForm(false);
      setEditingResourceId(null);
      setResourceFormData({ name: '', pdfUrl: '', pdfPublicId: '' });
    } catch (error) {
      console.error('Error saving genetic resource:', error);
      showToast('Failed to save genetic resource', 'error');
    }
  };

  const handleCancelResource = () => {
    setShowResourceForm(false);
    setEditingResourceId(null);
    setResourceFormData({ name: '', pdfUrl: '', pdfPublicId: '' });
    setIsUploadingPdf(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleDeleteResource = (resource: GeneticResource) => {
    if (!resource.id || !division?.id) return;
    confirmation.confirm(
      {
        title: 'Delete Genetic Resource',
        message: `Are you sure you want to delete "${resource.name}"?`,
        variant: 'danger'
      },
      async () => {
        setDeletingResourceId(resource.id!);
        try {
          await deleteGeneticResource(
            division.id.toString(),
            centerId!,
            resource.id,
            resource.pdfUrl,
            resource.pdfPublicId
          );
          showToast('Genetic resource deleted successfully', 'success');
        } catch (error) {
          console.error('Error deleting genetic resource:', error);
          showToast('Failed to delete genetic resource', 'error');
        } finally {
          setDeletingResourceId(null);
        }
      }
    );
  };

  const handleResourcePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPdf(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
      const result = await uploadPDFFile(file, GENETIC_RESOURCES_PDF_DIR, (p) => setUploadProgress(p));
      if (result.success && result.path) {
        setResourceFormData(prev => ({
          ...prev,
          pdfUrl: result.path,
          pdfPublicId: result.publicId || ''
        }));
        setUploadProgress(100);
        showToast('PDF uploaded successfully', 'success');
      } else {
        const err = result.error || 'Failed to upload PDF';
        setUploadError(err);
        showToast(err, 'error');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      const err = error instanceof Error ? error.message : 'Failed to upload PDF';
      setUploadError(err);
      showToast('Failed to upload PDF', 'error');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleDeleteCenter = () => {
    confirmation.confirm(
      {
        title: 'Delete Research Center',
        message: 'Are you sure you want to delete this research center? All experiments will also be deleted.',
        variant: 'danger'
      },
      async () => {
        if (!division?.id || !center || !center.id) return;
        
        const centerIdStr = center.id.toString();
        setDeleting(true);
        try {
          await deleteResearchCenter(
            division.id,
            centerIdStr,
            center.imagePublicId
          );
          showToast('Research center deleted successfully', 'success');
          navigate(`/admin/divisions/${divisionSlug}`);
        } catch (error) {
          console.error('Error deleting research center:', error);
          showToast('Failed to delete research center', 'error');
        } finally {
          setDeleting(false);
        }
      }
    );
  };

  const handleEditCenter = () => {
    // Navigate back to division page and trigger edit modal
    navigate(`/admin/divisions/${divisionSlug}?editCenter=${centerId}`);
  };

  if (isLoading || isLoadingCenter) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!center || !division) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Research center not found</p>
          <button
            onClick={() => navigate(`/admin/divisions/${divisionSlug}`)}
            className="mt-4 text-green-600 hover:underline"
          >
            Go back to division
          </button>
        </div>
      </div>
    );
  }

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
        isLoading={deleting || deletingResourceId !== null}
      />
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/admin/divisions/${divisionSlug}`)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {division.name || 'Division'}
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-green-900 mb-2">{center.name}</h1>
            <p className="text-gray-600">{center.location || '—'}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditCenter}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Center
            </button>
            <button
              onClick={handleDeleteCenter}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Center
            </button>
          </div>
        </div>
      </div>

      {/* Center Details */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Center Details</h2>
        
        <div className="space-y-4">
          {center.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{center.description}</p>
            </div>
          )}

          {center.coordinates && (center.coordinates.lat !== 0 || center.coordinates.lng !== 0) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Coordinates</h3>
              <p className="text-gray-600">
                {center.coordinates.lat}, {center.coordinates.lng}
              </p>
            </div>
          )}

          {center.area && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Area</h3>
              <p className="text-gray-600">{center.area}</p>
            </div>
          )}

          {center.district && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">District</h3>
              <p className="text-gray-600">{center.district}</p>
            </div>
          )}

          {center.range && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Range</h3>
              <p className="text-gray-600">{center.range}</p>
            </div>
          )}

          {center.phone && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Phone</h3>
              <p className="text-gray-600">{center.phone}</p>
            </div>
          )}

          {center.email && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Email</h3>
              <p className="text-gray-600">{center.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Genetic Resources */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">Genetic Resources</h2>
          <button
            onClick={handleAddResource}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Genetic Resource
          </button>
        </div>
        {geneticResources.length === 0 ? (
          <p className="text-gray-500">No genetic resources yet. Click &quot;Add Genetic Resource&quot; to add one.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {geneticResources.map((resource) => (
              <div
                key={resource.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex flex-col"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-semibold text-green-900 flex-1 min-w-0 truncate" title={resource.name}>
                    {resource.name}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource)}
                      disabled={deletingResourceId === resource.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {resource.pdfUrl && (
                  <a
                    href={resource.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:underline mt-auto"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    View PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Genetic Resource Form Modal */}
      <Modal
        isOpen={showResourceForm}
        onClose={handleCancelResource}
        title={editingResourceId ? 'Edit Genetic Resource' : 'Add Genetic Resource'}
        size="lg"
        closeOnOutsideClick={false}
      >
        <div className="space-y-4">
          <FormField label="Name" required>
            <input
              type="text"
              value={resourceFormData.name}
              onChange={(e) => setResourceFormData({ ...resourceFormData, name: e.target.value })}
              placeholder="e.g., Seed Lot Catalogue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </FormField>
          <FormField label="PDF (upload or URL)">
            <input
              type="text"
              value={resourceFormData.pdfUrl}
              onChange={(e) => {
                setResourceFormData({ ...resourceFormData, pdfUrl: e.target.value });
                setUploadError(null);
              }}
              placeholder="Enter PDF URL or upload file below"
              disabled={isUploadingPdf}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2 disabled:bg-gray-100"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResourcePdfUpload}
              disabled={isUploadingPdf}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            />
            {isUploadingPdf && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">Uploading PDF... {uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
            {!isUploadingPdf && resourceFormData.pdfUrl && !uploadError && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">PDF ready</span>
              </div>
            )}
            {uploadError && !isUploadingPdf && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700 font-medium">{uploadError}</span>
              </div>
            )}
          </FormField>
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSaveResource}
              disabled={isUploadingPdf}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploadingPdf ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                'Save'
              )}
            </button>
            <button
              onClick={handleCancelResource}
              disabled={isUploadingPdf}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Experiments */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {division.id && center.id && (
          <ExperimentEditor
            divisionId={division.id}
            centerId={center.id.toString()}
          />
        )}
      </div>
    </div>
  );
};

export default AdminResearchCenter;

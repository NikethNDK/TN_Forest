import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import {
  getDivision,
  getResearchCenter,
  updateResearchCenter,
  deleteResearchCenter
} from '../../services/admin/adminDataService';
import ExperimentEditor from '../../components/admin/ExperimentEditor';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import type { Experiment, ResearchCenter } from '../../types';

const AdminResearchCenter: React.FC = () => {
  const { divisionSlug, centerId } = useParams<{ divisionSlug: string; centerId: string }>();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [deleting, setDeleting] = useState(false);
  
  const [center, setCenter] = useState<ResearchCenter | undefined>(
    divisionSlug && centerId 
      ? getResearchCenter(divisionSlug, parseInt(centerId)) 
      : undefined
  );

  useEffect(() => {
    if (divisionSlug && centerId) {
      const researchCenter = getResearchCenter(divisionSlug, parseInt(centerId));
      setCenter(researchCenter);
    }
  }, [divisionSlug, centerId]);

  const handleExperimentsChange = (experiments: Experiment[]) => {
    if (center && divisionSlug) {
      updateResearchCenter(divisionSlug, center.id, { experiments });
      setCenter({ ...center, experiments });
    }
  };

  const handleDeleteCenter = () => {
    confirmation.confirm(
      {
        title: 'Delete Research Center',
        message: 'Are you sure you want to delete this research center? All experiments will also be deleted.',
        variant: 'danger'
      },
      () => {
        if (divisionSlug && center) {
          setDeleting(true);
          try {
            deleteResearchCenter(divisionSlug, center.id);
            showToast('Research center deleted successfully', 'success');
            navigate(`/admin/divisions/${divisionSlug}`);
          } catch (error) {
            showToast('Failed to delete research center', 'error');
          } finally {
            setDeleting(false);
          }
        }
      }
    );
  };

  const handleEditCenter = () => {
    // Navigate back to division page and trigger edit modal
    navigate(`/admin/divisions/${divisionSlug}?editCenter=${center?.id}`);
  };

  if (!center) {
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

  const division = divisionSlug ? getDivision(divisionSlug) : undefined;

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
        isLoading={deleting}
      />
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/admin/divisions/${divisionSlug}`)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {division?.name || 'Division'}
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-green-900 mb-2">{center.name}</h1>
            <p className="text-gray-600">{center.location}</p>
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
        </div>
      </div>

      {/* Experiments */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <ExperimentEditor
          experiments={center.experiments || []}
          onExperimentsChange={handleExperimentsChange}
        />
      </div>
    </div>
  );
};

export default AdminResearchCenter;

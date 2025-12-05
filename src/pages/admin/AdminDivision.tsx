import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Phone } from 'lucide-react';
import {
  getDivision,
  updateDivisionHeading,
  addResearchCenter,
  updateResearchCenter,
  deleteResearchCenter,
  updateTollFreeNumber,
  getTollFreeNumber
} from '../../services/admin/adminDataService';
import ContentBlockEditor, { ContentBlock } from '../../components/admin/ContentBlockEditor';
import CustomFieldEditor, { CustomField } from '../../components/admin/CustomFieldEditor';
import ImageUploader from '../../components/admin/ImageUploader';
import Modal from '../../components/admin/Modal';
import type { ResearchCenter, Coordinates } from '../../types';

const AdminDivision: React.FC = () => {
  const { divisionSlug } = useParams<{ divisionSlug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const division = divisionSlug ? getDivision(divisionSlug) : undefined;
  
  const [divisionHeading, setDivisionHeading] = useState(division?.name || '');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [editingCenter, setEditingCenter] = useState<ResearchCenter | null>(null);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [tollFreeNumber, setTollFreeNumber] = useState(getTollFreeNumber());

  const [centerFormData, setCenterFormData] = useState({
    name: '',
    location: '',
    description: '',
    coordinates: { lat: 0, lng: 0 } as Coordinates,
    image: '',
    customFields: [] as CustomField[],
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (division) {
      setDivisionHeading(division.name);
    }
  }, [division]);

  const handleEditCenter = (center: ResearchCenter) => {
    const customFields: CustomField[] = [];
    if (center.area) customFields.push({ id: 'area', label: 'Area', value: center.area });
    if (center.district) customFields.push({ id: 'district', label: 'District', value: center.district });
    if (center.range) customFields.push({ id: 'range', label: 'Range', value: center.range });

    setCenterFormData({
      name: center.name,
      location: center.location,
      description: center.description || '',
      coordinates: center.coordinates,
      image: '',
      customFields,
      phone: '',
      email: ''
    });
    setEditingCenter(center);
    setShowCenterForm(true);
  };

  // Check if we need to open edit modal from query param
  useEffect(() => {
    const editCenterId = searchParams.get('editCenter');
    if (editCenterId && divisionSlug && division) {
      const centerId = parseInt(editCenterId);
      const center = division.researchCenters?.find(c => c.id === centerId);
      if (center) {
        handleEditCenter(center);
        // Remove query param
        setSearchParams({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, divisionSlug, division]);

  const handleDivisionHeadingUpdate = () => {
    if (divisionSlug) {
      updateDivisionHeading(divisionSlug, divisionHeading, '');
    }
  };

  const handleContentBlocksChange = (blocks: ContentBlock[]) => {
    setContentBlocks(blocks);
    // In a real app, this would save to the division's content blocks
  };

  const handleAddCenter = () => {
    setCenterFormData({
      name: '',
      location: '',
      description: '',
      coordinates: { lat: 0, lng: 0 },
      image: '',
      customFields: [],
      phone: '',
      email: ''
    });
    setEditingCenter(null);
    setShowCenterForm(true);
  };


  const handleSaveCenter = () => {
    if (!centerFormData.name || !centerFormData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (!divisionSlug) return;

    // Convert custom fields to research center properties
    const centerData: Partial<ResearchCenter> = {
      name: centerFormData.name,
      location: centerFormData.location,
      description: centerFormData.description,
      coordinates: centerFormData.coordinates,
      experiments: editingCenter?.experiments || []
    };

    // Add custom fields
    centerFormData.customFields.forEach(field => {
      if (field.label.toLowerCase() === 'area') {
        (centerData as any).area = field.value;
      } else if (field.label.toLowerCase() === 'district') {
        (centerData as any).district = field.value;
      } else if (field.label.toLowerCase() === 'range') {
        (centerData as any).range = field.value;
      }
    });

    if (editingCenter) {
      updateResearchCenter(divisionSlug, editingCenter.id, centerData);
      handleCancelCenter();
    } else {
      // Add new center
      addResearchCenter(divisionSlug, centerData as Omit<ResearchCenter, 'id'>);
      // Get the newly added center (it will have the highest ID)
      const updatedDivision = getDivision(divisionSlug);
      if (updatedDivision && updatedDivision.researchCenters) {
        const newCenter = updatedDivision.researchCenters[updatedDivision.researchCenters.length - 1];
        handleCancelCenter();
        // Navigate to the new research center page
        navigate(`/admin/divisions/${divisionSlug}/centers/${newCenter.id}`);
      }
    }
  };

  const handleCancelCenter = () => {
    setCenterFormData({
      name: '',
      location: '',
      description: '',
      coordinates: { lat: 0, lng: 0 },
      image: '',
      customFields: [],
      phone: '',
      email: ''
    });
    setEditingCenter(null);
    setShowCenterForm(false);
  };

  const handleDeleteCenter = (centerId: number) => {
    if (window.confirm('Are you sure you want to delete this research center? All experiments will also be deleted.')) {
      if (divisionSlug) {
        deleteResearchCenter(divisionSlug, centerId);
      }
    }
  };

  const handleTollFreeUpdate = () => {
    updateTollFreeNumber(tollFreeNumber);
  };

  if (!division) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Division not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">{division.name} Management</h1>
        <p className="text-gray-600">Manage division content, research centers, and experiments</p>
      </div>

      <div className="space-y-8">
        {/* Division Heading */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Division Heading</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={divisionHeading}
              onChange={(e) => {
                setDivisionHeading(e.target.value);
                handleDivisionHeadingUpdate();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Blocks */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ContentBlockEditor
            blocks={contentBlocks}
            onBlocksChange={handleContentBlocksChange}
          />
        </div>

        {/* Research Centers */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-900">Research Centers</h2>
            <button
              onClick={handleAddCenter}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Research Center
            </button>
          </div>

          {/* Research Center Form Modal */}
          <Modal
            isOpen={showCenterForm}
            onClose={handleCancelCenter}
            title={editingCenter ? 'Edit Research Center' : 'Add Research Center'}
            size="xl"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={centerFormData.name}
                  onChange={(e) => setCenterFormData({ ...centerFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Thoppur Modern Nursery Centre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={centerFormData.location}
                  onChange={(e) => setCenterFormData({ ...centerFormData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Thoppur RF, Dharmapuri"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={centerFormData.coordinates.lat}
                    onChange={(e) => setCenterFormData({
                      ...centerFormData,
                      coordinates: { ...centerFormData.coordinates, lat: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="11.96828"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={centerFormData.coordinates.lng}
                    onChange={(e) => setCenterFormData({
                      ...centerFormData,
                      coordinates: { ...centerFormData.coordinates, lng: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="78.05200"
                  />
                </div>
              </div>
              <div>
                <ImageUploader
                  currentImage={centerFormData.image}
                  onImageChange={(imagePath) => setCenterFormData({ ...centerFormData, image: imagePath })}
                  directory="centers"
                  label="Center Image (Optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={centerFormData.description}
                  onChange={(e) => setCenterFormData({ ...centerFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter center description (optional)"
                />
              </div>
              <div>
                <CustomFieldEditor
                  fields={centerFormData.customFields}
                  onFieldsChange={(fields) => setCenterFormData({ ...centerFormData, customFields: fields })}
                  label="Custom Fields (Area, District, Range, etc.)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={centerFormData.phone}
                    onChange={(e) => setCenterFormData({ ...centerFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 0442-27514565"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={centerFormData.email}
                    onChange={(e) => setCenterFormData({ ...centerFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., research@tnfrd.gov.in"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveCenter}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelCenter}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>

          {/* Research Centers List */}
          <div className="space-y-4 mb-6">
            {division.researchCenters?.map((center) => (
              <div
                key={center.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/divisions/${divisionSlug}/centers/${center.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-2">{center.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{center.location}</p>
                    {center.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{center.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCenter(center);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCenter(center.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(!division.researchCenters || division.researchCenters.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No research centers yet. Click "Add Research Center" to create one.</p>
              </div>
            )}
          </div>
        </div>

        {/* Toll-Free Number */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Toll-Free Number</h2>
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-green-600" />
            <input
              type="text"
              value={tollFreeNumber}
              onChange={(e) => {
                setTollFreeNumber(e.target.value);
                handleTollFreeUpdate();
              }}
              placeholder="1800-425-2313"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDivision;


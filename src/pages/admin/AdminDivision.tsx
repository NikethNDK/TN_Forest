import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Phone } from 'lucide-react';
import {
  subscribeToDivision,
  updateDivision,
  updateTollFreeNumber
  // updateContentBlocks
} from '../../services/firebase/divisionService';
import {
  subscribeToResearchCenters,
  addResearchCenter,
  updateResearchCenter,
  deleteResearchCenter
} from '../../services/firebase/researchCenterService';
import {
  subscribeToDivisionGalleryImages,
  addGalleryImage,
  deleteGalleryImage
} from '../../services/firebase/galleryImageService';
// TODO: Enable when making content blocks live
// import ContentBlockEditor, { ContentBlock } from '../../components/admin/ContentBlockEditor';
import CustomFieldEditor, { CustomField } from '../../components/admin/CustomFieldEditor';
import ImageUploader from '../../components/admin/ImageUploader';
// Image upload is handled by ImageUploader component
// import { uploadImageFile } from '../../services/admin/fileUploadService';
import Modal from '../../components/admin/Modal';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import type { ResearchCenter, Coordinates, Division, GalleryImage } from '../../types';

const AdminDivision: React.FC = () => {
  const { divisionSlug } = useParams<{ divisionSlug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [deletingCenterId, setDeletingCenterId] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  
  const [division, setDivision] = useState<Division | null>(null);
  const [researchCenters, setResearchCenters] = useState<ResearchCenter[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCenters, setIsLoadingCenters] = useState(true);
  const [isLoadingGalleryImages, setIsLoadingGalleryImages] = useState(true);
  
  const [divisionHeading, setDivisionHeading] = useState('');
  // TODO: Enable when making content blocks live
  // const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [editingCenter, setEditingCenter] = useState<ResearchCenter | null>(null);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [tollFreeNumber, setTollFreeNumber] = useState('');

  const [centerFormData, setCenterFormData] = useState({
    name: '',
    location: '',
    description: '',
    coordinates: { lat: 0, lng: 0 } as Coordinates,
    imageUrl: '',
    imagePublicId: '',
    customFields: [] as CustomField[],
    phone: '',
    email: ''
  });

  // Subscribe to division data
  useEffect(() => {
    if (!divisionSlug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToDivision(
      divisionSlug,
      (divisionData) => {
        if (divisionData) {
          setDivision(divisionData);
          setDivisionHeading(divisionData.name);
          setTollFreeNumber(divisionData.tollFreeNumber || '');
          // TODO: Enable when making content blocks live
          // setContentBlocks(divisionData.contentBlocks || []);
        } else {
          setDivision(null);
        }
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

  // Subscribe to division gallery images
  useEffect(() => {
    if (!divisionSlug) {
      setIsLoadingGalleryImages(false);
      return;
    }

    setIsLoadingGalleryImages(true);
    const unsubscribe = subscribeToDivisionGalleryImages(
      divisionSlug,
      (images) => {
        setGalleryImages(images);
        setIsLoadingGalleryImages(false);
      },
      (error) => {
        console.error('Error in division gallery images subscription:', error);
        setIsLoadingGalleryImages(false);
      }
    );

    return () => unsubscribe();
  }, [divisionSlug]);

  // Subscribe to research centers
  useEffect(() => {
    if (!division?.id) {
      setIsLoadingCenters(false);
      return;
    }

    setIsLoadingCenters(true);
    const divisionId = typeof division.id === 'string' ? division.id : division.id.toString();
    const unsubscribe = subscribeToResearchCenters(
      divisionId,
      (centers) => {
        setResearchCenters(centers);
        setIsLoadingCenters(false);
      },
      (error) => {
        console.error('Error loading research centers:', error);
        showToast('Failed to load research centers', 'error');
        setIsLoadingCenters(false);
      }
    );

    return () => unsubscribe();
  }, [division?.id]);

  // Check if we need to open edit modal from query param
  useEffect(() => {
    const editCenterId = searchParams.get('editCenter');
    if (editCenterId && division && researchCenters.length > 0) {
      const center = researchCenters.find(c => c.id === editCenterId || c.id?.toString() === editCenterId);
      if (center) {
        handleEditCenter(center);
        setSearchParams({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, division, researchCenters]);

  const handleEditCenter = (center: ResearchCenter) => {
    // Load customFields from center, or convert from legacy area/district/range fields
    let customFields: CustomField[] = [];
    
    if (center.customFields && center.customFields.length > 0) {
      // Use existing customFields
      customFields = [...center.customFields];
    } else {
      // Convert legacy fields to customFields for backward compatibility
      if (center.area) customFields.push({ id: 'area', label: 'Area', value: center.area });
      if (center.district) customFields.push({ id: 'district', label: 'District', value: center.district });
      if (center.range) customFields.push({ id: 'range', label: 'Range', value: center.range });
    }

    setCenterFormData({
      name: center.name,
      location: center.location,
      description: center.description || '',
      coordinates: center.coordinates || { lat: 0, lng: 0 },
      imageUrl: center.imageUrl || '',
      imagePublicId: center.imagePublicId || '',
      customFields,
      phone: center.phone || '',
      email: center.email || ''
    });
    setEditingCenter(center);
    setShowCenterForm(true);
  };

  const handleDivisionHeadingUpdate = async () => {
    if (!division?.id) return;
    
    const divisionId = typeof division.id === 'string' ? division.id : division.id.toString();
    
    try {
      await updateDivision(divisionId, { name: divisionHeading });
      showToast('Division heading updated', 'success');
    } catch (error) {
      console.error('Error updating division heading:', error);
      showToast('Failed to update division heading', 'error');
    }
  };

  // TODO: Enable when making content blocks live
  // const handleContentBlocksChange = async (blocks: ContentBlock[]) => {
  //   setContentBlocks(blocks);
  //   if (!division?.id) return;
  //   
  //   const divisionId = typeof division.id === 'string' ? division.id : division.id.toString();
  //   
  //   try {
  //     await updateContentBlocks(divisionId, blocks);
  //     showToast('Content blocks updated', 'success');
  //   } catch (error) {
  //     console.error('Error updating content blocks:', error);
  //     showToast('Failed to update content blocks', 'error');
  //   }
  // };

  const handleAddCenter = () => {
    // Initialize with default fields: Area, District, Range
    const defaultFields: CustomField[] = [
      { id: `field-${Date.now()}-1`, label: 'Area', value: '' },
      { id: `field-${Date.now()}-2`, label: 'District', value: '' },
      { id: `field-${Date.now()}-3`, label: 'Range', value: '' }
    ];
    
    setCenterFormData({
      name: '',
      location: '',
      description: '',
      coordinates: { lat: 0, lng: 0 },
      imageUrl: '',
      imagePublicId: '',
      customFields: defaultFields,
      phone: '',
      email: ''
    });
    setEditingCenter(null);
    setShowCenterForm(true);
  };

  // Image upload is handled directly by ImageUploader component

  const handleSaveCenter = async () => {
    if (!centerFormData.name || !centerFormData.location) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!division?.id) {
      showToast('Division not loaded', 'error');
      return;
    }

    const divisionId = typeof division.id === 'string' ? division.id : division.id.toString();

    // Build center data with customFields
    const centerData: Omit<ResearchCenter, 'id' | 'createdAt' | 'updatedAt' | 'experiments'> = {
      name: centerFormData.name,
      location: centerFormData.location,
      description: centerFormData.description,
      coordinates: centerFormData.coordinates.lat !== 0 && centerFormData.coordinates.lng !== 0
        ? centerFormData.coordinates
        : undefined,
      imageUrl: centerFormData.imageUrl || undefined,
      imagePublicId: centerFormData.imagePublicId || undefined,
      phone: centerFormData.phone || undefined,
      email: centerFormData.email || undefined,
      // Store all customFields as an array
      customFields: centerFormData.customFields.filter(field => field.label.trim() && field.value.trim())
    };

    // Also set legacy fields for backward compatibility (if they exist in customFields)
    centerFormData.customFields.forEach(field => {
      const labelLower = field.label.toLowerCase().trim();
      if (labelLower === 'area' && field.value.trim()) {
        centerData.area = field.value.trim();
      } else if (labelLower === 'district' && field.value.trim()) {
        centerData.district = field.value.trim();
      } else if (labelLower === 'range' && field.value.trim()) {
        centerData.range = field.value.trim();
      }
    });

    try {
      if (editingCenter && editingCenter.id && typeof editingCenter.id === 'string') {
        await updateResearchCenter(divisionId, editingCenter.id, centerData);
        showToast('Research center updated successfully', 'success');
        handleCancelCenter();
      } else {
        // Add new center
        const newCenterId = await addResearchCenter(divisionId, centerData);
        showToast('Research center added successfully', 'success');
        handleCancelCenter();
        // Navigate to the new research center page
        navigate(`/admin/divisions/${divisionSlug}/centers/${newCenterId}`);
      }
    } catch (error) {
      console.error('Error saving research center:', error);
      showToast('Failed to save research center', 'error');
    }
  };

  const handleCancelCenter = () => {
    setCenterFormData({
      name: '',
      location: '',
      description: '',
      coordinates: { lat: 0, lng: 0 },
      imageUrl: '',
      imagePublicId: '',
      customFields: [],
      phone: '',
      email: ''
    });
    setEditingCenter(null);
    setShowCenterForm(false);
  };

  const handleDeleteCenter = (centerId: string | number) => {
    confirmation.confirm(
      {
        title: 'Delete Research Center',
        message: 'Are you sure you want to delete this research center? All experiments will also be deleted.',
        variant: 'danger'
      },
      async () => {
        if (!division?.id) return;
        
        const divisionId = typeof division.id === 'string' ? division.id : division.id.toString();
        const centerIdStr = typeof centerId === 'string' ? centerId : centerId.toString();
        const center = researchCenters.find(c => c.id === centerIdStr || c.id === centerId);
        
        setDeletingCenterId(centerIdStr);
        try {
          await deleteResearchCenter(
            divisionId,
            centerIdStr,
            center?.imagePublicId
          );
          showToast('Research center deleted successfully', 'success');
        } catch (error) {
          console.error('Error deleting research center:', error);
          showToast('Failed to delete research center', 'error');
        } finally {
          setDeletingCenterId(null);
        }
      }
    );
  };

  const handleTollFreeUpdate = async () => {
    if (!division?.id) return;
    
    const divisionId = typeof division.id === 'string' ? division.id : division.id.toString();
    
    try {
      await updateTollFreeNumber(divisionId, tollFreeNumber);
      showToast('Toll-free number updated', 'success');
    } catch (error) {
      console.error('Error updating toll-free number:', error);
      showToast('Failed to update toll-free number', 'error');
    }
  };

  // Gallery Images handlers
  const handleGalleryImageAdd = async (imagePath: string, publicId?: string) => {
    if (imagePath && publicId && divisionSlug) {
      try {
        await addGalleryImage({
          url: imagePath,
          publicId: publicId,
          order: galleryImages.length,
          scope: 'division',
          divisionSlug: divisionSlug
        });
        showToast('Gallery image added successfully', 'success');
      } catch (error) {
        console.error('Error adding gallery image:', error);
        showToast('Failed to add gallery image', 'error');
      }
    }
  };

  const handleGalleryImageRemove = (image: GalleryImage) => {
    if (!image.id || !image.publicId) return;
    
    confirmation.confirm(
      {
        title: 'Delete Gallery Image',
        message: 'Are you sure you want to delete this image? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      },
      async () => {
        try {
          setDeletingImageId(image.id!);
          const result = await deleteGalleryImage(image.id!, image.publicId);
          
          if (result.cloudinaryDeleted) {
            showToast('Gallery image deleted successfully', 'success');
          } else {
            showToast(`Failed to delete from Cloudinary: ${result.error || 'Unknown error'}. Image kept in database.`, 'error');
          }
        } catch (error: any) {
          console.error('Error deleting gallery image:', error);
          showToast('Failed to delete gallery image', 'error');
        } finally {
          setDeletingImageId(null);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading division...</p>
        </div>
      </div>
    );
  }

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
        isLoading={deletingCenterId !== null}
      />
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
            <div className="flex gap-2">
              <input
                type="text"
                value={divisionHeading}
                onChange={(e) => setDivisionHeading(e.target.value)}
                onBlur={handleDivisionHeadingUpdate}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleDivisionHeadingUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        {/* TODO: Enable when making content blocks live */}
        {/* <div className="bg-white rounded-lg shadow-lg p-6">
          <ContentBlockEditor
            blocks={contentBlocks}
            onBlocksChange={handleContentBlocksChange}
          />
        </div> */}

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
                    Latitude *
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude *
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
                    required
                  />
                </div>
              </div>
              <div>
                <ImageUploader
                  currentImage={centerFormData.imageUrl}
                  onImageChange={(imagePath, publicId) => {
                    setCenterFormData({
                      ...centerFormData,
                      imageUrl: imagePath,
                      imagePublicId: publicId || ''
                    });
                  }}
                  directory="tn-forest/images/centers"
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
          {isLoadingCenters ? (
            <div className="text-center py-8 text-gray-500">
              <p>Loading research centers...</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {researchCenters.map((center) => (
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
                          if (center.id) {
                            handleDeleteCenter(center.id);
                          }
                        }}
                        disabled={deletingCenterId === center.id?.toString()}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {researchCenters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No research centers yet. Click "Add Research Center" to create one.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-900">Gallery Images</h2>
            <div className="text-sm text-gray-600">
              {isLoadingGalleryImages ? 'Loading...' : `${galleryImages.length} images`}
            </div>
          </div>
          
          <div className="mb-4">
            <ImageUploader
              onImageChange={(url, publicId) => handleGalleryImageAdd(url, publicId)}
              directory="tn-forest/images/gallery"
              label="Add New Gallery Image"
            />
          </div>
          {isLoadingGalleryImages ? (
            <div className="text-center py-8 text-gray-500">Loading images...</div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No gallery images yet. Upload your first image above.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
              {galleryImages.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleGalleryImageRemove(image)}
                      disabled={deletingImageId === image.id}
                      className="p-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toll-Free Number */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Toll-Free Number</h2>
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-green-600" />
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={tollFreeNumber}
                onChange={(e) => setTollFreeNumber(e.target.value)}
                onBlur={handleTollFreeUpdate}
                placeholder="1800-425-2313"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleTollFreeUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDivision;

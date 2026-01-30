import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Users, Upload, X, User } from 'lucide-react';
import {
  subscribeToFaculty,
  addFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
  swapFacultyOrder
} from '../../services/firebase/facultyService';
import { uploadImageFile, validateImageFile, createImagePreview, deleteImageFromCloudinary } from '../../services/admin/fileUploadService';
import type { FacultyMember } from '../../types';
import Modal from '../../components/admin/Modal';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { LoadingSpinner, ErrorMessage, EmptyState, FormField } from '../../components/common';

interface FormData {
  name: string;
  position: string;
  imageUrl: string;
  imagePublicId: string;
}

const initialFormData: FormData = {
  name: '',
  position: '',
  imageUrl: '',
  imagePublicId: ''
};

const AdminFaculty: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time faculty updates
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToFaculty(
      (members) => {
        setFacultyMembers(members);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load faculty members';
        setError(errorMessage);
        setLoading(false);
        showToast(errorMessage, 'error');
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddMember = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditMember = (id: string) => {
    const member = facultyMembers.find(m => m.id === id);
    if (member) {
      setFormData({
        name: member.name,
        position: member.position,
        imageUrl: member.imageUrl || '',
        imagePublicId: member.imagePublicId || ''
      });
      setImagePreview(member.imageUrl || null);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid file', 'error');
      return;
    }

    try {
      // Create preview
      const previewUrl = await createImagePreview(file);
      setImagePreview(previewUrl);
      setUploadingImage(true);
      setUploadProgress(0);

      // Upload to Cloudinary
      const result = await uploadImageFile(file, 'faculty', (progress) => {
        setUploadProgress(progress);
      });

      if (result.success && result.path) {
        setUploadProgress(100);
        setFormData(prev => ({
          ...prev,
          imageUrl: result.path!,
          imagePublicId: result.publicId || ''
        }));
        showToast('Image uploaded successfully', 'success');
      } else {
        setImagePreview(null);
        showToast(result.error || 'Failed to upload image', 'error');
      }
    } catch (err) {
      setImagePreview(null);
      showToast(err instanceof Error ? err.message : 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async () => {
    // Delete from Cloudinary if we have a publicId
    if (formData.imagePublicId) {
      try {
        await deleteImageFromCloudinary(formData.imagePublicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err);
        // Continue anyway - the image reference will be removed
      }
    }

    setFormData(prev => ({
      ...prev,
      imageUrl: '',
      imagePublicId: ''
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveMember = async () => {
    if (!formData.name.trim() || !formData.position.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const memberData = {
        name: formData.name,
        position: formData.position,
        imageUrl: formData.imageUrl || undefined,
        imagePublicId: formData.imagePublicId || undefined
      };

      if (editingId) {
        // Check if image was removed during edit
        const existingMember = facultyMembers.find(m => m.id === editingId);
        if (existingMember?.imagePublicId && !formData.imagePublicId) {
          // Image was removed, delete from Cloudinary
          try {
            await deleteImageFromCloudinary(existingMember.imagePublicId);
          } catch (err) {
            console.error('Failed to delete old image:', err);
          }
        }
        await updateFacultyMember(editingId, memberData);
        showToast('Faculty member updated successfully', 'success');
      } else {
        await addFacultyMember(memberData);
        showToast('Faculty member added successfully', 'success');
      }

      // No need to refresh - real-time listener will update automatically
      handleCancelMember();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save faculty member';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMember = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteMember = async (id: string) => {
    const member = facultyMembers.find(m => m.id === id);
    
    confirmation.confirm(
      {
        title: 'Delete Faculty Member',
        message: 'Are you sure you want to delete this faculty member?',
        variant: 'danger'
      },
      async () => {
        setDeletingId(id);
        try {
          setError(null);
          
          // Delete image from Cloudinary if exists
          if (member?.imagePublicId) {
            try {
              await deleteImageFromCloudinary(member.imagePublicId);
            } catch (err) {
              console.error('Failed to delete image from Cloudinary:', err);
              // Continue with deletion anyway
            }
          }
          
          await deleteFacultyMember(id);
          showToast('Faculty member deleted successfully', 'success');
          // No need to refresh - real-time listener will update automatically
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete faculty member';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleMoveMember = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= facultyMembers.length) return;

    try {
      setError(null);
      const currentMember = facultyMembers[index];
      const targetMember = facultyMembers[newIndex];
      
      await swapFacultyOrder(currentMember.id, targetMember.id);
      showToast('Faculty member order updated', 'success');
      // No need to refresh - real-time listener will update automatically
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder faculty members';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <LoadingSpinner message="Loading faculty members..." />
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
        isLoading={deletingId !== null}
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Faculty Page Management</h1>
        <p className="text-gray-600">Manage faculty members and leadership team</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">Faculty Members</h2>
          </div>
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>

        <Modal
          isOpen={showForm}
          onClose={handleCancelMember}
          title={editingId !== null ? 'Edit Faculty Member' : 'Add Faculty Member'}
          size="md"
          closeOnOutsideClick={false}
        >
          <div className="space-y-4">
            {/* Image Upload Section */}
            <FormField label="Photo (Optional)">
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                      />
                      {!uploadingImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={saving}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => !saving && !uploadingImage && fileInputRef.current?.click()}
                      className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving || uploadingImage}
                    className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors overflow-hidden"
                    style={{ minWidth: '140px' }}
                  >
                    {uploadingImage && (
                      <div
                        className="absolute inset-0 bg-green-400 transition-all duration-300 ease-out"
                        style={{
                          width: `${uploadProgress}%`,
                          left: 0,
                          top: 0,
                          bottom: 0,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? `Uploading... ${uploadProgress}%` : imagePreview ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    Optional. Recommended: Square image, min 200x200px
                  </p>
                </div>
              </div>
            </FormField>

            <FormField label="Name" required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Thiru R.S.Rajakannappan"
                disabled={saving}
              />
            </FormField>
            <FormField label="Position" required>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Hon'ble Minister for Forests"
                disabled={saving}
              />
            </FormField>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveMember}
                disabled={saving || uploadingImage}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelMember}
                disabled={saving || uploadingImage}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        <div className="space-y-4">
          {facultyMembers.map((member, index) => (
            <div
              key={member.id}
              className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveMember(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveMember(index, 'down')}
                      disabled={index === facultyMembers.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Member Image Thumbnail */}
                  <div className="flex-shrink-0">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-2">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMember(member.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={deletingId === member.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {facultyMembers.length === 0 && !loading && (
            <EmptyState 
              message="No faculty members yet. Click 'Add Member' to create one."
              icon={Users}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFaculty;

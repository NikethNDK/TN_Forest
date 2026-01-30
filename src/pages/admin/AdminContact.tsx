import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import {
  subscribeToContactLocations,
  addContactLocation,
  updateContactLocation,
  deleteContactLocation,
  setFooterLocation,
  unsetFooterLocation,
  swapContactLocationOrder
} from '../../services/firebase/contactService';
import type { ContactLocation } from '../../types';
import Modal from '../../components/admin/Modal';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { LoadingSpinner, ErrorMessage, EmptyState, FormField } from '../../components/common';

const AdminContact: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [locations, setLocations] = useState<ContactLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    showInFooter: false
  });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
  const [overrideLocationName, setOverrideLocationName] = useState('');
  const [pendingFooterLocationId, setPendingFooterLocationId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToContactLocations(
      (locationList) => {
        setLocations(locationList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load contact locations';
        setError(errorMessage);
        setLoading(false);
        showToast(errorMessage, 'error');
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAdd = () => {
    setFormData({
      name: '',
      location: '',
      phone: '',
      email: '',
      showInFooter: false
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const location = locations.find(l => l.id === id);
    if (location) {
      setFormData({
        name: location.name,
        location: location.location,
        phone: location.phone || '',
        email: location.email || '',
        showInFooter: location.showInFooter
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.location.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        // Update existing location
        await updateContactLocation(editingId, {
          name: formData.name,
          location: formData.location,
          phone: formData.phone,
          email: formData.email
        });

        // Handle footer selection separately
        const currentLocation = locations.find(l => l.id === editingId);
        if (formData.showInFooter && !currentLocation?.showInFooter) {
          // User wants to set this as footer - check for override
          const currentFooterLocation = locations.find(l => l.showInFooter && l.id !== editingId);
          if (currentFooterLocation) {
            // Show confirmation
            setOverrideLocationName(currentFooterLocation.name);
            setPendingFooterLocationId(editingId);
            setShowOverrideConfirm(true);
            setSaving(false);
            return; // Don't close form yet
          } else {
            // No conflict, set directly
            await setFooterLocation(editingId, true);
          }
        } else if (!formData.showInFooter && currentLocation?.showInFooter) {
          // User wants to unset footer
          await unsetFooterLocation(editingId);
        }
      } else {
        // Add new location
        const newId = await addContactLocation({
          name: formData.name,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          showInFooter: false // Never set on add
        });

        // If user wants to set as footer, check for override
        if (formData.showInFooter) {
          const currentFooterLocation = locations.find(l => l.showInFooter);
          if (currentFooterLocation) {
            // Show confirmation
            setOverrideLocationName(currentFooterLocation.name);
            setPendingFooterLocationId(newId);
            setShowOverrideConfirm(true);
            setSaving(false);
            return; // Don't close form yet
          } else {
            // No conflict, set directly
            await setFooterLocation(newId, true);
          }
        }
      }

      showToast(editingId ? 'Location updated successfully' : 'Location added successfully', 'success');
      handleCancel();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save location';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmOverride = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (pendingFooterLocationId) {
        await setFooterLocation(pendingFooterLocationId, true);
        showToast('Footer location updated successfully', 'success');
      }
      
      setShowOverrideConfirm(false);
      setOverrideLocationName('');
      setPendingFooterLocationId(null);
      handleCancel(); // Close form after override
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set footer location';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOverride = () => {
    setShowOverrideConfirm(false);
    setOverrideLocationName('');
    setPendingFooterLocationId(null);
    // Uncheck the footer checkbox
    setFormData({ ...formData, showInFooter: false });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      location: '',
      phone: '',
      email: '',
      showInFooter: false
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    confirmation.confirm(
      {
        title: 'Delete Location',
        message: 'Are you sure you want to delete this location?',
        variant: 'danger'
      },
      async () => {
        setDeletingId(id);
        try {
          setError(null);
          await deleteContactLocation(id);
          showToast('Location deleted successfully', 'success');
          // Real-time listener will update automatically
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete location';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleMoveLocation = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= locations.length) return;

    try {
      setError(null);
      const currentLocation = locations[index];
      const targetLocation = locations[newIndex];
      
      await swapContactLocationOrder(currentLocation.id, targetLocation.id);
      showToast('Location order updated', 'success');
      // Real-time listener will update automatically
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder locations';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const footerLocation = locations.find(l => l.showInFooter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <LoadingSpinner message="Loading contact locations..." />
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
        <h1 className="text-4xl font-bold text-green-900 mb-2">Contact Page Management</h1>
        <p className="text-gray-600">Manage location boxes and footer contact information</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="space-y-8">
        {/* Location Boxes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-900">Location Boxes</h2>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Location
            </button>
          </div>

          <Modal
            isOpen={showForm}
            onClose={handleCancel}
            title={editingId !== null ? 'Edit Location' : 'Add Location'}
            size="md"
            closeOnOutsideClick={false}
          >
            <div className="space-y-4">
              <FormField label="Title" required>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Main Office Location"
                  disabled={saving}
                />
              </FormField>
              <FormField label="Address" required>
                <textarea
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter full address"
                  disabled={saving}
                />
              </FormField>
              <FormField label="Phone Number">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 0442-27514565"
                  disabled={saving}
                />
              </FormField>
              <FormField label="Email">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., research@tnfrd.gov.in"
                  disabled={saving}
                />
              </FormField>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showInFooter"
                  checked={formData.showInFooter}
                  onChange={(e) => setFormData({ ...formData, showInFooter: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  disabled={saving}
                />
                <label htmlFor="showInFooter" className="ml-2 block text-sm text-gray-700">
                  Show in Footer Contact Information
                  {formData.showInFooter && locations.some(l => l.showInFooter && l.id !== editingId) && (
                    <span className="ml-2 text-xs text-orange-600">
                      (Will replace current footer location)
                    </span>
                  )}
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>

          {/* Override Confirmation Modal */}
          <Modal
            isOpen={showOverrideConfirm}
            onClose={handleCancelOverride}
            title="Override Footer Location?"
            size="sm"
            closeOnOutsideClick={false}
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>{overrideLocationName}</strong> is currently set to appear in the footer.
              </p>
              <p className="text-gray-700">
                Do you want to replace it with this location?
              </p>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleConfirmOverride}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Processing...' : 'Yes, Replace'}
                </button>
                <button
                  onClick={handleCancelOverride}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>

          <div className="space-y-4">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveLocation(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveLocation(index, 'down')}
                        disabled={index === locations.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-green-900">{location.name}</h3>
                        {location.showInFooter && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            In Footer
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{location.location}</span>
                        </div>
                        {location.phone && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Phone:</span>
                            <span>{location.phone}</span>
                          </div>
                        )}
                        {location.email && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Email:</span>
                            <span>{location.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(location.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      disabled={deletingId === location.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {locations.length === 0 && !loading && (
              <EmptyState message='No locations yet. Click "Add Location" to create one.' icon={<MapPin className="h-8 w-8" />} />
            )}
          </div>
        </div>

        {/* Footer Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Footer Contact Preview</h2>
          <p className="text-sm text-gray-600 mb-4">
            The location that will appear in the footer:
          </p>
          {footerLocation ? (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-900 mb-2">{footerLocation.name}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{footerLocation.location}</p>
                {footerLocation.phone && <p>Phone: {footerLocation.phone}</p>}
                {footerLocation.email && <p>Email: {footerLocation.email}</p>}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No location is set to appear in the footer.</p>
              <p className="text-sm mt-2">Check "Show in Footer" when editing a location to include it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;

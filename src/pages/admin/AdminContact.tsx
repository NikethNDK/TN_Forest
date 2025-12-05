import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import {
  getContactLocations,
  addContactLocation,
  updateContactLocation,
  deleteContactLocation
} from '../../services/admin/adminDataService';
import Modal from '../../components/admin/Modal';

const AdminContact: React.FC = () => {
  const [locations, setLocations] = useState(getContactLocations());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    showInFooter: false
  });
  const [showForm, setShowForm] = useState(false);

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

  const handleEdit = (id: number) => {
    const location = locations.find(l => l.id === id);
    if (location) {
      setFormData({
        name: location.name,
        location: location.location,
        phone: location.phone,
        email: location.email,
        showInFooter: (location as any).showInFooter || false
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId !== null) {
      const updated = updateContactLocation(editingId, formData);
      setLocations(updated);
    } else {
      const updated = addContactLocation(formData);
      setLocations(updated);
    }
    handleCancel();
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
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      const updated = deleteContactLocation(id);
      setLocations(updated);
    }
  };

  const footerLocations = locations.filter(l => (l as any).showInFooter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Contact Page Management</h1>
        <p className="text-gray-600">Manage location boxes and footer contact information</p>
      </div>

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
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Main Office Location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., research@tnfrd.gov.in"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showInFooter"
                  checked={formData.showInFooter}
                  onChange={(e) => setFormData({ ...formData, showInFooter: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="showInFooter" className="ml-2 block text-sm text-gray-700">
                  Show in Footer Contact Information
                </label>
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

          <div className="space-y-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-green-900">{location.name}</h3>
                      {(location as any).showInFooter && (
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
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(location.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {locations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No locations yet. Click "Add Location" to create one.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Footer Contact Preview</h2>
          <p className="text-sm text-gray-600 mb-4">
            The following locations are set to appear in the footer:
          </p>
          {footerLocations.length > 0 ? (
            <div className="space-y-3">
              {footerLocations.map((location) => (
                <div
                  key={location.id}
                  className="border border-green-200 rounded-lg p-4 bg-green-50"
                >
                  <h4 className="font-semibold text-green-900 mb-2">{location.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{location.location}</p>
                    {location.phone && <p>Phone: {location.phone}</p>}
                    {location.email && <p>Email: {location.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No locations are set to appear in the footer.</p>
              <p className="text-sm mt-2">Check "Show in Footer" when editing a location to include it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;


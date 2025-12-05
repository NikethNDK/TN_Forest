import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Users } from 'lucide-react';
import {
  getFacultyContent,
  addFacultyMember,
  updateFacultyMember,
  deleteFacultyMember
} from '../../services/admin/adminDataService';
import Modal from '../../components/admin/Modal';

const AdminFaculty: React.FC = () => {
  const [facultyContent, setFacultyContent] = useState(getFacultyContent());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [showForm, setShowForm] = useState(false);

  const handleAddMember = () => {
    setFormData({ name: '', position: '' });
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEditMember = (index: number) => {
    setFormData(facultyContent.members[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSaveMember = () => {
    if (!formData.name.trim() || !formData.position.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingIndex !== null) {
      const updated = updateFacultyMember(editingIndex, formData);
      setFacultyContent({ ...facultyContent, members: updated });
    } else {
      const updated = addFacultyMember(formData);
      setFacultyContent({ ...facultyContent, members: updated });
    }
    handleCancelMember();
  };

  const handleCancelMember = () => {
    setFormData({ name: '', position: '' });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleDeleteMember = (index: number) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      const updated = deleteFacultyMember(index);
      setFacultyContent({ ...facultyContent, members: updated });
    }
  };

  const handleMoveMember = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= facultyContent.members.length) return;

    const updated = [...facultyContent.members];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFacultyContent({ ...facultyContent, members: updated });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Faculty Page Management</h1>
        <p className="text-gray-600">Manage faculty members and leadership team</p>
      </div>

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
          title={editingIndex !== null ? 'Edit Faculty Member' : 'Add Faculty Member'}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Thiru R.S.Rajakannappan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Hon'ble Minister for Forests"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveMember}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Save
              </button>
              <button
                onClick={handleCancelMember}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        <div className="space-y-4">
          {facultyContent.members.map((member: { name: string; position: string }, index: number) => (
            <div
              key={index}
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
                      disabled={index === facultyContent.members.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-2">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMember(index)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {facultyContent.members.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No faculty members yet. Click "Add Member" to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFaculty;

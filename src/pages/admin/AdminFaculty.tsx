import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Users, Loader2 } from 'lucide-react';
import {
  subscribeToFaculty,
  addFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
  swapFacultyOrder
} from '../../services/firebase/facultyService';
import type { FacultyMember } from '../../types';
import Modal from '../../components/admin/Modal';

const AdminFaculty: React.FC = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

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
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddMember = () => {
    setFormData({ name: '', position: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditMember = (id: string) => {
    const member = facultyMembers.find(m => m.id === id);
    if (member) {
      setFormData({ name: member.name, position: member.position });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleSaveMember = async () => {
    if (!formData.name.trim() || !formData.position.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await updateFacultyMember(editingId, formData);
      } else {
        await addFacultyMember(formData);
      }

      // No need to refresh - real-time listener will update automatically
      handleCancelMember();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save faculty member');
      console.error('Error saving faculty member:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMember = () => {
    setFormData({ name: '', position: '' });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) {
      return;
    }

    try {
      setError(null);
      await deleteFacultyMember(id);
      // No need to refresh - real-time listener will update automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete faculty member');
      console.error('Error deleting faculty member:', err);
    }
  };

  const handleMoveMember = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= facultyMembers.length) return;

    try {
      setError(null);
      const currentMember = facultyMembers[index];
      const targetMember = facultyMembers[newIndex];
      
      await swapFacultyOrder(currentMember.id, targetMember.id);
      // No need to refresh - real-time listener will update automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder faculty members');
      console.error('Error reordering faculty:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-gray-600">Loading faculty members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Faculty Page Management</h1>
        <p className="text-gray-600">Manage faculty members and leadership team</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

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
                disabled={saving}
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
                disabled={saving}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveMember}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </button>
              <button
                onClick={handleCancelMember}
                disabled={saving}
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
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {facultyMembers.length === 0 && !loading && (
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

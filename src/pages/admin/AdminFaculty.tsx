import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Users } from 'lucide-react';
import {
  subscribeToFaculty,
  addFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
  swapFacultyOrder
} from '../../services/firebase/facultyService';
import type { FacultyMember } from '../../types';
import Modal from '../../components/admin/Modal';
import { useToast, ToastContainer } from '../../components/admin/Toast';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { LoadingSpinner, ErrorMessage, EmptyState, FormField } from '../../components/common';

const AdminFaculty: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const confirmation = useConfirmation();
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await updateFacultyMember(editingId, formData);
        showToast('Faculty member updated successfully', 'success');
      } else {
        await addFacultyMember(formData);
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
    setFormData({ name: '', position: '' });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleDeleteMember = async (id: string) => {
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
        >
          <div className="space-y-4">
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
                disabled={saving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
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

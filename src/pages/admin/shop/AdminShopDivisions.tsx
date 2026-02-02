import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';
import Modal from '../../../components/admin/Modal';
import { useConfirmation } from '../../../hooks/useConfirmation';
import {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
  type ShopDivision,
} from '../../../services/api/shopApi';

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

const AdminShopDivisions: React.FC = () => {
  const [divisions, setDivisions] = useState<ShopDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const confirmation = useConfirmation();

  const fetchDivisions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getDivisions();
      setDivisions(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load divisions';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  const openCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setNameInput('');
    setModalOpen(true);
  };

  const openEdit = (d: ShopDivision) => {
    setModalMode('edit');
    setEditingId(d.id);
    setNameInput(d.name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setNameInput('');
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) {
      toast.error('Name is required');
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createDivision(name);
        toast.success('Division created');
      } else if (editingId !== null) {
        await updateDivision(editingId, { name });
        toast.success('Division updated');
      }
      closeModal();
      await fetchDivisions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (d: ShopDivision) => {
    confirmation.confirm(
      {
        title: 'Delete Division',
        message: `Are you sure you want to delete "${d.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
      },
      async () => {
        try {
          await deleteDivision(d.id);
          toast.success('Division deleted');
          await fetchDivisions();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Delete failed';
          toast.error(message);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner message="Loading divisions..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Divisions</h2>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Division
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {divisions.length === 0 && !error ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No divisions yet. Click &quot;Add Division&quot; to create one.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {divisions.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {d.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(d.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(d.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(d)}
                      className="text-green-600 hover:text-green-800 mr-4"
                      aria-label={`Edit ${d.name}`}
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Delete ${d.name}`}
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Add Division' : 'Edit Division'}
        size="sm"
        closeOnOutsideClick={false}
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="division-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="division-name"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Division name"
            autoFocus
            disabled={submitting}
          />
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.close}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title || 'Confirm Action'}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
      />
    </div>
  );
};

export default AdminShopDivisions;

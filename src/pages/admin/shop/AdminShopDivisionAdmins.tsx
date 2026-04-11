import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';
import Modal from '../../../components/admin/Modal';
import { useConfirmation } from '../../../hooks/useConfirmation';
import {
  createDivisionAdmin,
  deleteDivisionAdmin,
  getDivisionAdmins,
  getDivisions,
  getMe,
  updateDivisionAdmin,
  type DivisionAdminListItem,
  type ShopDivision,
} from '../../../services/api/shopApi';

function isMainAdminType(adminType: string | null | undefined): boolean {
  return adminType === 'main_admin' || adminType === 'main_type';
}

const inputClassName =
  'w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500';

const AdminShopDivisionAdmins: React.FC = () => {
  const navigate = useNavigate();
  const confirmation = useConfirmation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DivisionAdminListItem[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<ShopDivision[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DivisionAdminListItem | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editSelectedIds, setEditSelectedIds] = useState<Set<number>>(new Set());
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadData = useCallback(async () => {
    setListError(null);
    try {
      const [adminsRes, divs] = await Promise.all([getDivisionAdmins(100), getDivisions()]);
      setRows(adminsRes.results);
      setDivisionOptions(divs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setListError(message);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const me = await getMe();
        if (cancelled) return;
        if (!isMainAdminType(me.admin_type)) {
          navigate('/admin/shop', { replace: true });
          return;
        }
        setCurrentUserUid(me.firebase_uid);
        await loadData();
      } catch {
        if (!cancelled) {
          navigate('/admin/shop', { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, loadData]);

  const toggleDivision = (id: number) => {
    setSelectedDivisionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleEditDivision = (id: number) => {
    setEditSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openEdit = (row: DivisionAdminListItem) => {
    setEditing(row);
    setEditEmail(row.email ?? '');
    setEditPassword('');
    setEditSelectedIds(new Set(row.division_ids));
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
    setEditEmail('');
    setEditPassword('');
    setEditSelectedIds(new Set());
    setSubmittingEdit(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      toast.error('Email and password are required.');
      return;
    }
    const division_ids = Array.from(selectedDivisionIds).sort((a, b) => a - b);
    if (division_ids.length === 0) {
      toast.error('Select at least one division.');
      return;
    }
    setSubmitting(true);
    try {
      await createDivisionAdmin({ email: trimmedEmail, password, division_ids });
      toast.success('Division admin created');
      setEmail('');
      setPassword('');
      setSelectedDivisionIds(new Set());
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const trimmed = editEmail.trim();
    if (!trimmed) {
      toast.error('Email is required.');
      return;
    }
    const division_ids = Array.from(editSelectedIds).sort((a, b) => a - b);
    if (division_ids.length === 0) {
      toast.error('Select at least one division.');
      return;
    }
    if (editPassword.length > 0 && editPassword.length < 8) {
      toast.error('Password must be at least 8 characters, or leave blank to keep the current password.');
      return;
    }
    setSubmittingEdit(true);
    try {
      await updateDivisionAdmin(editing.firebase_uid, {
        email: trimmed,
        division_ids,
        ...(editPassword.trim() ? { password: editPassword } : {}),
      });
      toast.success('Division admin updated');
      closeEdit();
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      toast.error(message);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDelete = (row: DivisionAdminListItem) => {
    const label = row.email ?? row.firebase_uid;
    confirmation.confirm(
      {
        title: 'Remove division admin',
        message: `Remove access for ${label}? They will no longer be able to sign in as an admin.`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        variant: 'danger',
      },
      async () => {
        try {
          await deleteDivisionAdmin(row.firebase_uid);
          toast.success('Division admin removed');
          await loadData();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Delete failed';
          toast.error(message);
        }
      }
    );
  };

  const formValid =
    email.trim().length > 0 && password.length >= 8 && selectedDivisionIds.size > 0;

  const editFormValid =
    editEmail.trim().length > 0 &&
    editSelectedIds.size > 0 &&
    (editPassword.length === 0 || editPassword.length >= 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner message="Loading division admins..." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Division admin management</h2>
        <p className="mt-1 text-sm text-gray-600">
          Create, edit, or remove EcoStore division admins. Only main administrators can use this page.
        </p>
      </div>

      {listError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{listError}</div>
      )}

      {rows.length === 0 && !listError ? (
        <div className="mb-8 py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No division admins yet. Use the form below to create one.
        </div>
      ) : (
        <div className="mb-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Divisions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => {
                const isSelf = currentUserUid != null && row.firebase_uid === currentUserUid;
                return (
                  <tr key={row.firebase_uid} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {row.email ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.divisions.length > 0 ? (
                        <span>{row.divisions.map((d) => d.name).join(', ')}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="text-green-600 hover:text-green-800 mr-4"
                        aria-label={`Edit ${row.email ?? 'admin'}`}
                      >
                        <Pencil className="h-4 w-4 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        disabled={isSelf}
                        title={isSelf ? 'You cannot remove your own account here' : 'Remove'}
                        className={
                          isSelf
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800'
                        }
                        aria-label={`Remove ${row.email ?? 'admin'}`}
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create division admin</h3>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label htmlFor="da-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="da-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="da-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="da-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">At least 8 characters (server may enforce more).</p>
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Divisions</legend>
            {divisionOptions.length === 0 ? (
              <p className="text-sm text-gray-500">No divisions available. Create divisions first.</p>
            ) : (
              <ul className="space-y-2 max-w-md">
                {divisionOptions.map((d) => (
                  <li key={d.id}>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
                      <input
                        type="checkbox"
                        checked={selectedDivisionIds.has(d.id)}
                        onChange={() => toggleDivision(d.id)}
                        disabled={submitting}
                        className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                      />
                      <span>{d.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          <div>
            <button
              type="submit"
              disabled={submitting || !formValid}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus className="h-5 w-5 shrink-0" />
              {submitting ? 'Creating…' : 'Create division admin'}
            </button>
          </div>
        </form>
      </div>

      <Modal isOpen={editOpen} onClose={closeEdit} title="Edit division admin">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className={inputClassName}
              disabled={submittingEdit}
            />
          </div>
          <div>
            <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              id="edit-password"
              type="password"
              autoComplete="new-password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              className={inputClassName}
              disabled={submittingEdit}
              placeholder="Leave blank to keep current password"
            />
            <p className="mt-1 text-xs text-gray-500">At least 8 characters if changing.</p>
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Divisions</legend>
            <ul className="space-y-2 max-w-md max-h-48 overflow-y-auto">
              {divisionOptions.map((d) => (
                <li key={d.id}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={editSelectedIds.has(d.id)}
                      onChange={() => toggleEditDivision(d.id)}
                      disabled={submittingEdit}
                      className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                    />
                    <span>{d.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingEdit || !editFormValid}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-50"
            >
              {submittingEdit ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.close}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title ?? ''}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
      />
    </div>
  );
};

export default AdminShopDivisionAdmins;

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Building2, ShieldCheck } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';
import Modal from '../../../components/admin/Modal';
import { useConfirmation } from '../../../hooks/useConfirmation';
import {
  getDivisions,
  getDivisionBankAccount,
  upsertDivisionBankAccount,
  setDivisionInternal,
  validateIfsc,
  type ShopDivision,
  type DivisionBankAccount,
} from '../../../services/api/shopApi';
import { getCurrentUser, getAdminFirestoreProfile } from '../../../services/firebase/authService';

const emptyForm = {
  account_holder_name: '',
  account_number: '',
  ifsc_code: '',
  account_type: 'current',
};

const AdminShopPayouts: React.FC = () => {
  const navigate = useNavigate();
  const confirmation = useConfirmation();
  const [divisions, setDivisions] = useState<ShopDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeDivision, setActiveDivision] = useState<ShopDivision | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState<DivisionBankAccount | null>(null);
  const [ifscInfo, setIfscInfo] = useState<string>('');
  const [checkingIfsc, setCheckingIfsc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Main-admin only page.
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;
    let cancelled = false;
    (async () => {
      const profile = await getAdminFirestoreProfile(user.uid);
      if (cancelled) return;
      if (profile?.role === 'admin' && profile?.admin_type === 'division_admin') {
        navigate('/admin/shop', { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const fetchDivisions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDivisions(await getDivisions());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load divisions';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDivisions();
  }, [fetchDivisions]);

  const openEditBank = async (division: ShopDivision) => {
    setActiveDivision(division);
    setForm(emptyForm);
    setIfscInfo('');
    setExisting(null);
    setModalOpen(true);
    try {
      const bank = await getDivisionBankAccount(division.id);
      if (bank) {
        setExisting(bank);
        setForm({
          account_holder_name: bank.account_holder_name,
          account_number: '',
          ifsc_code: bank.ifsc_code,
          account_type: bank.account_type || 'current',
        });
        setIfscInfo(bank.bank_name ? `${bank.bank_name}` : '');
      }
    } catch {
      /* a fresh account is fine */
    }
  };

  const handleCheckIfsc = async () => {
    const code = form.ifsc_code.trim().toUpperCase();
    if (!code) return;
    setCheckingIfsc(true);
    try {
      const info = await validateIfsc(code);
      setIfscInfo(info.bank ? `${info.bank}${info.branch ? ` — ${info.branch}` : ''}` : 'Valid IFSC');
      setForm((f) => ({ ...f, ifsc_code: info.ifsc }));
    } catch (err) {
      setIfscInfo('');
      toast.error(err instanceof Error ? err.message : 'Invalid IFSC');
    } finally {
      setCheckingIfsc(false);
    }
  };

  const handleToggleInternal = (division: ShopDivision) => {
    const goingExternal = division.is_internal; // currently internal -> switch to external
    if (goingExternal && !division.has_bank_account) {
      toast.error('Add a payout bank account before making this division external.');
      return;
    }
    confirmation.confirm(
      {
        title: goingExternal ? 'Switch to external?' : 'Switch to internal?',
        message: goingExternal
          ? `"${division.name}" will start receiving RazorpayX payouts for delivered items.`
          : `"${division.name}" will be treated as the company: its money stays in the settlement account and no payouts are made.`,
        confirmText: 'Confirm',
        variant: 'info',
      },
      async () => {
        try {
          await setDivisionInternal(division.id, !division.is_internal);
          toast.success('Updated');
          void fetchDivisions();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Failed to update');
        }
      }
    );
  };

  const handleSaveBank = async () => {
    if (!activeDivision) return;
    if (!form.account_holder_name.trim() || !form.account_number.trim() || !form.ifsc_code.trim()) {
      toast.error('Holder name, account number and IFSC are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await upsertDivisionBankAccount(activeDivision.id, {
        account_holder_name: form.account_holder_name.trim(),
        account_number: form.account_number.trim(),
        ifsc_code: form.ifsc_code.trim().toUpperCase(),
        account_type: form.account_type,
      });
      toast.success('Bank account saved');
      setModalOpen(false);
      void fetchDivisions();
      if (res.suggest_switch_to_external) {
        const div = activeDivision;
        confirmation.confirm(
          {
            title: 'Start payouts to this division?',
            message: `Switch "${div.name}" to external so delivered items are paid out via RazorpayX? You can change this later.`,
            confirmText: 'Switch to external',
            variant: 'info',
          },
          async () => {
            try {
              await setDivisionInternal(div.id, false);
              toast.success('Division is now external');
              void fetchDivisions();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Failed to switch');
            }
          }
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save bank account');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading payouts..." size="lg" />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Payouts & bank accounts</h1>
      <p className="text-gray-500 mb-6">
        Mark internal (company) divisions, and add payout bank accounts for external vendors.
      </p>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Division</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payout account</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {divisions.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      d.is_internal ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {d.is_internal ? 'Internal (company)' : 'External (vendor)'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {d.has_bank_account ? (
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-4 w-4" /> ••••{d.bank_account_last4}
                    </span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => void openEditBank(d)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Pencil className="h-4 w-4" /> {d.has_bank_account ? 'Edit account' : 'Add account'}
                  </button>
                  <button
                    onClick={() => void handleToggleInternal(d)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {d.is_internal ? 'Make external' : 'Make internal'}
                  </button>
                </td>
              </tr>
            ))}
            {divisions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No divisions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Payout account — ${activeDivision?.name ?? ''}`}
      >
        <div className="space-y-4">
          {existing && (
            <p className="text-sm text-gray-500">
              Current: ••••{existing.account_last4} ({existing.bank_name || existing.ifsc_code}). Enter a new
              account number to replace it.
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account holder name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.account_holder_name}
              onChange={(e) => setForm((f) => ({ ...f, account_holder_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account number {existing ? '(re-enter to change)' : ''}
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              inputMode="numeric"
              value={form.account_number}
              onChange={(e) =>
                setForm((f) => ({ ...f, account_number: e.target.value.replace(/\D/g, '').slice(0, 18) }))
              }
              placeholder="9–18 digits"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2 uppercase"
                value={form.ifsc_code}
                onChange={(e) => setForm((f) => ({ ...f, ifsc_code: e.target.value.toUpperCase().slice(0, 11) }))}
                placeholder="SBIN0000001"
              />
              <button
                type="button"
                onClick={() => void handleCheckIfsc()}
                disabled={checkingIfsc}
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
              >
                {checkingIfsc ? 'Checking…' : 'Verify'}
              </button>
            </div>
            {ifscInfo && <p className="text-xs text-green-700 mt-1">{ifscInfo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.account_type}
              onChange={(e) => setForm((f) => ({ ...f, account_type: e.target.value }))}
            >
              <option value="current">Current</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={() => void handleSaveBank()}
              disabled={submitting}
              className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save account'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.close}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title || 'Confirm'}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
      />
    </div>
  );
};

export default AdminShopPayouts;

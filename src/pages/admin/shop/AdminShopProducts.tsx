import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';
import Modal from '../../../components/admin/Modal';
import Pagination from '../../../components/shop/Pagination';
import { useConfirmation } from '../../../hooks/useConfirmation';
import ImageUploader from '../../../components/admin/ImageUploader';
import { deleteFileFromStorage } from '../../../services/firebase/storageService';
import {
  getProductsPaginated,
  getMe,
  getDivisions,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductListing,
  type ShopDivision,
  type ShopProductFromApi,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '../../../services/api/shopApi';

const PRODUCT_IMAGE_DIR = 'tn-forest/products';

const CATEGORY_OPTIONS = ['Seeds', 'Bio Fertilizers'] as const;

const DEFAULT_PAGE_SIZE = 10;

type OrderBy = '' | 'price' | '-price' | 'stock' | '-stock';

/** Supplier line: optional listingId when editing an existing row. */
type ListingRowState = {
  listingId?: number;
  divisionId: number | '';
  stock: string;
};

const AdminShopProducts: React.FC = () => {
  const [products, setProducts] = useState<ShopProductFromApi[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [divisions, setDivisions] = useState<ShopDivision[]>([]);
  const [adminType, setAdminType] = useState<string | null>(null);
  const [divisionIds, setDivisionIds] = useState<number[]>([]);
  const [divisionFilter, setDivisionFilter] = useState<number | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [orderBy, setOrderBy] = useState<OrderBy>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [divisionId, setDivisionId] = useState<number | ''>('');
  /** Rows for main-admin create/edit: catalog + divisions at bottom. */
  const [listingRows, setListingRows] = useState<ListingRowState[]>([{ divisionId: '', stock: '' }]);
  /** Listing ids present when edit modal opened — used to DELETE removed rows on save. */
  const [editInitialListingIds, setEditInitialListingIds] = useState<number[]>([]);
  const [loadingEditListings, setLoadingEditListings] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [imageIconInput, setImageIconInput] = useState('');
  const [visibleOnShopInput, setVisibleOnShopInput] = useState(true);
  const [imageJustUploadedInThisSession, setImageJustUploadedInThisSession] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const confirmation = useConfirmation();

  const formDisabled = submitting || imageUploading || loadingEditListings;

  const fetchProducts = useCallback(
    async (pageNum: number = page) => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          division: divisionFilter !== '' ? divisionFilter : undefined,
          category: categoryFilter !== '' ? categoryFilter : undefined,
          ordering: orderBy !== '' ? orderBy : undefined,
        };
        const res = await getProductsPaginated(pageNum, pageSize, params);
        setProducts(res.results);
        setTotalCount(res.count);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, divisionFilter, categoryFilter, orderBy]
  );

  const fetchDivisions = useCallback(async () => {
    try {
      const list = await getDivisions();
      setDivisions(list);
    } catch (err) {
      console.error('Failed to load divisions', err);
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const me = await getMe();
      setAdminType(me.admin_type ?? null);
      setDivisionIds(me.division_ids ?? []);
    } catch (err) {
      console.error('Failed to load me', err);
    }
  }, []);

  useEffect(() => {
    fetchMe();
    fetchDivisions();
  }, [fetchMe, fetchDivisions]);

  useEffect(() => {
    fetchProducts(page);
  }, [fetchProducts, page]);

  const resetForm = useCallback(() => {
    setDivisionId('');
    setListingRows([{ divisionId: '', stock: '' }]);
    setEditInitialListingIds([]);
    setLoadingEditListings(false);
    setEditingProductId(null);
    setNameInput('');
    setDescriptionInput('');
    setPriceInput('');
    setStockInput('');
    setCategoryInput('');
    setImageUrl(null);
    setImagePublicId(null);
    setImageIconInput('');
    setVisibleOnShopInput(true);
    setImageJustUploadedInThisSession(false);
    setImageUploading(false);
    setEditingId(null);
    setSubmitting(false);
  }, []);

  const openCreate = useCallback(() => {
    setModalMode('create');
    resetForm();
    if (divisions.length > 0) {
      setListingRows([{ divisionId: divisions[0].id, stock: '', listingId: undefined }]);
    }
    setModalOpen(true);
  }, [divisions, resetForm]);

  const openEdit = useCallback(
    async (p: ShopProductFromApi) => {
      setModalMode('edit');
      setEditingProductId(p.productId);
      setNameInput(p.name);
      setDescriptionInput(p.description);
      setPriceInput(String(p.price));
      setCategoryInput(p.category);
      setImageUrl(p.imageUrl || null);
      setImagePublicId(p.imagePublicId || null);
      setImageIconInput(p.imageIcon || '');
      setVisibleOnShopInput(p.visibleOnShop !== false);
      setImageJustUploadedInThisSession(false);
      setSubmitting(false);
      setEditInitialListingIds([]);

      if (adminType === 'division_admin') {
        setEditingId(p.id);
        setDivisionId(p.division);
        setStockInput(p.stock != null ? String(p.stock) : '');
        setModalOpen(true);
        return;
      }

      if (adminType === 'main_admin') {
        setEditingId(p.id);
        setDivisionId('');
        setStockInput('');
        setLoadingEditListings(true);
        setModalOpen(true);
        try {
          const res = await getProductsPaginated(1, 100, { product: p.productId });
          const rows: ListingRowState[] = res.results.map((r) => ({
            listingId: r.id,
            divisionId: r.division,
            stock: r.stock != null ? String(r.stock) : '',
          }));
          if (rows.length === 0) {
            rows.push({
              listingId: p.id,
              divisionId: p.division,
              stock: p.stock != null ? String(p.stock) : '',
            });
          }
          setListingRows(rows);
          setEditInitialListingIds(rows.map((r) => r.listingId).filter((id): id is number => id != null));
          setEditingId(rows[0]?.listingId ?? p.id);
        } catch {
          toast.error('Failed to load supplier lines');
          const fallback: ListingRowState[] = [
            {
              listingId: p.id,
              divisionId: p.division,
              stock: p.stock != null ? String(p.stock) : '',
            },
          ];
          setListingRows(fallback);
          setEditInitialListingIds([p.id]);
        } finally {
          setLoadingEditListings(false);
        }
        return;
      }

      setEditingId(p.id);
      setDivisionId(p.division);
      setStockInput(p.stock != null ? String(p.stock) : '');
      setModalOpen(true);
    },
    [adminType]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handleImageChange = useCallback((path: string, publicId?: string) => {
    setImageUrl(path);
    setImagePublicId(publicId ?? null);
    setImageJustUploadedInThisSession(true);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageUrl(null);
    setImagePublicId(null);
    setImageJustUploadedInThisSession(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    const description = descriptionInput.trim();
    const category = categoryInput.trim();
    const price = parseFloat(priceInput);
    const stock = parseFloat(stockInput);
    if (!name || name.length < 2) {
      toast.error('Name is required (at least 2 characters)');
      return;
    }
    if (category === '') {
      toast.error('Category is required');
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      toast.error('Price must be 0 or greater');
      return;
    }

    if (modalMode === 'edit' && adminType === 'division_admin') {
      if (editingId === null) return;
      if (Number.isNaN(stock) || stock < 0) {
        toast.error('Stock (kg) must be 0 or greater');
        return;
      }
      setSubmitting(true);
      try {
        await updateProduct(editingId, { stock });
        toast.success('Stock updated');
        closeModal();
        await fetchProducts();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Request failed';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    let createListings: { division: number; stock: number }[] | null = null;
    if (modalMode === 'create' && adminType === 'main_admin') {
      const rows: { division: number; stock: number }[] = [];
      const seen = new Set<number>();
      for (const row of listingRows) {
        if (row.divisionId === '') {
          toast.error('Select a division for every supplier row');
          return;
        }
        const s = parseFloat(row.stock);
        if (Number.isNaN(s) || s < 0) {
          toast.error('Stock (kg) must be 0 or greater for every row');
          return;
        }
        if (seen.has(row.divisionId)) {
          toast.error('Each division can appear only once');
          return;
        }
        seen.add(row.divisionId);
        rows.push({ division: row.divisionId, stock: s });
      }
      if (rows.length === 0) {
        toast.error('Add at least one supplier row');
        return;
      }
      createListings = rows;
    }

    setSubmitting(true);
    const hadNewlyUploadedImage = imageJustUploadedInThisSession && imageUrl;
    const urlToCleanup = imageUrl;
    const publicIdToCleanup = imagePublicId;

    try {
      if (modalMode === 'create' && adminType === 'main_admin' && createListings) {
        const payload: CreateProductPayload = {
          name,
          description,
          price,
          category,
          listings: createListings,
          image_url: imageUrl ?? null,
          image_public_id: imagePublicId ?? null,
          image_icon: imageIconInput.trim() || null,
          visible_on_shop: visibleOnShopInput,
        };
        await createProduct(payload);
        toast.success('Product created');
      } else if (modalMode === 'edit' && adminType === 'main_admin' && editingProductId !== null) {
        const seenDivisions = new Set<number>();
        const parsedRows: ListingRowState[] = [];
        for (const row of listingRows) {
          if (row.divisionId === '') {
            toast.error('Select a division for every supplier row');
            setSubmitting(false);
            return;
          }
          const s = parseFloat(row.stock);
          if (Number.isNaN(s) || s < 0) {
            toast.error('Stock (kg) must be 0 or greater for every row');
            setSubmitting(false);
            return;
          }
          if (seenDivisions.has(row.divisionId)) {
            toast.error('Each division can appear only once');
            setSubmitting(false);
            return;
          }
          seenDivisions.add(row.divisionId);
          parsedRows.push(row);
        }
        if (parsedRows.length === 0) {
          toast.error('Add at least one supplier row');
          setSubmitting(false);
          return;
        }
        const rowsWithListing = parsedRows.filter((r) => r.listingId != null);
        if (rowsWithListing.length === 0) {
          toast.error('Keep at least one saved supplier line to update catalog details.');
          setSubmitting(false);
          return;
        }
        const primary = rowsWithListing[0];
        const catalogPayload: UpdateProductPayload = {
          name,
          description,
          price,
          category,
          image_url: imageUrl ?? null,
          image_public_id: imagePublicId ?? null,
          image_icon: imageIconInput.trim() || null,
          stock: parseFloat(primary.stock),
          visible_on_shop: visibleOnShopInput,
        };
        await updateProduct(primary.listingId!, catalogPayload);
        for (const r of rowsWithListing) {
          if (r.listingId !== primary.listingId) {
            await updateProduct(r.listingId!, { stock: parseFloat(r.stock) });
          }
        }
        for (const r of parsedRows) {
          if (r.listingId == null) {
            await addProductListing(editingProductId, {
              division: r.divisionId as number,
              stock: parseFloat(r.stock),
            });
          }
        }
        const keptIds = new Set(
          parsedRows.filter((r) => r.listingId != null).map((r) => r.listingId as number)
        );
        for (const id of editInitialListingIds) {
          if (!keptIds.has(id)) {
            await deleteProduct(id);
          }
        }
        toast.success('Product updated');
      }
      closeModal();
      await fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      if (hadNewlyUploadedImage && urlToCleanup) {
        try {
          const deleteResult = await deleteFileFromStorage(urlToCleanup, publicIdToCleanup ?? undefined);
          if (!deleteResult.success) {
            console.warn('Failed to delete orphan image from storage:', deleteResult.error);
          }
        } catch (deleteErr) {
          console.warn('Failed to delete orphan image from storage:', deleteErr);
        }
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (p: ShopProductFromApi) => {
    confirmation.confirm(
      {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${p.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
      },
      async () => {
        try {
          await deleteProduct(p.id);
          toast.success('Product deleted');
          await fetchProducts();
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
        <LoadingSpinner message="Loading products..." />
      </div>
    );
  }

  const handleDivisionFilterChange = (value: number | '') => {
    setDivisionFilter(value);
    setPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const cyclePriceSort = () => {
    setOrderBy((prev): OrderBy => (prev === '' ? 'price' : prev === 'price' ? '-price' : ''));
    setPage(1);
  };

  const cycleStockSort = () => {
    setOrderBy((prev): OrderBy => (prev === '' ? 'stock' : prev === 'stock' ? '-stock' : ''));
    setPage(1);
  };

  const managedDivisionLabel =
    adminType === 'division_admin' && divisionIds.length > 0
      ? divisionIds
          .map((id) => divisions.find((d) => d.id === id)?.name ?? `Division ${id}`)
          .join(', ')
      : null;

  return (
    <div>
      {managedDivisionLabel && (
        <p className="text-sm text-gray-600 mb-4">
          You are managing{' '}
          <span className="font-semibold text-gray-800">{managedDivisionLabel}</span>.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {adminType === 'main_admin' && (
            <div className="flex items-center gap-2">
              <label htmlFor="filter-division" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Division
              </label>
              <select
                id="filter-division"
                value={divisionFilter === '' ? '' : divisionFilter}
                onChange={(e) => handleDivisionFilterChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-category" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Category
            </label>
            <select
              id="filter-category"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        {adminType === 'main_admin' && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No products yet. Click &quot;Add Product&quot; to create one.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={cyclePriceSort}
                    className="inline-flex items-center gap-1 hover:text-gray-700 focus:outline-none"
                  >
                    Price
                    {orderBy === 'price' && <ChevronUp className="h-4 w-4" />}
                    {orderBy === '-price' && <ChevronDown className="h-4 w-4" />}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={cycleStockSort}
                    className="inline-flex items-center gap-1 hover:text-gray-700 focus:outline-none"
                  >
                    Stock (kg)
                    {orderBy === 'stock' && <ChevronUp className="h-4 w-4" />}
                    {orderBy === '-stock' && <ChevronDown className="h-4 w-4" />}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-2xl text-gray-300">{p.imageIcon || '—'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.divisionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {p.visibleOnShop ? (
                      <span className="text-emerald-800 font-medium">Yes</span>
                    ) : (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded">Hidden</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{p.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof p.stock === 'number' ? `${p.stock} kg` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-green-600 hover:text-green-800 mr-4"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    {adminType === 'main_admin' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalCount / pageSize) || 1}
              onPageChange={setPage}
              alwaysShow
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          modalMode === 'create'
            ? 'Add Product'
            : adminType === 'division_admin'
              ? 'Update stock'
              : 'Edit Product'
        }
        size="lg"
        closeOnOutsideClick={false}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode === 'edit' && adminType === 'division_admin' ? (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-1">Product</p>
                <p className="font-medium text-gray-900">{nameInput}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Division</p>
                <p className="font-medium text-gray-900">
                  {divisions.find((d) => d.id === divisionId)?.name ?? '—'}
                </p>
              </div>
              <div>
                <label htmlFor="div-admin-stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock (kg) *
                </label>
                <input
                  id="div-admin-stock"
                  type="number"
                  min={0}
                  step={0.01}
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={formDisabled}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={formDisabled}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
                  disabled={formDisabled}
                >
                  {submitting ? 'Saving...' : 'Save stock'}
                </button>
              </div>
            </>
          ) : adminType === 'main_admin' ? (
            <>
              <section className="rounded-xl border border-stone-200/90 bg-gradient-to-br from-stone-50 via-white to-emerald-50/40 pl-4 pr-4 py-5 shadow-sm border-l-[3px] border-l-emerald-800">
                <h3 className="font-serif text-lg font-semibold text-stone-900 tracking-tight">
                  Catalog
                </h3>
                <p className="text-xs text-stone-600 mt-1 mb-4 max-w-xl">
                  Shared name, price, category, and imagery for this product. Supplier-specific stock is set below.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-stone-800 mb-1">
                      Name *
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 bg-white/80"
                      placeholder="Product name"
                      disabled={formDisabled}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="product-description"
                      className="block text-sm font-medium text-stone-800 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="product-description"
                      value={descriptionInput}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 bg-white/80"
                      placeholder="Description"
                      disabled={formDisabled}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="product-price" className="block text-sm font-medium text-stone-800 mb-1">
                        Price *
                      </label>
                      <input
                        id="product-price"
                        type="number"
                        min={0}
                        step={0.01}
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 bg-white/80"
                        placeholder="0.00"
                        disabled={formDisabled}
                      />
                    </div>
                    <div>
                      <label htmlFor="product-category" className="block text-sm font-medium text-stone-800 mb-1">
                        Category *
                      </label>
                      <select
                        id="product-category"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 bg-white/80"
                        disabled={formDisabled}
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                  <div className="rounded-lg border border-stone-200 bg-white/60 px-3 py-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleOnShopInput}
                        onChange={(e) => setVisibleOnShopInput(e.target.checked)}
                        className="mt-0.5 rounded border-stone-300 text-emerald-800 focus:ring-emerald-600"
                        disabled={formDisabled}
                      />
                      <span>
                        <span className="block text-sm font-medium text-stone-800">Show on public shop</span>
                        <span className="block text-xs text-stone-500 mt-0.5">
                          When off, this product is hidden from the storefront and checkout (admin can still manage it).
                        </span>
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-800 mb-1">Image (optional)</label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <ImageUploader
                          currentImage={imageUrl ?? undefined}
                          onImageChange={handleImageChange}
                          onUploadingChange={setImageUploading}
                          directory={PRODUCT_IMAGE_DIR}
                          label="Upload image"
                          requireTitle={false}
                        />
                      </div>
                      {(imageUrl || imagePublicId) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          aria-label="Remove image"
                          disabled={formDisabled}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product-image-icon" className="block text-sm font-medium text-stone-800 mb-1">
                      Image icon (emoji fallback)
                    </label>
                    <input
                      id="product-image-icon"
                      type="text"
                      value={imageIconInput}
                      onChange={(e) => setImageIconInput(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 bg-white/80"
                      placeholder="e.g. 🌿"
                      maxLength={16}
                      disabled={formDisabled}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-stone-200 bg-white pl-4 pr-4 py-5 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-stone-900 tracking-tight">
                  Divisions &amp; stock
                </h3>
                <p className="text-xs text-stone-600 mt-1 mb-3">
                  Add one row per research center or supplier. Stock is in kilograms. Saved lines keep their division;
                  new rows pick a division.
                </p>
                {loadingEditListings ? (
                  <div className="py-8 flex justify-center">
                    <LoadingSpinner message="Loading supplier lines..." />
                  </div>
                ) : (
                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-stone-200 bg-stone-50/80">
                          <th className="text-left px-3 py-2 font-medium text-stone-700">Division</th>
                          <th className="text-left px-3 py-2 font-medium text-stone-700">Stock (kg)</th>
                          <th className="w-10" />
                        </tr>
                      </thead>
                      <tbody>
                        {listingRows.map((row, idx) => (
                          <tr
                            key={row.listingId != null ? `listing-${row.listingId}` : `new-${idx}`}
                            className="border-b border-stone-100"
                          >
                            <td className="px-3 py-2 align-top">
                              {row.listingId != null && modalMode === 'edit' ? (
                                <span className="inline-block px-2 py-1.5 text-stone-800 font-medium">
                                  {divisions.find((d) => d.id === row.divisionId)?.name ?? `Division ${row.divisionId}`}
                                </span>
                              ) : (
                                <select
                                  value={row.divisionId === '' ? '' : row.divisionId}
                                  onChange={(e) => {
                                    const v = e.target.value === '' ? '' : Number(e.target.value);
                                    setListingRows((prev) =>
                                      prev.map((r, i) => (i === idx ? { ...r, divisionId: v } : r))
                                    );
                                  }}
                                  className="w-full px-2 py-1.5 border border-stone-300 rounded-md bg-white"
                                  disabled={formDisabled}
                                >
                                  <option value="">Select</option>
                                  {divisions.map((d) => (
                                    <option key={d.id} value={d.id}>
                                      {d.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td className="px-3 py-2 align-top">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={row.stock}
                                onChange={(e) =>
                                  setListingRows((prev) =>
                                    prev.map((r, i) => (i === idx ? { ...r, stock: e.target.value } : r))
                                  )
                                }
                                className="w-full px-2 py-1.5 border border-stone-300 rounded-md"
                                disabled={formDisabled}
                                placeholder="0"
                              />
                            </td>
                            <td className="px-1 py-2 align-top">
                              <button
                                type="button"
                                className="text-red-600 p-1 hover:bg-red-50 rounded"
                                onClick={() => setListingRows((prev) => prev.filter((_, i) => i !== idx))}
                                disabled={formDisabled}
                                aria-label="Remove row"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-3 py-2 bg-stone-50/90 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() =>
                          setListingRows((prev) => [...prev, { divisionId: '', stock: '' }])
                        }
                        className="text-sm text-emerald-800 font-medium hover:underline"
                        disabled={formDisabled}
                      >
                        + Add division row
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={formDisabled}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
                  disabled={formDisabled}
                >
                  {submitting ? 'Saving...' : imageUploading ? 'Uploading...' : modalMode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500 py-6 text-center">Loading admin permissions…</p>
          )}
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

export default AdminShopProducts;

import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, FileText, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NewsItem, Event } from '../../types';
import Modal from './Modal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useConfirmation } from '../../hooks/useConfirmation';
import { uploadPDFFile, uploadImageFile } from '../../services/admin/fileUploadService';
import { getBlogBySlug, createBlog, updateBlog, generateUniqueSlug } from '../../services/firebase/blogService';
import { addNewsItem, updateNewsItem } from '../../services/firebase/newsEventService';

interface NewsEventEditorProps<T extends NewsItem | Event> {
  items: T[];
  onItemsChange?: (items: T[]) => void;  // Optional for backward compatibility
  onAdd?: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<void>;
  onEdit?: (id: string, item: Partial<T>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  title: string;
  itemType: 'news' | 'event';
  isLoading?: boolean;
}

const NewsEventEditor = <T extends NewsItem | Event>({
  items,
  onItemsChange,
  onAdd,
  onEdit,
  onDelete,
  title,
  itemType,
  isLoading = false
}: NewsEventEditorProps<T>) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadPdfProgress, setUploadPdfProgress] = useState(0);
  const [uploadPdfError, setUploadPdfError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const confirmation = useConfirmation();

  // News-only: "Publish as Blog" and blog form state
  const [publishAsBlog, setPublishAsBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState<{
    heading: string;
    featuredImageUrl?: string;
    featuredImagePublicId?: string;
    imageTitle?: string;
    description?: string;
    link?: string;
    pdfUrl?: string;
    pdfPublicId?: string;
  }>({ heading: '' });
  const [blogId, setBlogId] = useState<string | null>(null);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const blogPdfInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingBlogPdf, setIsUploadingBlogPdf] = useState(false);
  const [uploadBlogPdfProgress, setUploadBlogPdfProgress] = useState(0);
  const [uploadBlogPdfError, setUploadBlogPdfError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const newItem = {
      date: '',
      title: '',
      excerpt: '',
      link: undefined,
      pdfUrl: undefined,
      pdfPublicId: undefined,
      ...(itemType === 'news' ? { blogSlug: undefined } : {})
    } as T;
    setFormData(newItem);
    setEditingId(null);
    setShowForm(true);
    setUploadPdfError(null);
    pdfInputRef.current?.setAttribute('value', '');
    if (itemType === 'news') {
      setPublishAsBlog(false);
      setBlogFormData({ heading: '' });
      setBlogId(null);
      setUploadBlogPdfError(null);
      blogPdfInputRef.current?.setAttribute('value', '');
    }
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setFormData({ ...item });
      setEditingId(id);
      setShowForm(true);
      setUploadPdfError(null);
      pdfInputRef.current?.setAttribute('value', '');
      if (itemType === 'news') {
        const newsItem = item as NewsItem;
        setPublishAsBlog(!!newsItem.blogSlug);
        setBlogId(null);
        setBlogFormData({ heading: '' });
        setUploadBlogPdfError(null);
        blogPdfInputRef.current?.setAttribute('value', '');
        if (newsItem.blogSlug) {
          setLoadingBlog(true);
          getBlogBySlug(newsItem.blogSlug)
            .then((blog) => {
              if (blog) {
                setBlogFormData({
                  heading: blog.heading,
                  featuredImageUrl: blog.featuredImageUrl,
                  featuredImagePublicId: blog.featuredImagePublicId,
                  imageTitle: blog.imageTitle,
                  description: blog.description,
                  link: blog.link,
                  pdfUrl: blog.pdfUrl,
                  pdfPublicId: blog.pdfPublicId
                });
                setBlogId(blog.id ?? null);
              }
            })
            .catch(() => {})
            .finally(() => setLoadingBlog(false));
        }
      }
    }
  };

  const handleLinkChange = (value: string) => {
    const trimmed = value.trim() || undefined;
    setFormData({
      ...formData!,
      link: trimmed,
      pdfUrl: trimmed ? undefined : formData?.pdfUrl,
      pdfPublicId: trimmed ? undefined : formData?.pdfPublicId
    } as T);
    if (trimmed && pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    if (file.type !== 'application/pdf') {
      setUploadPdfError('Please select a PDF file.');
      return;
    }
    setUploadPdfError(null);
    setIsUploadingPdf(true);
    setUploadPdfProgress(0);
    try {
      const result = await uploadPDFFile(
        file,
        'tn-forest/news-events-pdf',
        (progress) => setUploadPdfProgress(progress)
      );
      if (result.success && result.path && result.publicId !== undefined) {
        setFormData({
          ...formData,
          pdfUrl: result.path,
          pdfPublicId: result.publicId || '',
          link: undefined
        } as T);
      } else {
        setUploadPdfError(result.error || 'Failed to upload PDF');
      }
    } catch (err) {
      setUploadPdfError(err instanceof Error ? err.message : 'Failed to upload PDF');
    } finally {
      setIsUploadingPdf(false);
      setUploadPdfProgress(0);
      e.target.value = '';
    }
  };

  const handleRemovePdf = () => {
    setFormData({
      ...formData!,
      pdfUrl: undefined,
      pdfPublicId: undefined
    } as T);
    pdfInputRef.current?.setAttribute('value', '');
    setUploadPdfError(null);
  };

  const setPublishAsBlogWithTransfer = (value: boolean) => {
    if (value && formData && itemType === 'news') {
      const newsItem = formData as NewsItem;
      if (newsItem.link || newsItem.pdfUrl) {
        setBlogFormData((prev) => ({
          ...prev,
          link: newsItem.link || prev.link,
          pdfUrl: newsItem.pdfUrl || prev.pdfUrl,
          pdfPublicId: newsItem.pdfPublicId || prev.pdfPublicId
        }));
        setFormData({
          ...formData,
          link: undefined,
          pdfUrl: undefined,
          pdfPublicId: undefined
        } as T);
      }
    }
    setPublishAsBlog(value);
  };

  const handleBlogLinkChange = (value: string) => {
    const trimmed = value.trim() || undefined;
    setBlogFormData((prev) => ({
      ...prev,
      link: trimmed,
      pdfUrl: trimmed ? undefined : prev.pdfUrl,
      pdfPublicId: trimmed ? undefined : prev.pdfPublicId
    }));
    if (trimmed && blogPdfInputRef.current) blogPdfInputRef.current.value = '';
  };

  const handleBlogPdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setUploadBlogPdfError('Please select a PDF file.');
      return;
    }
    setUploadBlogPdfError(null);
    setIsUploadingBlogPdf(true);
    setUploadBlogPdfProgress(0);
    try {
      const result = await uploadPDFFile(file, 'tn-forest/blog-pdf', (p) => setUploadBlogPdfProgress(p));
      if (result.success && result.path && result.publicId !== undefined) {
        setBlogFormData((prev) => ({
          ...prev,
          pdfUrl: result.path,
          pdfPublicId: result.publicId || '',
          link: undefined
        }));
      } else {
        setUploadBlogPdfError(result.error || 'Failed to upload PDF');
      }
    } catch (err) {
      setUploadBlogPdfError(err instanceof Error ? err.message : 'Failed to upload PDF');
    } finally {
      setIsUploadingBlogPdf(false);
      setUploadBlogPdfProgress(0);
      e.target.value = '';
    }
  };

  const handleRemoveBlogPdf = () => {
    setBlogFormData((prev) => ({ ...prev, pdfUrl: undefined, pdfPublicId: undefined }));
    blogPdfInputRef.current?.setAttribute('value', '');
    setUploadBlogPdfError(null);
  };

  const handleFeaturedImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const result = await uploadImageFile(file, 'tn-forest/blog-images');
      if (result.success && result.path && result.publicId !== undefined) {
        setBlogFormData((prev) => ({
          ...prev,
          featuredImageUrl: result.path,
          featuredImagePublicId: result.publicId || ''
        }));
      }
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData || !formData.title.trim()) return;

    const isNewsWithBlog = itemType === 'news' && publishAsBlog;
    if (isNewsWithBlog) {
      if (!blogFormData.heading.trim()) return;
      if (blogFormData.link && blogFormData.pdfUrl) return; // mutual exclusion
    }

    setIsSaving(true);
    try {
      if (isNewsWithBlog) {
        const slug = await generateUniqueSlug(blogFormData.heading, blogId || undefined);
        const blogPayload = {
          slug,
          heading: blogFormData.heading.trim(),
          featuredImageUrl: blogFormData.featuredImageUrl?.trim() || '',
          featuredImagePublicId: blogFormData.featuredImagePublicId?.trim() || '',
          imageTitle: blogFormData.imageTitle?.trim() || '',
          description: blogFormData.description?.trim() || '',
          link: blogFormData.link?.trim() || '',
          pdfUrl: blogFormData.pdfUrl?.trim() || '',
          pdfPublicId: blogFormData.pdfPublicId?.trim() || ''
        };
        if (editingId) {
          if (blogId) {
            await updateBlog(blogId, blogPayload);
            await updateNewsItem(editingId, {
              date: formData.date,
              title: formData.title,
              excerpt: formData.excerpt,
              link: '',
              pdfUrl: '',
              pdfPublicId: '',
              blogSlug: slug
            });
          } else {
            const newBlogId = await createBlog({ ...blogPayload, newsId: editingId });
            await updateNewsItem(editingId, {
              date: formData.date,
              title: formData.title,
              excerpt: formData.excerpt,
              link: '',
              pdfUrl: '',
              pdfPublicId: '',
              blogSlug: slug
            });
            await updateBlog(newBlogId, { newsId: editingId });
          }
        } else {
          const newBlogId = await createBlog({ ...blogPayload, newsId: '' });
          const newsId = await addNewsItem({
            date: formData.date,
            title: formData.title,
            excerpt: formData.excerpt,
            link: '',
            pdfUrl: '',
            pdfPublicId: '',
            blogSlug: slug
          });
          await updateBlog(newBlogId, { newsId });
        }
        handleCancel();
        return;
      }

      if (editingId && onEdit) {
        await onEdit(editingId, {
          date: formData.date,
          title: formData.title,
          excerpt: formData.excerpt,
          link: formData.link ?? '',
          pdfUrl: formData.pdfUrl ?? '',
          pdfPublicId: formData.pdfPublicId ?? '',
          ...(itemType === 'news' ? { blogSlug: (formData as NewsItem).blogSlug ?? '' } : {})
        } as Partial<T>);
      } else if (onAdd) {
        await onAdd({
          date: formData.date,
          title: formData.title,
          excerpt: formData.excerpt,
          link: formData.link ?? '',
          pdfUrl: formData.pdfUrl ?? '',
          pdfPublicId: formData.pdfPublicId ?? '',
          ...(itemType === 'news' ? { blogSlug: (formData as NewsItem).blogSlug ?? '' } : {})
        } as Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
      } else if (onItemsChange) {
        // Fallback to old behavior
        if (editingId) {
          const index = items.findIndex(i => i.id === editingId);
          if (index !== -1) {
            const updated = [...items];
            updated[index] = formData;
            onItemsChange(updated);
          }
        } else {
          onItemsChange([...items, formData]);
        }
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    setEditingId(null);
    setShowForm(false);
    if (itemType === 'news') {
      setPublishAsBlog(false);
      setBlogFormData({ heading: '' });
      setBlogId(null);
      setUploadBlogPdfError(null);
    }
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.id === id);
    confirmation.confirm(
      {
        title: `Delete ${itemType === 'news' ? 'News' : 'Event'}`,
        message: `Are you sure you want to delete "${item?.title || 'this item'}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      },
      async () => {
        try {
          setDeletingId(id);
          if (onDelete) {
            await onDelete(id);
          } else if (onItemsChange) {
            // Fallback to old behavior
            const updated = items.filter(item => item.id !== id);
            onItemsChange(updated);
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          // Error will be handled by parent component via toast
          throw error;
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  return (
    <>
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
      <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-green-900">{title}</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add {itemType === 'news' ? 'News' : 'Event'}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingId !== null ? `Edit ${itemType === 'news' ? 'News' : 'Event'}` : `Add ${itemType === 'news' ? 'News' : 'Event'}`}
        size="md"
        closeOnOutsideClick={false}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={formData?.date || ''}
              onChange={(e) => setFormData({ ...formData!, date: e.target.value } as T)}
              placeholder="e.g., Oct 10, 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData?.title || ''}
              onChange={(e) => setFormData({ ...formData!, title: e.target.value } as T)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              value={formData?.excerpt || ''}
              onChange={(e) => setFormData({ ...formData!, excerpt: e.target.value } as T)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter brief description"
            />
          </div>

          {itemType === 'news' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publish-as-blog"
                checked={publishAsBlog}
                onChange={(e) => setPublishAsBlogWithTransfer(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="publish-as-blog" className="text-sm font-medium text-gray-700">
                Publish this news item as a Blog Post
              </label>
            </div>
          )}

          {itemType === 'news' && publishAsBlog && (
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: loadingBlog ? 60 : 2000 }}
            >
              {loadingBlog ? (
                <p className="text-sm text-gray-500">Loading blog...</p>
              ) : (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-green-900">Blog section</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heading *</label>
                    <input
                      type="text"
                      value={blogFormData.heading}
                      onChange={(e) => setBlogFormData((p) => ({ ...p, heading: e.target.value }))}
                      placeholder="Blog post heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured image (optional)</label>
                    <input
                      ref={featuredImageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFeaturedImageSelect}
                      className="hidden"
                    />
                    {blogFormData.featuredImageUrl ? (
                      <div className="flex items-center gap-2">
                        <img src={blogFormData.featuredImageUrl} alt="" className="h-20 w-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setBlogFormData((p) => ({ ...p, featuredImageUrl: undefined, featuredImagePublicId: undefined }))}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => featuredImageInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <ImageIcon className="h-4 w-4" />
                        {isUploadingImage ? 'Uploading...' : 'Choose image'}
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image title (optional)</label>
                    <input
                      type="text"
                      value={blogFormData.imageTitle || ''}
                      onChange={(e) => setBlogFormData((p) => ({ ...p, imageTitle: e.target.value }))}
                      placeholder="Caption for featured image"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <textarea
                      value={blogFormData.description || ''}
                      onChange={(e) => setBlogFormData((p) => ({ ...p, description: e.target.value }))}
                      rows={4}
                      placeholder="Blog content (plain text or HTML)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link (optional — use either link or PDF, not both)
                    </label>
                    <input
                      type="text"
                      value={blogFormData.link || ''}
                      onChange={(e) => handleBlogLinkChange(e.target.value)}
                      placeholder="https://example.com or /path"
                      disabled={!!blogFormData.pdfUrl}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF (optional — use either link or PDF, not both)
                    </label>
                    {blogFormData.pdfUrl ? (
                      <div className="flex items-center justify-between gap-2 p-2 bg-green-50 rounded-lg">
                        <a href={blogFormData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 truncate">
                          <FileText className="h-4 w-4 inline mr-1" /> PDF
                        </a>
                        <button type="button" onClick={handleRemoveBlogPdf} className="text-sm text-red-600">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          ref={blogPdfInputRef}
                          type="file"
                          accept="application/pdf"
                          onChange={handleBlogPdfSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => blogPdfInputRef.current?.click()}
                          disabled={!!blogFormData.link || isUploadingBlogPdf}
                          className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm disabled:opacity-50"
                        >
                          {isUploadingBlogPdf ? `Uploading… ${uploadBlogPdfProgress}%` : 'Choose PDF'}
                        </button>
                      </>
                    )}
                    {uploadBlogPdfError && <p className="text-sm text-red-600 mt-1">{uploadBlogPdfError}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {!(itemType === 'news' && publishAsBlog) && (
            <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link (Optional — use either link or PDF, not both)
            </label>
            <input
              type="text"
              value={formData?.link || ''}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="/news/article-name or https://example.com"
              disabled={!!formData?.pdfUrl}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF (Optional — use either link or PDF, not both)
            </label>
            {formData?.pdfUrl && !isUploadingPdf && (
              <div className="mb-2 p-2 bg-green-50 rounded-lg flex items-center justify-between gap-2">
                <a
                  href={formData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline flex items-center gap-1 truncate"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{formData.pdfUrl.split('/').pop() || 'PDF'}</span>
                </a>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
            {!formData?.pdfUrl && (
              <div className="space-y-2">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfSelect}
                  className="hidden"
                  disabled={!!formData?.link || isUploadingPdf}
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={!!formData?.link || isUploadingPdf}
                  className="relative w-full min-h-[42px] px-4 py-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors overflow-hidden"
                >
                  {isUploadingPdf ? (
                    <>
                      <span className="relative z-10">Uploading… {uploadPdfProgress}%</span>
                      <span
                        className="absolute inset-y-0 left-0 bg-green-200 transition-all duration-300"
                        style={{ width: `${uploadPdfProgress}%` }}
                      />
                    </>
                  ) : (
                    'Choose PDF to upload'
                  )}
                </button>
                {isUploadingPdf && (
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all duration-300"
                      style={{ width: `${uploadPdfProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            {uploadPdfError && <p className="text-sm text-red-600 mt-1">{uploadPdfError}</p>}
          </div>
          </>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving || isUploadingPdf || (itemType === 'news' && publishAsBlog && (isUploadingImage || isUploadingBlogPdf)) || !formData?.title.trim() || (itemType === 'news' && publishAsBlog && !blogFormData.heading.trim())}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-3">
        {isLoading && items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Loading {itemType}...</p>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id || Math.random()}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                <h4 className="font-semibold text-green-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.excerpt}</p>
                {itemType === 'news' && (item as NewsItem).blogSlug && (
                  <Link to={`/blog/${(item as NewsItem).blogSlug}`} className="text-sm text-green-600 hover:underline inline-flex items-center gap-1">
                    View blog →
                  </Link>
                )}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                    {item.link}
                  </a>
                )}
                {item.pdfUrl && !item.link && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline inline-flex items-center gap-1">
                    <FileText className="h-4 w-4" /> View PDF
                  </a>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => item.id && handleEdit(item.id)}
                  disabled={!item.id}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id)}
                  disabled={!item.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No {itemType} items yet. Click "Add {itemType === 'news' ? 'News' : 'Event'}" to create one.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default NewsEventEditor;


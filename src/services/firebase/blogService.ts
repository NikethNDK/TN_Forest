/**
 * Blog Service
 *
 * Handles Firestore operations for blog posts (linked to news when "Publish as Blog" is used).
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { deleteFileFromStorage } from './storageService';
import { updateNewsItem, updateEventItem } from './newsEventService';
import type { Blog } from '../../types';

const BLOGS_COLLECTION = 'blogs';

/**
 * Slugify a string for URL use: lowercase, spaces to hyphens, remove non-alphanumeric.
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate a unique slug from heading. If slug exists, append short id.
 */
export async function generateUniqueSlug(heading: string, excludeId?: string): Promise<string> {
  let base = slugify(heading);
  if (!base) base = 'post';
  let slug = base;
  let attempt = 0;
  const maxAttempts = 100;
  while (attempt < maxAttempts) {
    const existing = await getBlogBySlug(slug);
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    attempt += 1;
    slug = `${base}-${Date.now().toString(36)}${attempt > 1 ? `-${attempt}` : ''}`;
  }
  return `${base}-${Date.now()}`;
}

function docToBlog(docSnapshot: { id: string; data: () => Record<string, unknown> }): Blog {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    slug: (data.slug as string) || '',
    heading: (data.heading as string) || '',
    featuredImageUrl: (data.featuredImageUrl as string) || undefined,
    featuredImagePublicId: (data.featuredImagePublicId as string) || undefined,
    imageTitle: (data.imageTitle as string) || undefined,
    description: (data.description as string) || undefined,
    link: (data.link as string) || undefined,
    pdfUrl: (data.pdfUrl as string) || undefined,
    pdfPublicId: (data.pdfPublicId as string) || undefined,
    newsId: (data.newsId as string) || undefined,
    eventId: (data.eventId as string) || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Create a new blog post.
 */
export const createBlog = async (
  blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const blogsRef = collection(db, BLOGS_COLLECTION);
  const newBlog = {
    slug: blog.slug.trim(),
    heading: blog.heading.trim(),
    featuredImageUrl: blog.featuredImageUrl?.trim() || '',
    featuredImagePublicId: blog.featuredImagePublicId?.trim() || '',
    imageTitle: blog.imageTitle?.trim() || '',
    description: blog.description?.trim() || '',
    link: blog.link?.trim() || '',
    pdfUrl: blog.pdfUrl?.trim() || '',
    pdfPublicId: blog.pdfPublicId?.trim() || '',
    newsId: blog.newsId?.trim() || '',
    eventId: blog.eventId?.trim() || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(blogsRef, newBlog);
  return docRef.id;
};

/**
 * Get a blog post by slug.
 */
export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const blogsRef = collection(db, BLOGS_COLLECTION);
  const q = query(blogsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return docToBlog({ id: d.id, data: () => d.data() });
};

/**
 * Get a blog post by document ID.
 */
export const getBlogById = async (id: string): Promise<Blog | null> => {
  const blogRef = doc(db, BLOGS_COLLECTION, id);
  const docSnapshot = await getDoc(blogRef);
  if (!docSnapshot.exists()) return null;
  return docToBlog({ id: docSnapshot.id, data: () => docSnapshot.data() });
};

/**
 * Update a blog post.
 */
export const updateBlog = async (
  id: string,
  updates: Partial<Pick<Blog, 'slug' | 'heading' | 'featuredImageUrl' | 'featuredImagePublicId' | 'imageTitle' | 'description' | 'link' | 'pdfUrl' | 'pdfPublicId' | 'newsId' | 'eventId'>>
): Promise<void> => {
  const blogRef = doc(db, BLOGS_COLLECTION, id);
  const updateData: Record<string, unknown> = {
    updatedAt: Timestamp.now(),
  };
  if (updates.slug !== undefined) updateData.slug = updates.slug.trim();
  if (updates.heading !== undefined) updateData.heading = updates.heading.trim();
  if (updates.featuredImageUrl !== undefined) updateData.featuredImageUrl = updates.featuredImageUrl.trim() || '';
  if (updates.featuredImagePublicId !== undefined) updateData.featuredImagePublicId = updates.featuredImagePublicId.trim() || '';
  if (updates.imageTitle !== undefined) updateData.imageTitle = updates.imageTitle.trim() || '';
  if (updates.description !== undefined) updateData.description = updates.description?.trim() || '';
  if (updates.link !== undefined) updateData.link = updates.link.trim() || '';
  if (updates.pdfUrl !== undefined) updateData.pdfUrl = updates.pdfUrl.trim() || '';
  if (updates.pdfPublicId !== undefined) updateData.pdfPublicId = updates.pdfPublicId.trim() || '';
  if (updates.newsId !== undefined) updateData.newsId = updates.newsId.trim() || '';
  if (updates.eventId !== undefined) updateData.eventId = updates.eventId.trim() || '';
  await updateDoc(blogRef, updateData);
};

/**
 * Delete a blog post. If it has newsId, clear blogSlug on that news item; if eventId (legacy), clear event.blogSlug.
 */
export const deleteBlog = async (id: string): Promise<void> => {
  const blogRef = doc(db, BLOGS_COLLECTION, id);
  const docSnapshot = await getDoc(blogRef);
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    if (data.pdfUrl) {
      try {
        await deleteFileFromStorage(data.pdfUrl as string, data.pdfPublicId as string);
      } catch (storageError) {
        console.warn('Failed to delete blog PDF from storage:', storageError);
      }
    }
    const newsId = data.newsId as string | undefined;
    const eventId = data.eventId as string | undefined;
    await deleteDoc(blogRef);
    if (newsId) {
      await updateNewsItem(newsId, { blogSlug: '' });
    }
    if (eventId) {
      await updateEventItem(eventId, { blogSlug: '' });
    }
  }
};

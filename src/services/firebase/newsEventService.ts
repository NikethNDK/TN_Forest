/**
 * News & Events Service
 * 
 * Handles all Firestore operations for news and events
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
  orderBy,
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { deleteFileFromStorage } from './storageService';
import type { NewsItem, Event } from '../../types';

const NEWS_COLLECTION = 'news';
const EVENTS_COLLECTION = 'events';

const mapNewsItem = (docSnapshot: { id: string; data: () => Record<string, any> }): NewsItem => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    date: data.date || '',
    title: data.title || '',
    excerpt: data.excerpt || '',
    link: data.link || undefined,
    pdfUrl: data.pdfUrl || undefined,
    pdfPublicId: data.pdfPublicId || undefined,
    blogSlug: data.blogSlug || undefined,
    showOnWelcomeModal: !!data.showOnWelcomeModal,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    order: data.order
  };
};

const mapEventItem = (docSnapshot: { id: string; data: () => Record<string, any> }): Event => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    date: data.date || '',
    title: data.title || '',
    excerpt: data.excerpt || '',
    link: data.link || undefined,
    pdfUrl: data.pdfUrl || undefined,
    pdfPublicId: data.pdfPublicId || undefined,
    blogSlug: data.blogSlug || undefined,
    showOnWelcomeModal: !!data.showOnWelcomeModal,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    order: data.order
  };
};

// ==================== NEWS OPERATIONS ====================

/**
 * Get all news items, ordered by createdAt descending (newest first)
 */
export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(newsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const news: NewsItem[] = [];
    querySnapshot.forEach((docSnapshot) => {
      news.push(mapNewsItem(docSnapshot));
    });
    
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news items');
  }
};

/**
 * Get a single news item by ID
 */
export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    const docSnapshot = await getDoc(newsRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return mapNewsItem(docSnapshot);
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw new Error('Failed to fetch news item');
  }
};

/**
 * Add a new news item
 */
export const addNewsItem = async (news: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<string> => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const newNews = {
      date: news.date.trim(),
      title: news.title.trim(),
      excerpt: news.excerpt.trim(),
      link: news.link?.trim() || '',
      pdfUrl: news.pdfUrl?.trim() || '',
      pdfPublicId: news.pdfPublicId?.trim() || '',
      blogSlug: news.blogSlug?.trim() || '',
      showOnWelcomeModal: !!news.showOnWelcomeModal,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      order: Date.now() // Use timestamp for ordering
    };
    
    const docRef = await addDoc(newsRef, newNews);
    return docRef.id;
  } catch (error) {
    console.error('Error adding news item:', error);
    throw new Error('Failed to add news item');
  }
};

/**
 * Update a news item
 */
export const updateNewsItem = async (
  id: string,
  updates: Partial<Pick<NewsItem, 'date' | 'title' | 'excerpt' | 'link' | 'pdfUrl' | 'pdfPublicId' | 'blogSlug' | 'showOnWelcomeModal'>>
): Promise<void> => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.date !== undefined) {
      updateData.date = updates.date.trim();
    }
    if (updates.title !== undefined) {
      updateData.title = updates.title.trim();
    }
    if (updates.excerpt !== undefined) {
      updateData.excerpt = updates.excerpt.trim();
    }
    if (updates.link !== undefined) {
      updateData.link = updates.link.trim() || '';
    }
    if (updates.pdfUrl !== undefined) {
      updateData.pdfUrl = updates.pdfUrl.trim() || '';
    }
    if (updates.pdfPublicId !== undefined) {
      updateData.pdfPublicId = updates.pdfPublicId.trim() || '';
    }
    if (updates.blogSlug !== undefined) {
      updateData.blogSlug = updates.blogSlug.trim() || '';
    }
    if (updates.showOnWelcomeModal !== undefined) {
      updateData.showOnWelcomeModal = !!updates.showOnWelcomeModal;
    }
    
    await updateDoc(newsRef, updateData);
  } catch (error) {
    console.error('Error updating news item:', error);
    throw new Error('Failed to update news item');
  }
};

/**
 * Delete a news item (and its PDF from storage if present)
 */
export const deleteNewsItem = async (id: string): Promise<void> => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, id);
    const docSnapshot = await getDoc(newsRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (data.pdfUrl) {
        try {
          await deleteFileFromStorage(data.pdfUrl, data.pdfPublicId);
        } catch (storageError) {
          console.warn('Failed to delete PDF from storage:', storageError);
        }
      }
    }
    await deleteDoc(newsRef);
  } catch (error) {
    console.error('Error deleting news item:', error);
    throw new Error('Failed to delete news item');
  }
};

/**
 * Subscribe to real-time updates of news items
 * Returns an unsubscribe function
 */
export const subscribeToNews = (
  callback: (news: NewsItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(newsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const news: NewsItem[] = [];
        querySnapshot.forEach((docSnapshot) => {
          news.push(mapNewsItem(docSnapshot));
        });
        callback(news);
      },
      (error) => {
        console.error('Error in news subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to news updates'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up news subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to set up subscription'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};

// ==================== EVENTS OPERATIONS ====================

/**
 * Get all events, ordered by createdAt descending (newest first)
 */
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const events: Event[] = [];
    querySnapshot.forEach((docSnapshot) => {
      events.push(mapEventItem(docSnapshot));
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    const docSnapshot = await getDoc(eventRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return mapEventItem(docSnapshot);
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
};

/**
 * Add a new event item
 */
export const addEventItem = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<string> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const newEvent = {
      date: event.date.trim(),
      title: event.title.trim(),
      excerpt: event.excerpt.trim(),
      link: event.link?.trim() || '',
      pdfUrl: event.pdfUrl?.trim() || '',
      pdfPublicId: event.pdfPublicId?.trim() || '',
      blogSlug: event.blogSlug?.trim() || '',
      showOnWelcomeModal: !!event.showOnWelcomeModal,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      order: Date.now() // Use timestamp for ordering
    };
    
    const docRef = await addDoc(eventsRef, newEvent);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw new Error('Failed to add event');
  }
};

/**
 * Update an event item
 */
export const updateEventItem = async (
  id: string,
  updates: Partial<Pick<Event, 'date' | 'title' | 'excerpt' | 'link' | 'pdfUrl' | 'pdfPublicId' | 'blogSlug' | 'showOnWelcomeModal'>>
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    if (updates.date !== undefined) {
      updateData.date = updates.date.trim();
    }
    if (updates.title !== undefined) {
      updateData.title = updates.title.trim();
    }
    if (updates.excerpt !== undefined) {
      updateData.excerpt = updates.excerpt.trim();
    }
    if (updates.link !== undefined) {
      updateData.link = updates.link.trim() || '';
    }
    if (updates.pdfUrl !== undefined) {
      updateData.pdfUrl = updates.pdfUrl.trim() || '';
    }
    if (updates.pdfPublicId !== undefined) {
      updateData.pdfPublicId = updates.pdfPublicId.trim() || '';
    }
    if (updates.blogSlug !== undefined) {
      updateData.blogSlug = updates.blogSlug.trim() || '';
    }
    if (updates.showOnWelcomeModal !== undefined) {
      updateData.showOnWelcomeModal = !!updates.showOnWelcomeModal;
    }
    
    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
};

/**
 * Delete an event item (and its PDF from storage if present)
 */
export const deleteEventItem = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    const docSnapshot = await getDoc(eventRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (data.pdfUrl) {
        try {
          await deleteFileFromStorage(data.pdfUrl, data.pdfPublicId);
        } catch (storageError) {
          console.warn('Failed to delete PDF from storage:', storageError);
        }
      }
    }
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

/**
 * Subscribe to real-time updates of events
 * Returns an unsubscribe function
 */
export const subscribeToEvents = (
  callback: (events: Event[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const events: Event[] = [];
        querySnapshot.forEach((docSnapshot) => {
          events.push(mapEventItem(docSnapshot));
        });
        callback(events);
      },
      (error) => {
        console.error('Error in events subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to events updates'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up events subscription:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Failed to set up subscription'));
    }
    // Return a no-op unsubscribe function
    return () => {};
  }
};


// =============================================
// REVIEW SERVICE
// =============================================

import { 
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config';
import type { ReviewItem } from '../../types';

const COLLECTION_NAME = 'reviews';

export const reviewService = {
  getAll: async (): Promise<ReviewItem[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReviewItem[];
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ReviewItem | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ReviewItem;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error fetching review ${id}:`, error);
      throw error;
    }
  },

  save: async (review: ReviewItem): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, review.id);
      await setDoc(docRef, review, { merge: true });
    } catch (error) {
      console.error(`❌ Error saving review ${review.id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn(`⚠️ Review ${id} not found`);
        return;
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`❌ Error deleting review ${id}:`, error);
      throw error;
    }
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    if (ids.length === 0) return;
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.delete(docRef);
      }
      await batch.commit();
    } catch (error) {
      console.error('❌ Error in bulk delete:', error);
      throw error;
    }
  },

  bulkWrite: async (items: ReviewItem[]): Promise<void> => {
    if (items.length === 0) return;
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const docRef = doc(db, COLLECTION_NAME, item.id);
        batch.set(docRef, item, { merge: true });
      }
      await batch.commit();
    } catch (error) {
      console.error('❌ Error in bulk write:', error);
      throw error;
    }
  },

  toggleHidden: async (id: string, hidden: boolean): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { hidden });
    } catch (error) {
      console.error(`❌ Error toggling hidden for ${id}:`, error);
      throw error;
    }
  },

  updateRating: async (id: string, rating: number): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { rating });
    } catch (error) {
      console.error(`❌ Error updating rating for ${id}:`, error);
      throw error;
    }
  },

  getVisibleReviews: async (): Promise<ReviewItem[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('hidden', '==', false));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReviewItem[];
    } catch (error) {
      console.error('❌ Error fetching visible reviews:', error);
      throw error;
    }
  },

  getHiddenReviews: async (): Promise<ReviewItem[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('hidden', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReviewItem[];
    } catch (error) {
      console.error('❌ Error fetching hidden reviews:', error);
      throw error;
    }
  },

  getReviewsByRating: async (rating: number): Promise<ReviewItem[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('rating', '==', rating));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReviewItem[];
    } catch (error) {
      console.error(`❌ Error fetching reviews by rating ${rating}:`, error);
      throw error;
    }
  },

  subscribe: (callback: (data: ReviewItem[]) => void): (() => void) => {
    const q = collection(db, COLLECTION_NAME);
    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ReviewItem[];
          callback(data);
        } catch (error) {
          console.error('❌ Error processing reviews snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in reviews subscription:', error);
      }
    );
  },

  subscribeToVisible: (callback: (data: ReviewItem[]) => void): (() => void) => {
    const q = query(collection(db, COLLECTION_NAME), where('hidden', '==', false));
    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ReviewItem[];
          callback(data);
        } catch (error) {
          console.error('❌ Error processing visible reviews snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in visible reviews subscription:', error);
      }
    );
  },

  count: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error counting reviews:', error);
      return 0;
    }
  },

  countVisible: async (): Promise<number> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('hidden', '==', false));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error counting visible reviews:', error);
      return 0;
    }
  }
};
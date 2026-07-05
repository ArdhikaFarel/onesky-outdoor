// =============================================
// TERM SERVICE
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
  orderBy,
  onSnapshot,
  writeBatch,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config';
import type { TermItem } from '../../types';

const COLLECTION_NAME = 'terms';

export const termService = {
  getAll: async (): Promise<TermItem[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TermItem[];
    } catch (error) {
      console.error('❌ Error fetching terms:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<TermItem | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TermItem;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error fetching term ${id}:`, error);
      throw error;
    }
  },

  save: async (term: TermItem): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, term.id);
      await setDoc(docRef, term, { merge: true });
    } catch (error) {
      console.error(`❌ Error saving term ${term.id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn(`⚠️ Term ${id} not found`);
        return;
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`❌ Error deleting term ${id}:`, error);
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

  bulkWrite: async (items: TermItem[]): Promise<void> => {
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

  reorder: async (terms: TermItem[]): Promise<void> => {
    for (const term of terms) {
      await termService.save(term);
    }
  },

  subscribe: (callback: (data: TermItem[]) => void): (() => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('index', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as TermItem[];
          callback(data);
        } catch (error) {
          console.error('❌ Error processing terms snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in terms subscription:', error);
      }
    );
  },

  count: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error counting terms:', error);
      return 0;
    }
  }
};
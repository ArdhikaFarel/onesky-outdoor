// =============================================
// DOCUMENTATION SERVICE
// =============================================

import { 
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config';
import type { DocumentationItem } from '../../types';

const COLLECTION_NAME = 'documentation';

export const documentationService = {
  getAll: async (): Promise<DocumentationItem[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocumentationItem[];
    } catch (error) {
      console.error('❌ Error fetching documentation:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<DocumentationItem | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DocumentationItem;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error fetching documentation ${id}:`, error);
      throw error;
    }
  },

  save: async (doc: DocumentationItem): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, doc.id);
      await setDoc(docRef, doc, { merge: true });
    } catch (error) {
      console.error(`❌ Error saving documentation ${doc.id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn(`⚠️ Documentation ${id} not found`);
        return;
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`❌ Error deleting documentation ${id}:`, error);
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

  bulkWrite: async (items: DocumentationItem[]): Promise<void> => {
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

  updateCaption: async (id: string, caption: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { caption });
    } catch (error) {
      console.error(`❌ Error updating caption for ${id}:`, error);
      throw error;
    }
  },

  subscribe: (callback: (data: DocumentationItem[]) => void): (() => void) => {
    const q = collection(db, COLLECTION_NAME);
    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as DocumentationItem[];
          callback(data);
        } catch (error) {
          console.error('❌ Error processing documentation snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in documentation subscription:', error);
      }
    );
  },

  count: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error counting documentation:', error);
      return 0;
    }
  }
};
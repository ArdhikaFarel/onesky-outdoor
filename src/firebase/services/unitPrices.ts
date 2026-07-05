// =============================================
// UNIT PRICE SERVICE
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
import type { UnitPriceItem } from '../../types';

const COLLECTION_NAME = 'unitPrices';

export const unitPriceService = {
  getAll: async (): Promise<UnitPriceItem[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UnitPriceItem[];
    } catch (error) {
      console.error('❌ Error fetching unit prices:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<UnitPriceItem | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UnitPriceItem;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error fetching unit price ${id}:`, error);
      throw error;
    }
  },

  save: async (item: UnitPriceItem): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item, { merge: true });
    } catch (error) {
      console.error(`❌ Error saving unit price ${item.id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn(`⚠️ Unit price ${id} not found`);
        return;
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`❌ Error deleting unit price ${id}:`, error);
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

  bulkWrite: async (items: UnitPriceItem[]): Promise<void> => {
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

  updatePrice: async (id: string, price: number): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { price });
    } catch (error) {
      console.error(`❌ Error updating price for ${id}:`, error);
      throw error;
    }
  },

  updateName: async (id: string, name: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { name });
    } catch (error) {
      console.error(`❌ Error updating name for ${id}:`, error);
      throw error;
    }
  },

  subscribe: (callback: (data: UnitPriceItem[]) => void): (() => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('index', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as UnitPriceItem[];
          callback(data);
        } catch (error) {
          console.error('❌ Error processing unit prices snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in unit prices subscription:', error);
      }
    );
  },

  count: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error counting unit prices:', error);
      return 0;
    }
  }
};
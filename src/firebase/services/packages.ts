// =============================================
// PACKAGE SERVICE
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
  orderBy,
  onSnapshot,
  writeBatch,
  CollectionReference,
  Query,
  QuerySnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config';
import type { RentalPackage, ItemStatus } from '../../types';

const COLLECTION_NAME = 'packages';

export const packageService = {
  getAll: async (): Promise<RentalPackage[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RentalPackage[];
    } catch (error) {
      console.error('❌ Error fetching packages:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<RentalPackage | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as RentalPackage;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error fetching package ${id}:`, error);
      throw error;
    }
  },

  save: async (pkg: RentalPackage): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, pkg.id);
      await setDoc(docRef, pkg, { merge: true });
    } catch (error) {
      console.error(`❌ Error saving package ${pkg.id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn(`⚠️ Package ${id} not found`);
        return;
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`❌ Error deleting package ${id}:`, error);
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

  bulkWrite: async (items: RentalPackage[]): Promise<void> => {
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

  updateStatus: async (id: string, status: ItemStatus): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error(`❌ Error updating status for ${id}:`, error);
      throw error;
    }
  },

  updateField: async (id: string, field: string, value: any): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { [field]: value });
    } catch (error) {
      console.error(`❌ Error updating field for ${id}:`, error);
      throw error;
    }
  },

  subscribe: (callback: (data: RentalPackage[]) => void): (() => void) => {
    const q = collection(db, COLLECTION_NAME);
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as RentalPackage[];
          callback(data);
        } catch (error) {
          console.error('❌ Error processing packages snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in packages subscription:', error);
      }
    );
  },

  subscribeToPackage: (id: string, callback: (data: RentalPackage | null) => void): (() => void) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    return onSnapshot(
      docRef,
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as RentalPackage);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('❌ Error processing package snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in package subscription:', error);
      }
    );
  },

  queryByStatus: async (status: ItemStatus): Promise<RentalPackage[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('status', '==', status));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RentalPackage[];
    } catch (error) {
      console.error(`❌ Error querying packages by status:`, error);
      throw error;
    }
  },

  count: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error counting packages:', error);
      return 0;
    }
  }
};
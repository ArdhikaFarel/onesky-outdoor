// =============================================
// DOCUMENTATION SERVICE - FIXED
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
  FirestoreError,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../config';
import type { DocumentationItem } from '../../types';

const COLLECTION_NAME = 'documentation';

export const documentationService = {
  // ---- GET ALL ----
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

  // ---- GET BY ID ----
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

  // ---- SAVE (CREATE/UPDATE) - FIXED ----
  save: async (data: DocumentationItem): Promise<void> => {
    try {
      if (!data || !data.id) {
        throw new Error('Invalid data: missing id');
      }
      
      console.log(`💾 Saving documentation ${data.id}...`);
      const docRef = doc(db, COLLECTION_NAME, data.id);
      
      // Pastikan data yang disimpan lengkap
      const docData = {
        id: data.id,
        caption: data.caption || 'Dokumentasi',
        imageUrl: data.imageUrl || '',
        date: data.date || new Date().toISOString().split('T')[0]
      };
      
      await setDoc(docRef, docData, { merge: true });
      console.log(`✅ Documentation ${data.id} saved successfully`);
    } catch (error) {
      console.error(`❌ Error saving documentation:`, error);
      throw error;
    }
  },

  // ---- DELETE ----
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) {
        throw new Error('Invalid id');
      }
      
      console.log(`🗑️ Deleting documentation ${id}...`);
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.warn(`⚠️ Documentation ${id} not found`);
        return;
      }
      
      await deleteDoc(docRef);
      console.log(`✅ Documentation ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting documentation ${id}:`, error);
      throw error;
    }
  },

  // ---- BULK DELETE ----
  bulkDelete: async (ids: string[]): Promise<void> => {
    if (!ids || ids.length === 0) return;
    try {
      console.log(`🗑️ Bulk deleting ${ids.length} documentation...`);
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.delete(docRef);
      }
      await batch.commit();
      console.log(`✅ ${ids.length} documentation deleted`);
    } catch (error) {
      console.error('❌ Error in bulk delete:', error);
      throw error;
    }
  },

  // ---- BULK WRITE ----
  bulkWrite: async (items: DocumentationItem[]): Promise<void> => {
    if (!items || items.length === 0) return;
    try {
      console.log(`📝 Bulk writing ${items.length} documentation...`);
      const batch = writeBatch(db);
      for (const item of items) {
        if (!item.id) continue;
        const docRef = doc(db, COLLECTION_NAME, item.id);
        batch.set(docRef, item, { merge: true });
      }
      await batch.commit();
      console.log(`✅ ${items.length} documentation written`);
    } catch (error) {
      console.error('❌ Error in bulk write:', error);
      throw error;
    }
  },

  // ---- UPDATE CAPTION ----
  updateCaption: async (id: string, caption: string): Promise<void> => {
    try {
      if (!id) throw new Error('Invalid id');
      
      console.log(`📝 Updating caption for ${id}...`);
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { caption });
      console.log(`✅ Caption updated for ${id}`);
    } catch (error) {
      console.error(`❌ Error updating caption for ${id}:`, error);
      throw error;
    }
  },

  // ---- REAL-TIME SUBSCRIPTION - FIXED ----
  subscribe: (callback: (data: DocumentationItem[]) => void): (() => void) => {
    if (typeof callback !== 'function') {
      console.error('❌ Invalid callback: not a function');
      return () => {};
    }

    console.log('👂 Listening to documentation collection...');
    const q = collection(db, COLLECTION_NAME);
    
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as DocumentationItem[];
          console.log(`📡 Documentation updated: ${data.length} items`);
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

  // ---- COUNT ----
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

export default documentationService;
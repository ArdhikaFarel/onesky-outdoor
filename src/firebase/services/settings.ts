// =============================================
// SETTINGS SERVICE
// =============================================

import { 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config';
import type { SystemSettings } from '../../types';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'main';

export const settingsService = {
  get: async (): Promise<SystemSettings | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SystemSettings;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
      throw error;
    }
  },

  save: async (settings: SystemSettings): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, { ...settings, id: DOC_ID }, { merge: true });
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      throw error;
    }
  },

  update: async (data: Partial<SystemSettings>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('❌ Error updating settings:', error);
      throw error;
    }
  },

  updatePrimaryColor: async (color: string): Promise<void> => {
    await settingsService.update({ primaryColor: color });
  },

  updateSecondaryColor: async (color: string): Promise<void> => {
    await settingsService.update({ secondaryColor: color });
  },

  updateContactNumber: async (number: string): Promise<void> => {
    await settingsService.update({ contactNumber: number });
  },

  updateWhatsappNumber: async (number: string): Promise<void> => {
    await settingsService.update({ whatsappNumber: number });
  },

  updateFooterText: async (text: string): Promise<void> => {
    await settingsService.update({ footerText: text });
  },

  subscribe: (callback: (data: SystemSettings) => void): (() => void) => {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as SystemSettings);
          }
        } catch (error) {
          console.error('❌ Error processing settings snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in settings subscription:', error);
      }
    );
  }
};
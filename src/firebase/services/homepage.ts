// =============================================
// HOMEPAGE SERVICE
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
import type { HomepageConfig } from '../../types';

const COLLECTION_NAME = 'homepage';
const DOC_ID = 'main';

export const homepageService = {
  get: async (): Promise<HomepageConfig | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HomepageConfig;
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching homepage config:', error);
      throw error;
    }
  },

  save: async (config: HomepageConfig): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, { ...config, id: DOC_ID }, { merge: true });
    } catch (error) {
      console.error('❌ Error saving homepage config:', error);
      throw error;
    }
  },

  update: async (data: Partial<HomepageConfig>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('❌ Error updating homepage config:', error);
      throw error;
    }
  },

  updateHero: async (heroTitle: string, heroSubtitle: string, heroBgUrl: string): Promise<void> => {
    await homepageService.update({ heroTitle, heroSubtitle, heroBgUrl });
  },

  updateHeroTitle: async (title: string): Promise<void> => {
    await homepageService.update({ heroTitle: title });
  },

  updateHeroSubtitle: async (subtitle: string): Promise<void> => {
    await homepageService.update({ heroSubtitle: subtitle });
  },

  updateHeroBg: async (bgUrl: string): Promise<void> => {
    await homepageService.update({ heroBgUrl: bgUrl });
  },

  updateStatusColors: async (readyColor: string, disewaColor: string, tidakTersediaColor: string): Promise<void> => {
    await homepageService.update({
      statusColors: { readyColor, disewaColor, tidakTersediaColor }
    });
  },

  updateFeatures: async (features: HomepageConfig['features']): Promise<void> => {
    await homepageService.update({ features });
  },

  updateFeature: async (featureId: string, updates: { title?: string; description?: string }): Promise<void> => {
    try {
      const config = await homepageService.get();
      if (config) {
        const updatedFeatures = config.features.map(f => 
          f.id === featureId ? { ...f, ...updates } : f
        );
        await homepageService.update({ features: updatedFeatures });
      }
    } catch (error) {
      console.error('❌ Error updating feature:', error);
      throw error;
    }
  },

  subscribe: (callback: (data: HomepageConfig) => void): (() => void) => {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as HomepageConfig);
          }
        } catch (error) {
          console.error('❌ Error processing homepage snapshot:', error);
        }
      },
      (error: FirestoreError) => {
        console.error('❌ Error in homepage subscription:', error);
      }
    );
  }
};
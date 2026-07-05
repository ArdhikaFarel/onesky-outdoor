// =============================================
// FIREBASE CONFIG - SINGLE FILE
// =============================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdFZ6uN0TztYVbF0Bw1XhZlX-FHplYPIs",
  authDomain: "oneskyoutdoor.firebaseapp.com",
  projectId: "oneskyoutdoor",
  storageBucket: "oneskyoutdoor.firebasestorage.app",
  messagingSenderId: "533255925908",
  appId: "1:533255925908:web:dd280a953c8ab33cd38481"
};

// Inisialisasi Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

// =============================================
// FIRESTORE SERVICE - LANGSUNG DI SINI
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

// =============================================
// TYPES - DARI FILE TYPES
// =============================================
import type { 
  RentalPackage, 
  UnitPriceItem, 
  TermItem, 
  ReviewItem, 
  DocumentationItem,
  SystemSettings,
  HomepageConfig,
  ItemStatus,
  CartItem
} from '../types';

// =============================================
// COLLECTION REFERENCES
// =============================================

const COLLECTIONS = {
  PACKAGES: 'packages',
  UNIT_PRICES: 'unitPrices',
  TERMS: 'terms',
  REVIEWS: 'reviews',
  DOCUMENTATION: 'documentation',
  SETTINGS: 'settings',
  HOMEPAGE: 'homepage',
  CART: 'cart'
} as const;

// =============================================
// GENERIC CRUD OPERATIONS
// =============================================

const getAllDocs = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}:`, error);
    throw error;
  }
};

const getDocById = async <T>(collectionName: string, id: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching document ${id}:`, error);
    throw error;
  }
};

const saveDoc = async <T extends { id: string }>(collectionName: string, data: T): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, data.id);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(`❌ Error saving document ${data.id}:`, error);
    throw error;
  }
};

const updateDocFields = async (collectionName: string, id: string, data: Record<string, any>): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`❌ Error updating document ${id}:`, error);
    throw error;
  }
};

const deleteDocById = async (collectionName: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.warn(`⚠️ Document ${id} not found in ${collectionName}, skipping delete`);
      return;
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`❌ Error deleting document ${id}:`, error);
    throw error;
  }
};

const bulkDeleteDocs = async (collectionName: string, ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  try {
    const batch = writeBatch(db);
    for (const id of ids) {
      const docRef = doc(db, collectionName, id);
      batch.delete(docRef);
    }
    await batch.commit();
  } catch (error) {
    console.error('❌ Error in bulk delete:', error);
    throw error;
  }
};

const bulkWriteDocs = async <T extends { id: string }>(collectionName: string, items: T[]): Promise<void> => {
  if (items.length === 0) return;
  try {
    const batch = writeBatch(db);
    for (const item of items) {
      const docRef = doc(db, collectionName, item.id);
      batch.set(docRef, item, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    console.error('❌ Error in bulk write:', error);
    throw error;
  }
};

const queryByField = async <T>(collectionName: string, field: string, value: any): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`❌ Error querying ${collectionName}:`, error);
    throw error;
  }
};

const subscribeToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void,
  orderByField?: string,
  orderDirection?: 'asc' | 'desc'
): (() => void) => {
  let q: CollectionReference | Query = collection(db, collectionName);
  
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection || 'asc'));
  }

  const unsubscribe = onSnapshot(
    q as any,
    (snapshot: QuerySnapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        callback(data);
      } catch (error) {
        console.error(`❌ Error processing ${collectionName} snapshot:`, error);
      }
    },
    (error: FirestoreError) => {
      console.error(`❌ Error in ${collectionName} subscription:`, error);
    }
  );

  return unsubscribe;
};

const subscribeToDocument = <T>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null) => void
): (() => void) => {
  const docRef = doc(db, collectionName, documentId);
  
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      try {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as T;
          callback(data);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error(`❌ Error processing document snapshot:`, error);
      }
    },
    (error: FirestoreError) => {
      console.error(`❌ Error in document subscription:`, error);
    }
  );

  return unsubscribe;
};

// =============================================
// PACKAGE SERVICE
// =============================================

export const packageService = {
  getAll: () => getAllDocs<RentalPackage>(COLLECTIONS.PACKAGES),
  getById: (id: string) => getDocById<RentalPackage>(COLLECTIONS.PACKAGES, id),
  save: (pkg: RentalPackage) => saveDoc(COLLECTIONS.PACKAGES, pkg),
  delete: (id: string) => deleteDocById(COLLECTIONS.PACKAGES, id),
  bulkDelete: (ids: string[]) => bulkDeleteDocs(COLLECTIONS.PACKAGES, ids),
  bulkWrite: (items: RentalPackage[]) => bulkWriteDocs(COLLECTIONS.PACKAGES, items),
  updateStatus: (id: string, status: ItemStatus) => 
    updateDocFields(COLLECTIONS.PACKAGES, id, { status }),
  updateField: (id: string, field: string, value: any) =>
    updateDocFields(COLLECTIONS.PACKAGES, id, { [field]: value }),
  subscribe: (callback: (data: RentalPackage[]) => void) => 
    subscribeToCollection<RentalPackage>(COLLECTIONS.PACKAGES, callback),
  subscribeToPackage: (id: string, callback: (data: RentalPackage | null) => void) =>
    subscribeToDocument<RentalPackage>(COLLECTIONS.PACKAGES, id, callback),
  queryByStatus: (status: ItemStatus) => 
    queryByField<RentalPackage>(COLLECTIONS.PACKAGES, 'status', status),
  count: () => getAllDocs<RentalPackage>(COLLECTIONS.PACKAGES).then(data => data.length)
};

// =============================================
// UNIT PRICE SERVICE
// =============================================

export const unitPriceService = {
  getAll: () => getAllDocs<UnitPriceItem>(COLLECTIONS.UNIT_PRICES),
  getById: (id: string) => getDocById<UnitPriceItem>(COLLECTIONS.UNIT_PRICES, id),
  save: (item: UnitPriceItem) => saveDoc(COLLECTIONS.UNIT_PRICES, item),
  delete: (id: string) => deleteDocById(COLLECTIONS.UNIT_PRICES, id),
  bulkDelete: (ids: string[]) => bulkDeleteDocs(COLLECTIONS.UNIT_PRICES, ids),
  bulkWrite: (items: UnitPriceItem[]) => bulkWriteDocs(COLLECTIONS.UNIT_PRICES, items),
  updatePrice: (id: string, price: number) =>
    updateDocFields(COLLECTIONS.UNIT_PRICES, id, { price }),
  updateName: (id: string, name: string) =>
    updateDocFields(COLLECTIONS.UNIT_PRICES, id, { name }),
  subscribe: (callback: (data: UnitPriceItem[]) => void) => 
    subscribeToCollection<UnitPriceItem>(COLLECTIONS.UNIT_PRICES, callback, 'index'),
  count: () => getAllDocs<UnitPriceItem>(COLLECTIONS.UNIT_PRICES).then(data => data.length)
};

// =============================================
// TERM SERVICE
// =============================================

export const termService = {
  getAll: () => getAllDocs<TermItem>(COLLECTIONS.TERMS),
  getById: (id: string) => getDocById<TermItem>(COLLECTIONS.TERMS, id),
  save: (term: TermItem) => saveDoc(COLLECTIONS.TERMS, term),
  delete: (id: string) => deleteDocById(COLLECTIONS.TERMS, id),
  bulkDelete: (ids: string[]) => bulkDeleteDocs(COLLECTIONS.TERMS, ids),
  bulkWrite: (items: TermItem[]) => bulkWriteDocs(COLLECTIONS.TERMS, items),
  reorder: async (terms: TermItem[]) => {
    for (const term of terms) {
      await saveDoc(COLLECTIONS.TERMS, term);
    }
  },
  subscribe: (callback: (data: TermItem[]) => void) => 
    subscribeToCollection<TermItem>(COLLECTIONS.TERMS, callback, 'index'),
  count: () => getAllDocs<TermItem>(COLLECTIONS.TERMS).then(data => data.length)
};

// =============================================
// REVIEW SERVICE
// =============================================

export const reviewService = {
  getAll: () => getAllDocs<ReviewItem>(COLLECTIONS.REVIEWS),
  getById: (id: string) => getDocById<ReviewItem>(COLLECTIONS.REVIEWS, id),
  save: (review: ReviewItem) => saveDoc(COLLECTIONS.REVIEWS, review),
  delete: (id: string) => deleteDocById(COLLECTIONS.REVIEWS, id),
  bulkDelete: (ids: string[]) => bulkDeleteDocs(COLLECTIONS.REVIEWS, ids),
  bulkWrite: (items: ReviewItem[]) => bulkWriteDocs(COLLECTIONS.REVIEWS, items),
  toggleHidden: (id: string, hidden: boolean) =>
    updateDocFields(COLLECTIONS.REVIEWS, id, { hidden }),
  updateRating: (id: string, rating: number) =>
    updateDocFields(COLLECTIONS.REVIEWS, id, { rating }),
  getVisibleReviews: () => 
    queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', false),
  getHiddenReviews: () => 
    queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', true),
  getReviewsByRating: (rating: number) =>
    queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'rating', rating),
  subscribe: (callback: (data: ReviewItem[]) => void) => 
    subscribeToCollection<ReviewItem>(COLLECTIONS.REVIEWS, callback),
  subscribeToVisible: (callback: (data: ReviewItem[]) => void) => {
    return subscribeToCollection<ReviewItem>(
      COLLECTIONS.REVIEWS,
      (data) => callback(data.filter(r => !r.hidden))
    );
  },
  count: () => getAllDocs<ReviewItem>(COLLECTIONS.REVIEWS).then(data => data.length),
  countVisible: () => 
    queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', false)
      .then(data => data.length)
};

// =============================================
// DOCUMENTATION SERVICE
// =============================================

export const documentationService = {
  getAll: () => getAllDocs<DocumentationItem>(COLLECTIONS.DOCUMENTATION),
  getById: (id: string) => getDocById<DocumentationItem>(COLLECTIONS.DOCUMENTATION, id),
  save: (doc: DocumentationItem) => saveDoc(COLLECTIONS.DOCUMENTATION, doc),
  delete: (id: string) => deleteDocById(COLLECTIONS.DOCUMENTATION, id),
  bulkDelete: (ids: string[]) => bulkDeleteDocs(COLLECTIONS.DOCUMENTATION, ids),
  bulkWrite: (items: DocumentationItem[]) => bulkWriteDocs(COLLECTIONS.DOCUMENTATION, items),
  updateCaption: (id: string, caption: string) =>
    updateDocFields(COLLECTIONS.DOCUMENTATION, id, { caption }),
  subscribe: (callback: (data: DocumentationItem[]) => void) => 
    subscribeToCollection<DocumentationItem>(COLLECTIONS.DOCUMENTATION, callback),
  count: () => getAllDocs<DocumentationItem>(COLLECTIONS.DOCUMENTATION).then(data => data.length)
};

// =============================================
// SETTINGS SERVICE
// =============================================

export const settingsService = {
  get: () => getDocById<SystemSettings>(COLLECTIONS.SETTINGS, 'main'),
  save: (settings: SystemSettings) => saveDoc(COLLECTIONS.SETTINGS, { ...settings, id: 'main' }),
  update: (data: Partial<SystemSettings>) =>
    updateDocFields(COLLECTIONS.SETTINGS, 'main', data),
  updatePrimaryColor: (color: string) =>
    updateDocFields(COLLECTIONS.SETTINGS, 'main', { primaryColor: color }),
  updateSecondaryColor: (color: string) =>
    updateDocFields(COLLECTIONS.SETTINGS, 'main', { secondaryColor: color }),
  updateContactNumber: (number: string) =>
    updateDocFields(COLLECTIONS.SETTINGS, 'main', { contactNumber: number }),
  updateWhatsappNumber: (number: string) =>
    updateDocFields(COLLECTIONS.SETTINGS, 'main', { whatsappNumber: number }),
  updateFooterText: (text: string) =>
    updateDocFields(COLLECTIONS.SETTINGS, 'main', { footerText: text }),
  subscribe: (callback: (data: SystemSettings) => void) => 
    subscribeToDocument<SystemSettings>(COLLECTIONS.SETTINGS, 'main', (data) => {
      if (data) callback(data);
    })
};

// =============================================
// HOMEPAGE SERVICE
// =============================================

export const homepageService = {
  get: () => getDocById<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main'),
  save: (config: HomepageConfig) => saveDoc(COLLECTIONS.HOMEPAGE, { ...config, id: 'main' }),
  update: (data: Partial<HomepageConfig>) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', data),
  updateHero: (heroTitle: string, heroSubtitle: string, heroBgUrl: string) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', { heroTitle, heroSubtitle, heroBgUrl }),
  updateHeroTitle: (title: string) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', { heroTitle: title }),
  updateHeroSubtitle: (subtitle: string) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', { heroSubtitle: subtitle }),
  updateHeroBg: (bgUrl: string) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', { heroBgUrl: bgUrl }),
  updateStatusColors: (readyColor: string, disewaColor: string, tidakTersediaColor: string) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', {
      statusColors: { readyColor, disewaColor, tidakTersediaColor }
    }),
  updateFeatures: (features: HomepageConfig['features']) =>
    updateDocFields(COLLECTIONS.HOMEPAGE, 'main', { features }),
  updateFeature: (featureId: string, updates: { title?: string; description?: string }) =>
    getDocById<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main')
      .then(config => {
        if (config) {
          const updatedFeatures = config.features.map(f => 
            f.id === featureId ? { ...f, ...updates } : f
          );
          return updateDocFields(COLLECTIONS.HOMEPAGE, 'main', { features: updatedFeatures });
        }
      }),
  subscribe: (callback: (data: HomepageConfig) => void) => 
    subscribeToDocument<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main', (data) => {
      if (data) callback(data);
    })
};

// =============================================
// COMPLETE DATA EXPORT (For backup/migration)
// =============================================

export const exportAllData = async () => {
  try {
    const [packages, unitPrices, terms, reviews, documentation, settings, homepage] = await Promise.all([
      getAllDocs<RentalPackage>(COLLECTIONS.PACKAGES),
      getAllDocs<UnitPriceItem>(COLLECTIONS.UNIT_PRICES),
      getAllDocs<TermItem>(COLLECTIONS.TERMS),
      getAllDocs<ReviewItem>(COLLECTIONS.REVIEWS),
      getAllDocs<DocumentationItem>(COLLECTIONS.DOCUMENTATION),
      getDocById<SystemSettings>(COLLECTIONS.SETTINGS, 'main'),
      getDocById<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main')
    ]);
    
    return {
      packages,
      unitPrices,
      terms,
      reviews,
      documentation,
      settings,
      homepage,
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
};

export const importAllData = async (data: any) => {
  try {
    if (data.packages && data.packages.length > 0) {
      await bulkWriteDocs(COLLECTIONS.PACKAGES, data.packages);
    }
    if (data.unitPrices && data.unitPrices.length > 0) {
      await bulkWriteDocs(COLLECTIONS.UNIT_PRICES, data.unitPrices);
    }
    if (data.terms && data.terms.length > 0) {
      await bulkWriteDocs(COLLECTIONS.TERMS, data.terms);
    }
    if (data.reviews && data.reviews.length > 0) {
      await bulkWriteDocs(COLLECTIONS.REVIEWS, data.reviews);
    }
    if (data.documentation && data.documentation.length > 0) {
      await bulkWriteDocs(COLLECTIONS.DOCUMENTATION, data.documentation);
    }
    if (data.settings) {
      await saveDoc(COLLECTIONS.SETTINGS, { ...data.settings, id: 'main' });
    }
    if (data.homepage) {
      await saveDoc(COLLECTIONS.HOMEPAGE, { ...data.homepage, id: 'main' });
    }
    console.log('✅ Data imported successfully');
    return true;
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
};

// =============================================
// DATABASE RESET (USE WITH CAUTION)
// =============================================

export const resetDatabase = async () => {
  try {
    console.warn('⚠️ Resetting entire database...');
    
    const [packages, unitPrices, terms, reviews, docs] = await Promise.all([
      getAllDocs<RentalPackage>(COLLECTIONS.PACKAGES),
      getAllDocs<UnitPriceItem>(COLLECTIONS.UNIT_PRICES),
      getAllDocs<TermItem>(COLLECTIONS.TERMS),
      getAllDocs<ReviewItem>(COLLECTIONS.REVIEWS),
      getAllDocs<DocumentationItem>(COLLECTIONS.DOCUMENTATION)
    ]);
    
    await Promise.all([
      bulkDeleteDocs(COLLECTIONS.PACKAGES, packages.map(p => p.id)),
      bulkDeleteDocs(COLLECTIONS.UNIT_PRICES, unitPrices.map(p => p.id)),
      bulkDeleteDocs(COLLECTIONS.TERMS, terms.map(p => p.id)),
      bulkDeleteDocs(COLLECTIONS.REVIEWS, reviews.map(p => p.id)),
      bulkDeleteDocs(COLLECTIONS.DOCUMENTATION, docs.map(p => p.id)),
      deleteDocById(COLLECTIONS.SETTINGS, 'main'),
      deleteDocById(COLLECTIONS.HOMEPAGE, 'main')
    ]);
    
    console.log('✅ Database reset successfully');
    return true;
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

// =============================================
// HEALTH CHECK
// =============================================

export const checkFirestoreHealth = async (): Promise<boolean> => {
  try {
    const testCollection = collection(db, '_health_check');
    const testDoc = doc(testCollection, 'test');
    await setDoc(testDoc, { timestamp: new Date().toISOString() }, { merge: true });
    await deleteDoc(testDoc);
    console.log('✅ Firestore health check passed');
    return true;
  } catch (error) {
    console.error('❌ Firestore health check failed:', error);
    return false;
  }
};
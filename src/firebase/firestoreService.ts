// =============================================
// FIRESTORE SERVICE - FINAL VERSION
// TANPA CIRCULAR DEPENDENCY
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
  CollectionReference,
  Query,
  QuerySnapshot,
  writeBatch,
  FirestoreError
} from 'firebase/firestore';
import { db } from './config';

// =============================================
// TYPES - IMPORT DARI FILE TYPES
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

export const COLLECTIONS = {
  PACKAGES: 'packages',
  UNIT_PRICES: 'unitPrices',
  TERMS: 'terms',
  REVIEWS: 'reviews',
  DOCUMENTATION: 'documentation',
  SETTINGS: 'settings',
  HOMEPAGE: 'homepage',
  CART: 'cart'
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// =============================================
// GENERIC CRUD OPERATIONS
// =============================================

export const firestoreService = {
  // ---- GET ALL DOCUMENTS ----
  async getAll<T>(collectionName: string): Promise<T[]> {
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
  },

  // ---- GET SINGLE DOCUMENT ----
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
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
  },

  // ---- CREATE/UPDATE DOCUMENT ----
  async set<T extends { id: string }>(
    collectionName: string, 
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, data.id);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`❌ Error saving document ${data.id}:`, error);
      throw error;
    }
  },

  // ---- UPDATE SPECIFIC FIELDS ----
  async update(collectionName: string, id: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`❌ Error updating document ${id}:`, error);
      throw error;
    }
  },

  // ---- DELETE DOCUMENT ----
  async delete(collectionName: string, id: string): Promise<void> {
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
  },

  // ---- BULK DELETE ----
  async bulkDelete(collectionName: string, ids: string[]): Promise<void> {
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
  },

  // ---- BULK WRITE ----
  async bulkWrite<T extends { id: string }>(
    collectionName: string,
    items: T[]
  ): Promise<void> {
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
  },

  // ---- QUERY WITH CONDITIONS ----
  async queryByField<T>(
    collectionName: string,
    field: string,
    value: any
  ): Promise<T[]> {
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
  },

  // ---- QUERY WITH MULTIPLE CONDITIONS ----
  async queryByFields<T>(
    collectionName: string,
    conditions: { field: string; value: any }[]
  ): Promise<T[]> {
    try {
      let q = collection(db, collectionName);
      for (const cond of conditions) {
        q = query(q, where(cond.field, '==', cond.value));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`❌ Error querying ${collectionName}:`, error);
      throw error;
    }
  },

  // ---- REAL-TIME SUBSCRIPTION ----
  subscribeToCollection<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc'
  ): () => void {
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
  },

  // ---- SUBSCRIBE TO SINGLE DOCUMENT ----
  subscribeToDocument<T>(
    collectionName: string,
    documentId: string,
    callback: (data: T | null) => void
  ): () => void {
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
  },

  // ---- CHECK IF DOCUMENT EXISTS ----
  async exists(collectionName: string, id: string): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('❌ Error checking document existence:', error);
      return false;
    }
  },

  // ---- COUNT DOCUMENTS ----
  async count(collectionName: string): Promise<number> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.size;
    } catch (error) {
      console.error(`❌ Error counting ${collectionName}:`, error);
      return 0;
    }
  },

  // ---- GET DOCUMENTS WITH PAGINATION ----
  async getPaginated<T>(
    collectionName: string,
    limitCount: number,
    startAfter?: any
  ): Promise<{ items: T[]; lastDoc: any }> {
    try {
      let q = query(collection(db, collectionName), limit(limitCount));
      if (startAfter) {
        q = query(q, startAfter(startAfter));
      }
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      return { items, lastDoc };
    } catch (error) {
      console.error(`❌ Error getting paginated data:`, error);
      throw error;
    }
  },

  // ---- TRANSACTION OPERATION ----
  async runTransaction<T>(
    transactionFn: (transaction: any) => Promise<T>
  ): Promise<T> {
    try {
      const result = await transactionFn(db);
      return result;
    } catch (error) {
      console.error('❌ Error in transaction:', error);
      throw error;
    }
  }
};

// =============================================
// TYPE-SPECIFIC HELPERS - PACKAGES
// =============================================

export const packageService = {
  getAll: () => firestoreService.getAll<RentalPackage>(COLLECTIONS.PACKAGES),
  
  getById: (id: string) => firestoreService.getById<RentalPackage>(COLLECTIONS.PACKAGES, id),
  
  save: (pkg: RentalPackage) => firestoreService.set(COLLECTIONS.PACKAGES, pkg),
  
  delete: (id: string) => firestoreService.delete(COLLECTIONS.PACKAGES, id),
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.PACKAGES, ids),
  
  updateStatus: (id: string, status: ItemStatus) => 
    firestoreService.update(COLLECTIONS.PACKAGES, id, { status }),
  
  updateField: (id: string, field: string, value: any) =>
    firestoreService.update(COLLECTIONS.PACKAGES, id, { [field]: value }),
  
  subscribe: (callback: (data: RentalPackage[]) => void) => 
    firestoreService.subscribeToCollection<RentalPackage>(COLLECTIONS.PACKAGES, callback),
  
  subscribeToPackage: (id: string, callback: (data: RentalPackage | null) => void) =>
    firestoreService.subscribeToDocument<RentalPackage>(COLLECTIONS.PACKAGES, id, callback),
  
  queryByStatus: (status: ItemStatus) => 
    firestoreService.queryByField<RentalPackage>(COLLECTIONS.PACKAGES, 'status', status),
  
  queryByStatusAndPrice: (status: ItemStatus, maxPrice: number) =>
    firestoreService.queryByFields<RentalPackage>(COLLECTIONS.PACKAGES, [
      { field: 'status', value: status },
      { field: 'price', value: maxPrice }
    ]),
  
  bulkWrite: (packages: RentalPackage[]) => 
    firestoreService.bulkWrite(COLLECTIONS.PACKAGES, packages),
  
  count: () => firestoreService.count(COLLECTIONS.PACKAGES),
  
  getPaginated: (limitCount: number, startAfter?: any) =>
    firestoreService.getPaginated<RentalPackage>(COLLECTIONS.PACKAGES, limitCount, startAfter  iuwcinniniwninfoinio4rinnnjnjnjnjnjnjnjnjn)
};

// =============================================
// TYPE-SPECIFIC HELPERS - UNIT PRICES
// =============================================

export const unitPriceService = {
  getAll: () => firestoreService.getAll<UnitPriceItem>(COLLECTIONS.UNIT_PRICES),
  
  getById: (id: string) => firestoreService.getById<UnitPriceItem>(COLLECTIONS.UNIT_PRICES, id),
  
  save: (item: UnitPriceItem) => firestoreService.set(COLLECTIONS.UNIT_PRICES, item),
  
  delete: (id: string) => firestoreService.delete(COLLECTIONS.UNIT_PRICES, id),
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.UNIT_PRICES, ids),
  
  updatePrice: (id: string, price: number) =>
    firestoreService.update(COLLECTIONS.UNIT_PRICES, id, { price }),
  
  updateName: (id: string, name: string) =>
    firestoreService.update(COLLECTIONS.UNIT_PRICES, id, { name }),
  
  subscribe: (callback: (data: UnitPriceItem[]) => void) => 
    firestoreService.subscribeToCollection<UnitPriceItem>(
      COLLECTIONS.UNIT_PRICES, 
      callback, 
      'index'
    ),
  
  bulkWrite: (items: UnitPriceItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.UNIT_PRICES, items),
  
  count: () => firestoreService.count(COLLECTIONS.UNIT_PRICES),
  
  getPaginated: (limitCount: number, startAfter?: any) =>
    firestoreService.getPaginated<UnitPriceItem>(COLLECTIONS.UNIT_PRICES, limitCount, startAfter)
};

// =============================================
// TYPE-SPECIFIC HELPERS - TERMS
// =============================================

export const termService = {
  getAll: () => firestoreService.getAll<TermItem>(COLLECTIONS.TERMS),
  
  getById: (id: string) => firestoreService.getById<TermItem>(COLLECTIONS.TERMS, id),
  
  save: (term: TermItem) => firestoreService.set(COLLECTIONS.TERMS, term),
  
  delete: (id: string) => firestoreService.delete(COLLECTIONS.TERMS, id),
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.TERMS, ids),
  
  reorder: async (terms: TermItem[]) => {
    for (const term of terms) {
      await termService.save(term);
    }
  },
  
  subscribe: (callback: (data: TermItem[]) => void) => 
    firestoreService.subscribeToCollection<TermItem>(
      COLLECTIONS.TERMS, 
      callback, 
      'index'
    ),
  
  bulkWrite: (items: TermItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.TERMS, items),
  
  count: () => firestoreService.count(COLLECTIONS.TERMS)
};

// =============================================
// TYPE-SPECIFIC HELPERS - REVIEWS
// =============================================

export const reviewService = {
  getAll: () => firestoreService.getAll<ReviewItem>(COLLECTIONS.REVIEWS),
  
  getById: (id: string) => firestoreService.getById<ReviewItem>(COLLECTIONS.REVIEWS, id),
  
  save: (review: ReviewItem) => firestoreService.set(COLLECTIONS.REVIEWS, review),
  
  delete: (id: string) => firestoreService.delete(COLLECTIONS.REVIEWS, id),
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.REVIEWS, ids),
  
  toggleHidden: (id: string, hidden: boolean) => 
    firestoreService.update(COLLECTIONS.REVIEWS, id, { hidden }),
  
  updateRating: (id: string, rating: number) =>
    firestoreService.update(COLLECTIONS.REVIEWS, id, { rating }),
  
  getVisibleReviews: () => 
    firestoreService.queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', false),
  
  getHiddenReviews: () => 
    firestoreService.queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', true),
  
  getReviewsByRating: (rating: number) =>
    firestoreService.queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'rating', rating),
  
  subscribe: (callback: (data: ReviewItem[]) => void) => 
    firestoreService.subscribeToCollection<ReviewItem>(COLLECTIONS.REVIEWS, callback),
  
  subscribeToVisible: (callback: (data: ReviewItem[]) => void) => {
    return firestoreService.subscribeToCollection<ReviewItem>(
      COLLECTIONS.REVIEWS,
      (data) => callback(data.filter(r => !r.hidden))
    );
  },
  
  bulkWrite: (items: ReviewItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.REVIEWS, items),
  
  count: () => firestoreService.count(COLLECTIONS.REVIEWS),
  
  countVisible: () => 
    firestoreService.queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', false)
      .then(data => data.length)
};

// =============================================
// TYPE-SPECIFIC HELPERS - DOCUMENTATION
// =============================================

export const documentationService = {
  getAll: () => firestoreService.getAll<DocumentationItem>(COLLECTIONS.DOCUMENTATION),
  
  getById: (id: string) => firestoreService.getById<DocumentationItem>(COLLECTIONS.DOCUMENTATION, id),
  
  save: (doc: DocumentationItem) => firestoreService.set(COLLECTIONS.DOCUMENTATION, doc),
  
  delete: (id: string) => firestoreService.delete(COLLECTIONS.DOCUMENTATION, id),
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.DOCUMENTATION, ids),
  
  updateCaption: (id: string, caption: string) =>
    firestoreService.update(COLLECTIONS.DOCUMENTATION, id, { caption }),
  
  getByDateRange: (startDate: string, endDate: string) =>
    firestoreService.queryByFields<DocumentationItem>(COLLECTIONS.DOCUMENTATION, [
      { field: 'date', value: startDate },
      { field: 'date', value: endDate }
    ]),
  
  subscribe: (callback: (data: DocumentationItem[]) => void) => 
    firestoreService.subscribeToCollection<DocumentationItem>(COLLECTIONS.DOCUMENTATION, callback),
  
  bulkWrite: (items: DocumentationItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.DOCUMENTATION, items),
  
  count: () => firestoreService.count(COLLECTIONS.DOCUMENTATION)
};

// =============================================
// TYPE-SPECIFIC HELPERS - SETTINGS
// =============================================

export const settingsService = {
  get: () => firestoreService.getById<SystemSettings>(COLLECTIONS.SETTINGS, 'main'),
  
  save: (settings: SystemSettings) => 
    firestoreService.set(COLLECTIONS.SETTINGS, { ...settings, id: 'main' }),
  
  update: (data: Partial<SystemSettings>) =>
    firestoreService.update(COLLECTIONS.SETTINGS, 'main', data),
  
  updatePrimaryColor: (color: string) =>
    firestoreService.update(COLLECTIONS.SETTINGS, 'main', { primaryColor: color }),
  
  updateSecondaryColor: (color: string) =>
    firestoreService.update(COLLECTIONS.SETTINGS, 'main', { secondaryColor: color }),
  
  updateContactNumber: (number: string) =>
    firestoreService.update(COLLECTIONS.SETTINGS, 'main', { contactNumber: number }),
  
  updateWhatsappNumber: (number: string) =>
    firestoreService.update(COLLECTIONS.SETTINGS, 'main', { whatsappNumber: number }),
  
  updateFooterText: (text: string) =>
    firestoreService.update(COLLECTIONS.SETTINGS, 'main', { footerText: text }),
  
  subscribe: (callback: (data: SystemSettings) => void) => {
    return firestoreService.subscribeToDocument<SystemSettings>(
      COLLECTIONS.SETTINGS,
      'main',
      (data) => {
        if (data) {
          callback(data);
        }
      }
    );
  }
};

// =============================================
// TYPE-SPECIFIC HELPERS - HOMEPAGE CONFIG
// =============================================

export const homepageService = {
  get: () => firestoreService.getById<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main'),
  
  save: (config: HomepageConfig) => 
    firestoreService.set(COLLECTIONS.HOMEPAGE, { ...config, id: 'main' }),
  
  update: (data: Partial<HomepageConfig>) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', data),
  
  updateHero: (heroTitle: string, heroSubtitle: string, heroBgUrl: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', {
      heroTitle,
      heroSubtitle,
      heroBgUrl
    }),
  
  updateHeroTitle: (title: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', { heroTitle: title }),
  
  updateHeroSubtitle: (subtitle: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', { heroSubtitle: subtitle }),
  
  updateHeroBg: (bgUrl: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', { heroBgUrl: bgUrl }),
  
  updateStatusColors: (readyColor: string, disewaColor: string, tidakTersediaColor: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', {
      statusColors: {
        readyColor,
        disewaColor,
        tidakTersediaColor
      }
    }),
  
  updateReadyColor: (color: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', {
      statusColors: {
        ...(firestoreService.getById<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main') as any)?.statusColors,
        readyColor: color
      }
    }),
  
  updateFeatures: (features: HomepageConfig['features']) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', { features }),
  
  updateFeature: (featureId: string, updates: { title?: string; description?: string }) =>
    firestoreService.getById<HomepageConfig>(COLLECTIONS.HOMEPAGE, 'main')
      .then(config => {
        if (config) {
          const updatedFeatures = config.features.map(f => 
            f.id === featureId ? { ...f, ...updates } : f
          );
          return firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', { features: updatedFeatures });
        }
      }),
  
  subscribe: (callback: (data: HomepageConfig) => void) => {
    return firestoreService.subscribeToDocument<HomepageConfig>(
      COLLECTIONS.HOMEPAGE,
      'main',
      (data) => {
        if (data) {
          callback(data);
        }
      }
    );
  }
};

// =============================================
// COMPLETE DATA EXPORT (For backup/migration)
// =============================================

export const exportAllData = async () => {
  try {
    const [packages, unitPrices, terms, reviews, documentation, settings, homepage] = await Promise.all([
      packageService.getAll(),
      unitPriceService.getAll(),
      termService.getAll(),
      reviewService.getAll(),
      documentationService.getAll(),
      settingsService.get(),
      homepageService.get()
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
      await packageService.bulkWrite(data.packages);
    }
    if (data.unitPrices && data.unitPrices.length > 0) {
      await unitPriceService.bulkWrite(data.unitPrices);
    }
    if (data.terms && data.terms.length > 0) {
      await termService.bulkWrite(data.terms);
    }
    if (data.reviews && data.reviews.length > 0) {
      await reviewService.bulkWrite(data.reviews);
    }
    if (data.documentation && data.documentation.length > 0) {
      await documentationService.bulkWrite(data.documentation);
    }
    if (data.settings) {
      await settingsService.save(data.settings);
    }
    if (data.homepage) {
      await homepageService.save(data.homepage);
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
      packageService.getAll(),
      unitPriceService.getAll(),
      termService.getAll(),
      reviewService.getAll(),
      documentationService.getAll()
    ]);
    
    await Promise.all([
      firestoreService.bulkDelete(COLLECTIONS.PACKAGES, packages.map(p => p.id)),
      firestoreService.bulkDelete(COLLECTIONS.UNIT_PRICES, unitPrices.map(p => p.id)),
      firestoreService.bulkDelete(COLLECTIONS.TERMS, terms.map(p => p.id)),
      firestoreService.bulkDelete(COLLECTIONS.REVIEWS, reviews.map(p => p.id)),
      firestoreService.bulkDelete(COLLECTIONS.DOCUMENTATION, docs.map(p => p.id)),
      firestoreService.delete(COLLECTIONS.SETTINGS, 'main'),
      firestoreService.delete(COLLECTIONS.HOMEPAGE, 'main')
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

export default firestoreService;
import { 
  db 
} from './config';
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
  Timestamp,
  DocumentData,
  QuerySnapshot,
  CollectionReference,
  Query,
  writeBatch
} from 'firebase/firestore';
import { 
  RentalPackage, 
  UnitPriceItem, 
  TermItem, 
  ReviewItem, 
  DocumentationItem,
  SystemSettings,
  HomepageConfig,
  ItemStatus 
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
  HOMEPAGE: 'homepage'
};

// =============================================
// GENERIC CRUD OPERATIONS
// =============================================

export const firestoreService = {
  // ---- GET ALL DOCUMENTS ----
  async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      console.log(`📖 Fetching all documents from ${collectionName}...`);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      console.log(`✅ ${collectionName}: ${data.length} documents found`);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${collectionName}:`, error);
      throw error;
    }
  },

  // ---- GET SINGLE DOCUMENT ----
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      console.log(`📖 Fetching document ${id} from ${collectionName}...`);
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;
        console.log(`✅ Document ${id} found`);
        return data;
      } else {
        console.warn(`⚠️ Document ${id} not found in ${collectionName}`);
        return null;
      }
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
      console.log(`💾 Saving document ${data.id} to ${collectionName}...`);
      const docRef = doc(db, collectionName, data.id);
      await setDoc(docRef, data, { merge: true });
      console.log(`✅ Document ${data.id} saved successfully`);
    } catch (error) {
      console.error(`❌ Error saving document ${data.id}:`, error);
      throw error;
    }
  },

  // ---- UPDATE SPECIFIC FIELDS ----
  async update(collectionName: string, id: string, data: any): Promise<void> {
    try {
      console.log(`🔄 Updating document ${id} in ${collectionName}...`);
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      console.log(`✅ Document ${id} updated successfully`);
    } catch (error) {
      console.error(`❌ Error updating document ${id}:`, error);
      throw error;
    }
  },

  // ---- DELETE DOCUMENT ----
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting document ${id} from ${collectionName}...`);
      
      // First verify document exists
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.warn(`⚠️ Document ${id} not found in ${collectionName}, skipping delete`);
        return;
      }
      
      await deleteDoc(docRef);
      console.log(`✅ Document ${id} deleted successfully from ${collectionName}`);
    } catch (error) {
      console.error(`❌ Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  },

  // ---- BULK DELETE ----
  async bulkDelete(collectionName: string, ids: string[]): Promise<void> {
    try {
      console.log(`🗑️ Bulk deleting ${ids.length} documents from ${collectionName}...`);
      const batch = writeBatch(db);
      
      for (const id of ids) {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      }
      
      await batch.commit();
      console.log(`✅ ${ids.length} documents deleted successfully`);
    } catch (error) {
      console.error(`❌ Error in bulk delete:`, error);
      throw error;
    }
  },

  // ---- BULK WRITE ----
  async bulkWrite<T extends { id: string }>(
    collectionName: string,
    items: T[]
  ): Promise<void> {
    try {
      console.log(`📝 Bulk writing ${items.length} documents to ${collectionName}...`);
      const batch = writeBatch(db);
      
      for (const item of items) {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item, { merge: true });
      }
      
      await batch.commit();
      console.log(`✅ ${items.length} documents written successfully`);
    } catch (error) {
      console.error(`❌ Error in bulk write:`, error);
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
      console.log(`🔍 Querying ${collectionName} where ${field} = ${value}...`);
      const q = query(
        collection(db, collectionName),
        where(field, '==', value)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      console.log(`✅ ${data.length} documents found`);
      return data;
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
    console.log(`👂 Listening to ${collectionName} collection...`);
    
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
          
          console.log(`📡 ${collectionName} real-time update: ${data.length} items`);
          callback(data);
        } catch (error) {
          console.error(`❌ Error processing ${collectionName} snapshot:`, error);
        }
      },
      (error) => {
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
    console.log(`👂 Listening to document ${documentId} in ${collectionName}...`);
    
    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() } as T;
            console.log(`📡 Document ${documentId} updated`);
            callback(data);
          } else {
            console.warn(`⚠️ Document ${documentId} not found`);
            callback(null);
          }
        } catch (error) {
          console.error(`❌ Error processing document snapshot:`, error);
        }
      },
      (error) => {
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
      console.error(`❌ Error checking document existence:`, error);
      return false;
    }
  },

  // ---- DELETE COLLECTION (USE WITH CAUTION) ----
  async deleteCollection(collectionName: string, batchSize: number = 10): Promise<void> {
    try {
      console.log(`⚠️ Deleting entire collection: ${collectionName}`);
      
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      
      const batch = writeBatch(db);
      let count = 0;
      
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });
      
      await batch.commit();
      console.log(`✅ ${count} documents deleted from ${collectionName}`);
    } catch (error) {
      console.error(`❌ Error deleting collection:`, error);
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
  
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting package: ${id}`);
      
      // Verify document exists first
      const exists = await firestoreService.exists(COLLECTIONS.PACKAGES, id);
      if (!exists) {
        console.warn(`⚠️ Package ${id} not found, skipping delete`);
        return;
      }
      
      await firestoreService.delete(COLLECTIONS.PACKAGES, id);
      console.log(`✅ Package ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting package ${id}:`, error);
      throw error;
    }
  },
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.PACKAGES, ids),
  
  updateStatus: (id: string, status: ItemStatus) => 
    firestoreService.update(COLLECTIONS.PACKAGES, id, { status }),
  
  updateField: (id: string, field: string, value: any) =>
    firestoreService.update(COLLECTIONS.PACKAGES, id, { [field]: value }),
  
  subscribe: (callback: (data: RentalPackage[]) => void) => 
    firestoreService.subscribeToCollection<RentalPackage>(
      COLLECTIONS.PACKAGES, 
      (data) => {
        console.log(`📦 Real-time packages update: ${data.length} items`);
        callback(data);
      }
    ),
  
  subscribeToPackage: (id: string, callback: (data: RentalPackage | null) => void) =>
    firestoreService.subscribeToDocument<RentalPackage>(COLLECTIONS.PACKAGES, id, callback),
  
  queryByStatus: (status: ItemStatus) => 
    firestoreService.queryByField<RentalPackage>(COLLECTIONS.PACKAGES, 'status', status),
  
  bulkWrite: (packages: RentalPackage[]) => 
    firestoreService.bulkWrite(COLLECTIONS.PACKAGES, packages)
};

// =============================================
// TYPE-SPECIFIC HELPERS - UNIT PRICES
// =============================================

export const unitPriceService = {
  getAll: () => firestoreService.getAll<UnitPriceItem>(COLLECTIONS.UNIT_PRICES),
  
  getById: (id: string) => firestoreService.getById<UnitPriceItem>(COLLECTIONS.UNIT_PRICES, id),
  
  save: (item: UnitPriceItem) => firestoreService.set(COLLECTIONS.UNIT_PRICES, item),
  
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting unit price: ${id}`);
      const exists = await firestoreService.exists(COLLECTIONS.UNIT_PRICES, id);
      if (!exists) {
        console.warn(`⚠️ Unit price ${id} not found, skipping delete`);
        return;
      }
      await firestoreService.delete(COLLECTIONS.UNIT_PRICES, id);
      console.log(`✅ Unit price ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting unit price ${id}:`, error);
      throw error;
    }
  },
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.UNIT_PRICES, ids),
  
  updatePrice: (id: string, price: number) =>
    firestoreService.update(COLLECTIONS.UNIT_PRICES, id, { price }),
  
  subscribe: (callback: (data: UnitPriceItem[]) => void) => 
    firestoreService.subscribeToCollection<UnitPriceItem>(
      COLLECTIONS.UNIT_PRICES, 
      callback, 
      'index'
    ),
  
  bulkWrite: (items: UnitPriceItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.UNIT_PRICES, items)
};

// =============================================
// TYPE-SPECIFIC HELPERS - TERMS
// =============================================

export const termService = {
  getAll: () => firestoreService.getAll<TermItem>(COLLECTIONS.TERMS),
  
  getById: (id: string) => firestoreService.getById<TermItem>(COLLECTIONS.TERMS, id),
  
  save: (term: TermItem) => firestoreService.set(COLLECTIONS.TERMS, term),
  
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting term: ${id}`);
      const exists = await firestoreService.exists(COLLECTIONS.TERMS, id);
      if (!exists) {
        console.warn(`⚠️ Term ${id} not found, skipping delete`);
        return;
      }
      await firestoreService.delete(COLLECTIONS.TERMS, id);
      console.log(`✅ Term ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting term ${id}:`, error);
      throw error;
    }
  },
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.TERMS, ids),
  
  reorder: async (terms: TermItem[]) => {
    // Update all terms with new indexes
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
    firestoreService.bulkWrite(COLLECTIONS.TERMS, items)
};

// =============================================
// TYPE-SPECIFIC HELPERS - REVIEWS
// =============================================

export const reviewService = {
  getAll: () => firestoreService.getAll<ReviewItem>(COLLECTIONS.REVIEWS),
  
  getById: (id: string) => firestoreService.getById<ReviewItem>(COLLECTIONS.REVIEWS, id),
  
  save: (review: ReviewItem) => firestoreService.set(COLLECTIONS.REVIEWS, review),
  
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting review: ${id}`);
      const exists = await firestoreService.exists(COLLECTIONS.REVIEWS, id);
      if (!exists) {
        console.warn(`⚠️ Review ${id} not found, skipping delete`);
        return;
      }
      await firestoreService.delete(COLLECTIONS.REVIEWS, id);
      console.log(`✅ Review ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting review ${id}:`, error);
      throw error;
    }
  },
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.REVIEWS, ids),
  
  toggleHidden: (id: string, hidden: boolean) => 
    firestoreService.update(COLLECTIONS.REVIEWS, id, { hidden }),
  
  getVisibleReviews: () => 
    firestoreService.queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', false),
  
  getHiddenReviews: () => 
    firestoreService.queryByField<ReviewItem>(COLLECTIONS.REVIEWS, 'hidden', true),
  
  subscribe: (callback: (data: ReviewItem[]) => void) => 
    firestoreService.subscribeToCollection<ReviewItem>(
      COLLECTIONS.REVIEWS, 
      callback
    ),
  
  subscribeToVisible: (callback: (data: ReviewItem[]) => void) => {
    return firestoreService.subscribeToCollection<ReviewItem>(
      COLLECTIONS.REVIEWS,
      (data) => callback(data.filter(r => !r.hidden))
    );
  },
  
  bulkWrite: (items: ReviewItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.REVIEWS, items)
};

// =============================================
// TYPE-SPECIFIC HELPERS - DOCUMENTATION
// =============================================

export const documentationService = {
  getAll: () => firestoreService.getAll<DocumentationItem>(COLLECTIONS.DOCUMENTATION),
  
  getById: (id: string) => firestoreService.getById<DocumentationItem>(COLLECTIONS.DOCUMENTATION, id),
  
  save: (doc: DocumentationItem) => firestoreService.set(COLLECTIONS.DOCUMENTATION, doc),
  
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting documentation: ${id}`);
      const exists = await firestoreService.exists(COLLECTIONS.DOCUMENTATION, id);
      if (!exists) {
        console.warn(`⚠️ Documentation ${id} not found, skipping delete`);
        return;
      }
      await firestoreService.delete(COLLECTIONS.DOCUMENTATION, id);
      console.log(`✅ Documentation ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting documentation ${id}:`, error);
      throw error;
    }
  },
  
  bulkDelete: (ids: string[]) => firestoreService.bulkDelete(COLLECTIONS.DOCUMENTATION, ids),
  
  updateCaption: (id: string, caption: string) =>
    firestoreService.update(COLLECTIONS.DOCUMENTATION, id, { caption }),
  
  subscribe: (callback: (data: DocumentationItem[]) => void) => 
    firestoreService.subscribeToCollection<DocumentationItem>(
      COLLECTIONS.DOCUMENTATION, 
      callback
    ),
  
  bulkWrite: (items: DocumentationItem[]) => 
    firestoreService.bulkWrite(COLLECTIONS.DOCUMENTATION, items)
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
  
  subscribe: (callback: (data: SystemSettings) => void) => {
    return firestoreService.subscribeToDocument<SystemSettings>(
      COLLECTIONS.SETTINGS,
      'main',
      (data) => {
        if (data) {
          console.log('⚙️ Settings updated');
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
  
  updateStatusColors: (readyColor: string, disewaColor: string, tidakTersediaColor: string) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', {
      statusColors: {
        readyColor,
        disewaColor,
        tidakTersediaColor
      }
    }),
  
  updateFeatures: (features: HomepageConfig['features']) =>
    firestoreService.update(COLLECTIONS.HOMEPAGE, 'main', { features }),
  
  subscribe: (callback: (data: HomepageConfig) => void) => {
    return firestoreService.subscribeToDocument<HomepageConfig>(
      COLLECTIONS.HOMEPAGE,
      'main',
      (data) => {
        if (data) {
          console.log('🏠 Homepage config updated');
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
    console.log('📦 Exporting all data from Firestore...');
    
    const [packages, unitPrices, terms, reviews, documentation, settings, homepage] = await Promise.all([
      packageService.getAll(),
      unitPriceService.getAll(),
      termService.getAll(),
      reviewService.getAll(),
      documentationService.getAll(),
      settingsService.get(),
      homepageService.get()
    ]);
    
    const exportData = {
      packages,
      unitPrices,
      terms,
      reviews,
      documentation,
      settings,
      homepage,
      exportedAt: new Date().toISOString()
    };
    
    console.log('✅ Data exported successfully');
    return exportData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
};

export const importAllData = async (data: any) => {
  try {
    console.log('📥 Importing all data to Firestore...');
    
    if (data.packages) {
      await packageService.bulkWrite(data.packages);
    }
    if (data.unitPrices) {
      await unitPriceService.bulkWrite(data.unitPrices);
    }
    if (data.terms) {
      await termService.bulkWrite(data.terms);
    }
    if (data.reviews) {
      await reviewService.bulkWrite(data.reviews);
    }
    if (data.documentation) {
      await documentationService.bulkWrite(data.documentation);
    }
    if (data.settings) {
      await settingsService.save(data.settings);
    }
    if (data.homepage) {
      await homepageService.save(data.homepage);
    }
    
    console.log('✅ Data imported successfully');
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
    console.log('⚠️ Resetting entire database...');
    
    await Promise.all([
      firestoreService.deleteCollection(COLLECTIONS.PACKAGES),
      firestoreService.deleteCollection(COLLECTIONS.UNIT_PRICES),
      firestoreService.deleteCollection(COLLECTIONS.TERMS),
      firestoreService.deleteCollection(COLLECTIONS.REVIEWS),
      firestoreService.deleteCollection(COLLECTIONS.DOCUMENTATION),
      firestoreService.delete(COLLECTIONS.SETTINGS, 'main'),
      firestoreService.delete(COLLECTIONS.HOMEPAGE, 'main')
    ]);
    
    console.log('✅ Database reset successfully');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

export default firestoreService;
// =============================================
// IMPORTS - DARI FIRESTORE SERVICE
// =============================================
import { 
  packageService, 
  unitPriceService, 
  termService, 
  reviewService, 
  documentationService,
  settingsService,
  homepageService 
} from '../firebase/firestoreService';
import type { 
  RentalPackage, 
  UnitPriceItem, 
  TermItem, 
  ReviewItem, 
  DocumentationItem,
  SystemSettings,
  HomepageConfig 
} from '../types';
import {
  INITIAL_PACKAGES,
  INITIAL_UNIT_PRICES,
  INITIAL_TERMS,
  INITIAL_REVIEWS,
  INITIAL_DOCUMENTATION,
  INITIAL_SETTINGS,
  INITIAL_HOMEPAGE_CONFIG
} from '../data/initialData';

export async function migrateFromLocalStorage() {
  try {
    // Migrasi Packages
    const packages = localStorage.getItem('onesky_packages');
    if (packages) {
      const data = JSON.parse(packages) as RentalPackage[];
      await packageService.bulkWrite(data);
      console.log(`✅ ${data.length} packages migrated`);
    }

    // Migrasi Unit Prices
    const unitPrices = localStorage.getItem('onesky_unit_prices');
    if (unitPrices) {
      const data = JSON.parse(unitPrices) as UnitPriceItem[];
      await unitPriceService.bulkWrite(data);
      console.log(`✅ ${data.length} unit prices migrated`);
    }

    // Migrasi Terms
    const terms = localStorage.getItem('onesky_terms');
    if (terms) {
      const data = JSON.parse(terms) as TermItem[];
      await termService.bulkWrite(data);
      console.log(`✅ ${data.length} terms migrated`);
    }

    // Migrasi Reviews
    const reviews = localStorage.getItem('onesky_reviews');
    if (reviews) {
      const data = JSON.parse(reviews) as ReviewItem[];
      await reviewService.bulkWrite(data);
      console.log(`✅ ${data.length} reviews migrated`);
    }

    // Migrasi Documentation
    const docs = localStorage.getItem('onesky_documentation');
    if (docs) {
      const data = JSON.parse(docs) as DocumentationItem[];
      await documentationService.bulkWrite(data);
      console.log(`✅ ${data.length} documentation items migrated`);
    }

    // Migrasi Settings
    const settings = localStorage.getItem('onesky_settings');
    if (settings) {
      const data = JSON.parse(settings) as SystemSettings;
      await settingsService.save(data);
      console.log('✅ Settings migrated');
    }

    // Migrasi Homepage Config
    const homepage = localStorage.getItem('onesky_homepage');
    if (homepage) {
      const data = JSON.parse(homepage) as HomepageConfig;
      await homepageService.save(data);
      console.log('✅ Homepage config migrated');
    }

    console.log('🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

export async function seedInitialData() {
  try {
    // Seed packages
    await packageService.bulkWrite(INITIAL_PACKAGES);
    console.log(`✅ ${INITIAL_PACKAGES.length} packages seeded`);
    
    // Seed unit prices
    await unitPriceService.bulkWrite(INITIAL_UNIT_PRICES);
    console.log(`✅ ${INITIAL_UNIT_PRICES.length} unit prices seeded`);
    
    // Seed terms
    await termService.bulkWrite(INITIAL_TERMS);
    console.log(`✅ ${INITIAL_TERMS.length} terms seeded`);
    
    // Seed reviews
    await reviewService.bulkWrite(INITIAL_REVIEWS);
    console.log(`✅ ${INITIAL_REVIEWS.length} reviews seeded`);
    
    // Seed documentation
    await documentationService.bulkWrite(INITIAL_DOCUMENTATION);
    console.log(`✅ ${INITIAL_DOCUMENTATION.length} documentation items seeded`);
    
    // Seed settings
    await settingsService.save(INITIAL_SETTINGS);
    console.log('✅ Settings seeded');
    
    // Seed homepage config
    await homepageService.save(INITIAL_HOMEPAGE_CONFIG);
    console.log('✅ Homepage config seeded');
    
    console.log('🎉 Initial data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
    throw error;
  }
}
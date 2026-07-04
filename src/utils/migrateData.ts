import { 
  packageService, 
  unitPriceService, 
  termService, 
  reviewService, 
  documentationService,
  settingsService,
  homepageService 
} from '../firebase/firestoreService';
import { 
  RentalPackage, 
  UnitPriceItem, 
  TermItem, 
  ReviewItem, 
  DocumentationItem,
  SystemSettings,
  HomepageConfig 
} from '../types';

export async function migrateFromLocalStorage() {
  const results = {
    packages: 0,
    unitPrices: 0,
    terms: 0,
    reviews: 0,
    documentation: 0,
    settings: 0,
    homepage: 0
  };

  try {
    // 1. Migrasi Packages
    const packages = localStorage.getItem('onesky_packages');
    if (packages) {
      const data = JSON.parse(packages) as RentalPackage[];
      for (const item of data) {
        await packageService.save(item);
      }
      results.packages = data.length;
      console.log(`✅ ${data.length} packages migrated`);
    }

    // 2. Migrasi Unit Prices
    const unitPrices = localStorage.getItem('onesky_unit_prices');
    if (unitPrices) {
      const data = JSON.parse(unitPrices) as UnitPriceItem[];
      for (const item of data) {
        await unitPriceService.save(item);
      }
      results.unitPrices = data.length;
      console.log(`✅ ${data.length} unit prices migrated`);
    }

    // 3. Migrasi Terms
    const terms = localStorage.getItem('onesky_terms');
    if (terms) {
      const data = JSON.parse(terms) as TermItem[];
      for (const item of data) {
        await termService.save(item);
      }
      results.terms = data.length;
      console.log(`✅ ${data.length} terms migrated`);
    }

    // 4. Migrasi Reviews
    const reviews = localStorage.getItem('onesky_reviews');
    if (reviews) {
      const data = JSON.parse(reviews) as ReviewItem[];
      for (const item of data) {
        await reviewService.save(item);
      }
      results.reviews = data.length;
      console.log(`✅ ${data.length} reviews migrated`);
    }

    // 5. Migrasi Documentation
    const docs = localStorage.getItem('onesky_documentation');
    if (docs) {
      const data = JSON.parse(docs) as DocumentationItem[];
      for (const item of data) {
        await documentationService.save(item);
      }
      results.documentation = data.length;
      console.log(`✅ ${data.length} documentation items migrated`);
    }

    // 6. Migrasi Settings
    const settings = localStorage.getItem('onesky_settings');
    if (settings) {
      const data = JSON.parse(settings) as SystemSettings;
      await settingsService.save(data);
      results.settings = 1;
      console.log(`✅ Settings migrated`);
    }

    // 7. Migrasi Homepage Config
    const homepage = localStorage.getItem('onesky_homepage');
    if (homepage) {
      const data = JSON.parse(homepage) as HomepageConfig;
      await homepageService.save(data);
      results.homepage = 1;
      console.log(`✅ Homepage config migrated`);
    }

    console.log('🎉 Migration complete!', results);
    return results;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}
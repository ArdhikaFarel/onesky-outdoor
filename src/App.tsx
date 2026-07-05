import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, Sparkles, Bell } from 'lucide-react';

// Types & Initial Data
import {
  RentalPackage,
  UnitPriceItem,
  TermItem,
  ReviewItem,
  DocumentationItem,
  SystemSettings,
  HomepageConfig,
  CartItem
} from './types';
import {
  INITIAL_PACKAGES,
  INITIAL_UNIT_PRICES,
  INITIAL_TERMS,
  INITIAL_REVIEWS,
  INITIAL_DOCUMENTATION,
  INITIAL_SETTINGS,
  INITIAL_HOMEPAGE_CONFIG
} from './data/initialData';

// Shared Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';

// Public Page Views
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import HargaSatuan from './pages/HargaSatuan';
import SyaratKetentuan from './pages/SyaratKetentuan';
import UlasanDokumentasi from './pages/UlasanDokumentasi';
import Lokasi from './pages/Lokasi';

// Administrative Page Views
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// ==========================================
// FIREBASE IMPORTS - HANYA DARI CONFIG
// ==========================================
import { 
  packageService, 
  unitPriceService, 
  termService, 
  reviewService, 
  documentationService,
  settingsService,
  homepageService,
  exportAllData,
  importAllData,
  resetDatabase,
  checkFirestoreHealth
} from './firebase/config';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// ==========================================
// MIGRATION HELPER
// ==========================================
import { migrateFromLocalStorage, seedInitialData } from './utils/migrateData';

export default function App() {
  // ==========================================
  // CORE STATE ENGINE (Firestore sebagai source of truth)
  // ==========================================
  const [packages, setPackages] = useState<RentalPackage[]>([]);
  const [unitPrices, setUnitPrices] = useState<UnitPriceItem[]>([]);
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [documentation, setDocumentation] = useState<DocumentationItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(INITIAL_HOMEPAGE_CONFIG);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('onesky_cart');
    return local ? JSON.parse(local) : [];
  });

  // ==========================================
  // FIRESTORE REAL-TIME SUBSCRIPTIONS
  // ==========================================
  const [isMigrationDone, setIsMigrationDone] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Subscribe to Firestore collections - REAL-TIME SYNC
  useEffect(() => {
    if (!isMigrationDone || isSubscribing) return;

    console.log('🔄 Starting Firestore real-time subscriptions...');
    setIsSubscribing(true);

    // Subscribe to packages
    const unsubscribePackages = packageService.subscribe((data) => {
      console.log(`📦 Packages updated: ${data.length} items`);
      setPackages(data);
      localStorage.setItem('onesky_packages', JSON.stringify(data));
    });

    // Subscribe to unit prices
    const unsubscribeUnitPrices = unitPriceService.subscribe((data) => {
      console.log(`💰 Unit prices updated: ${data.length} items`);
      setUnitPrices(data);
      localStorage.setItem('onesky_unit_prices', JSON.stringify(data));
    });

    // Subscribe to terms
    const unsubscribeTerms = termService.subscribe((data) => {
      console.log(`📋 Terms updated: ${data.length} items`);
      setTerms(data);
      localStorage.setItem('onesky_terms', JSON.stringify(data));
    });

    // Subscribe to reviews
    const unsubscribeReviews = reviewService.subscribe((data) => {
      console.log(`⭐ Reviews updated: ${data.length} items`);
      setReviews(data);
      localStorage.setItem('onesky_reviews', JSON.stringify(data));
    });

    // Subscribe to documentation
    const unsubscribeDocs = documentationService.subscribe((data) => {
      console.log(`📸 Documentation updated: ${data.length} items`);
      setDocumentation(data);
      localStorage.setItem('onesky_documentation', JSON.stringify(data));
    });

    // Subscribe to settings
    const unsubscribeSettings = settingsService.subscribe((data) => {
      if (data) {
        console.log('⚙️ Settings updated');
        setSettings(data);
        localStorage.setItem('onesky_settings', JSON.stringify(data));
      }
    });

    // Subscribe to homepage config
    const unsubscribeHomepage = homepageService.subscribe((data) => {
      if (data) {
        console.log('🏠 Homepage config updated:', data);
        setHomepageConfig(data);
        localStorage.setItem('onesky_homepage', JSON.stringify(data));
      }
    });

    setIsInitialLoad(false);
    setIsSubscribing(false);

    return () => {
      console.log('🔄 Cleaning up Firestore subscriptions...');
      unsubscribePackages();
      unsubscribeUnitPrices();
      unsubscribeTerms();
      unsubscribeReviews();
      unsubscribeDocs();
      unsubscribeSettings();
      unsubscribeHomepage();
      setIsSubscribing(false);
    };
  }, [isMigrationDone]);

  // ==========================================
  // DATA MIGRATION FROM LOCALSTORAGE TO FIRESTORE
  // ==========================================
  useEffect(() => {
    const migrateData = async () => {
      try {
        // Check if migration already done
        const migrationFlag = localStorage.getItem('onesky_migration_done');
        if (migrationFlag === 'true') {
          setIsMigrationDone(true);
          return;
        }

        console.log('🔄 Checking for local data to migrate...');
        
        // Check if there's data in LocalStorage
        const hasLocalData = 
          localStorage.getItem('onesky_packages') || 
          localStorage.getItem('onesky_unit_prices') ||
          localStorage.getItem('onesky_terms') ||
          localStorage.getItem('onesky_reviews') ||
          localStorage.getItem('onesky_documentation');

        if (hasLocalData) {
          console.log('🔄 Migrating data from LocalStorage to Firestore...');
          await migrateFromLocalStorage();
          localStorage.setItem('onesky_migration_done', 'true');
          triggerToast('✅ Data berhasil dimigrasi ke Firebase!');
        } else {
          // If no local data, seed initial data to Firestore
          console.log('📦 Seeding initial data to Firestore...');
          await seedInitialData();
          localStorage.setItem('onesky_migration_done', 'true');
        }

        setIsMigrationDone(true);
      } catch (error) {
        console.error('Migration error:', error);
        // If migration fails, still allow app to work with local data
        setIsMigrationDone(true);
        triggerToast('⚠️ Gagal migrasi data, menggunakan data lokal.');
      }
    };

    migrateData();
  }, []);

  // ==========================================
  // AUTH STATE MONITORING
  // ==========================================
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const session = sessionStorage.getItem('onesky_admin_logged_in') || localStorage.getItem('onesky_admin_logged_in');
    return session === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('onesky_admin_logged_in', 'true');
      } else {
        setIsAdminLoggedIn(false);
        localStorage.removeItem('onesky_admin_logged_in');
        sessionStorage.removeItem('onesky_admin_logged_in');
      }
    });

    return () => unsubscribe();
  }, []);

  // ==========================================
  // NAVIGATION & VIEW STATES
  // ==========================================
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const local = localStorage.getItem('onesky_darkmode');
    return local === 'true';
  });

  // ==========================================
  // FEEDBACK / NOTIFICATION SYSTEM
  // ==========================================
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  // ==========================================
  // TOAST ALERTS CONTROLLER
  // ==========================================
  const triggerToast = useCallback((msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  }, []);

  // ==========================================
  // LOCAL STORAGE FALLBACK SYNC
  // ==========================================
  useEffect(() => {
    if (packages.length > 0) {
      localStorage.setItem('onesky_packages', JSON.stringify(packages));
    }
  }, [packages]);

  useEffect(() => {
    if (unitPrices.length > 0) {
      localStorage.setItem('onesky_unit_prices', JSON.stringify(unitPrices));
    }
  }, [unitPrices]);

  useEffect(() => {
    if (terms.length > 0) {
      localStorage.setItem('onesky_terms', JSON.stringify(terms));
    }
  }, [terms]);

  useEffect(() => {
    localStorage.setItem('onesky_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('onesky_documentation', JSON.stringify(documentation));
  }, [documentation]);

  useEffect(() => {
    localStorage.setItem('onesky_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('onesky_homepage', JSON.stringify(homepageConfig));
  }, [homepageConfig]);

  useEffect(() => {
    localStorage.setItem('onesky_cart', JSON.stringify(cart));
  }, [cart]);

  // Synchronize Dark Mode html class
  useEffect(() => {
    localStorage.setItem('onesky_darkmode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic CSS Variables Injection for Primary and Secondary colors
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary-custom', settings.primaryColor);
    document.documentElement.style.setProperty('--color-secondary-custom', settings.secondaryColor);
  }, [settings.primaryColor, settings.secondaryColor]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when currentPage changes
  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  // Listen scroll for scroll to top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // ==========================================
  // SHOPPING CART CONTROLLER FUNCTIONS
  // ==========================================
  const handleAddToCart = useCallback((pkgItem: RentalPackage) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.packageItem.id === pkgItem.id);
      if (existing) {
        return prevCart.map((item) =>
          item.packageItem.id === pkgItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { packageItem: pkgItem, quantity: 1 }];
    });
    triggerToast(`✅ ${pkgItem.name} ditambahkan ke keranjang!`);
  }, [triggerToast]);

  const handleUpdateCartQuantity = useCallback((packageId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.packageItem.id === packageId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveFromCart = useCallback((packageId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.packageItem.id !== packageId));
    triggerToast('🗑️ Item dihapus dari keranjang.');
  }, [triggerToast]);

  const handleClearCart = useCallback(() => {
    setCart([]);
    triggerToast('🧹 Keranjang belanja dikosongkan.');
  }, [triggerToast]);

  // ==========================================
  // AUTHENTICATION LOGIC FLOW
  // ==========================================
  const handleAdminLoginSuccess = useCallback((rememberMe: boolean) => {
    setIsAdminLoggedIn(true);
    if (rememberMe) {
      localStorage.setItem('onesky_admin_logged_in', 'true');
    } else {
      sessionStorage.setItem('onesky_admin_logged_in', 'true');
    }
    setCurrentPage('admin-dashboard');
    triggerToast('🔐 Selamat datang di Dashboard Admin!');
  }, [triggerToast]);

  const handleAdminLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setIsAdminLoggedIn(false);
      localStorage.removeItem('onesky_admin_logged_in');
      sessionStorage.removeItem('onesky_admin_logged_in');
      setCurrentPage('home');
      triggerToast('👋 Berhasil keluar dari Admin Panel.');
    } catch (error) {
      console.error('Logout error:', error);
      triggerToast('❌ Gagal logout. Silakan coba lagi.');
    }
  }, [triggerToast]);

  // ==========================================
  // CRUD FUNCTIONS (Langsung ke Firestore)
  // ==========================================
  
  // Packages CRUD - DIPERBAIKI
  const handleSetPackages = useCallback((newPackages: RentalPackage[] | ((prev: RentalPackage[]) => RentalPackage[])) => {
    const updated = typeof newPackages === 'function' ? newPackages(packages) : newPackages;
    
    // Update state langsung
    setPackages(updated);
    
    // Simpan ke Firestore untuk setiap perubahan
    if (isMigrationDone) {
      // Cari package yang dihapus
      const deletedIds = packages.filter(p => !updated.some(up => up.id === p.id)).map(p => p.id);
      
      // Hapus dari Firestore
      deletedIds.forEach(id => {
        packageService.delete(id).catch(err => console.error('Error deleting package:', err));
      });
      
      // Update atau tambahkan package yang ada
      updated.forEach(pkg => {
        packageService.save(pkg).catch(err => console.error('Error saving package:', err));
      });
    }
  }, [packages, isMigrationDone]);

  // Unit Prices CRUD - DIPERBAIKI
  const handleSetUnitPrices = useCallback((newPrices: UnitPriceItem[] | ((prev: UnitPriceItem[]) => UnitPriceItem[])) => {
    const updated = typeof newPrices === 'function' ? newPrices(unitPrices) : newPrices;
    setUnitPrices(updated);
    
    if (isMigrationDone) {
      const deletedIds = unitPrices.filter(p => !updated.some(up => up.id === p.id)).map(p => p.id);
      deletedIds.forEach(id => {
        unitPriceService.delete(id).catch(err => console.error('Error deleting unit price:', err));
      });
      
      updated.forEach(item => {
        unitPriceService.save(item).catch(err => console.error('Error saving unit price:', err));
      });
    }
  }, [unitPrices, isMigrationDone]);

  // Terms CRUD - DIPERBAIKI
  const handleSetTerms = useCallback((newTerms: TermItem[] | ((prev: TermItem[]) => TermItem[])) => {
    const updated = typeof newTerms === 'function' ? newTerms(terms) : newTerms;
    setTerms(updated);
    
    if (isMigrationDone) {
      const deletedIds = terms.filter(p => !updated.some(up => up.id === p.id)).map(p => p.id);
      deletedIds.forEach(id => {
        termService.delete(id).catch(err => console.error('Error deleting term:', err));
      });
      
      updated.forEach(term => {
        termService.save(term).catch(err => console.error('Error saving term:', err));
      });
    }
  }, [terms, isMigrationDone]);

  // Reviews CRUD - DIPERBAIKI
  const handleSetReviews = useCallback((newReviews: ReviewItem[] | ((prev: ReviewItem[]) => ReviewItem[])) => {
    const updated = typeof newReviews === 'function' ? newReviews(reviews) : newReviews;
    setReviews(updated);
    
    if (isMigrationDone) {
      const deletedIds = reviews.filter(p => !updated.some(up => up.id === p.id)).map(p => p.id);
      deletedIds.forEach(id => {
        reviewService.delete(id).catch(err => console.error('Error deleting review:', err));
      });
      
      updated.forEach(review => {
        reviewService.save(review).catch(err => console.error('Error saving review:', err));
      });
    }
  }, [reviews, isMigrationDone]);

  // Documentation CRUD - DIPERBAIKI
  const handleSetDocumentation = useCallback((newDocs: DocumentationItem[] | ((prev: DocumentationItem[]) => DocumentationItem[])) => {
    const updated = typeof newDocs === 'function' ? newDocs(documentation) : newDocs;
    setDocumentation(updated);
    
    if (isMigrationDone) {
      const deletedIds = documentation.filter(p => !updated.some(up => up.id === p.id)).map(p => p.id);
      deletedIds.forEach(id => {
        documentationService.delete(id).catch(err => console.error('Error deleting doc:', err));
      });
      
      updated.forEach(doc => {
        documentationService.save(doc).catch(err => console.error('Error saving doc:', err));
      });
    }
  }, [documentation, isMigrationDone]);

  // Settings CRUD - DIPERBAIKI
  const handleSetSettings = useCallback((newSettings: SystemSettings | ((prev: SystemSettings) => SystemSettings)) => {
    const updated = typeof newSettings === 'function' ? newSettings(settings) : newSettings;
    setSettings(updated);
    
    if (isMigrationDone) {
      settingsService.save(updated)
        .then(() => console.log('✅ Settings saved to Firestore'))
        .catch(err => console.error('Error saving settings:', err));
    }
  }, [settings, isMigrationDone]);

  // Homepage Config CRUD - DIPERBAIKI DENGAN TOAST FEEDBACK
  const handleSetHomepageConfig = useCallback((newConfig: HomepageConfig | ((prev: HomepageConfig) => HomepageConfig)) => {
    const updated = typeof newConfig === 'function' ? newConfig(homepageConfig) : newConfig;
    
    console.log('🏠 Updating homepage config:', updated);
    setHomepageConfig(updated);
    
    // Update localStorage untuk fallback
    localStorage.setItem('onesky_homepage', JSON.stringify(updated));
    
    // Simpan ke Firestore
    if (isMigrationDone) {
      homepageService.save(updated)
        .then(() => {
          console.log('✅ Homepage config saved to Firestore');
          triggerToast('✅ Konfigurasi homepage berhasil disimpan!');
        })
        .catch((error) => {
          console.error('❌ Error saving homepage config:', error);
          triggerToast('❌ Gagal menyimpan konfigurasi homepage');
        });
    }
  }, [homepageConfig, isMigrationDone, triggerToast]);

  // ==========================================
  // PAGINATION ROUTER SWITCH
  // ==========================================
  const renderPageContent = useCallback(() => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            homepageConfig={homepageConfig}
            settings={settings}
            setCurrentPage={setCurrentPage}
            cartCount={totalCartCount}
            onCartToggle={() => setIsCartOpen(!isCartOpen)}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        );
      case 'katalog':
        return (
          <Katalog
            packages={packages}
            statusColors={homepageConfig.statusColors}
            onAddToCart={handleAddToCart}
            onShowToast={triggerToast}
          />
        );
      case 'harga':
        return (
          <HargaSatuan
            unitPrices={unitPrices}
            onAddToCart={handleAddToCart}
            onShowToast={triggerToast}
          />
        );
      case 'syarat':
        return <SyaratKetentuan terms={terms} />;
      case 'ulasan':
        return (
          <UlasanDokumentasi
            reviews={reviews}
            documentation={documentation}
            onAddReview={(newRev) => {
              const updated = [...reviews, newRev];
              setReviews(updated);
              if (isMigrationDone) {
                reviewService.save(newRev).catch(err => console.error('Error saving review:', err));
              }
            }}
            onUpdateReview={(upRev) => {
              const updated = reviews.map((r) => (r.id === upRev.id ? upRev : r));
              setReviews(updated);
              if (isMigrationDone) {
                reviewService.save(upRev).catch(err => console.error('Error updating review:', err));
              }
            }}
            onDeleteReview={(id) => {
              const updated = reviews.filter((r) => r.id !== id);
              setReviews(updated);
              if (isMigrationDone) {
                reviewService.delete(id).catch(err => console.error('Error deleting review:', err));
              }
            }}
            onAddDoc={(newDoc) => {
              const updated = [...documentation, newDoc];
              setDocumentation(updated);
              if (isMigrationDone) {
                documentationService.save(newDoc).catch(err => console.error('Error saving doc:', err));
              }
            }}
            onUpdateDoc={(upDoc) => {
              const updated = documentation.map((d) => (d.id === upDoc.id ? upDoc : d));
              setDocumentation(updated);
              if (isMigrationDone) {
                documentationService.save(upDoc).catch(err => console.error('Error updating doc:', err));
              }
            }}
            onDeleteDoc={(id) => {
              const updated = documentation.filter((d) => d.id !== id);
              setDocumentation(updated);
              if (isMigrationDone) {
                documentationService.delete(id).catch(err => console.error('Error deleting doc:', err));
              }
            }}
            onShowToast={triggerToast}
          />
        );
      case 'lokasi':
        return <Lokasi settings={settings} />;
      case 'admin-login':
        return (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            settings={settings}
            onShowToast={triggerToast}
          />
        );
      case 'admin-dashboard':
        return isAdminLoggedIn ? (
          <AdminDashboard
            packages={packages}
            setPackages={handleSetPackages}
            unitPrices={unitPrices}
            setUnitPrices={handleSetUnitPrices}
            terms={terms}
            setTerms={handleSetTerms}
            reviews={reviews}
            setReviews={handleSetReviews}
            documentation={documentation}
            setDocumentation={handleSetDocumentation}
            settings={settings}
            setSettings={handleSetSettings}
            homepageConfig={homepageConfig}
            setHomepageConfig={handleSetHomepageConfig}
            onLogout={handleAdminLogout}
            onShowToast={triggerToast}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            settings={settings}
            onShowToast={triggerToast}
          />
        );
      default:
        return (
          <Home
            homepageConfig={homepageConfig}
            settings={settings}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  }, [
    currentPage,
    homepageConfig,
    settings,
    packages,
    unitPrices,
    terms,
    reviews,
    documentation,
    isAdminLoggedIn,
    totalCartCount,
    handleAddToCart,
    handleSetPackages,
    handleSetUnitPrices,
    handleSetTerms,
    handleSetReviews,
    handleSetDocumentation,
    handleSetSettings,
    handleSetHomepageConfig,
    handleAdminLoginSuccess,
    handleAdminLogout,
    triggerToast,
    isMigrationDone
  ]);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Loading state
  if (isInitialLoad && !isMigrationDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Memuat data dari Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f2f4f3] dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Dynamic Navigation */}
      {currentPage !== 'home' && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          settings={settings}
          cartCount={totalCartCount}
          onCartToggle={() => setIsCartOpen(!isCartOpen)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Main Core View Area Container */}
      <main className="flex-grow">
        {renderPageContent()}
      </main>

      {/* Dynamic Footer */}
      <Footer
        settings={settings}
        setCurrentPage={setCurrentPage}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Shopping Cart Sidebar Overlay Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        settings={settings}
      />

      {/* ================= TOAST ALERTS popup BANNER ================= */}
      {toast.show && (
        <div 
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xl flex items-center space-x-3 border border-zinc-800 dark:border-zinc-200 animate-bounce max-w-sm"
          id="global-toast-alert"
        >
          <div className="p-1 rounded bg-secondary text-zinc-950 shrink-0">
            <Bell className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight break-words">
            {toast.message}
          </span>
        </div>
      )}

      {/* ================= SCROLL TO TOP FLOATING TRIGGER ================= */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 p-3 bg-primary text-white hover:bg-primary/90 hover:scale-110 active:scale-95 rounded-full shadow-lg border border-emerald-850 cursor-pointer transition-all duration-300"
          title="Ke Atas"
          id="scroll-to-top-btn"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

    </div>
  );
}
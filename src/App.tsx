import React, { useState, useEffect } from 'react';
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

export default function App() {
  // ==========================================
  // CORE STATE ENGINE (LocalStorage Synchronized)
  // ==========================================
  const [packages, setPackages] = useState<RentalPackage[]>(() => {
    const local = localStorage.getItem('onesky_packages');
    return local ? JSON.parse(local) : INITIAL_PACKAGES;
  });

  const [unitPrices, setUnitPrices] = useState<UnitPriceItem[]>(() => {
    const local = localStorage.getItem('onesky_unit_prices');
    return local ? JSON.parse(local) : INITIAL_UNIT_PRICES;
  });

  const [terms, setTerms] = useState<TermItem[]>(() => {
    const local = localStorage.getItem('onesky_terms');
    return local ? JSON.parse(local) : INITIAL_TERMS;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const local = localStorage.getItem('onesky_reviews');
    return local ? JSON.parse(local) : INITIAL_REVIEWS;
  });

  const [documentation, setDocumentation] = useState<DocumentationItem[]>(() => {
    const local = localStorage.getItem('onesky_documentation');
    return local ? JSON.parse(local) : INITIAL_DOCUMENTATION;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const local = localStorage.getItem('onesky_settings');
    return local ? JSON.parse(local) : INITIAL_SETTINGS;
  });

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const local = localStorage.getItem('onesky_homepage');
    return local ? JSON.parse(local) : INITIAL_HOMEPAGE_CONFIG;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('onesky_cart');
    return local ? JSON.parse(local) : [];
  });

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

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const session = sessionStorage.getItem('onesky_admin_logged_in') || localStorage.getItem('onesky_admin_logged_in');
    return session === 'true';
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
  // PERSISTENCE SYNC ACTIONS
  // ==========================================
  useEffect(() => {
    localStorage.setItem('onesky_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('onesky_unit_prices', JSON.stringify(unitPrices));
  }, [unitPrices]);

  useEffect(() => {
    localStorage.setItem('onesky_terms', JSON.stringify(terms));
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

  // Dynamic CSS Variables Injection for Primary and Secondary colors (Forest green & Beige customization)
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
  // TOAST ALERTS CONTROLLER
  // ==========================================
  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // ==========================================
  // SHOPPING CART CONTROLLER FUNCTIONS
  // ==========================================
  const handleAddToCart = (pkgItem: RentalPackage) => {
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
  };

  const handleUpdateCartQuantity = (packageId: string, delta: number) => {
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
  };

  const handleRemoveFromCart = (packageId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.packageItem.id !== packageId));
    triggerToast('Item dihapus dari keranjang.');
  };

  const handleClearCart = () => {
    setCart([]);
    triggerToast('Keranjang belanja dikosongkan.');
  };

  // ==========================================
  // AUTHENTICATION LOGIC FLOW
  // ==========================================
  const handleAdminLoginSuccess = (rememberMe: boolean) => {
    setIsAdminLoggedIn(true);
    if (rememberMe) {
      localStorage.setItem('onesky_admin_logged_in', 'true');
    } else {
      sessionStorage.setItem('onesky_admin_logged_in', 'true');
    }
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('onesky_admin_logged_in');
    sessionStorage.removeItem('onesky_admin_logged_in');
    setCurrentPage('home');
  };

  // ==========================================
  // PAGINATION ROUTER SWITCH
  // ==========================================
  const renderPageContent = () => {
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
            onAddReview={(newRev) => setReviews((prev) => [...prev, newRev])}
            onUpdateReview={(upRev) => setReviews((prev) => prev.map((r) => (r.id === upRev.id ? upRev : r)))}
            onDeleteReview={(id) => setReviews((prev) => prev.filter((r) => r.id !== id))}
            onAddDoc={(newDoc) => setDocumentation((prev) => [...prev, newDoc])}
            onUpdateDoc={(upDoc) => setDocumentation((prev) => prev.map((d) => (d.id === upDoc.id ? upDoc : d)))}
            onDeleteDoc={(id) => setDocumentation((prev) => prev.filter((d) => d.id !== id))}
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
            setPackages={setPackages}
            unitPrices={unitPrices}
            setUnitPrices={setUnitPrices}
            terms={terms}
            setTerms={setTerms}
            reviews={reviews}
            setReviews={setReviews}
            documentation={documentation}
            setDocumentation={setDocumentation}
            settings={settings}
            setSettings={setSettings}
            homepageConfig={homepageConfig}
            setHomepageConfig={setHomepageConfig}
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
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-2xl flex items-center space-x-3 border border-zinc-800 dark:border-zinc-200 animate-bounce"
          id="global-toast-alert"
        >
          <div className="p-1 rounded bg-secondary text-zinc-950">
            <Bell className="h-4 w-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
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

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight, Search, ShoppingCart } from 'lucide-react';
import { HomepageConfig, SystemSettings } from '../types';
import { motion } from 'motion/react';
import heroBg from '../assets/images/BACKGROUND HERO.jpg';

interface HomeProps {
  homepageConfig: HomepageConfig;
  settings: SystemSettings;
  setCurrentPage: (page: string) => void;
  cartCount?: number;
  onCartToggle?: () => void;
  isAdminLoggedIn?: boolean;
}

export default function Home({ 
  homepageConfig, 
  settings, 
  setCurrentPage, 
  cartCount = 0, 
  onCartToggle, 
  isAdminLoggedIn 
}: HomeProps) {
  // ==========================================
  // STATE UNTUK SYNC DENGAN HOMEPAGE CONFIG
  // ==========================================
  const [currentConfig, setCurrentConfig] = useState(homepageConfig);

  // Update state ketika homepageConfig berubah dari props (Firestore real-time)
  useEffect(() => {
    console.log('🏠 Homepage config updated:', homepageConfig);
    setCurrentConfig(homepageConfig);
  }, [homepageConfig]);

  // Convert color to standard style
  const getStatusColorStyle = (hexColor: string) => {
    return {
      backgroundColor: `${hexColor}08`, // very subtle nature tint bg
      borderColor: `${hexColor}25`,
      color: hexColor,
    };
  };

  const getIndicatorDotStyle = (hexColor: string) => {
    return {
      backgroundColor: hexColor,
      boxShadow: `0 0 12px ${hexColor}`,
    };
  };

  // ==========================================
  // HERO BANNER BACKGROUND IMAGE
  // ==========================================
  const heroBgImage =
currentConfig.heroBgUrl || heroBg;

  return (
    <div className="space-y-24 pb-24 bg-[#faf9f6] dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-300 overflow-hidden" id="home-page">
      
      {/* Decorative background ambient blobs inspired by Behance Plant Shop */}
      <div className="absolute top-[110vh] left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[150vh] right-10 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/2 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= PREMIUM 100VH HERO SECTION ================= */}
      <div className="w-full min-h-screen p-4 sm:p-6 bg-[#faf9f6] dark:bg-zinc-950 flex flex-col justify-between" id="home-hero-section-wrapper">
        <section 
          className="relative h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] w-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden flex flex-col justify-between p-6 sm:p-12 text-white shadow-2xl bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('${heroBgImage}')` 
          }}
          id="home-hero-section"
        >
          {/* Dark Overlay (40-60%) */}
          <div className="absolute inset-0 bg-black/45 pointer-events-none z-0" />

          {/* 1. Floating Premium Navigation Bar */}
          <nav className="relative z-20 flex items-center justify-between w-full" id="floating-hero-nav">
            {/* Left Side: Logo & Links */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
                <div
  onClick={() => setCurrentPage('home')}
  className="cursor-pointer"
>
  <h1 className="text-white text-lg sm:text-xl lg:text-2xl font-extrabold tracking-[0.35em] uppercase select-none">
  ONESKY
  <span className="font-light ml-2">OUTDOOR</span>
</h1>
</div>
              {/* Nav Links - Desktop */}
<div className="hidden md:flex items-center space-x-2">
  <button
    onClick={() => setCurrentPage('home')}
    className="bg-white text-[#1b4332] rounded-full px-5 py-2 text-xs font-bold shadow-md cursor-pointer transition-all"
  >
    Beranda
  </button>

  <button
    onClick={() => {
      setCurrentPage('katalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    className="border border-white/20 hover:border-white text-white hover:bg-white/10 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer"
  >
    Rental
  </button>
</div>

              {/* Nav Links - Mobile */}
              <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 max-w-[120px] sm:max-w-[240px]">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="bg-white text-[#1b4332] rounded-full px-3 py-1 text-[10px] font-bold shadow-md cursor-pointer shrink-0"
                >
                  Beranda
                </button>
                <button 
                  onClick={() => setCurrentPage('katalog')}
                  className="border border-white/20 text-white rounded-full px-3 py-1 text-[10px] font-semibold cursor-pointer shrink-0"
                >
                  Rental
                </button>
              </div>
            </div>

            {/* Right Side: Search, Cart, Login */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 z-20">
              {/* Search button */}
              <button 
                onClick={() => {
                  setCurrentPage('katalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2 sm:p-2.5 rounded-full border border-white/20 hover:border-white text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Cari Perlengkapan"
              >
                <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>

              {/* Cart button */}
              <button 
                onClick={onCartToggle}
                className="relative p-2 sm:p-2.5 rounded-full border border-white/20 hover:border-white text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Keranjang Belanja"
              >
                <ShoppingCart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] sm:text-[9px] w-4 sm:w-4.5 h-4 sm:h-4.5 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Login button */}
              <button 
                onClick={() => setCurrentPage(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                className="border border-white/20 hover:border-white text-white hover:bg-white/10 rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                {isAdminLoggedIn ? 'Dashboard' : 'Login'}
              </button>
            </div>
          </nav>

<div className="relative z-10 flex-1 flex items-end justify-center">
  <div className="flex items-center space-x-3.5">

    {/* Large Pill CTA */}
    <button
      onClick={() => {
        setCurrentPage('katalog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="bg-white hover:bg-zinc-100 text-[#1b4332] font-black px-6 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-[1.04] flex items-center space-x-3 text-xs sm:text-sm tracking-widest uppercase"
    >
      <span>Lihat Perlengkapan</span>
      <ArrowRight className="h-4 w-4" />
    </button>

    {/* Scroll */}
    <button
      onClick={() => {
        const element = document.getElementById("home-status-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
    >
      <ChevronRight className="h-5 w-5 rotate-90" />
    </button>

  </div>
</div>

</section>
</div>

     {/* ================= INVENTORY STATUS SECTION (Premium glass cards) ================= */}
<section 
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
  id="home-status-section"
>
  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-gray-200/60 dark:border-zinc-800 shadow-sm relative overflow-hidden">

    {/* Ambient vector lights */}
    <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

    <div className="space-y-8">

      <h3 className="text-2xl sm:text-3xl font-bold text-[#1b4332]">
        Status Ketersediaan Perlengkapan
      </h3>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        id="availability-cards-grid"
      >

        {/* Ready Card */}
        <motion.div
          style={getStatusColorStyle(currentConfig.statusColors.readyColor)}
          className="p-5 rounded-2xl border flex flex-col justify-between h-36"
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase">
              Tersedia
            </span>

            <span
              style={getIndicatorDotStyle(currentConfig.statusColors.readyColor)}
              className="h-2.5 w-2.5 rounded-full animate-pulse"
            />
          </div>

          <div>
            <h4 className="text-base font-bold text-[#1b4332]">
              Ready
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              Stok lengkap di basecamp, siap dikemas.
            </p>
          </div>
        </motion.div>


        {/* Rented Card */}
        <motion.div
          style={getStatusColorStyle(currentConfig.statusColors.disewaColor)}
          className="p-5 rounded-2xl border flex flex-col justify-between h-36"
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase">
              Dipinjam
            </span>

            <span
              style={getIndicatorDotStyle(currentConfig.statusColors.disewaColor)}
              className="h-2.5 w-2.5 rounded-full animate-pulse"
            />
          </div>

          <div>
            <h4 className="text-base font-bold text-amber-700">
              Sedang Disewa
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              Sedang dibawa pelanggan.
            </p>
          </div>
        </motion.div>


        {/* Unavailable Card */}
        <motion.div
          style={getStatusColorStyle(currentConfig.statusColors.tidakTersediaColor)}
          className="p-5 rounded-2xl border flex flex-col justify-between h-36"
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase">
              Dipesan
            </span>

            <span
              style={getIndicatorDotStyle(currentConfig.statusColors.tidakTersediaColor)}
              className="h-2.5 w-2.5 rounded-full animate-pulse"
            />
          </div>

          <div>
            <h4 className="text-base font-bold text-red-700">
              Tidak Tersedia
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              Maintenance atau sedang tidak tersedia.
            </p>
          </div>
        </motion.div>

      </div>

    </div>

  </div>
</section>

</div>
);
}

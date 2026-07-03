import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Mountain, Star, Shield, ArrowRight, Search, ShoppingCart } from 'lucide-react';
import { HomepageConfig, SystemSettings } from '../types';
import { motion } from 'motion/react';

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

  return (
    <div className="space-y-24 pb-24 bg-[#faf9f6] dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-300 overflow-hidden" id="home-page">
      
      {/* Decorative background ambient blobs inspired by Behance Plant Shop */}
      <div className="absolute top-[110vh] left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[150vh] right-10 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/2 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= PREMIUM 100VH HERO SECTION (Bloomm / Everleaf Luxury Aesthetic) ================= */}
      <div className="w-full min-h-screen p-4 sm:p-6 bg-[#faf9f6] dark:bg-zinc-950 flex flex-col justify-between" id="home-hero-section-wrapper">
        <section 
          className="relative h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] w-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden flex flex-col justify-between p-6 sm:p-12 text-white shadow-2xl bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=85')` 
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
                className="flex items-center space-x-2.5 cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-white text-[#1b4332] shadow-md transition-transform group-hover:scale-105 duration-300">
                  <Mountain className="h-5 w-5" />
                </div>
                <span className="font-sans font-black text-lg tracking-tight text-white">
                  OneSky <span className="font-light text-white/85">Outdoor</span>
                </span>
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
                <button 
                  onClick={() => {
                    setCurrentPage('katalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="border border-white/20 hover:border-white text-white hover:bg-white/10 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer"
                >
                  Categories
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('home-features-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border border-white/20 hover:border-white text-white hover:bg-white/10 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer"
                >
                  About
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('app-footer');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border border-white/20 hover:border-white text-white hover:bg-white/10 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer"
                >
                  Contact
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

          {/* 2. Immersive Main Hero Typography Content */}
          <div className="relative z-10 my-auto text-left space-y-4 max-w-4xl" id="hero-main-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-0.5 sm:space-y-1"
            >
              {/* Small label */}
              <span className="block text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.35em] text-white/90">
                OneSky Outdoor
              </span>
              
              {/* Main Headline */}
              <h1 className="text-[62px] sm:text-[110px] md:text-[145px] lg:text-[170px] xl:text-[185px] font-black tracking-tighter uppercase leading-[0.8] text-white select-none">
                Adventure
              </h1>
            </motion.div>

            {/* Description & Detail */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-white/80 max-w-md font-medium leading-relaxed"
            >
              Rent premium camping, hiking, and outdoor equipment for unforgettable adventures. Clean, complete, and ready for every journey.
            </motion.p>
          </div>

          {/* 3. Bottom Area: Frosted Glass Card & Actions */}
          <div className="relative z-10 flex flex-col sm:flex-row items-end justify-between gap-6 w-full pt-6 border-t border-white/10" id="hero-bottom-area">
            {/* Left: Frosted Glass Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.8rem] p-5 sm:p-6 text-white max-w-xs shadow-2xl space-y-2.5"
            >
              <div className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">100+ Equipment</div>
              <p className="text-[11px] sm:text-xs text-white/80 font-semibold leading-relaxed">
                Camping, Hiking, Cooking Gear, Backpacks, Tents, and more.
              </p>
            </motion.div>

            {/* Right: CTA Button & Scroll Indicator */}
            <div className="flex items-center space-x-3.5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
              {/* Large Pill CTA */}
              <button
                onClick={() => {
                  setCurrentPage('katalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white hover:bg-zinc-100 text-[#1b4332] font-black px-6 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-2xl hover:shadow-white/15 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center space-x-3 text-xs sm:text-sm tracking-widest uppercase cursor-pointer"
              >
                <span>Explore Equipment</span>
                <ArrowRight className="h-4 w-4 text-[#1b4332]" />
              </button>

              {/* Circular Scroll Button */}
              <button
                onClick={() => {
                  const element = document.getElementById('home-features-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="p-3.5 sm:p-4 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center shrink-0"
                title="Scroll Down"
              >
                <ChevronRight className="h-5 w-5 rotate-90" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ================= WHY CHOOSE US SECTION (Elegant Bento Grid Style) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-features-section">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1b4332]/5 text-[#1b4332] dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
            <span>Standar Layanan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#1b4332] dark:text-white tracking-tight">
            Komitmen Pelayanan Terbaik
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Kami menjaga seluruh ekosistem peralatan camping agar tetap bersih, steril, aman, dan mudah Anda gunakan kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageConfig.features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="group p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200/50 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              id={`feature-card-${index}`}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Soft decorative visual blob behind icons on hover */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="h-10 w-10 rounded-xl bg-[#1b4332]/5 text-[#1b4332] dark:bg-zinc-800 dark:text-zinc-200 flex items-center justify-center mb-4 group-hover:bg-[#1b4332] group-hover:text-white transition-all duration-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= INVENTORY STATUS SECTION (Premium glass cards) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-status-section">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-gray-200/60 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          {/* Ambient vector lights */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left intro copy */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-zinc-800 text-emerald-800 dark:text-secondary text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Sistem Stok Realtime</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#1b4332] dark:text-white tracking-tight leading-tight">
                Status Ketersediaan Perlengkapan
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                Kami berkomitmen menjaga transparansi informasi ketersediaan barang. Perhatikan tanda warna berikut saat Anda merencanakan pemesanan.
              </p>
            </div>

            {/* Right 3 status cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6" id="availability-cards-grid">
              {/* Ready Card */}
              <motion.div
                style={getStatusColorStyle(homepageConfig.statusColors.readyColor)}
                className="p-5 rounded-2xl border flex flex-col justify-between h-36 transition-transform hover:scale-[1.02] duration-300"
                id="status-card-ready"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">Tersedia</span>
                  <span 
                    style={getIndicatorDotStyle(homepageConfig.statusColors.readyColor)}
                    className="h-2.5 w-2.5 rounded-full border border-white/40 animate-pulse"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold font-sans text-[#1b4332] dark:text-white">Ready</h4>
                  <p className="text-[10px] sm:text-xs opacity-75 mt-1 leading-normal font-medium text-gray-500 dark:text-zinc-400">
                    Stok lengkap di basecamp, siap dikemas dan diambil langsung.
                  </p>
                </div>
              </motion.div>

              {/* Rented Card */}
              <motion.div
                style={getStatusColorStyle(homepageConfig.statusColors.disewaColor)}
                className="p-5 rounded-2xl border flex flex-col justify-between h-36 transition-transform hover:scale-[1.02] duration-300"
                id="status-card-rented"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">Dipinjam</span>
                  <span 
                    style={getIndicatorDotStyle(homepageConfig.statusColors.disewaColor)}
                    className="h-2.5 w-2.5 rounded-full border border-white/40 animate-pulse"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold font-sans text-amber-700 dark:text-amber-500">Sedang Disewa</h4>
                  <p className="text-[10px] sm:text-xs opacity-75 mt-1 leading-normal font-medium text-gray-500 dark:text-zinc-400">
                    Sedang dibawa berpetualang. Hubungi admin untuk jadwal kembali.
                  </p>
                </div>
              </motion.div>

              {/* Unavailable Card */}
              <motion.div
                style={getStatusColorStyle(homepageConfig.statusColors.tidakTersediaColor)}
                className="p-5 rounded-2xl border flex flex-col justify-between h-36 transition-transform hover:scale-[1.02] duration-300"
                id="status-card-unavailable"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">Dipesan</span>
                  <span 
                    style={getIndicatorDotStyle(homepageConfig.statusColors.tidakTersediaColor)}
                    className="h-2.5 w-2.5 rounded-full border border-white/40 animate-pulse"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold font-sans text-red-700 dark:text-red-400">Tidak Tersedia</h4>
                  <p className="text-[10px] sm:text-xs opacity-75 mt-1 leading-normal font-medium text-gray-500 dark:text-zinc-400">
                    Sedang maintenance/dibersihkan demi menjaga kualitas maksimal.
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

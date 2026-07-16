import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ArrowRight,
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { HomepageConfig, SystemSettings } from '../types';
import { motion } from 'motion/react';
import heroBg from '../assets/images/BG HERO.jpg';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div
      className="relative overflow-x-hidden space-y-24 pb-24 bg-[#faf9f6] dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-300"
      id="home-page"
    >

      {/* Decorative background ambient blobs inspired by Behance Plant Shop */}
      <div className="absolute top-[110vh] left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[150vh] right-10 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/2 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= PREMIUM 100VH HERO SECTION ================= */}
      <div
        className="w-full p-4 sm:p-6 bg-[#faf9f6] dark:bg-zinc-950"
        id="home-hero-section-wrapper"
      >
        <section
          className="relative min-h-screen flex flex-col overflow-hidden rounded-[40px]"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark Overlay (40-60%) */}
          <div className="absolute inset-0 bg-black/45 pointer-events-none z-0" />

          {/* Premium Navigation Bar */}
          <nav
            className="
    fixed top-5 left-1/2 -translate-x-1/2 z-50
    w-[calc(100%-32px)] max-w-7xl
    flex items-center justify-between
    px-5 sm:px-8 py-3
    rounded-full

    bg-white/10
    backdrop-blur-2xl
    backdrop-saturate-150
    border border-white/20
    shadow-[0_8px_32px_rgba(0,0,0,0.25)]
overflow-hidden
  "
          >


            {/* Glass Reflection */}
            <div
              className="
      absolute inset-0
      rounded-full
      bg-gradient-to-b
      from-white/20
      via-white/5
      to-transparent
      pointer-events-none
    "
            />

            <div className="
  relative z-10
  flex items-center justify-between w-full
">

              {/* LEFT */}
              <div className="flex items-center gap-6">

                {/* Logo */}
                <div
                  onClick={() => setCurrentPage("home")}
                  className="cursor-pointer"
                >
                  <h1 className="
          text-white text-base sm:text-xl lg:text-2xl
          font-extrabold tracking-[0.18em]
          uppercase
        ">
                    ONESKY
                    <span className="font-light ml-2">
                      OUTDOOR
                    </span>
                  </h1>
                </div>


                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-2">

                  <button
                    onClick={() => setCurrentPage("home")}
                    className="
            bg-white text-[#1b4332]
            rounded-full px-5 py-2
            text-xs font-bold
          "
                  >
                    Beranda
                  </button>


                  <button
                    onClick={() => setCurrentPage("katalog")}
                    className="
bg-white/10
backdrop-blur-lg
border border-white/30
text-white
rounded-full px-5 py-2
text-xs
shadow-lg
"
                  >
                    Rental
                  </button>

                </div>

              </div>


              {/* RIGHT */}
              <div className="hidden md:flex items-center gap-4">

                <button
                  onClick={() => {
                    setCurrentPage("katalog");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }}
                  className="
          p-2 rounded-full
bg-white/10
backdrop-blur-lg
border border-white/30
text-white
shadow-lg
hover:bg-white/20
transition
        "
                >
                  <Search className="w-4 h-4" />
                </button>


                <button
                  onClick={onCartToggle}
                  className="
          p-2 rounded-full
bg-white/10
backdrop-blur-lg
border border-white/30
text-white
shadow-lg
hover:bg-white/20
transition
        "
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>


                <button
                  onClick={() =>
                    setCurrentPage(
                      isAdminLoggedIn
                        ? "admin-dashboard"
                        : "admin-login"
                    )
                  }
                  className="
          border border-white/20
          rounded-full px-6 py-2.5
          text-white text-xs font-semibold
        "
                >
                  {isAdminLoggedIn
                    ? "Dashboard"
                    : "Login"
                  }
                </button>


              </div>


              {/* Mobile */}
              <div className="flex md:hidden items-center gap-2">

                <button
                  onClick={() => setCurrentPage("katalog")}
                  className="
          p-2 rounded-full
          border border-white/20
          text-white
        "
                >
                  <Search className="w-5 h-5" />
                </button>


                <button
                  onClick={onCartToggle}
                  className="
          relative p-2 rounded-full
          border border-white/20
          text-white
        "
                >
                  <ShoppingCart className="w-5 h-5" />

                  {cartCount > 0 && (
                    <span className="
            absolute -top-1 -right-1
            bg-amber-500
            text-[9px]
            w-4 h-4
            rounded-full
            flex items-center justify-center
            text-white font-bold
          ">
                      {cartCount}
                    </span>
                  )}

                </button>


                <button
                  onClick={() =>
                    setMobileMenuOpen(!mobileMenuOpen)
                  }
                  className="
p-2 rounded-full
border border-white/20
bg-white/10
backdrop-blur-xl
shadow-lg
text-white
"

                >
                  {mobileMenuOpen
                    ? <X size={22} />
                    : <Menu size={22} />
                  }
                </button>

              </div>


            </div>

          </nav>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="
absolute top-20 left-4 right-4
md:hidden
bg-white/10
backdrop-blur-2xl
backdrop-saturate-150
rounded-3xl
border border-white/20
shadow-[0_20px_60px_rgba(0,0,0,0.35)]
p-4
z-50
"
            >
              <button
                onClick={() => {
                  setCurrentPage("home");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-white border-b border-white/10"
              >
                Beranda
              </button>

              <button
                onClick={() => {
                  setCurrentPage("katalog");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-white border-b border-white/10"
              >
                Rental
              </button>

              <button
                onClick={() => {
                  setCurrentPage(
                    isAdminLoggedIn ? "admin-dashboard" : "admin-login"
                  );
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-white"
              >
                {isAdminLoggedIn ? "Dashboard" : "Login"}
              </button>
            </motion.div>
          )}

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">

  <h1
    className="
      text-5xl
      sm:text-6xl
      lg:text-7xl
      xl:text-8xl
      font-black
      leading-[0.95]
      tracking-tight
      text-white
      drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)]
      mb-12
      max-w-5xl
    "
  >
    PENYEWAAN GEAR OUTDOOR 
    <br />
    <span className="text-white/90">
      CAMPING & HIKING
    </span>
  </h1>

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
        <div
          className="
bg-white/60
dark:bg-zinc-900/50
backdrop-blur-2xl
backdrop-saturate-150
rounded-3xl
p-8 sm:p-12
border border-white/30
dark:border-white/10
shadow-[0_20px_60px_rgba(0,0,0,0.08)]
relative
overflow-hidden
"
        >

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
                className="
p-5
rounded-2xl
border
bg-white/20
dark:bg-white/5
backdrop-blur-xl
shadow-lg
flex flex-col justify-between
h-36
"
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
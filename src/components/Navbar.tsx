import React, { useState } from 'react';
import { Menu, X, ShoppingCart, ShieldAlert, Sun, Moon } from 'lucide-react';
import { SystemSettings } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  settings: SystemSettings;
  cartCount: number;
  onCartToggle: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isAdminLoggedIn: boolean;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  settings,
  cartCount,
  onCartToggle,
  isDarkMode,
  setIsDarkMode,
  isAdminLoggedIn,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'katalog', label: 'Katalog Paket' },
    { id: 'harga', label: 'Harga Satuan' },
    { id: 'syarat', label: 'Syarat & Ketentuan' },
    { id: 'ulasan', label: 'Ulasan & Galeri' },
    { id: 'lokasi', label: 'Lokasi' },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 w-full transition-all duration-300 bg-[#faf9f6]/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-zinc-800/50 shadow-sm text-gray-800 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
            id="nav-logo-container"
          >
            <span className="font-sans font-bold text-lg tracking-tight text-[#1b4332] dark:text-white group-hover:opacity-90 transition-opacity">
              Onesky <span className="font-light text-emerald-700 dark:text-zinc-300">Outdoor</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2" id="nav-desktop-links">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
  currentPage === item.id
    ? 'text-[#EAB308] font-bold'
    : 'text-gray-600 dark:text-zinc-400 hover:text-[#EAB308]'
}`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Icons (Cart, Admin, Hamburger) */}
          <div className="flex items-center space-x-2 sm:space-x-3" id="nav-actions">
            {/* Shopping Cart Trigger */}
            <button
              onClick={onCartToggle}
              className="relative p-2 rounded-full text-gray-600 hover:text-[#1b4332] dark:text-zinc-400 dark:hover:text-white hover:bg-[#1b4332]/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
              title="Keranjang Belanja"
              id="cart-toggle-btn"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-[9px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Area Link */}
            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center space-x-1.5 border cursor-pointer ${
                currentPage.startsWith('admin')
                  ? 'bg-[#1b4332] text-white border-[#1b4332] dark:bg-white dark:text-[#1b4332] dark:border-white font-bold shadow-sm'
                  : 'bg-[#1b4332]/5 text-[#1b4332] border-[#1b4332]/10 hover:bg-[#1b4332]/10 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20'
              }`}
              title={isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
              id="admin-nav-btn"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{isAdminLoggedIn ? 'Admin Console' : 'Admin Login'}</span>
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-gray-600 dark:text-zinc-400 hover:bg-[#1b4332]/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              id="mobile-menu-toggle-btn"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200/50 dark:border-zinc-800/50 bg-[#faf9f6]/95 dark:bg-zinc-900/95 backdrop-blur-lg shadow-lg animate-page-transition" id="mobile-menu-drawer">
          <div className="px-3 pt-2 pb-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  currentPage === item.id
                    ? 'text-white bg-[#1b4332] font-bold dark:bg-white dark:text-[#1b4332]'
                    : 'text-gray-600 hover:text-[#1b4332] hover:bg-[#1b4332]/5 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/50'
                }`}
                id={`mobile-nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

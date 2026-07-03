import React from 'react';
import { Mountain, Phone, ShieldAlert, MessageSquare, MapPin } from 'lucide-react';
import { SystemSettings } from '../types';

interface FooterProps {
  settings: SystemSettings;
  setCurrentPage: (page: string) => void;
  isAdminLoggedIn: boolean;
}

export default function Footer({ settings, setCurrentPage, isAdminLoggedIn }: FooterProps) {
  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900" id="app-footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-4" id="footer-brand-col">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2.5 cursor-pointer text-white hover:opacity-90 duration-300"
            >
              <div className="p-2 rounded-xl bg-[#1b4332] text-white">
                <Mountain className="h-5 w-5" />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight">
                {settings.websiteName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium">
              Penyedia layanan rental alat outdoor dan camping premium terbaik di Bululawang. Bersih, lengkap, terjangkau, dan siap menemani perjalanan serumu ke alam bebas.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4" id="footer-links-col">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">Navigasi</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {[
                { id: 'home', label: 'Beranda' },
                { id: 'katalog', label: 'Katalog Paket' },
                { id: 'harga', label: 'Harga Satuan' },
                { id: 'syarat', label: 'Syarat & Ketentuan' },
                { id: 'ulasan', label: 'Ulasan & Dokumentasi' },
                { id: 'lokasi', label: 'Lokasi Basecamp' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left block"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 lg:col-span-3" id="footer-contact-col">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">Kontak Kami</h3>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-[#2d5a47] shrink-0 mt-0.5" />
                <span className="text-zinc-500">Bululawang, Malang, Jawa Timur</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-[#2d5a47] shrink-0" />
                <span className="text-zinc-500">{settings.contactNumber}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MessageSquare className="h-4 w-4 text-[#2d5a47] shrink-0" />
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors text-zinc-500"
                >
                  WhatsApp Fast Response
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Fast Link */}
          <div className="space-y-4 lg:col-span-3" id="footer-admin-col">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">Akses Pengelola</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Khusus pengelola basecamp OneSky Outdoor untuk mengaktifkan ketersediaan stok, ulasan pelanggan, dan konfigurasi sistem.
            </p>
            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>{isAdminLoggedIn ? 'Menuju Dashboard Admin' : 'Login Administrator'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 pt-8 border-t border-zinc-900 text-center text-[11px] text-zinc-600 font-medium" id="footer-bottom-bar">
          <p>{settings.footerText}</p>
          <p className="mt-2 text-zinc-700">Built with React, Vite & Tailwind CSS v4</p>
        </div>
      </div>
    </footer>
  );
}

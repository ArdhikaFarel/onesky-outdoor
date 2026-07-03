import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Eye, AlertCircle, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { RentalPackage, StatusColors, ItemStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface KatalogProps {
  packages: RentalPackage[];
  statusColors: StatusColors;
  onAddToCart: (pkg: RentalPackage) => void;
  onShowToast: (message: string) => void;
}

export default function Katalog({
  packages,
  statusColors,
  onAddToCart,
  onShowToast,
}: KatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPackage, setSelectedPackage] = useState<RentalPackage | null>(null);

  // Filter packages based on search query and status filter
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.items.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: ItemStatus) => {
    let hexColor = '#9e9e9e'; // default gray
    if (status === 'Ready') hexColor = statusColors.readyColor;
    else if (status === 'Disewa') hexColor = statusColors.disewaColor;
    else if (status === 'Tidak Tersedia') hexColor = statusColors.tidakTersediaColor;

    return {
      backgroundColor: `${hexColor}15`,
      borderColor: `${hexColor}40`,
      color: hexColor,
    };
  };

  const getStatusDotStyle = (status: ItemStatus) => {
    let hexColor = '#9e9e9e';
    if (status === 'Ready') hexColor = statusColors.readyColor;
    else if (status === 'Disewa') hexColor = statusColors.disewaColor;
    else if (status === 'Tidak Tersedia') hexColor = statusColors.tidakTersediaColor;

    return {
      backgroundColor: hexColor,
      boxShadow: `0 0 8px ${hexColor}`,
    };
  };

  // Render cards adhering to specific instructions if default 10 packages are used with no filter/search active
  const isDefaultLayoutRequired =
    searchQuery === '' && statusFilter === 'All' && filteredPackages.length === 10;

  const renderCard = (pkg: RentalPackage, index: number) => (
    <motion.div
      key={pkg.id}
      className="flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-sm hover:shadow-xl transition-all duration-500 relative group p-4"
      id={`pkg-card-${pkg.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 dark:bg-zinc-800 shrink-0 rounded-2xl mb-4">
        <img
          src={pkg.imageUrl}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Status Badge */}
        <span
          style={getStatusBadgeStyle(pkg.status)}
          className="absolute top-3 right-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md"
        >
          <span 
            className="h-1.5 w-1.5 rounded-full"
            style={getStatusDotStyle(pkg.status)}
          />
          <span>{pkg.status}</span>
        </span>
      </div>

      {/* Product Body */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Package Items Pill */}
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] font-bold tracking-wider uppercase bg-[#1b4332]/5 text-[#1b4332] dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full">
              {pkg.items.length} Barang Pilihan
            </span>
          </div>

          <h3 className="font-sans font-bold text-base text-gray-900 dark:text-white group-hover:text-[#1b4332] dark:group-hover:text-amber-500 transition-colors">
            {pkg.name}
          </h3>

          <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium line-clamp-1">
            Include: {pkg.items.join(', ')}
          </p>

          <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        <div className="space-y-3 pt-3.5 border-t border-gray-100 dark:border-zinc-800/80 mt-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Harga Sewa</span>
            <span className="text-base font-sans font-extrabold text-[#1b4332] dark:text-white">
              Rp {pkg.price}K <span className="text-[10px] font-normal text-gray-400 dark:text-zinc-500 lowercase">/ 24 jam</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={() => setSelectedPackage(pkg)}
              className="py-2.5 px-3 border border-gray-200 dark:border-zinc-800 hover:bg-[#1b4332]/5 dark:hover:bg-white/5 text-gray-600 dark:text-zinc-300 rounded-full text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              id={`detail-btn-${pkg.id}`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Detail</span>
            </button>

            <button
              onClick={() => {
                onAddToCart(pkg);
                onShowToast(`Berhasil menambahkan ${pkg.name} ke keranjang!`);
              }}
              disabled={pkg.status === 'Tidak Tersedia'}
              className={`py-2.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                pkg.status === 'Tidak Tersedia'
                  ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                  : 'bg-[#1b4332] hover:bg-[#2d5a47] dark:bg-white dark:text-[#1b4332] dark:hover:bg-zinc-100 text-white hover:shadow-md'
              }`}
              id={`add-to-cart-btn-${pkg.id}`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Sewa</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#faf9f6] dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-300 overflow-hidden min-h-screen" id="katalog-page">
      
      {/* Title Header (Inspired by Behance Plant Shop Minimal Header) */}
      <div className="text-center space-y-3 max-w-2xl mx-auto" id="katalog-header">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1b4332]/5 text-[#1b4332] dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>Katalog Paket</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#1b4332] dark:text-white tracking-tight">
          Paket Hemat Siap Petualang
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
          Pilih paket bundling lengkap sesuai kebutuhan Anda. Praktis, steril, wangi, dan pas di kantong untuk kebersamaan yang tak terlupakan.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 rounded-3xl shadow-sm max-w-5xl mx-auto" id="katalog-toolbar">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama paket atau isi alat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#faf9f6] dark:bg-zinc-800/40 border border-gray-200/50 dark:border-zinc-800 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]/10 focus:border-[#1b4332] text-gray-800 dark:text-white"
            id="katalog-search-input"
          />
        </div>

        {/* Status Filter Tab Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none" id="katalog-filters-tabs">
          <div className="text-xs text-gray-400 dark:text-zinc-500 font-bold flex items-center space-x-1 shrink-0 px-2">
            <Filter className="h-3 w-3" />
            <span>Filter:</span>
          </div>
          {['All', 'Ready', 'Disewa', 'Tidak Tersedia'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all cursor-pointer shrink-0 ${
                statusFilter === status
                  ? 'bg-[#1b4332] text-white dark:bg-white dark:text-[#1b4332] shadow-sm'
                  : 'bg-gray-50 dark:bg-zinc-800/40 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              {status === 'All' ? 'Semua Paket' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid View */}
      {filteredPackages.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 rounded-3xl space-y-4 max-w-lg mx-auto" 
          id="katalog-empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="font-sans font-bold text-gray-800 dark:text-zinc-300 text-base">Paket Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Maaf, pencarian "{searchQuery}" dengan filter yang dipilih tidak memiliki hasil cocok. Silakan coba kata kunci lain.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
            className="px-5 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-full transition-all cursor-pointer"
          >
            Reset Filter & Cari
          </button>
        </motion.div>
      ) : isDefaultLayoutRequired ? (
        /* Enforce exact grid layout requirement for 10 packages: 
           Desktop: Row 1 = 4 Cards, Row 2 = 4 Cards, Row 3 = 2 Cards centered. */
          <div className="space-y-6" id="packages-grid-default">
            {/* Row 1 & Row 2: First 8 items in a 4-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPackages.slice(0, 8).map((pkg, idx) => renderCard(pkg, idx))}
            </div>
            {/* Row 3: Centered 2 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-2">
              {filteredPackages.slice(8, 10).map((pkg, idx) => renderCard(pkg, idx + 8))}
            </div>
          </div>
      ) : (
        /* Dynamic Grid Layout fallback when admin changes list size or filters are active */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="packages-grid-dynamic">
          {filteredPackages.map((pkg, idx) => renderCard(pkg, idx))}
        </div>
      )}

      {/* Detail Modal Component with High Quality Styling */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md" id="detail-modal-container">
            <motion.div 
              className="absolute inset-0 cursor-pointer bg-transparent" 
              onClick={() => setSelectedPackage(null)} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div 
              className="relative bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-150 dark:border-zinc-800 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Close Button top-right for mobile */}
              <button 
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/85 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200/50 hover:bg-gray-100 cursor-pointer shadow-sm md:hidden"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Modal Image */}
              <div className="relative md:w-1/2 h-56 md:h-auto overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                <img
                  src={selectedPackage.imageUrl}
                  alt={selectedPackage.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span
                  style={getStatusBadgeStyle(selectedPackage.status)}
                  className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md"
                >
                  <span className="h-2 w-2 rounded-full animate-pulse" style={getStatusDotStyle(selectedPackage.status)} />
                  <span>{selectedPackage.status}</span>
                </span>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-sans font-bold text-gray-900 dark:text-white tracking-tight">
                      {selectedPackage.name}
                    </h2>
                    <div className="text-lg font-sans font-extrabold text-[#1b4332] dark:text-zinc-100">
                      Rp {selectedPackage.price}K <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">{selectedPackage.priceUnit || '/ Paket'}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Peralatan Terpilih:</h4>
                    <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-zinc-300">
                      {selectedPackage.items.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2.5">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Deskripsi Paket:</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                      {selectedPackage.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-5 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="flex-1 py-3 px-4 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 rounded-full text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-center cursor-pointer"
                    id="close-modal-btn"
                  >
                    Kembali
                  </button>
                  
                  <button
                    onClick={() => {
                      onAddToCart(selectedPackage);
                      onShowToast(`Berhasil menambahkan ${selectedPackage.name} ke keranjang!`);
                      setSelectedPackage(null);
                    }}
                    disabled={selectedPackage.status === 'Tidak Tersedia'}
                    className={`flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all shadow-sm text-center cursor-pointer ${
                      selectedPackage.status === 'Tidak Tersedia'
                        ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                        : 'bg-[#1b4332] hover:bg-[#2d5a47] text-white hover:shadow-md'
                    }`}
                    id="modal-add-to-cart-btn"
                  >
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';
import { UnitPriceItem, RentalPackage } from '../types';
import { Info, Sparkles, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

interface HargaSatuanProps {
  unitPrices: UnitPriceItem[];
  onAddToCart: (pkgItem: RentalPackage) => void;
  onShowToast: (message: string) => void;
}

export default function HargaSatuan({ unitPrices, onAddToCart, onShowToast }: HargaSatuanProps) {
  // Sorting items by index to keep them in order
  const sortedPrices = [...unitPrices].sort((a, b) => a.index - b.index);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#faf9f6] dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-300 min-h-screen" id="harga-satuan-page">
      
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto" id="harga-header">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1b4332]/5 text-[#1b4332] dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>Eceran / Satuan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#1b4332] dark:text-white tracking-tight">
          Daftar Harga Satuan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
          Butuh perlengkapan tambahan di luar paket? Kami menyediakan sewa eceran per 24 jam dengan harga transparan di bawah ini.
        </p>
      </div>

      {/* Styled Numbered List in Dual Columns for High-Density Layout */}
      <motion.div 
        className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-[2rem] p-6 sm:p-8 shadow-sm" 
        id="harga-list-container"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
          {sortedPrices.map((item, idx) => (
            <motion.div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-xs sm:text-sm group hover:bg-gray-50/60 dark:hover:bg-zinc-800/30 px-3 rounded-xl transition-all duration-200 border-b border-gray-100/50 dark:border-zinc-800/40 gap-2"
              id={`price-row-${item.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                {/* Monospace elegant item numbering */}
                <span className="font-mono text-xs text-[#1b4332] dark:text-zinc-400 font-bold w-6 shrink-0">
                  {String(item.index).padStart(2, '0')}.
                </span>
                <span className="text-gray-800 dark:text-zinc-200 font-sans tracking-tight font-semibold truncate group-hover:text-[#1b4332] dark:group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 shrink-0">
                {/* Monospace Price display */}
                <div className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  Rp {item.price}K <span className="text-[9px] font-normal text-gray-400 dark:text-zinc-500 uppercase tracking-wider ml-1">/ 24h</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    const pkgItem: RentalPackage = {
                      id: `unit-${item.id}`,
                      name: item.name,
                      description: 'Item Eceran / Satuan',
                      items: [item.name],
                      price: item.price,
                      priceUnit: '/ 24 Jam',
                      status: 'Ready',
                      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
                    };
                    onAddToCart(pkgItem);
                    onShowToast(`Berhasil ditambahkan ke keranjang.`);
                  }}
                  className="p-2 bg-[#1b4332] hover:bg-[#2d5a47] dark:bg-white dark:text-[#1b4332] dark:hover:bg-zinc-100 text-white rounded-full text-[10px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95 hover:scale-[1.05]"
                  id={`add-unit-to-cart-btn-${item.id}`}
                  title="Tambah ke Keranjang"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-bold">Sewa</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer Info Notice */}
      <div className="p-5 bg-white dark:bg-zinc-900/60 border border-gray-150 dark:border-zinc-800 rounded-3xl flex items-start space-x-3 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto shadow-sm" id="harga-info-banner">
        <Info className="h-5 w-5 text-[#1b4332] dark:text-zinc-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium text-xs sm:text-sm">
          <strong className="text-gray-700 dark:text-zinc-300">Catatan Sewa Satuan:</strong> Seluruh item eceran di atas dapat dipesan dengan cara memasukkannya langsung ke keranjang belanja Anda di halaman ini, atau menghubungi admin secara langsung di WA.
        </p>
      </div>

    </div>
  );
}

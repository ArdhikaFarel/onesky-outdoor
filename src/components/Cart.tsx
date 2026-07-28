import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Send } from 'lucide-react';
import { CartItem, SystemSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (packageId: string, delta: number) => void;
  onRemoveItem: (packageId: string) => void;
  onClearCart: () => void;
  settings: SystemSettings;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
}: CartProps) {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.packageItem.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `Halo OneSky Outdoor, saya ingin melakukan penyewaan berikut:\n\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. *${item.packageItem.name}*\n`;
      message += `   Jumlah: ${item.quantity} unit/paket\n`;
      message += `   Harga: Rp ${item.packageItem.price}K / 24 Jam\n`;
      message += `   Isi Paket: ${item.packageItem.items.join(', ')}\n`;
      message += `   Subtotal: Rp ${item.packageItem.price * item.quantity}K\n\n`;
    });

    message += `*Total Estimasi Sewa:* Rp ${totalPrice}K\n\n`;
    message += `Apakah barang di atas tersedia untuk disewa? Mohon info kelanjutannya. Terima kasih!`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-sidebar-container">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-md transition-opacity duration-500 cursor-pointer"
        onClick={onClose}
        id="cart-backdrop"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div 
          className="w-screen max-w-md bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-2xl flex flex-col h-full rounded-l-[2rem] border-l border-white/20 overflow-hidden"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {/* Header */}
          <div className="px-6 py-5 bg-yellow-300/10 backdrop-blur-lg border-b border-yellow-200/20 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-sans font-bold tracking-tight">Keranjang Sewa Anda</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              id="close-cart-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="cart-items-list">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="p-4 rounded-full bg-gray-50 dark:bg-zinc-900 text-gray-300 dark:text-zinc-700">
                  <ShoppingBag className="h-12 w-12" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-gray-800 dark:text-zinc-200">Keranjang Masih Kosong</h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 max-w-xs leading-relaxed font-medium">
                    Anda belum memasukkan peralatan camping atau paket hemat apa pun ke keranjang sewa.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#1b4332] hover:bg-[#2d5a47] dark:bg-white dark:text-[#1b4332] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Jelajahi Katalog Paket
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.packageItem.id} 
                    className="flex space-x-4 p-3.5 bg-white dark:bg-zinc-900/60 rounded-2xl border border-gray-150 dark:border-zinc-900/80 relative group transition-all"
                    id={`cart-item-card-${item.packageItem.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                   {item.packageItem.type === "package" && (
  <img
    src={item.packageItem.imageUrl}
    alt={item.packageItem.name}
    className="w-16 h-16 object-cover rounded-xl shrink-0 border border-gray-100 dark:border-zinc-850"
  />
)}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-gray-800 dark:text-white truncate">
                          {item.packageItem.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate mt-0.5 font-medium">
                          {item.packageItem.items.join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-[#1b4332] dark:text-zinc-100 font-extrabold text-xs sm:text-sm">
                          Rp {item.packageItem.price * item.quantity}K
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 bg-[#faf9f6] dark:bg-zinc-800 px-2 py-1 rounded-full border border-gray-150 dark:border-zinc-700/50">
                          <button
                            onClick={() => onUpdateQuantity(item.packageItem.id, -1)}
                            className="p-1 rounded-full bg-white dark:bg-zinc-700 hover:bg-gray-100 text-gray-600 dark:text-zinc-300 transition-all cursor-pointer shadow-xs"
                            id={`minus-qty-${item.packageItem.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.packageItem.id, 1)}
                            className="p-1 rounded-full bg-white dark:bg-zinc-700 hover:bg-gray-100 text-gray-600 dark:text-zinc-300 transition-all cursor-pointer shadow-xs"
                            id={`plus-qty-${item.packageItem.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.packageItem.id)}
                      className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      title="Hapus"
                      id={`remove-item-${item.packageItem.id}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer controls */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200/50 dark:border-zinc-900 p-5 bg-white dark:bg-zinc-900/40 space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-gray-800 dark:text-white">
                <span>Total Estimasi Sewa</span>
                <span className="text-lg sm:text-xl text-[#1b4332] dark:text-white font-extrabold">Rp {totalPrice}K</span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-zinc-500 leading-relaxed font-medium">
                *Minimal berdurasi 24 jam. Biaya overtime, jaminan identitas, serta ongkir pengantaran (di luar Bululawang) akan disesuaikan saat konfirmasi WA.
              </p>
              
              <div className="flex space-x-3.5 pt-1">
                <button
                  onClick={onClearCart}
                  className="flex-1 py-3 px-4 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  id="clear-cart-btn"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Kosongkan</span>
                </button>
                
                <button
                  onClick={handleCheckout}
                  className="flex-2 py-3 px-5 bg-[#1b4332] hover:bg-[#2d5a47] dark:bg-white dark:text-[#1b4332] dark:hover:bg-zinc-100 text-white rounded-full text-xs font-bold transition-all hover:shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  id="checkout-cart-btn"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim Pesanan ke WA</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

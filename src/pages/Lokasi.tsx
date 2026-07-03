import React from 'react';
import { MapPin, Clock, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { SystemSettings } from '../types';

interface LokasiProps {
  settings: SystemSettings;
}

export default function Lokasi({ settings }: LokasiProps) {
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15793.003927429188!2d112.67283287796068!3d-8.07722718919028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7880b91e9bf5c1%3A0x4027a7b50a31eb0!2sBululawang%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid";
  const mapsShortLink = "https://maps.app.goo.gl/rvTw2nDo88S1g6SP6";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-page-transition" id="lokasi-page">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto" id="lokasi-header">
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5" />
          <span>Basecamp OneSky</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-gray-900 dark:text-white tracking-tight">
          Lokasi & Kontak Kami
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Kunjungi basecamp kami langsung untuk pengambilan barang sewaan atau berkonsultasi seputar alat camping terbaik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Embed Map Frame */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between h-[380px] lg:h-auto" id="map-frame-container">
          <div className="flex-1 w-full relative">
            <iframe
              src={mapEmbedUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Basecamp OneSky Outdoor"
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200/60 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Bululawang, Malang, Jawa Timur</span>
            <a
              href={mapsShortLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1b4332] hover:bg-[#2d5a47] text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              id="open-google-maps-btn"
            >
              <span>Buka di Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Right Column: Address, Operational and WA Details card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4" id="location-details-container">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-secondary/15 text-secondary dark:text-amber-500 text-[10px] font-bold">
              <Sparkles className="h-3 w-3" />
              <span>Detail Informasi Hubungi</span>
            </div>
            
            <h3 className="text-lg font-sans font-bold text-gray-800 dark:text-white tracking-tight">Basecamp OneSky Outdoor</h3>
            
            <div className="space-y-3">
              {/* Alamat */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#1b4332]/10 text-[#1b4332] rounded-lg mt-0.5 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-sans font-bold text-gray-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider">Alamat Basecamp</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-semibold">
                    Jl. Raya Bululawang No. 42 (Dekat Pasar Bululawang), Bululawang, Kec. Bululawang, Kabupaten Malang, Jawa Timur 65171
                  </p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#1b4332]/10 text-[#1b4332] rounded-lg mt-0.5 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-sans font-bold text-gray-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider">Jam Operasional</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-bold text-emerald-700 dark:text-emerald-500">
                    Setiap Hari: 07.00 - 21.00 WIB
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-normal">
                    *Menerima pengembalian atau pengambilan barang di luar jam di atas dengan konfirmasi H-1.
                  </p>
                </div>
              </div>

              {/* Nomor WhatsApp */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg mt-0.5 shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-sans font-bold text-gray-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider">Kontak WhatsApp</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold">
                    {settings.contactNumber}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-normal">
                    Fast response untuk tanya stok, sewa barang, custom paket sewa, atau pengiriman COD wilayah Bululawang.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20OneSky%20Outdoor%2C%20saya%20ingin%20tanya%20seputar%20sewa%20peralatan%20camping...`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-700 to-[#1b4332] text-white text-center font-bold rounded-lg transition-all hover:opacity-95 shadow-md flex items-center justify-center space-x-1.5 text-xs cursor-pointer"
              id="direct-whatsapp-chat-btn"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Hubungi WA Sekarang</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

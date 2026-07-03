import React from 'react';
import { TermItem } from '../types';
import { BookOpen, HelpCircle } from 'lucide-react';

interface SyaratKetentuanProps {
  terms: TermItem[];
}

export default function SyaratKetentuan({ terms }: SyaratKetentuanProps) {
  // Sort terms by index
  const sortedTerms = [...terms].sort((a, b) => a.index - b.index);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-page-transition" id="syarat-ketentuan-page">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto" id="syarat-header">
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Panduan Penyewa</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-gray-900 dark:text-white tracking-tight">
          Syarat dan Ketentuan
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Harap baca dengan seksama aturan persewaan peralatan outdoor kami sebelum Anda mengajukan pesanan.
        </p>
      </div>

      {/* Grid of beautiful numbered cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="syarat-grid-cards">
        {sortedTerms.map((term, index) => (
          <div
            key={term.id}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200/60 dark:border-zinc-800 shadow-sm relative group hover:shadow transition-all duration-300 overflow-hidden flex flex-col justify-between"
            id={`term-card-${term.id}`}
          >
            {/* Massive background number */}
            <div className="absolute -top-4 -right-2 text-7xl font-sans font-black text-gray-100/50 dark:text-zinc-800/10 group-hover:scale-105 group-hover:text-primary/5 transition-all duration-300 pointer-events-none select-none">
              {term.index}
            </div>

            <div className="space-y-3 relative z-10">
              <div className="h-8 w-8 rounded-lg bg-[#1b4332]/10 text-[#1b4332] font-mono text-sm font-black flex items-center justify-center">
                0{term.index}
              </div>
              
              <p className="text-gray-600 dark:text-zinc-300 text-xs font-semibold leading-relaxed">
                {term.content}
              </p>
            </div>

            <div className="h-0.5 w-8 bg-[#2d5a47] rounded-full mt-4 transition-all group-hover:w-full duration-300" />
          </div>
        ))}
      </div>

      {/* FAQs Contact Footer */}
      <div className="max-w-xl mx-auto bg-gradient-to-r from-emerald-950 to-[#1b4332] text-white p-6 rounded-2xl text-center space-y-3 shadow-lg relative overflow-hidden" id="syarat-faq-banner">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <HelpCircle className="h-6 w-6 text-secondary mx-auto" />
        <h3 className="text-lg font-bold font-sans tracking-tight">Ada Pertanyaan Lebih Lanjut?</h3>
        <p className="text-xs text-zinc-300 leading-normal max-w-sm mx-auto">
          Jika ada syarat atau regulasi yang belum jelas, silakan langsung tanyakan kepada kami melalui tim administrasi WhatsApp. Kami siap membantu!
        </p>
        <div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-4 py-2 bg-secondary text-zinc-950 font-bold rounded-lg text-xs hover:bg-secondary/90 transition-all"
          >
            Hubungi WhatsApp Admin
          </a>
        </div>
      </div>

    </div>
  );
}

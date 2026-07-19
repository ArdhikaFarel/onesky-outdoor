import React, { useState, useRef } from 'react';
import { Star, MessageSquare, Image as ImageIcon, Plus, Edit, Trash2, Calendar, User, Upload, X, ZoomIn } from 'lucide-react';
import { ReviewItem, DocumentationItem } from '../types';

interface UlasanDokumentasiProps {
  reviews: ReviewItem[];
  documentation: DocumentationItem[];
  onAddReview: (review: ReviewItem) => void;
  onUpdateReview: (review: ReviewItem) => void;
  onDeleteReview: (id: string) => void;
  onAddDoc: (doc: DocumentationItem) => void;
  onUpdateDoc: (doc: DocumentationItem) => void;
  onDeleteDoc: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export default function UlasanDokumentasi({
  reviews,
  documentation,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
  onShowToast,
}: UlasanDokumentasiProps) {
  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Documentation Form States
  const [docCaption, setDocCaption] = useState('');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingDocCaption, setEditingDocCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal States
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Filter out hidden reviews
  const visibleReviews = reviews.filter((r) => !r.hidden);

  // Handle Review Submission (Add / Edit)
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      onShowToast('Harap isi nama dan komentar Anda!');
      return;
    }

    if (editingReviewId) {
      const existing = reviews.find((r) => r.id === editingReviewId);
      if (existing) {
        onUpdateReview({
          ...existing,
          name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        });
        onShowToast('Ulasan berhasil diperbarui!');
      }
      setEditingReviewId(null);
    } else {
      const newReview: ReviewItem = {
        id: 'rev-' + Date.now(),
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0],
      };
      onAddReview(newReview);
      onShowToast('Terima kasih atas ulasan Anda!');
    }

    // Reset Form
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
  };

  // Populate form for editing review
  const handleEditReviewClick = (rev: ReviewItem) => {
    setEditingReviewId(rev.id);
    setReviewName(rev.name);
    setReviewRating(rev.rating);
    setReviewComment(rev.comment);
    onShowToast('Silakan edit ulasan Anda pada form di atas.');
    // Scroll to review form
    document.getElementById('review-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel edit mode
  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
  };

  // ==========================================
  // HANDLE DOCUMENTATION FILE UPLOAD - FIXED
  // ==========================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn('No file selected');
      return;
    }

    // Check size (max 1.5MB for Base64 storage)
    if (file.size > 1.5 * 1024 * 1024) {
      onShowToast('❌ Ukuran gambar terlalu besar (Maksimal 1.5MB). Harap kompres atau gunakan gambar yang lebih kecil.');
      return;
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      onShowToast('❌ Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.');
      return;
    }

    console.log('📤 Uploading file:', file.name, file.size, file.type);
    setIsUploading(true);

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const base64Data = event.target?.result as string;
        
        if (!base64Data) {
          throw new Error('Failed to read file');
        }
        
        // Validasi Base64 tidak terlalu besar
        if (base64Data.length > 1.2 * 1024 * 1024) {
          onShowToast('❌ File terlalu besar setelah konversi. Silakan kompres gambar.');
          setIsUploading(false);
          return;
        }
        
        console.log('✅ File read successfully, length:', base64Data.length);
        
        // Buat objek dokumentasi baru
        const newDoc: DocumentationItem = {
          id: 'doc-' + Date.now(),
          caption: docCaption.trim() || 'Momen seru bersama OneSky Outdoor',
          imageUrl: base64Data,
          date: new Date().toISOString().split('T')[0],
        };
        
        console.log('📝 Creating new documentation:', newDoc);
        
        // Panggil onAddDoc dari props
        if (typeof onAddDoc === 'function') {
          onAddDoc(newDoc);
          onShowToast('✅ Foto dokumentasi berhasil ditambahkan!');
        } else {
          console.error('❌ onAddDoc is not a function');
          onShowToast('❌ Gagal menambahkan dokumentasi.');
        }
        
        // Reset form
        setDocCaption('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsUploading(false);
        
      } catch (error) {
        console.error('❌ Error processing file:', error);
        onShowToast('❌ Gagal memproses file. Silakan coba lagi.');
        setIsUploading(false);
      }
    };
    
    reader.onerror = (error) => {
      console.error('❌ FileReader error:', error);
      onShowToast('❌ Gagal membaca file. Silakan coba lagi.');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Handle edit caption
  const handleSaveCaptionEdit = (id: string) => {
    const existing = documentation.find((d) => d.id === id);
    if (existing) {
      onUpdateDoc({
        ...existing,
        caption: editingDocCaption,
      });
      onShowToast('Caption berhasil diperbarui!');
    }
    setEditingDocId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-page-transition" id="ulasan-dokumentasi-page">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto" id="ulasan-page-header">
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-secondary/15 text-secondary dark:text-amber-500 text-xs font-bold uppercase tracking-wider">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>Testimoni & Memori</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-gray-900 dark:text-white tracking-tight">
          Ulasan & Dokumentasi Kegiatan
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Lihat kepuasan petualang yang menyewa alat kami, serta unggah momen camping estetik Anda untuk membagikan kebahagiaan!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= SECTION 1: ULASAN (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-8" id="ulasan-section">
          <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-sans font-bold text-gray-900 dark:text-white">Ulasan Pengunjung ({visibleReviews.length})</h2>
          </div>

          {/* Review Input Form */}
          <div 
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200/60 dark:border-zinc-800 shadow-sm space-y-3"
            id="review-form-section"
          >
            <h3 className="font-sans font-bold text-gray-800 dark:text-zinc-200">
              {editingReviewId ? 'Edit Ulasan Anda' : 'Tulis Ulasan Anda'}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Radhika"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 dark:text-white"
                  />
                </div>

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500 mb-1">
                    Rating Bintang
                  </label>
                  <div className="flex items-center space-x-1 h-9">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300 dark:text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Komentar Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500 mb-1">
                  Isi Komentar
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan pengalaman menyenangkan Anda menggunakan perlengkapan dari OneSky Outdoor..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 dark:text-white"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex space-x-2 justify-end">
                {editingReviewId && (
                  <button
                    type="button"
                    onClick={handleCancelEditReview}
                    className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50"
                  >
                    Batal Edit
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {editingReviewId ? 'Simpan Perubahan' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-3" id="reviews-list">
            {visibleReviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200/60 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 text-xs">
                Belum ada ulasan publik. Jadilah yang pertama memberikan review!
              </div>
            ) : (
              [...visibleReviews].reverse().map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200/60 dark:border-zinc-800 shadow-sm space-y-2.5 group"
                  id={`review-card-${rev.id}`}
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                        {rev.name.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {rev.name}
                        </h4>
                        <div className="flex items-center space-x-1 text-gray-400 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200 dark:text-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed pl-1">
                    {rev.comment}
                  </p>

                  {/* Edit / Delete actions for the user who owns it */}
                  <div className="flex items-center space-x-3 pl-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    <button
                      onClick={() => handleEditReviewClick(rev)}
                      className="hover:text-primary transition-colors flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin menghapus ulasan Anda?')) {
                          onDeleteReview(rev.id);
                          onShowToast('Ulasan berhasil dihapus.');
                        }
                      }}
                      className="hover:text-red-500 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= SECTION 2: DOKUMENTASI (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-8" id="dokumentasi-section">
          <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-sans font-bold text-gray-900 dark:text-white">Galeri Dokumentasi ({documentation.length})</h2>
          </div>

          {/* Image Uploader Input */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200/60 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="font-sans font-bold text-sm text-gray-800 dark:text-zinc-200">Unggah Momen Petualangan</h3>
            
            <div className="space-y-3.5">
              {/* File Drop area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed border-gray-300 dark:border-zinc-800 rounded-lg p-4 text-center cursor-pointer hover:border-[#1b4332]/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Mengupload...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1.5" />
                    <span className="block text-xs font-bold text-gray-700 dark:text-zinc-300">Pilih File Foto</span>
                    <span className="block text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">Maksimal 1.5MB (JPG/PNG)</span>
                  </>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {/* Caption Input */}
              <div>
                <input
                  type="text"
                  placeholder="Tulis caption seru (Contoh: Camping ceria Coban Talun)..."
                  value={docCaption}
                  onChange={(e) => setDocCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 dark:text-white"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 gap-3" id="documentation-gallery-grid">
            {documentation.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200/60 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 text-xs">
                Belum ada foto dokumentasi. Jadilah yang pertama mengunggah!
              </div>
            ) : (
              [...documentation].reverse().map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200/60 dark:border-zinc-800 shadow-sm overflow-hidden relative group hover:shadow transition-all duration-300"
                  id={`doc-card-${doc.id}`}
                >
                  {/* Photo with Overlay Preview triggers */}
                  <div className="relative h-28 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    <img
                      src={doc.imageUrl}
                      alt={doc.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback jika gambar gagal dimuat
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    
                    {/* Dark overlay with Action Triggers */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setPreviewImageUrl(doc.imageUrl)}
                        className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors cursor-pointer"
                        title="Perbesar"
                      >
                        <ZoomIn className="h-4.5 w-4.5" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setEditingDocId(doc.id);
                          setEditingDocCaption(doc.caption);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors cursor-pointer"
                        title="Edit Caption"
                      >
                        <Edit className="h-4.5 w-4.5" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus dokumentasi ini?')) {
                            onDeleteDoc(doc.id);
                            onShowToast('Foto dokumentasi dihapus.');
                          }
                        }}
                        className="p-2 bg-red-600/70 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-3 space-y-1 bg-white dark:bg-zinc-900">
                    {editingDocId === doc.id ? (
                      <div className="space-y-1.5" id={`edit-caption-form-${doc.id}`}>
                        <input
                          type="text"
                          value={editingDocCaption}
                          onChange={(e) => setEditingDocCaption(e.target.value)}
                          className="w-full px-2 py-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-800 dark:text-white"
                        />
                        <div className="flex justify-end space-x-1">
                          <button
                            onClick={() => setEditingDocId(null)}
                            className="px-2 py-0.5 border border-gray-200 text-[10px] font-bold rounded"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveCaptionEdit(doc.id)}
                            className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-600 dark:text-zinc-300 font-medium line-clamp-2 leading-relaxed">
                          {doc.caption}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span>{doc.date}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================= IMAGE ZOOM MODAL ================= */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewImageUrl(null)}
          id="gallery-zoom-modal"
        >
          <button 
            onClick={() => setPreviewImageUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <img
            src={previewImageUrl}
            alt="Perbesaran Dokumentasi"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-zinc-800"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

    </div>
  );
}
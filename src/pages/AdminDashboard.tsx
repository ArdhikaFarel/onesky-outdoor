import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  CheckSquare,
  MessageSquare,
  Image as ImageIcon,
  Home as HomeIcon,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  Eye,
  EyeOff,
  TrendingUp,
  Shield,
  Palette
} from 'lucide-react';
import {
  RentalPackage,
  UnitPriceItem,
  TermItem,
  ReviewItem,
  DocumentationItem,
  SystemSettings,
  HomepageConfig,
  ItemStatus
} from '../types';

interface AdminDashboardProps {
  packages: RentalPackage[];
  setPackages: React.Dispatch<React.SetStateAction<RentalPackage[]>>;
  unitPrices: UnitPriceItem[];
  setUnitPrices: React.Dispatch<React.SetStateAction<UnitPriceItem[]>>;
  terms: TermItem[];
  setTerms: React.Dispatch<React.SetStateAction<TermItem[]>>;
  reviews: ReviewItem[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewItem[]>>;
  documentation: DocumentationItem[];
  setDocumentation: React.Dispatch<React.SetStateAction<DocumentationItem[]>>;
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  homepageConfig: HomepageConfig;
  setHomepageConfig: React.Dispatch<React.SetStateAction<HomepageConfig>>;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}

export default function AdminDashboard({
  packages,
  setPackages,
  unitPrices,
  setUnitPrices,
  terms,
  setTerms,
  reviews,
  setReviews,
  documentation,
  setDocumentation,
  settings,
  setSettings,
  homepageConfig,
  setHomepageConfig,
  onLogout,
  onShowToast,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'paket'
    | 'harga'
    | 'status'
    | 'ulasan'
    | 'dokumentasi'
    | 'homepage'
    | 'syarat'
    | 'settings'
  >('dashboard');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ==========================================
  // FORM / MODAL TEMPORARY STATES
  // ==========================================
  // Package Form
  const [pkgId, setPkgId] = useState('');
  const [pkgName, setPkgName] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgPrice, setPkgPrice] = useState(10);
  const [pkgPriceUnit, setPkgPriceUnit] = useState('/ 24 Jam');
  const [pkgItemsStr, setPkgItemsStr] = useState(''); // comma separated
  const [pkgStatus, setPkgStatus] = useState<ItemStatus>('Ready');
  const [pkgImgBase64, setPkgImgBase64] = useState('');
  const [isPkgFormOpen, setIsPkgFormOpen] = useState(false);

  // Unit Price Form
  const [upId, setUpId] = useState('');
  const [upName, setUpName] = useState('');
  const [upPrice, setUpPrice] = useState(5);
  const [isUpFormOpen, setIsUpFormOpen] = useState(false);

  // Terms Form
  const [termId, setTermId] = useState('');
  const [termContent, setTermContent] = useState('');
  const [isTermFormOpen, setIsTermFormOpen] = useState(false);

  // ==========================================
  // HOMEPAGE CONFIG FORM - PERBAIKAN
  // ==========================================
  const [editHeroTitle, setEditHeroTitle] = useState(homepageConfig.heroTitle);
  const [editHeroSub, setEditHeroSub] = useState(homepageConfig.heroSubtitle);
  const [editHeroBg, setEditHeroBg] = useState(homepageConfig.heroBgUrl);
  const [editHeroBgFile, setEditHeroBgFile] = useState<File | null>(null);
  const [isHeroUploading, setIsHeroUploading] = useState(false);

  // Sync state ketika homepageConfig berubah dari props
  useEffect(() => {
    setEditHeroTitle(homepageConfig.heroTitle);
    setEditHeroSub(homepageConfig.heroSubtitle);
    setEditHeroBg(homepageConfig.heroBgUrl);
  }, [homepageConfig]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // SIDEBAR NAVIGATION LIST
  // ==========================================
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'paket', label: 'Kelola Paket', icon: Package },
    { id: 'harga', label: 'Kelola Harga Satuan', icon: Layers },
    { id: 'status', label: 'Kelola Status Barang', icon: CheckSquare },
    { id: 'ulasan', label: 'Kelola Ulasan', icon: MessageSquare },
    { id: 'dokumentasi', label: 'Kelola Dokumentasi', icon: ImageIcon },
    { id: 'homepage', label: 'Kelola Homepage', icon: HomeIcon },
    { id: 'syarat', label: 'Kelola Syarat & Ketentuan', icon: BookOpen },
    { id: 'settings', label: 'Pengaturan Website', icon: SettingsIcon },
  ];

  // ==========================================
  // IMAGE HELPERS (CONVERT TO BASE64)
  // ==========================================
  const handleImageUploadHelper = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Ukuran berkas gambar terlalu besar. Maksimal 1.5MB demi memori LocalStorage.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onComplete(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // HERO BANNER IMAGE UPLOAD - PERBAIKAN
  // ==========================================
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cek ukuran file (max 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      onShowToast('❌ Ukuran gambar terlalu besar. Maksimal 1.5MB.');
      return;
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      onShowToast('❌ Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.');
      return;
    }

    // Simpan file untuk diupload nanti
    setEditHeroBgFile(file);
    
    // Tampilkan preview sementara
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditHeroBg(reader.result as string);
      onShowToast('✅ Gambar berhasil dipilih. Klik "Simpan Perubahan" untuk menyimpan.');
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (heroFileInputRef.current) {
      heroFileInputRef.current.value = '';
    }
  };

  // ==========================================
  // 1. PACKAGE CRUD OPERATIONS
  // ==========================================
  const handlePkgFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim() || !pkgDesc.trim() || !pkgItemsStr.trim()) {
      alert('Semua bidang wajib diisi.');
      return;
    }

    const itemsArray = pkgItemsStr.split(',').map((x) => x.trim()).filter(Boolean);

    if (pkgId) {
      // Edit Existing Package
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkgId
            ? {
                ...p,
                name: pkgName,
                description: pkgDesc,
                price: Number(pkgPrice),
                priceUnit: pkgPriceUnit,
                items: itemsArray,
                status: pkgStatus,
                imageUrl: pkgImgBase64 || p.imageUrl,
              }
            : p
        )
      );
      onShowToast(`Paket ${pkgName} berhasil diperbarui.`);
    } else {
      // Create New Package
      const newPkg: RentalPackage = {
        id: 'pkg-' + Date.now(),
        name: pkgName,
        description: pkgDesc,
        price: Number(pkgPrice),
        priceUnit: pkgPriceUnit,
        items: itemsArray,
        status: pkgStatus,
        imageUrl: pkgImgBase64 || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
      };
      setPackages((prev) => [...prev, newPkg]);
      onShowToast(`Paket ${pkgName} berhasil ditambahkan.`);
    }

    // Reset fields & close
    setIsPkgFormOpen(false);
    resetPkgForm();
  };

  const handleEditPkgClick = (p: RentalPackage) => {
    setPkgId(p.id);
    setPkgName(p.name);
    setPkgDesc(p.description);
    setPkgPrice(p.price);
    setPkgPriceUnit(p.priceUnit);
    setPkgItemsStr(p.items.join(', '));
    setPkgStatus(p.status);
    setPkgImgBase64(p.imageUrl);
    setIsPkgFormOpen(true);
  };

  const handleDeletePkgClick = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus paket "${name}"?`)) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
      onShowToast(`Paket ${name} berhasil dihapus.`);
    }
  };

  const resetPkgForm = () => {
    setPkgId('');
    setPkgName('');
    setPkgDesc('');
    setPkgPrice(15);
    setPkgPriceUnit('/ 24 Jam');
    setPkgItemsStr('');
    setPkgStatus('Ready');
    setPkgImgBase64('');
  };

  // ==========================================
  // 2. UNIT PRICE CRUD OPERATIONS
  // ==========================================
  const handleUpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upName.trim()) return;

    if (upId) {
      // Edit
      setUnitPrices((prev) =>
        prev.map((item) =>
          item.id === upId
            ? { ...item, name: upName, price: Number(upPrice) }
            : item
        )
      );
      onShowToast(`Item harga ${upName} diperbarui.`);
    } else {
      // Add
      const nextIndex = unitPrices.length > 0 ? Math.max(...unitPrices.map((u) => u.index)) + 1 : 1;
      const newItem: UnitPriceItem = {
        id: 'u-' + Date.now(),
        index: nextIndex,
        name: upName,
        price: Number(upPrice),
      };
      setUnitPrices((prev) => [...prev, newItem]);
      onShowToast(`Item ${upName} berhasil ditambahkan.`);
    }

    setIsUpFormOpen(false);
    setUpId('');
    setUpName('');
    setUpPrice(5);
  };

  const handleEditUpClick = (u: UnitPriceItem) => {
    setUpId(u.id);
    setUpName(u.name);
    setUpPrice(u.price);
    setIsUpFormOpen(true);
  };

  const handleDeleteUpClick = (id: string, name: string) => {
    if (confirm(`Hapus harga satuan "${name}"?`)) {
      setUnitPrices((prev) => prev.filter((u) => u.id !== id));
      onShowToast(`Item ${name} dihapus.`);
    }
  };

  // ==========================================
  // 3. QUICK STATUS EDIT
  // ==========================================
  const handleQuickStatusChange = (id: string, nextStatus: ItemStatus) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
    onShowToast(`Status paket diubah ke ${nextStatus}.`);
  };

  // ==========================================
  // 4. REVIEW MANAGEMENT OPERATIONS
  // ==========================================
  const handleToggleReviewVisibility = (id: string, isCurrentlyHidden: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hidden: !isCurrentlyHidden } : r))
    );
    onShowToast(!isCurrentlyHidden ? 'Ulasan disembunyikan dari publik.' : 'Ulasan ditampilkan ke publik.');
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Hapus review pelanggan ini secara permanen?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      onShowToast('Review berhasil dihapus.');
    }
  };

  // ==========================================
  // 5. GALLERY / DOCUMENTATION CRUD
  // ==========================================
  const handleAddDocClick = (base64: string) => {
    const newDoc: DocumentationItem = {
      id: 'doc-' + Date.now(),
      caption: 'Unggahan admin',
      imageUrl: base64,
      date: new Date().toISOString().split('T')[0],
    };
    setDocumentation((prev) => [...prev, newDoc]);
    onShowToast('Dokumentasi baru berhasil ditambahkan.');
  };

  const handleUpdateDocCaption = (id: string, nextCaption: string) => {
    setDocumentation((prev) =>
      prev.map((d) => (d.id === id ? { ...d, caption: nextCaption } : d))
    );
    onShowToast('Caption berhasil diperbarui.');
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Hapus foto galeri ini?')) {
      setDocumentation((prev) => prev.filter((d) => d.id !== id));
      onShowToast('Foto dihapus.');
    }
  };

  // ==========================================
  // 6. HOMEPAGE CONFIG OPERATIONS - PERBAIKAN
  // ==========================================
  const handleSaveHomepageConfig = () => {
    // Set loading state
    setIsHeroUploading(true);
    
    try {
      // Jika ada file baru, proses upload ke Base64
      let finalBgUrl = editHeroBg;
      
      // Update config dengan data baru
      const updatedConfig = {
        ...homepageConfig,
        heroTitle: editHeroTitle,
        heroSubtitle: editHeroSub,
        heroBgUrl: finalBgUrl
      };
      
      // Panggil setHomepageConfig dari parent (App.tsx)
      setHomepageConfig(updatedConfig);
      
      // Reset file state
      setEditHeroBgFile(null);
      
      onShowToast('✅ Konfigurasi homepage berhasil disimpan!');
      console.log('🏠 Homepage config saved:', updatedConfig);
    } catch (error) {
      console.error('Error saving homepage config:', error);
      onShowToast('❌ Gagal menyimpan konfigurasi homepage');
    } finally {
      setIsHeroUploading(false);
    }
  };

  const handleFeatureTitleChange = (fId: string, nextTitle: string) => {
    setHomepageConfig((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === fId ? { ...f, title: nextTitle } : f)),
    }));
  };

  const handleFeatureDescChange = (fId: string, nextDesc: string) => {
    setHomepageConfig((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === fId ? { ...f, description: nextDesc } : f)),
    }));
  };

  const handleStatusColorChange = (key: 'readyColor' | 'disewaColor' | 'tidakTersediaColor', val: string) => {
    setHomepageConfig((prev) => ({
      ...prev,
      statusColors: {
        ...prev.statusColors,
        [key]: val,
      },
    }));
    onShowToast('Warna status ketersediaan diubah.');
  };

  // ==========================================
  // 7. TERMS CRUD & REORDER OPERATIONS
  // ==========================================
  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termContent.trim()) return;

    if (termId) {
      setTerms((prev) =>
        prev.map((t) => (t.id === termId ? { ...t, content: termContent } : t))
      );
      onShowToast('Syarat & Ketentuan diperbarui.');
    } else {
      const nextIdx = terms.length > 0 ? Math.max(...terms.map((t) => t.index)) + 1 : 1;
      const newTerm: TermItem = {
        id: 'term-' + Date.now(),
        index: nextIdx,
        content: termContent,
      };
      setTerms((prev) => [...prev, newTerm]);
      onShowToast('Syarat & Ketentuan berhasil ditambahkan.');
    }

    setIsTermFormOpen(false);
    setTermId('');
    setTermContent('');
  };

  const handleEditTermClick = (t: TermItem) => {
    setTermId(t.id);
    setTermContent(t.content);
    setIsTermFormOpen(true);
  };

  const handleDeleteTermClick = (id: string) => {
    if (confirm('Hapus syarat ini?')) {
      const remaining = terms.filter((t) => t.id !== id);
      // Re-index
      const reindexed = remaining.map((t, idx) => ({ ...t, index: idx + 1 }));
      setTerms(reindexed);
      onShowToast('Syarat dihapus.');
    }
  };

  const handleMoveTerm = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 1 || targetIdx > terms.length) return;

    const list = [...terms].sort((a, b) => a.index - b.index);
    const currItem = list[index - 1];
    const targetItem = list[targetIdx - 1];

    // Swap indexes
    currItem.index = targetIdx;
    targetItem.index = index;

    // Save
    setTerms(list.sort((a, b) => a.index - b.index));
    onShowToast('Urutan berhasil dipindah.');
  };

  // ==========================================
  // 8. SITE SETTINGS PERSISTENCE
  // ==========================================
  const handleSettingChange = (key: keyof SystemSettings, val: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200" id="admin-panel-root">
      
      {/* Sidebar navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="admin-sidebar"
      >
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Admin Header Title */}
          <div className="flex items-center space-x-2 px-6 mb-8">
            <Shield className="h-6 w-6 text-secondary" />
            <span className="font-sans font-bold text-lg text-white">Console Admin</span>
          </div>

          {/* Nav Items Link list */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-lg shadow-emerald-950/20'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin keluar dari Admin Panel?')) {
                onLogout();
                onShowToast('Berhasil keluar. Sesi admin diakhiri.');
              }
            }}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl border border-red-900/30 transition-all cursor-pointer"
            id="admin-logout-btn"
          >
            <LogOut className="mr-2 h-4.5 w-4.5" />
            <span>Keluar Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Mobile Header Banner */}
        <header className="lg:hidden h-16 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Shield className="h-6 w-6" />
          </button>
          <span className="font-sans font-bold text-sm tracking-wide">
            OneSky Admin • {navItems.find((n) => n.id === activeTab)?.label}
          </span>
          <div className="w-8" />
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8" id="admin-main-section">
          
          {/* ==================================================
              TAB 1: DASHBOARD CARD SUMMARY MODULE
              ================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8" id="panel-dashboard">
              <div className="space-y-1">
                <h1 className="text-3xl font-sans font-extrabold tracking-tight">Ringkasan Sistem</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-500">
                  Selamat datang di panel kontrol OneSky Outdoor. Pantau metrik, kelola ketersediaan barang sewaan, dan moderasi testimoni di bawah ini.
                </p>
              </div>

              {/* Grid 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Paket */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Paket Sewa</span>
                    <h3 className="text-3xl font-bold font-sans">{packages.length}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Package className="h-6 w-6" />
                  </div>
                </div>

                {/* Total Reviews */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Review</span>
                    <h3 className="text-3xl font-bold font-sans">{reviews.length}</h3>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                </div>

                {/* Total Gallery */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Foto Dokumentasi</span>
                    <h3 className="text-3xl font-bold font-sans">{documentation.length}</h3>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                </div>

                {/* Ready Items */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Paket Ready</span>
                    <h3 className="text-3xl font-bold font-sans text-emerald-500">
                      {packages.filter((p) => p.status === 'Ready').length}
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Direct Access Shortcut Help panel */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
                <h4 className="font-sans font-bold text-gray-900 dark:text-white">Panduan Pengoperasian Cepat</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-zinc-400 list-disc pl-5">
                  <li><strong>Update Status Instan:</strong> Buka tab "Kelola Status Barang" untuk merubah ketersediaan paket ke "Disewa" atau "Tidak Tersedia" dengan satu kali klik.</li>
                  <li><strong>Ganti Warna Brand:</strong> Ingin ganti skema visual? Masuk ke "Pengaturan Website" dan sesuaikan warna dasar forest green serta beige dengan palet visual baru Anda.</li>
                  <li><strong>Base64 File Upload:</strong> Seluruh modul gambar sudah mendukung direct file picker tanpa perlu link URL hosting gambar luar.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 2: CRUD KATALOG PAKET RENTAL
              ================================================== */}
          {activeTab === 'paket' && (
            <div className="space-y-6" id="panel-paket">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-sans font-extrabold tracking-tight">Kelola Paket Persewaan</h1>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Tambahkan, ubah item isi paket sewa, harga sewa, gambar, serta status paket sewa.</p>
                </div>
                <button
                  onClick={() => {
                    resetPkgForm();
                    setIsPkgFormOpen(true);
                  }}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shrink-0 cursor-pointer"
                  id="admin-add-package-btn"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Paket Baru</span>
                </button>
              </div>

              {/* Package Add/Edit form overlay dialog */}
              {isPkgFormOpen && (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-md space-y-4 max-w-2xl">
                  <h3 className="font-sans font-bold text-lg">{pkgId ? 'Edit Paket Rental' : 'Buat Paket Rental Baru'}</h3>
                  <form onSubmit={handlePkgFormSubmit} className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="font-semibold text-xs uppercase tracking-wide text-gray-400">Nama Paket</label>
                        <input
                          type="text"
                          required
                          value={pkgName}
                          onChange={(e) => setPkgName(e.target.value)}
                          placeholder="Contoh: Paket A"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <label className="font-semibold text-xs uppercase tracking-wide text-gray-400">Harga (K)</label>
                        <input
                          type="number"
                          required
                          value={pkgPrice}
                          onChange={(e) => setPkgPrice(Number(e.target.value))}
                          placeholder="Contoh: 15 (artinya 15.000)"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Price Unit */}
                      <div className="space-y-1">
                        <label className="font-semibold text-xs uppercase tracking-wide text-gray-400">Satuan Durasi</label>
                        <input
                          type="text"
                          value={pkgPriceUnit}
                          onChange={(e) => setPkgPriceUnit(e.target.value)}
                          placeholder="Contoh: / 24 Jam (Kosongkan bila sekali sewa)"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                        />
                      </div>

                      {/* Status */}
                      <div className="space-y-1">
                        <label className="font-semibold text-xs uppercase tracking-wide text-gray-400">Status</label>
                        <select
                          value={pkgStatus}
                          onChange={(e) => setPkgStatus(e.target.value as ItemStatus)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                        >
                          <option value="Ready">Ready</option>
                          <option value="Disewa">Sedang Disewa</option>
                          <option value="Tidak Tersedia">Tidak Tersedia</option>
                        </select>
                      </div>
                    </div>

                    {/* Included Items list */}
                    <div className="space-y-1">
                      <label className="font-semibold text-xs uppercase tracking-wide text-gray-400">Daftar Isi Paket (Pisahkan dengan tanda koma)</label>
                      <input
                        type="text"
                        required
                        value={pkgItemsStr}
                        onChange={(e) => setPkgItemsStr(e.target.value)}
                        placeholder="Contoh: 1 Kursi Lipat, 1 Meja Lipat, 1 Tripod"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="font-semibold text-xs uppercase tracking-wide text-gray-400">Deskripsi Ringkas</label>
                      <textarea
                        required
                        rows={2}
                        value={pkgDesc}
                        onChange={(e) => setPkgDesc(e.target.value)}
                        placeholder="Deskripsi menarik seputar paket untuk menarik minat pelanggan..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                      />
                    </div>

                    {/* Image Upload field */}
                    <div className="space-y-2">
                      <label className="block font-semibold text-xs uppercase tracking-wide text-gray-400">Foto Paket</label>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-semibold flex items-center space-x-1.5"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Pilih Foto dari Galeri</span>
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={(e) => handleImageUploadHelper(e, setPkgImgBase64)}
                          className="hidden"
                        />
                        {pkgImgBase64 && (
                          <div className="flex items-center space-x-2 border border-gray-100 dark:border-zinc-800 rounded-xl p-1 bg-gray-50 dark:bg-zinc-900 shrink-0">
                            <img src={pkgImgBase64} alt="Preview" className="h-10 w-10 object-cover rounded" />
                            <span className="text-[10px] text-gray-400">Gambar Terpilih</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit actions */}
                    <div className="flex space-x-2 pt-4 border-t border-gray-100 dark:border-zinc-800 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPkgFormOpen(false);
                          resetPkgForm();
                        }}
                        className="px-4 py-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-white font-bold rounded-xl"
                      >
                        {pkgId ? 'Simpan Perubahan' : 'Buat Paket'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Package Grid Table */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden" id="packages-table-container">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700/60 font-bold text-gray-500">
                        <th className="p-4">Foto</th>
                        <th className="p-4">Nama Paket</th>
                        <th className="p-4">Isi Paket</th>
                        <th className="p-4">Harga Sewa</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                      {packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                          <td className="p-4">
                            <img src={pkg.imageUrl} alt={pkg.name} className="h-12 w-12 object-cover rounded-lg border border-gray-100 dark:border-zinc-800" />
                          </td>
                          <td className="p-4 font-bold">{pkg.name}</td>
                          <td className="p-4 max-w-xs truncate">{pkg.items.join(', ')}</td>
                          <td className="p-4 font-mono font-bold">Rp {pkg.price}K {pkg.priceUnit}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-zinc-50 dark:bg-zinc-800">
                              {pkg.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2 shrink-0">
                            <button
                              onClick={() => handleEditPkgClick(pkg)}
                              className="p-1.5 hover:text-primary transition-colors inline-block"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePkgClick(pkg.id, pkg.name)}
                              className="p-1.5 hover:text-red-500 transition-colors inline-block"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 3: CRUD UNIT PRICES
              ================================================== */}
          {activeTab === 'harga' && (
            <div className="space-y-6" id="panel-harga-satuan">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-sans font-extrabold tracking-tight">Kelola Harga Satuan</h1>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Ubah daftar 31 item harga satuan yang tertera di website publik.</p>
                </div>
                <button
                  onClick={() => {
                    setUpId('');
                    setUpName('');
                    setUpPrice(5);
                    setIsUpFormOpen(true);
                  }}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shrink-0 cursor-pointer"
                  id="admin-add-up-btn"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Item Eceran</span>
                </button>
              </div>

              {/* Unit Price modal overlay */}
              {isUpFormOpen && (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-md space-y-4 max-w-md">
                  <h3 className="font-sans font-bold text-lg">{upId ? 'Edit Item Eceran' : 'Tambah Item Eceran Baru'}</h3>
                  <form onSubmit={handleUpFormSubmit} className="space-y-4">
                    <div className="space-y-1 text-sm">
                      <label className="font-semibold text-xs uppercase text-gray-400">Nama Barang</label>
                      <input
                        type="text"
                        required
                        value={upName}
                        onChange={(e) => setUpName(e.target.value)}
                        placeholder="Contoh: Tenda Dome 4/5"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1 text-sm">
                      <label className="font-semibold text-xs uppercase text-gray-400">Harga (K) / 24 Jam</label>
                      <input
                        type="number"
                        required
                        value={upPrice}
                        onChange={(e) => setUpPrice(Number(e.target.value))}
                        placeholder="Contoh: 15"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsUpFormOpen(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 dark:text-zinc-300 rounded-xl text-sm"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-sm"
                      >
                        {upId ? 'Simpan' : 'Tambah'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Unit Price List items in Admin Table */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden" id="unitprices-table-container">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700/60 font-bold text-gray-500">
                        <th className="p-4 w-20">Indeks</th>
                        <th className="p-4">Nama Barang Eceran</th>
                        <th className="p-4">Harga / 24 Jam</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                      {[...unitPrices].sort((a, b) => a.index - b.index).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                          <td className="p-4 font-mono font-bold text-gray-400">{item.index}</td>
                          <td className="p-4 font-semibold">{item.name}</td>
                          <td className="p-4 font-mono font-bold">Rp {item.price}K</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditUpClick(item)}
                              className="p-1.5 hover:text-primary transition-colors inline-block"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUpClick(item.id, item.name)}
                              className="p-1.5 hover:text-red-500 transition-colors inline-block"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 4: QUICK STOCK STATUS CHANGE
              ================================================== */}
          {activeTab === 'status' && (
            <div className="space-y-6" id="panel-status-barang">
              <div>
                <h1 className="text-3xl font-sans font-extrabold tracking-tight">Status Ketersediaan</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-500">Ganti status barang sewaan secara langsung dan seketika terupdate ke pelanggan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="quick-status-grid">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={pkg.imageUrl} alt={pkg.name} className="h-10 w-10 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold">{pkg.name}</h4>
                        <p className="text-xs text-gray-400">Harga: Rp {pkg.price}K</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Atur Status:</span>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        {(['Ready', 'Disewa', 'Tidak Tersedia'] as ItemStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleQuickStatusChange(pkg.id, st)}
                            className={`py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              pkg.status === st
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 5: REVIEW MODERATION PANEL
              ================================================== */}
          {activeTab === 'ulasan' && (
            <div className="space-y-6" id="panel-moderasi-ulasan">
              <div>
                <h1 className="text-3xl font-sans font-extrabold tracking-tight">Kelola Ulasan Pelanggan</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-500">Sembunyikan atau hapus review bermasalah yang masuk dari sisi pelanggan.</p>
              </div>

              <div className="space-y-4" id="admin-reviews-list">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold">{rev.name}</h4>
                        <div className="text-xs text-gray-400 flex items-center space-x-1">
                          <span>{rev.date}</span>
                          <span>•</span>
                          <span>{rev.rating} Bintang</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleReviewVisibility(rev.id, !!rev.hidden)}
                          className="p-1.5 rounded bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-primary transition-all flex items-center space-x-1 text-xs font-bold"
                          title={rev.hidden ? 'Tampilkan' : 'Sembunyikan'}
                        >
                          {rev.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span>{rev.hidden ? 'Hidden' : 'Visible'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded bg-red-50 dark:bg-red-950/20 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-zinc-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 6: CRUD DOCUMENTATION IMAGES
              ================================================== */}
          {activeTab === 'dokumentasi' && (
            <div className="space-y-6" id="panel-admin-galeri">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-sans font-extrabold tracking-tight">Kelola Galeri Dokumentasi</h1>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Unggah foto kegiatan sewa outdoor admin, atau moderasi unggahan pelanggan.</p>
                </div>
                
                {/* File picker for admin */}
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    <Upload className="h-4.5 w-4.5" />
                    <span>Unggah Foto Dokumentasi</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUploadHelper(e, handleAddDocClick)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Gallery List in Admin Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="admin-gallery-grid">
                {documentation.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <img src={doc.imageUrl} alt={doc.caption} className="h-40 w-full object-cover" />
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Edit Caption:</label>
                        <input
                          type="text"
                          value={doc.caption}
                          onChange={(e) => handleUpdateDocCaption(doc.id, e.target.value)}
                          className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-zinc-800 border rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>{doc.date}</span>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="text-red-500 hover:text-red-700 font-bold uppercase tracking-wider"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 7: LIVE HOMEPAGE EDITING - DIPERBAIKI
              ================================================== */}
          {activeTab === 'homepage' && (
            <div className="space-y-8" id="panel-homepage-config">
              <div>
                <h1 className="text-3xl font-sans font-extrabold tracking-tight">Kelola Homepage</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-500">Ubah materi visual landing page seperti Judul Hero, Subtitle, Banner, serta warna status.</p>
              </div>

              {/* Hero Banner Form - DIPERBAIKI */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
                <h3 className="font-sans font-bold text-lg border-b pb-2">Bagian Hero Banner</h3>
                
                <div className="space-y-4 text-sm">
                  {/* Preview Banner saat ini - DITAMBAHKAN */}
                  <div className="space-y-2">
                    <label className="block font-bold text-xs uppercase tracking-wide text-gray-400">Preview Banner Saat Ini</label>
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800">
                      {editHeroBg ? (
                        <img 
                          src={editHeroBg} 
                          alt="Hero Banner Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback jika gambar gagal dimuat
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=85';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Belum ada gambar banner
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hero Title */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase tracking-wide text-gray-400">Hero Main Title</label>
                    <input
                      type="text"
                      value={editHeroTitle}
                      onChange={(e) => setEditHeroTitle(e.target.value)}
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                      placeholder="Masukkan judul utama hero"
                    />
                  </div>

                  {/* Hero Subtitle */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase tracking-wide text-gray-400">Hero Subtitle</label>
                    <input
                      type="text"
                      value={editHeroSub}
                      onChange={(e) => setEditHeroSub(e.target.value)}
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                      placeholder="Masukkan subtitle hero"
                    />
                  </div>

                  {/* Upload Gambar Baru - DIPERBAIKI */}
                  <div className="space-y-2">
                    <label className="block font-bold text-xs uppercase tracking-wide text-gray-400">Ganti Banner Background</label>
                    <div className="flex items-center space-x-4 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Pilih Foto Background Baru</span>
                      </button>
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      {editHeroBgFile && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          ✅ {editHeroBgFile.name} siap diupload
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                      Format: JPG, PNG, WEBP, GIF • Maksimal 1.5MB
                    </p>
                  </div>

                  <button
                    onClick={handleSaveHomepageConfig}
                    disabled={isHeroUploading}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isHeroUploading ? '⏳ Menyimpan...' : '💾 Simpan Perubahan Hero'}
                  </button>
                </div>
              </div>

              {/* Status Colors Config */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
                <h3 className="font-sans font-bold text-lg border-b pb-2 flex items-center space-x-1.5">
                  <Palette className="h-5 w-5 text-secondary" />
                  <span>Kustomisasi Warna Status Ketersediaan</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  {/* Ready Color */}
                  <div className="space-y-2 p-4 border border-gray-100 dark:border-zinc-800 rounded-xl">
                    <span className="font-bold text-xs text-gray-400 uppercase">Warna "Stok Ready"</span>
                    <div className="flex items-center space-x-3 mt-1">
                      <input
                        type="color"
                        value={homepageConfig.statusColors.readyColor}
                        onChange={(e) => handleStatusColorChange('readyColor', e.target.value)}
                        className="h-10 w-10 border border-zinc-300 rounded cursor-pointer"
                      />
                      <span className="font-mono font-bold">{homepageConfig.statusColors.readyColor}</span>
                    </div>
                  </div>

                  {/* Disewa Color */}
                  <div className="space-y-2 p-4 border border-gray-100 dark:border-zinc-800 rounded-xl">
                    <span className="font-bold text-xs text-gray-400 uppercase">Warna "Sedang Disewa"</span>
                    <div className="flex items-center space-x-3 mt-1">
                      <input
                        type="color"
                        value={homepageConfig.statusColors.disewaColor}
                        onChange={(e) => handleStatusColorChange('disewaColor', e.target.value)}
                        className="h-10 w-10 border border-zinc-300 rounded cursor-pointer"
                      />
                      <span className="font-mono font-bold">{homepageConfig.statusColors.disewaColor}</span>
                    </div>
                  </div>

                  {/* Tidak Tersedia Color */}
                  <div className="space-y-2 p-4 border border-gray-100 dark:border-zinc-800 rounded-xl">
                    <span className="font-bold text-xs text-gray-400 uppercase">Warna "Tidak Tersedia"</span>
                    <div className="flex items-center space-x-3 mt-1">
                      <input
                        type="color"
                        value={homepageConfig.statusColors.tidakTersediaColor}
                        onChange={(e) => handleStatusColorChange('tidakTersediaColor', e.target.value)}
                        className="h-10 w-10 border border-zinc-300 rounded cursor-pointer"
                      />
                      <span className="font-mono font-bold">{homepageConfig.statusColors.tidakTersediaColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mengapa Memilih kami Live edits */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
                <h3 className="font-sans font-bold text-lg border-b pb-2">Bagian Informasi Keunggulan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {homepageConfig.features.map((feature, idx) => (
                    <div key={feature.id} className="p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl space-y-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Keunggulan #{idx + 1}</span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureTitleChange(feature.id, e.target.value)}
                          className="w-full px-2 py-1 bg-gray-50 dark:bg-zinc-800 border rounded font-bold"
                        />
                        <textarea
                          rows={2}
                          value={feature.description}
                          onChange={(e) => handleFeatureDescChange(feature.id, e.target.value)}
                          className="w-full px-2 py-1 bg-gray-50 dark:bg-zinc-800 border rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 8: TERMS & CONDITIONS CRUD (WITH REORDERING)
              ================================================== */}
          {activeTab === 'syarat' && (
            <div className="space-y-6" id="panel-syarat-ketentuan">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-sans font-extrabold tracking-tight">Kelola Syarat & Ketentuan</h1>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Atur regulasi sewa, tambah syarat baru, hapus, atau atur urutan penampilan.</p>
                </div>
                <button
                  onClick={() => {
                    setTermId('');
                    setTermContent('');
                    setIsTermFormOpen(true);
                  }}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shrink-0 cursor-pointer"
                  id="admin-add-term-btn"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambah Syarat Baru</span>
                </button>
              </div>

              {/* Term add/edit overlay */}
              {isTermFormOpen && (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-md space-y-4 max-w-lg">
                  <h3 className="font-sans font-bold text-lg">{termId ? 'Edit Syarat & Ketentuan' : 'Tambah Syarat Baru'}</h3>
                  <form onSubmit={handleTermSubmit} className="space-y-4">
                    <div className="space-y-1 text-sm">
                      <label className="font-semibold text-xs uppercase text-gray-400">Isi Ketentuan</label>
                      <textarea
                        required
                        rows={3}
                        value={termContent}
                        onChange={(e) => setTermContent(e.target.value)}
                        placeholder="Contoh: Overtime dikenakan biaya tambahan..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsTermFormOpen(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 dark:text-zinc-300 rounded-xl text-sm"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-sm"
                      >
                        {termId ? 'Simpan' : 'Tambah'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Syarat & Ketentuan List with Up/Down Arrows */}
              <div className="space-y-4" id="admin-terms-reorder-list">
                {[...terms].sort((a, b) => a.index - b.index).map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Big Number index indicator */}
                      <span className="font-sans font-black text-xl text-gray-300 dark:text-zinc-700">0{item.index}</span>
                      <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 max-w-xl">{item.content}</p>
                    </div>

                    {/* Up / Down Controls & Actions */}
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveTerm(item.index, 'up')}
                          disabled={item.index === 1}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveTerm(item.index, 'down')}
                          disabled={item.index === terms.length}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex space-x-1 border-l pl-3 border-gray-100 dark:border-zinc-800">
                        <button
                          onClick={() => handleEditTermClick(item)}
                          className="p-1.5 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTermClick(item.id)}
                          className="p-1.5 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 9: SETTINGS MODULE (HEX COLOR PICKER & BRAND CONFIG)
              ================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-8" id="panel-settings">
              <div>
                <h1 className="text-3xl font-sans font-extrabold tracking-tight">Pengaturan Website</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-500">Kelola identitas dasar website sewa outdoor, logo, hak cipta footer, dan nomor admin WhatsApp.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                
                {/* Visual Customization Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
                  <h3 className="font-sans font-bold text-lg border-b pb-2 flex items-center space-x-1.5">
                    <Palette className="h-5 w-5 text-secondary" />
                    <span>Kustomisasi Identitas & Warna</span>
                  </h3>

                  {/* Website Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase text-gray-400">Nama Website</label>
                    <input
                      type="text"
                      value={settings.websiteName}
                      onChange={(e) => handleSettingChange('websiteName', e.target.value)}
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    />
                  </div>

                  {/* Logo text */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase text-gray-400">Teks Logo</label>
                    <input
                      type="text"
                      value={settings.logoText}
                      onChange={(e) => handleSettingChange('logoText', e.target.value)}
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    />
                  </div>

                  {/* Primary color selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 p-3 border rounded-xl">
                      <label className="block font-bold text-xs uppercase text-gray-400">Warna Utama (Primary)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="h-8 w-8 border rounded cursor-pointer"
                        />
                        <span className="font-mono text-xs font-bold">{settings.primaryColor}</span>
                      </div>
                    </div>

                    <div className="space-y-2 p-3 border rounded-xl">
                      <label className="block font-bold text-xs uppercase text-gray-400">Warna Kedua (Secondary)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          className="h-8 w-8 border rounded cursor-pointer"
                        />
                        <span className="font-mono text-xs font-bold">{settings.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Footer text config */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
                  <h3 className="font-sans font-bold text-lg border-b pb-2">Kontak & Teks Footer</h3>

                  {/* Contact Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase text-gray-400">Nomor Telepon Kontak</label>
                    <input
                      type="text"
                      value={settings.contactNumber}
                      onChange={(e) => handleSettingChange('contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    />
                  </div>

                  {/* WhatsApp send ID */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase text-gray-400">ID WhatsApp (Hanya Angka, Awalan Negara)</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => handleSettingChange('whatsappNumber', e.target.value)}
                      placeholder="Contoh: 6281234567890"
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    />
                    <p className="text-[10px] text-gray-400">Tanpa tanda '+' atau '0' di depan. Gunakan kode negara '62' untuk Indonesia.</p>
                  </div>

                  {/* Footer Text area */}
                  <div className="space-y-1">
                    <label className="font-bold text-xs uppercase text-gray-400">Teks Hak Cipta Footer</label>
                    <textarea
                      rows={3}
                      value={settings.footerText}
                      onChange={(e) => handleSettingChange('footerText', e.target.value)}
                      className="w-full px-3 py-2 border bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
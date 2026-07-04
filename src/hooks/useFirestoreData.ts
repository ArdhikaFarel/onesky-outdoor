import { useState, useEffect, useCallback } from 'react';
import { 
  packageService,
  unitPriceService,
  termService,
  reviewService,
  documentationService,
  settingsService,
  homepageService
} from '../firebase/firestoreService';
import { 
  RentalPackage, 
  UnitPriceItem, 
  TermItem, 
  ReviewItem, 
  DocumentationItem,
  SystemSettings,
  HomepageConfig 
} from '../types';

// =============================================
// GENERIC REAL-TIME HOOK
// =============================================

function useFirestoreRealtime<T>(
  subscribeFn: (callback: (data: T) => void) => () => void,
  initialData: T
): T {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    const unsubscribe = subscribeFn((newData) => {
      setData(newData);
    });

    return () => unsubscribe();
  }, [subscribeFn]);

  return data;
}

// =============================================
// TYPE-SPECIFIC HOOKS
// =============================================

export function usePackages(): RentalPackage[] {
  const [packages, setPackages] = useState<RentalPackage[]>([]);

  useEffect(() => {
    const unsubscribe = packageService.subscribe((data) => {
      setPackages(data);
    });

    return () => unsubscribe();
  }, []);

  return packages;
}

export function useUnitPrices(): UnitPriceItem[] {
  const [unitPrices, setUnitPrices] = useState<UnitPriceItem[]>([]);

  useEffect(() => {
    const unsubscribe = unitPriceService.subscribe((data) => {
      setUnitPrices(data);
    });

    return () => unsubscribe();
  }, []);

  return unitPrices;
}

export function useTerms(): TermItem[] {
  const [terms, setTerms] = useState<TermItem[]>([]);

  useEffect(() => {
    const unsubscribe = termService.subscribe((data) => {
      setTerms(data);
    });

    return () => unsubscribe();
  }, []);

  return terms;
}

export function useReviews(): ReviewItem[] {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const unsubscribe = reviewService.subscribe((data) => {
      setReviews(data);
    });

    return () => unsubscribe();
  }, []);

  return reviews;
}

export function useDocumentation(): DocumentationItem[] {
  const [docs, setDocs] = useState<DocumentationItem[]>([]);

  useEffect(() => {
    const unsubscribe = documentationService.subscribe((data) => {
      setDocs(data);
    });

    return () => unsubscribe();
  }, []);

  return docs;
}

export function useSettings(): SystemSettings {
  const defaultSettings: SystemSettings = {
    id: 'main',
    websiteName: 'OneSky Outdoor',
    logoText: 'OneSky',
    primaryColor: '#1b4332',
    secondaryColor: '#d4a373',
    contactNumber: '+6281234567890',
    whatsappNumber: '6281234567890',
    footerText: '© 2026 OneSky Outdoor. All rights reserved.'
  };

  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  useEffect(() => {
    const unsubscribe = settingsService.subscribe((data) => {
      setSettings(data);
    });

    return () => unsubscribe();
  }, []);

  return settings;
}

export function useHomepageConfig(): HomepageConfig {
  const defaultConfig: HomepageConfig = {
    id: 'main',
    heroTitle: 'Petualangan Dimulai Disini',
    heroSubtitle: 'Sewa perlengkapan outdoor untuk pengalaman tak terlupakan',
    heroBgUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=85',
    features: [
      { id: 'f1', title: 'Peralatan Premium', description: 'Semua perlengkapan kami memiliki kualitas terbaik dan terawat.' },
      { id: 'f2', title: 'Harga Terjangkau', description: 'Sewa dengan harga kompetitif tanpa mengorbankan kualitas.' },
      { id: 'f3', title: 'Pelayanan 24/7', description: 'Tim kami siap membantu Anda kapan saja dibutuhkan.' },
    ],
    statusColors: {
      readyColor: '#22c55e',
      disewaColor: '#eab308',
      tidakTersediaColor: '#ef4444'
    }
  };

  const [config, setConfig] = useState<HomepageConfig>(defaultConfig);

  useEffect(() => {
    const unsubscribe = homepageService.subscribe((data) => {
      setConfig(data);
    });

    return () => unsubscribe();
  }, []);

  return config;
}
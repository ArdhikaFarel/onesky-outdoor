export type ItemStatus = 'Ready' | 'Disewa' | 'Tidak Tersedia';

export interface RentalPackage {
  id: string;
  name: string;
  description: string;
  items: string[];
  price: number;
  priceUnit: string;
  status: ItemStatus;
  imageUrl: string; // URL or Base64 string
  type: "package" | "single";
}

export interface UnitPriceItem {
  id: string;
  index: number;
  name: string;
  price: number;
}

export interface TermItem {
  id: string;
  index: number;
  content: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  hidden?: boolean;
}

export interface DocumentationItem {
  id: string;
  caption: string;
  imageUrl: string; // Base64 string
  date: string;
}

export interface SystemSettings {
  websiteName: string;
  logoText: string;
  primaryColor: string; // Hex color (e.g., #15803d)
  secondaryColor: string; // Hex color (e.g., #f59e0b)
  footerText: string;
  contactNumber: string;
  whatsappNumber: string;
}

export interface StatusColors {
  readyColor: string;
  disewaColor: string;
  tidakTersediaColor: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroBgUrl: string;
  features: {
    id: string;
    title: string;
    description: string;
  }[];
  statusColors: StatusColors;
}

export interface CartItem {
  packageItem: RentalPackage;
  quantity: number;
}

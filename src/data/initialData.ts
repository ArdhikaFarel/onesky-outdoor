import { RentalPackage, UnitPriceItem, TermItem, ReviewItem, DocumentationItem, SystemSettings, HomepageConfig } from '../types';

export const INITIAL_PACKAGES: RentalPackage[] = [
  {
    id: 'pkg-a',
    name: 'Paket A',
    description: 'Paket super praktis cocok untuk santai sejenak berdua menikmati udara luar.',
    items: ['1 Kursi Lipat', '1 Meja Lipat'],
    price: 15,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-b',
    name: 'Paket B',
    description: 'Pilihan hemat lengkap dengan tripod untuk mengabadikan momen petualanganmu.',
    items: ['1 Kursi Lipat', '1 Meja Lipat', '1 Tripod'],
    price: 25,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1515408320194-59643816c5b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-c',
    name: 'Paket C',
    description: 'Santai bersama pasangan dengan dua kursi lipat dan meja yang kokoh.',
    items: ['2 Kursi Lipat', '1 Meja Lipat'],
    price: 25,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-d',
    name: 'Paket D',
    description: 'Double kursi lipat ditambah tripod, siap untuk vlog atau foto estetik bersama.',
    items: ['2 Kursi Lipat', '1 Meja Lipat', '1 Tripod'],
    price: 35,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-e',
    name: 'Paket E',
    description: 'Paket kumpul santai bertiga dengan space meja lipat yang cukup luas.',
    items: ['3 Kursi Lipat', '1 Meja Lipat'],
    price: 35,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-f',
    name: 'Paket F',
    description: 'Kenyamanan bertiga plus tripod untuk mengabadikan kebersamaan tanpa ada yang tertinggal.',
    items: ['3 Kursi Lipat', '1 Meja Lipat', '1 Tripod'],
    price: 45,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1534881338951-40e7228f8d56?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-g',
    name: 'Paket G',
    description: 'Paket nongkrong berempat paling populer, pas untuk melingkar di depan api unggun.',
    items: ['4 Kursi Lipat', '1 Meja Lipat'],
    price: 45,
    priceUnit: '/ 24 Jam',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-h',
    name: 'Paket H',
    description: 'Lengkap berempat dengan tripod. Sempurna untuk camping ceria bersama sahabat terdekat.',
    items: ['4 Kursi Lipat', '1 Meja Lipat', '1 Tripod'],
    price: 55,
    priceUnit: '/ 24 Jam',
    status: 'Disewa',
    imageUrl: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-healing-sendiri',
    name: 'Paket Healing Sendiri',
    description: 'Butuh waktu sendiri di alam bebas? Paket lengkap dengan tenda nyaman, kursi XXL, dan tripod remote.',
    items: ['1 Tenda (2/3 atau 4/5)', '1 Kursi Lipat XXL', '1 Tripod + Remote', '1 Meja Lipat'],
    price: 45,
    priceUnit: '',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pkg-healing-ramean',
    name: 'Paket Healing Ramean',
    description: 'Paket pamungkas untuk camping seru beramai-ramai. Tenda besar dan 4 kursi XXL menjamin kenyamanan maksimal.',
    items: ['1 Tenda (2/3 atau 4/5)', '4 Kursi Lipat XXL', '1 Tripod + Remote', '1 Meja Lipat'],
    price: 75,
    priceUnit: '',
    status: 'Ready',
    imageUrl: 'https://images.unsplash.com/photo-1571687949921-1306bfb24b72?auto=format&fit=crop&w=600&q=80',
  },
];

export const INITIAL_UNIT_PRICES: UnitPriceItem[] = [
  { id: 'u-1', index: 1, name: 'Tenda Kapasitas 4/5', price: 25 },
  { id: 'u-2', index: 2, name: 'Tenda Kapasitas 2/3', price: 20 },
  { id: 'u-3', index: 3, name: 'Carrier 60 + 10 L', price: 10 },
  { id: 'u-4', index: 4, name: 'Carrier 50 + 10 L', price: 10 },
  { id: 'u-5', index: 5, name: 'Day Pack', price: 10 },
  { id: 'u-6', index: 6, name: 'Nesting TNI', price: 5 },
  { id: 'u-7', index: 7, name: 'Cooking Set', price: 5 },
  { id: 'u-8', index: 8, name: 'Panci Gril', price: 10 },
  { id: 'u-9', index: 9, name: 'Alat Gril + Gas', price: 30 },
  { id: 'u-10', index: 10, name: 'Isi ulang Gas', price: 5 },
  { id: 'u-11', index: 11, name: 'Gas + Isi', price: 7 },
  { id: 'u-12', index: 12, name: 'Sleeping Bag Bulu', price: 7 },
  { id: 'u-13', index: 13, name: 'Kompor Kotak Besar', price: 15 },
  { id: 'u-14', index: 14, name: 'Kompor Lipat', price: 5 },
  { id: 'u-15', index: 15, name: 'Hammock', price: 5 },
  { id: 'u-16', index: 16, name: 'Flysheet', price: 7 },
  { id: 'u-17', index: 17, name: 'PowerBank', price: 10 },
  { id: 'u-18', index: 18, name: 'Lampu Tenda', price: 5 },
  { id: 'u-19', index: 19, name: 'Tracking Pole', price: 10 },
  { id: 'u-20', index: 20, name: 'Matras', price: 3 },
  { id: 'u-21', index: 21, name: 'Headlamp', price: 5 },
  { id: 'u-22', index: 22, name: 'Sarung Tangan', price: 5 },
  { id: 'u-23', index: 23, name: 'Meja Lipat', price: 10 },
  { id: 'u-24', index: 24, name: 'Kursi Lipat', price: 10 },
  { id: 'u-25', index: 25, name: 'Tripod + Remote', price: 10 },
  { id: 'u-26', index: 26, name: 'Beli Gas + Isi', price: 13 },
  { id: 'u-27', index: 27, name: 'Jacket Polar', price: 15 },
  { id: 'u-28', index: 28, name: 'Jacket Gorpcore', price: 15 },
  { id: 'u-29', index: 29, name: 'Sepatu', price: 20 },
  { id: 'u-30', index: 30, name: 'Topi', price: 5 },
  { id: 'u-31', index: 31, name: 'Senter', price: 5 },
];

export const INITIAL_TERMS: TermItem[] = [
  {
    id: 'term-1',
    index: 1,
    content: 'Harga berlaku selama 24 jam. Overtime dikenakan biaya 5K/jam.',
  },
  {
    id: 'term-2',
    index: 2,
    content: 'Penyewa wajib meninggalkan identitas aktif seperti KTP, SIM, KTM, atau identitas lainnya.',
  },
  {
    id: 'term-3',
    index: 3,
    content: 'Pengambilan dapat dilakukan langsung di rumah atau COD wilayah Bululawang. Di luar Bululawang dikenakan ongkos kirim.',
  },
  {
    id: 'term-4',
    index: 4,
    content: 'Barang harus dikembalikan dalam kondisi semula. Kerusakan atau kehilangan menjadi tanggung jawab penyewa.',
  },
  {
    id: 'term-5',
    index: 5,
    content: 'Seluruh proses booking dilakukan melalui website. Penyewa memilih perlengkapan, memasukkan ke keranjang, kemudian checkout. Website akan mengarahkan pengguna ke WhatsApp untuk konfirmasi dan pembayaran.',
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Budi Santoso',
    rating: 5,
    comment: 'Sewa peralatan camping di sini sangat memuaskan! Tenda bersih, wangi, dan tidak bocor saat hujan deras di camping ground. Pelayanan COD wilayah Bululawang sangat cepat dan ramah.',
    date: '2026-06-25',
  },
  {
    id: 'rev-2',
    name: 'Ani Lestari',
    rating: 4,
    comment: 'Harga paketnya bersahabat banget buat kantong mahasiswa. Kemarin sewa Paket Healing Ramean bareng temen-temen kelas, alat-alatnya lengkap dan masih mulus semua. Keren!',
    date: '2026-06-28',
  },
  {
    id: 'rev-3',
    name: 'Rian Hidayat',
    rating: 5,
    comment: 'Sangat recommended! Kursi lipat dan meja lipatnya kokoh. Ditambah dapet tripod bluetooth dengan remote yang berfungsi normal. Bikin foto liburan jadi estetik abis. Adminnya fast response.',
    date: '2026-07-01',
  },
];

export const INITIAL_DOCUMENTATION: DocumentationItem[] = [
  {
    id: 'doc-1',
    caption: 'Keseruan camping ground Coban Talun menggunakan Paket Healing Ramean dari OneSky Outdoor.',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    date: '2026-06-15',
  },
  {
    id: 'doc-2',
    caption: 'Momen syahdu menikmati kopi pagi beralaskan meja lipat kokoh di lereng Gunung Banyak.',
    imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
    date: '2026-06-20',
  },
  {
    id: 'doc-3',
    caption: 'Tenda Dome kapasitas 4/5 kokoh berdiri menyambut malam bertabur bintang.',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    date: '2026-06-27',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  websiteName: 'OneSky Outdoor',
  logoText: 'OneSky Outdoor',
  primaryColor: '#1b4332', // Deep Forest Green (#1b4332)
  secondaryColor: '#2d5a47', // Teal Forest Green (#2d5a47)
  footerText: '© 2026 OneSky Outdoor. Menyediakan rental peralatan outdoor berkualitas tinggi di Bululawang.',
  contactNumber: '+62 812-3456-7890',
  whatsappNumber: '6281234567890', // No '+' or lead zero for API link
};

export const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  heroTitle: 'Sewa Peralatan Camping & Outdoor Berkualitas',
  heroSubtitle: 'Praktis, Aman, Harga Terjangkau, dan Siap Menemani Petualanganmu.',
  heroBgUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80',
  features: [
    { id: 'f-1', title: 'Barang Bersih & Siap Pakai', description: 'Semua peralatan selalu dicuci, dibersihkan, dan dipastikan steril serta berfungsi optimal sebelum diserahkan ke penyewa.' },
    { id: 'f-2', title: 'Stok Selalu Diperbarui', description: 'Kami berkala mengganti dan menambah stok perlengkapan agar Anda selalu mendapat teknologi alat camping terkini.' },
    { id: 'f-3', title: 'Harga Terjangkau', description: 'Sistem persewaan paket maupun satuan dengan harga bersahabat dan transparan tanpa ada biaya tersembunyi.' },
    { id: 'f-4', title: 'Booking Mudah & Cepat', description: 'Pilih perlengkapan langsung dari website kami, masukkan keranjang, lalu checkout langsung ke WhatsApp admin.' },
    { id: 'f-5', title: 'Pengambilan Langsung / COD', description: 'Bisa ambil langsung ke basecamp kami atau layani COD area Bululawang untuk kemudahan logistik petualanganmu.' },
    { id: 'f-6', title: 'Fast Response', description: 'Tim admin kami selalu siaga memproses pemesanan Anda dan menjawab pertanyaan seputar perlengkapan outdoor.' },
  ],
  statusColors: {
    readyColor: '#10b981', // green-500
    disewaColor: '#f59e0b', // amber-500
    tidakTersediaColor: '#ef4444', // red-500
  },
};

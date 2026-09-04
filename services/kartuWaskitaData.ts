/**
 * Kartu Waskita Dataset & Structure
 * Defines the structure for Kartu Waskita (name, symbol, archetype, lucky indicators, element, colors, etc.)
 * and exports a base dataset of 15 unique cards.
 */

export interface WaskitaCard {
  id: string;
  name: string;
  number: number;
  archetype: string;
  symbol: string;
  element: string;
  defaultMessage: string;
  luckySymbol: {
    symbol: string;
    element: string;
    color: string;
    number: number;
    keywords: string[];
  };
}

export const WASKITA_CARDS_DATABASE: WaskitaCard[] = [
  {
    id: "WK001",
    name: "Galura Kancana",
    number: 1,
    archetype: "Keteguhan & Kejayaan Batin",
    symbol: "Kujang Kencana",
    element: "Api & Emas",
    defaultMessage: "Jalan anu kabuka henteu salawasna jalan anu panggancangna.",
    luckySymbol: { symbol: "Kujang", element: "Api", color: "Emas & Hijau Pasundan", number: 7, keywords: ["Teguh", "Wani", "Waskita"] }
  },
  {
    id: "WK002",
    name: "Ratu Angin",
    number: 2,
    archetype: "Kearifan & Fleksibilitas",
    symbol: "Babad Pasundan",
    element: "Udara",
    defaultMessage: "Angin henteu pernah nolak tangkal anu dilalui, tapi mere kahirupan.",
    luckySymbol: { symbol: "Sayap Garuda", element: "Udara", color: "Putih Ivory", number: 5, keywords: ["Arif", "Luwes", "Wening"] }
  },
  {
    id: "WK003",
    name: "Gunung Kahuripan",
    number: 3,
    archetype: "Kestabilan & Ketulusan",
    symbol: "Puncak Giri",
    element: "Tanah & Gunung",
    defaultMessage: "Gunung nangtung kukuh sabab akarna nyekel bumi.",
    luckySymbol: { symbol: "Batu Karang", element: "Tanah", color: "Coklat Kayu", number: 8, keywords: ["Kokoh", "Setia", "Bumi"] }
  },
  {
    id: "WK004",
    name: "Cai Kahuripan",
    number: 4,
    archetype: "Sumber Ketenangan & Kejernihan",
    symbol: "Mata Air Suci",
    element: "Air",
    defaultMessage: "Cai nu tenang nyimpen jero anu teu kabaca ku panon biasa.",
    luckySymbol: { symbol: "Tirta Suci", element: "Air", color: "Biru Tua", number: 3, keywords: ["Jernih", "Sejuk", "Mengalir"] }
  },
  {
    id: "WK005",
    name: "Pohon Waringin",
    number: 5,
    archetype: "Pengayoman & Kebijaksanaan",
    symbol: "Waringin Sungsang",
    element: "Kayu & Bumi",
    defaultMessage: "Kalangkang gedé mere tempat reureuh ka jalma nu kacapean.",
    luckySymbol: { symbol: "Daun Waringin", element: "Kayu", color: "Hijau Tua", number: 9, keywords: ["Ngayoman", "Teduh", "Wibawa"] }
  },
  {
    id: "WK006",
    name: "Surya Kencana",
    number: 6,
    archetype: "Kharisma & Penerangan",
    symbol: "Matahari Terbit",
    element: "Cahaya",
    defaultMessage: "Sinar surya moal pernah milih saha anu rék disinaran.",
    luckySymbol: { symbol: "Surya", element: "Cahaya", color: "Kuning Emas", number: 1, keywords: ["Terang", "Adil", "Semangat"] }
  },
  {
    id: "WK007",
    name: "Rembulan Wening",
    number: 7,
    archetype: "Intuisi & Kedalaman Batin",
    symbol: "Bulan Purnama",
    element: "Air & Malam",
    defaultMessage: "Bulan caang di peuting poek, nuduhkeun jalan nu bener.",
    luckySymbol: { symbol: "Kala Cakra", element: "Aether", color: "Perak Ivory", number: 2, keywords: ["Wening", "Batin", "Tenang"] }
  },
  {
    id: "WK008",
    name: "Leuweung Sacred",
    number: 8,
    archetype: "Misteri & Perlindungan Alam",
    symbol: "Leuweung Larangan",
    element: "Rimba",
    defaultMessage: "Alam moal merhatikeun jalma nu ngaruksak, tapi ngajaga nu nyaah.",
    luckySymbol: { symbol: "Pohon Hayat", element: "Rimba", color: "Hijau Pasundan", number: 6, keywords: ["Lestari", "Raksa", "Aji"] }
  },
  {
    id: "WK009",
    name: "Padjajaran Kinasih",
    number: 9,
    archetype: "Kedaulatan & Persatuan Batin",
    symbol: "Singgasana Siliwangi",
    element: "Baja & Api",
    defaultMessage: "Nagara nu kuat lahir tina rahayat nu silih asih silih asah silih asuh.",
    luckySymbol: { symbol: "Mawe Siliwangi", element: "Logam", color: "Perunggu", number: 9, keywords: ["Asih", "Asah", "Asuh"] }
  },
  {
    id: "WK010",
    name: "Karang Hawu",
    number: 10,
    archetype: "Koneksi Kosmik & Samudra",
    symbol: "Gelombang Karang",
    element: "Samudra",
    defaultMessage: "Laut luas moal pernah pinuh ku sagala kapal nu datang.",
    luckySymbol: { symbol: "Karang Laut", element: "Air", color: "Biru Samudra", number: 4, keywords: ["Sabar", "Luas", "Taat"] }
  },
  {
    id: "WK011",
    name: "Badak Putih",
    number: 11,
    archetype: "Keberanian & Penjagaan Leluhur",
    symbol: "Badak Sunda",
    element: "Bumi Kuat",
    defaultMessage: "Langkah teges nembus halangan tanpa mundur ka tukang.",
    luckySymbol: { symbol: "Cula Badak", element: "Tanah", color: "Putih Tulang", number: 11, keywords: ["Wani", "Teges", "Raksa"] }
  },
  {
    id: "WK012",
    name: "Kembang Wijayakusuma",
    number: 12,
    archetype: "Kejayaan & Kesuksesan Sejati",
    symbol: "Bunga Mekar Malam",
    element: "Flora Kasepuhan",
    defaultMessage: "Kembang nu mekar di peuting poek mawa seungit ka sakulilingna.",
    luckySymbol: { symbol: "Mahkota Bunga", element: "Kayu", color: "Putih Keemasan", number: 12, keywords: ["Harum", "Mekar", "Jaya"] }
  },
  {
    id: "WK013",
    name: "Kujang Pangangkak",
    number: 13,
    archetype: "Transformasi & Peningkatan Derajat",
    symbol: "Kujang Melayang",
    element: "Aether & Besi",
    defaultMessage: "Hiji léngkah ka luhur merlukeun niat anu bersih ti handap.",
    luckySymbol: { symbol: "Sayap Emas", element: "Udara", color: "Emas Tua", number: 13, keywords: ["Luhur", "Bersih", "Naik"] }
  },
  {
    id: "WK014",
    name: "Curug Cikaso",
    number: 14,
    archetype: "Kesegaran & Pembersihan Jiwa",
    symbol: "Tiga Aliran Air",
    element: "Air Mengalir",
    defaultMessage: "Cai curug mawa bersih sagala kokotor di gawir kahirupan.",
    luckySymbol: { symbol: "Tiga Titisan", element: "Air", color: "Tosca", number: 14, keywords: ["Sihombing", "Suci", "Segar"] }
  },
  {
    id: "WK015",
    name: "Cahaya Kasepuhan",
    number: 15,
    archetype: "Pencerahan & Nur Illahi",
    symbol: "Aura Semesta",
    element: "Nur Kosmik",
    defaultMessage: "Cahaya sajati aya di jero haté jalma nu tumiba kana eling.",
    luckySymbol: { symbol: "Bintang Timur", element: "Cahaya", color: "Putih Terang", number: 15, keywords: ["Eling", "Nur", "Waskita"] }
  }
];

export function getCardByNeptu(neptu: number): WaskitaCard {
  const index = (neptu - 7) % WASKITA_CARDS_DATABASE.length;
  return WASKITA_CARDS_DATABASE[Math.abs(index) % WASKITA_CARDS_DATABASE.length];
}

export function generateWaskitaPrompt(card: WaskitaCard, userName: string, gender: string, weton: string, neptu: number, zodiac: string): string {
  return `Analisis Paririmbon Nusantara mendalam untuk Kartu Waskita "${card.name}" (#${card.number}, Arketipe: ${card.archetype}, Simbol: ${card.symbol}). 
Identitas Subjek: ${userName || 'Seseorang'} (${gender}), Weton: ${weton}, Neptu: ${neptu}, Zodiak: ${zodiac}.
Berikan Risalah Waskita puitis Nusantara yang disusun dalam struktur berikut (gunakan format tajuk tegas):

1. NAMA KARTU: ${card.name} (#${card.number})
2. SIMBOL UTAMA: ${card.symbol} (${card.archetype})
3. MAKNA KARTU: (Uraian filosofis mendalam mengenai hakekat kartu ini bagi ${userName})
4. KEPRIBADIAN: (Sifat dominan, kekuatan, potensi, cara menghadapi masalah, kelemahan, dan kecenderungan mengambil keputusan)
5. REZEKI & PELUANG: (Kecenderungan rezeki, potensi pengembangan, kebiasaan finansial, dan saran praktis secara simbolik)
6. ASMARA & HUBUNGAN: (Karakter dalam hubungan, gaya komunikasi, kekuatan, tantangan, dan pesan reflektif)
7. KARIER & JALAN KARYA: (Kecenderungan karier, kepemimpinan, kreativitas, kerja sama, dan saran pengembangan diri)
8. LALAMPAHAN (PERJALANAN HIDUP): (Fase kehidupan, perubahan, peluang, dan arah pengembangan diri)
9. TANTANGAN: (Ujian batin atau hambatan yang harus diwaspadai)
10. PELUANG POSITIF: (Pintu berkah dan momentum terbaik)
11. PESAN WASKITA: (Pesan filosofis khas Sunda yang singkat, bijak, dan bermakna)
12. SIMBOL KEBERUNTUNGAN: (Simbol: ${card.luckySymbol.symbol}, Unsur: ${card.luckySymbol.element}, Warna: ${card.luckySymbol.color}, Angka: ${card.luckySymbol.number}, Kata Kunci: ${card.luckySymbol.keywords.join(' • ')})

Gunakan bahasa Sunda-Indonesia yang puitis, elegan, berwibawa, tanpa simbol bintang, dan manfaatkan seluruh lebar teks secara maksimal.`;
}

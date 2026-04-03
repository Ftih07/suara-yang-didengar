// data/chapter-3.ts
// Chapter 3: Sengketa Lahan Desa
// Konsep Matematika: Geometri (Luas Trapesium vs Persegi Panjang) & Finansial (Time Value of Money)

import type {
  ChapterData,
  ChapterMeta,
  EndingDef,
  EndingId,
} from "../types/chapter-data";

// =====================================================================
//  CHAPTER METADATA
// =====================================================================
export const CHAPTER_META: ChapterMeta = {
  id: "ch3",
  title: "Chapter 3",
  subtitle: "Sengketa Lahan Desa",
  startSceneId: "ch3_intro",
};

// =====================================================================
//  IMAGE PATH HELPERS (Placeholder)
// =====================================================================
const BG_BALAI_DESA = "/backgrounds/Kantor-kepala-desa-malam.webp";
const BG_LAHAN_KOSONG = "/backgrounds/lahan-kosong-1.webp";
const BG_WARUNG_BU_SITI = "/backgrounds/warung-bu-siti.webp";

const CHAR_PAK_HERU = "/characters/Pak-Heru.png";
const CHAR_MBAH_DARMO = "/characters/Mbah-Darmo.png";
const CHAR_PAK_BAKRI = "/characters/Pak-bakri.png";
const CHAR_BAYU = "/characters/Bayu-Pemuda-Kritis.png";
const CHAR_LARAS = "/characters/laras.png";
const CHAR_BRIPTU_ARIS = "/characters/Briptu-aris.png";

// =====================================================================
//  CHAPTER 3 SCENE DATA
// =====================================================================
export const chapter3Data: Record<string, ChapterData> = {
  // ------------------------------------------------------------------
  // ADEGAN A: BALAI DESA (Negosiasi dengan Investor)
  // ------------------------------------------------------------------
  ch3_intro: {
    id: "ch3_intro",
    backgroundImage: BG_BALAI_DESA, // <--- Latar Balai Desa
    characterImage: "",
    characterName: "Narasi",
    text: "Pagi yang tegang di Balai Desa Amanah. Di atas meja kayu besar, terhampar sebuah peta desa versi lama yang sudah menguning, bersanding dengan cetakan blueprint pabrik modern yang mengkilap. Pak Heru, seorang investor berjas rapi, tersenyum percaya diri. Di seberangnya, Mbah Darmo duduk bersila sambil mengetukkan tongkat kayunya dengan wajah tidak senang. Pak Bakri berdiri di pojok ruangan dengan wajah cemas.",
    nextSceneId: "ch3_heru_1",
    backgroundMusic: "calm",
    narratorAudio: "narrator-ch3-intro.mp3",
  },

  ch3_heru_1: {
    id: "ch3_heru_1",
    backgroundImage: BG_BALAI_DESA,
    characterImage: CHAR_PAK_HERU,
    characterName: "Pak Heru (Investor)",
    text: "Pak Kades, tawaran saya ini solusi instan untuk desa yang kas-nya sedang seret. Saya butuh lahan persis 20.000 meter persegi, alias 2 Hektar, berbentuk persegi panjang di batas timur desa. Uang tunai 2 Miliar Rupiah saya transfer hari ini juga ke kas desa. Beres, kan?",
    nextSceneId: "ch3_laras_1",
    backgroundMusic: "tense",
  },

  ch3_laras_1: {
    id: "ch3_laras_1",
    backgroundImage: BG_BALAI_DESA,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "(Menunjuk peta lama dengan penggaris) Tunggu dulu, Pak Heru. Lahan timur yang Bapak maksud itu di sertifikat desa tahun 1980 bentuknya trapesium, bukan persegi panjang. Sisi sejajarnya hanya 120 meter dan 180 meter, dengan tinggi 120 meter. Kalau dihitung luasnya: L = 1/2 × (120 + 180) × 120. Itu cuma 18.000 meter persegi atau 1,8 Hektar!",
    nextSceneId: "ch3_bayu_1",
    backgroundMusic: "tense",
  },

  ch3_bayu_1: {
    id: "ch3_bayu_1",
    backgroundImage: BG_BALAI_DESA,
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "Betul! Kalau Pak Heru memaksa menggambar bujur sangkar atau persegi panjang 2 Hektar di atas tanah trapesium itu, berarti Bapak akan mencaplok selisih 2.000 meter persegi! Dan tebak itu tanah siapa? Itu menabrak area resapan air sungai dan memotong separuh ladang singkong Pak Bakri!",
    nextSceneId: "ch3_mbah_darmo_1",
    backgroundMusic: "tense",
  },

  // ------------------------------------------------------------------
  // ADEGAN B: LAHAN KOSONG (Inspeksi Lapangan & Protes)
  // ------------------------------------------------------------------
  ch3_mbah_darmo_1: {
    id: "ch3_mbah_darmo_1",
    backgroundImage: BG_LAHAN_KOSONG, // <--- Transisi latar ke Lahan Kosong
    characterImage: CHAR_MBAH_DARMO,
    characterName: "Mbah Darmo",
    text: "(Mengetukkan tongkatnya keras-keras) Tanah pesisir timur itu wates leluhur! Di situ ada pohon beringin kembar yang mengikat air tanah. Kalau kalian hitung-hitungan pakai kertas kota lalu menebang beringin itu, kualat satu desa!",
    nextSceneId: "ch3_pak_bakri_1",
    backgroundMusic: "tense",
  },

  ch3_pak_bakri_1: {
    id: "ch3_pak_bakri_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_PAK_BAKRI,
    characterName: "Pak Bakri",
    text: "(Suaranya bergetar) Pak Kades... ladang singkong itu satu-satunya sisa warisan bapak saya. Kalau dipotong 2.000 meter buat pabrik, saya mau makan apa, Pak?",
    nextSceneId: "ch3_heru_2",
    backgroundMusic: "tense",
  },

  ch3_heru_2: {
    id: "ch3_heru_2",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_PAK_HERU,
    characterName: "Pak Heru",
    text: "Saya ini pebisnis, Pak Kades. Mesin pabrik saya tidak bisa ditekuk mengikuti bentuk trapesium. Saya butuh presisi. Kas desa butuh suntikan dana, kan?",
    nextSceneId: "",
    backgroundMusic: "tense",
    choices: [
      {
        text: "Pak Heru, secara geometri lahan kami tidak bisa dipaksa menjadi persegi panjang tanpa merugikan warga. Kalau Bapak mau berinvestasi, desain pabrik Bapak yang harus menyesuaikan luas trapesium 1,8 Hektar ini. Titik.",
        nextId: "ch3_a_heru_1",
      },
      {
        text: "Bayu, Laras, lupakan dulu soal bentuk tanahnya. Tawaran 2 Miliar ini secara finansial juga bermasalah. Kita tidak akan menjual aset desa. Kalau Pak Heru mau tanah itu, kita gunakan sistem sewa jangka panjang.",
        nextId: "ch3_b_bayu_1",
      },
    ],
  },

  // --- Cabang A (Geometri & Batas Tanah) ---
  ch3_a_heru_1: {
    id: "ch3_a_heru_1",
    backgroundImage: BG_LAHAN_KOSONG, // <--- Masih di Lahan Kosong
    characterImage: CHAR_PAK_HERU,
    characterName: "Pak Heru",
    text: "(Mendengus pelan) Baik. Kalau saya harus merevisi blueprint menjadi 1,8 Hektar, biayanya membengkak. Saya hanya bersedia membayar kompensasi 1,2 Miliar. Tapi syaratnya, pohon beringin di tengah trapesium itu harus ditebang karena letaknya persis di titik pusat koordinat pabrik saya.",
    nextSceneId: "ch3_a_mbah_darmo_1",
    backgroundMusic: "tense",
  },

  ch3_a_mbah_darmo_1: {
    id: "ch3_a_mbah_darmo_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_MBAH_DARMO,
    characterName: "Mbah Darmo",
    text: "Lancang! Beringin itu sudah di sana sebelum mbah buyutmu lahir! Kalau beringin itu tumbang, sumber air untuk sawah Dusun Timur akan mati perlahan!",
    nextSceneId: "ch3_a_laras_1",
    backgroundMusic: "tense",
  },

  ch3_a_laras_1: {
    id: "ch3_a_laras_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Mbah Darmo benar, Pak Kades. Pohon itu adalah titik nol resapan kita. Tapi di sisi lain, kalau pabrik ini batal murni karena sebatang pohon, kas desa kita bulan depan tidak akan cukup untuk membiayai perbaikan puskesmas.",
    nextSceneId: "ch3_a_pak_bakri_1",
    backgroundMusic: "tense",
  },

  ch3_a_pak_bakri_1: {
    id: "ch3_a_pak_bakri_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_PAK_BAKRI,
    characterName: "Pak Bakri",
    text: "Tapi setidaknya... ladang saya aman kan, Pak Kades?",
    nextSceneId: "",
    backgroundMusic: "tense",
    choices: [
      {
        text: "Mbah Darmo, mohon maaf. Matematika kas desa kita sedang kritis. Kita selamatkan ladang Pak Bakri dan ambil 1,2 Miliar itu. Pohon beringin kita tebang, tapi saya janjikan reboisasi di lokasi lain.",
        nextId: "ch3_conclusion",
        effect: { trust: 10, treasury: 15, stability: -15, legacy: -25 },
      },
      {
        text: "Investasi tidak boleh menghancurkan warisan dan ekologi. Kalau desain Bapak menuntut beringin itu ditebang, silakan bawa uang 2 Miliar Bapak ke desa lain. Tanah trapesium itu tetap utuh.",
        nextId: "ch3_conclusion",
        effect: { trust: 15, treasury: -20, stability: 15, legacy: 25 },
      },
    ],
  },

  // --- Cabang B (Proyeksi Finansial) ---
  ch3_b_bayu_1: {
    id: "ch3_b_bayu_1",
    backgroundImage: BG_LAHAN_KOSONG, // <--- Masih di Lahan Kosong
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "Nah, ini baru masuk akal! Kalau kita jual putus 2 Miliar, kelihatannya besar. Tapi coba hitung nilai waktu uang (Time Value of Money). Lahan itu nilainya naik tiap tahun. Belum lagi inflasi 5% per tahun. Dalam 10 tahun, 2 Miliar itu nilainya menyusut drastis!",
    nextSceneId: "ch3_b_heru_1",
    backgroundMusic: "tense",
  },

  ch3_b_heru_1: {
    id: "ch3_b_heru_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_PAK_HERU,
    characterName: "Pak Heru",
    text: "Anak muda pintar. Oke, sewa. Saya tawarkan sewa flat (tetap) 100 juta per tahun selama 20 tahun. Dan karena ini sewa, saya bebas menggunakan lahan 2 Hektar itu, termasuk menebang beringin dan menggusur ladang Pak Bakri. Nanti Pak Bakri saya kasih pesangon kecil.",
    nextSceneId: "ch3_b_laras_1",
    backgroundMusic: "tense",
  },

  ch3_b_laras_1: {
    id: "ch3_b_laras_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Pak, kalau sewanya flat 100 juta selama 20 tahun, daya beli uang 100 juta di tahun ke-20 nanti mungkin cuma setara 30 juta hari ini. Kita rugi bandar!",
    nextSceneId: "ch3_b_mbah_darmo_1",
    backgroundMusic: "tense",
  },

  ch3_b_mbah_darmo_1: {
    id: "ch3_b_mbah_darmo_1",
    backgroundImage: BG_LAHAN_KOSONG,
    characterImage: CHAR_MBAH_DARMO,
    characterName: "Mbah Darmo",
    text: "Kalian ini ribut soal uang kertas, tapi menutup mata sama tanah yang menangis! Pak Kades, jangan gadaikan nyawa desa!",
    nextSceneId: "",
    backgroundMusic: "tense",
    choices: [
      {
        text: "Pak Heru, kami bukan orang bodoh. Sewa tidak bisa flat. Kita gunakan persentase majemuk. Nilai sewa naik 5% setiap tahun mengikuti inflasi, DAN luasan yang disewa tetap mentok di 1,8 Hektar. Ladang warga bukan untuk disewa!",
        nextId: "ch3_conclusion",
        effect: { trust: 5, treasury: 20, stability: -10, legacy: 5 },
      },
      {
        text: "Uang 100 juta per tahun tidak menyelesaikan masalah kas kita hari ini! Pak Heru, saya terima uang sewa untuk 10 tahun di muka sekarang juga (1 Miliar), ambil 2 Hektar itu, dan selesaikan urusan pesangon Pak Bakri sendiri.",
        nextId: "ch3_conclusion",
        effect: { trust: -30, treasury: 25, stability: -25, legacy: -20 },
      },
    ],
  },

  // -------------------------------------------------------------------
  // ADEGAN C: WARUNG KOPI (Desas-desus & Konklusi)
  // -------------------------------------------------------------------
  ch3_conclusion: {
    id: "ch3_conclusion",
    backgroundImage: BG_WARUNG_BU_SITI, // <--- Transisi latar ke Warung
    characterImage: "",
    characterName: "Narasi",
    // Narasi sedikit dimodif agar masuk akal dengan background warung
    text: "Keputusan akhir telah menyebar. Di Warung Kopi Bu Siti, desas-desus mulai memanas. Tergantung pilihan Kepala Desa, Pak Heru mungkin telah kembali ke kota dengan senyum puas atau wajah kesal. Namun di sini, warga desa yang menanggung akibatnya.",
    nextSceneId: "ch3_c_mbah_darmo_1",
    narratorAudio: "narrator-ch3-conclusion.mp3",
    backgroundMusic: "calm",
  },

  ch3_c_mbah_darmo_1: {
    id: "ch3_c_mbah_darmo_1",
    backgroundImage: BG_WARUNG_BU_SITI,
    characterImage: CHAR_MBAH_DARMO,
    characterName: "Mbah Darmo",
    text: "(Menatap lurus, entah dengan tatapan bangga atau penuh kekecewaan) Gusti Allah mboten sare (Tuhan tidak tidur). Tanah ini akan mencatat apa yang diputuskan Kades hari ini.",
    nextSceneId: "ch3_c_pak_bakri_1",
    backgroundMusic: "calm",
  },

  ch3_c_pak_bakri_1: {
    id: "ch3_c_pak_bakri_1",
    backgroundImage: BG_WARUNG_BU_SITI,
    characterImage: CHAR_PAK_BAKRI,
    characterName: "Pak Bakri",
    text: "(Mengaduk kopi dengan wajah gontai atau tersenyum lega) Nasib wong cilik memang selalu di ujung pena pejabat desa.",
    nextSceneId: "ch3_c_aris_1",
    backgroundMusic: "calm",
  },

  ch3_c_aris_1: {
    id: "ch3_c_aris_1",
    backgroundImage: BG_WARUNG_BU_SITI,
    characterImage: CHAR_BRIPTU_ARIS,
    characterName: "Briptu Aris",
    text: "(Melangkah masuk ke warung) Saya sudah dengar putusannya. Beberapa pemuda dusun timur mulai berkumpul di pos ronda. Kalau beringin itu benar-benar disentuh, atau ladang Pak Bakri dipagari, malam ini saya terpaksa harus menetapkan status Siaga Satu di desa kita.",
    nextSceneId: "ch3_c_laras_1",
    backgroundMusic: "calm",
  },

  ch3_c_laras_1: {
    id: "ch3_c_laras_1",
    backgroundImage: BG_WARUNG_BU_SITI,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "(Duduk di bangku panjang, memegang pelipisnya) Pilihan yang sangat berat. Berkas legalitasnya akan saya urus segera. Tapi bersiaplah... keputusan kas ini akan sangat menentukan nasib kita bulan depan.",
    backgroundMusic: "calm",
    choices: [], // Kosong untuk men-trigger EndingScreen
  },
};  

// =====================================================================
//  ENDINGS DATA
// =====================================================================
export const ENDINGS_CH3: Partial<Record<EndingId, EndingDef>> = {
  ch3_A1: {
    id: "ch3_A1" as EndingId,
    title: "Pemimpin Pragmatis",
    subtitle: "Jalur A1 — Kompromi Geometri & Tebang Beringin",
    description:
      "Anda memilih jalan tengah yang pragmatis, menyelamatkan hak milik pribadi warga tapi mengorbankan ekologi dan peninggalan budaya demi uang kas darurat. Walau keuangan desa terselamatkan sementara, pemuda dan tetua desa marah besar melihat identitas kultural desa dihancurkan.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+10 (Hak milik warga miskin terlindungi)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "+15 (Mendapat dana 1,2 Miliar)",
        positive: true,
      },
      {
        label: "Stabilitas",
        value: "-15 (Potensi sabotase dari warga yang marah)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "-25 (Pohon keramat & area resapan hancur)",
        positive: false,
      },
    ],
    bgClass: "from-blue-900 via-slate-800 to-slate-900",
    borderClass: "border-blue-400",
    accentClass: "text-blue-200",
    badgeLabel: "PRAGMATIS",
    badgeBg: "bg-blue-600",
    icon: "🪓",
  },

  ch3_A2: {
    id: "ch3_A2" as EndingId,
    title: "Proteksionis Ekstrem",
    subtitle: "Jalur A2 — Pertahankan Tanah Leluhur",
    description:
      "Anda tampil sebagai pemimpin idealis yang menolak kompromi kapitalis sekecil apa pun demi menjaga keutuhan tanah leluhur. Anda disanjung sebagai pahlawan dan penjaga sejati tanah desa, desa pun aman dari konflik agraria. Sayangnya, kas desa tetap seret dan tidak ada uang untuk infrastruktur.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+15 (Disanjung sebagai pahlawan lokal)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "-20 (Kehilangan peluang emas investasi)",
        positive: false,
      },
      {
        label: "Stabilitas",
        value: "+15 (Bebas dari konflik agraria)",
        positive: true,
      },
      {
        label: "Warisan Budaya",
        value: "+25 (Tanah dan ekologi terjaga utuh)",
        positive: true,
      },
    ],
    bgClass: "from-green-900 via-slate-800 to-slate-900",
    borderClass: "border-green-400",
    accentClass: "text-green-200",
    badgeLabel: "IDEALIS",
    badgeBg: "bg-green-600",
    icon: "🌳",
  },

  ch3_B1: {
    id: "ch3_B1" as EndingId,
    title: "Negosiator Finansial",
    subtitle: "Jalur B1 — Sewa Majemuk & Jaga Batas",
    description:
      "Anda membuktikan kecerdasan sebagai kapitalis rasional dengan mengunci investor menggunakan hitungan inflasi yang mencekik tapi menguntungkan desa. Anda berhasil melindungi batas tanah dan mendapatkan *passive income*, walau investor mungkin mencari celah hukum di kemudian hari.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+5 (Warga lega ladang aman)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "+20 (Passive income jangka panjang)",
        positive: true,
      },
      {
        label: "Stabilitas",
        value: "-10 (Potensi gugatan hukum investor)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "+5 (Ekologi aman, mulai terindustrialisasi)",
        positive: true,
      },
    ],
    bgClass: "from-purple-900 via-slate-800 to-slate-900",
    borderClass: "border-purple-400",
    accentClass: "text-purple-200",
    badgeLabel: "NEGOSIATOR ULUNG",
    badgeBg: "bg-purple-600",
    icon: "📈",
  },

  ch3_B2: {
    id: "ch3_B2" as EndingId,
    title: "Pemimpin Oportunis",
    subtitle: "Jalur B2 — Jual Cepat Berkedok Sewa",
    description:
      "Panik melihat kas kosong, Anda rela membuang hak warga dan lingkungan demi suntikan dana segar secepatnya. Kas desa langsung penuh drastis, namun Anda dicap makan suap. Desa kehilangan 2 hektar tanah leluhur beserta ekologinya, dan aparat keamanan kewalahan menghadapi protes harian.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "-30 (Dicap korup dan makan suap)",
        positive: false,
      },
      { label: "Kas Desa", value: "+25 (Kas penuh drastis)", positive: true },
      {
        label: "Stabilitas",
        value: "-25 (Protes besar-besaran tiap hari)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "-20 (Tanah leluhur hilang total)",
        positive: false,
      },
    ],
    bgClass: "from-red-900 via-slate-800 to-slate-900",
    borderClass: "border-red-400",
    accentClass: "text-red-200",
    badgeLabel: "OPORTUNIS",
    badgeBg: "bg-red-600",
    icon: "💰",
  },
};

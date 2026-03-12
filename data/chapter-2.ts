// data/chapter-2.ts
// Chapter 2: Air yang Tidak Pernah Cukup
// Konsep Matematika: Volume, Debit, Waktu (V = Q x t) & Sistem Rasio Konstan

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
  id: "ch2",
  title: "Chapter 2",
  subtitle: "Air yang Tidak Pernah Cukup",
  startSceneId: "ch2_intro",
};

// =====================================================================
//  IMAGE PATH HELPERS (Placeholder)
// =====================================================================
const BG_PINTU_AIR = "/backgrounds/bendungan-desa.webp";

const CHAR_BRIPTU_ARIS = "/characters/Briptu-aris.png";
const CHAR_PAK_DARMA = "/characters/Pak-Darma.png"; // Asumsi ada karakter Pak Darma
const CHAR_SITI = "/characters/Siti.png"; // Asumsi ada karakter Siti
const CHAR_LARAS = "/characters/laras.png";

// =====================================================================
//  CHAPTER 2 SCENE DATA
// =====================================================================
export const chapter2Data: Record<string, ChapterData> = {
  // ------------------------------------------------------------------
  // PEMBUKA
  // ------------------------------------------------------------------
  ch2_intro: {
    id: "ch2_intro",
    backgroundImage: BG_PINTU_AIR,
    characterImage: "",
    characterName: "Narasi",
    text: "Siang hari yang terik menyengat di Pintu Air Utama Desa Amanah. Suara bising air yang mengalir kecil tertutup oleh teriakan dua kubu warga yang saling berhadapan. Di satu sisi, belasan petani membawa cangkul dengan wajah merah padam. Di sisi lain, rombongan ibu-ibu membawa ember dan jerigen kosong. Briptu Aris berdiri di tengah, merentangkan tangan untuk mencegah bentrok fisik.",
    nextSceneId: "ch2_aris_1",
  },

  ch2_aris_1: {
    id: "ch2_aris_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_BRIPTU_ARIS,
    characterName: "Briptu Aris",
    text: "(Berteriak menembus kebisingan) Mundur! Semua mundur dari tuas pintu air! Siapapun yang memutar tuas ini tanpa perintah Pak Kades, saya angkat ke polsek sekarang juga!",
    nextSceneId: "ch2_darma_1",
  },

  ch2_darma_1: {
    id: "ch2_darma_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_PAK_DARMA,
    characterName: "Pak Darma",
    text: "(Menancapkan cangkulnya ke tanah) Pak Kades! 40 hektar sawah kami di blok selatan sudah retak rambut! Kalau hari ini air nggak dialirkan penuh ke saluran irigasi, besok pagi padinya mati. Hitungan ruginya miliaran, Pak! Desa kita bisa bangkrut!",
    nextSceneId: "ch2_siti_1",
  },

  ch2_siti_1: {
    id: "ch2_siti_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_SITI,
    characterName: "Siti",
    text: "(Maju sambil memukul pantat jerigen kosongnya) Bangkrut apanya?! Bapak mikir padi mati, tapi mikir nggak anak-anak kami mau minum apa? Sumur di Dusun Atas sudah kering kerontang. Kalau mau mandi, kami harus beli air tangki yang harganya ugal-ugalan!",
    nextSceneId: "ch2_laras_1",
  },

  ch2_laras_1: {
    id: "ch2_laras_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "(Membuka buku catatannya) Pak, situasinya memang krisis. Debit air dari mata air hulu menyusut drastis. Saat ini, aliran air konstan kita tinggal 200 liter per detik. Masalahnya, untuk menyelamatkan 40 hektar sawah Pak Darma, irigasi butuh asupan 150 liter per detik.",
    nextSceneId: "ch2_laras_2",
  },

  ch2_laras_2: {
    id: "ch2_laras_2",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Sedangkan batas minimal agar air bersih bisa mengalir ke seluruh pipa pemukiman warga adalah 100 liter per detik. Kita defisit 50 liter per detik.",
    nextSceneId: "",
    choices: [
      {
        text: "Kita pakai sistem giliran waktu, tidak ada yang dapat aliran bersamaan. Pak Darma, sawah dapat aliran 12 jam penuh. Siti, pemukiman dapat sisa 12 jamnya. Adil kan? Volume airnya terbagi seimbang: V = Q x t.",
        nextId: "ch2_a_siti_1",
      },
      {
        text: "Kita buka kedua salurannya secara bersamaan tapi kita sunat debitnya menggunakan rasio proporsional. Sawah dapat 120 liter per detik, pemukiman dapat 80 liter per detik. Semua harus puasa sedikit.",
        nextId: "ch2_b_darma_1",
      },
    ],
  },

  // -------------------------------------------------------------------
  // Cabang A: Sistem Gilir Waktu (Logika Volume & Waktu)
  // -------------------------------------------------------------------
  ch2_a_siti_1: {
    id: "ch2_a_siti_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_SITI,
    characterName: "Siti",
    text: "Tunggu dulu, Pak Kades! Kalau digilir 12 jam, berarti pipa ke arah kampung akan kosong selama sawah diairi, kan? Begitu giliran kami tiba, air yang mengalir itu butuh waktu 2 jam cuma buat ngisi ruang kosong di sepanjang pipa bocor desa kita sampai ke rumah warga ujung!",
    nextSceneId: "ch2_a_laras_1",
  },

  ch2_a_laras_1: {
    id: "ch2_a_laras_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Mbak Siti benar, Pak. Ada delay system di sini. Kalau kita patok 12 jam di pintu air, warga secara efektif cuma menikmati air selama 10 jam. Volume total yang mereka terima lebih sedikit dari petani.",
    nextSceneId: "ch2_a_darma_1",
  },

  ch2_a_darma_1: {
    id: "ch2_a_darma_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_PAK_DARMA,
    characterName: "Pak Darma",
    text: "Ya itu derita kalian yang tinggal di atas bukit! Pokoknya saya nggak mau tahu, 12 jam irigasi itu sudah batas minimal agar air bisa sampai ke petak sawah paling ujung. Kalau dipotong lagi, laju peresapan tanah lebih cepat dari laju airnya. Padi ujung pasti mati!",
    nextSceneId: "ch2_a_aris_1",
  },

  ch2_a_aris_1: {
    id: "ch2_a_aris_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_BRIPTU_ARIS,
    characterName: "Briptu Aris",
    text: "Keputusan di tangan Bapak. Kalau dibiarkan berdebat begini, sore nanti mereka sudah baku hantam.",
    nextSceneId: "",
    choices: [
      {
        text: "Pak Darma, secara matematika sawah tidak dirugikan oleh pipa kosong. Sawah harus mengalah. Irigasi saya buka 10 jam saja, dan 14 jam untuk pemukiman agar kompensasi pipa kosongnya terbayar. Warga butuh minum!",
        nextId: "ch2_conclusion",
        effect: { trust: 15, treasury: -15, stability: 10, legacy: 0 },
      },
      {
        text: "Saya tidak mau hasil panen gagal total. Sistemnya tetap 12-12 dari pintu air ini. Siti, warga dusun atas harus menampung air saat tengah malam kalau debit sedang kuat-kuatnya. Itu risiko elevasi tanah.",
        nextId: "ch2_conclusion",
        effect: { trust: -20, treasury: 15, stability: -15, legacy: 5 },
      },
    ],
  },

  // -------------------------------------------------------------------
  // Cabang B: Sistem Rasio Konstan (Logika Limit & Tekanan)
  // -------------------------------------------------------------------
  ch2_b_darma_1: {
    id: "ch2_b_darma_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_PAK_DARMA,
    characterName: "Pak Darma",
    text: "120 liter per detik?! Pak Kades, kalau debit dikurangi jadi segitu, daya dorong air di parit irigasi nggak akan kuat melawan gravitasi! Airnya cuma bakal terserap di sawah blok depan, yang blok belakang nggak kebagian setetes pun!",
    nextSceneId: "ch2_b_laras_1",
  },

  ch2_b_laras_1: {
    id: "ch2_b_laras_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Secara teori hidrodinamika, Pak Darma benar. Begitu juga dengan pipa pemukiman. Kalau cuma dikasih 80 liter per detik, tekanannya tidak akan memecahkan batas limit untuk mendaki ke elevasi Dusun Atas. Warga di Dusun Bawah dapat air mengalir, tapi Dusun Atas pipanya cuma keluar angin.",
    nextSceneId: "ch2_b_siti_1",
  },

  ch2_b_siti_1: {
    id: "ch2_b_siti_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_SITI,
    characterName: "Siti",
    text: "Berarti sama aja bohong! Buat apa warga Dusun Atas iuran bulanan kalau yang mandi cuma orang Dusun Bawah?!",
    nextSceneId: "ch2_b_darma_2",
  },

  ch2_b_darma_2: {
    id: "ch2_b_darma_2",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_PAK_DARMA,
    characterName: "Pak Darma",
    text: "Itulah kenapa saya bilang matikan saja pipa warga! Warga bisa beli air galon darurat pakai uang kas desa, tapi padi nggak bisa disiram pakai galon!",
    nextSceneId: "",
    choices: [
      {
        text: "Kas desa kita cairkan sekarang! Laras, sewa mesin pompa diesel besar untuk mendorong tekanan pipa ke Dusun Atas meskipun debitnya cuma 80 liter per detik. Sawah tetap dapat 120 liter per detik. Semua terlayani hari ini!",
        nextId: "ch2_conclusion",
        effect: { trust: 10, treasury: -25, stability: 20, legacy: -5 },
      },
      {
        text: "Uang kas tidak bisa dihamburkan untuk sewa pompa yang mahal. Dusun Atas harus mengalah. Siti, saya perintahkan Dusun Bawah berbagi sumur darurat dengan kalian. Pintu air tetap kita bagi rasionya sekarang juga.",
        nextId: "ch2_conclusion",
        effect: { trust: -15, treasury: 10, stability: -20, legacy: 15 },
      },
    ],
  },

  // -------------------------------------------------------------------
  // Konklusi (Semua Cabang Menyatu di Sini)
  // -------------------------------------------------------------------
  ch2_conclusion: {
    id: "ch2_conclusion",
    backgroundImage: BG_PINTU_AIR,
    characterImage: "",
    characterName: "Narasi",
    text: "Tuas pintu air akhirnya diputar dengan suara besi berderit yang keras. Air yang awalnya tertahan kini terbagi sesuai dengan keputusan Kepala Desa. Sebagian mengalir membasahi parit kering menuju sawah, sebagian lagi bergemuruh masuk ke dalam pipa besar milik desa.",
    nextSceneId: "ch2_c_siti_1",
  },

  ch2_c_siti_1: {
    id: "ch2_c_siti_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_SITI,
    characterName: "Siti",
    text: "(Menarik napas panjang, menatap jerigennya lalu menatap pemain) Semoga keputusan Bapak kali ini nggak bikin anak-anak kami antre di puskesmas besok pagi karena kurang air bersih.",
    nextSceneId: "ch2_c_darma_1",
  },

  ch2_c_darma_1: {
    id: "ch2_c_darma_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_PAK_DARMA,
    characterName: "Pak Darma",
    text: "(Mengusap keringat di dahi, nada suaranya berat) Alam memang sedang tidak bersahabat, Pak Kades. Tapi ingat, kalau sampai bulan depan lumbung padi desa kosong, bapak yang harus maju berhadapan dengan tengkulak.",
    nextSceneId: "ch2_c_aris_1",
  },

  ch2_c_aris_1: {
    id: "ch2_c_aris_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_BRIPTU_ARIS,
    characterName: "Briptu Aris",
    text: "Ibu-ibu, Bapak-bapak, sudah dengar sendiri putusannya! Ayo bubar, kembali ke tempat masing-masing! (Menoleh ke pemain) Keputusan yang berisiko, Pak. Tapi setidaknya hari ini tidak ada darah yang tumpah di pintu air.",
    nextSceneId: "ch2_c_laras_1",
  },

  ch2_c_laras_1: {
    id: "ch2_c_laras_1",
    backgroundImage: BG_PINTU_AIR,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "(Mengunci buku catatannya) Saya akan panggil petugas teknis untuk memantau fluktuasi debit airnya malam ini. Tapi Pak... gara-gara krisis ini, beberapa pengusaha dari luar desa sudah mulai menawar tanah kering milik warga dengan harga murah. Kita punya masalah baru yang menunggu di meja Bapak besok pagi.",
    choices: [], // Kosong untuk men-trigger EndingScreen
  },
};

// =====================================================================
//  ENDINGS DATA
// =====================================================================
export const ENDINGS_CH2: Partial<Record<EndingId, EndingDef>> = {
  ch2_A1: {
    id: "ch2_A1" as EndingId,
    title: "Pemimpin Populis",
    subtitle: "Jalur A1 — Kompensasi Waktu / Pro-Warga",
    description:
      "Anda memahami variabel tersembunyi (delay pipa) dan mengutamakan nyawa/kebutuhan domestik di atas potensi bisnis. Warga biasa merasa sangat dibela karena logika hitungan Kades akurat membela mereka. Sayangnya, sebagian padi di ujung sawah mengalami gagal panen akibat kurangnya jam irigasi.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+15 (Warga terbantu logika Kades)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "-15 (Gagal panen sebagian)",
        positive: false,
      },
      {
        label: "Stabilitas",
        value: "+10 (Protes ibu-ibu reda sepenuhnya)",
        positive: true,
      },
      {
        label: "Warisan Budaya",
        value: "+0 (Sikap peduli diapresiasi)",
        positive: true,
      },
    ],
    bgClass: "from-blue-900 via-slate-800 to-slate-900",
    borderClass: "border-blue-400",
    accentClass: "text-blue-200",
    badgeLabel: "PRO-WARGA",
    badgeBg: "bg-blue-600",
    icon: "💧",
  },

  ch2_A2: {
    id: "ch2_A2" as EndingId,
    title: "Kalkulator Dingin",
    subtitle: "Jalur A2 — Efisiensi Kaku / Pro-Sawah",
    description:
      "Anda bertindak persis sesuai blueprint awal tanpa mempertimbangkan anomali lapangan (kebocoran pipa). Panen berhasil diselamatkan maksimal, perputaran uang desa aman. Namun, warga Dusun Atas merasa tertipu oleh hitungan 12 jam yang ternyata tidak efektif dan mulai memboikot iuran desa.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "-20 (Warga Dusun Atas merasa tertipu)",
        positive: false,
      },
      { label: "Kas Desa", value: "+15 (Panen terselamatkan)", positive: true },
      {
        label: "Stabilitas",
        value: "-15 (Boikot iuran desa dimulai)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "+5 (Reputasi lumbung padi terjaga)",
        positive: true,
      },
    ],
    bgClass: "from-green-900 via-slate-800 to-slate-900",
    borderClass: "border-green-400",
    accentClass: "text-green-200",
    badgeLabel: "PRO-BISNIS",
    badgeBg: "bg-green-600",
    icon: "🌾",
  },

  ch2_B1: {
    id: "ch2_B1" as EndingId,
    title: "Teknokrat Padat Modal",
    subtitle: "Jalur B1 — Solusi Padat Modal / Engineering Murni",
    description:
      "Anda menyelesaikan defisit fisika (limit tekanan) menggunakan suntikan modal buatan (mesin pompa). Semua pihak mendapat air seketika, dan warga kagum dengan solusi cepat Anda. Namun, pengeluaran darurat ini sangat besar dan berpotensi membahayakan keuangan desa di masa depan.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+10 (Semua pihak puas mendapat air)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "-25 (Sewa pompa menguras kas)",
        positive: false,
      },
      {
        label: "Stabilitas",
        value: "+20 (Kedua kubu langsung damai)",
        positive: true,
      },
      {
        label: "Warisan Budaya",
        value: "-5 (Bergantung pada intervensi mesin)",
        positive: false,
      },
    ],
    bgClass: "from-yellow-900 via-slate-800 to-slate-900",
    borderClass: "border-yellow-400",
    accentClass: "text-yellow-200",
    badgeLabel: "SOLUSI INSTAN",
    badgeBg: "bg-yellow-600",
    icon: "⚙️",
  },

  ch2_B2: {
    id: "ch2_B2" as EndingId,
    title: "Pemimpin Otoriter",
    subtitle: "Jalur B2 — Rasionalisasi Kuota Tertutup",
    description:
      "Anda memaksakan kebijakan rasio secara teoretis dan memaksa warga Dusun Bawah dan Atas berbagi sumur. Kas desa sangat utuh, tapi kebijakan ini memicu perkelahian baru antar tetangga. Secara paradoks, penderitaan ini memaksa warga menghidupkan kembali tradisi lama: menimba air bersama.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "-15 (Warga miskin merasa ditinggalkan)",
        positive: false,
      },
      {
        label: "Kas Desa",
        value: "+10 (Kas utuh, tidak ada pengeluaran)",
        positive: true,
      },
      {
        label: "Stabilitas",
        value: "-20 (Memicu perkelahian antar tetangga)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "+15 (Gotong royong darurat terbentuk)",
        positive: true,
      },
    ],
    bgClass: "from-red-900 via-slate-800 to-slate-900",
    borderClass: "border-red-400",
    accentClass: "text-red-200",
    badgeLabel: "TANGAN BESI",
    badgeBg: "bg-red-600",
    icon: "✊",
  },
};

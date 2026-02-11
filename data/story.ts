// src/data/story.ts

export type GameState = {
  trust: number; // Kepercayaan Warga
  stability: number; // Stabilitas Politik
  economy: number; // Kas Desa/Ekonomi

  completedChapters?: number[]; // Bab yang sudah diselesaikan
  lastSaved?: number; // Timestamp terakhir disimpan
};

export type Choice = {
  text: string;
  nextId: string;
  effect?: Partial<GameState>;
};

export type Scene = {
  id: string;
  text: string;
  characterImage: string; // Path asset di public/characters/
  characterName: string;
  backgroundImage: string; // Path asset di public/backgrounds/
  choices: Choice[];
};



const SAVE_KEY = "desa-simulator-save-v1";






export const storyData: Record<string, Scene> = {
  // ==========================================
  // CHAPTER 1: DANA BANSOS (The Onboarding)
  // ==========================================

  start: {
    id: "start",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/sekretaris.png",
    characterName: "Sekretaris Desa",
    text: "Selamat pagi, Pak Kades. Maaf mengganggu di hari pertama. Ini ada masalah mendesak soal Bantuan Langsung Tunai (BLT). Data dari pusat sepertinya... bermasalah.",
    choices: [
      { text: "Ada apa dengan datanya?", nextId: "ch1_penjelasan" },
      { text: "Duh, pagi-pagi sudah ribut.", nextId: "ch1_mengeluh" },
    ],
  },

  ch1_mengeluh: {
    id: "ch1_mengeluh",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/kades-bingung.png",
    characterName: "Pak Kades (Anda)",
    text: "(Dalam hati) Belum juga duduk enak, sudah ada masalah. Tapi mau bagaimana lagi, ini tanggung jawab.",
    choices: [{ text: "Oke, jelaskan detailnya.", nextId: "ch1_penjelasan" }],
  },

  ch1_penjelasan: {
    id: "ch1_penjelasan",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/sekretaris.png",
    characterName: "Sekretaris Desa",
    text: "Banyak warga mampu masuk daftar penerima, sedangkan buruh tani miskin malah terlewat. Warga mulai berkumpul di depan balai desa, Pak.",
    choices: [
      {
        text: "Tunda pembagian! Kita verifikasi ulang data satu per satu.",
        nextId: "ch1_solusi_tunda",
        effect: { trust: 10, stability: -5, economy: -5 },
      },
      {
        text: "Bagikan sesuai data pusat saja. Jangan cari masalah.",
        nextId: "ch1_solusi_cepat",
        effect: { trust: -15, stability: 10, economy: 0 },
      },
    ],
  },

  // Cabang A: Tunda (Ideal tapi Berisiko Demo)
  ch1_solusi_tunda: {
    id: "ch1_solusi_tunda",
    backgroundImage: "/backgrounds/demo-warga.png",
    characterImage: "/characters/kades-normal.png", // Kades menghadapi massa
    characterName: "Pak Kades (Anda)",
    text: "Saya menemui warga di depan. 'Bapak-bapak, mohon sabar! Saya tidak mau dana ini salah sasaran. Beri saya waktu 2 hari untuk mendata ulang!'",
    choices: [
      { text: "Lanjut (Seminggu Kemudian...)", nextId: "ch2_intro_good" },
    ],
  },

  // Cabang B: Cepat (Aman tapi Warga Kecewa)
  ch1_solusi_cepat: {
    id: "ch1_solusi_cepat",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/sekretaris.png",
    characterName: "Sekretaris Desa",
    text: "Baik Pak, dana sudah cair. Tapi... saya dengar banyak gunjingan di warung kopi. Bapak dianggap 'boneka pusat'.",
    choices: [
      {
        text: "Biarkan saja, yang penting tugas selesai.",
        nextId: "ch2_intro_bad",
      },
    ],
  },

  // ==========================================
  // CHAPTER 2: KRISIS AIR (Resource Conflict)
  // ==========================================

  // Intro jika Ch1 sukses
  ch2_intro_good: {
    id: "ch2_intro_good",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/kades-normal.png",
    characterName: "Narasi",
    text: "[CHAPTER 2: SUMBER PENGHIDUPAN] Warga mulai percaya padamu setelah kasus Bansos. Tapi, musim kemarau membawa masalah baru yang lebih pelik.",
    choices: [{ text: "Cek laporan masuk", nextId: "ch2_conflict" }],
  },

  // Intro jika Ch1 buruk
  ch2_intro_bad: {
    id: "ch2_intro_bad",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/kades-bingung.png",
    characterName: "Narasi",
    text: "[CHAPTER 2: SUMBER PENGHIDUPAN] Suasana desa sedang panas. Ketidakpercayaan warga masih terasa, dan sekarang ditambah masalah kekeringan.",
    choices: [{ text: "Cek laporan masuk", nextId: "ch2_conflict" }],
  },

  ch2_conflict: {
    id: "ch2_conflict",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/sekretaris.png",
    characterName: "Sekretaris Desa",
    text: "Pak, gawat! Para petani melakukan protes di balai desa. Mereka bilang aliran air ke sawah mati total karena disedot oleh Pabrik Air Minum Kemasan di hulu.",
    choices: [
      {
        text: "Panggil perwakilan Pabrik dan Petani ke sini.",
        nextId: "ch2_mediasi",
      },
      {
        text: "Saya akan temui petani langsung di luar.",
        nextId: "ch2_demo_luar",
      },
    ],
  },

  ch2_mediasi: {
    id: "ch2_mediasi",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/sekretaris.png",
    characterName: "Sekretaris Desa",
    text: "Pihak Pabrik bilang mereka sudah bayar retribusi desa (Menambah Ekonomi). Kalau ditutup, kas desa kosong. Tapi Petani mengancam bakar pabrik kalau air tidak mengalir.",
    choices: [
      {
        text: "Tutup sementara operasional Pabrik demi warga!",
        nextId: "ch2_result_pro_warga",
        effect: { trust: 20, stability: 10, economy: -30 }, // Uang habis, tapi dicintai rakyat
      },
      {
        text: "Pabrik tetap jalan. Kita beli pompa air untuk petani pakai kas desa.",
        nextId: "ch2_result_win_win",
        effect: { trust: 5, stability: 5, economy: -20 }, // Solusi tengah, boros biaya
      },
      {
        text: "Lindungi Pabrik. Mereka penyumbang ekonomi terbesar.",
        nextId: "ch2_result_pro_pabrik",
        effect: { trust: -30, stability: -20, economy: 40 }, // Kaya tapi dibenci
      },
    ],
  },

  ch2_demo_luar: {
    id: "ch2_demo_luar",
    backgroundImage: "/backgrounds/demo-warga.png",
    characterImage: "/characters/kades-bingung.png",
    characterName: "Pak Kades (Anda)",
    text: "(Di depan massa yang marah) Situasi memanas. Salah bicara sedikit saja, kantor desa bisa dilempari batu.",
    choices: [
      {
        text: "Berjanji akan menutup pabrik hari ini juga!",
        nextId: "ch2_result_pro_warga",
        effect: { trust: 25, stability: 15, economy: -30 },
      },
      {
        text: "Mencoba menenangkan dan meminta waktu negosiasi.",
        nextId: "ch2_result_gantung",
        effect: { trust: -5, stability: -5, economy: 0 },
      },
    ],
  },

  // ENDINGS CHAPTER 2
  ch2_result_pro_warga: {
    id: "ch2_result_pro_warga",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/kades-normal.png",
    characterName: "Narasi",
    text: "Keputusanmu disambut sorak sorai petani. Air kembali mengalir ke sawah. Namun, Sekretaris melapor bahwa kas desa menipis drastis tanpa setoran pabrik.",
    choices: [
      { text: "Lanjut ke Chapter 3...", nextId: "start" }, // Loop sementara ke start
    ],
  },

  ch2_result_pro_pabrik: {
    id: "ch2_result_pro_pabrik",
    backgroundImage: "/backgrounds/demo-warga.png",
    characterImage: "/characters/kades-bingung.png",
    characterName: "Narasi",
    text: "Petani bubar dengan wajah dendam. Malamnya, ada yang melempar batu ke kaca kantor desa. Ekonomi aman, tapi nyawamu mungkin tidak.",
    choices: [{ text: "Lanjut ke Chapter 3...", nextId: "start" }],
  },

  ch2_result_win_win: {
    id: "ch2_result_win_win",
    backgroundImage: "/backgrounds/kantor-desa.png",
    characterImage: "/characters/sekretaris.png",
    characterName: "Sekretaris Desa",
    text: "Solusi pompa air berhasil meredam amarah sesaat. Pabrik tetap jalan, petani bisa menyiram. Tapi anggaran desa jebol untuk beli mesin pompa.",
    choices: [{ text: "Lanjut ke Chapter 3...", nextId: "start" }],
  },

  ch2_result_gantung: {
    id: "ch2_result_gantung",
    backgroundImage: "/backgrounds/demo-warga.png",
    characterImage: "/characters/kades-bingung.png",
    characterName: "Narasi",
    text: "Warga tidak puas dengan janji manis. Mereka menduduki halaman kantor desa sampai tuntutan dipenuhi. Stabilitas desa terganggu.",
    choices: [{ text: "Kembali berunding", nextId: "ch2_mediasi" }],
  },
};

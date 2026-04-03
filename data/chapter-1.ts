// data/chapter-1.ts
// Chapter 1: Hari Pertama Amanah
// Konsep Matematika: Logika Himpunan (Irisan/Set Theory) & Rasio Proporsional

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
  id: "ch1",
  title: "Chapter 1",
  subtitle: "Hari Pertama Amanah",
  startSceneId: "ch1_intro",
};

// =====================================================================
//  IMAGE PATH HELPERS (Placeholder)
// =====================================================================
const BG_BALAI_DESA_DALAM = "/backgrounds/Kantor-Kepala-desa.webp";

const CHAR_BAYU = "/characters/Bayu-Pemuda-Kritis.png";
const CHAR_LARAS = "/characters/laras.png";
const CHAR_PAK_BAKRI = "/characters/Pak-bakri.png";
const CHAR_IBU_RATNA = "/characters/Bu-Ratna.png";
const CHAR_PAK_RT_SALIM = "/characters/Pak-RT-Salim.png";
const CHAR_BRIPTU_ARIS = "/characters/Briptu-aris.png";

// =====================================================================
//  CHAPTER 1 SCENE DATA
// =====================================================================
export const chapter1Data: Record<string, ChapterData> = {
  // ------------------------------------------------------------------
  // PEMBUKA
  // ------------------------------------------------------------------
  ch1_intro: {
    id: "ch1_intro",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: "",
    characterName: "Narasi",
    text: "Pagi yang riuh di Balai Desa Amanah. Udara terasa panas dan pengap oleh puluhan warga yang berdesakan. Di meja depan, tertumpuk 50 karung beras bantuan. Di belakang meja, terdapat sebuah papan tulis putih. Laras tampak tegang, sementara Bayu memegang tumpukan kertas hasil cetakan.",
    nextSceneId: "ch1_bayu_1",
    backgroundMusic: "tense",
    narratorAudio: "narrator-ch1-intro.mp3",
  },

  ch1_bayu_1: {
    id: "ch1_bayu_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "(Menggebrak meja perlahan) Bapak-bapak, Ibu-ibu, dengar! Logikanya nggak masuk akal! Beras di depan kita cuma 50 karung. Tapi yang hadir di sini 120 Kepala Keluarga. Kalau dibagi rata, masing-masing cuma dapat seliter. Buat apa?!",
    nextSceneId: "ch1_laras_1",
    backgroundMusic: "tense",
  },

  ch1_laras_1: {
    id: "ch1_laras_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "(Berdiri dan mengambil spidol, menggambar dua lingkaran yang saling memotong di papan tulis) Biar saya jelaskan secara administratif. Total warga yang hadir hari ini 120 KK. Tapi, sumber bantuan kita ada dua. Lingkaran pertama ini data DTKS dari Pusat, ada 80 nama. Lingkaran kedua ini data BLT Desa, ada 60 nama.",
    nextSceneId: "ch1_bayu_2",
    backgroundMusic: "tense",
  },

  ch1_bayu_2: {
    id: "ch1_bayu_2",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "(Menunjuk tajam ke arah papan tulis) Nah, itu dia penyakitnya, Laras! Kalau 80 ditambah 60 itu hasilnya 140! Kenapa yang datang cuma 120 orang? Karena ada 'irisan' data! Ada 20 keluarga kaya titipan perangkat desa lama yang namanya masuk di kedua daftar itu! Mereka dapat double!",
    nextSceneId: "ch1_pak_bakri_1",
    backgroundMusic: "tense",
  },

  ch1_pak_bakri_1: {
    id: "ch1_pak_bakri_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_PAK_BAKRI,
    characterName: "Pak Bakri",
    text: "(Maju dengan suara gemetar) Saya nggak ngerti soal irisan atau apa itu, Mas Bayu... Saya cuma tahu cucu saya empat di rumah belum makan. Nama saya nggak ada di daftar Mba Laras, karena rumah saya di ujung batas desa.",
    nextSceneId: "ch1_ibu_ratna_1",
    backgroundMusic: "tense",
  },

  ch1_ibu_ratna_1: {
    id: "ch1_ibu_ratna_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_IBU_RATNA,
    characterName: "Ibu Ratna",
    text: "Benar kata Pak Bakri. Kalau kalian cuma ribut soal daftar kertas, kalian lupa kalau tiap rumah itu jumlah perut yang harus diisinya beda-beda. Pak Bakri tanggungannya lima orang, masa disamakan dengan Kang Ujang yang bujangan?",
    nextSceneId: "",
    backgroundMusic: "tense",
    choices: [
      {
        text: "Laras, Bayu, kita bersihkan datanya sekarang menggunakan algoritma eliminasi. Coret semua 20 nama yang tumpang tindih itu agar kuotanya bisa kita berikan ke warga yang belum dapat!",
        nextId: "ch1_a_laras_1",
      },
      {
        text: "Daftar itu tidak mencerminkan realitas hari ini. Kita abaikan dulu. Kita gunakan rasio proporsional berdasarkan jumlah tanggungan keluarga. Semakin banyak mulut di rumah, porsinya semakin besar.",
        nextId: "ch1_b_laras_1",
      },
    ],
  },

  // -------------------------------------------------------------------
  // Cabang A: Jalur Logika Himpunan (Algoritma Eliminasi)
  // -------------------------------------------------------------------
  ch1_a_laras_1: {
    id: "ch1_a_laras_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Pak Kades, kalau kita mencoret 20 nama yang tumpang tindih secara sepihak, kita mengubah SK penetapan. Itu menyalahi prosedur. Kita bisa dituntut oleh mereka yang namanya ada di daftar resmi!",
    nextSceneId: "ch1_a_bayu_1",
    backgroundMusic: "tense",
  },

  ch1_a_bayu_1: {
    id: "ch1_a_bayu_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "Dituntut gimana? Secara probabilitas, 20 nama ganda ini adalah error margin dari sistem lama yang korup! Justru kalau Bapak biarkan 20 karung jatuh ke orang yang sama, efisiensi bantuan ini anjlok di bawah 50%!",
    nextSceneId: "ch1_a_pak_rt_1",
    backgroundMusic: "tense",
  },

  ch1_a_pak_rt_1: {
    id: "ch1_a_pak_rt_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_PAK_RT_SALIM,
    characterName: "Pak RT Salim",
    text: "(Mengusap keringat dingin) Waduh... Pak Kades, yang 20 nama ganda itu rata-rata tokoh masyarakat lho, Pak. Masuk akal kalau mereka dapat lebih. Kalau dicoret, besok balai desa didemo!",
    nextSceneId: "",
    backgroundMusic: "tense",
    choices: [
      {
        text: "Hukum probabilitas tidak pandang bulu, Pak RT! Laras, coret 20 nama ganda itu sekarang. Sisa 20 karung ini kita distribusikan langsung ke warga desil terbawah yang tidak masuk data, termasuk Pak Bakri.",
        nextId: "ch1_conclusion",
        effect: { trust: 15, treasury: 5, stability: -15, legacy: 0 },
      },
      {
        text: "Saya tidak mau ambil risiko hukum di hari pertama. Laras, tahan 20 karung yang datanya tumpang tindih itu sebagai 'status quo'. Bagikan dulu sisa 30 karung yang datanya bersih dan valid!",
        nextId: "ch1_conclusion",
        effect: { trust: -20, treasury: 10, stability: 15, legacy: -5 },
      },
    ],
  },

  // -------------------------------------------------------------------
  // Cabang B: Jalur Rasio & Proporsi (Logika Kemanusiaan)
  // -------------------------------------------------------------------
  ch1_b_laras_1: {
    id: "ch1_b_laras_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "Rasio proporsional? Pak, karung ini sudah dikemas per 10 kilogram dari pusat. Kalau kita bongkar untuk membagi porsi berdasarkan bobot tanggungan keluarga, kita butuh waktu sampai sore untuk menimbangnya ulang!",
    nextSceneId: "ch1_b_bayu_1",
    backgroundMusic: "tense",
  },

  ch1_b_bayu_1: {
    id: "ch1_b_bayu_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "Saya setuju dengan Bu Ratna dan Pak Kades! Kalau kita pakai rumus P = (T / Total T) * 50, yaitu Porsi sama dengan Tanggungan dibagi Total Tanggungan dikali 50 karung, itu jauh lebih presisi untuk memetakan tingkat keparahan lapar warga!",
    nextSceneId: "ch1_b_pak_bakri_1",
    backgroundMusic: "tense",
  },

  ch1_b_pak_bakri_1: {
    id: "ch1_b_pak_bakri_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_PAK_BAKRI,
    characterName: "Pak Bakri",
    text: "(Matanya berkaca-kaca) Jadi... cucu saya bisa makan hari ini, Pak?",
    nextSceneId: "ch1_b_pak_rt_1",
    backgroundMusic: "tense",
  },

  ch1_b_pak_rt_1: {
    id: "ch1_b_pak_rt_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_PAK_RT_SALIM,
    characterName: "Pak RT Salim",
    text: "Tunggu dulu! Kalau pakai rasio tanggungan, Kang Ujang yang bujangan tapi baru kena PHK malah nggak dapat apa-apa dong? Adil dari mana kalau cuma dihitung dari jumlah anak?",
    nextSceneId: "",
    backgroundMusic: "tense",
    choices: [
      {
        text: "Waktu kita sedikit. Ibu Ratna, kumpulkan ibu-ibu PKK sekarang. Kita bongkar 50 karung ini. Kita hitung ulang rasionya. Keluarga dengan lebih dari 3 tanggungan dapat 10 kg, di bawah itu dapat 5 kg. Kerjakan!",
        nextId: "ch1_conclusion",
        effect: { trust: 20, treasury: -15, stability: 0, legacy: 10 },
      },
      {
        text: "Pak RT benar, angka tanggungan tidak selalu berbanding lurus dengan krisis. Bu Ratna, Bayu, kalian berdua jadi juri. Tunjuk 50 keluarga yang paling butuh hari ini juga, saya yang tanggung jawab penuh atas deviasi datanya.",
        nextId: "ch1_conclusion",
        effect: { trust: 10, treasury: -10, stability: -10, legacy: 15 },
      },
    ],
  },

  // -------------------------------------------------------------------
  // Konklusi (Semua Cabang Menyatu di Sini)
  // -------------------------------------------------------------------
  ch1_conclusion: {
    id: "ch1_conclusion",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: "",
    characterName: "Narasi",
    text: "Keputusan mutlak telah diketuk. Sebagian warga bertepuk tangan, sementara yang lain bersungut-sungut melihat beras dibagikan dengan cara yang baru saja ditetapkan oleh sang Kepala Desa.",
    nextSceneId: "ch1_c_pak_bakri_1",
    narratorAudio: "narrator-ch1-conclusion.mp3",
    backgroundMusic: "calm",
  },

  ch1_c_pak_bakri_1: {
    id: "ch1_c_pak_bakri_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_PAK_BAKRI,
    characterName: "Pak Bakri",
    text: "(Mengangkat beban beras atau menunduk pasrah meninggalkan balai desa, tergantung hasil keputusanmu) Keputusan Bapak... akan saya ingat terus.",
    nextSceneId: "ch1_c_bayu_1",
    backgroundMusic: "calm",
  },

  ch1_c_bayu_1: {
    id: "ch1_c_bayu_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_BAYU,
    characterName: "Bayu",
    text: "(Melipat kertas datanya) Hari ini Bapak lolos dari hitung-hitungan saya. Tapi ingat, Pak, matematika tidak pernah bohong. Keputusan Bapak barusan akan tercatat di buku kas kita.",
    nextSceneId: "ch1_c_briptu_aris_1",
    backgroundMusic: "calm",
  },

  ch1_c_briptu_aris_1: {
    id: "ch1_c_briptu_aris_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_BRIPTU_ARIS,
    characterName: "Briptu Aris",
    text: "(Mendekat ke meja Kades) Situasi terkendali, Pak. Tapi saya dapat laporan dari pos jaga. Debit air di pintu irigasi dusun bawah menyusut drastis. Kayaknya besok Bapak harus siap menghitung volume air, bukan beras lagi.",
    nextSceneId: "ch1_c_laras_1",
    backgroundMusic: "calm",
  },

  ch1_c_laras_1: {
    id: "ch1_c_laras_1",
    backgroundImage: BG_BALAI_DESA_DALAM,
    characterImage: CHAR_LARAS,
    characterName: "Laras",
    text: "(Membersihkan papan tulis dengan wajah lelah) Saya akan buat laporannya ke kecamatan, Pak. Semoga angka-angka yang Bapak putuskan hari ini tidak membawa masalah baru minggu depan.",
    backgroundMusic: "calm",
    choices: [], // Kosong untuk men-trigger EndingScreen
  },
};

// =====================================================================
//  ENDINGS DATA (Untuk di-merge dengan global ENDINGS nanti)
// =====================================================================
export const ENDINGS_CH1: Partial<Record<EndingId, EndingDef>> = {
  ch1_A1: {
    id: "ch1_A1" as EndingId, // Casting kalau EndingId di types belum ada ch1_A1
    title: "Teknokrat Tegas",
    subtitle: "Jalur A1 — Eliminasi Total & Substitusi",
    description:
      "Anda bertindak sebagai pemimpin teknokrat yang berani menghapus anomali data (irisan) demi efisiensi tepat sasaran. Meskipun keputusan ini memicu konflik dengan elit desa karena nama mereka dicoret, warga miskin sangat menaruh hormat karena keadilan ditegakkan secara logis dan transparan.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+15 (Keadilan logis ditegakkan)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "+5 (Distribusi sangat efisien)",
        positive: true,
      },
      {
        label: "Stabilitas",
        value: "-15 (Konflik dengan elit desa/Pak RT)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "+0 (Sikap objektif memudarkan budaya sungkan)",
        positive: true,
      },
    ],
    bgClass: "from-blue-900 via-slate-800 to-slate-900",
    borderClass: "border-blue-400",
    accentClass: "text-blue-200",
    badgeLabel: "TEKNOKRAT",
    badgeBg: "bg-blue-600",
    icon: "📊",
  },

  ch1_A2: {
    id: "ch1_A2" as EndingId,
    title: "Birokrat Kaku",
    subtitle: "Jalur A2 — Status Quo Data Tumpang Tindih",
    description:
      "Anda memilih jalan aman sebagai birokrat yang sangat berhati-hati, menghindari risiko hukum dengan mengunci variabel yang bermasalah. Sayangnya, warga yang kelaparan marah besar karena 20 karung ditahan saat mereka sangat membutuhkan. Secara administratif ini aman dari pusat, tapi Anda dianggap berlindung di balik kertas.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "-20 (Warga marah beras ditahan)",
        positive: false,
      },
      {
        label: "Kas Desa",
        value: "+10 (Aman dari audit pusat)",
        positive: true,
      },
      {
        label: "Stabilitas",
        value: "+15 (Tokoh kaya tidak tersinggung)",
        positive: true,
      },
      {
        label: "Warisan Budaya",
        value: "-5 (Dianggap pengecut)",
        positive: false,
      },
    ],
    bgClass: "from-slate-700 via-slate-800 to-slate-900",
    borderClass: "border-slate-400",
    accentClass: "text-slate-200",
    badgeLabel: "MAIN AMAN",
    badgeBg: "bg-slate-600",
    icon: "🛡️",
  },

  ch1_B1: {
    id: "ch1_B1" as EndingId,
    title: "Reformis Sosial",
    subtitle: "Jalur B1 — Rasio Proporsional Terukur",
    description:
      "Anda tampil sebagai pemimpin reformis sosial yang menggunakan pembobotan matematika untuk keadilan distributif (Equity vs Equality). Meski menyalahi SOP pengemasan pusat dan berisiko ditegur, Anda dielu-elukan oleh keluarga besar yang miskin. Anda juga sukses menghidupkan kembali tradisi gotong royong PKK.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+20 (Sangat dicintai keluarga miskin)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "-15 (Menyalahi SOP kemasan, potensi denda)",
        positive: false,
      },
      {
        label: "Stabilitas",
        value: "+0 (Protes warga lajang diredam mayoritas)",
        positive: true,
      },
      {
        label: "Warisan Budaya",
        value: "+10 (Gotong royong PKK hidup lagi)",
        positive: true,
      },
    ],
    bgClass: "from-green-900 via-slate-800 to-slate-900",
    borderClass: "border-green-400",
    accentClass: "text-green-200",
    badgeLabel: "REFORMIS",
    badgeBg: "bg-green-600",
    icon: "⚖️",
  },

  ch1_B2: {
    id: "ch1_B2" as EndingId,
    title: "Humanis Karismatik",
    subtitle: "Jalur B2 — Triage Humanis Murni",
    description:
      "Anda adalah pemimpin karismatik yang mengutamakan penilaian darurat secara kualitatif. Keputusan diserahkan pada mufakat darurat, sebuah puncak kearifan lokal. Warga merasa dipimpin oleh manusia, bukan robot. Sayangnya, ini memicu perdebatan subjektivitas di lapangan dan membuat data laporan ke pusat menjadi cacat.",
    effects: [
      {
        label: "Kepercayaan Warga",
        value: "+10 (Dipandang berhati nurani)",
        positive: true,
      },
      {
        label: "Kas Desa",
        value: "-10 (Laporan data cacat deviasi)",
        positive: false,
      },
      {
        label: "Stabilitas",
        value: "-10 (Memicu perdebatan antar warga)",
        positive: false,
      },
      {
        label: "Warisan Budaya",
        value: "+15 (Mengedepankan mufakat)",
        positive: true,
      },
    ],
    bgClass: "from-orange-900 via-slate-800 to-slate-900",
    borderClass: "border-orange-400",
    accentClass: "text-orange-200",
    badgeLabel: "KARISMATIK",
    badgeBg: "bg-orange-600",
    icon: "❤️",
  },
};

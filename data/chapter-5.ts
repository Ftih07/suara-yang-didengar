// data/chapter-5.ts
// Chapter 5: Satu Keputusan Besar Terakhir
// Konsep Matematika: Model Pertumbuhan (Eksponensial vs. Linier) & Expected Value / Risk Assessment

import type { ChapterData, ChapterMeta, EndingDef, EndingId } from "../types/chapter-data";

// =====================================================================
//  CHAPTER METADATA
// =====================================================================
export const CHAPTER_META: ChapterMeta = {
    id: "ch5",
    title: "Chapter 5",
    subtitle: "Satu Keputusan Besar Terakhir",
    startSceneId: "ch5_intro",
};

// =====================================================================
//  IMAGE PATH HELPERS
//  Semua asset Chapter 5 menggunakan file SVG sebagai placeholder.
//  Ganti path ke PNG asli saat artwork sudah tersedia.
// =====================================================================
const BG_KANTOR_MALAM = "/backgrounds/kantor-kepala-desa-malam.png";
const CHAR_PAK_HERU = "/characters/Pak-Heru.png";
const CHAR_BAYU = "/characters/Bayu-pemuda-kritis.png";
const CHAR_PAK_DARMA = "/characters/Pak-Darma.png";
const CHAR_PAK_BAKRI = "/characters/Pak-Bakri.png";
const CHAR_MBAH_DARMO = "/characters/Mbah-Dharmo.png";
const CHAR_BRIPTU_ARIS = "/characters/Briptu-Aris.png";
const CHAR_LARAS = "/characters/Laras.png";
const CHAR_IBU_RATNA = "/characters/Bu-Ratna.png";
const CHAR_KADES = "/characters/kades-normal.png"; // reuse

// =====================================================================
//  CHAPTER 5 SCENE DATA
// =====================================================================
export const chapter5Data: Record<string, ChapterData> = {

    // ------------------------------------------------------------------
    // PEMBUKA — Narasi Masuk Balai Desa
    // ------------------------------------------------------------------
    ch5_intro: {
        id: "ch5_intro",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: '',
        characterName: "Narasi",
        text: "Malam hari di Balai Desa Amanah. Suasana tak lagi riuh oleh demonstrasi — melainkan hening yang tegang. Sebuah proyektor menyorotkan grafik garis yang menanjak tajam ke dinding. Seluruh tokoh kunci hadir. Ini adalah sidang penentuan masa depan desa.",
        nextSceneId: "ch5_pak_heru_1"
    },

    // ------------------------------------------------------------------
    // PAK HERU — Presentasi Corporate Farming (Eksponensial)
    // ------------------------------------------------------------------
    ch5_pak_heru_1: {
        id: "ch5_pak_heru_1",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_HERU,
        characterName: "Pak Heru (Konsorsium Nasional)",
        text: "Bapak-bapak, Ibu-ibu, mari kita rasional. Pertanian komunal kalian selama ini hanya menghasilkan pertumbuhan linier. Grafiknya datar, y = mx + c. Hari ini panen seratus ton, tahun depan seratus lima ton. Kalau ada hama, malah minus! Tawaran Konsorsium kami adalah Corporate Farming",
        nextSceneId: "ch5_pak_heru_2"
    },

    ch5_pak_heru_2: {
        id: "ch5_pak_heru_2",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_HERU,
        characterName: "Pak Heru (Konsorsium Nasional)",
        text: "Serahkan seluruh pengelolaan 200 hektar sawah dan lahan desa ke perusahaan kami. Dengan teknologi dan pupuk kimia modern kami, panen kalian akan tumbuh secara eksponensial, y = a . bx! Keuntungannya berlipat ganda tiap tahun!",
        nextSceneId: "ch5_bayu_1"
    },

    // ------------------------------------------------------------------
    // BAYU — Melawan dengan Expected Value
    // ------------------------------------------------------------------
    ch5_bayu_1: {
        id: "ch5_bayu_1",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_BAYU,
        characterName: "Bayu (Aktivis & Ahli Statistik)",
        text: "Jangan tertipu grafik indah itu! Pak Heru bicara soal potensi keuntungan, tapi menyembunyikan Kalkulasi Nilai Harapan (Expected Value). Berapa probabilitas panen sukses pakai bibit rekayasa genetik bapak? Taruhlah 70%.",
        nextSceneId: "ch5_bayu_2"
    },

    ch5_bayu_2: {
        id: "ch5_bayu_2",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_BAYU,
        characterName: "Bayu (Aktivis & Ahli Statistik)",
        text: "Tapi ada 30% probabilitas gagal panen total karena tanah kita tidak cocok dengan pestisida keras kalian! Kalau Expected Value-nya dihitung dengan risiko kerusakan unsur hara tanah secara permanen, desa ini sebenarnya nombok!",
        nextSceneId: "ch5_pak_darma_1"
    },

    // ------------------------------------------------------------------
    // PAK DARMA — Mendukung Deal dengan Syarat
    // ------------------------------------------------------------------
    ch5_pak_darma_1: {
        id: "ch5_pak_darma_1",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_DARMA,
        characterName: "Pak Darma (Ketua Kelompok Tani)",
        text: "Bayu, kamu jangan cuma teori! Hutang pupuk petani sudah numpuk! Kalau Pak Heru mau melunasi semua hutang kelompok tani di depan dan menjamin kita jadi pegawai tetap di tanah kita sendiri, saya setuju! Daripada tiap musim kemarau kita cekcok rebutan air",
        nextSceneId: "ch5_mbah_darmo_1"
    },

    // ------------------------------------------------------------------
    // MBAH DARMO — Suara Sejarah
    // ------------------------------------------------------------------
    ch5_mbah_darmo_1: {
        id: "ch5_mbah_darmo_1",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_MBAH_DARMO,
        characterName: "Mbah Darmo (Sesepuh Desa)",
        text: "Pegawai di tanah sendiri... Dulu",
        nextSceneId: "ch5_laras_1"
    },

    ch6_mbah_darmo_2: {
        id: "ch6_mbah_darmo_2",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_MBAH_DARMO,
        characterName: "Mbah Darmo (Sesepuh Desa)",
        text: "kakek buyut kita berdarah-darah mengusir kompeni supaya kita jadi tuan tanah, bukan kuli. Sekarang, kalian mau menyerahkan sertifikat desa hanya karena iming-iming angka yang naik ke atas?",
        nextSceneId: "ch5_laras_1"
    },

    ch5_laras_1: {
        id: "ch5_laras_1",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_LARAS,
        characterName: "Laras (Sekretaris & Bendahara Desa)",
        text: "Pak Kades, waktunya mengambil keputusan. Draf kontrak Mega-Project ini bernilai puluhan miliar. Kalau kita tanda tangan, kas desa meluap — tapi hak kelola tanah hilang selama 30 tahun.",
        nextSceneId: "ch5_laras_2"
    },

    // ------------------------------------------------------------------
    // LARAS — Menyajikan Pilihan Utama
    // ------------------------------------------------------------------
    ch5_laras_2: {
        id: "ch5_laras_2",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_LARAS,
        characterName: "Laras (Sekretaris & Bendahara Desa)",
        text: "Kalau kita tolak, kita harus bertahan dengan kas yang ada dan mencari jalan sendiri.",
        nextSceneId: '',
        choices: [
            {
                text: "Grafik eksponensial Pak Heru adalah satu-satunya cara kita melompat keluar dari kemiskinan. Kita tidak bisa menolak modernisasi. Pak Heru, saya terima tawaran Konsorsium, dengan syarat bagi hasil.",
                nextId: "ch5_a_pak_heru",
                // Efek final ditentukan oleh sub-pilihan A1/A2
            },
            {
                text: "Bayu dan Mbah Darmo benar. Risiko jangka panjangnya (Expected Value negatif) terlalu besar untuk ekologi dan identitas kita. Pak Heru, silakan matikan proyektor Anda. Kami menolak Konsorsium.",
                nextId: "ch5_b_pak_heru",
                // Efek final ditentukan oleh sub-pilihan B1/B2
            },
        ]
    },


    // ====================================================================
    //  CABANG A — JALUR KORPORATISASI DESA (Eksponensial)
    // ====================================================================

    ch5_a_pak_heru: {
        id: "ch5_a_pak_heru",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_HERU,
        characterName: "Pak Heru (Konsorsium Nasional)",
        text: "Keputusan brilian, Pak Kades! Visi Anda melampaui zaman. Nah, sekarang soal dividen. Konsorsium akan memberikan 20% dari total laba bersih setiap tahun ke kas desa. Silakan Bapak atur pembagiannya ke warga.",
        nextSceneId: "ch5_a_pak_darma"
    },

    ch5_a_pak_darma: {
        id: "ch5_a_pak_darma",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_DARMA,
        characterName: "Pak Darma (Ketua Kelompok Tani)",
        text: "Baginya harus proporsional sesuai luas tanah yang diserahkan dong! Saya punya 2 hektar, Pak Bakri cuma punya pekarangan 50 meter. Masa bagiannya sama? Secara matematika pembagian dividen ya harus berbasis persentase modal tanah (asset-weighted distribution)!",
        nextSceneId: "ch5_a_pak_bakri"
    },

    ch5_a_pak_bakri: {
        id: "ch5_a_pak_bakri",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_BAKRI,
        characterName: "Pak Bakri (Petani Kecil)",
        text: "Kalau begitu... yang kaya makin kaya, yang miskin seperti saya cuma dapat ampasnya lagi...",
        nextSceneId: "ch5_a_bayu"
    },

    ch5_a_bayu: {
        id: "ch5_a_bayu",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_BAYU,
        characterName: "Bayu (Aktivis & Ahli Statistik)",
        text: "Ini penindasan terstruktur! Pak Kades, kalau Bapak mau nekat pakai sistem perusahaan, Bapak harus terapkan Universal Basic Income (Pendapatan Dasar Universal). 20% laba itu bagi rata ke semua KK (kepala keluarga). Semua orang menanggung dampak polusi pabriknya sama rata, jadi duitnya juga harus sama rata!",
        nextSceneId: '',
        choices: [
            {
                // A1: Sosialis-Korporat / UBI — Desa kaya tapi kehilangan budaya agraris
                text: "Bayu benar. Risiko lingkungan ditanggung bersama. Laras, buat aturannya: dividen 20% itu dipukul rata ke seluruh KK tanpa melihat luas tanah yang mereka serahkan. Tidak boleh ada ketimpangan absolut di desa ini!",
                nextId: "ch5_konklusi",
                effect: { trust: 30, treasury: 40, stability: 15, legacy: -40 },
            },
            {
                // A2: Kapitalis Murni / Proporsional — Oligarki lokal, kesenjangan meledak
                text: "Maaf Pak Bakri, tapi hukum investasi adalah hukum proporsi. Pak Darma, Laras akan menghitung pembagian dividen berbasis persentase luas lahan. Siapa yang setor tanah paling besar, dia yang dapat paling banyak.",
                nextId: "ch5_konklusi",
                effect: { trust: -40, treasury: 50, stability: -30, legacy: -40 },
            },
        ]
    },


    // ====================================================================
    //  CABANG B — JALUR KEMANDIRIAN KOMUNAL (Optimalisasi Expected Value)
    // ====================================================================

    ch5_b_pak_heru: {
        id: "ch5_b_pak_heru",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_HERU,
        characterName: "Pak Heru (Konsorsium Nasional)",
        text: "Bapak akan menyesal. Saat desa-desa tetangga sudah pakai traktor otonom, warga Bapak masih akan membajak sawah pakai lumpur dan doa.",
        nextSceneId: "ch5_b_pak_darma"
    },

    ch5_b_pak_darma: {
        id: "ch5_b_pak_darma",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_DARMA,
        characterName: "Pak Darma (Ketua Kelompok Tani)",
        text: "Terus kalau ditolak, sawah kita mau dikasih makan apa, Pak Kades?! Kas desa tidak cukup untuk subsidi pupuk musim depan!",
        nextSceneId: "ch5_b_laras"
    },

    ch5_b_laras: {
        id: "ch5_b_laras",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_LARAS,
        characterName: "Laras (Sekretaris & Bendahara Desa)",
        text: "Pak Kades, kalau kita menolak, kita butuh skema Crowdfunding (Urun Dana). Kita bentuk Koperasi Mandiri. Kalau 300 KK di desa ini rutin menabung dengan deret aritmatika, bulan pertama 10 ribu, bulan kedua 20 ribu... dalam dua tahun kas koperasi kita bisa untuk beli mesin sendiri tanpa bantuan orang luar.",
        nextSceneId: "ch5_b_ibu_ratna"
    },

    ch5_b_ibu_ratna: {
        id: "ch5_b_ibu_ratna",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_IBU_RATNA,
        characterName: "Ibu Ratna (Pemuka Masyarakat)",
        text: "Itu kalau semuanya mau iuran, Laras! Masalahnya, warga sudah lelah. Kalau Kades cuma menyuruh sabar dan menabung lagi, mereka tidak akan percaya.",
        nextSceneId: "ch5_b_bayu"
    },

    ch5_b_bayu: {
        id: "ch5_b_bayu",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_BAYU,
        characterName: "Bayu (Aktivis & Ahli Statistik)",
        text: "Ini soal kemandirian pangan, Bu Ratna! Kita optimalkan lahan pekarangan tiap rumah. Kita tidak mengejar untung miliaran, kita mengejar Zero Hunger (Nol Kelaparan). Ini soal ketahanan, bukan sekadar pertumbuhan!",
        nextSceneId: '',
        choices: [
            {
                // B1: Kemandirian Kooperatif — Ekonomi lambat tapi pasti, solidaritas tinggi
                text: "Laras, jalankan skema Koperasi Mandiri. Pak Darma, Ibu Ratna, kita paksa semua warga bergotong-royong menyumbang modal awal. Kita kumpulkan rupiah demi rupiah. Pertumbuhan kita mungkin lambat dan linier, tapi tanah ini tetap milik kita seratus persen!",
                nextId: "ch5_konklusi",
                effect: { trust: 25, treasury: 10, stability: 25, legacy: 20 },
            },
            {
                // B2: Tradisionalis Ekstrem — Subsisten penuh, tertinggal tapi lestari
                text: "Kita tidak akan memaksa warga iuran di saat sulit. Mbah Darmo, pimpin kembali ritual tanam serentak. Kita kembali ke metode organik penuh warisan leluhur. Tidak perlu mengejar kuantitas panen untuk dijual, yang penting lumbung desa cukup untuk makan warga sendiri.",
                nextId: "ch5_konklusi",
                effect: { trust: 10, treasury: -30, stability: 40, legacy: 50 },
            },
        ]
    },

    // ====================================================================
    //  KONKLUSI — Semua Cabang Bertemu Di Sini
    // ====================================================================

    ch5_konklusi: {
        id: "ch5_konklusi",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_PAK_BAKRI,
        characterName: "Pak Bakri (Petani Kecil)",
        text: "(Berjalan menghampiri, tersenyum kecil) Dari beras bantuan sampai urusan pabrik raksasa... Bapak sudah menemani kami. Apa pun yang terjadi besok, setidaknya hari ini kami tahu siapa pemimpin kami yang sebenarnya.",
        nextSceneId: "ch5_farewell_mbah"
    },

    ch5_farewell_mbah: {
        id: "ch5_farewell_mbah",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_MBAH_DARMO,
        characterName: "Mbah Darmo (Sesepuh Desa)",
        text: "(Mengetukkan tongkat, berbalik menuju pintu keluar) Angin berubah, Kades. Sejarah akan menulis apakah tanganmu membangun surga untuk wargamu, atau malah membangun neraka yang indah.",
        nextSceneId: "ch5_farewell_aris"
    },

    ch5_farewell_aris: {
        id: "ch5_farewell_aris",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_BRIPTU_ARIS,
        characterName: "Briptu Aris (Petugas Keamanan)",
        text: "(Memberi hormat dengan tegap) Masa jabatan Bapak sudah menemui puncaknya. Tugas saya mengamankan desa ini telah selesai untuk periode ini. Semoga desa ini selalu amanah.",
        nextSceneId: "ch5_farewell_laras"
    },

    ch5_farewell_laras: {
        id: "ch5_farewell_laras",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_LARAS,
        characterName: "Laras (Sekretaris & Bendahara Desa)",
        text: "(Menutup buku besar, tersenyum) Data sudah final, Pak. Semua angka, semua peluang, semua tangisan dan tawa warga sudah terekam di buku ini. Selamat, Pak Kades. Bapak telah menyelesaikan perjalanan ini.",
        nextSceneId: "ch5_the_end"
    },

    // ------------------------------------------------------------------
    // AKHIR — Layar Penutup )
    // ------------------------------------------------------------------


    // ------------------------------------------------------------------
    // AKHIR — Layar Penutup (Tanpa Pilihan — Pemain Kembali ke Menu)
    // ------------------------------------------------------------------
    ch5_the_end: {
        id: "ch5_the_end",
        backgroundImage: BG_KANTOR_MALAM,
        characterImage: CHAR_KADES,
        characterName: "— THE END —",
        "nextSceneId": 'chA_ending', // Langsung ke ending utama, tanpa pilihan
        text: "(Layar perlahan meredup. Musik ambient pedesaan mengalun syahdu. Nasib Desa Amanah telah ditentukan oleh setiap keputusan yang Bapak buat sejak awal — dari beras bansos, rebutan air, sampai keputusan malam ini. Terima kasih telah bermain.)",
    },


    // Ennding dari game Chapter 5, semua jalur cerita bertemu di sini. Pilihan pemain akan mempengaruhi efek akhir yang ditampilkan di layar penutup, serta statistik akhir yang tercatat di buku besar Laras.

    chA_ending: {
        id: "chA_ending",
        backgroundImage: BG_KANTOR_MALAM,
        characterName: '— THE END —',
        characterImage: CHAR_KADES,
        text: "Setelah 5 tahun mengabdi sebagai kades, Anda memutuskan untuk tidak mencalonkan diri lagi. Desa Amanah kini menjadi desa yang makmur dengan pertanian modern, tapi kesenjangan sosialnya melebar. Anda dikenang sebagai pemimpin yang visioner tapi kontroversial.",
        nextSceneId: 'chA_end',
    },
    chA_end: {
        id: "chA_end",
        backgroundImage: BG_KANTOR_MALAM,
        characterName: '— THE END —',
        characterImage: CHAR_KADES,
        text: "Saya akan kembali ke Solo, sebagai bakyat biasa",
        choices: [],

    }


};

// ------------------------------------------------------------------
// Score Endings
export const ENDINGS: Partial<Record<EndingId, EndingDef>> = {
    ch5_A1: {
        id: "ch5_A1",
        title: "Desa Kapital Berkeadilan",
        subtitle: "Jalur A1 — Sosialis-Korporat / Pertumbuhan Adil",
        description:
            "Desa diserahkan ke korporasi asing, namun sang Kades berhasil memaksa sistem Universal Basic Income untuk warganya. Desa menjadi kaya raya — pengangguran hilang, semua perut kenyang. Namun lambat laun, beringin di alun-alun ditebang, sawah berubah jadi gudang, dan budaya gotong royong sirna. Warga bukan lagi petani yang berdaulat; mereka adalah kaum buruh konsumtif yang bergantung pada dividen korporasi.",
        effects: [
            { label: "Kepercayaan Warga", value: "+30 (Warga miskin kaya mendadak, pengangguran hilang)", positive: true },
            { label: "Kas Desa", value: "+40 (Uang masuk deras bak air bah)", positive: true },
            { label: "Stabilitas", value: "+15 (Tidak ada konflik ekonomi karena semua perut kenyang)", positive: true },
            { label: "Warisan Budaya", value: "−40 (Gotong royong punah, beringin ditebang)", positive: false },
        ],
        bgClass: "from-blue-950 via-slate-900 to-slate-950",
        borderClass: "border-blue-500",
        accentClass: "text-blue-300",
        badgeLabel: "SEJAHTERA TAPI ASING",
        badgeBg: "bg-blue-700",
        icon: "🏭",
    },
    ch5_A2: {
        id: "ch5_A2",
        title: "Desa Oligarki",
        subtitle: "Jalur A2 — Kapitalis Murni / Pertumbuhan Proporsional",
        description:
            "Sang Kades bertransformasi menjadi oligarki lokal. Hukum proporsi modal memenangkan Pak Darma dan elit desa, sementara Pak Bakri dan warga kecil hanya menonton dari pinggir pagar. Rasio Gini meroket ke angka terburuk dalam sejarah desa. Desa berubah menjadi kawasan pabrik tertutup — makmur di atas kertas, namun sarat kebencian kelas sosial yang setiap saat bisa meledak.",
        effects: [
            { label: "Kepercayaan Warga", value: "−40 (Rasio Gini terburuk, kebencian kelas meledak)", positive: false },
            { label: "Kas Desa", value: "+50 (Anggaran desa paling maksimal)", positive: true },
            { label: "Stabilitas", value: "−30 (Kriminalitas tinggi akibat kesenjangan ekstrem)", positive: false },
            { label: "Warisan Budaya", value: "−40 (Tradisi mati, desa jadi kawasan pabrik tertutup)", positive: false },
        ],
        bgClass: "from-red-950 via-slate-900 to-slate-950",
        borderClass: "border-red-600",
        accentClass: "text-red-300",
        badgeLabel: "MAKMUR TANPA JIWA",
        badgeBg: "bg-red-800",
        icon: "💰",
    },
    ch5_B1: {
        id: "ch5_B1",
        title: "Desa Mandiri",
        subtitle: "Jalur B1 — Kemandirian Kooperatif / Ekonomi Lambat tapi Pasti",
        description:
            "Jalan tengah yang sulit namun idealis. Koperasi Mandiri berdiri dengan semangat deret aritmatika — rupiah demi rupiah dikumpulkan warga. Kas mungkin pas-pasan, tapi setiap uang yang beredar tetap di dalam desa. Solidaritas warga mencapai titik tertinggi sepanjang sejarah. Inilah kombinasi yang langka: semangat gotong royong leluhur yang dipadukan dengan manajemen keuangan modern.",
        effects: [
            { label: "Kepercayaan Warga", value: "+25 (Warga bangga memiliki koperasi sendiri)", positive: true },
            { label: "Kas Desa", value: "+10 (Kas pas-pasan tapi perputaran sehat di dalam desa)", positive: true },
            { label: "Stabilitas", value: "+25 (Solidaritas warga mencapai titik tertinggi)", positive: true },
            { label: "Warisan Budaya", value: "+20 (Manajemen modern + semangat gotong royong tradisional)", positive: true },
        ],
        bgClass: "from-green-950 via-slate-900 to-slate-950",
        borderClass: "border-green-500",
        accentClass: "text-green-300",
        badgeLabel: "MANDIRI & BERMARTABAT",
        badgeBg: "bg-green-700",
        icon: "🌾",
    },
    ch5_B2: {
        id: "ch5_B2",
        title: "Desa Leluhur",
        subtitle: "Jalur B2 — Tradisionalis Ekstrem / Subsisten Penuh",
        description:
            "Sang Kades menolak keras sistem uang modern dan mengembalikan desa ke zaman barter dan subsistence farming. Mbah Darmo tersenyum di penghujung hayatnya — budaya dan ekologi alam desa tetap asri, utuh 100% tanpa tercemar pestisida kimia. Desa paling damai, tidak ada konflik berebut harta. Namun realitanya pahit: kas desa nyaris nol, desa tidak punya daya beli ke luar, dan dunia bergerak meninggalkan mereka.",
        effects: [
            { label: "Kepercayaan Warga", value: "+10 (Warga tenang, meski hidup serba kekurangan)", positive: true },
            { label: "Kas Desa", value: "−30 (Kas nyaris nol, desa tak punya daya beli keluar)", positive: false },
            { label: "Stabilitas", value: "+40 (Desa paling damai, zero konflik harta)", positive: true },
            { label: "Warisan Budaya", value: "+50 (Ekologi & budaya asri, utuh 100% tanpa pestisida)", positive: true },
        ],
        bgClass: "from-amber-950 via-stone-900 to-slate-950",
        borderClass: "border-amber-600",
        accentClass: "text-amber-300",
        badgeLabel: "LESTARI TANPA BATAS",
        badgeBg: "bg-amber-800",
        icon: "🌿",
    },
};

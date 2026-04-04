// data/chapter-4.ts
// Chapter 4: Ketidakpuasan Warga Meledak
// Konsep Matematika: Model Pertumbuhan (Eksponensial vs. Linier) & Expected Value / Risk Assessment

import type { ChapterData, ChapterMeta, EndingDef, EndingId } from "../types/chapter-data";

// =====================================================================
//  CHAPTER METADATA
// =====================================================================
export const CHAPTER_META: ChapterMeta = {
    id: "ch4",
    title: "Chapter 4",
    subtitle: "Ketidakpuasan Warga Meledak",
    startSceneId: "ch4_intro",
};

// =====================================================================

//  IMAGE PATH HELPERS
//  Semua asset Chapter 5 menggunakan file SVG sebagai placeholder.
//  Ganti path ke PNG asli saat artwork sudah tersedia.
// =====================================================================
const BG_POS_RONDA = "/backgrounds/Pos-Ronda.webp";
const BG_HALAMAN_BALAI_DESA = "/backgrounds/luar-kantor-kepala-desa.webp";

const CHAR_KADES = "/characters/kades-normal.png";
const CHAR_PAK_BAYU = "/characters/Bayu-Pemuda-Kritis.png";
const CHAR_LARAS = "/characters/laras.png";
const CHAR_BRIPTU_ARIS = "/characters/Briptu-aris.png";
const CHAR_PAK_RT_SALIM = "/characters/Pak-RT-Salim.png";
const CHAR_IBU_RATNA = "/Bu-Ratna.png";
const CHAR_PAK_BAKRI = "/characters/Pak-bakri.png";// =====================================================================
//  CHAPTER 4 SCENE DATA
// =====================================================================
export const chapter4Data: Record<string, ChapterData> = {

    // ------------------------------------------------------------------
    // PEMBUKA — Narasi Masuk Balai Desa
    // ------------------------------------------------------------------
    ch4_intro: {
        id: "ch4_intro",
        backgroundImage: BG_POS_RONDA,
        characterImage: '',
        characterName: "Narasi",
        text: `Suasana mencekam di halaman Balai Desa Amanah. Asap hitam mengepul dari ban bekas yang dibakar di dekat gerbang. Puluhan warga membawa spanduk protes bertuliskan "Kades Pro-Pemodal!" dan "Kembalikan Air Kami!". Bayu berdiri di atas kap mobil pikap dengan megafon di tangannya. Briptu Aris dan beberapa anggota Linmas bersiaga membentuk barikade di depan pintu kaca. Di dalam    ruangan, Laras mengintip dari balik tirai dengan tangan gemetar, sementara Pak RT Salim mondar-mandir panik`,
        nextSceneId: "ch4_pak_bayu_1",
        backgroundMusic: "tense",
        narratorAudio: "narrator-ch4-intro.mp3",
    },

    ch4_pak_bayu_1: {
        id: "ch4_pak_bayu_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAYU,
        characterName: "Pak Bayu",
        text: "Keluar, Pak Kades! Jangan sembunyi! Kami bawa petisi dengan 450 tanda tangan penolakan kebijakan desa! Secara statistik, ini mewakili 60% populasi orang dewasa di desa kita! Bapak sudah kehilangan legitimasi.",
        nextSceneId: "ch4_pak_bayu_2",
        backgroundMusic: "tense",
    },

    ch4_pak_bayu_2: {
        id: "ch4_pak_bayu_2",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAYU,
        characterName: "Pak Bayu",
        text: "Ketimpangan makin parah, Rasio Gini desa kita meroket karena kekayaan cuma mengumpul di elit balai desa!",
        nextSceneId: "ch4_laras_1",
        backgroundMusic: "tense",
    },

    ch4_laras_1: {
        id: "ch4_laras_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_LARAS,
        characterName: "Laras",
        text: "Pak, jangan dengarkan dia! Data Bayu itu skewed (bias)! 450 tanda tangan itu bukan sampel acak (random sampling).",
        nextSceneId: "ch4_laras_2",
        backgroundMusic: "tense",
    },

    ch4_laras_2: {
        id: "ch4_laras_2",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_LARAS,
        characterName: "Laras",
        text: "Mayoritas diambil dari satu klaster saja, yaitu Dusun Bawah yang kemarin sumurnya kering. Itu tidak merepresentasikan suara seluruh desa secara proporsional!",
        nextSceneId: "ch_4_pak_rt_salim_1",
        backgroundMusic: "tense",
    },

    ch_4_pak_rt_salim_1: {
        id: "ch_4_pak_rt_salim_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_RT_SALIM,
        characterName: "Pak RT Salim (Wakil Kades)",
        text: "Aduh... Pak Kades, mending Bapak keluar lewat pintu belakang saja. Saya dengar mereka mau menyegel balai desa. Kalau kita telepon Polres untuk minta bantuan Pasukan Anti Huru-Hara, gimana?",
        nextSceneId: "ch4_briptu_aris_1",
        backgroundMusic: "tense",
    },

    ch4_briptu_aris_1: {
        id: "ch4_briptu_aris_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_BRIPTU_ARIS,
        characterName: "Briptu Aris",
        text: "Pak Kades, saya sudah perintahkan Linmas untuk menjaga ketertiban. Tapi kalau situasi makin memanas, saya harus ambil tindakan tegas. Kita tidak bisa biarkan kerusuhan terjadi di desa ini.",
        nextSceneId: "",
        backgroundMusic: "tense",
        choices: [
            {
                text: "Saya tidak akan sembunyi dan membiarkan desa ini terbakar. Laras, bawa buku besar data desa. Kita hadapi Bayu, kita patahkan argumen statistiknya secara terbuka di depan warga.",
                nextId: "ch4_a_narator",
            },
            {
                text: "Massa sedang emosi, rasio dan logika tidak akan mempan. Laras, buka draf APBD kita sekarang. Hitung berapa persentase anggaran fisik yang bisa dipotong untuk kita jadikan 'Bailout' atau bantuan tunai darurat hari ini juga",
                nextId: "ch4_b_narator",

            }
        ],

    },

    // -------------------------------------------------------------------
    // Branch A1
    // -------------------------------------------------------------------
    ch4_a_narator: {
        id: "ch4_a_narator",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: '',
        characterName: "Narasi",
        text: "Pak Wiro melangkah keluar balai desa. Massa bersorak marah, namun Briptu Aris sigap menahan mereka. Pemain mengambil alih megafon",
        nextSceneId: "ch4_a_pak_bayu_1",
        narratorAudio: "narrator-ch4-branch-a1.mp3",
        backgroundMusic: "tense",

    },

    ch4_a_pak_bayu_1: {
        id: "ch4_a_pak_bayu_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAYU,
        characterName: "Pak Bayu",
        text: "Akhirnya berani keluar! Silakan lihat kertas ini, Pak! Ratusan orang menuntut keadilan. Bapak mau mengelak pakai rumus apa lagi sekarang?",
        nextSceneId: "ch4_a_kades_1",
        backgroundMusic: "tense",
    },

    ch4_a_kades_1: {
        id: "ch4_a_kades_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_KADES,
        characterName: "Kades",
        text: "Saya tidak mengelak, Bayu! Tapi kalau kamu mau bicara statistik, mari kita bedah. Dari 450 tanda tanganmu, 380 berasal dari Dusun Bawah. Ini namanya sampling error! Kamu tidak menghitung warga Dusun Timur yang sawahnya terselamatkan, atau buruh yang baru dapat kerja dari proyek yang kamu tentang itu!",
        nextSceneId: "ch4_a_bu_ratna_1",
        backgroundMusic: "tense",
    },

    ch4_a_bu_ratna_1: {
        id: "ch4_a_bu_ratna_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_IBU_RATNA,
        characterName: "Bu Ratna (Istri Kades)",
        text: "Betul, Pak Kades! Saya juga sudah survei kecil-kecilan di RT saya. Mayoritas warga di RT saya mendukung kebijakan pembangunan sumur itu! Mereka bilang itu membawa perubahan positif untuk desa kita!",
        nextSceneId: "ch4_a_pak_bakri_1",
        backgroundMusic: "tense",
    },

    ch4_a_pak_bakri_1: {
        id: "ch4_a_pak_bakri_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAKRI,
        characterName: "Pak Bakri (Ketua RT)",
        text: "Saya juga sudah kumpulkan data di RT saya. Hasilnya menunjukkan bahwa 70% warga di RT saya setuju dengan proyek sumur itu! Mereka bilang itu membawa perubahan positif untuk desa kita!",
        nextSceneId: "",
        backgroundMusic: "tense",
        choices: [
            {
                text: "Ibu Ratna benar. Bayu, turunkan megafonmu. Saya tantang kamu. Bawa 5 perwakilan dari 450 orang ini masuk ke ruangan saya sekarang. Kita buka data keuangan, dan kita cari solusi persentase bagi hasil desa yang adil bersama-sama. Yang lain, harap tenang!",
                nextId: "ch4_conclusion",
                effect: { trust: 15, treasury: 0, stability: 10, legacy: 5 },

            },
            {
                text: "Kalau 60% warga memang merasa saya gagal, kita selesaikan secara konstitusional! Minggu depan kita adakan pemungutan suara mini (polling mosi tidak percaya). Kalau secara proporsional saya kalah, saya sendiri yang akan bawa surat pengunduran diri ke Bupati!",
                nextId: "ch4_conclusion",
                effect: { trust: 20, treasury: -5, stability: -15, legacy: 0 }
            }
        ]
    },


    // -------------------------------------------------------------------
    // Branch B1

    ch4_b_narator: {
        id: "ch4_b_narator",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: '',
        characterName: "Narasi",
        text: "Pak Wiro memilih bertahan di dalam ruangan bersama perangkat desa, mencari solusi pragmatis menggunakan angka uang untuk memadamkan kemarahan warga.",
        nextSceneId: "ch4_b_laras_1",
        narratorAudio: "narrator-ch4-branch-b1.mp3",
        backgroundMusic: "tense",
    },

    ch4_b_laras_1: {
        id: "ch4_b_laras_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_LARAS,
        characterName: "Laras",
        text: "Pak, pos dana tak terduga kita sudah habis. Satu-satunya cara adalah memotong 30% dari proyek betonisasi jalan dan 20% dari program PKK. Total kita bisa kumpulkan Rp 150 Juta. Kalau dibagi rata ke 450 demonstran, jatuhnya sekitar Rp 333.333 per orang. Rumusnya subsidi proporsional.",
        nextSceneId: "ch4_b_pak_rt_salim_1",
        backgroundMusic: "tense",
    },

    ch4_b_pak_rt_salim_1: {
        id: "ch4_b_pak_rt_salim_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_RT_SALIM,
        characterName: "Pak RT Salim",
        text: "Waduh! Pak Kades, kalau proyek jalan disunat 30%, kontraktor dari kabupaten bisa menuntut kita! Lagian, kalau yang demo dikasih uang Rp 300 ribu, besok warga yang nggak ikut demo pasti ikut-ikutan turun ke jalan minta jatah! Ini namanya bunuh diri politik!",
        nextSceneId: "ch4_b_briptu_aris_1",
        backgroundMusic: "tense",
    },

    ch4_b_briptu_aris_1: {
        id: "ch4_b_briptu_aris_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_BRIPTU_ARIS,
        characterName: "Briptu Aris",
        text: "Saya setuju dengan Pak RT. Ini bukan solusi, Pak. Ini pemerasan berkedok demonstrasi. Kalau Bapak kasih uangnya, Bapak menciptakan moral hazard. Hukum tumpul karena Bapak takut.",
        nextSceneId: "ch4_b_bayu_1",
        backgroundMusic: "tense",
    },

    ch4_b_bayu_1: {
        id: "ch4_b_bayu_1",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAYU,
        characterName: "Pak Bayu",
        text: "Lima menit lagi, Pak Kades! Kalau tidak ada kepastian, kami akan segel balai desa ini!",
        nextSceneId: "",
        backgroundMusic: "tense",
        choices: [
            {
                text: "Ini bukan suap, ini program 'Padat Karya Tunai' dadakan. Laras, cairkan uangnya sekarang! Buat SK-nya bahwa 450 orang di depan itu kita pekerjakan untuk membersihkan saluran air desa dengan upah Rp 333 ribu. Kita bungkus secara legal agar desa tenang!",
                nextId: "ch4_conclusion",
                effect: { trust: 10, treasury: -25, stability: -10, legacy: -15 }
            },
            {
                text: "Aris benar, kita tidak bisa ditekan oleh massa yang anarkis. Anggaran harus disiplin. Aris, ambil megafon. Beri mereka peringatan mundur tiga kali. Jika menolak, bubarkan paksa menggunakan gas air mata ringan sesuai SOP kepolisian. Negara tidak boleh kalah",
                nextId: "ch4_conclusion",
                effect: { trust: -30, treasury: 10, stability: -20, legacy: -10 }
            }
        ]
    },



    // -------------------------------------------------------------------
    // Konklusi (Akhir Cerita)
    // -------------------------------------------------------------------

    ch4_conclusion: {
        id: "ch4_conclusion",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: '',
        characterName: "Narasi",
        text: "Suasana di luar Balai Desa perlahan mereda atau justru berakhir dalam pembubaran paksa, tergantung pada keputusanmu. Asap ban bekas mulai tipis, tergantikan oleh ketegangan yang lebih senyap namun mendalam.",
        nextSceneId: "ch4_conclusion_briptu_aris",
        backgroundMusic: "calm",
        narratorAudio: "narrator-ch4-conclusion.mp3",
    },

    ch4_conclusion_briptu_aris: {
        id: "ch4_conclusion_briptu_aris",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_BRIPTU_ARIS,
        characterName: "Briptu Aris",
        text: "Massa sudah bubar, Pak. Balai desa aman untuk sementara waktu. Tapi saya tidak bisa menjamin keamanan Bapak kalau malam hari berkeliling desa tanpa pengawalan.",
        nextSceneId: "ch4_conclusion_pak_bakri",
        backgroundMusic: "calm",
    },

    ch4_conclusion_pak_bakri: {
        id: "ch4_conclusion_pak_bakri",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAKRI,
        characterName: "Pak Bakri",
        text: "Mau ribut gimanapun, yang kecil tetap saja yang repot bersihin sampahnya.",
        nextSceneId: "ch4_conclusion_bayu",
        backgroundMusic: "calm",
    },

    ch4_conclusion_bayu: {
        id: "ch4_conclusion_bayu",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_PAK_BAYU,
        characterName: "Pak Bayu",
        text: "Perjuangan belum selesai. Angka tidak pernah tidur, Pak Kades.",
        nextSceneId: "ch4_conclusion_laras",
        backgroundMusic: "calm",
    },

    ch4_conclusion_laras: {
        id: "ch4_conclusion_laras",
        backgroundImage: BG_HALAMAN_BALAI_DESA,
        characterImage: CHAR_LARAS,
        characterName: "Laras",
        text: "Hari yang sangat panjang... Saya akan siapkan laporan kejadian luar biasa hari ini untuk dikirim ke kecamatan. Pak Kades, apapun hasilnya tadi, fondasi desa kita sekarang benar-benar retak. Kita harus bersiap menghadapi bulan-bulan terberat menjelang akhir tahun..",
        backgroundMusic: "calm",
        choices: []
    }
    // -------------------------------------------------------------------
    // 
}
export const ENDINGS: Partial<Record<EndingId, EndingDef>> = {
    ch4_A1: {
        id: "ch4_A1",
        title: "Mediator Demokratis",
        subtitle: "Jalur A1 — Transparansi & Musyawarah",
        description:
            "Anda memilih untuk menghadapi amarah warga dengan kepala tegak dan data terbuka. Bayu dan lima perwakilan massa masuk ke ruang rapat, dan selama tiga jam penuh Anda membedah setiap angka di buku besar Laras. Argumentasi statistik Bayu dibantah dengan data proporsional yang lebih lengkap. Di akhir pertemuan, disepakati pembentukan Tim Audit Independen yang melibatkan warga. Massa bubar dengan damai, meski skeptisisme masih terasa. Desa Amanah kini memiliki budaya baru: transparansi paksa yang memaksa setiap keputusan harus bisa dipertanggungjawabkan secara matematis. Anda dikenang sebagai pemimpin yang berani mendengar, meski harus berdebat di tengah kepungan.",
        effects: [
            { label: "Kepercayaan Warga", value: "+15 (Massa merasa dihargai)", positive: true },
            { label: "Kas Desa", value: "+0 (Anggaran tetap utuh)", positive: true },
            { label: "Stabilitas", value: "+10 (Demo berubah jadi rapat)", positive: true },
            { label: "Warisan Budaya", value: "+5 (Budaya musyawarah diperkuat)", positive: true },
        ],
        bgClass: "from-blue-900 via-slate-800 to-slate-900",
        borderClass: "border-blue-400",
        accentClass: "text-blue-200",
        badgeLabel: "KOMUNIKATOR TANGGUH",
        badgeBg: "bg-blue-600",
        icon: "🤝",
    },

    ch4_A2: {
        id: "ch4_A2",
        title: "Penjudi Demokratis",
        subtitle: "Jalur A2 — Referendum Kuantitatif",
        description:
            "Anda mempertaruhkan segalanya pada keyakinan bahwa mayoritas warga masih mendukung Anda. Minggu berikutnya, desa berubah menjadi arena kampanye mini yang memecah belah. Bayu dan pendukungnya menempel poster 'Ganti Kades', sementara Ibu Ratna dan kelompok pro-pemerintah membagi brosur 'Pertahankan Stabilitas'. Malam sebelum polling, Pak Bakri duduk sendirian di pos ronda, bingung harus memilih kotak mana. Hasil akhir: 52% mendukung Anda, 48% menolak. Anda menang tipis—terlalu tipis untuk merasa lega. Desa selamat dari kekosongan kepemimpinan, tapi retaknya kini permanen. Polarisasi sosial mencapai titik tertinggi dalam sejarah desa.",
        effects: [
            { label: "Kepercayaan Warga", value: "+20 (Warga salut dengan keberanian)", positive: true },
            { label: "Kas Desa", value: "-5 (Biaya logistik polling)", positive: false },
            { label: "Stabilitas", value: "-15 (Polarisasi ekstrem 1 minggu)", positive: false },
            { label: "Warisan Budaya", value: "+0 (Netral)", positive: true },
        ],
        bgClass: "from-purple-900 via-slate-800 to-slate-900",
        borderClass: "border-purple-400",
        accentClass: "text-purple-200",
        badgeLabel: "BERANI TAPI TERPECAH",
        badgeBg: "bg-purple-600",
        icon: "🎲",
    },

    ch4_B1: {
        id: "ch4_B1",
        title: "Politikus Pragmatis",
        subtitle: "Jalur B1 — Manuver Anggaran Darurat",
        description:
            "Anda memilih jalan pintas: uang tunai mendiamkan amarah. Laras bekerja lembur mengubah pos anggaran, dan keesokan harinya 450 nama demonstran masuk dalam daftar 'Pekerja Padat Karya Tunai Pembersihan Saluran Air Desa'. Masing-masing menerima Rp 333.333. Massa bubar dengan senyuman, megafon Bayu diam. Namun seminggu kemudian, warga yang tidak ikut demo menggedor balai desa menuntut upah serupa. Kontraktor jalan yang proyeknya dipotong 30% mengancam gugatan. Pak RT Salim menggeleng: 'Bapak menciptakan preseden berbahaya—demo dapat uang'. Stabilitas jangka pendek tercapai, tapi fondasi moral desa mulai rapuh. Kas desa terkuras drastis.",
        effects: [
            { label: "Kepercayaan Warga", value: "+10 (Demonstran senang dapat uang)", positive: true },
            { label: "Kas Desa", value: "-25 (Kas bocor hebat)", positive: false },
            { label: "Stabilitas", value: "-10 (Kecemburuan sosial baru)", positive: false },
            { label: "Warisan Budaya", value: "-15 (Moral hazard: demo=uang)", positive: false },
        ],
        bgClass: "from-yellow-900 via-slate-800 to-slate-900",
        borderClass: "border-yellow-500",
        accentClass: "text-yellow-200",
        badgeLabel: "DAMAI SESAAT",
        badgeBg: "bg-yellow-700",
        icon: "💵",
    },

    ch4_B2: {
        id: "ch4_B2",
        title: "Tangan Besi",
        subtitle: "Jalur B2 — Supremasi Hukum dengan Kekerasan",
        description:
            "Anda memilih untuk tidak tunduk pada tekanan massa. Briptu Aris keluar membawa megafon, memberikan tiga kali peringatan mundur. Massa menolak. Gas air mata ringan dilepaskan. Suasana berubah menjadi kekacauan—anak-anak menangis, ibu-ibu terbatuk-batuk, remaja melempar batu ke arah Linmas. Bayu ditangkap sementara dan dibawa ke pos polisi. Desa berhasil 'diamankan', tapi harganya mahal: foto-foto bentrokan beredar di media sosial, memalukan nama desa. Warga tidak lagi memandang balai desa sebagai rumah rakyat, melainkan benteng penguasa. Pak Bakri menatap nanar ke arah balai dari kejauhan, berkata pelan: 'Ini bukan desa yang saya kenal.' Anggaran desa selamat, tapi kepercayaan warga hancur.",
        effects: [
            { label: "Kepercayaan Warga", value: "-30 (Kades dianggap tiran)", positive: false },
            { label: "Kas Desa", value: "+10 (Anggaran terselamatkan)", positive: true },
            { label: "Stabilitas", value: "-20 (Trauma & dendam mengakar)", positive: false },
            { label: "Warisan Budaya", value: "-10 (Balai desa = benteng penguasa)", positive: false },
        ],
        bgClass: "from-red-950 via-slate-900 to-black",
        borderClass: "border-red-600",
        accentClass: "text-red-200",
        badgeLabel: "KUAT TAPI DIBENCI",
        badgeBg: "bg-red-800",
        icon: "⚔️",

    },

};
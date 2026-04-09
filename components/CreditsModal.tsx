"use client";

import React from "react";

type CreditsModalProps = {
  onClose: () => void;
};

export default function CreditsModal({ onClose }: CreditsModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="relative w-full max-w-2xl bg-[#e8d5b5] rounded-xl border-4 border-[#8c5e35] shadow-2xl p-6 md:p-8 max-h-[85vh] flex flex-col">
        {/* Ornamen Background Inner */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] rounded-lg pointer-events-none" />

        <h2 className="relative z-10 text-2xl md:text-3xl font-black text-[#3b2a1a] mb-4 text-center font-serif drop-shadow-sm border-b-2 border-[#b08d6a] pb-4 uppercase tracking-widest">
          Kredit & Informasi
        </h2>

        {/* Konten Scrollable */}
        <div className="relative z-10 overflow-y-auto pr-2 space-y-6 text-[#5a4027] font-serif custom-scrollbar pb-4">
          
          {/* Ucapan Selamat & Konteks */}
          <div className="bg-[#d4bc96]/40 p-4 rounded-lg shadow-sm border border-[#b08d6a]/50 text-center">
            <p className="font-bold text-lg mb-2">🎉 Selamat Bermain! 🎉</p>
            <p className="text-sm leading-relaxed">
              Game ini merupakan proyek kolaborasi Penilaian Sumatif Akhir Jenjang (PSAJ) dari mata pelajaran <b>Matematika, Pendidikan Pancasila dan Kewarganegaraan (PKN), dan Seni Budaya (SBD)</b>.
            </p>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <h3 className="font-bold text-[#8c5e35] text-lg mb-2 border-b border-[#b08d6a]/30 pb-1">Deskripsi Proyek</h3>
            <ul className="text-sm space-y-1 mb-4">
              <li><b>Nama Proyek:</b> Game "Suara Yang Didengar"</li>
              <li><b>Jenis Game:</b> Simulasi dialog berbasis pilihan (<i>choice-based narrative game</i>).</li>
              <li><b>Tema Utama:</b> Kepemimpinan, musyawarah, dan keadilan sosial di lingkungan pedesaan.</li>
            </ul>
            <div className="text-sm space-y-3 text-justify leading-relaxed">
              <p>
                Game "Suara Yang Didengar" menempatkan pemain sebagai <b>Kepala Desa</b> yang baru menjabat. Tugas utama pemain adalah memimpin rapat/musyawarah desa untuk menyelesaikan berbagai permasalahan kompleks, seperti pembagian sumber daya desa (bantuan sosial, lahan, air, atau anggaran pembangunan).
              </p>
              <p>
                Setiap masalah disajikan melalui sesi dialog di mana pemain harus memilih opsi kebijakan atau sikap kepemimpinan tertentu. Tidak ada pilihan yang sepenuhnya benar atau salah; setiap keputusan memiliki kelebihan dan risiko jangka panjang. Konsekuensi dari setiap pilihan pemain akan secara langsung memengaruhi empat pilar utama desa (Sistem Status Desa): <b>Public Trust, Treasury, Stability, dan Legacy</b>.
              </p>
              <p className="font-bold text-[#8c5e35] mt-2">Tujuan Pembelajaran:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Melatih kemampuan pengambilan keputusan dan <i>problem solving</i>.</li>
                <li>Menanamkan nilai musyawarah dan keadilan sosial.</li>
                <li>Memberikan pemahaman tentang kompleksitas kepemimpinan di tingkat lokal.</li>
              </ul>
              <p className="italic text-xs mt-2 opacity-80">
                Game ini cocok digunakan sebagai media pembelajaran interaktif yang mengajak pemain memahami pentingnya kepemimpinan yang bertanggung jawab dan berpihak pada kepentingan bersama.
              </p>
            </div>
          </div>

          {/* Tim Pengembang */}
          <div>
            <h3 className="font-bold text-[#8c5e35] text-lg mb-3 border-b border-[#b08d6a]/30 pb-1">Tim Pengembang</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-[#d4bc96]/30 p-3 rounded-md">
                <p className="font-bold text-[#3b2a1a] mb-1">💻 Developers</p>
                <ul className="list-inside">
                  <li>• Naufal Fathi Rizqy Fadhilah</li>
                  <li>• Muhammad Attala Satya</li>
                </ul>
              </div>
              <div className="bg-[#d4bc96]/30 p-3 rounded-md">
                <p className="font-bold text-[#3b2a1a] mb-1">🎨 Designers</p>
                <ul className="list-inside">
                  <li>• Nail Ghazali</li>
                  <li>• Muhammad Shidiq Wicaksono</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ucapan Terima Kasih */}
          <div className="text-center pt-4">
            <p className="italic font-bold text-[#8c5e35]">
              "Terima kasih telah bermain dan mendengarkan suara warga."
            </p>
          </div>
        </div>

        {/* Tombol Tutup */}
        <div className="relative z-10 mt-6 flex justify-center shrink-0">
          <button
            onClick={onClose}
            className="
              bg-gradient-to-b from-[#8c5e35] to-[#5a4027]
              hover:from-[#7a502a] hover:to-[#4a331e]
              text-[#fcedd9] font-black text-lg font-serif
              px-10 py-2 md:py-3 rounded-lg
              border-b-4 border-[#3b2a1a]
              active:border-b-0 active:translate-y-1
              transition-all shadow-md tracking-wider
            "
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
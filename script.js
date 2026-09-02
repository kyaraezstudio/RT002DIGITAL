const PENGUMUMAN = [
  {
    tag: "Penting",
    tanggal: "2 Sep 2026",
    judul: "Jadwal Kerja Bakti Bulanan",
    ringkas: "Kerja bakti Minggu, 7 September 2026 pukul 07.00 WIB. Mohon kehadiran seluruh warga.",
    isi: "Kerja bakti lingkungan RT 002 akan dilaksanakan hari Minggu, 7 September 2026 pukul 07.00 WIB. Titik kumpul di balai RT. Mohon membawa sapu, cangkul, atau karung sesuai kemampuan. Kehadiran seluruh warga sangat diharapkan.",
  },
  {
    tag: "Iuran",
    tanggal: "1 Sep 2026",
    judul: "Pengingat Iuran Bulanan",
    ringkas: "Warga yang belum menyetor iuran Agustus dimohon menghubungi bendahara Ibu Suparmi.",
    isi: "Bagi warga yang belum menyetor iuran bulan Agustus, dimohon segera menghubungi bendahara RT Ibu Suparmi. Pembayaran bisa tunai atau transfer. Bukti setoran akan dicatat di buku kas RT.",
  },
  {
    tag: "Rapat",
    tanggal: "28 Agu 2026",
    judul: "Rapat Koordinasi RT",
    ringkas: "Rapat koordinasi pengurus dan perwakilan warga. Agenda: evaluasi dan rencana bulan depan.",
    isi: "Rapat koordinasi pengurus dan perwakilan warga membahas evaluasi kegiatan, laporan keuangan singkat, dan usulan program bulan depan. Tempat: balai RT.",
  },
];

const KEGIATAN = [
  {
    tanggal: "7 September 2026",
    jam: "07.00 WIB",
    judul: "Kerja Bakti Lingkungan",
    isi: "Membersihkan saluran air, taman, dan area umum RT. Bawa alat masing-masing.",
    kategori: "Lingkungan",
  },
  {
    tanggal: "14 September 2026",
    jam: "19.30 WIB",
    judul: "Rapat Warga Bulanan",
    isi: "Pembahasan program kerja, keuangan, dan usulan warga di balai RT.",
    kategori: "Rapat",
  },
  {
    tanggal: "21 September 2026",
    jam: "16.00 WIB",
    judul: "Posyandu dan Pemeriksaan Kesehatan",
    isi: "Kegiatan posyandu untuk balita dan lansia. Datang tepat waktu.",
    kategori: "Kesehatan",
  },
];

const html = document.documentElement;
const header = document.getElementById("header");
const menuBtn = document.getElementById("menu-btn");
const mobileNav = document.getElementById("mobile-nav");
const themeBtn = document.getElementById("theme-btn");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");
const modalBody = document.getElementById("modal-body");
const listEl = document.getElementById("pengumuman-list");
const filterEl = document.getElementById("filters");
const kegiatanEl = document.getElementById("kegiatan-list");

const stored = localStorage.getItem("rt-theme");
const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (stored === "dark" || (!stored && preferDark)) html.classList.add("dark");

themeBtn.addEventListener("click", () => {
  html.classList.toggle("dark");
  localStorage.setItem("rt-theme", html.classList.contains("dark") ? "dark" : "light");
});

menuBtn.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("is-open");
  header.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
});

mobileNav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    header.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}, { passive: true });

PENGUMUMAN.forEach((item, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card";
  btn.innerHTML = `
    <div class="meta"><span class="chip">${item.tag}</span><span class="muted">${item.tanggal}</span></div>
    <h3>${item.judul}</h3>
    <p>${item.ringkas}</p>
    <span class="more">Baca selengkapnya</span>`;
  btn.addEventListener("click", () => openModal(i));
  listEl.appendChild(btn);
});

function openModal(i) {
  const item = PENGUMUMAN[i];
  modalMeta.textContent = `${item.tag} · ${item.tanggal}`;
  modalTitle.textContent = item.judul;
  modalBody.textContent = item.isi;
  modal.classList.add("is-open");
}

function closeModal() {
  modal.classList.remove("is-open");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

const FILTERS = ["Semua", "Lingkungan", "Rapat", "Kesehatan"];
let current = "Semua";

function renderFilters() {
  filterEl.innerHTML = "";
  FILTERS.forEach((f) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "filter" + (f === current ? " is-on" : "");
    b.textContent = f;
    b.addEventListener("click", () => {
      current = f;
      renderFilters();
      renderKegiatan();
    });
    filterEl.appendChild(b);
  });
}

function renderKegiatan() {
  const items = current === "Semua" ? KEGIATAN : KEGIATAN.filter((k) => k.kategori === current);
  kegiatanEl.innerHTML = items.map((k) => `
      <article class="event">
        <div class="meta">
          <strong>${k.tanggal}</strong>
          <span class="chip">${k.jam}</span>
          <span class="muted">${k.kategori}</span>
        </div>
        <h3>${k.judul}</h3>
        <p>${k.isi}</p>
      </article>`).join("");
}

renderFilters();
renderKegiatan();

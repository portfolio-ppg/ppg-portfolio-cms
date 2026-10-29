// One-time content update for /seminar-pendidikan-profesi-guru only:
// richer "Tentang Saya", the new Inspirasi / Visi Pribadi / Komitmen
// sections, the reworked Visi section, both marquees, and the
// "Mocha" theme.
// Every other portfolio is left untouched. Logos are uploaded via the CMS.
//
// Usage:
//   local data/   : node scripts/update-elva-content.mjs
//   Vercel Blob   : node --env-file=.env scripts/update-elva-content.mjs
// A backup of the portfolio JSON as it was is written to backups/ first.

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { put, head } from "@vercel/blob";

const USERNAME = "seminar-pendidikan-profesi-guru";
const FILE = `portfolios/${USERNAME}.json`;
const token = process.env.BLOB_READ_WRITE_TOKEN;

const content = {
  description:
    "<p>Hello! Saya <strong>Elva Arini Mardatillah</strong>, mahasiswi Pendidikan Profesi Guru (PPG) Prajabatan di Universitas Mahasaraswati Denpasar. Tumbuh besar di Sumbawa Barat — <em>a small regency blessed with breathtaking nature</em> — mengajarkan saya arti kesederhanaan, kerja keras, dan rasa syukur.</p>" +
    "<p>Bagi saya, <em>teaching is not just about transferring knowledge, it’s about touching hearts and shaping futures</em>. Nilai-nilai dari kampung halaman itulah yang saya bawa dalam perjalanan menjadi seorang pendidik: tulus mendampingi murid belajar, tetap rendah hati, dan selalu penuh rasa ingin tahu.</p>" +
    "<p>Saya percaya bahwa <em>every child is unique and deserves to be seen</em>. Karena itu, saya terus belajar merancang pembelajaran yang bermakna, menyenangkan, dan berpihak pada murid — <em>because a good teacher never stops learning</em>.</p>",

  inspirasi: {
    label: "Inspirasi & Tujuan",
    title: "Mengapa Saya Memilih Menjadi Guru",
    body:
      "<p>Inspirasi terbesar saya datang dari guru-guru di kampung halaman, Sumbawa Barat — sosok sederhana yang dengan sabar dan tulus membuka jendela dunia bagi murid-muridnya, meski dengan fasilitas yang terbatas. Dari merekalah saya belajar bahwa seorang guru mampu mengubah arah hidup seorang anak.</p>" +
      "<p>Tujuan saya menjadi guru adalah:</p>" +
      "<ul>" +
      "<li>Menghadirkan pembelajaran yang bermakna dan menyenangkan bagi setiap murid.</li>" +
      "<li>Membantu setiap anak menemukan dan mengembangkan potensi terbaik dalam dirinya.</li>" +
      "<li>Menanamkan nilai karakter seperti kejujuran, kerja keras, empati, dan rasa syukur.</li>" +
      "<li>Ikut berkontribusi memeratakan kualitas pendidikan, termasuk bagi anak-anak di daerah seperti kampung halaman saya.</li>" +
      "</ul>" +
      "<blockquote>“To teach is to touch a life forever.”</blockquote>",
  },

  visiMisiLabel: "Visi",
  visiMisiTitle: "Visi untuk Pendidikan Indonesia",
  visiMisi:
    "<p>Mewujudkan pendidikan Indonesia yang inklusif, berkualitas, dan berkeadilan bagi seluruh peserta didik tanpa terkecuali. Pendidikan menjadi ruang yang aman, nyaman, dan bermakna untuk mengembangkan potensi, karakter, kreativitas, serta kemampuan berpikir kritis setiap anak. Melalui pembelajaran yang berpusat pada peserta didik, pemanfaatan teknologi, dan penghargaan terhadap keberagaman, pendidikan Indonesia diharapkan mampu melahirkan generasi yang cerdas, berkarakter, mandiri, berdaya saing, serta siap menghadapi tantangan masa depan.</p>" +
    "<blockquote>“Setiap Anak Berhak Belajar, Setiap Potensi Layak Berkembang, dan Setiap Perbedaan Adalah Kekuatan.”</blockquote>",

  visiPribadi: {
    label: "Visi Pribadi",
    title: "Visi Pribadi Saya sebagai Calon Guru",
    body:
      "<p>Menjadi guru yang inspiratif, profesional, dan berintegritas, yang mampu menciptakan pembelajaran yang bermakna, menyenangkan, dan inklusif bagi setiap peserta didik. Saya ingin menjadi pendidik yang tidak hanya berfokus pada pencapaian akademik, tetapi juga menghargai setiap proses belajar, memahami kebutuhan dan potensi setiap anak, serta menanamkan nilai-nilai karakter, empati, dan kemandirian. Melalui pembelajaran yang kreatif, adaptif, dan berpusat pada peserta didik, saya berkomitmen untuk terus belajar dan berkembang agar dapat menjadi guru yang mampu membuka kesempatan bagi setiap anak untuk tumbuh, percaya diri, dan meraih masa depannya.</p>" +
      "<blockquote>“Menjadi guru bukan sekadar mengajarkan ilmu, tetapi juga menumbuhkan harapan, menghargai perbedaan, dan membantu setiap anak menemukan potensi terbaik dalam dirinya.”</blockquote>",
  },

  komitmen: {
    label: "Komitmen",
    title: "Komitmen Saya dalam Mewujudkan Visi Pendidikan",
    body:
      "<p>Saya berkomitmen untuk menjadi guru yang profesional, reflektif, dan berpihak pada peserta didik. Komitmen ini saya wujudkan melalui beberapa langkah nyata, yaitu:</p>" +
      "<ol>" +
      "<li><strong>Mengutamakan kebutuhan peserta didik</strong> dengan memahami karakteristik, minat, kemampuan, dan kebutuhan belajar setiap anak.</li>" +
      "<li><strong>Menciptakan pembelajaran yang bermakna dan menyenangkan</strong> melalui metode kreatif, inovatif, serta pemanfaatan teknologi yang sesuai.</li>" +
      "<li><strong>Mewujudkan pendidikan inklusif</strong> dengan menghargai keberagaman dan memberikan kesempatan belajar yang adil bagi setiap peserta didik tanpa diskriminasi.</li>" +
      "<li><strong>Melaksanakan asesmen secara menyeluruh</strong> dengan memperhatikan proses, perkembangan, dan hasil belajar sebagai dasar perbaikan pembelajaran.</li>" +
      "<li><strong>Menanamkan karakter dan nilai kemanusiaan</strong> seperti kejujuran, tanggung jawab, empati, kemandirian, dan sikap saling menghargai.</li>" +
      "<li><strong>Terus mengembangkan kompetensi diri</strong> melalui refleksi, evaluasi, kolaborasi, dan pembelajaran berkelanjutan agar mampu menjawab kebutuhan pendidikan yang terus berkembang.</li>" +
      "</ol>" +
      "<p>Melalui komitmen tersebut, saya ingin menjadi guru yang tidak hanya mentransfer ilmu, tetapi juga mendampingi setiap peserta didik untuk mengenali potensinya, membangun kepercayaan diri, dan meraih masa depan yang lebih baik.</p>",
  },
};

// Warm cream + coffee-brown look (template "mocha" in src/lib/templates.ts),
// Playfair Display headings, and floating soft cards.
const appearance = {
  templateId: "mocha",
  fontId: "playfair-jakarta",
  layoutId: "soft-card",
  paletteType: "solid",
  backgroundColor: "#f6f2ee",
  backgroundColorDeep: "#ede6df",
  textColor: "#3b2a22",
  textColorSoft: "#6e5d54",
  solidColor: "#8b6b5c",
  gradientFrom: "#5c4033",
  gradientTo: "#8b6b5c",
  borderColor: "#e4d9cf",
  surfaceColor: "#fbf9f7",
  marqueeTop: ["PPG Prajabatan", "Universitas Mahasaraswati Denpasar"],
  marqueeBottom: ["PPG Prajabatan", "Universitas Mahasaraswati Denpasar"],
};

async function read() {
  if (!token) return readFile(path.join(process.cwd(), "data", FILE), "utf-8");
  const meta = await head(FILE, { token });
  const res = await fetch(`${meta.url}?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${FILE}: ${res.status}`);
  return res.text();
}

async function write(json) {
  if (!token) return writeFile(path.join(process.cwd(), "data", FILE), json);
  await put(FILE, json, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
}

async function main() {
  const target = token ? "Vercel Blob" : "local data/";
  const raw = await read();

  await mkdir("backups", { recursive: true });
  const backup = path.join("backups", `${USERNAME}-${Date.now()}.json`);
  await writeFile(backup, raw);
  console.log(`Backup of current ${target} copy: ${backup}`);

  const portfolio = JSON.parse(raw);
  portfolio.profile = { ...portfolio.profile, ...content };
  portfolio.appearance = { ...portfolio.appearance, ...appearance };
  portfolio.updatedAt = new Date().toISOString();

  await write(JSON.stringify(portfolio, null, 2));
  console.log(`Updated ${FILE} in ${target}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

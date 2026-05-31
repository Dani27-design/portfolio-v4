/**
 * One-time seed script to migrate static data into Firestore.
 *
 * Usage:
 *   1. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local
 *   2. Run: npx tsx scripts/seed-firestore.ts
 *
 * This script is idempotent — it uses fixed document IDs so re-running overwrites existing data.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin credentials in .env.local');
  console.error('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});

const db = getFirestore();
const now = new Date().toISOString();

// ─────────────────────────────────────────────
// PROJECTS
// Source: Actual work from CV
// ─────────────────────────────────────────────
const projects = [
  {
    id: 'omnichannel-marketplace-platform',
    slug: 'omnichannel-marketplace-platform',
    name: {
      en: 'Omnichannel Marketplace Platform',
      id: 'Platform Marketplace Omnichannel',
    },
    desc: {
      en: 'Built an Omnichannel One Gate Solution Marketplace for online store management. Integrated with Shopee, Lazada, Tokopedia, and TikTokShop Open API Marketplace for centralized product listing, order sync, and inventory management.',
      id: 'Membangun Platform Marketplace Omnichannel One Gate Solution untuk manajemen toko online. Terintegrasi dengan Shopee, Lazada, Tokopedia, dan TikTokShop Open API Marketplace untuk listing produk terpusat, sinkronisasi pesanan, dan manajemen inventaris.',
    },
    tech: ['React TypeScript', 'Node.js', 'Express', 'Firebase', 'Redis', 'REST API'],
    status: 'PRODUCTION',
    order: 1,
  },
  {
    id: 'fulfilment-app',
    slug: 'fulfilment-app',
    name: {
      en: 'Fulfilment App Server & Mobile',
      id: 'Aplikasi Fulfilment Server & Mobile',
    },
    desc: {
      en: 'Developed a Fulfilment application with server and mobile components for warehouse operations. Implemented real-time communication using MQTT and RabbitMQ message broker for order processing and shipment tracking.',
      id: 'Mengembangkan aplikasi Fulfilment dengan komponen server dan mobile untuk operasi gudang. Mengimplementasikan komunikasi real-time menggunakan message broker MQTT dan RabbitMQ untuk pemrosesan pesanan dan pelacakan pengiriman.',
    },
    tech: ['React Native', 'MQTT', 'RabbitMQ', 'REST API', 'Node.js'],
    status: 'PRODUCTION',
    order: 2,
  },
  {
    id: 'port-information-system',
    slug: 'port-information-system',
    name: {
      en: 'Port Information System',
      id: 'Sistem Informasi Pelabuhan',
    },
    desc: {
      en: 'Engineered a Port Information System across web and Android platforms for enterprise client. Built with React TypeScript on the frontend, Node.js backend, and PostgreSQL database with Prisma ORM for type-safe data access.',
      id: 'Merekayasa Sistem Informasi Pelabuhan lintas platform web dan Android untuk klien perusahaan. Dibangun dengan React TypeScript di frontend, backend Node.js, dan database PostgreSQL dengan Prisma ORM untuk akses data type-safe.',
    },
    tech: ['React TypeScript', 'Node.js', 'Capacitor', 'Android Studio', 'Prisma ORM', 'PostgreSQL'],
    status: 'DEPLOYED',
    order: 3,
  },
  {
    id: 'company-management-dashboard',
    slug: 'company-management-dashboard',
    name: {
      en: 'Company Management Dashboard',
      id: 'Dashboard Manajemen Perusahaan',
    },
    desc: {
      en: 'Developed a corporate website and admin dashboard with multi-language support, SEO optimization, and management features for products, contracts, customers, and maintenance tracking.',
      id: 'Mengembangkan website perusahaan dan dashboard admin dengan dukungan multi-bahasa, optimasi SEO, dan fitur manajemen produk, kontrak, pelanggan, dan pelacakan maintenance.',
    },
    tech: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    status: 'PRODUCTION',
    order: 4,
  },
  {
    id: 'firecheck-mobile-app',
    slug: 'firecheck-mobile-app',
    name: {
      en: 'FireCheck Mobile App',
      id: 'Aplikasi Mobile FireCheck',
    },
    desc: {
      en: 'Built an inspection mobile application with Firebase integration featuring QR code scanning, location tracking, photo documentation, and real-time push notifications for field operations.',
      id: 'Membangun aplikasi mobile inspeksi terintegrasi Firebase dengan fitur QR scan, pelacakan lokasi, dokumentasi foto, dan notifikasi push real-time untuk operasi lapangan.',
    },
    tech: ['React Native', 'Firebase', 'TypeScript'],
    status: 'PRODUCTION',
    order: 5,
  },
  {
    id: 'warehouse-management-system',
    slug: 'warehouse-management-system',
    name: {
      en: 'Warehouse Management System',
      id: 'Sistem Manajemen Gudang',
    },
    desc: {
      en: 'Developed a web-based Warehouse Management System for enterprise client handling inventory tracking, stock movements, and logistics coordination with a React TypeScript frontend and PostgreSQL backend.',
      id: 'Mengembangkan Sistem Manajemen Gudang berbasis web untuk klien perusahaan yang menangani pelacakan inventaris, pergerakan stok, dan koordinasi logistik dengan frontend React TypeScript dan backend PostgreSQL.',
    },
    tech: ['React TypeScript', 'Tailwind CSS', 'Node.js', 'Prisma ORM', 'PostgreSQL'],
    status: 'DEPLOYED',
    order: 6,
  },
];

// ─────────────────────────────────────────────
// BLOGS
// ─────────────────────────────────────────────
const blogs = [
  {
    id: 'memahami-mqtt-untuk-developer',
    slug: 'memahami-mqtt-untuk-developer',
    title: {
      en: 'Understanding MQTT: A Lightweight Protocol That Deserves More Attention',
      id: 'Memahami MQTT: Protokol Ringan yang Layak Mendapat Perhatian Lebih',
    },
    excerpt: {
      en: 'A practical look at MQTT from a developer perspective — how publish-subscribe works, choosing the right QoS level, and lessons I learned from real implementation mistakes.',
      id: 'Pandangan praktis tentang MQTT dari sudut pandang developer — bagaimana publish-subscribe bekerja, memilih level QoS yang tepat, dan pelajaran dari kesalahan implementasi yang pernah saya alami.',
    },
    content: `# Memahami MQTT: Protokol Ringan yang Layak Mendapat Perhatian Lebih

Awalnya saya tidak terlalu menaruh perhatian pada MQTT. Bagi saya waktu itu, HTTP sudah cukup untuk kebanyakan kebutuhan komunikasi antar service. Pandangan ini berubah ketika saya menghadapi kebutuhan membangun sistem yang menghubungkan server dengan banyak perangkat secara real-time — di mana polling setiap beberapa detik jelas bukan opsi yang efisien. Di situlah saya mulai mendalami MQTT, dan ternyata protokol ini jauh lebih menarik dari yang saya perkirakan.

Tulisan ini saya buat berdasarkan apa yang saya pelajari dan alami. Bukan teori dari dokumentasi saja, tapi termasuk kesalahan yang pernah saya buat dan bagaimana saya mengatasinya.

## Sekilas Tentang MQTT

MQTT (Message Queuing Telemetry Transport) adalah protokol messaging yang sangat ringan. Kalau HTTP itu seperti mengirim surat resmi — ada amplop, ada format, ada prosedur balasan — maka MQTT lebih seperti mengirim pesan singkat. Kecil, cepat, dan langsung sampai.

Yang membuat MQTT berbeda adalah pola **publish-subscribe** yang digunakannya. Tidak ada konsep "client mengirim request ke server lalu menunggu response". Yang ada adalah: satu pihak publish pesan ke sebuah topik, dan semua pihak yang subscribe ke topik tersebut otomatis menerima pesan itu. Mereka bahkan tidak perlu tahu siapa yang mengirim.

Protokol ini awalnya dibuat tahun 1999 untuk monitoring pipa minyak lewat koneksi satelit. Koneksinya lambat, bandwidth-nya terbatas, tapi data harus tetap sampai. Kalau MQTT bisa beroperasi di kondisi seperti itu, kebanyakan skenario aplikasi modern seharusnya bisa dia tangani dengan baik.

## Pola Publish-Subscribe dalam Praktik

Cara paling mudah memahami publish-subscribe adalah dengan membayangkan sebuah papan pengumuman digital. Siapapun bisa menempel pengumuman (publish), dan siapapun yang memantau papan tersebut (subscribe) akan langsung melihat pengumuman baru.

Contoh sederhananya:

\`\`\`
Device A publish ke: building/floor-2/temperature
Device B subscribe ke: building/floor-2/temperature
\`\`\`

Device B menerima data tanpa perlu tahu Device A ada. Begitu juga sebaliknya. Decoupling seperti ini memberikan fleksibilitas yang besar — kita bisa menambah atau mengurangi publisher dan subscriber tanpa mengubah kode di sisi lain.

Dalam pengalaman saya, pola ini sangat efektif untuk skenario di mana banyak perangkat perlu menerima informasi yang sama secara bersamaan. Tidak ada polling, tidak ada bandwidth terbuang, dan tidak ada delay dari mekanisme "tanya-jawab" yang berulang.

## Memahami QoS — Bagian yang Sering Terlewat

Satu hal yang menurut saya wajib dipahami sebelum implementasi MQTT adalah mekanisme Quality of Service (QoS). Ada tiga level, dan memilih yang tepat cukup berpengaruh terhadap performa dan reliability sistem.

**QoS 0** mengirim pesan satu kali tanpa konfirmasi. Terdengar tidak reliable, tapi justru cocok untuk data yang terus mengalir seperti pembacaan sensor — kalau satu terlewat, data berikutnya sudah siap menggantikan.

**QoS 1** memastikan pesan sampai minimal satu kali. Ada mekanisme retry sampai penerima mengirim acknowledgment. Ini level yang paling sering saya gunakan. Kalaupun ada duplikasi, biasanya bisa ditangani di sisi penerima dengan pengecekan idempotency.

**QoS 2** menjamin pesan diterima tepat satu kali melalui four-step handshake. Diperlukan untuk kasus di mana duplikasi benar-benar tidak boleh terjadi, seperti pencatatan transaksi atau audit log. Perlu diketahui bahwa throughput-nya turun cukup signifikan dibandingkan QoS 1, jadi pertimbangkan trade-off-nya dengan matang.

## Pelajaran dari Kesalahan Implementasi

Selama bekerja dengan MQTT, ada beberapa hal yang saya pelajari lewat cara yang kurang menyenangkan.

**Mengabaikan Last Will and Testament.** MQTT punya fitur di mana client bisa mendaftarkan pesan yang akan di-publish broker kalau client tersebut disconnect secara tiba-tiba. Di salah satu proyek, saya melewatkan konfigurasi ini. Akibatnya, perangkat yang sudah tidak aktif masih tampil berstatus "online" di dashboard selama berjam-jam. Perbaikannya ternyata sangat simpel — hanya dua baris konfigurasi. Tapi mencari akar masalahnya memakan waktu hampir dua hari karena gejalanya tidak langsung terlihat.

**Struktur topik yang tidak direncanakan.** Ini kesalahan yang dampaknya baru terasa seiring sistem berkembang. Struktur topik yang flat dan tidak konsisten membuat manajemen subscription semakin rumit. Pendekatan yang jauh lebih efektif adalah menggunakan hierarki yang jelas:

\`\`\`
{domain}/{area}/{device_id}/{action}
\`\`\`

Dengan struktur seperti ini, wildcard menjadi sangat berguna. Misalnya, subscribe ke \`building/floor-2/#\` langsung mencakup seluruh event di satu area. Pelajarannya sederhana: rencanakan struktur topik di awal, karena refactoring di production berisiko tinggi.

**Reconnection yang tidak di-handle dengan benar.** Perangkat kehilangan koneksi itu bukan soal "kalau", tapi "kapan". Yang tidak saya sadari awalnya adalah beberapa MQTT client library tidak otomatis melakukan resubscribe setelah reconnect. Akibatnya, perangkat terhubung kembali tapi berhenti menerima pesan karena subscription-nya hilang. Solusi yang saya terapkan: selalu lakukan subscribe ulang di callback \`onConnect\`, bukan hanya pada koneksi awal.

## Kapan Sebaiknya Tidak Menggunakan MQTT

Saya perlu menekankan bahwa MQTT bukan solusi universal. Untuk komunikasi request-response standar, REST API masih lebih tepat. Untuk transfer file berukuran besar, MQTT bukan medianya. Dan untuk aplikasi dengan jumlah pengguna terbatas di jaringan yang stabil, WebSocket atau polling biasa mungkin sudah memadai.

MQTT paling optimal digunakan ketika ada banyak perangkat yang perlu berkomunikasi, jaringannya tidak selalu reliable, atau ketika kita perlu mendistribusikan update ke banyak subscriber secara bersamaan.

## Catatan Penutup

Setelah beberapa kali menggunakan MQTT di proyek production, saya bisa mengatakan bahwa protokol ini memberikan dampak nyata terhadap bagaimana saya mendesain arsitektur komunikasi antar service. Bukan karena sempurna, tapi karena sesuai dengan kebutuhan spesifik yang saya hadapi.

Bagi rekan-rekan developer yang tertarik memulai, saya sarankan untuk langsung mencoba membangun implementasi sederhana — misalnya dua client yang saling kirim pesan lewat broker Mosquitto. Dari situ, simulasikan skenario disconnect, coba berbagai level QoS, dan perhatikan bagaimana sistem merespons. Pemahaman paling kuat terbentuk dari pengalaman langsung, bukan hanya dari membaca dokumentasi.`,
    date: '2025-03-15',
    order: 1,
  },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// Source: Actual CV of M. Daniansyah Chusyaidin
// ─────────────────────────────────────────────
const experience = [
  {
    id: 'brilian-eka-saetama',
    title: { en: 'FullStack Developer', id: 'Pengembang FullStack' },
    company: 'PT. Brilian Eka Saetama',
    period: { en: 'Jan 2025 — Present', id: 'Jan 2025 — Sekarang' },
    points: {
      en: [
        'Developed a corporate website and admin dashboard using Next.js, TypeScript, Firebase, and Tailwind CSS with multi-language, SEO, and management features for products, contracts, customers, and maintenance.',
        'Built FireCheck mobile application with React Native integrated with Firebase for inspection, QR scanning, location tracking, photo documentation, and real-time notifications.',
      ],
      id: [
        'Mengembangkan website perusahaan dan dashboard admin menggunakan Next.js, TypeScript, Firebase, dan Tailwind CSS dengan fitur multi-bahasa, SEO, serta manajemen produk, kontrak, pelanggan, dan maintenance.',
        'Membangun aplikasi mobile FireCheck berbasis React Native terintegrasi Firebase untuk inspeksi, QR scan, pelacakan lokasi, dokumentasi foto, dan notifikasi real-time.',
      ],
    },
    isCurrent: true,
    order: 1,
  },
  {
    id: 'adi-media-expertindo',
    title: { en: 'FullStack Developer', id: 'Pengembang FullStack' },
    company: 'PT. Adi Media Expertindo (AMX Group)',
    period: { en: 'Dec 2023 — Present', id: 'Des 2023 — Sekarang' },
    points: {
      en: [
        'Developed an Omnichannel One Gate Solution Marketplace for online store management using React TypeScript, Bootstrap, Node.js, Express, Firebase, and Redis. Integrated with Shopee, Lazada, Tokopedia, and TikTokShop Open API Marketplace.',
        'Built a Fulfilment App with server and mobile components using MQTT, RabbitMQ, React Native, and REST API for warehouse operations and shipment processing.',
      ],
      id: [
        'Mengembangkan Sistem Omnichannel One Gate Solution Marketplace untuk kebutuhan toko online menggunakan React TypeScript, Bootstrap, Node JS, Express, Firebase, API Marketplace, Redis. Terintegrasi dengan Shopee, Lazada, Tokopedia dan TikTokShop Open API Marketplace.',
        'Mengembangkan Software Fulfilment App Server & Mobile based dengan MQTT, RabbitMQ, React Native & REST API untuk operasi gudang dan pemrosesan pengiriman.',
      ],
    },
    isCurrent: true,
    order: 2,
  },
  {
    id: 'avolut-global-indonesia',
    title: { en: 'Technical Analyst', id: 'Analis Teknis' },
    company: 'PT. Avolut Global Indonesia (Andromedia Group)',
    period: { en: 'Aug 2022 — Nov 2023', id: 'Agu 2022 — Nov 2023' },
    points: {
      en: [
        'Developed an Android-based Port Information System for enterprise client using React TypeScript, Tailwind CSS, Node.js, Capacitor, Android Studio, Prisma ORM, and PostgreSQL.',
        'Built a web-based Warehouse Management System for enterprise client using React TypeScript, Tailwind CSS, Node.js, Prisma ORM, and PostgreSQL.',
      ],
      id: [
        'Mengembangkan Sistem Informasi Pelabuhan berbasis Android untuk klien perusahaan menggunakan React TypeScript, Tailwind CSS, Node JS, Capacitor, Android Studio, Prisma ORM dan PostgreSQL.',
        'Mengembangkan Sistem Manajemen Gudang berbasis Website untuk klien perusahaan menggunakan React TypeScript, Tailwind CSS, Node JS, Prisma ORM dan PostgreSQL.',
      ],
    },
    isCurrent: false,
    order: 3,
  },
  {
    id: 'hacktiv8',
    title: { en: 'Backend Developer Intern', id: 'Magang Backend Developer' },
    company: 'PT. Hacktivate Teknologi Indonesia (Hacktiv8)',
    period: { en: 'Jul 2022 — Dec 2022', id: 'Jul 2022 — Des 2022' },
    points: {
      en: [
        'Developed backend systems using Node.js, Express.js, and MySQL for web applications.',
      ],
      id: [
        'Mengembangkan sistem backend menggunakan Node JS, Express JS, dan MySQL untuk aplikasi website.',
      ],
    },
    isCurrent: false,
    order: 4,
  },
  {
    id: 'plants-society',
    title: { en: 'FullStack Developer', id: 'Pengembang FullStack' },
    company: 'PT. Global Plants Society Trade (Plants Society)',
    period: { en: 'Apr 2022 — Nov 2022', id: 'Apr 2022 — Nov 2022' },
    points: {
      en: [
        'Designed UI/UX for the company profile website.',
        'Built a responsive company profile website using React.js, Node.js, Express.js, Tailwind CSS, and Firebase.',
      ],
      id: [
        'Merancang desain UI/UX Website Profil perusahaan.',
        'Mengembangkan Website Responsive Profil Perusahaan menggunakan React JS, Node JS, Express JS, Tailwind dan Firebase.',
      ],
    },
    isCurrent: false,
    order: 5,
  },
  {
    id: 'andromedia-indonesia',
    title: { en: 'FullStack Developer Intern', id: 'Magang Pengembang FullStack' },
    company: 'PT. Andromedia Indonesia (Andromedia Group)',
    period: { en: 'Feb 2022 — Jul 2022', id: 'Feb 2022 — Jul 2022' },
    points: {
      en: [
        'Developed a web-based Port Information System for enterprise client using React TypeScript, Tailwind CSS, Node.js, Prisma ORM, and PostgreSQL.',
        'Built a Sales and Logistics Marketing System for enterprise client using React TypeScript, Tailwind CSS, Node.js, Prisma ORM, and PostgreSQL.',
      ],
      id: [
        'Mengembangkan Sistem Informasi Pelabuhan berbasis website untuk klien perusahaan menggunakan React TypeScript, Tailwind CSS, Node JS, Prisma ORM dan PostgreSQL.',
        'Mengembangkan Sistem Penjualan dan Pemasaran Logistik berbasis website untuk klien perusahaan menggunakan React TypeScript, Tailwind CSS, Node JS, Prisma ORM dan PostgreSQL.',
      ],
    },
    isCurrent: false,
    order: 6,
  },
  {
    id: 'giga-computer',
    title: { en: 'Microsoft Course Instructor', id: 'Instruktur Kursus Microsoft' },
    company: 'Giga Computer Training and Education Center',
    period: { en: 'Aug 2021 — Dec 2023', id: 'Agu 2021 — Des 2023' },
    points: {
      en: [
        'Taught Microsoft Word, Excel, PowerPoint, and Access classes.',
        'Developed learning modules and course materials.',
      ],
      id: [
        'Mengajar kelas Microsoft Word, Microsoft Excel, Microsoft PowerPoint, dan Microsoft Access.',
        'Menyusun modul pembelajaran.',
      ],
    },
    isCurrent: false,
    order: 7,
  },
  {
    id: 'rumah-belajar-amanah',
    title: { en: 'Coding Kids Class Instructor', id: 'Instruktur Kelas Coding Anak' },
    company: 'Rumah Belajar Amanah',
    period: { en: 'Sep 2021 — Dec 2023', id: 'Sep 2021 — Des 2023' },
    points: {
      en: [
        'Taught game development and programming logic classes using Scratch MIT Edu platform.',
        'Developed learning modules and structured curriculum.',
      ],
      id: [
        'Mengajar kelas pengembangan game dan metode pemahaman logika pemrograman menggunakan platform Scratch MIT Edu.',
        'Menyusun modul pembelajaran.',
      ],
    },
    isCurrent: false,
    order: 8,
  },
];

// ─────────────────────────────────────────────
// SKILLS
// Source: CV KEMAMPUAN + expanded categories
// ─────────────────────────────────────────────
const skills = [
  {
    id: 'core-engineering',
    title: { en: 'Core Engineering', id: 'Rekayasa Inti' },
    context: {
      en: 'The languages and frameworks I use to build backend services and server-side logic.',
      id: 'Bahasa dan framework yang saya gunakan untuk membangun layanan backend dan logika server.',
    },
    skills: [
      { name: 'TypeScript', tag: 'STRICT' },
      { name: 'JavaScript', tag: 'RUNTIME' },
      { name: 'Node.js', tag: 'SERVER' },
      { name: 'Express.js', tag: 'FRAMEWORK' },
    ],
    order: 1,
  },
  {
    id: 'client-interface',
    title: { en: 'Client & Interface', id: 'Klien & Antarmuka' },
    context: {
      en: 'Tools I use to build web frontends and cross-platform mobile apps.',
      id: 'Tools yang saya gunakan untuk membangun frontend web dan aplikasi mobile lintas platform.',
    },
    skills: [
      { name: 'React.js', tag: 'SPA' },
      { name: 'Next.js', tag: 'SSR/SSG' },
      { name: 'React Native', tag: 'MOBILE' },
      { name: 'Tailwind CSS', tag: 'UTILITY' },
    ],
    order: 2,
  },
  {
    id: 'persistence-data',
    title: { en: 'Persistence & Data', id: 'Persistensi & Data' },
    context: {
      en: 'Databases and ORMs I work with for storing and managing application data.',
      id: 'Database dan ORM yang saya gunakan untuk menyimpan dan mengelola data aplikasi.',
    },
    skills: [
      { name: 'PostgreSQL', tag: 'RELATIONAL' },
      { name: 'MySQL', tag: 'RELATIONAL' },
      { name: 'Prisma ORM', tag: 'ABSTRACTION' },
      { name: 'Firebase', tag: 'REAL-TIME' },
    ],
    order: 3,
  },
  {
    id: 'communication-layers',
    title: { en: 'Communication Layers', id: 'Lapisan Komunikasi' },
    context: {
      en: 'Protocols and tools for real-time messaging, message queues, and API communication.',
      id: 'Protokol dan tools untuk messaging real-time, message queue, dan komunikasi API.',
    },
    skills: [
      { name: 'RabbitMQ', tag: 'BROKER' },
      { name: 'MQTT', tag: 'IOT' },
      { name: 'REST API', tag: 'CONTRACTS' },
      { name: 'Redis', tag: 'CACHE' },
    ],
    order: 4,
  },
  {
    id: 'devops-tooling',
    title: { en: 'DevOps & Tooling', id: 'DevOps & Peralatan' },
    context: {
      en: 'Version control, containerization, and deployment tools I use daily.',
      id: 'Version control, containerization, dan tools deployment yang saya gunakan sehari-hari.',
    },
    skills: [
      { name: 'Git', tag: 'VERSIONING' },
      { name: 'GitHub / GitLab / Bitbucket', tag: 'PLATFORM' },
      { name: 'Docker', tag: 'CONTAINERS' },
      { name: 'Linux', tag: 'SYSTEM' },
    ],
    order: 5,
  },
  {
    id: 'mobile-platform',
    title: { en: 'Mobile & Platform', id: 'Mobile & Platform' },
    context: {
      en: 'Mobile development tools for building native and hybrid apps.',
      id: 'Tools pengembangan mobile untuk membangun aplikasi native dan hybrid.',
    },
    skills: [
      { name: 'Android Studio', tag: 'NATIVE' },
      { name: 'Capacitor', tag: 'HYBRID' },
      { name: 'jQuery', tag: 'LEGACY' },
    ],
    order: 6,
  },
];

// ─────────────────────────────────────────────
// SITE CONTENT (Singletons)
// ─────────────────────────────────────────────

const heroContent = {
  tagline: { en: 'Fullstack & Mobile Engineer', id: 'Fullstack & Mobile Engineer' },
  headline: { en: "I don't return undefined.", id: 'Saya tidak mengembalikan undefined.' },
  desc: {
    en: 'I build production-ready software from scratch. System design, backend, mobile, all the way to deployment.',
    id: 'Saya membangun software siap production dari nol. Desain sistem, backend, mobile, sampai deployment.',
  },
  ctaGame: { en: 'Wanna play a game?', id: 'Mau main game?' },
  ctaContact: { en: 'Get in Touch', id: 'Hubungi Saya' },
  phrases: {
    en: ['Software Developer', 'Fullstack Engineer', 'Mobile Developer', 'React & Node.js'],
    id: ['Software Developer', 'Fullstack Engineer', 'Mobile Developer', 'React & Node.js'],
  },
};

const aboutContent = {
  title: { en: 'About Me', id: 'Software Developer' },
  headline: {
    en: 'I architect systems where reliability is the baseline.',
    id: 'Saya membangun sistem yang mengutamakan keandalan.',
  },
  desc: {
    en: "I handle the full development process. From planning and system design to writing code and shipping to production. I enjoy solving hard problems and building software that's reliable and easy to maintain long-term.",
    id: 'Saya menangani seluruh proses pengembangan. Dari perencanaan dan desain sistem sampai menulis kode dan deploy ke production. Saya suka menyelesaikan masalah yang kompleks dan membangun software yang andal dan mudah di-maintain jangka panjang.',
  },
  avatarInitials: 'DC',
  stats: {
    stat1: { value: 'E2E', label: { en: 'Lifecycle Ownership', id: 'End-to-End Ownership' } },
    stat2: { value: '0%', label: { en: 'Tolerance for Fluff', id: 'Zero Tolerance for Fluff' } },
    stat3: { value: 'TDD', label: { en: 'Quality Standard', id: 'Standar Kualitas' } },
  },
};

const contactContent = {
  headline: {
    en: "Let's engineer solutions together.",
    id: 'Mari bangun solusi bersama.',
  },
  desc: {
    en: "Got an idea that needs building? Send me the details below. I'm always open to interesting projects and new collaborations.",
    id: 'Punya ide yang perlu dibangun? Kirim detailnya di bawah. Saya selalu terbuka untuk proyek menarik dan kolaborasi baru.',
  },
  email: 'daniansyah@chusyaidin.engineer',
  labels: {
    title: { en: '01 / Subject', id: '01 / Subjek' },
    payload: { en: '02 / Message', id: '02 / Pesan' },
  },
  placeholders: {
    title: { en: 'Enter project subject...', id: 'Tulis subjek proyek...' },
    payload: { en: 'Describe your project needs...', id: 'Jelaskan kebutuhan proyek Anda...' },
  },
  buttons: {
    transmit: { en: 'Send Message', id: 'Kirim Pesan' },
    copyUid: { en: 'Copy Email', id: 'Salin Email' },
  },
  socials: {
    github: 'https://github.com/Dani27-design',
    linkedin: 'https://www.linkedin.com/in/daniansyahchusyaidin/',
    instagram: 'https://www.instagram.com/danichusyaidin',
    whatsapp: 'https://wa.me/6285790428078',
  },
};

const footerContent = {
  ownerName: 'DANIANSYAH CHUSYAIDIN',
  role: { en: 'Software Developer', id: 'Software Developer' },
};

const hireBannerContent = {
  badge: { en: 'Available for Hire', id: 'Terbuka untuk Kerja Sama' },
  headline: {
    en: 'Need an Architect to Scale Your Vision?',
    id: 'Butuh Developer untuk Mewujudkan Visi Anda?',
  },
  desc: {
    en: "Experienced in building web apps, mobile apps, and backend systems that scale. Let me know if you need a developer for your next project.",
    id: 'Berpengalaman membangun aplikasi web, mobile, dan sistem backend yang scalable. Hubungi saya kalau butuh developer untuk proyek Anda.',
  },
  cta: { en: "Let's Work Together", id: 'Mari Bekerja Sama' },
};

const navbarContent = {
  labels: {
    about: { en: 'About', id: 'Tentang' },
    stack: { en: 'Stack', id: 'Keahlian' },
    experience: { en: 'Experience', id: 'Pengalaman' },
    projects: { en: 'Projects', id: 'Proyek' },
    blog: { en: 'Blog', id: 'Blog' },
    contact: { en: 'Contact', id: 'Kontak' },
  },
};

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────
const BATCH_LIMIT = 400;

async function seed() {
  let batch = db.batch();
  let opCount = 0;

  async function addOp(ref: FirebaseFirestore.DocumentReference, data: Record<string, unknown>) {
    batch.set(ref, data);
    opCount++;
    if (opCount >= BATCH_LIMIT) {
      await batch.commit();
      console.log(`  Committed batch (${opCount} ops)`);
      batch = db.batch();
      opCount = 0;
    }
  }

  console.log('Seeding projects...');
  for (const p of projects) {
    const { id: docId, ...data } = p;
    await addOp(db.collection('projects').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding blogs...');
  for (const b of blogs) {
    const { id: docId, ...data } = b;
    await addOp(db.collection('blogs').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding experience...');
  for (const e of experience) {
    const { id: docId, ...data } = e;
    await addOp(db.collection('experience').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding skills...');
  for (const s of skills) {
    const { id: docId, ...data } = s;
    await addOp(db.collection('skills').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding site content...');
  await addOp(db.collection('siteContent').doc('hero'), {
    ...heroContent,
    updatedAt: now,
  });
  await addOp(db.collection('siteContent').doc('about'), {
    ...aboutContent,
    updatedAt: now,
  });
  await addOp(db.collection('siteContent').doc('contact'), {
    ...contactContent,
    updatedAt: now,
  });
  await addOp(db.collection('siteContent').doc('footer'), {
    ...footerContent,
    updatedAt: now,
  });
  await addOp(db.collection('siteContent').doc('hireBanner'), {
    ...hireBannerContent,
    updatedAt: now,
  });
  await addOp(db.collection('siteContent').doc('navbar'), {
    ...navbarContent,
    updatedAt: now,
  });

  // Commit remaining operations
  if (opCount > 0) {
    await batch.commit();
    console.log(`  Committed final batch (${opCount} ops)`);
  }

  console.log(`Seeded ${projects.length} projects, ${blogs.length} blogs, ${experience.length} experience items, ${skills.length} skill groups, 6 site content documents (hero, about, contact, footer, hireBanner, navbar).`);
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

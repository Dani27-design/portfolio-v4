export const id = {
  nav: {
    about: 'Tentang',
    stack: 'Keahlian',
    experience: 'Pengalaman',
    projects: 'Proyek',
    blog: 'Blog',
    contact: 'Kontak',
  },
  hero: {
    tagline: 'Inti Arsitek Sistem',
    headline: 'Saya tidak mengembalikan undefined.',
    ctaGame: 'Mau main game?',
    ctaContact: 'Inisialisasi_Protokol',
  },
  about: {
    title: 'Insinyur Struktural',
    headline: 'Saya merancang sistem di mana keandalan adalah dasar.',
    stats: {
      e2e: 'Kepemilikan Siklus Hidup',
      zero: 'Toleransi terhadap Omong Kosong',
      tdd: 'Standar Kualitas',
    },
  },
  skills: {
    title: 'Keahlian Teknis',
    groups: {
      core: 'Rekayasa Inti',
      client: 'Klien & Antarmuka',
      data: 'Persistensi & Data',
      communication: 'Lapisan Komunikasi',
      devops: 'DevOps & Peralatan',
      ai: 'Ekosistem AI & Desain',
    },
    items: {
      core: ['TypeScript', 'Node.js', 'Go', 'Python'],
      client: ['React', 'React Native', 'Next.js', 'Tailwind CSS'],
      data: ['PostgreSQL', 'SQLite', 'Redis', 'Prisma ORM'],
      communication: ['RabbitMQ', 'MQTT', 'Kafka', 'TCP/IP'],
      devops: ['Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus'],
      ai: ['TensorFlow', 'OpenAI API', 'Gemini', 'LangChain'],
    },
  },
  experience: {
    title: 'Trajektori Profesional',
    jobs: [
      {
        period: 'Jan 2022 — Sekarang',
        title: 'Insinyur Sistem Senior',
        company: 'DataNode Solutions',
        current: true,
        points: [
          'Merancang sistem message broker berbasis AMQP (RabbitMQ) yang menangani data telemetri multi-node untuk sensor industri.',
          'Membangun inti React Native dengan tipe ketat dan sinkronisasi offline-first via SQLite, memastikan integritas data berkelanjutan di lingkungan terpencil.',
          'Mendesain dan memelihara skema PostgreSQL untuk 10M+ rekaman, mengoptimalkan latensi query melalui pengindeksan strategis dan abstraksi Prisma ORM.',
        ],
      },
      {
        period: 'Mar 2020 — Des 2021',
        title: 'Pengembang Fullstack',
        company: 'Protocol Digital',
        current: false,
        points: [
          'Melakukan debugging dan refaktor monolit Node.js legacy menjadi arsitektur modular berbasis Docker, meningkatkan reliabilitas deployment sebesar 60%.',
          'Mengembangkan protokol TCP/IP kustom untuk komunikasi hardware-software yang aman di perangkat IoT proprietary.',
          'Menyempurnakan performa frontend di aplikasi Next.js dengan menerapkan manajemen state yang teliti dan optimasi Tailwind CSS.',
        ],
      },
      {
        period: 'Jun 2018 — Feb 2020',
        title: 'Spesialis Inti Mobile',
        company: 'Systemic Soft',
        current: false,
        points: [
          'Memiliki penuh delivery 5+ aplikasi React Native kelas produksi dari pemetaan flowchart hingga deployment App Store.',
          'Mengimplementasikan streaming data real-time via MQTT untuk command set latensi rendah di proyek infrastruktur pintar.',
          'Memelihara database Firestore dengan ketersediaan tinggi, memastikan uptime 99.9% melalui validasi skema dan aturan keamanan yang ketat.',
        ],
      },
    ],
  },
  projects: {
    title: 'Arsitektur Sistem & Deployment',
    cta: 'AKSES_ARSIP_SISTEM',
    viewDetail: 'Lihat_Detail',
    metadata: {
      access: 'Akses: Diberikan',
      checksum: 'Checksum: Divalidasi',
      target: 'Target: Prod_Env',
    },
  },
  projectItems: [
    {
      name: 'Orkestrasi IoT Terdistribusi',
      desc: 'Membangun gateway telemetri ketersediaan tinggi menggunakan MQTT dan AMQP (RabbitMQ) untuk menangani data real-time dari 5.000+ node. Mengimplementasikan circuit breaker dan persistensi pesan untuk memastikan nol kehilangan data selama partisi jaringan.',
    },
    {
      name: 'Inti Mobile Enterprise v2',
      desc: 'Merancang mesin sinkronisasi mobile offline-first untuk React Native menggunakan SQLite dan protokol TCP/IP kustom. Mengembangkan logika resolusi yang robust untuk konflik data antara penyimpanan lokal terdistribusi dan kluster PostgreSQL terpusat.',
    },
    {
      name: 'Mesin Ledger Keuangan',
      desc: 'Mendesain dan mengimplementasikan ledger transaksional yang konsisten ketat menggunakan Prisma ORM dan PostgreSQL. Memastikan atomisitas di operasi keuangan multi-langkah dengan row-level locking dan cakupan TDD komprehensif.',
    },
    {
      name: 'Pipeline Analitik Real-time',
      desc: 'Membangun platform analitik streaming throughput tinggi menggunakan Apache Kafka dan Go. Berhasil mengurangi latensi pemrosesan data sebesar 45% sambil menangani lonjakan ingress 50k event per detik.',
    },
    {
      name: 'Middleware Autentikasi Keamanan',
      desc: 'Mengembangkan layanan autentikasi terdistribusi dengan JWT dan integrasi OAuth multi-provider. Mengimplementasikan rotasi secret entropi tinggi dan perlindungan brute-force menggunakan lapisan rate-limiting.',
    },
    {
      name: 'Monitor Sumber Daya Cloud',
      desc: 'Mendesain visualizer terpusat untuk konsumsi sumber daya multi-cloud (AWS/GCP). Mengintegrasikan alert billing real-time dan protokol auto-scaling node berdasarkan pemodelan beban prediktif.',
    },
  ],
  blog: {
    title: 'Log Teknis',
    cta: 'AKSES_ARSIP_LENGKAP',
    readEntry: 'BACA_ENTRI_LOG',
  },
  blogEntries: {
    'debugging-rabbitmq-race-conditions': {
      title: 'Debugging Race Condition di RabbitMQ',
      excerpt: 'Analisis pola acknowledgment pesan dan konfigurasi prefetch di consumer Node.js throughput tinggi.',
    },
    'prisma-orm-performance': {
      title: 'Prisma ORM: Trade-off Performa',
      excerpt: 'Evaluasi strategi query batching dan connection pooling di lingkungan serverless vs Express long-running.',
    },
    'reliable-mobile-sync-mqtt': {
      title: 'Sinkronisasi Mobile Andal via MQTT',
      excerpt: 'Implementasi jaminan QOS-2 di aplikasi React Native untuk telemetri industri mission-critical.',
    },
    'optimizing-postgresql-indexing': {
      title: 'Optimasi PostgreSQL untuk 10M+ Baris',
      excerpt: 'Eksplorasi strategi pengindeksan, partisi, dan vacuuming untuk data relasional volume tinggi.',
    },
    'monorepo-engineering-workflow': {
      title: 'Kasus untuk Mono-repo di 2024',
      excerpt: 'Menyempurnakan alur kerja engineering menggunakan Turborepo dan struktur paket internal berversi ketat.',
    },
    'memory-management-react-native': {
      title: 'Manajemen Memori di React Native',
      excerpt: 'Deep dive ke siklus garbage collection dan dampak performa dari transform Reanimated 2 yang berat.',
    },
  },
  contact: {
    headline: 'Mari rekayasa solusi bersama.',
    labels: {
      title: '01 / Judul_Permintaan',
      payload: '02 / Muatan_Pertanyaan',
    },
    placeholders: {
      title: 'Masukkan subjek proyek...',
      payload: 'Jelaskan batasan arsitektur proyek...',
    },
    buttons: {
      transmit: 'Transmisi_Protokol',
      copyUid: 'SALIN_UID',
    },
  },
  footer: {
    role: 'Insinyur Sistem Senior',
  },
  hireBanner: {
    badge: 'KETERSEDIAAN_SISTEM :: TERBUKA_UNTUK_MISI',
    headline: 'Perlu Arsitek untuk Menskalakan Visi Anda?',
    cta: 'INISIALISASI_Protokol_PEREKRUTAN',
  },
  game: {
    badge: '[ MASUK_KE_SIMULASI ]',
    hud: {
      sessionScore: 'Skor_Sesi',
      terminalHigh: 'Tanda_Terminal_Tinggi',
      nearRecord: 'Dekat_Rekor',
      newHighScore: 'Skor_Tinggi_Baru',
    },
    preGame: {
      title: 'Simulasi_Sistem',
      waiting: 'Menunggu deployment defensif...',
    },
    countdown: {
      go: 'MULAI',
      syncing: 'Sinkronisasi_Dalam_Proses',
    },
    gameOver: {
      title: 'JATUH',
      subtitle: 'Simulasi_Dihentikan',
      finalHarvest: 'Panen_Akhir',
    },
    highScore: {
      newMark: 'Tanda_Terminal_Baru',
      pilotId: 'ID_PILOT',
      commitIdentity: 'KOMIT_IDENTITAS',
      identitySecured: 'Identitas_Diamankan:',
      sharePerformance: 'BAGIKAN_PERFORMA',
      redeploy: 'DEPLOY-ULANG',
    },
  },
  dateFormat: {
    locale: 'id-ID',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  },
  phrases: [
    'Arsitek Sistem',
    'Insinyur Fullstack',
    'Pengembang Inti Mobile',
    'Spesialis Automasi',
  ],
} as const;

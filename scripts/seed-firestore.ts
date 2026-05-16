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
// Source: constants.ts PROJECTS + en.ts/id.ts projectItems
// ─────────────────────────────────────────────
const projects = [
  {
    id: 'distributed-iot-orchestration',
    name: { en: 'Distributed IoT Orchestration', id: 'Orkestrasi IoT Terdistribusi' },
    desc: {
      en: 'Engineered a high-availability telemetry gateway using MQTT and AMQP (RabbitMQ) to handle real-time data from 5,000+ nodes. Implemented circuit breakers and message persistence to ensure zero data loss during network partitions.',
      id: 'Membangun gateway telemetri ketersediaan tinggi menggunakan MQTT dan AMQP (RabbitMQ) untuk menangani data real-time dari 5.000+ node. Mengimplementasikan circuit breaker dan persistensi pesan untuk memastikan nol kehilangan data selama partisi jaringan.',
    },
    tech: ['Node.js', 'RabbitMQ', 'PostgreSQL', 'MQTT'],
    version: 'v4.2.1',
    status: 'PRODUCTION',
    order: 1,
  },
  {
    id: 'enterprise-mobile-core-v2',
    name: { en: 'Enterprise Mobile Core v2', id: 'Inti Mobile Enterprise v2' },
    desc: {
      en: 'Architected an offline-first mobile sync engine for React Native using SQLite and custom TCP/IP protocols. Developed a robust resolution logic for data conflicts between distributed local stores and a centralized PostgreSQL cluster.',
      id: 'Merancang mesin sinkronisasi mobile offline-first untuk React Native menggunakan SQLite dan protokol TCP/IP kustom. Mengembangkan logika resolusi yang robust untuk konflik data antara penyimpanan lokal terdistribusi dan kluster PostgreSQL terpusat.',
    },
    tech: ['React Native', 'SQLite', 'TypeScript', 'TCP/IP'],
    version: 'v1.0.5',
    status: 'STABLE',
    order: 2,
  },
  {
    id: 'financial-ledger-engine',
    name: { en: 'Financial Ledger Engine', id: 'Mesin Ledger Keuangan' },
    desc: {
      en: 'Designed and implemented a strictly consistent transactional ledger using Prisma ORM and PostgreSQL. Ensured atomicity across multi-step financial operations with row-level locking and comprehensive TDD coverage.',
      id: 'Mendesain dan mengimplementasikan ledger transaksional yang konsisten ketat menggunakan Prisma ORM dan PostgreSQL. Memastikan atomisitas di operasi keuangan multi-langkah dengan row-level locking dan cakupan TDD komprehensif.',
    },
    tech: ['Next.js', 'Prisma ORM', 'PostgreSQL', 'Docker'],
    version: 'v2.2.0',
    status: 'DEPLOYED',
    order: 3,
  },
  {
    id: 'realtime-analytics-pipeline',
    name: { en: 'Real-time Analytics Pipeline', id: 'Pipeline Analitik Real-time' },
    desc: {
      en: 'Built a high-throughput streaming analytics platform using Apache Kafka and Go. Successfully reduced data processing latency by 45% while handling ingress bursts of 50k events per second.',
      id: 'Membangun platform analitik streaming throughput tinggi menggunakan Apache Kafka dan Go. Berhasil mengurangi latensi pemrosesan data sebesar 45% sambil menangani lonjakan ingress 50k event per detik.',
    },
    tech: ['Go', 'Kafka', 'Redis', 'Prometheus'],
    version: 'v3.1.0',
    status: 'OPTIMIZED',
    order: 4,
  },
  {
    id: 'security-auth-middleware',
    name: { en: 'Security Auth Middleware', id: 'Middleware Autentikasi Keamanan' },
    desc: {
      en: 'Developed a distributed authentication service with JWT and multi-provider OAuth integration. Implemented high-entropy secret rotation and brute-force protection using rate-limiting layers.',
      id: 'Mengembangkan layanan autentikasi terdistribusi dengan JWT dan integrasi OAuth multi-provider. Mengimplementasikan rotasi secret entropi tinggi dan perlindungan brute-force menggunakan lapisan rate-limiting.',
    },
    tech: ['Node.js', 'Redis', 'OAuth 2.0', 'Auth0'],
    version: 'v2.0.4',
    status: 'SECURITY_OK',
    order: 5,
  },
  {
    id: 'cloud-resource-monitor',
    name: { en: 'Cloud Resource Monitor', id: 'Monitor Sumber Daya Cloud' },
    desc: {
      en: 'Designed a centralized visualizer for multi-cloud resource consumption (AWS/GCP). Integrated real-time billing alerts and automated node-scaling protocols based on predictive load modeling.',
      id: 'Mendesain visualizer terpusat untuk konsumsi sumber daya multi-cloud (AWS/GCP). Mengintegrasikan alert billing real-time dan protokol auto-scaling node berdasarkan pemodelan beban prediktif.',
    },
    tech: ['Python', 'React', 'GCP SDK', 'TensorFlow'],
    version: 'v1.5.2',
    status: 'LIVE',
    order: 6,
  },
];

// ─────────────────────────────────────────────
// BLOGS
// Source: constants.ts BLOGS + en.ts/id.ts blogEntries
// ─────────────────────────────────────────────
const blogs = [
  {
    id: 'debugging-rabbitmq-race-conditions',
    slug: 'debugging-rabbitmq-race-conditions',
    title: {
      en: 'Debugging Race Conditions in RabbitMQ',
      id: 'Debugging Race Condition di RabbitMQ',
    },
    excerpt: {
      en: 'An analysis of message acknowledgment patterns and prefetch configurations in high-throughput Node.js consumers.',
      id: 'Analisis pola acknowledgment pesan dan konfigurasi prefetch di consumer Node.js throughput tinggi.',
    },
    content: `# Debugging Race Conditions in RabbitMQ

Race conditions in message brokers can be elusive and destructive. In our high-throughput Node.js environment, we encountered situations where messages were being processed multiple times or out of order due to improper acknowledgment patterns.

## The Challenge
We were handling over 5,000 telemetry packets per second. Our initial implementation used dynamic prefetch counts, which led to a "greedy consumer" problem.

## Key Findings
1. **Manual Acknowledgments**: Switching from automatic to manual acks (\`noAck: false\`) was critical for reliability.
2. **Prefetch Tuning**: We found that setting a global prefetch limit across channels helped balance the load more effectively than per-consumer limits.
3. **Dead Letter Exchanges (DLX)**: Implementing DLX allowed us to isolate "poison pills" that were causing infinite retry loops.

## Conclusion
System architecture isn't just about moving data; it's about ensuring state consistency across distributed nodes.`,
    date: '2023-10-24',
    order: 1,
  },
  {
    id: 'prisma-orm-performance',
    slug: 'prisma-orm-performance',
    title: {
      en: 'Prisma ORM: Performance Trade-offs',
      id: 'Prisma ORM: Trade-off Performa',
    },
    excerpt: {
      en: 'Evaluating query batching and connection pooling strategies in serverless vs. long-running Express environments.',
      id: 'Evaluasi strategi query batching dan connection pooling di lingkungan serverless vs Express long-running.',
    },
    content: `# Prisma ORM: Performance Analysis

Prisma changed how we interact with databases, but it's not a silver bullet. Understanding the engine under the hood is vital for scaling.

## The n+1 Problem
Even with type safety, it's easy to fall into the n+1 trap. We leveraged Prisma's \`include\` and \`select\` features to flatten our queries, reducing database trips by 70%.

## Connection Pooling
In serverless environments (AWS Lambda), connection exhaustion is a real threat. We implemented **Prisma Accelerate** to manage connection proxies, ensuring our lambdas didn't lock up the RDS instance.

## Query Raw as a Last Resort
Sometimes, the abstraction is too heavy. For complex analytical queries involving multiple joins and window functions, we reverted to \`$queryRaw\`.`,
    date: '2023-08-12',
    order: 2,
  },
  {
    id: 'reliable-mobile-sync-mqtt',
    slug: 'reliable-mobile-sync-mqtt',
    title: {
      en: 'Reliable Mobile Sync over MQTT',
      id: 'Sinkronisasi Mobile Andal via MQTT',
    },
    excerpt: {
      en: 'Implementing QOS-2 guarantees in React Native applications for mission-critical industrial telemetry.',
      id: 'Implementasi jaminan QOS-2 di aplikasi React Native untuk telemetri industri mission-critical.',
    },
    content: `# Reliable Mobile Sync over MQTT

Industrial environments have terrible connectivity. When building mobile cores for these sites, "online-first" is a recipe for failure.

## QoS 2: Exactly Once
Most developers stick to QoS 0 (Fire and Forget) or QoS 1 (At least once). For our financial audit logs, we needed QoS 2 (Exactly once). This involves a 4-step handshake that ensures the packet is received and processed only once.

## The Bridge Problem
Syncing mobile local storage with a central cloud via MQTT requires a robust "Last Will and Testament" (LWT) strategy to handle unexpected disconnects.

## Battery Optimization
Maintaining a persistent TCP connection is expensive. We implemented a dynamic heartbeat that scales based on the device's battery level and network stability.`,
    date: '2023-05-05',
    order: 3,
  },
  {
    id: 'optimizing-postgresql-indexing',
    slug: 'optimizing-postgresql-indexing',
    title: {
      en: 'Optimizing PostgreSQL for 10M+ Rows',
      id: 'Optimasi PostgreSQL untuk 10M+ Baris',
    },
    excerpt: {
      en: 'Exploring strategic indexing, partitioning, and vacuuming strategies for high-volume relational data.',
      id: 'Eksplorasi strategi pengindeksan, partisi, dan vacuuming untuk data relasional volume tinggi.',
    },
    content: `# Optimizing PostgreSQL for Scale

When your tables cross the 10 million row mark, standard indexes start to feel sluggish.

## BRIN and GIN Indexes
For time-series data or logs, B-tree indexes get bloated. We switched to **BRIN (Block Range Indexes)**, which are 99% smaller while maintaining high performance for sorted data.

## Table Partitioning
Querying a year's worth of data was slow. Partitioning the database by month allowed PostgreSQL to prune entire sections of the table during scans, cutting execution time from 2s to 150ms.

## Autovacuum Tuning
Default vacuum settings are too conservative for write-heavy apps. We tuned our autovacuum parameters to prevent table bloat and maintain index efficiency.`,
    date: '2023-12-15',
    order: 4,
  },
  {
    id: 'monorepo-engineering-workflow',
    slug: 'monorepo-engineering-workflow',
    title: {
      en: 'The Case for Mono-repos in 2024',
      id: 'Kasus untuk Mono-repo di 2024',
    },
    excerpt: {
      en: 'Refining the engineering workflow using Turborepo and strictly versioned internal package structures.',
      id: 'Menyempurnakan alur kerja engineering menggunakan Turborepo dan struktur paket internal berversi ketat.',
    },
    content: `# Mono-repos: Engineering Velocity

Managing 15 separate repositories was killing our productivity. Dependency hell was a daily reality.

## The Turborepo Revolution
We consolidated our stack into a single repository managed by **Turborepo**. The remote caching feature alone reduced our CI/CD times from 12 minutes to 3 minutes.

## Shared Schema
By keeping our frontend and backend in one place, we could share Zod schemas and TypeScript interfaces natively. No more broken API contracts.

## Conclusion
A monorepo isn't just about putting code together; it's about building a unified system where every component evolves in sync.`,
    date: '2024-01-10',
    order: 5,
  },
  {
    id: 'memory-management-react-native',
    slug: 'memory-management-react-native',
    title: {
      en: 'Memory Management in React Native',
      id: 'Manajemen Memori di React Native',
    },
    excerpt: {
      en: 'Deep dive into garbage collection cycles and the performance impact of heavy Reanimated 2 transforms.',
      id: 'Deep dive ke siklus garbage collection dan dampak performa dari transform Reanimated 2 yang berat.',
    },
    content: `# Memory Management in React Native

Smooth 60FPS animations require more than just code; they require respect for the JS bridge and the device's RAM.

## The Image Leak
Most memory issues in React Native stem from un-optimized images. We implemented **FastImage** with aggressive cache clearing to prevent the native heap from ballooning.

## Reanimated and UI-Threads
Moving complex logic from the JS thread to the UI thread using **Reanimated 2** worklets was the single biggest performance boost. It decoupled our animations from the garbage collector's whims.

## Memory Leak Detection
Using the Xcode Memory Graph and Android Profiler, we identified that our custom event listeners weren't being properly cleaned up in \`useEffect\` returns.`,
    date: '2024-02-28',
    order: 6,
  },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// Source: en.ts/id.ts experience.jobs[]
// ─────────────────────────────────────────────
const experience = [
  {
    id: 'senior-systems-engineer',
    title: { en: 'Senior Systems Engineer', id: 'Insinyur Sistem Senior' },
    company: 'DataNode Solutions',
    period: { en: 'Jan 2022 — Present', id: 'Jan 2022 — Sekarang' },
    points: {
      en: [
        'Architected an AMQP-based message broker system (RabbitMQ) handling multi-node telemetry data for industrial sensors.',
        'Engineered a strictly-typed React Native core with offline-first synchronization via SQLite, ensuring continuous data integrity in remote environments.',
        'Designed and maintained a PostgreSQL schema for 10M+ records, optimizing query latency through strategic indexing and Prisma ORM abstraction.',
      ],
      id: [
        'Merancang sistem message broker berbasis AMQP (RabbitMQ) yang menangani data telemetri multi-node untuk sensor industri.',
        'Membangun inti React Native dengan tipe ketat dan sinkronisasi offline-first via SQLite, memastikan integritas data berkelanjutan di lingkungan terpencil.',
        'Mendesain dan memelihara skema PostgreSQL untuk 10M+ rekaman, mengoptimalkan latensi query melalui pengindeksan strategis dan abstraksi Prisma ORM.',
      ],
    },
    isCurrent: true,
    order: 1,
  },
  {
    id: 'fullstack-developer',
    title: { en: 'Fullstack Developer', id: 'Pengembang Fullstack' },
    company: 'Protocol Digital',
    period: { en: 'Mar 2020 — Dec 2021', id: 'Mar 2020 — Des 2021' },
    points: {
      en: [
        'Debugged and refactored a legacy Node.js monolith into a Dockerized modular architecture, improving deployment reliability by 60%.',
        'Developed custom TCP/IP protocols for secure hardware-software communication in proprietary IoT devices.',
        'Refined frontend performance in Next.js applications by implementing meticulous state management and Tailwind CSS optimization.',
      ],
      id: [
        'Melakukan debugging dan refaktor monolit Node.js legacy menjadi arsitektur modular berbasis Docker, meningkatkan reliabilitas deployment sebesar 60%.',
        'Mengembangkan protokol TCP/IP kustom untuk komunikasi hardware-software yang aman di perangkat IoT proprietary.',
        'Menyempurnakan performa frontend di aplikasi Next.js dengan menerapkan manajemen state yang teliti dan optimasi Tailwind CSS.',
      ],
    },
    isCurrent: false,
    order: 2,
  },
  {
    id: 'mobile-core-specialist',
    title: { en: 'Mobile Core Specialist', id: 'Spesialis Inti Mobile' },
    company: 'Systemic Soft',
    period: { en: 'June 2018 — Feb 2020', id: 'Jun 2018 — Feb 2020' },
    points: {
      en: [
        'Owned the full delivery of 5+ production-grade React Native applications from flowchart mapping to App Store deployment.',
        'Implemented real-time data streaming via MQTT for low-latency command sets in smart-infrastructure projects.',
        'Maintained high-availability Firestore databases, ensuring 99.9% uptime through rigorous schema validation and security rules.',
      ],
      id: [
        'Memiliki penuh delivery 5+ aplikasi React Native kelas produksi dari pemetaan flowchart hingga deployment App Store.',
        'Mengimplementasikan streaming data real-time via MQTT untuk command set latensi rendah di proyek infrastruktur pintar.',
        'Memelihara database Firestore dengan ketersediaan tinggi, memastikan uptime 99.9% melalui validasi skema dan aturan keamanan yang ketat.',
      ],
    },
    isCurrent: false,
    order: 3,
  },
];

// ─────────────────────────────────────────────
// SKILLS
// Source: Skills.tsx hardcoded data (structure with tags/context)
//         merged with bilingual titles/context
// ─────────────────────────────────────────────
const skills = [
  {
    id: 'core-engineering',
    title: { en: 'Core Engineering', id: 'Rekayasa Inti' },
    context: {
      en: 'Implementing strictly-typed, scalable service architectures and logic layers.',
      id: 'Mengimplementasikan arsitektur layanan bertipe ketat dan lapisan logika yang skalabel.',
    },
    skills: [
      { name: 'TypeScript', tag: 'STRICT' },
      { name: 'Node.js', tag: 'RUNTIME' },
      { name: 'Express.js', tag: 'SERVER' },
    ],
    order: 1,
  },
  {
    id: 'client-interface',
    title: { en: 'Client & Interface', id: 'Klien & Antarmuka' },
    context: {
      en: 'Architecting state-heavy applications and modular cross-platform interfaces.',
      id: 'Merancang aplikasi dengan state kompleks dan antarmuka lintas platform yang modular.',
    },
    skills: [
      { name: 'React / Next.js', tag: 'SPA/SSR' },
      { name: 'React Native', tag: 'MOBILE CORE' },
      { name: 'Tailwind CSS', tag: 'UTILITY' },
    ],
    order: 2,
  },
  {
    id: 'persistence-data',
    title: { en: 'Persistence & Data', id: 'Persistensi & Data' },
    context: {
      en: 'Designing strictly consistent schemas and high-performance data abstraction layers.',
      id: 'Mendesain skema yang konsisten ketat dan lapisan abstraksi data berperforma tinggi.',
    },
    skills: [
      { name: 'PostgreSQL / Prisma', tag: 'ORCHESTRATION' },
      { name: 'MySQL / SQLite', tag: 'RELATIONAL' },
      { name: 'Firebase', tag: 'REAL-TIME' },
    ],
    order: 3,
  },
  {
    id: 'communication-layers',
    title: { en: 'Communication Layers', id: 'Lapisan Komunikasi' },
    context: {
      en: 'Handling asynchronous message brokering and low-level protocol orchestration.',
      id: 'Menangani brokering pesan asinkron dan orkestrasi protokol level rendah.',
    },
    skills: [
      { name: 'RabbitMQ / MQTT', tag: 'MESSAGING' },
      { name: 'TCP/IP / Serial', tag: 'HARDWARE' },
      { name: 'REST API', tag: 'CONTRACTS' },
    ],
    order: 4,
  },
  {
    id: 'devops-tooling',
    title: { en: 'DevOps & Tooling', id: 'DevOps & Peralatan' },
    context: {
      en: 'Managing containerized environments and automated version control pipelines.',
      id: 'Mengelola lingkungan terkontainerisasi dan pipeline version control otomatis.',
    },
    skills: [
      { name: 'Docker', tag: 'CONTAINERS' },
      { name: 'Git', tag: 'VERSIONING' },
      { name: 'Linux', tag: 'SYSTEM' },
    ],
    order: 5,
  },
  {
    id: 'ai-design-ecosystem',
    title: { en: 'AI & Design Ecosystem', id: 'Ekosistem AI & Desain' },
    context: {
      en: 'Leveraging generative tooling and systematic components for engineering velocity.',
      id: 'Memanfaatkan peralatan generatif dan komponen sistematis untuk kecepatan engineering.',
    },
    skills: [
      { name: 'Claude / Gemini', tag: 'AI_AUG' },
      { name: 'Figma / Stitch', tag: 'SYSTEMS' },
      { name: 'Figma Make', tag: 'GEN_UI' },
    ],
    order: 6,
  },
];

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────
async function seed() {
  const batch = db.batch();

  console.log('Seeding projects...');
  for (const p of projects) {
    const { id: docId, ...data } = p;
    batch.set(db.collection('projects').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding blogs...');
  for (const b of blogs) {
    const { id: docId, ...data } = b;
    batch.set(db.collection('blogs').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding experience...');
  for (const e of experience) {
    const { id: docId, ...data } = e;
    batch.set(db.collection('experience').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seeding skills...');
  for (const s of skills) {
    const { id: docId, ...data } = s;
    batch.set(db.collection('skills').doc(docId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  await batch.commit();
  console.log(`Seeded ${projects.length} projects, ${blogs.length} blogs, ${experience.length} experience items, ${skills.length} skill groups.`);
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

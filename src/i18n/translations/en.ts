export const en = {
  nav: {
    about: 'About',
    stack: 'Stack',
    experience: 'Experience',
    projects: 'Projects',
    blog: 'Blog',
    contact: 'Contact',
  },
  hero: {
    tagline: 'System Architect Core',
    headline: "I don't return undefined.",
    ctaGame: 'Wanna play a game?',
    ctaContact: 'Protocol_Initialize',
  },
  about: {
    title: 'Structural Engineer',
    headline: 'I architect systems where reliability is the baseline.',
    stats: {
      e2e: 'Lifecycle Ownership',
      zero: 'Tolerance for Fluff',
      tdd: 'Quality Standard',
    },
  },
  skills: {
    title: 'Technical Skills',
    groups: {
      core: 'Core Engineering',
      client: 'Client & Interface',
      data: 'Data & Persistence',
      communication: 'Communication Layer',
      devops: 'DevOps & Tooling',
      ai: 'AI Ecosystem & Design',
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
    title: 'Professional Trajectory',
    jobs: [
      {
        period: 'Jan 2022 — Present',
        title: 'Senior Systems Engineer',
        company: 'DataNode Solutions',
        current: true,
        points: [
          'Architected an AMQP-based message broker system (RabbitMQ) handling multi-node telemetry data for industrial sensors.',
          'Engineered a strictly-typed React Native core with offline-first synchronization via SQLite, ensuring continuous data integrity in remote environments.',
          'Designed and maintained a PostgreSQL schema for 10M+ records, optimizing query latency through strategic indexing and Prisma ORM abstraction.',
        ],
      },
      {
        period: 'Mar 2020 — Dec 2021',
        title: 'Fullstack Developer',
        company: 'Protocol Digital',
        current: false,
        points: [
          'Debugged and refactored a legacy Node.js monolith into a Dockerized modular architecture, improving deployment reliability by 60%.',
          'Developed custom TCP/IP protocols for secure hardware-software communication in proprietary IoT devices.',
          'Refined frontend performance in Next.js applications by implementing meticulous state management and Tailwind CSS optimization.',
        ],
      },
      {
        period: 'June 2018 — Feb 2020',
        title: 'Mobile Core Specialist',
        company: 'Systemic Soft',
        current: false,
        points: [
          'Owned the full delivery of 5+ production-grade React Native applications from flowchart mapping to App Store deployment.',
          'Implemented real-time data streaming via MQTT for low-latency command sets in smart-infrastructure projects.',
          'Maintained high-availability Firestore databases, ensuring 99.9% uptime through rigorous schema validation and security rules.',
        ],
      },
    ],
  },
  projects: {
    title: 'System Architecture & Deployment',
    cta: 'ACCESS_SYSTEM_ARCHIVE',
    viewDetail: 'View_Detail',
    metadata: {
      access: 'Access: Granted',
      checksum: 'Checksum: Validated',
      target: 'Target: Prod_Env',
    },
  },
  projectItems: [
    {
      name: 'Distributed IoT Orchestration',
      desc: 'Engineered a high-availability telemetry gateway using MQTT and AMQP (RabbitMQ) to handle real-time data from 5,000+ nodes. Implemented circuit breakers and message persistence to ensure zero data loss during network partitions.',
    },
    {
      name: 'Enterprise Mobile Core v2',
      desc: 'Architected an offline-first mobile sync engine for React Native using SQLite and custom TCP/IP protocols. Developed a robust resolution logic for data conflicts between distributed local stores and a centralized PostgreSQL cluster.',
    },
    {
      name: 'Financial Ledger Engine',
      desc: 'Designed and implemented a strictly consistent transactional ledger using Prisma ORM and PostgreSQL. Ensured atomicity across multi-step financial operations with row-level locking and comprehensive TDD coverage.',
    },
    {
      name: 'Real-time Analytics Pipeline',
      desc: 'Built a high-throughput streaming analytics platform using Apache Kafka and Go. Successfully reduced data processing latency by 45% while handling ingress bursts of 50k events per second.',
    },
    {
      name: 'Security Auth Middleware',
      desc: 'Developed a distributed authentication service with JWT and multi-provider OAuth integration. Implemented high-entropy secret rotation and brute-force protection using rate-limiting layers.',
    },
    {
      name: 'Cloud Resource Monitor',
      desc: 'Designed a centralized visualizer for multi-cloud resource consumption (AWS/GCP). Integrated real-time billing alerts and automated node-scaling protocols based on predictive load modeling.',
    },
  ],
  blog: {
    title: 'Technical Logs',
    cta: 'ACCESS_FULL_ARCHIVE',
    readEntry: 'READ_LOG_ENTRY',
  },
  blogEntries: {
    'debugging-rabbitmq-race-conditions': {
      title: 'Debugging Race Conditions in RabbitMQ',
      excerpt: 'An analysis of message acknowledgment patterns and prefetch configurations in high-throughput Node.js consumers.',
    },
    'prisma-orm-performance': {
      title: 'Prisma ORM: Performance Trade-offs',
      excerpt: 'Evaluating query batching and connection pooling strategies in serverless vs. long-running Express environments.',
    },
    'reliable-mobile-sync-mqtt': {
      title: 'Reliable Mobile Sync over MQTT',
      excerpt: 'Implementing QOS-2 guarantees in React Native applications for mission-critical industrial telemetry.',
    },
    'optimizing-postgresql-indexing': {
      title: 'Optimizing PostgreSQL for 10M+ Rows',
      excerpt: 'Exploring strategic indexing, partitioning, and vacuuming strategies for high-volume relational data.',
    },
    'monorepo-engineering-workflow': {
      title: 'The Case for Mono-repos in 2024',
      excerpt: 'Refining the engineering workflow using Turborepo and strictly versioned internal package structures.',
    },
    'memory-management-react-native': {
      title: 'Memory Management in React Native',
      excerpt: 'Deep dive into garbage collection cycles and the performance impact of heavy Reanimated 2 transforms.',
    },
  },
  contact: {
    headline: "Let's engineer solutions together.",
    labels: {
      title: '01 / Request_Title',
      payload: '02 / Query_Payload',
    },
    placeholders: {
      title: 'Enter project subject...',
      payload: 'Describe project architecture constraints...',
    },
    buttons: {
      transmit: 'Transmit_Protocol',
      copyUid: 'COPY_UID',
    },
  },
  footer: {
    role: 'Senior Systems Engineer',
  },
  hireBanner: {
    badge: 'SYSTEM_AVAILABILITY :: OPEN_FOR_MISSIONS',
    headline: 'Need an Architect to Scale Your Vision?',
    cta: 'INITIALIZE_Recruitment_Protocol',
  },
  game: {
    badge: '[ ENTER_SIMULATION ]',
    hud: {
      sessionScore: 'Session_Score',
      terminalHigh: 'Terminal_High_Mark',
      nearRecord: 'Near_Record',
      newHighScore: 'New_High_Score',
    },
    preGame: {
      title: 'System_Simulation',
      waiting: 'Awaiting defensive deployment...',
    },
    countdown: {
      go: 'GO',
      syncing: 'Sync_In_Progress',
    },
    gameOver: {
      title: 'FALLEN',
      subtitle: 'Simulation_Terminated',
      finalHarvest: 'Final_Harvest',
    },
    highScore: {
      newMark: 'New_Terminal_Mark',
      pilotId: 'PILOT_ID',
      commitIdentity: 'COMMIT_IDENTITY',
      identitySecured: 'Identity_Secured:',
      sharePerformance: 'SHARE_PERFORMANCE',
      redeploy: 'RE-DEPLOY',
    },
  },
  dateFormat: {
    locale: 'en-US',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  phrases: [
    'Systems Architect',
    'Fullstack Engineer',
    'Mobile Core Developer',
    'Automation Specialist',
  ],
} as const;

export const PROJECTS = [
  {
    name: "Distributed IoT Orchestration",
    desc: "Engineered a high-availability telemetry gateway using MQTT and AMQP (RabbitMQ) to handle real-time data from 5,000+ nodes. Implemented circuit breakers and message persistence to ensure zero data loss during network partitions.",
    tech: ["Node.js", "RabbitMQ", "PostgreSQL", "MQTT"],
    version: "v4.2.1",
    status: "PRODUCTION"
  },
  {
    name: "Enterprise Mobile Core v2",
    desc: "Architected an offline-first mobile sync engine for React Native using SQLite and custom TCP/IP protocols. Developed a robust resolution logic for data conflicts between distributed local stores and a centralized PostgreSQL cluster.",
    tech: ["React Native", "SQLite", "TypeScript", "TCP/IP"],
    version: "v1.0.5",
    status: "STABLE"
  },
  {
    name: "Financial Ledger Engine",
    desc: "Designed and implemented a strictly consistent transactional ledger using Prisma ORM and PostgreSQL. Ensured atomicity across multi-step financial operations with row-level locking and comprehensive TDD coverage.",
    tech: ["Next.js", "Prisma ORM", "PostgreSQL", "Docker"],
    version: "v2.2.0",
    status: "DEPLOYED"
  },
  {
    name: "Real-time Analytics Pipeline",
    desc: "Built a high-throughput streaming analytics platform using Apache Kafka and Go. Successfully reduced data processing latency by 45% while handling ingress bursts of 50k events per second.",
    tech: ["Go", "Kafka", "Redis", "Prometheus"],
    version: "v3.1.0",
    status: "OPTIMIZED"
  },
  {
    name: "Security Auth Middleware",
    desc: "Developed a distributed authentication service with JWT and multi-provider OAuth integration. Implemented high-entropy secret rotation and brute-force protection using rate-limiting layers.",
    tech: ["Node.js", "Redis", "OAuth 2.0", "Auth0"],
    version: "v2.0.4",
    status: "SECURITY_OK"
  },
  {
    name: "Cloud Resource Monitor",
    desc: "Designed a centralized visualizer for multi-cloud resource consumption (AWS/GCP). Integrated real-time billing alerts and automated node-scaling protocols based on predictive load modeling.",
    tech: ["Python", "React", "GCP SDK", "TensorFlow"],
    version: "v1.5.2",
    status: "LIVE"
  }
];

export const BLOGS = [
  { 
    slug: "debugging-rabbitmq-race-conditions",
    title: "Debugging Race Conditions in RabbitMQ", 
    date: "Oct 24, 2023", 
    excerpt: "An analysis of message acknowledgment patterns and prefetch configurations in high-throughput Node.js consumers.",
    content: `
# Debugging Race Conditions in RabbitMQ

Race conditions in message brokers can be elusive and destructive. In our high-throughput Node.js environment, we encountered situations where messages were being processed multiple times or out of order due to improper acknowledgment patterns.

## The Challenge
We were handling over 5,000 telemetry packets per second. Our initial implementation used dynamic prefetch counts, which led to a "greedy consumer" problem.

## Key Findings
1. **Manual Acknowledgments**: Switching from automatic to manual acks (\`noAck: false\`) was critical for reliability.
2. **Prefetch Tuning**: We found that setting a global prefetch limit across channels helped balance the load more effectively than per-consumer limits.
3. **Dead Letter Exchanges (DLX)**: Implementing DLX allowed us to isolate "poison pills" that were causing infinite retry loops.

## Conclusion
System architecture isn't just about moving data; it's about ensuring state consistency across distributed nodes.
    `
  },
  { 
    slug: "prisma-orm-performance",
    title: "Prisma ORM: Performance Trade-offs", 
    date: "Aug 12, 2023", 
    excerpt: "Evaluating query batching and connection pooling strategies in serverless vs. long-running Express environments.",
    content: `
# Prisma ORM: Performance Analysis

Prisma changed how we interact with databases, but it's not a silver bullet. Understanding the engine under the hood is vital for scaling.

## The n+1 Problem
Even with type safety, it's easy to fall into the n+1 trap. We leveraged Prisma's \`include\` and \`select\` features to flatten our queries, reducing database trips by 70%.

## Connection Pooling
In serverless environments (AWS Lambda), connection exhaustion is a real threat. We implemented **Prisma Accelerate** to manage connection proxies, ensuring our lambdas didn't lock up the RDS instance.

## Query Raw as a Last Resort
Sometimes, the abstraction is too heavy. For complex analytical queries involving multiple joins and window functions, we reverted to \`$queryRaw\`.
    `
  },
  { 
    slug: "reliable-mobile-sync-mqtt",
    title: "Reliable Mobile Sync over MQTT", 
    date: "May 05, 2023", 
    excerpt: "Implementing QOS-2 guarantees in React Native applications for mission-critical industrial telemetry.",
    content: `
# Reliable Mobile Sync over MQTT

Industrial environments have terrible connectivity. When building mobile cores for these sites, "online-first" is a recipe for failure.

## QoS 2: Exactly Once
Most developers stick to QoS 0 (Fire and Forget) or QoS 1 (At least once). For our financial audit logs, we needed QoS 2 (Exactly once). This involves a 4-step handshake that ensures the packet is received and processed only once.

## The Bridge Problem
Syncing mobile local storage with a central cloud via MQTT requires a robust "Last Will and Testament" (LWT) strategy to handle unexpected disconnects.

## Battery Optimization
Maintaining a persistent TCP connection is expensive. We implemented a dynamic heartbeat that scales based on the device's battery level and network stability.
    `
  },
  { 
    slug: "optimizing-postgresql-indexing",
    title: "Optimizing PostgreSQL for 10M+ Rows", 
    date: "Dec 15, 2023", 
    excerpt: "Exploring strategic indexing, partitioning, and vacuuming strategies for high-volume relational data.",
    content: `
# Optimizing PostgreSQL for Scale

When your tables cross the 10 million row mark, standard indexes start to feel sluggish.

## BRIN and GIN Indexes
For time-series data or logs, B-tree indexes get bloated. We switched to **BRIN (Block Range Indexes)**, which are 99% smaller while maintaining high performance for sorted data.

## Table Partitioning
Querying a year's worth of data was slow. Partitioning the database by month allowed PostgreSQL to prune entire sections of the table during scans, cutting execution time from 2s to 150ms.

## Autovacuum Tuning
Default vacuum settings are too conservative for write-heavy apps. We tuned our autovacuum parameters to prevent table bloat and maintain index efficiency.
    `
  },
  { 
    slug: "monorepo-engineering-workflow",
    title: "The Case for Mono-repos in 2024", 
    date: "Jan 10, 2024", 
    excerpt: "Refining the engineering workflow using Turborepo and strictly versioned internal package structures.",
    content: `
# Mono-repos: Engineering Velocity

Managing 15 separate repositories was killing our productivity. Dependency hell was a daily reality.

## The Turborepo Revolution
We consolidated our stack into a single repository managed by **Turborepo**. The remote caching feature alone reduced our CI/CD times from 12 minutes to 3 minutes.

## Shared Schema
By keeping our frontend and backend in one place, we could share Zod schemas and TypeScript interfaces natively. No more broken API contracts.

## Conclusion
A monorepo isn't just about putting code together; it's about building a unified system where every component evolves in sync.
    `
  },
  { 
    slug: "memory-management-react-native",
    title: "Memory Management in React Native", 
    date: "Feb 28, 2024", 
    excerpt: "Deep dive into garbage collection cycles and the performance impact of heavy Reanimated 2 transforms.",
    content: `
# Memory Management in React Native

Smooth 60FPS animations require more than just code; they require respect for the JS bridge and the device's RAM.

## The Image Leak
Most memory issues in React Native stem from un-optimized images. We implemented **FastImage** with aggressive cache clearing to prevent the native heap from ballooning.

## Reanimated and UI-Threads
Moving complex logic from the JS thread to the UI thread using **Reanimated 2** worklets was the single biggest performance boost. It decoupled our animations from the garbage collector's whims.

## Memory Leak Detection
Using the Xcode Memory Graph and Android Profiler, we identified that our custom event listeners weren't being properly cleaned up in \`useEffect\` returns.
    `
  }
];

export const PHRASES = ["Systems Architect", "Fullstack Engineer", "Mobile Core Developer", "Automation Specialist"];

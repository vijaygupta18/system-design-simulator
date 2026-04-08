import type { SystemComponent } from "@/types/component";

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  // Networking
  {
    id: "dns",
    label: "DNS",
    category: "networking",
    icon: "Globe",
    maxQPS: 100000,
    latencyMs: 10,
    scalable: true,
    stateful: false,
    description:
      "Domain Name System — resolves human-readable domain names (e.g., example.com) to IP addresses. Every internet request starts with a DNS lookup, making it the first hop in any system design. Services like AWS Route 53 and Google Cloud DNS also support health-checked routing and geo-based load balancing.",
  },
  {
    id: "cdn",
    label: "CDN",
    category: "networking",
    icon: "Cloudy",
    maxQPS: 500000,
    latencyMs: 15,
    scalable: true,
    stateful: false,
    description:
      "Content Delivery Network — caches static assets (images, JS, CSS, videos) at edge locations close to users, reducing latency from hundreds of milliseconds to low double digits. Essential for any read-heavy or media-heavy system serving a global audience. Examples include Amazon CloudFront, Google Cloud CDN, and Cloudflare.",
  },
  {
    id: "load-balancer",
    label: "Load Balancer",
    category: "networking",
    icon: "Network",
    maxQPS: 1000000,
    latencyMs: 1,
    scalable: true,
    stateful: false,
    description:
      "Distributes incoming traffic across multiple backend servers using algorithms like round-robin, least-connections, or weighted routing. Prevents any single server from becoming a bottleneck and enables zero-downtime deployments via rolling updates. AWS ALB/NLB, Google Cloud Load Balancing, and HAProxy are common choices.",
  },
  {
    id: "api-gateway",
    label: "API Gateway",
    category: "networking",
    icon: "Router",
    maxQPS: 50000,
    latencyMs: 10,
    scalable: true,
    stateful: false,
    description:
      "Single entry point for all API requests — handles routing, authentication, rate limiting, request transformation, and protocol translation. Use it when you have multiple microservices behind a unified API surface. AWS API Gateway, Kong, and Google Cloud Apigee are popular managed options.",
  },
  {
    id: "rate-limiter",
    label: "Rate Limiter",
    category: "networking",
    icon: "ShieldAlert",
    maxQPS: 80000,
    latencyMs: 1,
    scalable: true,
    stateful: true,
    description:
      "Throttles requests per client, IP, or API key to protect downstream services from abuse, DDoS attacks, and traffic spikes. Typically implemented using token bucket or sliding window algorithms backed by Redis. Often built into API gateways like Kong or AWS WAF, or implemented as a standalone service.",
  },
  // Compute
  {
    id: "app-server",
    label: "App Server",
    category: "compute",
    icon: "Server",
    maxQPS: 5000,
    latencyMs: 20,
    scalable: true,
    stateful: false,
    description:
      "Stateless application server that executes core business logic and serves API requests. Designed to scale horizontally — spin up more instances behind a load balancer to handle increased traffic. Runs on AWS EC2/ECS, Google Compute Engine, or containerized in Kubernetes pods.",
  },
  {
    id: "auth-service",
    label: "Auth Service",
    category: "compute",
    icon: "KeyRound",
    maxQPS: 10000,
    latencyMs: 15,
    scalable: true,
    stateful: false,
    description:
      "Dedicated authentication and authorization service that handles user login, token issuance (JWT/OAuth2), session management, and permission checks. Centralizing auth prevents security logic from being scattered across microservices. Examples include AWS Cognito, Auth0, Firebase Auth, and Google Cloud Identity Platform.",
  },
  // Storage
  {
    id: "sql-db",
    label: "SQL Database",
    category: "storage",
    icon: "Database",
    maxQPS: 10000,
    latencyMs: 8,
    scalable: true,
    stateful: true,
    description:
      "Relational database providing ACID transactions, strong consistency, and structured schemas with SQL queries. Best for data with complex relationships, joins, and strict integrity requirements (e.g., financial transactions, user accounts). Examples include Amazon RDS (PostgreSQL/MySQL), Google Cloud SQL, and Amazon Aurora. Can scale reads via replicas.",
  },
  {
    id: "nosql-db",
    label: "NoSQL Database",
    category: "storage",
    icon: "HardDrive",
    maxQPS: 50000,
    latencyMs: 3,
    scalable: true,
    stateful: true,
    description:
      "Non-relational database optimized for flexible schemas, horizontal scaling, and high-throughput workloads. Choose it when you need low-latency key-value lookups, wide-column storage, or document-oriented data without complex joins. Amazon DynamoDB, Google Cloud Bigtable, MongoDB Atlas, and Apache Cassandra are widely used.",
  },
  {
    id: "cache",
    label: "Cache / Redis",
    category: "storage",
    icon: "Zap",
    maxQPS: 100000,
    latencyMs: 1,
    scalable: true,
    stateful: true,
    description:
      "In-memory data store delivering sub-millisecond read latency for frequently accessed data, session storage, leaderboards, and real-time counters. Placing a cache between your app servers and database can reduce DB load by 80-90% for read-heavy workloads. Amazon ElastiCache (Redis/Memcached) and Google Cloud Memorystore are managed options.",
  },
  {
    id: "object-storage",
    label: "Object Storage",
    category: "storage",
    icon: "Archive",
    maxQPS: 25000,
    latencyMs: 75,
    scalable: true,
    stateful: true,
    description:
      "Highly durable blob/object storage for unstructured data like images, videos, backups, and static website assets. Offers virtually unlimited capacity with 99.999999999% (11 nines) durability. Amazon S3, Google Cloud Storage, and Azure Blob Storage are the industry standards, often paired with a CDN for fast delivery.",
  },
  {
    id: "search",
    label: "Search / ES",
    category: "storage",
    icon: "Search",
    maxQPS: 20000,
    latencyMs: 10,
    scalable: true,
    stateful: true,
    description:
      "Full-text search engine that indexes and queries large volumes of text with features like fuzzy matching, faceted search, and relevance scoring. Use it when users need to search across product catalogs, logs, or content feeds. Elasticsearch (Amazon OpenSearch), Apache Solr, and Google Cloud Search are common choices.",
  },
  // Messaging
  {
    id: "message-queue",
    label: "Message Queue",
    category: "messaging",
    icon: "MessageSquare",
    maxQPS: 100000,
    latencyMs: 5,
    scalable: true,
    stateful: true,
    description:
      "Asynchronous message broker that decouples producers from consumers, enabling reliable background processing, event-driven architectures, and traffic spike buffering. Critical for any workflow where synchronous processing would create bottlenecks or coupling. Apache Kafka, Amazon SQS/SNS, Google Cloud Pub/Sub, and RabbitMQ are widely adopted.",
  },
  // Infrastructure
  {
    id: "service-mesh",
    label: "Service Mesh",
    category: "infrastructure",
    icon: "GitBranch",
    maxQPS: 80000,
    latencyMs: 2,
    scalable: true,
    stateful: false,
    description:
      "Transparent service-to-service communication layer that handles mutual TLS, retries, circuit breaking, load balancing, and distributed tracing between microservices. Use it when your microservice count grows beyond what manual configuration can manage. Istio, Linkerd, and AWS App Mesh are leading implementations.",
  },
  {
    id: "monitoring",
    label: "Monitoring",
    category: "infrastructure",
    icon: "Activity",
    maxQPS: 500000,
    latencyMs: 5,
    scalable: true,
    stateful: true,
    description:
      "Observability stack for metrics collection, centralized logging, distributed tracing, and alerting. Every production system needs monitoring to detect outages, track SLOs, and debug performance issues. Prometheus + Grafana, AWS CloudWatch, Google Cloud Monitoring, Datadog, and the ELK stack are standard tools.",
  },
  // Real-time
  {
    id: "websocket-server",
    label: "WebSocket Server",
    category: "compute",
    icon: "Radio",
    maxQPS: 50000,
    latencyMs: 2,
    scalable: true,
    stateful: true,
    description:
      "Maintains persistent bidirectional connections for real-time communication. Essential for chat apps, live notifications, collaborative editing, and gaming. Services like Socket.io, AWS API Gateway WebSocket, and Pusher handle millions of concurrent connections with connection-to-server mapping stored in Redis.",
  },
  {
    id: "task-scheduler",
    label: "Task Scheduler",
    category: "compute",
    icon: "Clock",
    maxQPS: 10000,
    latencyMs: 50,
    scalable: true,
    stateful: false,
    description:
      "Manages delayed, scheduled, and recurring background jobs with retry logic and dead-letter queues. Critical for email campaigns, report generation, data pipelines, and cleanup tasks. Celery, AWS Step Functions, Google Cloud Tasks, and Temporal are common implementations.",
  },
  {
    id: "stream-processor",
    label: "Stream Processor",
    category: "compute",
    icon: "Waves",
    maxQPS: 200000,
    latencyMs: 10,
    scalable: true,
    stateful: true,
    description:
      "Processes continuous data streams in real-time for analytics, event processing, and ETL pipelines. Handles windowed aggregations, joins, and transformations on unbounded data. Apache Kafka Streams, Apache Flink, Spark Streaming, and AWS Kinesis Data Analytics are industry standards.",
  },
  {
    id: "notification-service",
    label: "Notification Service",
    category: "compute",
    icon: "Bell",
    maxQPS: 50000,
    latencyMs: 100,
    scalable: true,
    stateful: false,
    description:
      "Orchestrates multi-channel delivery of push notifications, emails, SMS, and in-app messages with priority queuing, template rendering, and delivery tracking. Firebase Cloud Messaging, AWS SNS/SES, Twilio, and OneSignal handle billions of notifications daily with device token management.",
  },
  // Advanced Storage
  {
    id: "graph-db",
    label: "Graph Database",
    category: "storage",
    icon: "Share2",
    maxQPS: 8000,
    latencyMs: 15,
    scalable: true,
    stateful: true,
    description:
      "Stores and queries highly connected data using nodes, edges, and properties — optimized for relationship traversals like friend-of-friend queries, recommendation engines, and fraud detection. Neo4j, Amazon Neptune, and JanusGraph significantly outperform relational joins for multi-hop traversals.",
  },
  {
    id: "timeseries-db",
    label: "Time-Series DB",
    category: "storage",
    icon: "TrendingUp",
    maxQPS: 100000,
    latencyMs: 3,
    scalable: true,
    stateful: true,
    description:
      "Optimized for ingesting and querying time-stamped data with built-in downsampling, retention policies, and time-windowed aggregations. Essential for monitoring metrics, IoT sensor data, and financial tick data. InfluxDB, TimescaleDB, Amazon Timestream, and Prometheus TSDB are purpose-built for this workload.",
  },
  {
    id: "data-warehouse",
    label: "Data Warehouse",
    category: "storage",
    icon: "Warehouse",
    maxQPS: 1000,
    latencyMs: 5000,
    scalable: true,
    stateful: true,
    description:
      "Columnar analytical database designed for complex queries across terabytes/petabytes of historical data. Separates analytics from operational databases to prevent query load from impacting production. Google BigQuery, Amazon Redshift, Snowflake, and ClickHouse support SQL analytics at massive scale.",
  },
  // Infrastructure
  {
    id: "service-discovery",
    label: "Service Discovery",
    category: "infrastructure",
    icon: "Compass",
    maxQPS: 50000,
    latencyMs: 1,
    scalable: true,
    stateful: true,
    description:
      "Enables microservices to find and communicate with each other dynamically without hardcoded addresses. Handles service registration, health checking, and DNS-based or API-based lookups. HashiCorp Consul, Apache ZooKeeper, etcd, and AWS Cloud Map are widely used for service mesh coordination.",
  },
  {
    id: "reverse-proxy",
    label: "Reverse Proxy",
    category: "networking",
    icon: "Shield",
    maxQPS: 100000,
    latencyMs: 1,
    scalable: true,
    stateful: false,
    description:
      "Sits between clients and backend servers to handle SSL termination, request routing, caching, compression, and security filtering. Unlike a load balancer, it can also serve cached content, rewrite URLs, and add security headers. Nginx, Envoy, Cloudflare, and AWS CloudFront function as reverse proxies.",
  },
  {
    id: "distributed-lock",
    label: "Distributed Lock",
    category: "infrastructure",
    icon: "Lock",
    maxQPS: 10000,
    latencyMs: 5,
    scalable: false,
    stateful: true,
    description:
      "Provides mutual exclusion across distributed systems to prevent race conditions in critical sections like inventory updates, leader election, and distributed transactions. Redis Redlock, Apache ZooKeeper recipes, and etcd lease-based locks are common implementations with trade-offs between safety and liveness.",
  },
  {
    id: "circuit-breaker",
    label: "Circuit Breaker",
    category: "infrastructure",
    icon: "ShieldOff",
    maxQPS: 100000,
    latencyMs: 1,
    scalable: true,
    stateful: true,
    description:
      "Prevents cascading failures by monitoring downstream service health and short-circuiting requests when failure rates exceed a threshold. Implements three states: closed (normal), open (failing, reject immediately), and half-open (testing recovery). Netflix Hystrix popularized the pattern; Resilience4j, Envoy, and Istio provide modern implementations.",
  },
  {
    id: "file-store",
    label: "File Store",
    category: "storage",
    icon: "FolderOpen",
    maxQPS: 10000,
    latencyMs: 10,
    scalable: true,
    stateful: true,
    description:
      "Network-attached file storage providing POSIX-compatible file system semantics for shared access across multiple compute instances. Supports hierarchical directories, file locking, and concurrent reads/writes. Amazon EFS, Google Cloud Filestore, and Azure Files are managed options. Use when applications need a traditional file system interface rather than object/blob APIs.",
  },
  {
    id: "origin-shield",
    label: "Origin Shield",
    category: "networking",
    icon: "ShieldCheck",
    maxQPS: 200000,
    latencyMs: 5,
    scalable: true,
    stateful: false,
    description:
      "An additional caching layer between CDN edge locations and the origin server that reduces origin load by collapsing duplicate requests from multiple edge PoPs into a single origin fetch. Reduces origin bandwidth by 50-90% for popular content. AWS CloudFront Origin Shield, Cloudflare Tiered Cache, and Fastly Shield PoPs are implementations.",
  },
  {
    id: "coordination-service",
    label: "Coordination Service",
    category: "infrastructure",
    icon: "Users",
    maxQPS: 20000,
    latencyMs: 5,
    scalable: true,
    stateful: true,
    description:
      "Provides distributed coordination primitives: leader election, configuration management, distributed barriers, and group membership. Built on consensus protocols (Raft/ZAB) for strong consistency. Apache ZooKeeper, etcd, and Consul are the primary implementations. Essential for distributed systems that need agreement on shared state.",
  },
  {
    id: "custom",
    label: "Custom Component",
    category: "compute",
    icon: "Box",
    maxQPS: 50000,
    latencyMs: 10,
    scalable: true,
    stateful: false,
    description:
      "A generic component that can be renamed to represent any service, system, or infrastructure not available in the predefined component library. Double-click the node label on the canvas to rename it. Use this for specialized services like ML inference engines, recommendation services, fraud detection, content moderation, or any domain-specific component.",
  },
  // ID & Counting
  {
    id: "id-generator",
    label: "ID Generator",
    category: "infrastructure",
    icon: "Fingerprint",
    maxQPS: 500000,
    latencyMs: 1,
    scalable: true,
    stateful: true,
    description:
      "Generates globally unique, sortable IDs across distributed nodes using algorithms like Twitter Snowflake, ULID, or UUID. Each node embeds a timestamp, machine ID, and sequence number to guarantee uniqueness without centralized coordination. Essential for database primary keys, URL shortening, event ordering, and sharding keys.",
  },
  {
    id: "sharded-counter",
    label: "Sharded Counter",
    category: "infrastructure",
    icon: "Hash",
    maxQPS: 500000,
    latencyMs: 2,
    scalable: true,
    stateful: true,
    description:
      "Distributes a single logical counter across multiple shards to avoid hot-key bottlenecks under massive concurrent writes. Reads aggregate across shards with eventual consistency. Critical for like counts, view counters, follower counts, and real-time voting at scale. Typically backed by Redis or purpose-built counter tables with periodic reconciliation.",
  },
  // Messaging
  {
    id: "pub-sub",
    label: "Pub/Sub",
    category: "messaging",
    icon: "Megaphone",
    maxQPS: 200000,
    latencyMs: 5,
    scalable: true,
    stateful: true,
    description:
      "Topic-based publish/subscribe messaging where each message is broadcast to all subscribers, unlike point-to-point queues where each message is consumed by one consumer. Enables event-driven fan-out for feeds, analytics pipelines, CDC, and cross-service event propagation. Google Cloud Pub/Sub, AWS SNS, and Apache Kafka topics are canonical implementations.",
  },
  // Storage
  {
    id: "vector-db",
    label: "Vector Database",
    category: "storage",
    icon: "Brain",
    maxQPS: 10000,
    latencyMs: 10,
    scalable: true,
    stateful: true,
    description:
      "Stores high-dimensional vector embeddings and performs approximate nearest-neighbor (ANN) search for similarity matching. Powers recommendation engines, semantic search, image search, and RAG-based AI systems. Pinecone, Weaviate, Milvus, Qdrant, and pgvector are leading implementations using HNSW or IVF indexing algorithms.",
  },
  {
    id: "geospatial-index",
    label: "Geospatial Index",
    category: "storage",
    icon: "MapPin",
    maxQPS: 50000,
    latencyMs: 5,
    scalable: true,
    stateful: true,
    description:
      "Indexes and queries location data using geohash, quadtree, R-tree, or H3 hexagonal grids for efficient nearest-neighbor and radius searches. Essential for ride-sharing, food delivery, local search, and any proximity-based system. PostGIS, Redis GEO (GEOADD/GEOSEARCH), Elasticsearch geo_point, and Google S2 library are common implementations.",
  },
  // Infrastructure
  {
    id: "config-service",
    label: "Config Service",
    category: "infrastructure",
    icon: "Settings",
    maxQPS: 50000,
    latencyMs: 2,
    scalable: true,
    stateful: true,
    description:
      "Centralized dynamic configuration management for feature flags, A/B test parameters, and runtime settings without redeployment. Supports versioning, rollback, targeted rollouts by user segment, and real-time propagation to all service instances. AWS AppConfig, LaunchDarkly, Unleash, and etcd-backed config stores are common implementations.",
  },
];

export const COMPONENT_CATEGORIES = [
  { key: "networking", label: "Networking" },
  { key: "compute", label: "Compute" },
  { key: "storage", label: "Storage" },
  { key: "messaging", label: "Messaging" },
  { key: "infrastructure", label: "Infrastructure" },
] as const;

export function getComponentById(id: string): SystemComponent | undefined {
  return SYSTEM_COMPONENTS.find((c) => c.id === id);
}

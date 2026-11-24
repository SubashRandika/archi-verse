import { type CategoryDefinition, ref } from "../types";

export const backendDistributedSystems: CategoryDefinition = {
  id: "backend-distributed-systems",
  title: "Backend & Distributed Systems Fundamentals",
  description:
    "How backend systems are structured and scaled across many machines, and the consistency trade-offs that distribution brings.",
  icon: "backend",
  order: 14,
  concepts: [
    {
      id: "monolith-vs-microservices",
      title: "Monolith vs Microservices",
      summary:
        "One deployable application versus many small, independently deployed services, and the trade-offs between them.",
      keywords: ["microservices"],
    },
    {
      id: "service-oriented-architecture",
      title: "Service-Oriented Architecture (SOA)",
      summary:
        "Building systems from reusable, coarse-grained services, often connected through an enterprise service bus.",
      keywords: ["SOA", "ESB"],
    },
    {
      id: "distributed-systems",
      title: "Distributed Systems",
      summary:
        "Systems whose parts run on networked computers and coordinate by passing messages, which brings latency and partial failure.",
    },
    {
      id: "synchronous-vs-asynchronous-communication",
      title: "Synchronous vs Asynchronous Communication",
      summary:
        "Waiting for a reply (request-response) versus sending a message and carrying on (events and queues).",
      keywords: ["sync", "async"],
    },
    {
      id: "event-driven-architecture",
      title: "Event-Driven Architecture",
      summary:
        "Services communicate by publishing events and reacting to them, which decouples producers from consumers.",
      keywords: ["EDA", "events"],
    },
    {
      id: "message-queues",
      title: "Message Queues",
      summary:
        "Buffers that hold messages until a consumer processes them, smoothing load spikes and decoupling services.",
      keywords: ["queue", "SQS"],
    },
    {
      id: "event-streaming",
      title: "Event Streaming",
      summary:
        "Recording events in a durable, ordered log that many consumers can read and replay independently.",
    },
    {
      id: "apache-kafka",
      title: "Apache Kafka",
      summary:
        "A distributed event-streaming platform built on partitioned, replicated, append-only logs.",
      keywords: ["Kafka", "topics", "partitions"],
    },
    {
      id: "rabbitmq",
      title: "RabbitMQ",
      summary:
        "A message broker that routes messages through exchanges to queues, with flexible routing patterns.",
      keywords: ["AMQP", "broker"],
    },
    ref("api-gateway"),
    ref("backend-for-frontend"),
    {
      id: "sql-vs-nosql",
      title: "SQL vs NoSQL",
      summary:
        "Relational databases with schemas and joins versus document, key-value, column and graph stores, and when to use each.",
      keywords: ["relational", "MongoDB", "PostgreSQL"],
    },
    {
      id: "database-indexing",
      title: "Database Indexing",
      summary:
        "Data structures, such as B-trees, that speed up lookups at the cost of extra storage and slower writes.",
      keywords: ["B-tree", "index"],
    },
    {
      id: "replication",
      title: "Replication",
      summary:
        "Keeping copies of data on several nodes for availability and read scaling, synchronously or asynchronously.",
      keywords: ["leader", "follower", "read replicas"],
    },
    {
      id: "sharding",
      title: "Sharding",
      summary:
        "Splitting data across nodes by a shard key, so that each node holds only part of the dataset.",
      keywords: ["partitioning", "shard key"],
    },
    {
      id: "eventual-consistency",
      title: "Eventual Consistency",
      summary:
        "Replicas may briefly disagree, but they converge on the same value once updates stop arriving.",
    },
    {
      id: "strong-consistency",
      title: "Strong Consistency",
      summary:
        "Every read sees the latest completed write, as if there were only a single copy of the data.",
      keywords: ["linearizability"],
    },
    {
      id: "cap-theorem",
      title: "CAP Theorem",
      summary:
        "During a network partition, a distributed system must choose between staying consistent and staying available.",
      keywords: ["CAP", "partition tolerance", "PACELC"],
    },
    {
      id: "acid-properties",
      title: "ACID Properties",
      summary:
        "Atomicity, consistency, isolation and durability: the guarantees of a database transaction.",
      keywords: ["ACID", "transactions"],
    },
    {
      id: "cqrs",
      title: "CQRS",
      summary:
        "Command Query Responsibility Segregation: using separate models for writing data and for reading it.",
      keywords: ["command query responsibility segregation"],
    },
    {
      id: "event-sourcing",
      title: "Event Sourcing",
      summary:
        "Storing state as an append-only sequence of events and rebuilding the current state by replaying them.",
    },
    ref("rate-limiting"),
    {
      id: "load-balancing",
      title: "Load Balancing",
      summary:
        "Distributing incoming requests across several servers to share the load and route around failures.",
      keywords: ["load balancer", "round robin"],
    },
    {
      id: "horizontal-scaling",
      title: "Horizontal Scaling",
      summary:
        "Adding more machines to handle more load, which usually requires stateless services.",
      keywords: ["scale out"],
    },
    {
      id: "vertical-scaling",
      title: "Vertical Scaling",
      summary: "Adding more CPU, memory or storage to a single machine: simple, but limited.",
      keywords: ["scale up"],
    },
    ref("distributed-caching"),
  ],
};

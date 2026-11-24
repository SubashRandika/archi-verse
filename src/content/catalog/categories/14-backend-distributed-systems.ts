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
      keywords: ["microservices"],
    },
    {
      id: "service-oriented-architecture",
      title: "Service-Oriented Architecture (SOA)",
      keywords: ["SOA", "ESB"],
    },
    {
      id: "distributed-systems",
      title: "Distributed Systems",
    },
    {
      id: "synchronous-vs-asynchronous-communication",
      title: "Synchronous vs Asynchronous Communication",
      keywords: ["sync", "async"],
    },
    {
      id: "event-driven-architecture",
      title: "Event-Driven Architecture",
      keywords: ["EDA", "events"],
    },
    {
      id: "message-queues",
      title: "Message Queues",
      keywords: ["queue", "SQS"],
    },
    {
      id: "event-streaming",
      title: "Event Streaming",
    },
    {
      id: "apache-kafka",
      title: "Apache Kafka",
      keywords: ["Kafka", "topics", "partitions"],
    },
    {
      id: "rabbitmq",
      title: "RabbitMQ",
      keywords: ["AMQP", "broker"],
    },
    ref("api-gateway"),
    ref("backend-for-frontend"),
    {
      id: "sql-vs-nosql",
      title: "SQL vs NoSQL",
      keywords: ["relational", "MongoDB", "PostgreSQL"],
    },
    {
      id: "database-indexing",
      title: "Database Indexing",
      keywords: ["B-tree", "index"],
    },
    {
      id: "replication",
      title: "Replication",
      keywords: ["leader", "follower", "read replicas"],
    },
    {
      id: "sharding",
      title: "Sharding",
      keywords: ["partitioning", "shard key"],
    },
    {
      id: "eventual-consistency",
      title: "Eventual Consistency",
    },
    {
      id: "strong-consistency",
      title: "Strong Consistency",
      keywords: ["linearizability"],
    },
    {
      id: "cap-theorem",
      title: "CAP Theorem",
      keywords: ["CAP", "partition tolerance", "PACELC"],
    },
    {
      id: "acid-properties",
      title: "ACID Properties",
      keywords: ["ACID", "transactions"],
    },
    {
      id: "cqrs",
      title: "CQRS",
      keywords: ["command query responsibility segregation"],
    },
    {
      id: "event-sourcing",
      title: "Event Sourcing",
    },
    ref("rate-limiting"),
    {
      id: "load-balancing",
      title: "Load Balancing",
      keywords: ["load balancer", "round robin"],
    },
    {
      id: "horizontal-scaling",
      title: "Horizontal Scaling",
      keywords: ["scale out"],
    },
    {
      id: "vertical-scaling",
      title: "Vertical Scaling",
      keywords: ["scale up"],
    },
    ref("distributed-caching"),
  ],
};

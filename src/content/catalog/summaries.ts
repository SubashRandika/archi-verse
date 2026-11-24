/**
 * One-sentence summaries of every concept, by concept id. Kept apart from the catalog so
 * they stay out of the first-load JavaScript (Phase 5 budget): server routes import them
 * directly; client code loads them lazily with `loadConceptSummaries()`.
 */
export const conceptSummaries: Readonly<Record<string, string>> = {
  "monolithic-front-end-architecture":
    "A single front-end codebase built and deployed as one unit. Simple to start with, but harder to scale across many teams.",
  "modular-front-end-architecture":
    "Splitting one application into well-bounded modules with explicit public APIs, so parts can change independently without separate deployments.",
  "layered-architecture":
    "Organising code into horizontal layers, such as UI, application logic and data access, where each layer only depends on the one below it.",
  "clean-architecture":
    "Keeping business rules at the centre, independent of frameworks, UI and data sources, with dependencies always pointing inwards.",
  "hexagonal-architecture":
    "The core defines interfaces (ports) and the outside world plugs in through adapters, so infrastructure can be swapped or faked in tests.",
  "domain-driven-design":
    "Modelling software around the business domain, with a shared language and bounded contexts that set clear ownership boundaries.",
  "solid-principles":
    "Five design principles: single responsibility, open/closed, Liskov substitution, interface segregation and dependency inversion.",
  "dependency-injection":
    "Supplying a component's dependencies from outside instead of creating them inside, which decouples code and makes it easy to test.",
  "feature-based-architecture":
    "Grouping code by feature, with everything for “checkout” in one place, rather than by technical type, so a change touches one folder.",
  "component-driven-architecture":
    "Building interfaces bottom-up from isolated, reusable components that are developed, tested and documented on their own.",
  "application-shell-architecture":
    "Loading a minimal, cached shell (navigation and layout) first and filling in the content afterwards, for fast and reliable start-up.",
  "plugin-based-architecture":
    "A stable core that exposes extension points, so new capabilities are added as plugins without modifying the core.",
  "architecture-decision-records":
    "Short documents that capture an important decision: its context, the options considered and the consequences.",
  "micro-frontend-architecture":
    "Composing one product from smaller front-end applications that are owned and deployed by independent teams.",
  "module-federation":
    "A bundler feature that loads code from separately deployed builds at runtime and shares dependencies between them.",
  "native-federation":
    "Module-federation-style runtime loading built on browser-native ES modules and import maps, independent of any one bundler.",
  "single-spa":
    "A framework-agnostic router that mounts and unmounts several front-end applications on one page based on the URL.",
  "web-components":
    "Browser standards (custom elements, shadow DOM and templates) for building reusable UI elements that work with any framework.",
  "independent-deployment":
    "Releasing each micro-frontend on its own schedule, without coordinating a release of the whole product.",
  "runtime-integration":
    "Assembling micro-frontends in the browser at runtime, instead of combining them into one bundle at build time.",
  "shared-dependencies":
    "Sharing libraries such as React between micro-frontends so they are downloaded once, while managing version mismatches.",
  "cross-mfe-communication":
    "How independent micro-frontends exchange data and events, through custom events, the URL or shared stores, without tight coupling.",
  "micro-frontend-routing":
    "Coordinating URLs between a host application and its micro-frontends, including nested and deep-linked routes.",
  "authentication-in-micro-frontends":
    "Sharing one sign-in session and its tokens securely across independently deployed front-ends.",
  "css-isolation":
    "Preventing styles from one micro-frontend leaking into another, with scoping, naming conventions or shadow DOM.",
  "error-isolation":
    "Containing failures so that one broken micro-frontend degrades only its own area instead of the whole page.",
  "composition-vs-inheritance":
    "Building behaviour by combining small components rather than extending class hierarchies, the approach React favours.",
  "compound-components":
    "A set of components that work together through shared implicit state, such as a Tabs component with its list and panels.",
  "controlled-vs-uncontrolled-components":
    "Whether a component's state is owned by its parent (controlled) or kept internally (uncontrolled), and when to choose each.",
  "container-and-presentational-components":
    "Separating components that fetch and manage data from components that only render what they are given.",
  "higher-order-components":
    "Functions that take a component and return an enhanced one, a reuse pattern now largely replaced by hooks.",
  "render-props": "Sharing behaviour by passing a function that tells a component what to render.",
  "custom-hooks":
    "Extracting reusable stateful logic into functions whose names start with “use”, shared across components.",
  "observer-pattern":
    "Objects subscribe to a subject and are notified when it changes, the basis of event emitters and state stores.",
  "strategy-pattern":
    "Choosing an algorithm at runtime by swapping interchangeable implementations behind one interface.",
  "factory-pattern":
    "Centralising object or component creation so callers ask for what they need without knowing how it is built.",
  "adapter-pattern":
    "Wrapping an incompatible interface so it matches the one your code expects, such as normalising third-party API responses.",
  "facade-pattern":
    "A simple interface in front of a complex subsystem, hiding the details the caller does not need.",
  "mediator-pattern":
    "A central object coordinates communication between components, so they never reference each other directly.",
  "state-pattern":
    "An object changes its behaviour when its internal state changes, usually modelled as explicit states and transitions.",
  "command-pattern":
    "Encapsulating an action as an object, which makes it possible to queue, log and undo it.",
  "headless-components":
    "Components that provide behaviour and accessibility without any styling, leaving the markup and look to you.",
  "local-state": "State owned by a single component, such as whether a dropdown is open.",
  "global-state":
    "State shared across distant parts of the application, such as the signed-in user or the theme.",
  "server-state":
    "Data that lives on the server and is cached on the client, with its own concerns: loading, staleness and refetching.",
  "url-state":
    "State stored in the URL path and query string, which makes views shareable, bookmarkable and safe to refresh.",
  "form-state":
    "The values, validation errors, touched fields and submission status of a form, often handled by a dedicated library.",
  "derived-state":
    "Values computed from existing state instead of stored separately, which avoids keeping copies in sync.",
  "unidirectional-data-flow":
    "Data flows down through props and changes flow up through events, which makes updates predictable.",
  "redux-architecture":
    "A single store that changes only when actions are dispatched to pure reducer functions, so every change is predictable and traceable.",
  "react-context":
    "React's built-in way to pass values down the tree without prop drilling. Every consumer re-renders when the value changes.",
  zustand:
    "A small, hook-based state library with selector subscriptions that needs no provider components.",
  "tanstack-query":
    "A server-state library that handles caching, request deduplication, background refetching and invalidation.",
  "state-machines":
    "Modelling behaviour as explicit states and allowed transitions, so impossible states cannot happen.",
  "optimistic-updates":
    "Updating the interface immediately as if a request succeeded, then rolling back if it fails.",
  "cache-invalidation":
    "Deciding when cached data is no longer valid and must be refreshed or removed, famously one of the hard problems in computing.",
  "state-synchronization":
    "Keeping state consistent between browser tabs, devices, the server and different parts of the interface.",
  "undo-and-redo":
    "Recording state changes or commands so people can step backwards and forwards through their edits.",
  "dom-and-cssom":
    "The browser's tree representations of the HTML document and its styles, combined to decide what to render.",
  "critical-rendering-path":
    "The steps from receiving HTML, CSS and JavaScript to the first pixels on screen, and what blocks them.",
  "javascript-event-loop":
    "How a single-threaded JavaScript runtime takes turns between the call stack, its task queues and rendering.",
  "microtasks-and-macrotasks":
    "Two kinds of queued work: promise callbacks run before the next task, while timers and events run as separate tasks.",
  "browser-rendering-pipeline":
    "The stages the browser runs to produce each frame: style, layout, paint and compositing.",
  "layout-paint-and-composite":
    "The three costliest rendering stages, and which CSS changes trigger each of them.",
  "virtual-dom":
    "An in-memory description of the interface that a framework compares between renders to compute minimal DOM updates.",
  "react-reconciliation":
    "How React compares the previous and next element trees to decide what to update, keep or replace.",
  "react-fiber":
    "React's internal architecture, which splits rendering into small units of work that can be paused and prioritised.",
  "concurrent-rendering":
    "React rendering that can be interrupted and prioritised, so urgent updates stay responsive during heavy work.",
  hydration:
    "Attaching event handlers and state to server-rendered HTML so it becomes interactive in the browser.",
  "server-side-rendering":
    "Rendering HTML on the server for each request, so users and crawlers get content before JavaScript runs.",
  "client-side-rendering":
    "Rendering the interface in the browser with JavaScript, starting from an almost empty HTML document.",
  "static-site-generation":
    "Rendering pages to HTML at build time and serving them as static files.",
  "incremental-static-regeneration":
    "Serving statically generated pages while regenerating them in the background after a set time or on demand.",
  "streaming-ssr":
    "Sending server-rendered HTML in chunks as each part becomes ready, so the browser can show content earlier.",
  "web-workers": "Running JavaScript on background threads to keep heavy work off the main thread.",
  "service-workers":
    "A background script between the page and the network that enables offline support, caching and push notifications.",
  webassembly:
    "A compact binary format that runs code compiled from languages such as Rust or C++ at near-native speed alongside JavaScript.",
  "core-web-vitals":
    "Google's user-centred performance metrics for loading (LCP), responsiveness (INP) and visual stability (CLS).",
  "largest-contentful-paint":
    "The time until the largest visible element, often a hero image or heading, is rendered. Good is 2.5 seconds or less.",
  "interaction-to-next-paint":
    "How quickly the page visibly responds to interactions throughout a visit. Good is 200 milliseconds or less.",
  "cumulative-layout-shift":
    "How much visible content moves unexpectedly while the page is in use. Good is 0.1 or less.",
  "code-splitting":
    "Breaking a JavaScript bundle into smaller chunks that load only when they are needed.",
  "lazy-loading":
    "Deferring the loading of code, images or components until they are actually needed.",
  "dynamic-imports":
    "Loading a JavaScript module on demand with import(), which bundlers turn into a separate chunk.",
  "tree-shaking":
    "Removing unused exports from a bundle by statically analysing ES module imports.",
  "bundle-optimization":
    "Reducing the size and number of JavaScript and CSS files through minification, compression, deduplication and analysis.",
  "image-optimization":
    "Serving images in the right format, size and quality for each device, and loading them at the right moment.",
  "content-delivery-networks":
    "Geographically distributed servers that deliver content from a location close to each user.",
  "browser-caching":
    "The browser storing responses locally, so repeat visits need fewer network requests or none at all.",
  "memory-management":
    "How JavaScript allocates and garbage-collects memory, and how to find and fix leaks in long-lived applications.",
  virtualization:
    "Rendering only the visible part of a long list or grid, so thousands of rows stay fast.",
  "debouncing-and-throttling":
    "Limiting how often a function runs: debouncing waits for a pause, throttling runs it at most once per interval.",
  prefetching:
    "Loading resources or data the user is likely to need next, before they ask for them.",
  "performance-budgets":
    "Agreed limits on metrics such as bundle size or LCP, checked in CI so performance does not quietly regress.",
  "real-user-monitoring":
    "Collecting performance data from real users' browsers, as opposed to measuring in a lab.",
  "rest-apis":
    "Resource-oriented HTTP APIs that use standard methods, status codes and URLs to read and change data.",
  graphql:
    "A query language and runtime that lets clients ask for exactly the data they need from a typed schema, usually through one endpoint.",
  "grpc-web":
    "A way for browsers to call gRPC services using Protocol Buffers over HTTP, usually through a proxy.",
  websockets:
    "A persistent, two-way connection between browser and server for real-time messaging.",
  "server-sent-events":
    "A one-way stream of events from server to browser over a long-lived HTTP connection.",
  "http-protocol":
    "The request-response protocol of the web: methods, headers and status codes, across HTTP/1.1, HTTP/2 and HTTP/3.",
  "api-gateway":
    "A single entry point in front of backend services that handles authentication, rate limiting, routing and other cross-cutting concerns.",
  "backend-for-frontend":
    "A dedicated backend for each kind of client, such as web or mobile, that shapes data exactly for that interface.",
  "api-versioning":
    "Evolving an API without breaking existing clients, using URL, header or schema-based versions.",
  "openapi-specification":
    "A standard, machine-readable format for describing HTTP APIs, used to generate documentation, clients and tests.",
  "request-cancellation":
    "Aborting requests that are no longer needed, for example with AbortController when the user navigates away.",
  "retry-and-exponential-backoff":
    "Retrying failed requests after increasing, randomised delays so a struggling service is not overwhelmed.",
  "rate-limiting":
    "Capping how many requests a client can make in a time window, to protect a service from overload and abuse.",
  pagination: "Returning large result sets one page at a time, using offsets or cursors.",
  "request-deduplication":
    "Collapsing identical in-flight requests into one, so the same data is not fetched twice.",
  idempotency:
    "Designing operations so that repeating them has the same effect as doing them once, which makes retries safe.",
  "circuit-breaker":
    "Stopping calls to a failing dependency for a while and failing fast instead, then testing whether it has recovered.",
  "authentication-and-authorization":
    "Authentication proves who someone is; authorization decides what they are allowed to do.",
  "oauth-2":
    "A framework for granting an application limited access to a user's resources without sharing their password.",
  "openid-connect":
    "An identity layer on top of OAuth 2.0 that adds sign-in and a standard ID token describing the user.",
  jwt: "A JSON Web Token: a compact, signed token carrying claims that a service can verify without a database lookup.",
  "access-tokens-and-refresh-tokens":
    "Short-lived access tokens authorise requests; longer-lived refresh tokens get new access tokens without signing in again.",
  "session-and-cookie-authentication":
    "The server keeps a session, and the browser sends a cookie that identifies it with every request.",
  "secure-httponly-and-samesite-cookies":
    "Cookie attributes that restrict a cookie to HTTPS, hide it from JavaScript and limit when it is sent cross-site.",
  "role-based-access-control":
    "Granting permissions to roles, such as admin or editor, and assigning roles to users.",
  "attribute-based-access-control":
    "Deciding access with policies over attributes of the user, the resource and the context, such as department or time of day.",
  "single-sign-on": "Signing in once with an identity provider to access many applications.",
  "multi-factor-authentication":
    "Requiring two or more independent proofs of identity, such as a password plus a passkey or one-time code.",
  "cross-site-scripting":
    "An attack that injects malicious script into a page other users view, usually through input that was not escaped.",
  "cross-site-request-forgery":
    "An attack that tricks a signed-in user's browser into sending an unwanted request to a site that trusts it.",
  "content-security-policy":
    "A response header that tells the browser which sources of scripts, styles and other content are allowed.",
  "cross-origin-resource-sharing":
    "How a server allows pages from other origins to read its responses, including preflight requests.",
  clickjacking:
    "Tricking users into clicking something hidden in an invisible frame, prevented with frame-ancestors or X-Frame-Options.",
  "secure-api-communication":
    "Protecting data between client and API with TLS, careful token handling, input validation and least privilege.",
  "software-supply-chain-security":
    "Guarding against compromised dependencies, build tools and pipelines with lockfiles, audits, signing and provenance.",
  "http-cache-control":
    "The response header that tells browsers and shared caches whether, where and for how long a response may be cached.",
  etag: "A version identifier for a response that lets clients revalidate cheaply and get 304 Not Modified when nothing changed.",
  "cdn-caching":
    "Caching responses at CDN edge locations, controlled by cache keys, time-to-live values and purging.",
  "reverse-proxy-caching":
    "A server in front of the application, such as NGINX or Varnish, that caches responses for all clients.",
  "application-cache":
    "Caching computed results or query data inside the application to avoid repeating expensive work.",
  "in-memory-caching":
    "Keeping frequently used data in process memory or in a memory store such as Redis for very fast access.",
  "service-worker-cache":
    "The Cache Storage API, used by a service worker to store responses for offline use and fast repeat loads.",
  "cache-first-strategy":
    "Serve from the cache when possible and go to the network only on a miss, which suits versioned static assets.",
  "network-first-strategy":
    "Try the network first and fall back to the cache when offline, which suits frequently changing content.",
  "stale-while-revalidate":
    "Serve the cached version immediately and refresh it in the background for next time.",
  "cache-expiration":
    "Limiting how long cached data is trusted, with time-to-live values and eviction policies such as least-recently-used.",
  "distributed-caching":
    "A cache shared by many application servers and spread across several nodes, such as a Redis cluster.",
  "fault-tolerance":
    "The ability of a system to keep operating correctly when some of its components fail.",
  "graceful-degradation":
    "Keeping core functionality available when features or dependencies fail, instead of failing completely.",
  "progressive-enhancement":
    "Starting from a baseline that works everywhere, then adding richer features for capable browsers.",
  "error-boundaries":
    "React components that catch rendering errors in their subtree and show a fallback instead of crashing the app.",
  "timeout-handling":
    "Giving every remote call a time limit, so a slow dependency cannot make the caller hang indefinitely.",
  "fallback-ui":
    "Placeholder or alternative interfaces shown while content loads or when it fails, such as skeletons and error states.",
  "offline-first-architecture":
    "Treating the local device as the primary data source and syncing with the server whenever a connection is available.",
  "network-resilience":
    "Handling slow, flaky and lost connections with retries, timeouts, offline queues and clear feedback to the user.",
  "health-checks":
    "Endpoints or probes that report whether a service is alive and ready, used by load balancers and orchestrators.",
  redundancy:
    "Running extra copies of components so the system survives the loss of any single one of them.",
  "availability-and-reliability":
    "Availability is how often a system can be used; reliability is how consistently it works correctly. Both are tracked with SLOs.",
  "disaster-recovery":
    "Plans and mechanisms for restoring service after a major failure, defined by recovery time and data-loss objectives.",
  observability:
    "Understanding a system's internal state from the data it emits: logs, metrics and traces.",
  logging: "Recording structured, timestamped events that explain what happened inside a system.",
  metrics:
    "Numeric measurements aggregated over time, such as request rate, error rate and latency.",
  "distributed-tracing":
    "Following one request across services with trace and span IDs to see where time is spent and where it failed.",
  "design-system-architecture":
    "How a design system is structured: tokens, primitives, components, documentation and the packages that ship them.",
  "component-libraries":
    "Reusable, tested interface components distributed as a package for product teams to build with.",
  "design-tokens":
    "Named design decisions, such as colours, spacing and type, stored in a format that both code and design tools can use.",
  theming:
    "Changing an interface's look, for example light and dark modes or several brands, by swapping token values rather than component code.",
  "css-architecture":
    "Strategies for organising CSS at scale so styles stay predictable: naming, layering and scoping.",
  "css-modules":
    "CSS files whose class names are scoped locally to the component that imports them.",
  "css-in-js":
    "Writing styles in JavaScript next to components, generated either at runtime or at build time.",
  "tailwind-css":
    "A utility-first CSS framework: styling with small, single-purpose classes generated from a design scale.",
  "css-variables":
    "Custom properties that store values in CSS, cascade like other properties and can change at runtime.",
  "shadow-dom":
    "An encapsulated DOM subtree whose markup and styles are isolated from the rest of the page.",
  accessibility:
    "Designing and building interfaces everyone can use, including people who rely on keyboards, screen readers or magnification.",
  wcag: "The Web Content Accessibility Guidelines: testable success criteria grouped into levels A, AA and AAA.",
  aria: "Attributes that describe roles, states and properties to assistive technologies when native HTML is not enough.",
  internationalization:
    "Preparing software so it can support many languages and regions without code changes.",
  localization:
    "Adapting a product for a specific locale: translations and date, number and currency formats.",
  "right-to-left":
    "Supporting languages such as Arabic and Hebrew, where reading direction and layout are mirrored.",
  "responsive-design":
    "Layouts that adapt to any screen size and input method, using fluid grids, media queries and container queries.",
  storybook:
    "A workshop for developing, documenting and testing interface components in isolation.",
  "visual-regression-testing":
    "Comparing screenshots against approved baselines to catch unintended visual changes.",
  "component-versioning":
    "Releasing component library changes with semantic versions so consumers know what is safe to upgrade.",
  "backward-compatibility":
    "Making changes without breaking existing consumers, through deprecation periods and additive APIs.",
  "design-system-governance":
    "How a design system is owned, how contributions are made and how decisions about it are taken.",
  "unit-testing": "Testing the smallest units of code, such as single functions, in isolation.",
  "integration-testing": "Testing how several units, modules or services work together.",
  "component-testing":
    "Testing a component's behaviour by rendering it and interacting with it the way a user would.",
  "end-to-end-testing": "Testing complete user journeys through the real application in a browser.",
  "contract-testing":
    "Checking that a consumer and a provider agree on an API contract without running both of them together.",
  "accessibility-testing":
    "Automated and manual checks that an interface works with assistive technologies, for example with axe.",
  "performance-testing":
    "Measuring speed and stability under load or on constrained devices, with tools such as load testers and Lighthouse.",
  "test-pyramid":
    "A testing strategy with many fast unit tests, fewer integration tests and only a few end-to-end tests.",
  "test-trophy":
    "A front-end testing strategy that puts most effort into integration tests, on top of static analysis and unit tests.",
  "test-driven-development":
    "Writing a failing test first, then the code that makes it pass, then refactoring: red, green, refactor.",
  "behavior-driven-development":
    "Describing behaviour as shared, business-readable scenarios (given, when, then) that become automated tests.",
  "mocking-and-stubbing":
    "Replacing real dependencies with controllable substitutes: stubs return canned data, mocks also verify how they were called.",
  "test-doubles":
    "The umbrella term for stand-ins used in tests: dummies, stubs, spies, mocks and fakes.",
  "mock-service-worker":
    "A library that intercepts network requests and returns mock responses, in the browser and in Node.",
  jest: "A JavaScript testing framework with a built-in runner, assertions, mocking and snapshot testing.",
  vitest:
    "A Vite-native test runner with a Jest-compatible API and fast, on-demand transformation.",
  "react-testing-library":
    "Utilities for testing React components through the DOM, the way users interact with them.",
  cypress:
    "An end-to-end and component testing tool that runs tests inside the browser, with time-travel debugging.",
  playwright:
    "A browser automation and end-to-end testing framework for Chromium, Firefox and WebKit.",
  "ci-testing-pipelines":
    "Running tests automatically on every change in continuous integration, often in parallel and split by type.",
  "test-coverage":
    "Measuring which lines and branches the tests execute: a useful signal, but not proof of quality.",
  "flaky-tests":
    "Tests that pass and fail without any code change, usually because of timing, shared state or external dependencies.",
  "test-isolation":
    "Making sure tests share no state, so each can run alone, in any order and in parallel.",
  "test-data-management":
    "Creating, seeding and cleaning up the data tests depend on, using factories and fixtures.",
  webpack:
    "A highly configurable module bundler built around loaders and plugins, for years the default for large applications.",
  vite: "A build tool that serves native ES modules in development for instant start-up, and bundles for production.",
  rollup: "An ES module bundler known for efficient tree shaking, widely used to build libraries.",
  esbuild: "An extremely fast JavaScript and TypeScript bundler and transformer written in Go.",
  turbopack:
    "An incremental bundler written in Rust and the default bundler in recent versions of Next.js.",
  "module-resolution":
    "How a bundler or runtime turns an import path into a file, through package exports, aliases and file extensions.",
  "environment-configuration":
    "Supplying different settings and secrets for each environment without changing code, for example with environment variables.",
  "ci-cd":
    "Continuous integration builds and tests every change; continuous delivery or deployment releases it automatically.",
  "github-actions":
    "GitHub's built-in CI/CD: workflows of jobs defined in YAML and triggered by repository events.",
  jenkins:
    "A long-established, self-hosted automation server for building CI/CD pipelines with plugins.",
  docker:
    "A platform for packaging applications with their dependencies into portable container images.",
  containerization:
    "Running applications in isolated containers that share the host's kernel, for consistent environments from laptop to production.",
  "static-hosting":
    "Serving pre-built HTML, CSS and JavaScript files from storage or a CDN, with no application server.",
  "cdn-and-edge-deployment":
    "Deploying assets and code to edge locations close to users for lower latency.",
  "blue-green-deployment":
    "Running two identical environments and switching all traffic from the old one to the new one at once, with instant rollback.",
  "canary-deployment":
    "Releasing a new version to a small share of traffic first, and widening it only while the metrics stay healthy.",
  "feature-flags":
    "Turning features on or off at runtime without deploying, which separates deploying code from releasing features.",
  "release-management":
    "Planning, scheduling and coordinating releases, including versioning, changelogs and communication.",
  "rollback-strategies":
    "Ways to undo a bad release quickly, such as redeploying the previous artifact, switching traffic or turning off a flag.",
  "source-maps":
    "Files that map minified production code back to the original source, for readable stack traces and debugging.",
  "artifact-management":
    "Storing versioned build outputs, such as packages and container images, in a registry for reproducible deployments.",
  monorepos:
    "Keeping many projects in one repository, with shared tooling and changes that span projects in a single commit.",
  nx: "A monorepo build system with a project graph, commands that run only on affected projects, and computation caching.",
  turborepo:
    "A high-performance build system for JavaScript monorepos, with task pipelines and remote caching.",
  "package-management":
    "Installing and versioning dependencies with npm, pnpm or Yarn, using lockfiles for reproducible installs.",
  "semantic-versioning":
    "Version numbers in the form major.minor.patch that signal breaking changes, new features and fixes.",
  "monolith-vs-microservices":
    "One deployable application versus many small, independently deployed services, and the trade-offs between them.",
  "service-oriented-architecture":
    "Building systems from reusable, coarse-grained services, often connected through an enterprise service bus.",
  "distributed-systems":
    "Systems whose parts run on networked computers and coordinate by passing messages, which brings latency and partial failure.",
  "synchronous-vs-asynchronous-communication":
    "Waiting for a reply (request-response) versus sending a message and carrying on (events and queues).",
  "event-driven-architecture":
    "Services communicate by publishing events and reacting to them, which decouples producers from consumers.",
  "message-queues":
    "Buffers that hold messages until a consumer processes them, smoothing load spikes and decoupling services.",
  "event-streaming":
    "Recording events in a durable, ordered log that many consumers can read and replay independently.",
  "apache-kafka":
    "A distributed event-streaming platform built on partitioned, replicated, append-only logs.",
  rabbitmq:
    "A message broker that routes messages through exchanges to queues, with flexible routing patterns.",
  "sql-vs-nosql":
    "Relational databases with schemas and joins versus document, key-value, column and graph stores, and when to use each.",
  "database-indexing":
    "Data structures, such as B-trees, that speed up lookups at the cost of extra storage and slower writes.",
  replication:
    "Keeping copies of data on several nodes for availability and read scaling, synchronously or asynchronously.",
  sharding:
    "Splitting data across nodes by a shard key, so that each node holds only part of the dataset.",
  "eventual-consistency":
    "Replicas may briefly disagree, but they converge on the same value once updates stop arriving.",
  "strong-consistency":
    "Every read sees the latest completed write, as if there were only a single copy of the data.",
  "cap-theorem":
    "During a network partition, a distributed system must choose between staying consistent and staying available.",
  "acid-properties":
    "Atomicity, consistency, isolation and durability: the guarantees of a database transaction.",
  cqrs: "Command Query Responsibility Segregation: using separate models for writing data and for reading it.",
  "event-sourcing":
    "Storing state as an append-only sequence of events and rebuilding the current state by replaying them.",
  "load-balancing":
    "Distributing incoming requests across several servers to share the load and route around failures.",
  "horizontal-scaling":
    "Adding more machines to handle more load, which usually requires stateless services.",
  "vertical-scaling":
    "Adding more CPU, memory or storage to a single machine: simple, but limited.",
  "architecture-reviews":
    "Structured evaluations of a proposed or existing architecture against quality goals and risks.",
  "technical-debt-management":
    "Making technical debt visible, deciding which of it to pay down and when, and preventing new debt from piling up.",
  "build-vs-buy-decisions":
    "Deciding whether to build a capability, buy it or adopt open source, weighing cost, fit, risk and ownership.",
  "architectural-trade-offs":
    "Making explicit what each option gains and loses, such as consistency versus availability or speed versus flexibility.",
  "scalability-planning":
    "Anticipating growth in users, data and teams, and designing for it before it becomes urgent.",
  "maintainability-planning":
    "Keeping a system easy to understand and change for years, through modularity, documentation, tests and clear ownership.",
  "technology-evaluation":
    "Assessing new technologies against clear criteria, with proofs of concept and an adoption plan.",
  "engineering-standards":
    "Shared conventions for code, tooling and practices that keep work consistent across teams.",
  "code-review-governance":
    "Policies for how code is reviewed: ownership, required approvals, turnaround times and what a good review covers.",
  "design-reviews":
    "Reviewing a technical design document with peers before implementation, to catch problems while they are cheap.",
  "cross-team-architecture":
    "Aligning architecture across teams through shared platforms, clear boundaries, contracts and decision forums.",
  "technical-roadmaps":
    "A time-based plan of technical investments that is aligned with product goals.",
  "architecture-risk-management":
    "Identifying, assessing and reducing technical risks before they turn into incidents.",
  "technical-documentation":
    "Writing the documentation engineers need, such as architecture overviews, runbooks and API references, and keeping it current.",
  "dependency-governance":
    "Policies for choosing, updating and auditing third-party dependencies across an organisation.",
  "migration-strategies":
    "Approaches for moving from an old system to a new one: big bang, phased, parallel run or incremental.",
  "strangler-fig-pattern":
    "Gradually replacing a legacy system by routing more and more functionality to a new one, until the old one can be removed.",
  "incremental-modernization":
    "Modernising a codebase in small, safe steps while continuing to ship features.",
  "developer-experience":
    "How easy and pleasant it is for engineers to build, test and ship, from tooling and docs to feedback loops.",
  "engineering-metrics":
    "Measuring delivery and quality, for example with DORA metrics, to guide improvement rather than to rank people.",
  "edge-computing":
    "Running code at network locations close to users instead of in one central region.",
  "edge-rendering":
    "Rendering HTML at edge locations, for lower latency and personalisation close to the user.",
  "react-server-components":
    "Components that render only on the server and send their output, not their code, to the browser.",
  "react-server-actions":
    "Async functions that run on the server and can be called directly from client components and forms.",
  "partial-hydration":
    "Hydrating only the interactive parts of a server-rendered page and leaving the rest as plain HTML.",
  resumability:
    "Continuing an application in the browser from state serialised on the server, without re-running its components first, as Qwik does.",
  "streaming-interfaces":
    "Interfaces that render data as it arrives in a stream, such as streamed server output or AI responses.",
  "islands-architecture":
    "Mostly static pages with isolated interactive “islands” that load and hydrate independently, as in Astro.",
  crdt: "Data structures that several replicas can edit at the same time and that always merge without conflicts.",
  webrtc: "Browser APIs for real-time, peer-to-peer audio, video and data connections.",
  webgpu: "A modern browser API for high-performance GPU graphics and general-purpose compute.",
  indexeddb:
    "A transactional, asynchronous browser database for storing large amounts of structured data.",
  "offline-synchronization":
    "Keeping data editable offline and reconciling local and server changes when the connection returns.",
  "progressive-web-applications":
    "Web apps that can be installed and work offline, using a web app manifest and a service worker.",
  "multi-tenant-architecture":
    "Serving many customers (tenants) from one system while keeping their data, configuration and limits isolated.",
  "feature-authorization":
    "Controlling which users, roles or plans can use which features, often combined with feature flags.",
  "ai-driven-ui":
    "Interfaces that use AI models to adapt their content, layout or behaviour to each user.",
  "generative-ui":
    "Interfaces whose components are generated or chosen by an AI model at runtime, in response to what the user wants.",
  "real-time-collaborative-applications":
    "Applications where several people edit the same content at the same time, such as shared documents and whiteboards.",
};

export function getConceptSummary(id: string): string | undefined {
  return conceptSummaries[id];
}

import type { LocaleText } from "../../types";
import { siSteps } from "./si-steps";

/** API Gateway module, Sinhala (technical terms in English). SERVER ONLY. */
export const si: LocaleText = {
  chapters: {
    request: "Request එක",
    gateway: "Gateway එක",
    backend: "Backend එක",
    "return-trip": "ආපහු ගමන",
  },

  scenarios: {
    unauthorized: {
      title: "401 Unauthorized",
      summary: "කල් ඉකුත් වූ token එකක් දොරටුවේදීම නවත්වලා, ඊට පස්සේ refresh කරනවා.",
    },
    "rate-limited": {
      title: "429 Too Many Requests",
      summary: "එකවර එන requests ගොඩකින් දීමනාව ඉවර වෙනවා; gateway එක client එකට හෙමින් යන්න කියනවා.",
    },
    timeout: {
      title: "Timeout, ඊට පස්සේ retry",
      summary: "හෙමින් service එකක් නිසා gateway එක අත්හරිනවා; client එක backoff එක්ක retry කරනවා.",
    },
    unavailable: {
      title: "503, වෙනත් පාරකින්",
      summary: "එක instance එකක් නතර වෙනවා, traffic හොඳ තත්වයේ තියෙන එකට මාරු වෙනවා.",
    },
  },

  steps: siSteps,

  messages: {
    request: "Browser එක යවන request එක",
    "expired-request": "එම request එකම, විනාඩි 4කට කලින් කල් ඉකුත් වූ token එකක් එක්ක",
    forwarded: "Gateway එක Orders වෙත යවන request එක",
    "users-call": "Orders එක Users service එකෙන් අහනවා (system එක ඇතුළේ)",
    "users-reply": "Users service එකේ උත්තරය",
    "sql-query": "Orders එක PostgreSQL එකට යවන query එක",
    "sql-rows": "PostgreSQL එක rows දෙකක් ආපහු දෙනවා",
    "service-response": "Orders service එක හදන response එක",
    "final-response": "Browser එකට ලැබෙන response එක",
    "401-response": "Gateway එකේ උත්තරය",
    "refresh-request": "App එක identity provider එකෙන් අලුත් access token එකක් ඉල්ලනවා",
    "refresh-response": "අලුත් access token එකක්",
    "429-response": "Gateway එකේ උත්තරය",
    "504-response": "Gateway එකේ උත්තරය",
    "503-response": "Gateway එකේ උත්තරය",
  },

  components: {
    browser: {
      name: "Browser",
      kind: "Client",
      beginner: {
        summary: "ඔබ පාවිච්චි කරන app එක. එය කඩෙන් තොරතුරු ඉල්ලලා ඔබට පෙන්නනවා.",
        analogy:
          "කඩේ කවුන්ටරය ළඟ ඉන්න පාරිභෝගිකයෙක් වගේ: ඔබට ඕන දේ ඉල්ලනවා, ඒක ඔබේ අතට දෙනවා. ඔබ කවදාවත් ගබඩා කාමරයට යන්නේ නැහැ.",
        jobs: [
          "කඩේ pages ඔබට පෙන්නනවා",
          "ඔබ click කරද්දී request එකක් යවනවා",
          "ඔබ sign in වුණාට පස්සේ ඔබේ අවසර පත්‍රය (token) තියාගන්නවා",
          "මොකක් හරි වැරදුණොත් හෙමින්, ආචාරශීලීව ආයෙත් උත්සාහ කරනවා",
        ],
      },
      advanced: {
        summary:
          "තමන්ගේම origin එකක තියෙන single-page app එකක්. එය bearer token එකක් එක්ක HTTPS හරහා API එකට call කරනවා.",
        howItWorks:
          "fetch එක ආයෙ ආයෙත් පාවිච්චි කරන HTTP/2 හෝ HTTP/3 connection එකක් හරහා HTTPS requests යවනවා. Credentials රැගෙන යන cross-origin calls වලට කලින් CORS preflight එකක් යනවා.",
        responsibilities: [
          "User interface එක render කිරීම",
          "Access සහ refresh tokens තියාගැනීම",
          "API එකට call කිරීම",
          "Errors හැසිරවීම: 401 ට refresh, 429, 503 සහ 504 ට back off",
        ],
        inputs: ["User ගේ ක්‍රියා", "API responses"],
        outputs: ["API requests"],
        technologies: ["React", "Vue", "Angular", "fetch", "TanStack Query"],
        examples: [
          "REST API එකකට call කරන React single-page app එකක්",
          "එම API එකම පාවිච්චි කරන mobile app එකක්",
        ],
        advantages: [
          "පොහොසත්, ඉක්මනින් ප්‍රතිචාර දක්වන interface එකක්",
          "එහෙම design කළොත් offline-first වැඩ කරනවා",
        ],
        limitations: [
          "විශ්වාස කරන්න බැරි device එකක run වෙනවා: එහි input කවදාවත් විශ්වාස කරන්න එපා",
          "කවදාවත් එහි secrets දාන්න එපා",
        ],
      },
      talksTo: ["API gateway", "Identity provider (sign-in සහ refresh විතරයි)"],
    },

    gateway: {
      name: "API Gateway",
      kind: "Edge component",
      beginner: {
        summary: "System එකේ ඉදිරි දොරටුව. හැම request එකක්ම මුලින්ම එන්නේ මේ හරහා.",
        analogy:
          "Hotel එකක reception එක වගේ: ඔබ කවුද කියලා බලනවා, ඇතුළට එන්න අවසර තියෙනවද කියලා තහවුරු කරනවා, ඔබව හරි කාමරයට යවනවා.",
        jobs: [
          "සීල් කරපු (encrypt කරපු) request එක අරිනවා",
          "ඔබේ අවසර පත්‍රය පරීක්ෂා කරනවා",
          "requests වැඩිපුර යවන අයව නවත්වනවා",
          "request එක හරියට ලියලා තියෙනවද කියලා බලනවා",
          "එය හරි service එකට යවනවා",
        ],
      },
      advanced: {
        summary:
          "Client traffic වලට ඇතුළු වෙන එකම තැන විදිහට වැඩ කරන reverse proxy එකක්. එය TLS terminate කරනවා, requests authenticate කරනවා, rate limits ක්‍රියාත්මක කරනවා, හැම request එකක්ම හරි upstream service එකට route කරනවා. ඒ නිසා cross-cutting concerns හැම service එකකම නෙවෙයි, එක තැනක තියෙනවා.",
        howItWorks:
          "හැම request එකක්ම පිළිවෙලින් stations පහක් පසු කරනවා: TLS (decrypt), authentication (token එක verify කිරීම), rate limit (දීමනාව පරීක්ෂාව), validation (හැඩය පරීක්ෂාව) සහ routing (healthy instance එකක් තේරීම). ආපහු යද්දී එය response එක compress කරලා, headers එකතු කරලා, logs සහ metrics සටහන් කරනවා.",
        responsibilities: [
          "TLS terminate කිරීම",
          "Requests authenticate කිරීම (JWT validation)",
          "Rate limits සහ quotas ක්‍රියාත්මක කිරීම",
          "Requests services වලට යන්න කලින් validate කිරීම",
          "Upstream services වලට route සහ load-balance කිරීම",
          "හැම request එකකටම logs, metrics සහ traces නිකුත් කිරීම",
        ],
        inputs: ["Clients ගෙන් එන HTTPS requests"],
        outputs: ["Upstream services වලට requests", "Clients ලට ආපහු responses"],
        technologies: [
          "Kong",
          "Envoy",
          "NGINX",
          "AWS API Gateway",
          "Azure API Management",
          "Apigee",
        ],
        examples: [
          "Netflix ගේ edge gateway එක (Zuul) devices වලින් එන requests backend services වලට route කරනවා",
          "Lambda functions වලට ඉස්සරහින් AWS API Gateway",
        ],
        advantages: [
          "Cross-cutting concerns වලට එකම තැනක්",
          "ඇතුළේ service topology එක clients ලගෙන් සඟවනවා",
          "සරල clients: එක host එකක්, එක auth scheme එකක්",
        ],
        limitations: [
          "Network hop එකක් සහ පොඩි latency එකක් එකතු කරනවා",
          "Redundant විය යුතුයි, නැත්නම් single point of failure එකක් වෙනවා",
          "කාලයත් එක්ක business logic ඇතුළට රිංගන්න පුළුවන්",
        ],
      },
      talksTo: ["Browser", "Identity provider (keys විතරයි)", "Orders service"],
    },

    identity: {
      name: "Identity provider",
      kind: "Security service",
      beginner: {
        summary: "ඔබ sign in වුණාම ඔබට අවසර පත්‍රයක් දෙන කාර්යාලය.",
        analogy:
          "කෞතුකාගාරයක ටිකට් කාර්යාලය වගේ: එය එක පාරක් ඔබ කවුද කියලා බලලා ටිකට් පතක් දෙනවා. ඊට පස්සේ මුරකරුවෝ බලන්නේ ටිකට් පත විතරයි.",
        jobs: [
          "ඔබ sign in වෙද්දී ඔබේ password එක පරීක්ෂා කරනවා",
          "අවසර පත්‍ර (tokens) දෙනවා",
          "පරණ එක කල් ඉකුත් වුණාම අලුත් අවසර පත්‍රයක් දෙනවා",
          "බොරු අවසර පත්‍ර අල්ලගන්න මුරකරුවන් පාවිච්චි කරන මුද්‍රාව (public key) බෙදාදෙනවා",
        ],
      },
      advanced: {
        summary:
          "Signed tokens නිකුත් කරලා, තමන්ගේ public keys (JWKS) ප්‍රසිද්ධ කරන OAuth 2.0 / OpenID Connect authorization server එකක්.",
        howItWorks:
          "Sign-in වුණාට පස්සේ එය කෙටි කාලයකට වලංගු JWT access token එකකුයි, වැඩි කාලයකට වලංගු refresh token එකකුයි නිකුත් කරනවා. එහි public keys තියෙන ඕනම කෙනෙකුට ඒ tokens offline verify කරන්න පුළුවන්, ඒ නිසා හැම request එකකදීම එයට call කරන්නේ නැහැ.",
        responsibilities: [
          "Users authenticate කිරීම (password, MFA, SSO)",
          "Access සහ refresh tokens නිකුත් කිරීම",
          "තමන්ගේ signing keys ප්‍රසිද්ධ කරලා rotate කිරීම",
        ],
        inputs: ["Sign-in සහ token requests"],
        outputs: ["Tokens", "Public keys (JWKS)"],
        technologies: ["Auth0", "Okta", "Microsoft Entra ID", "Keycloak", "AWS Cognito"],
        examples: [
          "Google හෝ Microsoft එක්ක sign in වීම (OpenID Connect)",
          "Internal app එකකට Keycloak tokens නිකුත් කිරීම",
        ],
        advantages: ["Identity වලට එකම තැනක්", "Tokens offline verify කරන්න පුළුවන්"],
        limitations: [
          "කෙටි කාලීන tokens වහාම revoke කරන්න බැහැ",
          "Sign-in වලට අත්‍යවශ්‍ය නිසා, එය highly available විය යුතුයි",
        ],
      },
      talksTo: ["Browser (sign-in, refresh)", "API gateway (වරින් වර එහි keys ගන්නවා)"],
    },

    "orders-1": {
      name: "Orders service",
      kind: "Backend service (පිටපත් 2න් #1)",
      beginner: {
        summary: "Orders ගැන හැම දෙයක්ම දන්න system එකේ කොටස.",
        analogy:
          "සමාගමක orders අංශය වගේ: හැමෝම මිලදී ගත්තේ මොනවද කියලා එය සටහන් කරලා තියාගන්නවා, කාට මොනවා බලන්න පුළුවන්ද කියන නීති අනුගමනය කරනවා.",
        jobs: [
          "Orders ගැන නීති අනුගමනය කරනවා",
          "Database එකේ orders කියවනවා, save කරනවා",
          "වැඩිපුර විස්තර අනිත් services වලින් අහනවා",
          "උත්තරය ලියනවා",
        ],
      },
      advanced: {
        summary:
          "Orders data සහ නීති අයිති, stateless instances කිහිපයක් විදිහට run වෙන domain service එකක්.",
        howItWorks:
          "Gateway එකෙන් දැනටමත් authenticate කරපු requests ලබාගන්නවා (caller ගේ identity එක header එකක). Connection pool එකක් හරහා PostgreSQL query කරනවා, තමන්ගේම timeout එකක් එක්ක Users service එකට call කරනවා.",
        responsibilities: [
          "Order නීති ක්‍රියාත්මක කිරීම (කාට මොනවා බලන්න පුළුවන්ද)",
          "Orders කියවීම සහ ලිවීම",
          "අනිත් services වල data එකතු කිරීම",
          "API responses ආපහු දීම",
        ],
        inputs: ["Gateway එකෙන් එන requests", "Users service එකෙන් සහ PostgreSQL එකෙන් එන data"],
        outputs: ["API responses", "Queries", "Internal requests"],
        technologies: ["Node.js", "Java / Spring", "Go", ".NET", "/healthz endpoint එකක්"],
        examples: ["Carts සහ orders අයිති e-commerce service එකක්"],
        advantages: ["ස්වාධීනව deploy සහ scale කරන්න පුළුවන්", "Orders වල අයිතිය පැහැදිලියි"],
        limitations: [
          "Services අතර calls නිසා latency වැඩි වෙනවා",
          "අලුත් failure modes: timeouts, අර්ධ outages",
        ],
      },
      talksTo: ["API gateway", "Users service", "PostgreSQL"],
    },

    "orders-2": {
      name: "Orders service",
      kind: "Backend service (පිටපත් 2න් #2)",
      beginner: {
        summary: "වැඩේ බෙදාගන්න ලෑස්තියෙන් ඉන්න Orders service එකේ දෙවෙනි පිටපත.",
        analogy:
          "Supermarket එකක දෙවෙනි checkout එක වගේ: එකම වැඩේ කරනවා, ඒ නිසා එකක් කාර්යබහුල නම් හෝ වහලා නම් අනිත් එකෙන් ඔබට සේවය ලැබෙනවා.",
        jobs: ["පිටපත #1 එක්ක වැඩේ බෙදාගන්නවා", "පිටපත #1 කැඩුණොත් වැඩේ භාරගන්නවා"],
      },
      advanced: {
        summary:
          "සමාන, stateless instance එකක්. Gateway එක දෙක අතරේ load-balance කරනවා, එකක් අසාර්ථක වුණොත් ඒක මඟහැරලා route කරනවා.",
        howItWorks:
          "Instance #1 එකේ තියෙන code එකම සහ database එකම. Instances requests අතර state තියාගන්නේ නැති නිසා, ඕනම එකකට ඕනම request එකකට උත්තර දෙන්න පුළුවන්.",
        responsibilities: ["Load එක බෙදාගැනීම", "අනිත් instance එක අසාර්ථක වුණාම වැඩේ භාරගැනීම"],
        inputs: ["Gateway එකෙන් එන requests"],
        outputs: ["API responses"],
        technologies: ["Container orchestration (Kubernetes, ECS)", "Autoscaling"],
        examples: ["එක route එකක් පිටිපස්සේ replicas දෙකේ ඉඳන් දුසිම් ගණනක් දක්වා"],
        advantages: ["Redundancy", "Horizontal scaling"],
        limitations: ["Instances stateless නම් විතරයි වැඩ කරන්නේ", "ප්‍රයෝජනවත් වෙන්න health checks ඕන"],
      },
      talksTo: ["API gateway", "Users service", "PostgreSQL"],
    },

    users: {
      name: "Users service",
      kind: "Backend service",
      beginner: {
        summary: "නම් සහ ලිපිනයන් වගේ පාරිභෝගික විස්තර තියාගන්න system එකේ කොටස.",
        analogy: "හැම ශිෂ්‍යයෙකුගේම ලිපිනය තියාගන්න පාසල් කාර්යාලය වගේ: ගුරුවරුන්ට ලිපිනයක් ඕන වුණාම එතනින් අහනවා.",
        jobs: ["පාරිභෝගික විස්තර තියාගන්නවා", "අනිත් services ඇහුවාම උත්තර දෙනවා"],
      },
      advanced: {
        summary: "User profiles අයිති, අනිත් services ඇතුළතින් call කරන domain service එක.",
        howItWorks:
          "Gateway එක හරහා කවදාවත් නොයන internal (east–west) calls හරහා අනිත් services වලට profile data දෙනවා.",
        responsibilities: ["User profiles ගබඩා කරලා ආපහු දීම", "User data සහ ඒවායේ නීති අයිති වීම"],
        inputs: ["Internal requests"],
        outputs: ["User profiles"],
        technologies: ["Node.js", "Java / Spring", "Go", ".NET"],
        examples: ["Checkout, emails සහ support tools පාවිච්චි කරන profile service එකක්"],
        advantages: ["Users ගැන එකම source of truth එකක්"],
        limitations: [
          "User data ඕන හැම service එකක්ම දැන් මේක මත රඳා පවතිනවා (caching ගැන, නැත්නම් ඕන fields ටික copy කරගැනීම ගැන හිතන්න)",
        ],
      },
      talksTo: ["Orders service (සහ අනිත් services)"],
    },

    postgres: {
      name: "PostgreSQL",
      kind: "Data store (Orders database එක)",
      beginner: {
        summary: "Database එක: orders ආරක්ෂිතව තියාගන්න තැන.",
        analogy:
          "හැම දෙයකටම index කාඩ් එකක් තියෙන පිළිවෙළට තියෙන file කබඩ් එකක් වගේ: ඕනම file එකක් තත්පර කිහිපයකින් හොයාගන්න පුළුවන්.",
        jobs: [
          "කරන්ට් ගියත් orders ආරක්ෂිතව තියාගන්නවා",
          "හරි orders ඉක්මනින් හොයාගන්නවා",
          "එකම වෙලාවේ වෙනස්කම් දෙකක් ආවත් data පැටලෙන්නේ නැති බව තහවුරු කරනවා",
        ],
      },
      advanced: {
        summary: "Transactions (ACID), indexes සහ SQL සපයන relational database එකක්.",
        howItWorks:
          "Rows ඉක්මනින් හොයාගන්න queries indexes පාවිච්චි කරනවා. හැම write එකක්ම acknowledge කරන්න කලින් log කරනවා (write-ahead log), ඒ නිසා crash වුණත් එය ආරක්ෂිතයි.",
        responsibilities: [
          "Orders durable ලෙස ගබඩා කිරීම",
          "Queries වලට ඉක්මනින් උත්තර දීම",
          "එකවර එන writes යටතේ data consistent ලෙස තියාගැනීම",
        ],
        inputs: ["SQL queries"],
        outputs: ["Rows"],
        technologies: [
          "PostgreSQL",
          "Amazon RDS / Aurora",
          "Azure Database",
          "Cloud SQL",
          "PgBouncer",
        ],
        examples: [
          "User සහ status අනුව index කරපු orders table එකක්",
          "Reporting queries වලට සේවය කරන read replica එකක්",
        ],
        advantages: ["Strong consistency", "නම්‍යශීලී queries"],
        limitations: [
          "එක primary එකකට වඩා writes scale කිරීම අමාරුයි (sharding)",
          "Connections වියදම් අධිකයි",
        ],
      },
      talksTo: ["Orders service විතරයි: හැම service එකකටම තමන්ගේම database එකක්"],
    },
  },

  // Short texts shown in the scene, next to a component's name.
  badges: {
    code: "{count}",
    left: "60න් {count}ක් ඉතුරුයි",
    waiting: "තත්පර {count}ක් ඉන්නවා",
    slow: "හෙමින්",
    timeout: "තත්පර {count}කින් timeout",
    retry: "තත්පර {count}කින් retry",
    down: "down",
  },
  glossary: {
    client: { term: "Client", definition: "Requests යවන program එක: මෙතනදී browser එක." },
    origin: {
      term: "Origin",
      definition:
        "Web ලිපිනයක scheme එක, host එක සහ port එක. Browser එක වෙනස් origins එකිනෙකින් වෙන් කරලා තියනවා.",
    },
    "cors-preflight": {
      term: "CORS preflight",
      definition:
        "වෙනත් origin එකකට call කරන්න අවසර තියෙනවද කියලා අහන්න browser එක මුලින්ම යවන පොඩි OPTIONS request එකක්.",
    },
    "http-method": {
      term: "HTTP method",
      definition: "Request එකෙන් ඉල්ලන ක්‍රියාව, උදාහරණ GET (මට දෙන්න) හෝ POST (මේක හදන්න).",
    },
    header: { term: "Header", definition: "Message එකක් එක්ක යවන නමක් තියෙන සටහනක්." },
    "bearer-token": {
      term: "Bearer token",
      definition:
        "ඔබ කවුද කියලා ඔප්පු කරන අවසර පත්‍රයක්. එය අතේ තියෙන ඕනම කෙනෙක්ව විශ්වාස කරන නිසා, ඒක ආරක්ෂිතව තියාගන්න.",
    },
    idempotent: {
      term: "Idempotent",
      definition: "Request එක දෙපාරක් යැව්වත්, එක පාරක් යැව්වා වගේම ප්‍රතිඵලය.",
    },
    dns: {
      term: "DNS",
      definition: "Internet එකේ contacts list එක: api.shop.example වගේ නම් ලිපිනයන් බවට හරවනවා.",
    },
    tls: {
      term: "TLS",
      definition:
        "Connection එකක් පෞද්ගලිකව තියාගෙන, අනිත් පැත්තේ ඉන්නේ කවුද කියලා ඔප්පු කරන රහස් කේතය (HTTPS වල “S” එක).",
    },
    rtt: {
      term: "Round trip (RTT)",
      definition: "Message එකක් අනිත් පැත්තට ගිහින් උත්තරයක් ආපහු එන්න යන කාලය.",
    },
    "reverse-proxy": {
      term: "Reverse proxy",
      definition: "අනිත් servers වෙනුවෙන් requests ලබාගෙන ඒවා ඉදිරියට යවන server එකක්.",
    },
    "tls-termination": {
      term: "TLS termination",
      definition: "Request එක කියවන්න පුළුවන් වෙන්න, ඉදිරි දොරටුවේදීම ආරක්ෂිත connection එක ඇරීම.",
    },
    "north-south": {
      term: "North–south traffic",
      definition: "පිටතින් system එකට එන requests සහ ඒවායේ උත්තර.",
    },
    jwt: {
      term: "JWT",
      definition:
        "JSON Web Token: user කෙනෙක් ගැන කරුණු තියෙන, sign කරපු අවසර පත්‍රයක්. Public key එක තියෙන ඕනම කෙනෙකුට එය පරීක්ෂා කරන්න පුළුවන්.",
    },
    jwks: {
      term: "JWKS",
      definition:
        "JSON Web Key Set: අනිත් අයට තමන්ගේ tokens පරීක්ෂා කරන්න පුළුවන් වෙන්න identity provider එකක් බෙදාදෙන public keys.",
    },
    claims: {
      term: "Claims",
      definition: "Token එකක් ඇතුළේ ලියලා තියෙන කරුණු: උදාහරණ, එය කාටද සහ කල් ඉකුත් වෙන්නේ කවදාද.",
    },
    "authn-authz": {
      term: "Authentication vs. authorization",
      definition: "“ඔබ කවුද?” (authentication) සහ “ඔබට මොනවා කරන්න පුළුවන්ද?” (authorization).",
    },
    "token-bucket": {
      term: "Token bucket",
      definition:
        "Requests සීමා කරන ක්‍රමයක්: tokens තියෙන bucket එකක් නිතිපතා පිරෙනවා, හැම request එකක්ම එකක් ගන්නවා.",
    },
    "429": {
      term: "429 Too Many Requests",
      definition: "තමන්ගේ දීමනාව ඉවර කරපු client කෙනෙකුට දෙන උත්තරය.",
    },
    "401": {
      term: "401 Unauthorized",
      definition: "අවසර පත්‍රය නැති, වැරදි හෝ කල් ඉකුත් වුණු විට දෙන උත්තරය.",
    },
    "retry-after": {
      term: "Retry-After",
      definition: "ආයෙත් උත්සාහ කරන්න කලින් කොච්චර වෙලා ඉන්න ඕනද කියලා client එකට කියන header එකක්.",
    },
    "route-table": {
      term: "Route table",
      definition: "කුමන ලිපිනයන් කුමන service එකට යනවද කියන gateway එකේ ලැයිස්තුව.",
    },
    "load-balancing": {
      term: "Load balancing",
      definition: "Service එකක පිටපත් කිහිපයක් අතර requests බෙදීම.",
    },
    "health-check": {
      term: "Health check",
      definition: "පිටපතකට requests ගන්න පුළුවන්ද කියලා gateway එකට කියන, නිතිපතා අහන “ඔයා හොඳින්ද?” ප්‍රශ්නය.",
    },
    "trace-context": {
      term: "Trace context",
      definition:
        "එක request එකක හැම පියවරක්ම services හරහා සම්බන්ධ කරන headers (traceparent), ඒ නිසා එය පසුපස යන්න පුළුවන්.",
    },
    "business-logic": {
      term: "Business logic",
      definition: "Product එකේම නීති: උදාහරණයක් විදිහට කාට කුමන orders බලන්න පුළුවන්ද කියන එක.",
    },
    "east-west": {
      term: "East–west traffic",
      definition: "System එක ඇතුළේ services අතර යන requests.",
    },
    "timeout-budget": {
      term: "Timeout budget",
      definition:
        "හැම call එකකටම ගන්න පුළුවන් කාලය. ඇතුළටම යන calls වලට අඩු කාලයක් ලැබෙන නිසා, callers පිළිවෙලට අත්හරිනවා.",
    },
    index: {
      term: "Index",
      definition: "මුළු table එකම කියවන්නේ නැතුව ගැළපෙන rows හොයාගන්න database එකේ කෙටි මඟක්.",
    },
    "connection-pool": {
      term: "Connection pool",
      definition: "අලුතින් open කරනවා වෙනුවට ආයෙ ආයෙත් පාවිච්චි කරන, open කරපු database connections ගොඩක්.",
    },
    "sql-injection": {
      term: "SQL injection",
      definition: "පරීක්ෂා නොකරපු input හරහා query එකකට SQL commands රිංගවන ප්‍රහාරයක්.",
    },
    "status-code": {
      term: "Status code",
      definition:
        "Request එකක ඉලක්කම් තුනේ ප්‍රතිඵලය: 2xx සාර්ථකයි, 4xx client ගේ වැරැද්ද, 5xx server එකේ ප්‍රශ්නයක්.",
    },
    json: {
      term: "JSON",
      definition: "ඕනම program එකකට කියවන්න පුළුවන්, තොරතුරු ලියන සරල text format එකක්.",
    },
    pagination: {
      term: "Pagination",
      definition: "දිගු ලැයිස්තුවක් pages වලට බෙදලා, ඊළඟ page එක ඉල්ලන්න ක්‍රමයක් එක්ක යැවීම.",
    },
    compression: {
      term: "Compression",
      definition: "Response එකක් ඉක්මනට යන්න හකුළන එක (gzip, Brotli).",
    },
    "access-log": {
      term: "Access log",
      definition: "එක request එකකට එක පේළියක්: කවුද මොකටද call කළේ, ප්‍රතිඵලය, සහ ගිය කාලය.",
    },
    observability: {
      term: "Observability",
      definition: "System එක මොනවද කරන්නේ කියලා team එකට බලන්න පුළුවන් කරන logs, metrics සහ traces.",
    },
    latency: { term: "Latency", definition: "Request එකකට මුල ඉඳන් අගට යන කාලය." },
    "tail-latency": {
      term: "Tail latency (p99)",
      definition: "හෙමින්ම යන requests වලින් 1%ක් විතරක් ඉක්මවන කාලය.",
    },
    "refresh-token": {
      term: "Refresh token",
      definition: "අලුත් access tokens ගන්න විතරක් පාවිච්චි කරන, වැඩි කාලයක් වලංගු අවසර පත්‍රයක්.",
    },
    backoff: {
      term: "Exponential backoff",
      definition:
        "අසාර්ථක වෙන හැම උත්සාහයකටම පස්සේ වැඩිපුර ඉන්න එක; clients ඔක්කොම එකපාර retry නොකරන්න පොඩි අහඹු බවක් (jitter) එකතු කරනවා.",
    },
  },
};

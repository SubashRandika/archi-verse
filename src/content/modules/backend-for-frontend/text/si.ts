import type { ComponentDoc, LocaleText } from "../../types";
import { siSteps } from "./si-steps";

/** The three general-purpose services share most of their description. */
const service = (
  name: string,
  owns: string,
  beginner: ComponentDoc["beginner"],
  example: string,
  extra: { optional?: boolean } = {},
): ComponentDoc => ({
  name,
  kind: "Backend service",
  beginner,
  advanced: {
    summary: `${owns} අයිති, හැම caller කෙනෙකුටම එකම REST API එකක් දෙන general-purpose service එකක්.`,
    howItWorks: extra.optional
      ? "තමන්ගේම data store එකෙන් උත්තර දෙනවා. එහි උත්තර “තිබුණොත් හොඳයි” වර්ගයේ: ඒවා නැතුවත් screen එක වැඩ කරනවා, ඒ නිසා callers ඒකට කෙටි timeout එකක් දෙනවා."
      : "තමන්ගේම data store එකෙන්, හැම caller කෙනෙකුටම එකම response හැඩයකින් උත්තර දෙනවා. Screens ගැන එය කිසිවක් දන්නේ නැහැ.",
    responsibilities: [
      `${owns} බලාගන්නවා`,
      "හැම caller කෙනෙකුටම API එක ස්ථාවරව තියාගන්නවා",
      "තමන්ගේ data වල business rules තියාගන්නවා",
    ],
    inputs: ["BFFs වලින් එන requests (ඒවාට කලින්, apps වලින්)"],
    outputs: ["General-purpose JSON උත්තර"],
    technologies: ["Spring Boot", "Go", "Node.js", "ASP.NET Core"],
    examples: [example],
    advantages: [
      "තමන්ගේ data වලට එක අයිතිකරුවෙක් සහ එක API එකක්",
      "හැම අලුත් screen එකකටම වෙනස් වෙන්නේ නැහැ",
    ],
    limitations: ["හැමෝටම එකම හැඩයක්: සමහරුන්ට වැඩියි, තවත් අයට මදියි"],
  },
  talksTo: ["Web BFF", "Mobile BFF"],
});

/** Backend for Frontend module, Sinhala (technical terms in English). SERVER ONLY. */
export const si: LocaleText = {
  chapters: {
    "one-api": "හැමෝටම එකම API එකක්",
    "per-front-end": "හැම front end එකකටම backend එකක්",
    "trade-offs": "Trade-offs",
  },

  scenarios: {
    "slow-service": {
      title: "එක service එකක් හෙමින්",
      summary: "Recommendations පරක්කුයි, ඒ නිසා Mobile BFF එක suggestions නැතුව වෙලාවට උත්තර දෙනවා.",
    },
    "web-change": {
      title: "Web එකට විතරක් වෙනසක්",
      summary: "Web team එක තමන්ගේම BFF එකට field එකක් එකතු කරනවා; mobile app එකට කිසි බලපෑමක් නැහැ.",
    },
  },

  steps: siSteps,

  messages: {
    "orders-request": "App එක Orders එකෙන් order එක ඉල්ලනවා",
    "orders-response": "හැම caller කෙනෙකුටම මුළු order එකම (KB 21)",
    "users-request": "App එක Users එකෙන් address එක ඉල්ලනවා",
    "users-response": "මුළු address record එකම (KB 3)",
    "recommendations-request": "App එක suggestions ඉල්ලනවා",
    "recommendations-response": "Images එක්ක suggestions දොළහක් (KB 14)",
    "delivery-request": "Web page එක delivery දිනය ඉල්ලලා ආයෙත් අහනවා",
    "delivery-response": "Delivery ඇස්තමේන්තුව",
    "web-screen-request": "Browser එක Web BFF එකෙන් screen එක ඉල්ලනවා",
    "mobile-screen-request": "App එක Mobile BFF එකෙන් screen එක ඉල්ලනවා",
    "bff-orders-request": "BFF එක Orders එකෙන් අහනවා",
    "bff-users-request": "BFF එක Users එකෙන් අහනවා",
    "bff-recommendations-request": "BFF එක suggestions තුනක් ඉල්ලනවා",
    "web-response": "Web screen එකේ උත්තරය (KB 38)",
    "mobile-response": "Mobile screen එකේ උත්තරය (KB 4)",
    "partial-response": "Suggestions නැති උත්තරය",
    "late-response": "Recommendations පරක්කු වෙලා උත්තර දෙනවා",
    "web-response-v2": "Web උත්තරය, දැන් delivery දවසත් එක්ක",
  },

  components: {
    web: {
      name: "Web browser",
      kind: "Client",
      beginner: {
        summary: "ලොකු screen එකක, වේගවත් Wi-Fi එකක තියෙන කඩේ web site එක.",
        analogy: "ලොකු මේසයක් තියෙන පවුලක් වගේ: හැමදේටම ඉඩ තියෙනවා.",
        jobs: ["මුළු Order details page එකම පෙන්නනවා", "Page එකට ඕනේ දේ ඉල්ලනවා"],
      },
      advanced: {
        summary: "මුළු Order details page එක render කරන කඩේ web front end එක.",
        howItWorks:
          "BFF එකක් නැත්නම් එය හැම service එකකම API එකට call කරලා page එක තනියම හදනවා. BFF එකක් තියෙනකොට එය (gateway එක හරහා) Web BFF එකට එක call එකක් කරනවා, තියාගන්නේ session cookie එකක් විතරයි.",
        responsibilities: [
          "Order details page එක render කරනවා",
          "හැම screen එකකටම තමන්ගේ BFF එකට call කරනවා",
          "Data නැති කොටස් හංගනවා",
        ],
        inputs: ["User ක්‍රියා", "Web BFF එකෙන් එන උත්තර"],
        outputs: ["Web BFF එකට requests"],
        technologies: ["React", "Next.js", "fetch"],
        examples: ["https://shop.example/orders/1042"],
        advantages: ["වේගවත් network, ලොකු screen", "ඕනෑම වෙලාවක update කරන්න පුළුවන්"],
        limitations: ["Page එකේ තියෙන ඕනෑම දෙයක්, tokens වගේ, රිංගපු script එකකට කියවන්න පුළුවන් (XSS)"],
      },
      talksTo: ["Web BFF (API gateway එක හරහා)"],
    },

    mobile: {
      name: "Mobile app",
      kind: "Client",
      beginner: {
        summary: "පොඩි screen එකක් සහ හෙමින් connection එකක් තියෙන, ඔබේ phone එකේ තියෙන කඩේ app එක.",
        analogy: "Walkie-talkie එකකින් ඈත ඉඳන් කතා කරන කෙනෙක් වගේ: හැම පණිවිඩයකටම වෙලාවක් යනවා.",
        jobs: ["කෙටි Order details screen එකක් පෙන්නනවා", "පුළුවන් තරම් අඩුවෙන් ඉල්ලනවා"],
      },
      advanced: {
        summary:
          "හෙමින්, latency වැඩි network එකක තියෙන native app එකක්; පරණ versions මාස ගණන් පාවිච්චි වෙනවා.",
        howItWorks:
          "හැම round trip එකකටම 300 ms විතර යනවා, ඒ නිසා screen එකකට එක call එකක් සහ පොඩි උත්තර ඕනේ. එය release වෙන්නේ app stores හරහා, ඒ නිසා එක රැයකින් වෙනස් කරන්න බැහැ.",
        responsibilities: [
          "Order details screen එක render කරනවා",
          "පුළුවන් තරම් අඩු calls ගණනක් කරනවා",
          "පරණ API contracts එක්කත් වැඩ කරනවා",
        ],
        inputs: ["User ක්‍රියා", "Mobile BFF එකෙන් එන උත්තර"],
        outputs: ["Mobile BFF එකට requests"],
        technologies: ["Swift", "Kotlin", "React Native", "Flutter"],
        examples: ["කඩේ iOS සහ Android apps"],
        advantages: ["හැමවිටම පාරිභෝගිකයා ළඟ"],
        limitations: [
          "හැම round trip එකක්ම මිල අධිකයි (කාලය සහ battery)",
          "එකපාරටම update කරන්න බැහැ (app-store releases)",
        ],
      },
      talksTo: ["Mobile BFF (API gateway එක හරහා)"],
    },

    "web-bff": {
      name: "Web BFF",
      kind: "Backend for Frontend",
      beginner: {
        summary: "Server එකේ ඉන්න web page එකේම උදව්කාරයා. Web page එකට ඕනේ දේ එයා දන්නවා.",
        analogy: "එක පවුලකට personal shopper කෙනෙක් වගේ: එක පාරක් අහන්න, ඔබට අසුරපු එක බෑග් එකක් ගන්න.",
        jobs: [
          "Web page එක වෙනුවෙන් services වලින් අහනවා",
          "ලොකු screen එකට එක උත්තරයක් අසුරනවා",
          "Web page එකේ යතුරු ආරක්ෂිතව තියාගන්නවා",
        ],
      },
      advanced: {
        summary:
          "Web experience එක වෙනුවෙන් server-side layer එකක්: service calls එකතු කරනවා, web page එකට response එක හැඩගස්වනවා, tokens browser එකෙන් එළියේ තියාගන්නවා.",
        howItWorks:
          "හැම screen request එකකටම data centre එකේ services වලට call කරනවා (පුළුවන් තැන parallel), ප්‍රතිඵල page එකට එකතු කරලා format කරනවා, එක පාරක් උත්තර දෙනවා. User ගේ OAuth tokens තියාගෙන browser එකට HttpOnly session cookie එකක් දෙනවා.",
        responsibilities: [
          "Service calls එකතු කරනවා",
          "Web page එකට responses හැඩගස්වනවා",
          "Call එකකට timeouts සහ අර්ධ උත්තර",
          "Tokens server-side තියාගන්නවා (token handler)",
        ],
        inputs: ["Browser එකෙන් screen requests", "Services වලින් උත්තර"],
        outputs: ["Screen එකකට එක උත්තරයක්", "Services වලට calls"],
        technologies: [
          "Node.js (Express, Fastify, NestJS)",
          "Next.js route handlers",
          "Spring Boot",
          "Go",
        ],
        examples: ["GET /web/order-details/1042"],
        advantages: [
          "Web page එකට හරියටම ඕනේ දේ ලැබෙනවා",
          "Web team එකට තනියම වෙනස් කරලා ship කරන්න පුළුවන්",
        ],
        limitations: [
          "Run කරන්න තවත් service එකක්",
          "වෙනත් BFFs වලින් copy කරපු logic ටිකෙන් ටික වෙනස් වෙන්න පුළුවන්",
        ],
      },
      talksTo: ["Web browser", "Orders service", "Users service", "Recommendations"],
    },

    "mobile-bff": {
      name: "Mobile BFF",
      kind: "Backend for Frontend",
      beginner: {
        summary: "Server එකේ ඉන්න phone එකේම උදව්කාරයා. පොඩි screen එකට ඕනේ දේ එයා දන්නවා.",
        analogy: "ලොකු පෙට්ටියක් වෙනුවට පොඩි lunch box එකක් අසුරන personal shopper කෙනෙක් වගේ.",
        jobs: [
          "Phone එක වෙනුවෙන් services වලින් අහනවා",
          "පොඩි උත්තරයක් අසුරනවා",
          "හෙමින් කඩයක් නිසා phone එක බලන් ඉන්න තියන්නේ නැහැ",
        ],
      },
      advanced: {
        summary:
          "Mobile app එක වෙනුවෙන් server-side layer එකක්: phone එකෙන් එන එක call එකක් data centre එක ඇතුළේ calls කිහිපයකට හරවලා, පොඩි, screen එකට හැඩගස්වපු payload එකකින් උත්තර දෙනවා.",
        howItWorks:
          "Orders එකට call කරලා, ඊට පස්සේ Users සහ Recommendations වලට parallel call කරනවා, හැම එකකටම time budget එක ඇතුළේ තමන්ගේම timeout එකක් එක්ක. Screen එකේ පෙන්නන fields විතරක් එක්ක උත්තර දෙනවා, අමතර data පරක්කු වුණොත් අර්ධ උත්තරයක් දෙනවා.",
        responsibilities: [
          "Service calls එකතු කරනවා",
          "App එකට පොඩි responses හැඩගස්වනවා",
          "Time budgets සහ අර්ධ උත්තර",
          "පරණ app versions වලටත් දිගටම සේවය කරනවා",
        ],
        inputs: ["App එකෙන් screen requests", "Services වලින් උත්තර"],
        outputs: ["Screen එකකට එක පොඩි උත්තරයක්", "Services වලට calls"],
        technologies: ["Node.js (Fastify, NestJS)", "Kotlin", "Go", "GraphQL server එකක්"],
        examples: ["GET /app/v3/order-screen/1042"],
        advantages: ["Screen එකකට එක mobile round trip එකයි", "පොඩි payloads: data අඩුයි, battery අඩුයි"],
        limitations: [
          "Run කරන්න තවත් service එකක්",
          "තවම පාවිච්චි වෙන හැම app version එකකටම සහාය දෙන්න ඕනේ",
        ],
      },
      talksTo: ["Mobile app", "Orders service", "Users service", "Recommendations"],
    },

    orders: service(
      "Orders service",
      "Orders සහ ඒවායේ items",
      {
        summary: "හැම order එකක්ම සහ ඒකේ තියෙන දේවල් දන්නවා.",
        analogy: "මස් කඩේ වගේ: ඔබට ඕනේ දේ තියෙනවා, ඒත් හැමෝටම දෙන්නේ එකම ලොකු පාර්සලය.",
        jobs: ["Orders තියාගන්නවා", "හැම order එකකම මොනවද තියෙන්නේ කියනවා"],
      },
      "GET /orders/1042",
    ),

    users: service(
      "Users service",
      "Users සහ ඔවුන්ගේ addresses",
      {
        summary: "ඔබ කවුද, කොහෙට deliver කරන්නද කියලා දන්නවා.",
        analogy: "බේකරිය වගේ: යන්න තියෙන තවත් එක කඩයක්.",
        jobs: ["Addresses තියාගන්නවා", "Order එකක් යන්නේ කොහෙටද කියනවා"],
      },
      "GET /users/u_7f3a/address",
    ),

    recommendations: service(
      "Recommendations",
      "Product suggestions",
      {
        summary: "ඔබ කැමති වෙන්න පුළුවන් වෙනත් දේවල් යෝජනා කරනවා.",
        analogy: "එළවළු කඩේ වගේ: තිබුණොත් හොඳයි, ඒත් ඒක නැතුවත් රෑ කෑම හරි.",
        jobs: ["ඔබ කැමති වෙන්න පුළුවන් products හොයනවා"],
      },
      "GET /recommendations?for=1042",
      { optional: true },
    ),
  },

  // Scene එකේ component එකක නම ළඟ පෙන්නන කෙටි පාඨ.
  badges: {
    "calls-1": "call 1 · {count} ms",
    "calls-2": "call 2 · {count} ms",
    "calls-3": "call 3 · {count} ms",
    received: "KB {count}ක් ලැබුණා",
    waste: "KB 38ක් ආවා · KB 4යි පාවිච්චි",
    "extra-call": "තවත් call එකක් ඕනේ",
    size: "KB {count}",
    "web-team": "web team",
    "mobile-team": "mobile team",
    copies: "එකම rule එක, copies 2ක්",
    slow: "හෙමින්",
    budget: "බලන් ඉන්නවා · {count} ms",
    partial: "අර්ධ",
    dropped: "පරක්කු උත්තරය අතහැරියා",
    deploying: "deploy වෙනවා",
    version: "v2.5",
    unchanged: "වෙනසක් නැහැ",
    arrives: "බ්‍රහස්පතින්දා එනවා",
    "as-before": "කලින් වගේම",
  },

  glossary: {
    aggregation: {
      term: "Aggregation",
      definition: "එක request එකක් වෙනත් services වලට calls කිහිපයකට හරවලා, ඒවායේ උත්තර එකකට එකතු කිරීම.",
    },
    "api-gateway": {
      term: "API gateway",
      definition:
        "හැම client කෙනෙකුටම ඇතුළු වෙන එකම පාර: TLS, authentication සහ rate limits බලාගෙන requests ඉස්සරහට route කරනවා (මෙතන BFFs වලට).",
    },
    bff: {
      term: "Backend for Frontend (BFF)",
      definition:
        "එක front end එකක් වෙනුවෙන් හදපු, ඒ front end එක හදන team එකටම අයිති පොඩි server-side layer එකක්.",
    },
    "chatty-api": {
      term: "Chatty API",
      definition: "එක වැඩක් කරන්න පොඩි calls ගොඩක් ඕනේ API එකක්: හෙමින් network එකක මිල අධිකයි.",
    },
    "client-side-composition": {
      term: "Client-side composition",
      definition: "App එක තනියම services කිහිපයකට call කරලා ඒවායේ උත්තරවලින් screen එක හදනවා.",
    },
    "code-duplication": {
      term: "Code duplication",
      definition: "එකම logic එක තැන් කිහිපයක ලියලා, ඒ copies ටිකෙන් ටික එකිනෙකට වෙනස් වෙන්න පුළුවන්.",
    },
    "conways-law": {
      term: "Conway’s law",
      definition:
        "Systems අන්තිමට හැඩගැහෙන්නේ ඒවා හදන teams වගේ. Front-end team එකකට BFF එකක් මේක හිතාමතාම පාවිච්චි කරනවා.",
    },
    "experience-api": {
      term: "Experience API",
      definition:
        "හැම caller කෙනෙකුටම නෙවෙයි, එක user experience එකකට (එක app එකකට හෝ screen එකකට) හදපු API එකක්.",
    },
    "fan-out": {
      term: "Fan-out",
      definition: "ඇතුළට එන එක request එකක් නිසා එකවර එළියට calls කිහිපයක් යාම.",
    },
    "general-purpose-api": {
      term: "General-purpose API",
      definition: "Service එකේම data වටේ හදපු, හැම caller කෙනෙකුටම එකම උත්තරය දෙන API එකක්.",
    },
    graphql: {
      term: "GraphQL",
      definition:
        "APIs වලට query language එකක්: client එක එක endpoint එකකින් තමන්ට ඕනේ fields විතරක් ඉල්ලනවා.",
    },
    "httponly-cookie": {
      term: "HttpOnly cookie",
      definition:
        "Browser එක requests එක්ක යවන, ඒත් page scripts වලට කියවන්න බැරි cookie එකක්; ඒ නිසා XSS එකකට ඒක හොරකම් කරන්න බැහැ.",
    },
    latency: {
      term: "Latency",
      definition: "පණිවිඩයක් ප්‍රමාණය කුමක් වුණත් එහාට ගිහින් ආපහු එන්න යන කාලය. Mobile networks වල වැඩියි.",
    },
    "over-fetching": {
      term: "Over-fetching",
      definition: "Screen එක පාවිච්චි කරනවාට වඩා data ලබාගෙන, ඉතුරු ටික විසි කිරීම.",
    },
    "parallel-calls": {
      term: "Parallel calls",
      definition: "එකකට පස්සේ එකක් නෙවෙයි, එකම වෙලාවේ කරන calls: මුළු කාලය තීරණය කරන්නේ හෙමින්ම එක.",
    },
    "partial-response": {
      term: "Partial response",
      definition: "පරක්කු වෙලා ආපු අමතර data නැතුව දෙන, නැති දේ මොකක්ද කියලා කියන උත්තරයක්.",
    },
    payload: {
      term: "Payload",
      definition: "Request එකක හෝ response එකක body එකේ තියෙන data, උදා: JSON එක.",
    },
    "response-shaping": {
      term: "Response shaping",
      definition: "උත්තරය එක screen එකකට ගැළපෙන්න fields තෝරලා, නම් වෙනස් කරලා, එකතු කරලා, format කිරීම.",
    },
    "round-trip": {
      term: "Round trip",
      definition: "එක request එකක් server එකට ගිහින් එහි උත්තරය ආපහු එන එක.",
    },
    "time-budget": {
      term: "Time budget",
      definition:
        "Request එකකට මුළුමනින්ම ගත කරන්න පුළුවන් උපරිම කාලය; එය කරන හැම call එකකටම ඒ ඇතුළේ timeout එකක් ලැබෙනවා.",
    },
    "token-handler": {
      term: "Token handler",
      definition:
        "Backend එකක් (මෙතන web BFF එක) OAuth tokens තියාගෙන browser එකට session cookie එකක් විතරක් දෙන pattern එකක්.",
    },
    "under-fetching": {
      term: "Under-fetching",
      definition: "Screen එකට ඕනේ field එකක් උත්තරයේ නැති නිසා තවත් call එකක් ඕනේ වීම.",
    },
  },
};

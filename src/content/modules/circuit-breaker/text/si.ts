import type { LocaleText } from "../../types";
import { siSteps } from "./si-steps";

/** Circuit Breaker module, Sinhala (technical terms in English). SERVER ONLY. */
export const si: LocaleText = {
  chapters: {
    "slow-service": "Service එකක් හෙමින් වුණාම",
    breaker: "Breaker එක",
    recovery: "සනීප වීම",
  },

  scenarios: {
    "no-breaker": {
      title: "Breaker එකක් නැතුව",
      summary: "ආරක්ෂකයෙක් නැහැ: හෙමින් service එක Orders එකත් එක්කම වට්ටනවා, retries තත්වය නරක් කරනවා.",
    },
    "trial-fails": {
      title: "Trial call එක fail වෙනවා",
      summary: "Payments තවමත් ලෙඩයි, ඒ නිසා breaker එක ආයෙ open වෙලා fallback එක තියාගන්නවා.",
    },
  },

  steps: siSteps,

  messages: {
    "orders-request": "Browser එක orders ඉල්ලනවා",
    "orders-response": "Orders, ඒවායේ payment status එක්ක",
    "payments-request": "Orders Payments එකෙන් අහනවා",
    "payments-response": "Payments උත්තර දෙනවා",
    timeout: "වෙලාවට උත්තරයක් නැහැ",
    rejected: "Open breaker එක call එක ආපහු හරවනවා",
    "fallback-response": "Orders fallback එකෙන් උත්තර දෙනවා",
    "profile-request": "Browser එක “My profile” ඉල්ලනවා",
    "unavailable-response": "Orders එකට නිදහස් workers නැහැ",
  },

  components: {
    browser: {
      name: "Browser",
      kind: "Client",
      beginner: {
        summary: "ඔබ පාවිච්චි කරන app එක. එය ඔබේ orders ඉල්ලලා ඔබට පෙන්නනවා.",
        analogy: "Restaurant එකක ඉන්න පාරිභෝගිකයෙක් වගේ: ඔබ ඉල්ලනවා, order කරපු දේ එනකම් ඉන්නවා.",
        jobs: ["ඔබේ orders පෙන්නනවා", "මොකක් හරි වැරදුනොත් ආයෙ අහනවා"],
      },
      advanced: {
        summary: "කඩේ single-page app එක, gateway එක හරහා API එකට call කරනවා.",
        howItWorks:
          "එය API gateway එකට HTTPS requests යවනවා, gateway එක ඒවා Orders service එකට route කරනවා. එය දකින්නේ Orders එකේ උත්තර විතරයි, කවදාවත් Payments නෙවෙයි.",
        responsibilities: [
          "Orders page එක render කරනවා",
          "අඩු කරපු data පැහැදිලිව පෙන්නනවා (“payment status unknown”)",
          "පරිස්සමෙන් retry කරනවා: backoff එක්ක, Retry-After අනුගමනය කරමින්",
        ],
        inputs: ["User ක්‍රියා", "API responses"],
        outputs: ["API requests"],
        technologies: ["React", "TanStack Query", "fetch"],
        examples: ["“My orders” page එක"],
        advantages: ["Error page එකක් වෙනුවට අර්ධ data පෙන්නන්න පුළුවන්"],
        limitations: ["Browsers ගොඩකින් එන දරුණු retries retry storm එකක් වෙන්න පුළුවන්"],
      },
      talksTo: ["Orders service (API gateway හරහා)"],
    },

    orders: {
      name: "Orders service",
      kind: "Backend service",
      beginner: {
        summary: "ඔබේ orders ලැයිස්තුව හදනවා. එක එක එකට ගෙවලාද කියලා පෙන්නන්න Payments එකෙන් අහනවා.",
        analogy:
          "Waiter කෙනෙක් වගේ: ඔබේ order එක අරගෙන කුස්සියෙන් අහලා උත්තරය ගෙනත් දෙනවා. Waiter කෙනෙකුට එකවර බලාගෙන ඉන්න පුළුවන් එක දොරක් ළඟ විතරයි.",
        jobs: [
          "ඔබේ orders ලැයිස්තුව හදනවා",
          "ඒවාට ගෙවලාද කියලා Payments එකෙන් අහනවා",
          "Payments හොඳ නැති වෙලාවටත් ලැයිස්තුව පෙන්නනවා",
        ],
      },
      advanced: {
        summary:
          "Caller එක: orders response එක හදලා, හැම order එකකම payment status එකට circuit breaker එකක් හරහා Payments වෙත call කරනවා.",
        howItWorks:
          "Worker threads 50ක pool එකක්; හැම request එකක්ම උත්තර දෙනකම් එකක් අල්ලගෙන ඉන්නවා. Payments වෙත යන calls 2 s timeout එකක් සහ fallback එකක් තියෙන breaker එකක් හරහා යනවා.",
        responsibilities: [
          "Orders response එක හදනවා",
          "Breaker එක හරහා Payments වෙත call කරනවා",
          "Breaker එක open වෙලා ඉන්නකොට fallback එකකින් උත්තර දෙනවා",
          "තමන්ගේ capacity එක ආරක්ෂා කරනවා (timeouts, bulkheads)",
        ],
        inputs: ["Orders ඉල්ලීම් (gateway එකෙන්)", "Payments එකේ උත්තර"],
        outputs: ["Orders responses", "Payments වෙත calls"],
        technologies: ["Spring Boot", "ASP.NET Core", "Node.js", "Go"],
        examples: ["GET /api/orders?status=open"],
        advantages: ["Breaker එක නිසා Payments down වෙලා ඉන්නකොටත් ප්‍රතිචාර දක්වනවා"],
        limitations: [
          "එහි threads හැම request එකක්ම බෙදාගන්නවා: breaker එකක් හෝ bulkhead එකක් නැතුව එක හෙමින් dependency එකකට ඒ ඔක්කොම අරගන්න පුළුවන්",
        ],
      },
      talksTo: ["Browser (gateway හරහා)", "Payments service (breaker එක හරහා)"],
    },

    breaker: {
      name: "Circuit breaker",
      kind: "Resilience",
      beginner: {
        summary:
          "Payments හොඳ නැති වෙලාවට Orders එකට Payments වෙත call කරන එක නවත්වලා, පස්සේ ආයෙ try කරන ආරක්ෂකයෙක්.",
        analogy:
          "ඔබේ ගෙදර fuse box එක වගේ: මොකක් හරි ආයෙ ආයෙත් වැරදුනාම අනිත් හැම දෙයක්ම ආරක්ෂා කරන්න ඒක off වෙනවා.",
        jobs: [
          "Fail වෙච්ච calls ගණන් කරනවා",
          "Failures වැඩි වුණාම calls නවත්වනවා",
          "ටික වෙලාවකට පස්සේ පරිස්සමෙන් එක පාරක් try කරනවා",
        ],
      },
      advanced: {
        summary:
          "එක dependency එකකට යන calls වටේ තියෙන state machine එකක්: නැවත නැවත එන failures එකපාරටම කරන rejections බවට පත් කරලා, පස්සේ සනීප වෙලාද කියලා probe කරනවා.",
        howItWorks:
          "Closed: calls යනවා, ප්‍රතිඵල window එකක ගණන් කරනවා. Failures හෝ slow calls threshold එක පැන්නාම ඒක open වෙනවා: wait duration එක පුරා calls එකපාරටම reject කරනවා. ඊට පස්සේ half-open වෙලා trial calls කීපයකට close වෙනවද ආයෙ open වෙනවද කියලා තීරණය කරන්න ඉඩ දෙනවා.",
        responsibilities: [
          "ප්‍රතිඵල ගණන් කරනවා (failures සහ slow calls)",
          "Threshold එක පැන්නාම trip වෙලා open වෙනවා",
          "Open වෙලා ඉන්නකොට ඉක්මනින් fail වෙනවා",
          "Half-open වෙලා ඉන්නකොට trial calls වලට ඉඩ දෙනවා",
          "State වෙනස්වීම් වාර්තා කරනවා (logs, metrics)",
        ],
        inputs: ["Calls සහ ඒවායේ ප්‍රතිඵල"],
        outputs: ["ඉදිරියට යවන calls, හෝ එකපාරටම reject කරන ඒවා"],
        technologies: ["resilience4j", "Polly", "opossum", "Envoy outlier detection", "Istio"],
        examples: [
          "Spring Boot app එකක පහළ service එකකට එක breaker එක බැගින්",
          ".NET වල HttpClient වටේ Polly policies",
        ],
        advantages: [
          "Caller එකේ capacity එක ආරක්ෂා කරනවා",
          "Fail වෙන service එකට සනීප වෙන්න ඉඩ දෙනවා",
          "තනියම සනීප වෙනවා",
        ],
        limitations: [
          "Tuning ඕන (window, thresholds, wait)",
          "එහි fallback එක තරමට විතරයි ප්‍රයෝජනවත්",
          "හැම caller instance එකකටම dependency එක ගැන තමන්ගේම දැක්මක් තියෙන්නේ",
        ],
      },
      talksTo: ["Orders service (එය ජීවත් වෙන්නේ එහි code එකේ)", "Payments service"],
    },

    payments: {
      name: "Payments service",
      kind: "Backend service",
      beginner: {
        summary: "එක එක order එකට ගෙවලාද කියලා දන්නවා.",
        analogy: "කුස්සිය වගේ: උත්තරය එහි තියෙනවා, ඒත් ඒක දෙන්න බැරි තරම් busy වෙන්න පුළුවන්.",
        jobs: ["ගෙවපු orders මොනවද කියලා කියනවා", "ඒක තමන්ගේ database එකේ බලනවා"],
      },
      advanced: {
        summary: "Dependency එක: payment state එක අයිති, payment-status queries වලට උත්තර දෙනවා.",
        howItWorks:
          "GET /payments?orderIds=… වලට තමන්ගේ database එකෙන් උත්තර දෙනවා, සාමාන්‍යයෙන් 40 ms විතරකින්.",
        responsibilities: ["Payment-status queries වලට උත්තර දෙනවා", "Payment records තියාගන්නවා"],
        inputs: ["Payment-status queries"],
        outputs: ["Payment statuses"],
        technologies: ["Spring Boot", "Go", "Node.js"],
        examples: ["GET /payments?orderIds=1042,1043"],
        advantages: ["Payment data වලට එක අයිතිකාරයෙක්"],
        limitations: ["එහි database එක තරමට විතරයි වේගවත්: ඒක හෙමින් වුණාම Payments ත් හෙමින් වෙනවා"],
      },
      talksTo: ["Orders service", "Payments DB"],
    },

    "payments-db": {
      name: "Payments DB",
      kind: "Data store",
      beginner: {
        summary: "හැම payment එකක්ම ලියලා තියෙන Payments එකේ පොත.",
        analogy: "ලොකු පොතක් වගේ: වෙන කෙනෙක් ඒක කියවනවා නම් ඔබට ඉන්න වෙනවා.",
        jobs: ["හැම payment එකක්ම තියාගන්නවා", "Payments එකේ ප්‍රශ්න වලට උත්තර දෙනවා"],
      },
      advanced: {
        summary:
          "Payments database එක. මේ කතාවේ, උදාහරණයක් විදිහට දිගු report එකක් නිසා, එය overload වෙලා.",
        howItWorks:
          "Relational database එකක්. වැඩි load එකක් යටතේ එහි queries පෝලිම් ගැසෙනවා, Payments එකේ calls milliseconds ඉඳන් seconds දක්වා හෙමින් වෙනවා.",
        responsibilities: ["Payments ගබඩා කරනවා", "Queries වලට උත්තර දෙනවා"],
        inputs: ["Payments එකෙන් එන queries"],
        outputs: ["Rows"],
        technologies: ["PostgreSQL", "MySQL"],
        examples: ["Busy table එකක් lock කරන reporting query එකක්"],
        advantages: ["ස්ථාවර, කල් පවතින payment records"],
        limitations: ["Overload වෙච්ච එක database එකක් ඒක මත රඳා පවතින හැම දෙයක්ම හෙමින් කරනවා"],
      },
      talksTo: ["Payments service"],
    },
  },

  // Short texts shown in the scene, next to a component's name.
  badges: {
    closed: "closed · failures 5න් {count}",
    open: "open · තත්. {count}",
    "half-open": "half-open",
    "trial-failed": "half-open · fail වුණා",
    threads: "threads 50න් {count}ක් busy",
    slow: "හෙමින්",
    recovering: "සනීප වෙනවා",
    waiting: "බලාගෙන",
    off: "breaker නැහැ",
    code: "{count}",
    retries: "retries {count}",
  },

  glossary: {
    bulkhead: {
      term: "Bulkhead",
      definition:
        "Dependency එකකට වෙනම threads හෝ connections pool එකක්, එක හෙමින් dependency එකකට service එකක මුළු capacity එකම පාවිච්චි කරන්න බැරි වෙන්න.",
    },
    "cascading-failure": {
      term: "Cascading failure",
      definition:
        "එක service එකක failure එකක් ඒකට call කරන services වලටත් පැතිරෙන එක, මොකද ඒවා ඒක එනකම් බලාගෙන හිරවෙනවා.",
    },
    "circuit-breaker": {
      term: "Circuit breaker",
      definition:
        "Dependency එකකට යන calls වටේ ඉන්න ආරක්ෂකයෙක්, failures වැඩි වුණාම call කරන එක නවත්වලා පස්සේ පරිස්සමෙන් ආයෙ try කරනවා.",
    },
    "closed-state": {
      term: "Closed state",
      definition: "Breaker එකේ සාමාන්‍ය තත්වය: calls යනවා, ඒවායේ ප්‍රතිඵල ගණන් කරනවා.",
    },
    dependency: {
      term: "Dependency",
      definition: "තවත් service එකකට තමන්ගේ වැඩේ කරන්න call කරන්න ඕන වෙන service එකක්.",
    },
    "fail-fast": {
      term: "Fail fast",
      definition: "Call එකක් fail වෙනවා කියලා දන්නකොට timeout එකක් එනකම් ඉන්නේ නැතුව එකපාරටම අත්හරින එක.",
    },
    "failure-threshold": {
      term: "Failure threshold",
      definition:
        "Breaker එක trip කරලා open කරන failures ගණන (හෝ calls වල කොටස), උදා. අන්තිම calls 20න් 50%.",
    },
    fallback: {
      term: "Fallback",
      definition:
        "Call එක කරන්න බැරි වුණාම ඒ වෙනුවට දෙන උත්තරය: cache කරපු data, default එකක්, හෝ පොඩි feature එකක්.",
    },
    "graceful-degradation": {
      term: "Graceful degradation",
      definition:
        "System එකේ කොටසක් down වෙලා ඉන්නකොට, අඩු විස්තර එක්ක ප්‍රධාන features වැඩ කරන්න තියාගන්න එක.",
    },
    "half-open-state": {
      term: "Half-open state",
      definition:
        "Wait එකට පස්සේ dependency එක සනීප වෙලාද බලන්න breaker එක trial calls කීපයකට ඉඩ දෙනවා.",
    },
    "littles-law": {
      term: "Little’s law",
      definition:
        "එකවර යන calls = එන වේගය × call එකකට යන කාලය. Calls හෙමින් වුණාම එකවර යන ඒවා වැඩි වෙනවා.",
    },
    "open-state": {
      term: "Open state",
      definition: "Wait එක ඉවර වෙනකම් breaker එක calls try නොකර එකපාරටම reject කරනවා.",
    },
    probe: {
      term: "Probe",
      definition: "Service එකක් සනීප වෙලාද කියලා බලන පරිස්සම් test call එකක්.",
    },
    "retry-storm": {
      term: "Retry storm",
      definition: "Clients ගොඩක් එකවර retry කරන එක, දැනටමත් fail වෙන service එකක load එක ගුණ කරනවා.",
    },
    "retry-with-backoff": {
      term: "Retry with backoff",
      definition:
        "හැම පාරම වැඩි වෙලාවක් ඉඳලා ආයෙ try කරන එක (1 s, 2 s, 4 s…), පොඩි අහඹු බවක් (jitter) එක්ක.",
    },
    "service-mesh": {
      term: "Service mesh",
      definition:
        "හැම service එකක් ළඟම තියෙන proxies layer එකක් (උදා. Istio වල Envoy), retries, timeouts සහ breaking code එකෙන් පිටත බලාගන්නවා.",
    },
    "service-unavailable": {
      term: "503 Service Unavailable",
      definition:
        "“මට දැන් මේක කරන්න බැහැ, පස්සේ try කරන්න” කියන status code එක, ගොඩක් වෙලාවට Retry-After එක්ක.",
    },
    "sliding-window": {
      term: "Sliding window",
      definition: "Breaker එක බලන අලුත්ම calls ටික (උදා. අන්තිම 20, හෝ අන්තිම තත්පර 60).",
    },
    "slow-call": {
      term: "Slow call",
      definition:
        "සීමාවට වඩා වැඩි කාලයක් ගත්ත call එකක්. Breakers වලට slow calls failures වගේ ගණන් කරන්න පුළුවන්.",
    },
    "synchronous-call": {
      term: "Synchronous call",
      definition: "Caller එක ඉදිරියට යන්න කලින් උත්තරය එනකම් බලාගෙන ඉන්න call එකක්.",
    },
    "thread-pool": {
      term: "Thread pool",
      definition:
        "Service එකක් requests බලාගන්න පාවිච්චි කරන නියම workers ගණන. ඔක්කොම busy නම් අලුත් requests බලාගෙන ඉන්නවා හෝ fail වෙනවා.",
    },
    timeout: {
      term: "Timeout",
      definition: "Caller එකක් අත්හරින්න කලින් උත්තරයක් එනකම් ඉන්න දිගම කාලය.",
    },
    "trial-call": {
      term: "Trial call",
      definition: "Dependency එක test කරන්න half-open breaker එකක් යන්න දෙන calls කීපයෙන් එකක්.",
    },
    trip: {
      term: "Trip",
      definition: "Breaker එක closed ඉඳන් open වෙන මොහොත.",
    },
    "wait-duration": {
      term: "Wait duration",
      definition: "Breaker එක ආයෙ try කරන්න කලින් open වෙලා ඉන්න කාලය (මෙතන තත්පර 30).",
    },
  },
};

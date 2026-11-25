import type { ComponentDoc, LocaleText } from "../../types";
import { siSteps } from "./si-steps";

/** The three shoppers share most of their description. */
const shopper = (name: string, device: "laptop" | "phone", order: number): ComponentDoc => ({
  name,
  kind: "Client",
  beginner: {
    summary: `තමන්ගේ ${device} එකෙන් order ${order} ට ගෙවන කෙනෙක්.`,
    analogy: "කඩේකට call කරන කෙනෙක් වගේ: line එක busy නම්, ආයෙත් call කරන්නේ කවදද කියලා එයා තීරණය කරනවා.",
    jobs: ["ගෙවීම යවනවා", "මොහොතකට අසාර්ථක වුණොත් ආයෙත් try කරනවා", "නවතින්න ඕනේ කවදද කියලා දන්නවා"],
  },
  advanced: {
    summary:
      "Retry policy එක අයිති client එකක්: retry කරන්නේ මොන errors ද, jitter එක්ක backoff, max attempts, deadline එකක්, ගෙවීමකට එක idempotency key එකක්.",
    howItWorks:
      "Retryable error එකක් (timeout, 429, 502, 503, 504) ආවොත් random(0, min(cap, base · 2^attempt)) කාලයක්, නැත්නම් Retry-After කියන තරම් ඉඳලා ආයෙත් try කරනවා, 10 s deadline එකක් ඇතුළේ attempts 4 දක්වා. එක ගෙවීමක හැම attempt එකකම යන්නේ එකම Idempotency-Key එක.",
    responsibilities: [
      "Retry කරන්න වටින්නේ මොන errors ද කියලා තීරණය කරනවා",
      "Jitter එක්ක back off කරනවා",
      "Attempt සීමාවට හෝ deadline එකට නවතිනවා",
      "හැම attempt එකකම එකම idempotency key එක යවනවා",
    ],
    inputs: ["Shopper Pay ඔබන එක", "Payments එකෙන් එන උත්තර සහ errors"],
    outputs: ["Payments ට ගෙවීම් requests (සහ retries)", "අත්හරිනකොට පැහැදිලි පණිවිඩයක්"],
    technologies:
      device === "laptop"
        ? ["පොඩි retry helper එකක් එක්ක fetch", "TanStack Query (retry, retryDelay)", "ky"]
        : ["OkHttp interceptors (Android)", "URLSession (iOS)", "React Native වල TanStack Query"],
    examples: [`POST /payments  {"orderId":${order}}`],
    advantages: ["කෙටි blips shopper ට පේන්නේ නැති කරනවා"],
    limitations: [
      "හැම retry එකකින්ම load එකයි ප්‍රමාදයයි වැඩි වෙනවා",
      "Idempotency key එකක් නැතුව ගෙවීම් වලට ආරක්ෂිත නැහැ",
    ],
  },
  talksTo: ["Payments"],
});

/** Retry and Exponential Backoff module, Sinhala (technical terms in English). SERVER ONLY. */
export const si: LocaleText = {
  chapters: {
    blips: "මොහොතකට දේවල් අසාර්ථක වෙනවා",
    "not-worse": "තත්ත්වය නරක් නොකර retry කිරීම",
    "safe-to-repeat": "ආයෙත් කරන එක ආරක්ෂිතද?",
  },

  scenarios: {
    "server-says-when": {
      title: "Server එක කියනවා කවදද කියලා",
      summary: "Payments Retry-After: 5 එක්ක 503 කියනවා, apps හරියටම ඒ තරම් ඉන්නවා.",
    },
    "retries-multiply": {
      title: "Retries ගුණ වෙනවා",
      summary: "Payments සහ app එක දෙකම retry කරනවා, ඒ නිසා එක tap එකක් database queries 16ක් වෙනවා.",
    },
  },

  steps: siSteps,

  messages: {
    "pay-a": "Shopper A order 1042 ට ගෙවනවා",
    "pay-b": "Shopper B order 1043 ට ගෙවනවා",
    "pay-c": "Shopper C order 1044 ට ගෙවනවා",
    "charge-a": "Payments order 1042 ගේ charge එක record කරනවා",
    "charge-b": "Payments order 1043 ගේ charge එක record කරනවා",
    "charge-c": "Payments order 1044 ගේ charge එක record කරනවා",
    "charged-a": "Charge එක save වුණා",
    "charged-b": "Charge එක save වුණා",
    "charged-c": "Charge එක save වුණා",
    "created-a": "ගෙවීම සාර්ථකයි",
    "created-b": "ගෙවීම සාර්ථකයි",
    "created-c": "ගෙවීම සාර්ථකයි",
    unavailable: "503: දැන් බැහැ, ටිකකින් ආයෙත් try කරන්න",
    "retry-after": "“තත්පර 5කින් එන්න” කියන 503",
    "gave-up": "Shopper A attempts හතරකට පස්සේ නවතිනවා",
    "lost-response": "“ගෙවීම සාර්ථකයි”, ආපහු එන පාරේ නැති වුණා",
    "charge-again": "එකම ගෙවීම, ආයෙත් අය කරනවා",
    "charged-again": "දෙවෙනි charge එකක් save වුණා",
    "created-again": "“ගෙවීම සාර්ථකයි”, ආයෙත්",
    "keyed-request": "Idempotency key එකක් එක්ක ගෙවීම",
    "keyed-retry": "එකම key එක එක්ක retry එක",
    "store-key": "Charge එකයි එහි key එකයි එකට save කරනවා",
    "key-stored": "Charge එකයි key එකයි save වුණා",
    "key-lookup": "Payments key එක හොයනවා",
    "key-found": "Key එක හම්බුණා: මෙන්න පළවෙනි result එක",
    replayed: "පළවෙනි result එකම ආයෙත්, අලුත් charge එකක් නැහැ",
    "db-timeout": "Database එක වෙලාවට උත්තර දෙන්නේ නැහැ",
  },

  components: {
    "shopper-a": shopper("Shopper A", "laptop", 1042),
    "shopper-b": shopper("Shopper B", "phone", 1043),
    "shopper-c": shopper("Shopper C", "phone", 1044),

    payments: {
      name: "Payments",
      kind: "Backend service",
      beginner: {
        summary: "Server එකේ සල්ලි ගන්න උදව්කාරයා.",
        analogy: "කඩේ cash register එක වගේ: සමහර වෙලාවට restart වෙනවා, ඔබට මොහොතක් ඉන්න වෙනවා.",
        jobs: [
          "Card එකෙන් අය කරනවා",
          "කාර්යබහුල නම් “දැන් බැහැ” කියනවා",
          "එකම ticket එකට කවදාවත් දෙපාරක් අය කරන්නේ නැහැ",
        ],
      },
      advanced: {
        summary:
          "Cards වලින් අය කරලා ගෙවීම් record කරන service එකක්. Deploy එකකදී කෙටි වෙලාවකට 503 දෙනවා; idempotency keys ඒවායේ results එක්ක save කරනවා.",
        howItWorks:
          "හැම ගෙවීමක්ම එක transaction එකක: charge එකයි එහි idempotency key එකයි එකට save වෙනවා. Key එක දැනටමත් තියෙන request එකකට save කරපු result එක ලැබෙනවා (Idempotent-Replayed: true). Serve කරන්න බැරි නම් ඉක්මනින් 503 කියනවා, කොච්චර වෙලාවක්ද දන්නවා නම් Retry-After එකත් එක්ක.",
        responsibilities: [
          "Idempotency key එකකට එක පාරයි අය කරන්නේ",
          "පැහැදිලි, retryable errors දෙනවා (දන්නවා නම් Retry-After එක්ක)",
          "හැම layer එකකම තමන්ගේ dependencies retry කරනවා වෙනුවට වහාම fail වෙනවා",
        ],
        inputs: ["Shoppers ගේ apps වලින් එන ගෙවීම් requests"],
        outputs: ["201 Created, නැත්නම් 503", "Payments DB එකේ charges සහ keys"],
        technologies: ["පිටිපස්සේ Stripe හෝ Adyen", "Spring Boot", "Go", "Node.js"],
        examples: ["POST /payments", "Idempotency-Key: 7f3a9c2e-…"],
        advantages: ["Idempotency keys නිසා retry කරන්න ආරක්ෂිතයි"],
        limitations: ["Retries වලට අමතර capacity ඕනේ", "Keys save කරන්න (සහ expire කරන්න) ඕනේ"],
      },
      talksTo: ["Shopper A", "Shopper B", "Shopper C", "Payments DB"],
    },

    "payments-db": {
      name: "Payments DB",
      kind: "Database",
      beginner: {
        summary: "හැම ගෙවීමක්ම ලියලා තියන notebook එක.",
        analogy: "කඩේ receipt පොත වගේ: හැම ticket අංකයක්ම තියෙන්නේ එක පාරයි.",
        jobs: ["හැම charge එකක්ම තියාගන්නවා", "හැම ticket අංකයක්ම සහ එහි result එක මතක තියාගන්නවා"],
      },
      advanced: {
        summary:
          "Charges සහ idempotency table එකක් තියාගන්නවා: key, request fingerprint, save කරපු response, expiry.",
        howItWorks:
          "Key එකේ unique constraint එකක් නිසා එක key එකක් තියෙන requests දෙකකට charge දෙකක් insert කරන්න බැහැ. Expire වුණු keys පැය 24කට විතර පස්සේ delete වෙනවා.",
        responsibilities: [
          "Charges save කරනවා",
          "Idempotency keys ඒවායේ responses එක්ක save කරනවා",
          "Key එකකට එක row එකයි කියන එක බලාගන්නවා",
        ],
        inputs: ["Payments එකෙන් එන inserts සහ lookups"],
        outputs: ["Save වුණු rows", "නැවත එන keys වලට save කරපු responses"],
        technologies: ["PostgreSQL", "MySQL", "DynamoDB (conditional writes)"],
        examples: ["SELECT response FROM idempotency_keys WHERE key = '7f3a…'"],
        advantages: ["“මේක අය කළාද?” කියන එකට තියෙන එකම සත්‍ය මූලාශ්‍රය"],
        limitations: ["Overload වෙලා ඉන්නකොට retry කරපු queries එය උඩ ගොඩ ගැහෙනවා"],
      },
      talksTo: ["Payments"],
    },
  },

  // Scene එකේ component එකක නම ළඟ පෙන්නන කෙටි පාඨ.
  badges: {
    restarting: "restart වෙනවා",
    ready: "ලෑස්තියි",
    failed: "{count} · අසාර්ථකයි",
    "retry-2": "attempt 2 · 1 s ඉන්න",
    "retry-3": "attempt 3 · 2 s ඉන්න",
    "retry-4": "attempt 4 · 4 s ඉන්න",
    "paid-on": "attempt {count} · ගෙව්වා",
    paid: "ගෙව්වා",
    "no-wait": "attempt {count} · ඉන්නේ නැහැ",
    load: "{count} req/s · capacity 10",
    together: "retries 3ම එකපාර",
    "wait-ms": "{count} ms ඉන්න",
    "one-at-a-time": "එකින් එක",
    "deploy-failed": "deploy එක අසාර්ථකයි",
    "gave-up": "tries 4කින් පස්සේ නැවැත්තුවා",
    "timed-out": "උත්තරයක් නැහැ · timeout",
    "charged-once": "එක පාරයි අය කළේ",
    "charged-twice": "දෙපාරක් අය කළා",
    replayed: "එකම key · පළවෙනි උත්තරය",
    "server-wait": "5 s ඉන්න · server කිව්වා",
    overloaded: "overload වෙලා",
    queries: "queries {count} · tap 1",
    "fails-fast": "වහාම fail වෙනවා",
  },

  glossary: {
    "at-least-once": {
      term: "At-least-once",
      definition:
        "Retries වලින් ලැබෙන දේ: request එක process වෙනවා කියන එක ස්ථිරයි, ඒත් එක පාරකට වඩා වෙන්න පුළුවන්.",
    },
    "base-delay": {
      term: "Base delay",
      definition: "Backoff schedule එකක පළවෙනි wait එක; පස්සේ එන waits ඒකේ ගුණාකාර.",
    },
    cap: {
      term: "Cap",
      definition: "Backoff wait එකකට වැඩි වෙන්න පුළුවන් උපරිම කාලය, උදා. 30 s.",
    },
    "circuit-breaker": {
      term: "Circuit breaker",
      definition:
        "අසාර්ථක වෙන service එකකට ටික වෙලාවකට call කරන එක නවත්වන ආරක්ෂකයෙක්, ඒ නිසා calls ගොඩ ගැහෙනවා වෙනුවට වහාම fail වෙනවා.",
    },
    deadline: {
      term: "Deadline",
      definition:
        "Retries එක්කම operation එකක් ඉවර වෙන්න ඕනේ අන්තිම වෙලාව. හැම attempt එකකම timeout එක ඉතුරු කාලය ඇතුළේ තියෙන්න ඕනේ.",
    },
    "exactly-once-effect": {
      term: "Exactly-once effect",
      definition: "Request එක එක පාරකට වඩා ලැබෙන්න පුළුවන්, ඒත් එහි බලපෑම (charge එක) වෙන්නේ එක පාරයි.",
    },
    "exponential-backoff": {
      term: "Exponential backoff",
      definition: "හැම failure එකකටම පස්සේ වැඩියෙන් ඉන්න එක, හැම පාරම දෙගුණයක්: 1 s, 2 s, 4 s, …",
    },
    "fail-fast": {
      term: "Fail fast",
      definition:
        "බලන් ඉන්නවා හෝ retry කරනවා වෙනුවට වහාම error එකක් දෙන එක, ඒ නිසා caller ට තීරණය කරන්න පුළුවන්.",
    },
    "full-jitter": {
      term: "Full jitter",
      definition: "බිංදුවත් backoff එකත් අතර random කාලයක් ඉන්න එක: random(0, min(cap, base · 2^n)).",
    },
    idempotent: {
      term: "Idempotent",
      definition: "දෙපාරක් කළාම එක පාරක් කළා වගේම බලපෑමයි.",
    },
    "idempotency-key": {
      term: "Idempotency key",
      definition:
        "Client එක operation එකක් එක්ක (සහ එහි හැම retry එකක් එක්කම) යවන unique id එකක්, ඒ නිසා server එක ඒක කරන්නේ එක පාරයි.",
    },
    "idempotent-methods": {
      term: "Idempotent methods",
      definition:
        "Idempotent කියලා define කරපු HTTP methods: GET, HEAD, PUT, DELETE (POST හෝ PATCH නෙවෙයි).",
    },
    jitter: {
      term: "Jitter",
      definition: "Retry waits වලට එකතු කරන randomness, ඒ නිසා එකට අසාර්ථක වුණු clients විසිරෙනවා.",
    },
    "load-amplification": {
      term: "Load amplification",
      definition: "එක user ක්‍රියාවක් requests ගොඩකට හැරෙන එක, උදා. retries නිසා.",
    },
    "max-attempts": {
      term: "Max attempts",
      definition: "Operation එකක් try කරන උපරිම වාර ගණන, පළවෙනි try එකත් එක්කම.",
    },
    "metastable-failure": {
      term: "Metastable failure",
      definition: "හේතුව නැති වුණාට පස්සෙත්, තමන්ගේම retries නිසා overload වෙලාම ඉන්න system එකක්.",
    },
    "permanent-failure": {
      term: "Permanent failure",
      definition: "හැම පාරම වෙන error එකක් (වැරදි request එකක්, නැති item එකක්): ඒක retry කරන්න එපා.",
    },
    retry: {
      term: "Retry",
      definition: "අසාර්ථක වුණු request එකම ආයෙත් යැවීම.",
    },
    "retry-after": {
      term: "Retry-After",
      definition:
        "Client ට කොච්චර ඉන්න ඕනෙද කියන HTTP header එකක් (503 හෝ 429 එක්ක එනවා): තත්පර හෝ date එකක්.",
    },
    "retry-budget": {
      term: "Retry budget",
      definition: "මුළු requests වලින් retries වලට දෙන සීමාව, උදා. උපරිම 10%.",
    },
    "retry-storm": {
      term: "Retry storm",
      definition:
        "Clients ගොඩක් එකපාර retry කරලා, දැනටමත් අමාරුවෙන් ඉන්න service එකක load එක ගුණ කරන එක.",
    },
    "retryable-error": {
      term: "Retryable error",
      definition: "ඊළඟ පාර නොවෙන්න පුළුවන් error එකක්: timeout, 429, 502, 503 හෝ 504.",
    },
    "status-503": {
      term: "503 Service Unavailable",
      definition: "Server එකට දැන් request එක handle කරන්න බැහැ, සාමාන්‍යයෙන් කෙටි කාලයකට.",
    },
    "thundering-herd": {
      term: "Thundering herd",
      definition: "Clients ගොඩක් එකම මොහොතේ අවදි වෙලා service එකකට එකපාර එන එක.",
    },
    "transient-failure": {
      term: "Transient failure",
      definition: "තනියම නැති වෙන failure එකක්, සාමාන්‍යයෙන් තත්පර කිහිපයකින්.",
    },
  },
};

import type { LocaleText } from "../../types";
import { siSteps } from "./si-steps";

/** Idempotency module, Sinhala (technical terms in English). SERVER ONLY. */
export const si: LocaleText = {
  chapters: {
    "safe-to-repeat": "ආයෙත් කළාට කමක් නැද්ද?",
    keys: "Idempotency keys",
    "hard-cases": "අමාරු අවස්ථා",
  },
  scenarios: {
    "crash-halfway": {
      title: "අතරමගදී crash එකක්",
      summary:
        "Payments card එකෙන් සල්ලි ගන්නවා, ඊට පස්සේ උත්තරය save කරන්න කලින් crash වෙනවා. Retry එක දෙවෙනි charge එකක් නැතුව වැඩේ ඉවර කරනවා.",
    },
    "key-expired": {
      title: "Key එක expire වෙලා",
      summary:
        "Key එක මැකිලා ගියාට පස්සේ, පැය 25කට පස්සේ retry එකක් එනවා, ආයෙත් charge කරනවා; ඊට පස්සේ ඒක නවත්වන order check එක.",
    },
  },
  steps: siSteps,
  messages: {
    "put-address": "Shopper A delivery address එක දානවා",
    "update-address": "Payments order එකේ address එක update කරනවා",
    "address-updated": "Address එක කලින් තිබ්බ එකමයි",
    "address-ok": "Address එක save වුණා",
    "pay-no-key": "Shopper A order 1042 ට ගෙවනවා (key එකක් නැතුව)",
    "charge-card": "සල්ලි ගන්න කියලා Payments Card processor ගෙන් ඉල්ලනවා",
    "card-charged": "Card එකෙන් සල්ලි ගත්තා",
    "insert-payment": "Payments ගෙවීම record කරනවා",
    "payment-saved": "ගෙවීම save වුණා",
    created: "ගෙවීම සාර්ථකයි",
    "created-again": "ගෙවීම සාර්ථකයි (දෙවෙනි ගෙවීමක්)",
    "lost-response": "උත්තරය ආපහු එන අතරමගදී නැති වෙනවා",
    "keyed-request": "Shopper A idempotency key එකක් එක්ක ගෙවනවා",
    "keyed-retry": "Shopper A එකම key එක එක්ක retry කරනවා",
    "insert-key": "Payments මුලින්ම key එක ලියාගන්නවා: in progress",
    "key-inserted": "Key එක in progress විදිහට save වුණා",
    "save-done": "Payments ගෙවීමයි key එකේ උත්තරයයි එකට save කරනවා",
    "saved-done": "ගෙවීමයි උත්තරයයි එක transaction එකකින් save වුණා",
    "key-lookup": "Payments key එක හොයනවා",
    "key-found-done": "හම්බුණා: done, save කරපු උත්තරයත් එක්ක",
    replayed: "Save කරපු උත්තරය, ආයෙත් යවනවා",
    "key-conflict": "Key එක දැනටමත් අරගෙන",
    conflict: "409: තවම වැඩ කරනවා, ටිකකින් ආයෙත් try කරන්න",
    "changed-request": "Shopper A පරණ key එකෙන් අලුත් මුදලක් ගෙවනවා",
    "fingerprint-differs": "Request එක key එකේ fingerprint එකට ගැලපෙන්නේ නැහැ",
    unprocessable: "422: මේ key එක වෙන request එකකට පාවිච්චි කරලා",
    "charge-with-key": "Payments තමන්ගේම key එකක් එක්ක Card processor ගෙන් ඉල්ලනවා",
    "key-found-stale": "හම්බුණා: in progress, ඒත් තත්පර 70කට කලින් අත්හැරලා",
    "card-replayed": "Card processor කලින් කරපු charge එක ආයෙත් යවනවා",
    "key-missing": "හම්බුණේ නැහැ: key එක expire වෙලා",
    "charge-card-new": "Payments ආයෙත් card එකෙන් සල්ලි ගන්නවා (අලුත් key එකක්)",
    "card-charged-again": "Card එකෙන් දෙවෙනි පාරටත් සල්ලි ගත්තා",
    "insert-payment-again": "Payments දෙවෙනි ගෙවීමක් record කරනවා",
    "payment-saved-again": "Order 1042 ට දෙවෙනි ගෙවීමක්",
    "created-late": "ගෙවීම සාර්ථකයි (දෙවෙනි ගෙවීමක්)",
    "check-order": "Order එකට දැනටමත් ගෙවලාද කියලා Payments බලනවා",
    "order-paid": "Order 1042 ට දැනටමත් ගෙවලා",
    "already-paid": "409: order එකට දැනටමත් ගෙවලා",
  },
  components: {
    "shopper-a": {
      name: "Shopper A",
      kind: "Client",
      beginner: {
        summary: "තමන්ගේ laptop එකෙන් order 1042 ට ගෙවන කෙනෙක්.",
        analogy:
          "Cloakroom එකක ඉන්න කෙනෙක් වගේ: ticket එක තියාගෙන, අහන හැම පාරම එකම ticket එක පෙන්නනවා.",
        jobs: [
          "හැම ගෙවීමකටම ticket number එකක් (key එකක්) හදනවා",
          "ආයෙත් අහන හැම පාරම එකම key එක යවනවා",
          "අලුත් ගෙවීමකට අලුත් key එකක් හදනවා",
        ],
      },
      advanced: {
        summary:
          "Idempotency key එක අයිති client එක: operation එකකට එකයි, retries සහ reloads හරහා තියාගන්නවා, operation එක වෙනස් වුණොත් මාරු කරනවා.",
        howItWorks:
          "Shopper Pay ඔබනකොට crypto.randomUUID() එකෙන් key එකක් හදලා sessionStorage එකේ තියාගන්නවා, හැම attempt එකකම Idempotency-Key header එකේ යවනවා. 409 ආවොත් backoff එක්ක retry කරනවා; සාර්ථක වුණාම key එක අමතක කරනවා.",
        responsibilities: [
          "Attempt එකකට නෙවෙයි, operation එකකට එක key එකක්",
          "Retries සහ page reloads හරහා key එක තියාගන්නවා",
          "මුදල හෝ cart එක වෙනස් වුණොත් අලුත් key එකක්",
          "409 backoff එක්ක retry කරනවා; 422 කවදාවත් retry කරන්නේ නැහැ",
        ],
        inputs: ["Shopper Pay ඔබන එක", "Payments එකෙන් එන උත්තර (201, 409, 422)"],
        outputs: ["Idempotency-Key header එකක් එක්ක POST /payments"],
        technologies: [
          "crypto.randomUUID()",
          "sessionStorage",
          "TanStack Query mutations",
          "Form libraries වල submit state",
        ],
        examples: ["Idempotency-Key: 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47"],
        advantages: ["මොකක් වැරදුණත් හැම retry එකක්ම ආරක්ෂිතයි"],
        limitations: [
          "වෙන ගෙවීමකට key එකක් ආයෙත් පාවිච්චි කිරීම server එක අල්ලගන්න ඕනේ bug එකක්",
          "Key එක expire වුණාට පස්සේ එන retries ආරක්ෂා වෙන්නේ නැහැ",
        ],
      },
      talksTo: ["Payments"],
    },
    payments: {
      name: "Payments",
      kind: "Backend service",
      beginner: {
        summary: "සල්ලි ගන්න, ticket numbers ලියන notebook එකක් තියාගන්න උදව්කාරයා.",
        analogy:
          "ඔබේ coat එක ගේන්න යන්න කලින් ticket number එක hanger එකේ ලියන cloakroom attendant කෙනෙක් වගේ.",
        jobs: [
          "මොනවා හරි කරන්න කලින් key එක ලියාගන්නවා",
          "සල්ලි ගන්නේ එක පාරයි",
          "ආයෙත් අහන ඕනෙම කෙනෙක්ට save කරපු උත්තරය දෙනවා",
        ],
      },
      advanced: {
        summary:
          "Attempts ගොඩක් එක effect එකක් කරන service එක: මුලින්ම key එක record කරනවා, වැඩේ එක පාරයි කරන්නේ, save කරපු උත්තරය replay කරනවා.",
        howItWorks:
          "Key එක in progress විදිහට insert කරනවා (key එක unique), තමන්ගේම key එකක් එක්ක Card processor හරහා card එක charge කරනවා, ඊට පස්සේ ගෙවීමයි response එකයි key එකත් එක්ක එක transaction එකකින් save කරනවා. Repeat එකකට save කරපු response එක; in progress key එකකට 409; වෙන request එකක් එක්ක key එකකට 422.",
        responsibilities: [
          "වැඩේට කලින් key එක record කරනවා",
          "Request fingerprints සසඳනවා",
          "Save කරපු responses replay කරනවා",
          "In progress keys වලට 409, ආයෙත් පාවිච්චි කරපු keys වලට 422",
          "Card processor ට තමන්ගේම key එකක් යවනවා",
        ],
        inputs: ["Idempotency-Key එක්ක POST /payments"],
        outputs: [
          "201 (හෝ replay කරපු 201)",
          "409 Conflict",
          "422 Unprocessable Content",
          "Card processor ට charges",
        ],
        technologies: [
          "Stripe-style idempotency middleware",
          "Postgres unique constraints සහ row locks",
          "විකල්ප key store එකක් විදිහට Redis (SET NX)",
        ],
        examples: ["Replay කරපු උත්තරයක Idempotent-Replayed: true"],
        advantages: ["Retries, double clicks, redeliveries ඔක්කොම charge වෙන්නේ එක පාරයි"],
        limitations: [
          "හැම request එකකටම storage එකකුයි lookup එකකුයි ඕනේ",
          "තමන්ගේ database එකෙන් එළියේ side effects වලට තමන්ගේම keys ඕනේ",
        ],
      },
      talksTo: ["Shopper A", "Payments DB", "Card processor"],
    },
    "payments-db": {
      name: "Payments DB",
      kind: "Database",
      beginner: {
        summary: "ගෙවීමුයි ticket numbers උයි ලියලා තියෙන notebook එක.",
        analogy: "Attendant ගේ පොත වගේ: ticket number එක, මොන coat එකද, ආපහු දුන්නද කියලා.",
        jobs: ["හැම key එකක්ම, ඒකේ උත්තරයත් මතක තියාගන්නවා", "හැම ගෙවීමක්ම මතක තියාගන්නවා"],
      },
      advanced: {
        summary:
          "ගෙවීම් සහ idempotency-key table එක තියාගන්නවා, එක transaction එකකින් ලියන නිසා ගෙවීමකුයි ඒකේ save කරපු උත්තරයයි හැමවෙලේම එකට යනවා.",
        howItWorks:
          "Key table එකේ key එක (unique), request fingerprint එකක්, state එක (in progress හෝ done), lock කරපු වෙලාව, save කරපු response එක, expiry වෙලාවක් තියෙනවා. Order එකකට සාර්ථක ගෙවීම් වලට unique index එකක් දෙවෙනි safety net එකක්.",
        responsibilities: [
          "Key එකකට එක row එකයි",
          "Responses keys එක්ක save කරනවා",
          "පරණ keys expire කරනවා",
          "Order එකකට එක සාර්ථක ගෙවීමයි",
        ],
        inputs: ["Key inserts, lookups සහ updates", "ගෙවීම් rows"],
        outputs: ["Save කරපු උත්තර", "Duplicates වලට unique-constraint errors"],
        technologies: ["PostgreSQL", "MySQL", "Keys වලට Redis (shared transaction එකක් නැහැ)"],
        examples: ["CREATE UNIQUE INDEX … ON payments (order_id) WHERE status = 'succeeded'"],
        advantages: ["එක transaction එකක් නිසා ගෙවීමයි උත්තරයයි හැමවෙලේම ගැලපෙනවා"],
        limitations: ["Key table එක ලොකු වෙනවා; expire වුණු keys මකන්න ඕනේ"],
      },
      talksTo: ["Payments"],
    },
    "card-processor": {
      name: "Card processor",
      kind: "External service",
      beginner: {
        summary: "ඇත්තටම සල්ලි මාරු කරන bank එක.",
        analogy: "දැනටමත් ගෙවපු ticket numbers ලිස්ට් එකක් තියාගන්න bank එකක් වගේ.",
        jobs: ["Card එකෙන් සල්ලි ගන්නවා", "එකම key එකට දෙපාරක් ගන්නේ නැහැ"],
      },
      advanced: {
        summary:
          "තමන්ගේම Idempotency-Key එකක් පිළිගන්න පිටස්තර API එකක් (Stripe, Adyen, bank එකක්), ඒ නිසා ඒකට call කරන අයට charge එකක් ආරක්ෂිතව repeat කරන්න පුළුවන්.",
        howItWorks:
          "Payments හැම charge එකක්ම මේ ගෙවීමට වෙනස් නොවෙන key එකක් (pay_81f2) එක්ක යවනවා. ඒ key එකෙන් repeat එකක් ආවොත් අලුත් එකක් නෙවෙයි, පළවෙනි charge එක ආපහු දෙනවා.",
        responsibilities: ["Cards charge කරනවා", "Key එකෙන් charges deduplicate කරනවා"],
        inputs: ["Idempotency-Key එක්ක POST /v1/charges"],
        outputs: ["Charge එක (හෝ replay කරපු charge එක)"],
        technologies: ["Stripe", "Adyen", "Braintree", "bank APIs"],
        examples: ["Idempotency-Key: pay_81f2"],
        advantages: ["මුළු chain එකම repeat කරන්න ආරක්ෂිත කරනවා"],
        limitations: ["ඒකේ keys ත් expire වෙනවා (Stripe: අවම පැය 24යි)"],
      },
      talksTo: ["Payments"],
    },
  },
  badges: {
    "address-same": "address: 12 Lake Rd · එකමයි",
    "charged-once": "එක පාරයි ගත්තේ",
    "charged-twice": "දෙපාරක් ගත්තා",
    "charges-one-order": "charges {count} · order 1",
    "double-click": "double click",
    "no-answer": "උත්තරයක් නැහැ",
    slow: "හෙමින්",
    "timed-out": "timed out · retry",
    "key-saved": "key 7f3a… · save කළා",
    "key-attempt-2": "key 7f3a… · attempt 2",
    paid: "ගෙව්වා",
    "in-progress": "key 7f3a… · in progress",
    done: "key 7f3a… · done · 201 save කළා",
    replayed: "replay කළා",
    "one-charge-requests": "charge 1 · requests {count}",
    "double-tap": "double tap",
    conflict: "409 · ටිකකින් ආයෙත්",
    "new-cart": "අලුත් cart · එකම key",
    "different-body": "වෙනස් body එකක්",
    "key-reused": "422 · key එක ආයෙත් පාවිච්චි කළා",
    "downstream-key": "key pay_81f2 · එක පාරයි ගත්තේ",
    expires: "key 7f3a… · පැය 24කින් expire",
    crashed: "crash වුණා",
    "taking-over": "භාර ගන්නවා",
    "charged-once-replayed": "එක පාරයි ගත්තේ · replay කළා",
    "late-retry": "පැය 25කට පස්සේ · retry",
    "key-expired": "key 7f3a… · expire වෙලා",
    "already-paid": "දැනටමත් ගෙවලා · order 1042",
    "one-charge": "charge 1",
  },
  glossary: {
    idempotent: {
      term: "Idempotent",
      definition:
        "එක පාරක් කළත් ගොඩක් පාරවල් කළත් effect එක එකම වෙන operation එකක්. උත්තරය වෙනස් වෙන්න පුළුවන්; effect එක නෙවෙයි.",
    },
    "idempotent-methods": {
      term: "Idempotent methods",
      definition:
        "RFC 9110 idempotent කියලා define කරන HTTP methods: GET, HEAD, OPTIONS, TRACE, PUT සහ DELETE. POST සහ PATCH නෙවෙයි.",
    },
    "safe-methods": {
      term: "Safe methods",
      definition:
        "කියවන්න විතරක් කරන methods (GET, HEAD, OPTIONS, TRACE). හැම safe method එකක්ම idempotent; PUT සහ DELETE idempotent, ඒත් safe නෙවෙයි.",
    },
    "at-least-once-delivery": {
      term: "At-least-once delivery",
      definition: "Retries වලින් ලැබෙන දේ: request එක එනවා කියන එක ස්ථිරයි, ඒත් එක පාරකට වඩා එන්න පුළුවන්.",
    },
    "exactly-once-effect": {
      term: "Exactly-once effect",
      definition:
        "Deliveries ගොඩක්, එක result එකයි: ලබන කෙනා repeats අඳුනගෙන operation එක එක පාරයි කරන්නේ.",
    },
    "double-submit": {
      term: "Double submit",
      definition: "Double click එකකින් හෝ ඉවසිල්ලක් නැති tap එකකින් එකම form එක හෝ button එක දෙපාරක් යැවීම.",
    },
    "idempotency-key": {
      term: "Idempotency key",
      definition:
        "එක operation එකක හැම attempt එකකම client යවන unique අගයක්, ඒ නිසා repeats අලුත් requests වලින් වෙන් කරලා අඳුනගන්න server එකට පුළුවන්.",
    },
    uuid: {
      term: "UUID",
      definition:
        "Bits 128ක random identifier එකක් (version 4), උදාහරණයක් 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47; crypto.randomUUID() එකෙන් එකක් හදනවා.",
    },
    "key-table": {
      term: "Key table",
      definition:
        "Server එක හැම key එකක්ම, ඒකේ request fingerprint එක, state එක, save කරපු response එක, expiry එකත් එක්ක තියාගන්න තැන.",
    },
    "request-fingerprint": {
      term: "Request fingerprint",
      definition:
        "Request එකක method, path, body වල hash එකක්, key එක වෙන request එකකට ආයෙත් පාවිච්චි කළොත් අල්ලගන්න key එකත් එක්ක save කරනවා.",
    },
    "atomic-transaction": {
      term: "Atomic transaction",
      definition:
        "එකට සාර්ථක වෙන හෝ එකට අසාර්ථක වෙන database writes කිහිපයක්, ගෙවීමකුයි ඒකේ key එකේ save කරපු උත්තරයයි වගේ.",
    },
    replay: {
      term: "Replay",
      definition:
        "වැඩේ ආයෙත් නොකර, පළවෙනි request එකේ save කරපු response එකෙන් repeat එකකට උත්තර දෙන එක.",
    },
    "stored-response": {
      term: "Stored response",
      definition:
        "Key එකක පළවෙනි request එකේ status code එකයි body එකයි, repeats වලට උත්තර දෙන්න තියාගන්නවා.",
    },
    "concurrent-requests": {
      term: "Concurrent requests",
      definition: "එකම වෙලාවේ handle වෙන requests, එක key එකක් එක්ක taps දෙකක් වගේ.",
    },
    "status-409": {
      term: "409 Conflict",
      definition:
        "Request එක server එකේ දැන් තත්වයත් එක්ක ගැටෙනවා; keys වලදී, එකම key එකෙන් තව request එකක් තවම වැඩ කරනවා.",
    },
    lock: {
      term: "Lock",
      definition:
        "වැඩ කරන අතරේ key එකක් එක request එකකට අයිති කියන සලකුණක්; අනිත් අය ඉන්නවා හෝ 409 ගන්නවා. පරණ lock එකක් අත්හැරපු එකක් විදිහට සලකනවා.",
    },
    "status-422": {
      term: "422 Unprocessable Content",
      definition:
        "Server එකට request එක තේරුණා, ඒත් process කරන්න බැහැ; keys වලදී, key එක වෙන request එකක් එක්ක පාවිච්චි කරලා.",
    },
    "key-expiry": {
      term: "Key expiry",
      definition:
        "ටික කාලෙකට පස්සේ keys මකන එක (Stripe: අවම පැය 24යි); ඊට පස්සේ එන retries අලුත් ඒවා විදිහට සලකනවා.",
    },
    "business-key": {
      term: "Business key",
      definition:
        "ඇත්ත ලෝකයේ දේ අඳුනගන්න අගයක්, order number එක වගේ; ඒකට unique rule එකක් දැම්මොත් duplicates සදහටම නවතිනවා.",
    },
    "end-to-end-idempotency": {
      term: "End-to-end idempotency",
      definition:
        "හැම hop එකක්ම තමන්ව ආරක්ෂා කරගන්නවා: හැම service එකක්ම ඊළඟ එකට තමන්ගේම key එකක් යවනවා, ඒ නිසා මුළු chain එකම ආරක්ෂිතව repeat කරන්න පුළුවන්.",
    },
  },
};

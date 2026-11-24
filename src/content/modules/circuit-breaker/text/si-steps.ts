import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Circuit Breaker module, Sinhala step text. SERVER ONLY. Friendly spoken style; technical
 * terms stay in English (docs/CONVENTIONS.md → Writing module text).
 */
export const siSteps: Readonly<Record<string, StepCopy>> = {
  // ----- පරිච්ඡේදය 1: Service එකක් හෙමින් වුණාම -------------------------------------------
  "healthy-chain": step(
    "හොඳින් වැඩ කරන දාමයක්",
    "Request එකක් browser එකේ ඉඳන් Orders සහ breaker එක හරහා Payments සහ එහි database එකට යනවා, උත්තර කෙලින්ම ආපහු එනවා.",
    {
      body: [
        p(
          "ඔබ “My orders” open කරනකොට Orders service එක ඔබේ ලැයිස්තුව හදනවා. ඒත් එක එක order එකට ගෙවලා තියෙනවද කියලා ඒක දන්නේ නැහැ, ඒ නිසා Payments service එකෙන් අහනවා. Payments තමන්ගේ පොත, ඒ කියන්නේ database එක, බලලා උත්තර දෙනවා.",
        ),
        p("මේ ඔක්කොම වෙන්නේ ඇහැ පිල්ලමක් ගහන්නත් කලින්."),
      ],
      example: [
        p(
          "Waiter කෙනෙක් ඔබේ order එක අරගෙන කුස්සියෙන් අහනවා: “සුප් එක ලෑස්තිද?” කුස්සිය එකපාරටම උත්තර දෙනවා, waiter ඔබට කියනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Orders තමන්ගේ response එක හදන ගමන් Payments වෙත synchronous call එකක් කරනවා: එක request එකක්, පහළට එක HTTP call එකක්, ඒ පිටිපස්සේ database query එකක්. හොඳින් වැඩ කරන system එකක මේ මුළු දාමයටම 60 ms විතර යනවා, ඒ කාලය පුරාම Orders එකේ එක thread එකක් කාර්යබහුලයි.",
        ),
        p(
          "Circuit breaker එක තියෙන්නේ ඒ call එක වටේ, Orders එකේ code එක ඇතුළේ. දැන් එය closed: එය බලාගෙන ඉඳලා හැම call එකකම ප්‍රතිඵලය සහ කාලය සටහන් කරනවා විතරයි. (කලින් module එකේ API gateway එක තවමත් Orders ඉස්සරහ තියෙනවා; චිත්‍රය පොඩියට තියාගන්න ඒක පෙන්නන්නේ නැහැ.)",
        ),
      ],
      example: [code("http", "Call එක සහ එහි උත්තරය", exampleCode.healthyCall)],
    },
  ),

  "everyone-waits": step(
    "එක service එකක් හෙමින්, හැමෝම බලාගෙන",
    "Database එක amber පාට වෙනවා. Requests Payments වෙත යනවා, ඒත් උත්තර එන්නේ නැහැ, Orders එකේ busy threads badge එක වැඩි වෙනවා.",
    {
      body: [
        p(
          "අද Payments එකේ පොත ගොඩක් හෙමින්. Payments ඒකෙන් අහනවා, බලාගෙන ඉන්නවා, තව බලාගෙන ඉන්නවා. Orders Payments එකෙන් අහලා ඒකත් බලාගෙන ඉන්නවා.",
        ),
        p(
          "තව තව අය “My orders” open කරනවා, ඒ නිසා Orders එකේ උදව්කාරයෝ තව තව බලාගෙන හිරවෙනවා. ටික වෙලාවකින් Orders එකට නිදහස් උදව්කාරයෙක්වත් නැහැ, Payments ඕන නැති අයටත්.",
        ),
      ],
      example: [
        p(
          "කුස්සිය උත්තර දෙන එක නවත්වනවා. අහන්න යන හැම waiter කෙනෙක්ම කුස්සියේ දොර ළඟ බලාගෙන ඉන්නවා. ටික වෙලාවකින් අලුත් orders ගන්න waiter කෙනෙක්වත් ඉතුරු නැහැ, ප්‍රශ්නය තියෙන්නේ කුස්සියේ විතරක් වුණත් මුළු restaurant එකම නවතිනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Cascading failure එකක් පටන් ගන්නේ මෙහෙමයි. Payments වෙත යන හැම call එකක්ම ඒක ආපහු එනකම් Orders එකේ එක thread එකක් (හෝ connection එකක්, event-loop slot එකක්) අල්ලගෙන ඉන්නවා. Payments 40 ms ඉඳන් 10 s දක්වා හෙමින් වුණාම, එකවර යන calls ගණනත් ඒ ප්‍රමාණයෙන්ම වැඩි වෙනවා (Little’s law). Orders එකට තියෙන්නේ threads 50යි; Payments ස්පර්ශ නොකරන requests පවා fail වෙන්න පටන් ගන්නවා.",
        ),
        p(
          "2 s timeout එකක් උදව් වෙනවා: දැන් හිරවුණු call එකක් thread එකක් අල්ලගෙන ඉන්නේ තත්පර 10ක් නෙවෙයි, 2යි. ඒත් fail වෙනවා කියලා අනුමාන කරන්න පුළුවන් හැම call එකකටම Orders තවමත් තත්පර 2ක් ගෙවනවා, අමාරුවෙන් ඉන්න service එකට load එක යවනවා.",
        ),
      ],
      example: [code("text", "Payments වෙනුවෙන් බලාගෙන ඉන්න threads", exampleCode.threads)],
    },
  ),

  // ----- පරිච්ඡේදය 2: Breaker එක ----------------------------------------------------------
  "meet-the-breaker": step(
    "Circuit breaker එක හඳුනාගනිමු",
    "Breaker එකේ “closed” lamp එක දැල්වෙනවා. එක call එකක් ඒක හරහා කෙලින්ම Payments වෙත යනවා.",
    {
      body: [
        p(
          "Circuit breaker එක Orders සහ Payments අතර ඉන්න පොඩි ආරක්ෂකයෙක්. එය හැම call එකක්ම බලනවා. Payments හොඳට උත්තර දෙනකම් එය හැම දෙයක්ම යන්න දෙනවා.",
        ),
        p("ඒකට කියන්නේ closed කියලා: වහපු switch එකක් වගේ, calls හරහා යනවා."),
      ],
      example: [
        p(
          "ඔබේ ගෙදර fuse box එක. සාමාන්‍යයෙන් විදුලිය ගලනවා. මොකක් හරි ආයෙ ආයෙත් වැරදුනොත්, ගෙදර ආරක්ෂා කරන්න ඒක off වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Circuit breaker එකක් එක dependency එකකට යන calls වටේ තියෙනවා, ඒ වගේම පොඩි state machine එකක් තියාගන්නවා:",
        ),
        list(
          ["Closed", "calls යනවා; ඒවායේ ප්‍රතිඵල ගණන් කරනවා."],
          ["Open", "calls උත්සාහ නොකර එකපාරටම fail වෙනවා."],
          ["Half-open", "dependency එක සනීප වෙලාද කියලා trial calls කිහිපයකින් බලනවා."],
        ),
        p(
          "එය ජීවත් වෙන්නේ caller එක ඇතුළේ, සාමාන්‍යයෙන් HTTP client එක වටේ library එකක් විදිහට, එක dependency එකකට (හෝ endpoint එකකට) එක breaker එක බැගින්. මෙතන එහි state එක පේන්න ඒක වෙනම box එකක් විදිහට ඇඳලා තියෙනවා.",
        ),
      ],
      example: [code("text", "resilience4j (Java) වල breaker එකේ settings", exampleCode.config)],
    },
  ),

  "failures-add-up": step(
    "Failures එකතු වෙනවා",
    "Calls පහක් Payments වෙත යනවා. හැම එකක්ම timeout වෙලා rose පාට error එකක් විදිහට ආපහු එනවා, breaker එකේ badge එක 1 of 5 … 5 of 5 ගණන් කරනවා.",
    {
      body: [
        p(
          "Payments තවමත් හෙමින්. Orders අහන හැම වෙලාවකම තත්පර දෙකකින් අත්හැරලා “උත්තරයක් නැහැ” කියලා ආපහු එනවා.",
        ),
        p("ආරක්ෂකයා ගණන් කරනවා: එක failure එකක්, දෙකක්, තුනක්, හතරක්, පහක්."),
      ],
      example: [
        p(
          "ඔබ යාළුවෙකුට call කරනවා, කවුරුත් answer කරන්නේ නැහැ. ආයෙත් try කරනවා. ආයෙත්. පස් පාරක් try කරලා ඔබ නවතිලා හිතනවා: “එයා busy. පස්සේ කතා කරන්නම්.”",
        ),
      ],
    },
    {
      body: [
        p(
          "Breaker එක හැම ප්‍රතිඵලයක්ම සටහන් කරනවා. Call එකක් failure එකක් ලෙස ගණන් ගන්නේ එය exception එකක් දැම්මොත්, policy එක ගණන් ගන්න error එකක් දුන්නොත් (5xx, refused connection) හෝ slow-call සීමාවට වඩා වැඩි කාලයක් ගත්තොත්. 4xx උත්තර සාමාන්‍යයෙන් ගණන් ගන්නේ නැහැ: ඒවා caller එකේ වැරදි, ලෙඩ වෙච්ච dependency එකක ලකුණු නෙවෙයි.",
        ),
        p(
          "සැබෑ breakers “දිගටම 5ක්” පාවිච්චි කරන්නේ කලාතුරකින්. ඒවා sliding window එකක් පුරා failure rate එකක් පාවිච්චි කරනවා, උදාහරණයක් විදිහට අවම වශයෙන් calls 10ක් ගිහින් තියෙනකොට අන්තිම calls 20න් 50%ක්, ඒ නිසා busy විනාඩියක එක අවාසනාවන්ත call එකකින් ඒක trip වෙන්නේ නැහැ. ගණන් කිරීම පේන්න scene එක “දිගටම 5ක්” පාවිච්චි කරනවා.",
        ),
      ],
      example: [code("text", "අන්තිම calls 10ක count-based window එකක්", exampleCode.window)],
    },
  ),

  "breaker-trips": step(
    "Breaker එක trip වෙනවා",
    "Breaker එකේ “open” lamp එක දැල්වෙලා එය rose පාට වෙනවා: “open · 30 s”.",
    {
      body: [
        p("Failures පහක්! ආරක්ෂකයා තීරණය කරනවා: “Payments හොඳ තත්වයේ නැහැ. ටික වෙලාවකට අහන එක නවත්වමු.”"),
        p("එය open වෙනවා: තත්පර 30ක් Payments වෙත කිසිම call එකක් යන්නේ නැහැ."),
      ],
      example: [
        p("Fuse එක off වෙනවා. එක කාමරයක ලයිට් නිවෙනවා, ඒත් ගෙදර ඉතුරු ටික ආරක්ෂිතයි, කිසිම දෙයක් පිච්චෙන්නේ නැහැ."),
      ],
    },
    {
      body: [
        p(
          "Failure threshold එකට ආවා, ඒ නිසා breaker එක closed ඉඳන් open වෙලා තමන්ගේ wait timer එක පටන් ගන්නවා (මෙතන 30 s).",
        ),
        p(
          "මේ මාරුව log කරන්නත් alert කරන්නත් වටින event එකක්: dependency එකක් ලෙඩ කියන එකට තියෙන පැහැදිලිම ලකුණ එයයි, ගොඩක් වෙලාවට dashboard එකක ප්‍රශ්නයක් පේන්නත් කලින් එය වෙනවා.",
        ),
      ],
      example: [code("text", "Log line එක සහ metric එක", exampleCode.trip)],
    },
  ),

  "fail-fast": step(
    "ඉක්මනින් fail වෙන එක, fallback එකක් එක්ක",
    "අලුත් calls breaker එක ළඟ නැවතිලා කෙලින්ම ආපහු එනවා. Orders එකපාරටම browser එකට උත්තර දෙනවා, එහි busy threads badge එක අඩු වෙනවා.",
    {
      body: [
        p(
          "දැන් Orders අහනකොට ආරක්ෂකයා එකපාරටම උත්තර දෙනවා: “Payments විවේක ගන්නවා, බලාගෙන ඉන්න එපා.” ඒ නිසා Orders හිරවෙන්නේ නැහැ.",
        ),
        p(
          "ඒක කොහොමත් ඔබේ orders පෙන්නනවා, “payment status: ඉක්මනින් ආයෙ බලනවා” කියලා කියනවා. Payments එකටත් සනීප වෙන්න නිස්කලංක වෙලාවක් ලැබෙනවා.",
        ),
      ],
      example: [
        p(
          "කුස්සියේ ප්‍රශ්නයක් තියෙනවා කියලා waiter දන්නවා, ඒ නිසා එයා කුස්සියේ දොර ළඟ බලාගෙන ඉන්න යන්නේ නැහැ. එයා ඔබට කියනවා: “සුප් එකට ටික වෙලාවක් යයි. දැන් පාන් ටිකක් ගෙනත් දෙන්නද?”",
        ),
      ],
    },
    {
      body: [
        p(
          "Open වෙලා ඉන්නකොට breaker එක calls එකපාරටම reject කරනවා (CallNotPermittedException), 2 s timeout එකක් වෙනුවට microseconds වලින්. ඒකෙන් Orders එකේ threads නිදහස් වෙනවා, එහි latency එක අඩුවෙන් තියෙනවා, Payments එකෙන් load එක අයින් වෙනවා, ඒක සනීප වෙන්න උදව් වෙනවා.",
        ),
        p("Fallback එකකින් ඉක්මන් failure එක ප්‍රයෝජනවත් උත්තරයක් බවට පත් කරනවා. විකල්ප, හොඳම එකේ ඉඳන්:"),
        list(
          "Cache කරපු හෝ අන්තිමට දැනගත්ත data",
          "ආරක්ෂිත default එකක් (“unknown”)",
          "පොඩි කරපු feature එකක් (payment column එක හංගනවා)",
          "අවංක error එකක්",
        ),
        p("Fallback එකක් ලාභ වෙන්න ඕන, fail වෙන dependency එකට ආයෙ කවදාවත් call කරන්න හොඳ නැහැ."),
      ],
      example: [code("http", "ප්‍රශ්නය තියෙන අතරේ Orders දෙන උත්තරය", exampleCode.fallback)],
    },
  ),

  // ----- පරිච්ඡේදය 3: සනීප වීම ------------------------------------------------------------
  "half-open": step(
    "Half-open: පරිස්සමෙන් එක try එකක්",
    "Breaker එක 30 s ඉඳන් පහළට ගණන් කරනවා, එහි “half-open” lamp එක දැල්වෙනවා, හරියටම එක call එකක් Payments වෙත යනවා, ඒක ඉක්මනින් උත්තර දෙනවා.",
    {
      body: [
        p(
          "තත්පර 30කට පස්සේ ආරක්ෂකයා හිතනවා: “සමහර විට Payments දැන් හොඳයි. එක පාරක් try කරලා බලමු.” එය එක call එකක් යන්න දෙනවා, එකක් විතරයි.",
        ),
        p("මේ තමයි half-open: දොර ටිකක් විතරක් ඇරලා."),
      ],
      example: [
        p(
          "Fuse එකක් off වුණාට පස්සේ ඔබ ඒක පරිස්සමෙන් ආයෙ on කරලා බලාගෙන ඉන්නවා. ඔක්කොම එකපාරට plug කරන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Wait එක ඉවර වුණාම breaker එක half-open වෙලා trial calls කීපයකට ඉඩ දෙනවා (මෙතන 1යි, ගොඩක් වෙලාවට 3–10). ඒවායේ ප්‍රතිඵල තීරණය කරනවා: සාර්ථක නම් ඒක close වෙනවා; එකක් fail වුණොත් අලුත් timer එකක් එක්ක ආයෙ open වෙනවා.",
        ),
        p(
          "Trials සීමා කරන එක වැදගත්: දැන් සනීප වෙච්ච service එකකට එකපාරටම එහි මුළු traffic එකම ආපහු ආවොත් ගොඩක් වෙලාවට ඒක ආයෙ වැටෙනවා.",
        ),
      ],
      example: [code("text", "කාල රේඛාව", exampleCode.halfOpen)],
    },
  ),

  "closed-again": step(
    "ආයෙත් closed",
    "“closed” lamp එක දැල්වෙලා requests ආයෙත් මුළු දාමය හරහාම යනවා. ඊට පස්සේ lamps තුන වාරෙන් වාරෙට දැල්වෙනවා: closed, open, half-open, closed.",
    {
      body: [
        p(
          "Try එක වැඩ කළා! Payments හොඳයි. ආරක්ෂකයා ආයෙත් close වෙනවා, හැම දෙයක්ම කලින් වගේ යනවා. එය බිංදුවේ ඉඳන් ගණන් කරන්න පටන් අරගෙන දිගටම බලාගෙන ඉන්නවා.",
        ),
        p(
          "ආරක්ෂකයාට mood තුනක් තියෙනවා: closed (හැම දෙයක්ම හොඳයි, calls යන්න දෙනවා), open (මොකක් හරි වැරදියි, ටික වෙලාවකට call කරන එක නවත්වනවා) සහ half-open (පරිස්සමෙන් එක පාරක් try කරනවා).",
        ),
      ],
      example: [
        p("කාමරේ ලයිට් ආයෙ පත්තු වෙලා. Fuse box එක තවමත් එතන, මොකක් හරි වැරදුනොත් ආයෙ off වෙන්න ලෑස්තියෙන්."),
      ],
    },
    {
      body: [
        p(
          "සාර්ථක trial එකකින් breaker එක close වෙලා එහි window එක reset වෙනවා. ප්‍රශ්නය කාටවත් දැනගන්න, Payments off-on කරන්න හෝ Orders redeploy කරන්න ඕන වුණේ නැහැ.",
        ),
        p("Breakers හොඳටම වැඩ කරන්නේ මේවා එක්ක:"),
        list(
          ["Timeouts", "hang වෙන එක breaker එකට ගණන් කරන්න පුළුවන් failure එකක් කරනවා."],
          ["Bulkheads", "dependency එකකට වෙනම pool එකක්, එකකට මුළු Orders එකම පාවිච්චි කරන්න බැරි වෙන්න."],
          ["Retries with backoff", "පොඩි කැඩීම් වලට; breaker එක open වෙලා ඉන්නකොට ඒවා නවතිනවා."],
          ["Fallbacks", "ඒ අතරේ user දකින්නේ මොකක්ද කියලා තීරණය කරනවා."],
        ),
      ],
      example: [
        p("Breaker එක තියෙන්න පුළුවන් තැන්:"),
        list(
          ["Caller එකේ code එකේ", "resilience4j, Polly (.NET), opossum (Node)."],
          ["API gateway එකේ", "Spring Cloud Gateway, Kong passive health checks."],
          ["Service mesh එකක", "Envoy outlier detection, Istio."],
        ),
      ],
    },
  ),

  // ----- Scenario: Breaker එකක් නැතුව ----------------------------------------------------
  "queue-grows": step(
    "පෝලිම දිග් වෙනවා",
    "Breaker එකක් නැහැ. Calls දිගටම හෙමින් ඉන්න Payments වෙත යනවා, Orders එකේ badge එක threads 50න් 50ම busy දක්වා යනවා.",
    {
      body: [
        p(
          "මේ පාර ආරක්ෂකයෙක් නැහැ. Orders දිගටම Payments එකෙන් අහනවා, දිගටම බලාගෙන ඉන්නවා. දැන් එහි උදව්කාරයෝ ඔක්කොම හිරවෙලා.",
        ),
      ],
      example: [p("දැන් හැම waiter කෙනෙක්ම කුස්සියේ දොර ළඟ. Dining room එකේ කවුරුත් නැහැ.")],
    },
    {
      body: [
        p(
          "Thread-pool exhaustion: breaker එකක් හෝ bulkhead එකක් නැති නිසා හෙමින් dependency එක හැම thread එකක්ම අරගන්නවා. ඊළඟට request queue එක පිරෙනවා, ඊට පස්සේ memory. Timeouts විතරක් මේක හෙමින් කරනවා විතරයි.",
        ),
      ],
      example: [code("text", "Orders එකේ logs පෙන්නන දේ", exampleCode.noBreaker)],
    },
  ),

  "unrelated-pages-fail": step(
    "සම්බන්ධ නැති pages පවා fail වෙනවා",
    "Browser එක Orders එකෙන් “My profile” ඉල්ලනවා, ඒකට කවදාවත් Payments ඕන නැහැ. Orders එකට ඒක ගන්න බැහැ, 503 උත්තර දෙනවා.",
    {
      body: [
        p(
          "දැන් කවදාවත් Payments ඕන නැති “My profile” පවා වැඩ කරන්නේ නැහැ. එක ලෙඩ service එකක් හොඳ එකකුත් ලෙඩ කළා.",
        ),
      ],
      example: [
        p(
          "ඔබට ඕන වුණේ වතුර වීදුරුවක් විතරයි, ඒත් ගෙනත් දෙන්න waiter කෙනෙක් නිදහස් නැහැ, මොකද ඔක්කොම සුප් එක එනකම් බලාගෙන.",
        ),
      ],
    },
    {
      body: [
        p(
          "Failure එක service boundary එකක් පැනලා ගිහින්. Payments ස්පර්ශ නොකරන requests වලටත් Orders 503 Service Unavailable උත්තර දෙනවා. එහි health checks fail වෙන්න පටන් ගන්නවා, load balancer එක instances අයින් කරනවා, ඉතුරු ඒවාට තව load එනවා.",
        ),
      ],
      example: [
        code("http", "“My profile” එකට උත්තරය", [
          "HTTP/1.1 503 Service Unavailable",
          "Retry-After: 10",
        ]),
      ],
    },
  ),

  "retry-storm": step(
    "Retries තත්වය නරක් කරනවා",
    "Browser එක ආයෙ ආයෙත් retry කරනවා; හැම retry එකක්ම fail වෙනවා, retry badge එක වැඩි වෙනවා.",
    {
      body: [
        p(
          "මිනිස්සු ආයෙ ආයෙත් “reload” ඔබනවා, app එකත් තනියම ආයෙ try කරනවා. හැම try එකකින්ම තව බලාගෙන ඉන්න එක වැඩි වෙනවා.",
        ),
      ],
      example: [
        p(
          "Lift එකක් හෙමින් නම් හැමෝම ආයෙත් button එක ඔබනවා. Lift එක ඉක්මනින් එන්නේ නැහැ, panel එක තව busy වෙනවා විතරයි.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retry storm එකක්: දැනටමත් fail වෙන system එකක load එක retries වලින් ගුණ වෙනවා. විසඳුම් එකට වැඩ කරනවා: retry budget එකක් (retries කීපයක් උපරිම, traffic එකේ කොටසක්), jitter එක්ක exponential backoff, Retry-After අනුගමනය කරන එක, breaker එක open වෙලා ඉන්නකොට retries නවත්වන breaker එකක්.",
        ),
      ],
      example: [code("text", "එකවර retries හානිකර ඇයි", exampleCode.retryStorm)],
    },
  ),

  // ----- Scenario: Trial call එක fail වෙනවා ----------------------------------------------
  "still-sick": step(
    "Payments තවමත් ලෙඩයි",
    "එකම trial call එක Payments වෙත ගිහින් timeout වෙනවා. Breaker එක “half-open · failed” පෙන්නනවා.",
    {
      body: [p("පරිස්සම් try එක වැඩ කළේ නැහැ. Payments එකට තවමත් උත්තර දෙන්න බැහැ.")],
      example: [p("ඔබ fuse එක ආයෙ on කරනවා, ඒක එකපාරටම ආයෙ off වෙනවා. තවමත් මොකක් හරි වැරදියි.")],
    },
    {
      body: [
        p(
          "ආයෙ open වෙන්න fail වෙච්ච එක trial එකක් ඇති: breaker එක මුළු window එකක් එනකම් බලාගෙන ඉන්නේ නැහැ, මොකද dependency එක මොහොතකට කලින් ලෙඩ වෙලා හිටියා කියලා ඒක දැනටමත් දන්නවා.",
        ),
      ],
      example: [code("text", "Trial එක සහ ඊළඟට වෙන දේ", exampleCode.reopen)],
    },
  ),

  "open-again": step(
    "ආයෙත් open",
    "“open” lamp එක දැල්වෙනවා, badge එක “open · 30 s” පෙන්නනවා, calls ආයෙත් fallback එක එක්ක ඉක්මනින් fail වෙනවා.",
    {
      body: [
        p(
          "ආරක්ෂකයා දොර වහලා ආයෙ try කරන්න කලින් තව තත්පර 30ක් බලාගෙන ඉන්නවා. ඔබේ orders තවමත් පේනවා, “payment status: unknown” එක්ක.",
        ),
      ],
      example: [p("ඔබ fuse එක ආයෙ try කරන්න කලින් තව ටිකක් ඉන්නවා, ඒ අතරේ අනිත් කාමර පාවිච්චි කරනවා.")],
    },
    {
      body: [
        p(
          "Timer එක ආයෙ පටන් ගන්නවා. සමහර libraries හැම පාරම wait එක වැඩි කරනවා (exponential, සීමාවක් එක්ක), ඒ නිසා දිගු ප්‍රශ්නයකට probes අඩුවෙන් යනවා.",
        ),
        p(
          "ආයෙ ආයෙත් open වෙන breaker එකක් කෙනෙකුට යන alert එකක් විය යුතුයි, log line එකක් විතරක් නෙවෙයි: dependency එක හදන්න ඕන, දැන් users දකින්නේ fallback එක.",
        ),
      ],
      example: [code("text", "Open වෙලා ඉන්නකොට calls", exampleCode.reopen.slice(2))],
    },
  ),
};

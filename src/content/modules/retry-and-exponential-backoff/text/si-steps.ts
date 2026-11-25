import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Retry and Exponential Backoff module, Sinhala step text. SERVER ONLY. Friendly spoken style;
 * technical terms stay in English (docs/CONVENTIONS.md → Writing module text).
 */
export const siSteps: Readonly<Record<string, StepCopy>> = {
  // ----- පරිච්ඡේදය 1: මොහොතකට දේවල් අසාර්ථක වෙනවා -------------------------------------------
  blip: step(
    "පොඩි බාධාවක්",
    "Payments restart වෙන වෙලාවේ Shopper A Pay ඔබනවා. Payments 503 Service Unavailable කියලා උත්තර දෙනවා, මොහොතකින් ආයෙත් ලෑස්ති වෙනවා.",
    {
      body: [
        p(
          "Shopper A Pay ඔබනවා. Server එකේ ඉන්න ගෙවීම් උදව්කාරයා මොහොතකට කාර්යබහුලයි, ඒ නිසා “සමාවෙන්න, දැන් බැහැ” කියනවා.",
        ),
        p("තත්පරයකින් ඔක්කොම ආයෙත් හරි. ඇත්තටම කිසිම දෙයක් කැඩිලා නැහැ; වෙලාව විතරයි වැරදුණේ."),
      ],
      example: [
        p(
          "ඔබ කඩේකට call කරනවා, line එක busy. ඒකෙන් කියන්නේ කඩේ වහලා කියලා නෙවෙයි. හැමෝම එකපාර call කළා, නැත්නම් එතන ඉන්න කෙනා විනාඩියකට පැත්තකට ගියා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Distributed systems වල එන ගොඩක් failures transient: ඒවා milliseconds සිට තත්පර කිහිපයක් තියෙනවා, කවුරුවත් කිසිම දෙයක් නොකර නැති වෙනවා. සාමාන්‍ය හේතු: deploy එකකදී instances restart වීම, කෙටි overload එකක්, connection එකක් drop වීම, database failover එකක්, network එකේ පොඩි අවුලක්.",
        ),
        p(
          "Permanent failure එකක් (වැරදි request එකක්, නැති resource එකක්, bug එකක්) හැම වෙලාවෙම එකම error එක දෙනවා. (මේ module එකේ ඉලක්කම් උදාහරණ විතරයි, playback එකේ කාලය කෙටි කරලා; badges පෙන්නන්නේ ඇත්ත අගයන්.)",
        ),
      ],
      example: [code("http", "අසාර්ථක වුණු ගෙවීම", exampleCode.unavailable)],
    },
  ),

  "try-again": step(
    "ආයෙත් try කරන්න",
    "Shopper A මොහොතක් ඉඳලා එකම ගෙවීම ආයෙත් යවනවා. මේ පාර Payments charge කරලා 201 Created කියනවා: attempt 2 දී ගෙව්වා.",
    {
      body: [
        p("Shopper A ගේ app එක පොඩි මොහොතක් ඉඳලා ආයෙත් අහනවා. මේ පාර උදව්කාරයා “හරි” කියනවා, ගෙවීම යනවා."),
        p("පළවෙනි පාර අසාර්ථක වුණා කියලවත් Shopper A දැනගත්තේ නැහැ."),
      ],
      example: [p("Line එක busy, ඒ නිසා ඔබ මොහොතක් ඉඳලා ආයෙත් call කරනවා, මේ පාර කවුරුහරි උත්තර දෙනවා.")],
    },
    {
      body: [
        p(
          "Retry එකක් කියන්නේ failure එකකට පස්සේ එකම request එක ආයෙත් යැවීම. ඒක වටින්නේ ඊළඟ පාර සාර්ථක වෙන්න පුළුවන් errors වලට විතරයි:",
        ),
        list(
          [
            "Retry කරන්න",
            "timeouts, drop වුණු connections, 408, 429, 502, 503, 504. සමහර වෙලාවට 500 ත්, පරිස්සමෙන්.",
          ],
          [
            "Retry කරන්න එපා",
            "400, 401, 403, 404, 409, 422. එකම request එක එකම විදිහට අසාර්ථක වෙනවා; retry කිරීමෙන් load එකයි ප්‍රමාදයයි විතරයි වැඩි වෙන්නේ.",
          ],
        ),
        p(
          "Browser එකේ fetch කවදාවත් ඔබ වෙනුවෙන් retry කරන්නේ නැහැ. Libraries කරනවා: TanStack Query default විදිහට අසාර්ථක query එකක් 3 පාරක් retry කරනවා, gRPC එකේ service config එකේ retry policy එකක් තියෙනවා, AWS SDKs default විදිහට throttling සහ transient errors retry කරනවා.",
        ),
      ],
      example: [code("text", "Retry කරන්නද නැද්ද තීරණය (TypeScript)", exampleCode.isRetryable)],
    },
  ),

  // ----- පරිච්ඡේදය 2: තත්ත්වය නරක් නොකර retry කිරීම ---------------------------------------
  storm: step(
    "හැමෝම එකපාර retry කරනවා",
    "Payments restart වෙනකොට shoppers තුන්දෙනාම ගෙවනවා, හැම app එකක්ම වහාම, ආයෙ ආයෙත් retry කරනවා. Payments එකේ load එක තත්පරයට requests 30 දක්වා යනවා, එයට දරාගන්න පුළුවන් ප්‍රමාණය මෙන් තුන් ගුණයක්.",
    {
      body: [
        p("දැන් හැමෝගෙම ගෙවීම එකම මොහොතේ අසාර්ථක වෙනවා, හැම app එකක්ම වහාම ආයෙත් අහනවා, ආයෙත්, ආයෙත්."),
        p(
          "කලින් උදව්කාරයා පොඩ්ඩක් විතරයි කාර්යබහුල වුණේ. දැන් එයාට උත්තර දෙන්න පුළුවන් ප්‍රමාණය මෙන් තුන් ගුණයක් ප්‍රශ්න, ඒ නිසා එයා හිර වෙලා ඉන්නවා.",
        ),
      ],
      example: [
        p(
          "Lift එක පිරිලා, බලන් ඉන්න හැමෝම නොනවත්වා button එක ඔබනවා. Lift එක ඉක්මනට එන්නේ නැහැ; සෙනඟ විතරක් වැඩි වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "වහාම retry කිරීමෙන් කෙටි failure එකක් දිගු එකක් වෙනවා. අසාර්ථක වෙන හැම request එකක්ම අලුත් requests එකක් හෝ කිහිපයක් විදිහට ආපහු එනවා, ඒ නිසා අමාරුවෙන් ඉන්න service එකේ load එක වැඩිම වෙන්නේ එයට අඩුම capacity එක තියෙන වෙලාවේ. මේක retry storm එකක්.",
        ),
        p(
          "මුල් හේතුව නැති වුණාට පස්සෙත් system එක overload තත්ත්වයේම හිර වෙන්න පුළුවන්: restart එක ඉවරයි, ඒත් retries ගොඩ නිසා එය දිගටම අසාර්ථක වෙනවා. මේකට කියන්නේ metastable failure එකක් කියලා. (Shoppers තුන්දෙනා ඒ මොහොතේ ගෙවන හැමෝම වෙනුවෙන් ඉන්නවා.)",
        ),
      ],
      example: [code("text", "Restart එක අතරතුර වහාම කරන retries", exampleCode.storm)],
    },
  ),

  backoff: step(
    "Exponential backoff",
    "දැන් හැම shopper කෙනෙක්ම retry කරන්න කලින් ඉන්නවා, හැම පාරම දෙගුණයක්: 1 s, 2 s, ඊට පස්සේ 4 s. හතරවෙනි attempts සාර්ථකයි, ඒත් retries තුනම හැම වෙලාවෙම Payments ට එන්නේ එකට.",
    {
      body: [
        p(
          "මේ පාර හැම app එකක්ම ආයෙත් අහන්න කලින් ඉන්නවා, අසාර්ථක වෙන හැම පාරම දෙගුණයක් ඉන්නවා: තත්පරයක්, ඊට පස්සේ දෙකක්, ඊට පස්සේ හතරක්. ඒකෙන් උදව්කාරයාට ආයෙත් කකුල් උඩ හිටගන්න වෙලාව ලැබෙනවා.",
        ),
        p("ඒත් බලන්න: apps තුනම හරියටම එක වගේ ඉන්න නිසා, ඒවායේ ප්‍රශ්න තවමත් එකම මොහොතේ එනවා."),
      ],
      example: [
        p(
          "Line එක busy නම්, ආයෙත් call කරන්න කලින් ඔබ විනාඩියක් ඉන්නවා, ඊට පස්සේ විනාඩි දෙකක්, ඊට පස්සේ හතරක්. ඔබ line එක හිර කරන එක නවත්වනවා. ඒත් ඔබේ යාළුවෝ හැමෝම එකම rule එක පාවිච්චි කළොත්, ඔක්කොම ආයෙත් call කරන්නේ හරියටම එකම මොහොතේ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Exponential backoff එකෙන් retry n ට කලින් ඉන්න කාලය geometric විදිහට වැඩි වෙනවා, base × 2^(n−1), cap එකකින් සීමා කරලා, ඒ නිසා කවදාවත් අසාමාන්‍ය විදිහට දිගු වෙන්නේ නැහැ. Service එක down වෙලා ඉන්නකොට අඩු retries ගණනක් එයට එනවා, ඉක්මන් blips ඉක්මනින්ම හරි යනවා.",
        ),
        p(
          "ඒත් එකට අසාර්ථක වුණු clients දිගටම එකට retry කරනවා, synchronised waves විදිහට. TanStack Query ගේ default delay එක හරියටම මේක: base 1 s, cap 30 s.",
        ),
      ],
      example: [
        code("text", "Base 1 s, cap 30 s", exampleCode.backoff),
        code("text", "TanStack Query ගේ default retryDelay", exampleCode.backoffCode),
      ],
    },
  ),

  jitter: step(
    "Jitter එකතු කරන්න",
    "දැන් හැම shopper කෙනෙක්ම backoff එකේ random කොටසක් ඉන්නවා, ඒ නිසා retries එකිනෙකින් ඈත් වෙලා Payments ට එන්නේ එකින් එක. මෙතන random waits fix කරලා, ඒ නිසා හැම replay එකක්ම එක වගේ.",
    {
      body: [
        p(
          "දැන් හැම app එකක්ම පොඩි surprise එකක් එකතු කරනවා: එය ඉන්න කාලයෙන් random කොටසක් ඉන්නවා, අනිත් අය වගේ හරියටම එකම කාලයක් නෙවෙයි.",
        ),
        p("ඒ නිසා ප්‍රශ්න එකපාර ඔක්කොම නෙවෙයි, එකින් එක එනවා, උදව්කාරයාට හැම එකකටම උත්තර දෙන්න පුළුවන්."),
      ],
      example: [
        p(
          "හැමෝම හරියටම 2 ට ආයෙත් call කරනවා වෙනුවට, හැම යාළුවෙක්ම 2 ත් 2:10 ත් අතර කවදා හරි call කරනවා. Line එක කවදාවත් හිර වෙන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Jitter එකෙන් හැම wait එකකටම randomness එකතු කරනවා, එකට අසාර්ථක වුණු clients විසිරෙන්න. Marc Brooker ගේ AWS Architecture Blog post එක “Exponential Backoff and Jitter” මේ variants සංසන්දනය කළා.",
        ),
        p(
          "Full jitter සරලයි, හොඳට වැඩ කරනවා: sleep = random(0, min(cap, base × 2^attempt)). Backoff විතරක් එක්ක බලනකොට, server එක කරන වැඩයි clients ඉවර වෙන්න යන කාලයයි දෙකම අඩු කරනවා. Replays එක වගේ වෙන්න animation එක fix කරපු “random” අගයන් පාවිච්චි කරනවා; ඇත්ත clients Math.random() පාවිච්චි කරනවා.",
        ),
      ],
      example: [
        code("text", "Full jitter එක්ක attempts 2 සහ 3 ට කලින් ඉන්න කාලය", exampleCode.jitterTable),
        code("text", "Full jitter", exampleCode.jitterCode),
      ],
    },
  ),

  "give-up": step(
    "නවතින්න දැනගන්න",
    "මේ පාර deploy එක වැරදෙනවා, Payments down වෙලාම ඉන්නවා. Shopper A backoff එක්ක හතර පාරක් try කරලා, නවතිලා පැහැදිලි පණිවිඩයක් පෙන්නනවා.",
    {
      body: [
        p("සමහර වෙලාවට උදව්කාරයා ඉක්මනට ආපහු එන්නේ නැහැ. සදහටම අහගෙන හිටියොත් ඔබට සදහටම බලන් ඉන්න වෙනවා."),
        p(
          "ඒ නිසා app එක පාර කිහිපයක් try කරලා නවතිනවා, අවංකව කියනවා: “ගෙවීම සිද්ධ වුණේ නැහැ. ඔබෙන් මුදල් අය කළේ නැහැ. කරුණාකර පස්සේ ආයෙත් try කරන්න.”",
        ),
      ],
      example: [
        p(
          "තුන් හතර පාරක් call කරලත් උත්තරයක් නැත්නම්, ඔබ නවතිලා message එකක් යවනවා. මුළු දවසම ආයෙ ආයෙ dial කරන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p("හැම retry loop එකකටම සීමා ඕනේ:"),
        list(
          ["Max attempts", "මෙතන 4 (පළවෙනි try එක සහ retries 3)."],
          [
            "Deadline එකක්",
            "මුළු operation එකටම කාල සීමාවක්, මෙතන 10 s. හැම attempt එකකම timeout එක ඉතුරු කාලය ඇතුළේ තියෙන්න ඕනේ.",
          ],
          [
            "Retry budget එකක්",
            "මුළු requests වලින් retries වලට ඉඩ දෙන කොටස (Google ගේ SRE book එක client කෙනෙකුට 10% විතර යෝජනා කරනවා), ඒ නිසා ලොකු outage එකකට load එක ගුණ කරන්න බැහැ.",
          ],
          [
            "Circuit breaker එකක්",
            "ගොඩක් calls අසාර්ථක වෙනකොට, ටික වෙලාවකට පළවෙනි attempts පවා යවන එක නවත්වන්න (Circuit Breaker module එක බලන්න). Retries blips බලාගන්නවා; breaker එක outages බලාගන්නවා.",
          ],
        ),
        p("ඊට පස්සේ පැහැදිලිව fail වෙන්න: මොකද වුණේ, මුදල් අය වුණාද කියලා user ට කියන්න."),
      ],
      example: [code("text", "නවතින පාර", exampleCode.giveUp)],
    },
  ),

  // ----- පරිච්ඡේදය 3: ආයෙත් කරන එක ආරක්ෂිතද? -------------------------------------------------
  "double-charge": step(
    "දෙපාරක් අය කිරීම",
    "Payments Shopper A ගෙන් අය කරනවා, ඒත් එහි උත්තරය ආපහු එන අතරමගදී නැති වෙනවා. App එක time out වෙලා retry කරනවා, Payments ආයෙත් අය කරනවා: දෙපාරක් අය කළා.",
    {
      body: [
        p("Shopper A ගෙවනවා, ගෙවීම සිද්ධ වෙනවා, ඒත් “හරි!” කියන පණිවිඩය ආපහු එන පාරේදී නැති වෙනවා."),
        p(
          "ඒක වැඩ කළා කියලා app එක දන්නේ නැහැ, ඒ නිසා ආයෙත් අහනවා, උදව්කාරයා දෙවෙනි පාරටත් සල්ලි ගන්නවා. අයියෝ.",
        ),
      ],
      example: [
        p(
          "ඔබ සල්ලි දාපු ලියුමක් post කරනවා, ඒත් කිසිම උත්තරයක් එන්නේ නැහැ. ඒ නිසා ඔබ තවත් සල්ලි දාලා තව ලියුමක් යවනවා, පස්සේ දැනගන්නවා දෙකම ලැබිලා කියලා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Timeout එකකින් server එකේ මොකද වුණේ කියලා client ට කිසිම දෙයක් කියන්නේ නැහැ: request එක කවදාවත් ගිහින් නැතුව ඇති, අසාර්ථක වෙලා ඇති, නැත්නම් සාර්ථක වෙලා response එක නැති වෙලා ඇති. Retry කිරීම ආරක්ෂිත වෙන්නේ operation එක දෙපාරක් කළාම එක පාරක් කළා වගේම බලපෑමක් තියෙනවා නම් විතරයි: ඒ කියන්නේ idempotent නම්.",
        ),
        p(
          "HTTP වල GET, HEAD, PUT සහ DELETE idempotent කියලා define කරලා තියෙනවා; POST සහ PATCH එහෙම නැහැ. ඒ නිසයි TanStack Query default විදිහට queries retry කරලා mutations retry නොකරන්නේ (useMutation වලට retry: 0).",
        ),
      ],
      example: [code("text", "දෙපැත්තම දැක්ක දේ", exampleCode.doubleCharge)],
    },
  ),

  "idempotency-key": step(
    "Idempotency keys",
    "මේ පාර ගෙවීමත් එක්ක key එකක් යනවා. උත්තරය ආයෙත් නැති වෙනවා, app එක එකම key එකෙන් retry කරනවා. Payments key එක හොයාගෙන පළවෙනි result එකම දෙනවා: එක පාරයි අය කළේ.",
    {
      body: [
        p(
          "දැන් app එක ගෙවීම උඩ ticket අංකයක් වගේ විශේෂ අංකයක් ලියලා ඒක තියාගන්නවා. ආයෙත් අහන්න වුණොත්, එකම අංකය යවනවා.",
        ),
        p("උදව්කාරයා බලනවා: “මේ ticket එක මම දැනටමත් කළා”, තව සල්ලි නොගෙන ආයෙත් “හරි” කියනවා විතරයි."),
      ],
      example: [
        p(
          "ඔබ ලියුම උඩ reference අංකයක් ලියනවා. එකම අංකයෙන් දෙවෙනි ලියුමක් යැව්වොත්, ඒ එකම order එක කියලා කඩේ දන්නවා, ආයෙත් අය කරන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Client එක operation එකකට එක පාරක් (attempt එකකට නෙවෙයි) unique idempotency key එකක් හදලා, හැම attempt එකකම ඒක යවනවා. Server එක key එක පළවෙනි request එකේ result එකත් එක්ක save කරනවා; එකම key එකෙන් එන repeat එකකට දෙවෙනි charge එකක් වෙනුවට save කරපු result එක ලැබෙනවා. Stripe ගේ API එක වැඩ කරන්නේ මෙහෙමයි, IETF Idempotency-Key header draft එක ඕනෑම HTTP API එකකට මේක විස්තර කරනවා.",
        ),
        p(
          "වැදගත් විස්තර, Idempotency concept එකේ තියෙනවා: keys expire වෙනවා (Stripe ඒවා අවම වශයෙන් පැය 24ක් තියාගන්නවා), එකම key එක වෙනස් body එකක් එක්ක ආවොත් ඒක error එකක්, එක key එකක් එක්ක එකවර එන requests දෙකකට lock එකක් ඕනේ.",
        ),
      ],
      example: [
        code("http", "Key එකත් එක්ක retry එක", exampleCode.keyed),
        code("http", "පළවෙනි result එක, අලුත් charge එකක් නෙවෙයි", exampleCode.replayed),
      ],
    },
  ),

  // ----- Scenario: Server එක කියනවා කවදද කියලා -----------------------------------------------
  "server-hint": step(
    "Retry-After එක්ක 503",
    "Payments restart වෙනකොට shoppers තුන්දෙනා ගෙවනවා. Payments හැමෝටම 503 සහ Retry-After: 5 කියලා උත්තර දෙනවා, ඒ නිසා කොච්චර ඉන්න ඕනෙද කියලා හැම app එකක්ම දන්නවා.",
    {
      body: [
        p("මේ පාර උදව්කාරයා “දැන් බැහැ” කියනවාට වඩා දෙයක් කියනවා. එයා කියනවා “තත්පර පහකින් එන්න”."),
        p("ඒ නිසා apps වලට අනුමාන කරන්න ඕනේ නැහැ."),
      ],
      example: [
        p(
          "කඩේ answering machine එක කියනවා: “අපි ආයෙත් දහයට අරිනවා.” ඔබ දිගටම call කරන්නේ නැහැ; දහයට call කරනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retry-After (RFC 9110) client ට කොච්චර ඉන්න ඕනෙද කියනවා, තත්පර විදිහට (Retry-After: 5) හෝ HTTP date එකක් විදිහට. Servers ඒක 503 එක්ක සහ 429 Too Many Requests එක්ක යවනවා (Rate Limiting concept එක බලන්න).",
        ),
        p(
          "හොඳ client කෙනෙක් ඒක අවම wait එක විදිහට ගරු කරනවා, තවමත් පොඩි jitter එකක් එකතු කරනවා, wait එක deadline එක පහු කරනවා නම් අත්හරිනවා.",
        ),
      ],
      example: [code("http", "Hint එක", exampleCode.retryAfter)],
    },
  ),

  "on-time": step(
    "හැමෝම හරි වෙලාවට එනවා",
    "Wait එකෙන් පස්සේ, හැමෝම තමන්ගේම පොඩි jitter එකක් එක්ක, retries තුන Payments ට එනවා, එය ලෑස්තියි: තුන්දෙනාම ගෙව්වා.",
    {
      body: [p("Apps කියපු තරම් වෙලාව හිටියා, උදව්කාරයා ඒ අය වෙනුවෙන් ලෑස්ති වෙලා හිටියා.")],
      example: [p("ඔබ දහයට call කළා, කඩේ වහාම phone එක ගත්තා.")],
    },
    {
      body: [
        p(
          "Server එක තමන්ගේම තත්ත්වය දන්නවා (restart එකකට 5 s විතර යනවා, rate-limit window එකක් 5 s කින් reset වෙනවා), ඒ නිසා එහි hint එක ඕනෑම අනුමානයකට වඩා හොඳයි.",
        ),
        p("Header එක නැත්නම්, client එක තමන්ගේම backoff එකට jitter එක්ක ආපහු යනවා."),
      ],
      example: [code("text", "Client කෙනෙක් Retry-After පාවිච්චි කරන විදිහ", exampleCode.honour)],
    },
  ),

  // ----- Scenario: Retries ගුණ වෙනවා ----------------------------------------------------------
  "two-layers": step(
    "Layers දෙකක් retry කරනවා",
    "Payments DB එක overload වෙලා. Shopper A try කරන හැම පාරකම Payments database එක හතර පාරක් try කරනවා, Shopper A හතර පාරක් try කරනවා: database එකේ badge එක එක tap එකකට queries 16ක් ගණන් කරනවා.",
    {
      body: [
        p("App එක උදව්කාරයාගෙන් ආයෙ ආයෙත් අහනවා, හැම පාරම උදව්කාරයා database එකෙන් ආයෙ ආයෙත් අහනවා."),
        p("Button එකක් එක පාරක් එබුවාම, දැනටමත් අමාරුවෙන් ඉන්න database එකට ප්‍රශ්න දාසයක් යනවා."),
      ],
      example: [
        p(
          "ඔබ යාළුවාට හතර පාරක් කඩේට call කරන්න කියනවා, හැම පාරම යාළුවා හතර පාරක් call කරනවා. කඩේ phone එක දාසය පාරක් නාද වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Layers කිහිපයක retries ගුණ වෙනවා: client එකේ attempts 4 × Payments එකේ attempts 4 = එක user ක්‍රියාවකට database calls 16 දක්වා. Layers තුනක් නම් 64යි.",
        ),
        p(
          "Layers එකිනෙකා එනකම් බලන් ඉන්නත් ඕනේ, ඒ නිසා user ට ඕනෑම එක deadline එකකට වඩා ගොඩක් වැඩි වෙලාවක් ඉන්න වෙනවා.",
        ),
      ],
      example: [code("text", "එක tap එකක්, layers දෙකක් retry කරනවා", exampleCode.multiply)],
    },
  ),

  "one-layer": step(
    "එක layer එකක විතරක් retry කරන්න",
    "දැන් Payments වහාම fail වෙලා error එක උඩට යවනවා; retry කරන්නේ Shopper A විතරයි. Database එකේ badge එක එක tap එකකට queries 4 කින් නවතිනවා.",
    {
      body: [
        p("දැන් ආයෙත් අහන්නේ app එක විතරයි. උදව්කාරයා වහාම කියනවා “database එක උත්තර දෙන්නේ නැහැ” කියලා."),
        p("ප්‍රශ්න දාසයක් වෙනුවට හතරයි."),
      ],
      example: [
        p(
          "ඔබේ යාළුවා කඩේට එක පාරක් call කරනවා, කවුරුවත් උත්තර දුන්නේ නැත්නම් වහාම ඇවිත් ඔබට කියනවා. ආයෙත් try කරන්නේ කවදද කියලා ඔබ තීරණය කරනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "එක layer එකක විතරක් retry කරන්න, සාමාන්‍යයෙන් operation එක ආයෙත් කරන එක ආරක්ෂිතද කියලා දන්න, user ගේ deadline එක තියාගෙන ඉන්න layer එකේ. ඇතුළේ layers වහාම fail වෙලා retryable error එකක් දෙනවා, දන්නවා නම් Retry-After එකත් එක්ක.",
        ),
        p("ඉතුරු ටික retry budgets සහ circuit breakers සීමා කරනවා."),
      ],
      example: [code("text", "එක tap එකක්, එක layer එකක් retry කරනවා", exampleCode.oneLayer)],
    },
  ),
};

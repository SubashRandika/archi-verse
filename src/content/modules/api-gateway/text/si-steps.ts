import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * API Gateway module, Sinhala step text. SERVER ONLY.
 * Friendly spoken style ("කරනවා"); technical terms stay in English (Phase 5 decision).
 * Mirrors en-steps.ts; modules.test.ts checks that both have the same steps.
 */
export const siSteps: Readonly<Record<string, StepCopy>> = {
  // ----- Chapter 1: The request -----------------------------------------------------------
  "meet-the-client": step(
    "Client හඳුනාගනිමු",
    "වම් පැත්තේ තියෙන browser එක දැල්වෙනවා. අනිත් හැම දෙයක්ම එය ඉල්ලීමක් කරනකම් බලාගෙන ඉන්නවා.",
    {
      body: [
        p(
          "මේ තමයි browser එක: ඔබේ computer එකේ හෝ phone එකේ තියෙන app එක. ඔබට ඔබේ orders බලන්න ඕන නිසා ඔබ කඩේ website එක open කරනවා.",
        ),
        p(
          "නමුත් ඔබේ orders තියෙන්නේ ඔබේ computer එක ඇතුළේ නෙවෙයි. ඒවා තියෙන්නේ ගොඩක් ඈත තියෙන කඩේ computers වල. ඒ නිසා browser එකට ඒවා ඉල්ලන්න වෙනවා. මේ ඉල්ලීමට කියන්නේ request එකක් යවනවා කියලා.",
        ),
        p(
          "Browser එක දන්නේ ඉල්ලන්න එකම ලිපිනයක් විතරයි: api.shop.example. ඒ ලිපිනය පිටිපස්සේ මොනවද තියෙන්නේ කියලා එය දන්නේ නැහැ, දැනගන්න ඕනත් නැහැ.",
        ),
      ],
      example: [
        p(
          "ඔබට pizza එකක් ඕන වුණාම ඔබ කුස්සියට ඇතුළු වෙන්නේ නැහැ. ඔබ එක phone අංකයකට කතා කරනවා. කවුද උත්තර දෙන්නේ, කවුද උයන්නේ, කවුද ගෙනත් දෙන්නේ කියන එක restaurant එකේ වැඩක්, ඔබේ නෙවෙයි. Browser එකත් ඒ වගේමයි: කතා කරන්න එක අංකයයි, ඉතුරු ටික කඩේ බලාගන්නවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "මෙහි client එක shop.example එකෙන් serve කරන single-page app එකක්. එය api.shop.example කියන වෙනත් origin එකක තියෙන API එකකට call කරනවා. Request එකේ Authorization header එකක් තියෙන නිසා මෙය CORS “simple request” එකක් නෙවෙයි: browser එක මුලින්ම OPTIONS preflight එකක් යවනවා, API එක ගැළපෙන Access-Control-Allow-* headers එක්ක උත්තර දුන්නොත් විතරයි සැබෑ request එක යවන්නේ. Preflight ප්‍රතිඵලය cache කරන්න පුළුවන් (Access-Control-Max-Age), ඒ නිසා සාමාන්‍යයෙන් ඒ වියදම දරන්න වෙන්නේ හැම call එකකටම නෙවෙයි, session එකකට එක පාරක් විතරයි.",
        ),
        p(
          "API එක පිටිපස්සේ තියෙන topology එක ගැන client එක හිතාමතාම දන්නේ නැහැ. එක host එකක්, එක auth scheme එකක් සහ එක error format එකක් නිසා client එක සරලව තියෙනවා, ඒ වගේම client release එකක් නැතුව backend එක වෙනස් කරන්නත් පුළුවන්.",
        ),
      ],
      example: [
        p(
          "පළමු call එකට කලින් browser එක මේ preflight එක යවලා අවසරය ලබාගන්නවා. ඊළඟ තත්පර 600 ඇතුළත එම request එකටම එය ආයෙ preflight එකක් යවන්නේ නැහැ.",
        ),
        code("http", "Preflight එක සහ උත්තරය", exampleCode.preflight),
      ],
    },
  ),

  "anatomy-of-a-request": step(
    "HTTP request එකක කොටස්",
    "Browser එක ළඟ නිල් පාට packet එකක් පේනවා. ඒ packet එක තමයි request එක. ඇතුළේ මොනවද තියෙන්නේ කියලා කියවන්න එය click කරන්න.",
    {
      body: [
        p("කිසිම දෙයක් ගමන් කරන්න කලින්, browser එක request එක ලියනවා. Request එකක කොටස් හතරක් තියෙනවා:"),
        list(
          ["Method", "ඔබට කරන්න ඕන දේ. GET කියන්නේ “කරුණාකර මට දෙන්න” කියන එක."],
          ["Path", "ඔබට ඕන මොන දේද කියන එක. මෙතනදී: මගේ open orders."],
          [
            "Headers",
            "පොඩි සටහන්. උදාහරණයක් විදිහට “මම මේ කෙනායි” (token එක) සහ “මට කියවන්න පුළුවන් විදිහට උත්තර දෙන්න”.",
          ],
          [
            "Body",
            "request එකත් එක්ක යවන දෙයක්. GET request එකක body එකක් නැහැ, මොකද ඒකෙන් කරන්නේ ඉල්ලන එක විතරයි.",
          ],
        ),
      ],
      example: [
        p(
          "මේක ලියුමක් post කරනවා වගේ. මුල් පේළියෙන් ඔබට ඕන දේ කියනවා: “කරුණාකර මට එවන්න…” (method එක). ලිපිනයෙන් කියනවා එය යන්න ඕන කොහෙටද කියලා (path එක). පිටිපස්සේ ලියනවා කවුද එවන්නේ කියලා (headers). සමහර වෙලාවට කවරය ඇතුළේ මොනවා හරි තියෙනවා (body එක).",
        ),
      ],
    },
    {
      body: [
        p(
          "HTTP request එකක් කියන්නේ method එකක්, target එකක්, header fields සහ අවශ්‍ය නම් body එකක්. HTTP/2 සහ HTTP/3 මේ අර්ථයම තියාගන්නවා, නමුත් ඒවා binary frames විදිහට encode කරනවා: method එක සහ path එක pseudo-headers (:method, :path) විදිහට යනවා, header fields HPACK හෝ QPACK වලින් compress කරනවා.",
        ),
        list(
          [
            "Safe සහ idempotent",
            "GET එකකින් server state එක වෙනස් වෙන්න බැහැ. ඒ නිසයි gateways, CDNs සහ clients වලට එය cache කරන්නත් retry කරන්නත් පුළුවන් වෙන්නේ (“Timeout, ඊට පස්සේ retry” scenario එක).",
          ],
          [
            "Authorization",
            "signed JWT එකක් රැගෙන යනවා. Gateway එක 5 වෙනි පියවරේදී identity provider එකට call කරන්නේ නැතුව එය verify කරනවා.",
          ],
          [
            "Accept",
            "content negotiation පටන් ගන්නවා. JSON නිපදවන්න බැරි server එකක් 406 Not Acceptable කියලා උත්තර දෙන්න ඕන.",
          ],
        ),
      ],
      example: [
        p(
          "HTTP/2 හරහා start line එක pseudo-headers බවට පත් වෙනවා: :method GET, :scheme https, :authority api.shop.example, :path /api/orders?status=open. දිගු Authorization අගය සම්පූර්ණයෙන් යවන්නේ එක පාරයි; එම connection එකේම පස්සේ යන requests HPACK table එකේ byte එකකින් දෙකකින් ඒකට යොමු වෙනවා.",
        ),
      ],
    },
  ),

  "across-the-network": step(
    "Network එක හරහා",
    "නිල් packet එක browser එකේ ඉඳන් internet නැවතුම් දෙකක් පහු කරගෙන gateway එකට යනවා.",
    {
      body: [
        p(
          "දැන් request එක internet එක හරහා ගමන් කරනවා. මුලින්ම browser එකට api.shop.example තියෙන්නේ කොහෙද කියලා හොයාගන්න වෙනවා. ඒකට එය DNS එකෙන් අහනවා. DNS වැඩ කරන්නේ phone එකේ contacts list එක වගේ: ඔබ නම දන්නවා, DNS එකෙන් අංකය දෙනවා.",
        ),
        p(
          "ඊට පස්සේ browser එකයි කඩෙයි රහස් කේතයකට එකඟ වෙනවා. එතකොට අතරමගදී කාටවත් request එක කියවන්නවත් වෙනස් කරන්නවත් බැහැ. Address bar එකේ තියෙන padlock ලකුණෙන් කියන්නේ ඒකයි.",
        ),
        p("ගමනේදී request එක එකින් එකට computers ගොඩක් හරහා පනිනවා."),
      ],
      example: [
        p(
          "වෙන නගරයක ඉන්න යාළුවෙකුට පාර්සලයක් යවනවා කියලා හිතන්න. තැපැල් කන්තෝරුව ලිපිනය හොයනවා, කාටවත් ඇතුළ බලන්න බැරි වෙන්න පෙට්ටිය සීල් කරනවා, ඊට පස්සේ එය වර්ග කරන මධ්‍යස්ථාන කිහිපයක් හරහා යනවා. යාළුවා ඉන්නේ ඈතින් නම්, හැම දෙයක්ම හරියට සිද්ධ වුණත්, ළඟා වෙන්න වැඩි කාලයක් යනවා.",
        ),
        p(
          "ඒ නිසයි browser එක පළමු ගමනෙන් පස්සෙත් පාර ඇරලම තියාගෙන, ඊළඟ requests වලටත් ඒ පාරම පාවිච්චි කරන්නේ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Cold request එකකදී HTTP වල පළමු byte එකට කලින් DNS resolution, TCP handshake එකක් (එක round trip එකක්) සහ TLS 1.3 handshake එකක් (තවත් round trip එකක්) සඳහා කාලය වැය වෙනවා. HTTP/3 run වෙන්නේ QUIC උඩ; QUIC එකෙන් transport සහ TLS handshakes එකම round trip එකකට එකතු කරනවා. TLS 1.3 සහ QUIC දෙකම 0-RTT resumption වලට සහාය දෙනවා (නමුත් එය ආරක්ෂිත වෙන්නේ idempotent requests වලට විතරයි, මොකද 0-RTT data replay කරන්න පුළුවන්).",
        ),
        p(
          "ප්‍රායෝගිකව connection එක warm: HTTP/2 හෝ HTTP/3 එකම connection එකක් උඩ requests ගොඩක් multiplex කරනවා, ඒ නිසා එක request එකකට වැය වෙන්නේ network round trip එකක් විතරයි. සැබෑ deployments වල සාමාන්‍යයෙන් gateway එකට ඉස්සරහින් CDN එකක් හෝ load balancer එකක් තියෙනවා; gateway එක ගැන අවධානය තියාගන්න මේ scene එකේ ඒවා පෙන්නලා නැහැ.",
        ),
      ],
      example: [
        {
          type: "table",
          caption: "කි.මී. 1,000ක් පමණ ඈතින් ඉන්න user කෙනෙක් (එක round trip එකක් ≈ 30 ms)",
          columns: ["Request", "කාලය"],
          rows: [
            ["Cold: DNS + TCP + TLS 1.3 + request", "~20 + 30 + 30 + 30 ms"],
            ["HTTP/3 (QUIC) හරහා cold", "~20 + 30 + 30 ms"],
          ],
          footer: ["Warm connection (බොහෝ requests)", "~30 ms"],
        },
      ],
    },
  ),

  // ----- Chapter 2: The gateway -----------------------------------------------------------
  "one-front-door": step(
    "එකම ඉදිරි දොරටුව",
    "Gateway එකේ පළමු පහන, TLS, දැල්වෙනවා. ඒ පිටිපස්සේ services තමන්ගේ වාරය එනකම් බලාගෙන ඉන්නවා.",
    {
      body: [
        p(
          "Request එක API gateway එකට ළඟා වෙනවා. Gateway එක කියන්නේ මුළු system එකේම ඉදිරි දොරටුව. පිටින් එන හැම request එකක්ම ඇතුළු වෙන්නේ මෙතනින් විතරයි, වෙන කොහෙන්වත් නෙවෙයි.",
        ),
        p("දොරටුව පිටිපස්සේ ඉන්නේ සැබෑ වැඩේ කරන services. ඒවා කවදාවත් පිට ලෝකය එක්ක කෙලින්ම කතා කරන්නේ නැහැ."),
        p("මුලින්ම gateway එක සීල් කරපු කවරය අරිනවා (TLS පහන). එතකොට එයට request එක කියවන්න පුළුවන්."),
      ],
      example: [
        p(
          "ලොකු hotel එකක් ගැන හිතන්න. අමුත්තෝ කාමරයක් හොයාගෙන corridors වල ඇවිදින්නේ නැහැ. ඔවුන් reception එකට යනවා. Reception එක ඔවුන් කවුද කියලා බලනවා, ඇතුළට එන්න අවසර තියෙනවද කියලා තහවුරු කරනවා, කොහෙද යන්න ඕන කියලා කියනවා. Requests වලට gateway එක තමයි ඒ reception එක.",
        ),
      ],
    },
    {
      body: [
        p(
          "API gateway එකක් කියන්නේ client (“north–south”) traffic වලට ඇතුළු වෙන එකම තැන වෙන reverse proxy එකක්. එය TLS terminate කරනවා, ඕනම service එකක් සම්බන්ධ වෙන්න කලින් cross-cutting concerns එක පාරක් යොදනවා: authentication, rate limiting, validation, routing, observability. ඒ නිසා services business logic එකට විතරක් අවධානය දෙනවා, ඇතුළේ topology එක පෞද්ගලිකව තියෙනවා.",
        ),
        list(
          [
            "Load balancer එකට සාපේක්ෂව",
            "load balancer එකක් connections instances අතරේ බෙදනවා; gateway එකක් API එකත් තේරුම් ගන්නවා (paths, methods, identities). ගොඩක් gateways වල load balancing ඇතුළත් වෙනවා.",
          ],
          [
            "Service mesh එකට සාපේක්ෂව",
            "mesh එකක් system එක ඇතුළේ service-to-service (“east–west”) traffic හසුරුවනවා. Gateway එකයි mesh එකයි එකිනෙකට අනුපූරකයි.",
          ],
          [
            "Availability",
            "gateway එක හැම request එකකම පාරේ තියෙන නිසා, එය සමාන, stateless replicas කිහිපයක් විදිහට run වෙනවා. Rate-limit counters වගේ shared state වෙනම store එකක තියෙනවා.",
          ],
        ),
      ],
      example: [
        p(
          "Port 443 උඩ තියෙන Envoy listener එකක් api.shop.example සඳහා certificate එක තියාගෙන TLS terminate කරනවා. එහි route table එක /api/orders/* orders cluster එකටත්, /api/users/* users cluster එකටත් යවනවා. Clients කවදාවත් orders.internal දකින්නේ නැති නිසා, client release එකක් නැතුව team එකට services බෙදන්න, එකතු කරන්න හෝ තැන මාරු කරන්න පුළුවන්.",
        ),
      ],
    },
  ),

  authentication: step(
    "Authentication",
    "Gateway එකේ දෙවෙනි පහන, Authentication, දැල්වෙනවා. Identity provider එකට තියෙන කඩ ඉරි ඉර බබළනවා: gateway එක පරීක්ෂා කරන key එක කලින් ආවේ එතනින්.",
    {
      body: [
        p(
          "ඔබේ request එක ඇතුළට ගන්න කලින්, gateway එක ඔබේ අවසර පත්‍රය පරීක්ෂා කරනවා. මේ අවසර පත්‍රයට කියන්නේ token එක කියලා. ඔබ sign in වුණු වෙලාවේ identity provider එකෙන් ඔබට එය ලැබුණා.",
        ),
        p("Gateway එක token එක ගැන ප්‍රශ්න තුනක් අහනවා:"),
        list("මේක ඇත්තද?", "මේක තවම වලංගුද?", "මේක මේ API එකටමද?"),
        p("උත්තර තුනම “ඔව්” නම්, request එකට ඉස්සරහට යන්න පුළුවන්."),
      ],
      example: [
        p(
          "පාසලෙන් කෞතුකාගාරයකට ගිය චාරිකාවක් ගැන හිතන්න. දොරටුවේ ඉන්න මුරකරු ඔබේ ටිකට් පත බලනවා. මේක ඇත්ත ටිකට් පතක්ද, තමන්ම ඇඳපු එකක් නෙවෙයි නේද? මේක අදට වලංගුද, පහුගිය සතියේ එකක් නෙවෙයි නේද? මේක මේ කෞතුකාගාරයටමද, සත්වෝද්‍යානයට එකක් නෙවෙයි නේද? උත්තර තුනම “ඔව්” නම්, ඔබට ඇතුළට යන්න පුළුවන්.",
        ),
        p(
          "මුරකරු හැම ළමයෙක් වෙනුවෙන්ම ටිකට් කාර්යාලයට කතා කරලා අහන්නේ නැහැ. ඇත්ත මුද්‍රාව පේන්නේ කොහොමද කියලා එයා දන්නවා. Gateway එකත් ඒ වගේමයි: identity provider එකෙන් අහන්නේ නැතුව, token එකේ signature එක තමන්ම පරීක්ෂා කරනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Token එක කියන්නේ identity provider එකේ private key එකෙන් sign කරපු JWT එකක් (උදාහරණ: RS256 හෝ ES256). Gateway එක token එකේ kid එක අනුව, cache කරපු JWKS document එකෙන් public key එක තෝරගන්නවා (මෙය වරින් වර refresh වෙනවා, නොදන්නා kid එකක් ආවොත් වහාම refresh වෙනවා; key rotation වලට සහාය දෙන්නේ මේ විදිහට). ඊට පස්සේ signature එක verify කරලා claims පරීක්ෂා කරනවා: exp සහ nbf (කාලය), iss (issuer) සහ aud (audience).",
        ),
        list(
          [
            "Self-contained සහ opaque tokens",
            "opaque token එකකට හැම request එකකටම identity provider එකට introspection call එකක් (නැත්නම් cache එකක්) ඕන වෙනවා. JWTs ඒ round trip එක මඟහරිනවා; නමුත් කල් ඉකුත් වෙන්න කලින් ඒවා revoke කරන්න බැහැ. ඒ නිසයි ඒවායේ ආයු කාලය කෙටි.",
          ],
          [
            "Authentication සහ authorization",
            "gateway එක සාමාන්‍යයෙන් කරන්නේ පුළුල් පරීක්ෂාවන් (වලංගු user කෙනෙක්ද, orders:read වගේ අවශ්‍ය scope එක තියෙනවද). “මේ user ට order 1042 බලන්න පුළුවන්ද?” කියන එක business logic; එය අයිති Orders service එකට (8 වෙනි පියවර).",
          ],
          [
            "Identity එක ඉදිරියට",
            "සාර්ථක වුණොත් gateway එක caller ගේ identity එක service එකට යවනවා, උදාහරණයක් විදිහට X-User-Id header එකක් හෝ validate කරපු token එකම.",
          ],
        ),
      ],
      example: [
        p(
          "Token එකේ header එකේ k1 key එක සඳහන් වෙනවා. Gateway එක cache කරපු JWKS එකෙන් k1 හොයාගෙන signature එක verify කරනවා, ඊට පස්සේ පහළ තියෙන claims පරීක්ෂා කරනවා: issuer සහ audience ගැළපෙනවා, scope එකේ orders:read තියෙනවා, ඒ වගේම එය කල් ඉකුත් වෙන්න තව විනාඩි 3යි තත්පර 40ක් තියෙනවා. Request එක X-User-Id: u_7f3a එක්ක ඉදිරියට යනවා.",
        ),
        code("json", "Token header එක සහ claims (decode කරපු)", exampleCode.tokenClaims),
      ],
    },
  ),

  "rate-limiting": step(
    "Rate limiting",
    "තුන්වෙනි පහන, Rate limit, දැල්වෙනවා. Gateway එකේ badge එක “58 of 60 left” ඉඳන් “57 of 60 left” වෙනවා.",
    {
      body: [
        p(
          "හැම app එකකටම දීමනාවක් (allowance එකක්) ලැබෙනවා: උදාහරණයක් විදිහට විනාඩියකට requests 60ක්. හැම request එකකටම එකක් වැය වෙනවා. කාලයත් එක්ක දීමනාව හෙමින් ආයෙත් පිරෙනවා. Gateway එකේ badge එකෙන් තව කීයක් ඉතුරුද කියලා පෙන්නනවා.",
        ),
        p(
          "ඇයි? කැඩුණු app එකක් requests දහස් ගණනක් යැව්වොත්, නැත්නම් කවුරුහරි කඩේ requests වලින් යටකරන්න හැදුවොත්, ඔවුන්ගේ දීමනාව ඉවර වෙලා දොරටුවේදීම නවත්වනවා. ඒ පිටිපස්සේ තියෙන services ආරක්ෂිතව තියෙනවා. සාමාන්‍ය apps වලට මේ සීමාව දැනෙන්නේවත් නැහැ.",
        ),
      ],
      example: [
        p(
          "කානිවල් එකකදී ඔබට සෙල්ලම් කරන්න tokens 60ක් තියෙන කෝප්පයක් ලැබෙනවා. හැම සෙල්ලමකටම token එකක් වැය වෙනවා, උදව්කරුවෙක් හැම තත්පරයකටම අලුත් token එකක් ඔබේ කෝප්පයට දානවා. Tokens ආපහු එනවාට වඩා ඉක්මනට ඔබ වියදම් කළොත්, කෝප්පය හිස් වෙලා ඔබට ඉන්න වෙනවා.",
        ),
        p("Gateway එක වැඩ කරන්නෙත් හරියටම මේ විදිහට. මේ අදහසට කියන්නෙත් “token bucket” කියලා."),
      ],
    },
    {
      body: [
        p(
          "බහුලව පාවිච්චි වෙන algorithm එකක් තමයි token bucket එක: ධාරිතාව b වන bucket එකක් r වේගයෙන් ආයෙත් පිරෙනවා; හැම request එකක්ම token එකක් ගන්නවා, නැත්නම් reject වෙනවා. එය b දක්වා කෙටි bursts වලට ඉඩ දෙන අතරම සාමාන්‍යය r ට සීමා කරනවා. ප්‍රධාන විකල්පය sliding-window counters.",
        ),
        list(
          "Limits තීරණය කරන්නේ API key එක, user හෝ IP එක අනුව; බොහෝ විට route එක හෝ plan එක අනුවත් ඒවා වෙනස් වෙනවා.",
          "Gateway එක replicas කිහිපයක් විදිහට run වෙන නිසා, counters තියෙන්නේ shared, වේගවත් store එකක (සාමාන්‍යයෙන් Redis; scene එකේ පෙන්නලා නැහැ). ඒකට network round trip එකක් යනවා, ඒ නිසා සමහර gateways වරින් වර sync වෙන local counters පාවිච්චි කරලා, නිරවද්‍යතාව ටිකක් අඩු කරලා වේගය ලබාගන්නවා.",
          "Reject වෙන requests වලට Retry-After එක්ක 429 Too Many Requests ලැබෙනවා. IETF draft එකේ තියෙන RateLimit සහ RateLimit-Policy headers වලින් clients ලට ඉතුරු දීමනාවත් කියනවා.",
        ),
      ],
      example: [
        p(
          "b = 60 සහ තත්පරයකට r = token 1 නම්, විනාඩියක් නිෂ්ක්‍රියව හිටපු client කෙනෙකුට එකවර requests 60ක් යවන්න පුළුවන්, ඊට පස්සේ තත්පරයකට එකක් පමණ. Redis එකේ gateway එක එක client කෙනෙකුට අංක දෙකක් තියාගන්නවා (ඉතුරු tokens, අන්තිමට පිරවූ වෙලාව), ඒවා එකම atomic පියවරකින් update කරනවා. ඒ නිසා හැම gateway replica එකක්ම එකම ගණන බෙදාගන්නවා.",
        ),
      ],
    },
  ),

  "validation-and-routing": step(
    "Validation සහ routing",
    "අන්තිම පහන් දෙක, Validation සහ Routing, දැල්වෙනවා. ඊට පස්සේ request එක Orders service #1 ට යනවා. Gateway එක එකතු කරපු දේවල් බලන්න packet එක click කරන්න.",
    {
      body: [
        p(
          "දොරටුවේදී අන්තිම පරීක්ෂාවන් දෙකක්. පළමුවැන්න: request එක හරියට ලියලා තියෙනවද? මොනවා හරි අඩු නම්, නැත්නම් තේරුමක් නැත්නම්, gateway එක වහාම error එකකින් උත්තර දෙනවා. කැඩුණු requests කවදාවත් services වලට පේන්නේ නැහැ.",
        ),
        p(
          "ඊළඟට: මේක යන්න ඕන කොහෙටද? Gateway එක ළඟ ලැයිස්තුවක් තියෙනවා. ඒකේ කියනවා “orders ගැන ඕනම දෙයක් Orders service එකට යවන්න” කියලා. Orders service එකේ පිටපත් දෙකක් තියෙනවා, ඒ නිසා වැඩේ සාධාරණව බෙදන්න gateway එක එකක් තෝරනවා. මෙතනදී එය පිටපත #1 තෝරනවා.",
        ),
      ],
      example: [
        p(
          "තැපැල් කන්තෝරුවේදී ලිපිකරු මුලින්ම බලනවා ඔබේ පාර්සලයේ ලිපිනයක් සහ මුද්දරයක් තියෙනවද කියලා. නැත්නම් එය කෙලින්ම ඔබට ආපහු එනවා. හරි නම්, ලිපිකරු ලිපිනය කියවලා පාර්සලය හරි බෑගයට දානවා. එකම නගරයට vans දෙකක් යනවා නම්, එක van එකක්වත් පිරී ඉතිරී නොයන්න ලිපිකරු ඒවා මාරුවෙන් මාරුවට පුරවනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Validation එකෙන් request එක API contract එකට (සාමාන්‍යයෙන් OpenAPI document එකට) අනුව පරීක්ෂා කරනවා: path සහ query parameters, body schema, size limits. 400 Bad Request එකකින් කලින්ම reject කිරීම ලාභදායීයි, ඒ වගේම වැරදි input services වලින් ඈත් කරලා තියනවා.",
        ),
        p(
          "Routing එකෙන් host, path සහ method upstream cluster එකකට ගළපනවා, ඊට පස්සේ load-balancing policy එකක් (round robin, least requests) healthy instance එකක් තෝරනවා. Health තීරණය වෙන්නේ active checks (/healthz endpoint එකක් probe කිරීම) සහ passive checks (errors නිරීක්ෂණය) වලින්. Gateway එක request එක forward කරන්න කලින් ඒකට තොරතුරු එකතු කරනවා (පහළ message එක බලන්න).",
        ),
        p(
          "traceparent header එක (W3C Trace Context) gateway එකේ log line එක, request එක system එක ඇතුළේ හදන හැම span එකකටම සම්බන්ධ කරනවා.",
        ),
      ],
      example: [
        p(
          "?status=opne වගේ අකුරු වැරැද්දක් කවදාවත් service එකකට යන්නේ නැහැ: gateway එක problem+json body එකක් එක්ක 400 උත්තරය දෙනවා. නිවැරදි request එක /api/orders route එකට ගැළපෙනවා, “least requests” policy එක orders-1 තෝරනවා, මොකද orders-2 එකේ in-flight requests 5ක් තියෙද්දී orders-1 එකේ තියෙන්නේ 3යි.",
        ),
        code("http", "වැරදියට ලියපු request එකකට උත්තරය", exampleCode.badRequest),
      ],
    },
  ),

  // ----- Chapter 3: The backend -----------------------------------------------------------
  "business-logic": step(
    "Business logic",
    "Orders service #1 දැල්වෙනවා, ඊට පස්සේ Users service එකට පොඩි request එකක් යවලා උත්තරයක් ලබාගන්නවා.",
    {
      body: [
        p(
          "අන්තිමේදී request එක Orders service එකට ළඟා වෙනවා. මේ service එක orders ගැන කඩේ නීති දන්නවා. කවුද අහන්නේ කියලා එය දැනටමත් දන්නවා, මොකද gateway එක අවසර පත්‍රය පරීක්ෂා කරලා ඔබේ නම request එකේ ලියලා තියෙනවා. ඒ නිසා එය නීතිය අනුගමනය කරනවා: ඔබට බලන්න පුළුවන් ඔබේම orders විතරයි.",
        ),
        p(
          "ඒකට ඔබේ නමයි බෙදාහරින ලිපිනයයි ඕන වෙනවා, ඒ නිසා එය Users service එකෙන් අහනවා. ඒ ප්‍රශ්නය ගොඩනැගිල්ල ඇතුළේම තියෙනවා. එය කවදාවත් ඉදිරි දොරටුවෙන් ආපහු එළියට යන්නේ නැහැ.",
        ),
      ],
      example: [
        p(
          "පාසලක ඉදිරි කාර්යාලය හැම අමුත්තෙක්වම පරීක්ෂා කරනවා. ඔබ ඇතුළට ආවට පස්සේ ඔබේ ගුරුවරයා ඔබේ ඇතුළුවීමේ පත්‍රය ආයෙ පරීක්ෂා කරන්නේ නැහැ. නමුත් ඔබට බලන්න පුළුවන් දේ තීරණය කරන්නේ ගුරුවරයාමයි: ඔබේම විභාග ප්‍රතිඵල, ඔබේ යාළුවාගේ ඒවා නෙවෙයි. ඒ වගේම ගුරුවරයාට ඔබේ ලිපිනය ඕන නම්, එයා අහන්නේ ශාලාවේ අනිත් පැත්තේ තියෙන පාසල් කාර්යාලයෙන්, ඉදිරි ගේට්ටුවෙන් නෙවෙයි.",
        ),
      ],
    },
    {
      body: [
        p(
          "Data අනුව authorization සිද්ධ වෙන්නේ මෙතනදී: caller කවුද කියලා gateway එක ඔප්පු කළා; ඔවුන්ට බලන්න පුළුවන් මොනවද කියලා service එක තීරණය කරනවා (user_id = u_7f3a වන orders විතරයි).",
        ),
        p(
          "Users service එකට යන call එක east–west traffic. එය gateway එක හරහා යන්නේ නැහැ; ගොඩක් systems වල service mesh එකක් මේ calls වලට mTLS, retries සහ metrics එකතු කරනවා. හැම internal call එකකටම gateway එකේ timeout එකට වඩා කෙටි, තමන්ගේම timeout එකක් ඕන. නැත්නම් හෙමින් වැඩ කරන එක dependency එකකට මුළු දාමයම හිර කරන්න පුළුවන් (“Timeout, ඊට පස්සේ retry” scenario එක බලන්න).",
        ),
      ],
      example: [
        p(
          "Gateway එක මුළු call එකටම 2 s දෙනවා. Orders තමන්ට 1.5 s ක් තියාගෙන, Users call එකට 300 ms ක් සහ එක retry එකක් දෙනවා. Users හිර වුණොත්, Orders 300 ms කට පස්සේ බලාගෙන ඉන්න එක නවත්වනවා. ඒ නිසා gateway එක අත්හරිනකම් request එක අල්ලාගෙන ඉන්නේ නැතුව, බෙදාහරින ලිපිනය නැතුව වුණත් එයට උත්තර දෙන්න පුළුවන්.",
        ),
      ],
    },
  ),

  "querying-the-database": step(
    "Database එකෙන් විමසීම",
    "Orders service #1 ඉඳන් PostgreSQL එකට request එකක් යනවා. Database එක දැල්වෙනවා, උත්තරය ආපහු එනවා.",
    {
      body: [
        p(
          "ඔබේ orders තියාගෙන ඉන්නේ database එකක: තොරතුරු ගොඩක් පිළිවෙලට තියාගන්න තැනක. Orders service එක එයගෙන් පැහැදිලි ප්‍රශ්නයක් අහනවා: “මේ කෙනාගේ open orders මට දෙන්න, අලුත්ම ඒවා මුලින්, උපරිම 20ක්.”",
        ),
        p("Database එක ඉක්මනට උත්තර දෙන්නේ එය ළඟ index එකක් තියෙන නිසා."),
      ],
      example: [
        p(
          "පිටිපස්සේ index එකක් තියෙන ලොකු පොතක් ගැන හිතන්න. ඩයිනොසෝරයන් ගැන තියෙන හැම පිටුවක්ම හොයන්න ඔබ මුළු පොතම කියවන්නේ නැහැ. Index එකේ “ඩයිනොසෝර” හොයලා කෙලින්ම 12, 47 සහ 103 පිටුවලට පනිනවා. Database එකේ index එකත් කරන්නේ ඒකමයි: එය කෙලින්ම ඔබේ open orders වෙතට පනිනවා.",
        ),
      ],
    },
    {
      body: [
        list(
          [
            "Index",
            "(user_id, status, created_at) මත තියෙන composite index එකක් filter එකටයි sort එකටයි දෙකටම සේවය කරනවා. ඒ නිසා query එක table එක මුළුමනින්ම scan කරනවා වෙනුවට rows ටිකක් විතරයි කියවන්නේ.",
          ],
          [
            "Connection pool",
            "PostgreSQL connection එකක් open කිරීම වියදම් අධිකයි (connection එකකට process එකක්), ඒ නිසා services pool එකකින් connections ආයෙ ආයෙත් පාවිච්චි කරනවා (in-process, නැත්නම් PgBouncer).",
          ],
          [
            "Parameters",
            "$1 කියන්නේ string concatenation එකක් නෙවෙයි, bound parameter එකක්. ඒකෙන් SQL injection වළක්වනවා, ඒ වගේම database එකට query plan එක ආයෙත් පාවිච්චි කරන්න ඉඩ දෙනවා.",
          ],
          [
            "Reads scale කිරීම",
            "විශාල read traffic read replicas වලට මාරු කරන්න පුළුවන්; ඒකේ අඩුපාඩුව තමයි data ටිකක් පරණ වෙන්න පුළුවන් වීම (eventual consistency).",
          ],
        ),
      ],
      example: [
        p(
          "Table එකේ orders මිලියන 5ක් තියෙද්දී, index එකෙන් ඇති වෙන වෙනස EXPLAIN එකෙන් පෙන්නනවා. Index එක දැනටමත් created_at අනුව sort කරලා තියෙන නිසා database එක sort පියවරත් මඟහරිනවා.",
        ),
        code("sql", "EXPLAIN: index එක නැතුව සහ ඇතුව", exampleCode.explain),
      ],
    },
  ),

  "building-the-response": step(
    "Response එක සකස් කිරීම",
    "Orders service #1 උත්තරය හදද්දී දැල්වෙනවා. කොළ පාට packet එකක් පේනවා: ඒ තමයි response එක. එය කියවන්න click කරන්න.",
    {
      body: [
        p(
          "දැන් Orders service එක ළඟ ඕන හැම දෙයක්ම තියෙනවා: database එකෙන් ආපු ඔබේ orders, සහ Users service එකෙන් ආපු ඔබේ නම. එය ඒ ඔක්කොම එකතු කරලා එක උත්තරයක් හදනවා. ඒකට කියන්නේ response එක කියලා.",
        ),
        p(
          "උත්තරය ලියලා තියෙන්නේ JSON වලින්. ඒක ඕනම program එකකට කියවන්න පුළුවන් විදිහට තොරතුරු ලියන සරල ක්‍රමයක්. උඩින්ම එය status code එකක් දානවා: 200 කියන්නේ “හරි, ඔබ ඉල්ලපු දේ මෙන්න” කියන එක.",
        ),
      ],
      example: [
        p(
          "Waiter කෙනෙක් ඔබේ කෑම ගෙනත් දෙනවා වගේ: කුස්සියේදී ඔක්කොම එක තැටියකට දානවා, waiter “මෙන්න” කියනවා (ඒ තමයි 200). කුස්සියේ මොකක් හරි ඉවර වෙලා තිබුණා නම්, waiter වෙනත් පණිවිඩයකින් ඒක ඔබට කියනවා.",
        ),
      ],
    },
    {
      body: [
        list(
          [
            "Status codes",
            "contract එකේ කොටසක්: 2xx සාර්ථකයි, 4xx client එක මොනවා හරි වෙනස් කරන්න ඕන, 5xx server එක අසාර්ථක වුණා.",
          ],
          ["Cache-Control: private, no-store", "පෞද්ගලික data shared caches වල ගබඩා කරන්න හොඳ නැහැ."],
          [
            "Pagination",
            "requests අතරතුර අලුත් orders එද්දී page numbers වලට වඩා cursor එකක් (nextCursor) විශ්වාසදායකයි.",
          ],
        ),
      ],
      example: [
        p(
          "Open orders 45ක් තිබුණා නම්, response එකේ අලුත්ම 20 සහ nextCursor එකක් තියෙනවා. ඊළඟ request එක ?cursor=… යවනවා, query එක OFFSET 20 වෙනුවට WHERE created_at < … එකෙන් දිගටම කරගෙන යනවා. ඒ නිසා අතරමැද order එකක් දැම්මත් pages මාරු වෙන්නේවත්, එකම order එක දෙපාරක් පේන්නේවත් නැහැ.",
        ),
      ],
    },
  ),

  // ----- Chapter 4: The return trip -------------------------------------------------------
  "response-flows-back": step(
    "Response එක ආපහු යනවා",
    "කොළ packet එක ආපහු ගමන් කරනවා: Orders ඉඳන් gateway එකට, ඊට පස්සේ internet එක හරහා browser එකට.",
    {
      body: [
        p(
          "Request එක ආපු පාරෙන්ම උත්තරය ආපහු යනවා: gateway එකට, ඊට පස්සේ internet එක හරහා ඔබේ browser එකට. ඔබේ browser එක ඔබේ open orders දෙක පෙන්නනවා.",
        ),
        p(
          "එළියට යන ගමනේදී gateway එක පොඩි වැඩ කිහිපයක් කරනවා: උත්තරය ඉක්මනට යන්න ඒක හකුළනවා, browser එකට ආරක්ෂක සටහන් එකතු කරනවා, request එක ගිය විදිහ ලියලා තියාගන්නවා.",
        ),
      ],
      example: [
        p(
          "කඩයක් ඔබට පාර්සලයක් එවද්දී, පෙට්ටිය පොඩි වෙන්න බඩු තදට අසුරනවා, ඒකට “බිඳෙනසුලුයි” ස්ටිකරයක් අලවනවා, ඔබ කතා කරලා ඒක කොහෙද කියලා ඇහුවොත් කියන්න පාර්සල් අංකය තමන්ගේ වාර්තාවල ලියලා තියාගන්නවා.",
        ),
      ],
    },
    {
      body: [
        p("Gateway එක response එකේ තේරුම වෙනස් කරන්නේ නැහැ, නමුත් බොහෝ විට එය:"),
        list(
          "compress කරනවා (Accept-Encoding අනුව Brotli හෝ gzip තෝරලා, Vary: Accept-Encoding එක්ක);",
          "CORS headers (Access-Control-Allow-Origin: https://shop.example) සහ security headers (Strict-Transport-Security, X-Content-Type-Options) එකතු කරනවා;",
          "access log line එකක්, latency සහ status metrics සටහන් කරලා trace span එක වහනවා.",
        ),
        p("Status codes වෙනස් නොවී යනවා, gateway එකම හදන errors හැර: 401, 429, 502, 503, 504."),
      ],
      example: [
        p(
          "Brotli වලින් 1.8 KB JSON body එක bytes 450ක් පමණ දක්වා අඩු කරනවා. පහළ තියෙන access log line එකේ, gateway, Orders සහ Users වල traces වල තියෙන request id එකම (9c1e…) තියෙනවා. ඒ නිසා එක search එකකින් හැම තැනම request එක හොයාගන්න පුළුවන්.",
        ),
        code("text", "Gateway එකේ access log line එක", exampleCode.accessLog),
      ],
    },
  ),

  "full-lifecycle": step(
    "සම්පූර්ණ ගමන",
    "මුළු ගමනම ආයෙත් ඉක්මනින් පෙන්නනවා: ගිහින් ආපහු, gateway එකේ හැම පහනක් හරහාම.",
    {
      body: [
        p(
          "ඒ තමයි මුල ඉඳන් අගට එක request එකක්. එය internet එක දෙපාරක් හරහා ගියා, ඉදිරි දොරටුවේදී පරීක්ෂාවන් පහක් පසු කළා, services දෙකකටයි database එකකටයි ගියා. ඒ ඔක්කොටම ගියේ තත්පරයකින් දහයෙන් පංගුවකටත් අඩු කාලයක්: ඇහිපිල්ලමක් ගහනවාටත් වඩා ඉක්මනින්.",
        ),
        p(
          "ඒ කාලයෙන් වැඩි හරියක් ගියේ internet එක හරහා ගමන් කරන්න. Gateway එකේ පරීක්ෂාවන්ට ගියේ තත්පරයකින් දහසෙන් පංගුවක් පමණයි. ඉදිරි දොරටුවක් තියාගන්න වටින්නේ ඒ නිසයි: ගොඩක් ආරක්ෂාවක්, ඉතාම පොඩි වියදමකට.",
        ),
      ],
      example: [
        p(
          "පොත් පිටිපස්සේ කාමරයක තියාගෙන ඉන්න පුස්තකාලයකින් පොතක් ඉල්ලනවා කියලා හිතන්න. ඔබ ඉල්ලුම් පත්‍රය කවුන්ටරයට දෙනවා, පුස්තකාලයාධිපති ඔබේ කාඩ් එක පරීක්ෂා කරනවා, සහායකයෙක් රාක්කවලින් පොත අරන් ඇවිත් ඔබට දෙනවා. වැඩිපුරම බලාගෙන ඉන්න වෙන්නේ ඇවිදින නිසා, පරීක්ෂා කරන නිසා නෙවෙයි.",
        ),
      ],
    },
    {
      body: [
        {
          type: "table",
          caption:
            "උදාහරණ latency: data centre එකේ ඉඳන් කි.මී. 1,000ක් පමණ ඈතින් ඉන්න user කෙනෙක්, warm connection එකක",
          columns: ["කොටස", "කාලය"],
          rows: [
            ["Browser → gateway (network, එක පැත්තකට)", "~15 ms"],
            ["Gateway: auth 0.2, rate limit 1, validate සහ route 0.2", "~1.5 ms"],
            ["Gateway → Orders (එකම data centre එක)", "~0.5 ms"],
            ["Orders logic, Users call එකත් ඇතුළුව", "~4 ms"],
            ["Database query (indexed)", "~3 ms"],
            ["Response: JSON, gateway එකට ආපහු, compression", "~2 ms"],
            ["Gateway → browser (network, එක පැත්තකට)", "~15 ms"],
          ],
          footer: ["එකතුව", "~41 ms"],
        },
        p(
          "මුළු කාලයෙන් හතරෙන් තුනක් පමණ යන්නේ network එකට. Gateway එකෙන් මිලි තත්පර කපනවාට වඩා connection reuse, CDNs සහ round trips අඩු කිරීම වැදගත් වෙන්නේ ඒ නිසයි. Tail latency (p99) තීරණය වෙන්නේ පාරේ තියෙන හෙමින්ම dependency එකෙන්; timeouts සහ retries (scenarios) වලින් හසුරුවන්නේ ඒකයි.",
        ),
      ],
      example: [
        p(
          "වෙනත් මහාද්වීපයක ඉන්න user කෙනෙකුගෙන් (එක පැත්තකට 150 ms පමණ) එන එකම request එකට 310 ms පමණ යනවා, නමුත් data centre එක ඇතුළේ වැඩට තවමත් යන්නේ 11 ms පමණයි. Gateway එක විතරක් user ට ළං කළාට වැඩි ප්‍රයෝජනයක් නැහැ, මොකද services තවමත් ඈතින්. Read-heavy APIs edge එකේදී responses cache කරන්නේ ඒ නිසයි.",
        ),
      ],
    },
  ),

  // ----- Scenario: 401 Unauthorized -------------------------------------------------------
  "401-expired-token": step(
    "කල් ඉකුත් වූ token එකක් එනවා",
    "Request එක gateway එකට ළඟා වෙනවා, Authentication පහන රතු වෙනවා. Badge එකේ 401 පෙන්නනවා.",
    {
      body: [
        p(
          "මේ පාර අවසර පත්‍රය පරණයි: විනාඩි කිහිපයකට කලින් එය කල් ඉකුත් වුණා. Gateway එක ඒක වහාම දැකලා request එක දොරටුවේදීම නවත්වනවා. කිසිම service එකකට කරදරයක් නැහැ.",
        ),
      ],
      example: [
        p(
          "මේක පහුගිය සතියේ ටිකට් පතක් අරගෙන කෞතුකාගාරයට ඇතුළු වෙන්න හදනවා වගේ. මුරකරු දොරටුවේදීම බැහැ කියනවා. ඔබ උත්සාහ කළා කියලාවත් ඇතුළේ කවුරුවත් දන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "exp අතීතයේ තියෙන නිසා signature check එක වැදගත් නැහැ. Gateway එක වහාම උත්තර දෙනවා; edge එකේදීම අසාර්ථක කිරීමෙන් services ආරක්ෂා වෙනවා, error handling එකම විදිහට තියෙනවා.",
        ),
      ],
      example: [
        p(
          "exp තිබුණේ 10:07:20, දැන් වෙලාව 10:11:20: token එක කල් ඉකුත් වෙලා විනාඩි 4යි. exp සහ nbf පරීක්ෂා කරද්දී gateways සාමාන්‍යයෙන් machines අතර පොඩි clock වෙනසකට (බොහෝ විට තත්පර 30 සිට 60 දක්වා) ඉඩ දෙනවා; විනාඩි 4 ඒකට වඩා ගොඩක් වැඩියි.",
        ),
      ],
    },
  ),

  "401-gateway-answers": step(
    "Gateway එක 401 කියලා උත්තර දෙනවා",
    "රතු packet එකක් browser එකට ආපහු යනවා. Gateway එකේ උත්තරය කියවන්න එය click කරන්න.",
    {
      body: [
        p(
          "Gateway එක කෙටි උත්තරයක් ආපහු යවනවා: 401. ඒකෙන් කියන්නේ “මට ඔබව ඇතුළට ගන්න බැහැ: ඔබේ අවසර පත්‍රය වලංගු නැහැ” කියන එක. ඇයි කියලත් එය කියනවා: අවසර පත්‍රය කල් ඉකුත් වෙලා.",
        ),
      ],
      example: [
        p(
          "කෞතුකාගාරයේ මුරකරු නිකන්ම “බැහැ” කියන්නේ නැහැ. එයා කියනවා “ඔබේ ටිකට් පත කල් ඉකුත් වෙලා, කරුණාකර අලුත් එකක් ගන්න” කියලා. දැන් ඔබට කරන්න ඕන දේ හරියටම තේරෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "401 කියන්නේ “authenticate වෙලා නැහැ” (credentials නැහැ, වලංගු නැහැ, නැත්නම් කල් ඉකුත් වෙලා). 403 නම් කියන්නේ “authenticate වෙලා, නමුත් අවසර නැහැ”. WWW-Authenticate header එකෙන් client එකට scheme එකයි වැරදුණේ මොකක්ද කියලත් කියනවා.",
        ),
      ],
      example: [
        p(
          "orders:read scope එක නැති වලංගු token එකකට ලැබෙන්නේ 403. එහෙම වෙලාවක client එක refresh කරලා retry කරන්න හොඳ නැහැ: අලුත් token එකටත් තියෙන්නේ ඒ අවසරම.",
        ),
        code("http", "403: authenticate වෙලා, නමුත් අවසර නැහැ", exampleCode.forbidden),
      ],
    },
  ),

  "401-refresh-and-retry": step(
    "Refresh කරලා ආයෙත් උත්සාහ කරනවා",
    "Browser එක නිශ්ශබ්දව identity provider එකෙන් අලුත් අවසර පත්‍රයක් ඉල්ලලා, ඒක අරගෙන, request එක ආයෙත් යවනවා. මේ පාර එය සාර්ථකව යනවා.",
    {
      body: [
        p(
          "App එක ළඟ වැඩි කාලයක් වලංගු තවත් අවසර පත්‍රයක් තියෙනවා. ඒකට කියන්නේ refresh token එක කියලා. ඒකෙන් identity provider එකෙන් අලුත් අවසර පත්‍රයක් අරගෙන, ආයෙත් අහනවා. මේ කිසිම දෙයක් ඔබට දැනෙන්නේවත් නැහැ.",
        ),
      ],
      example: [
        p(
          "ඔබ ළඟ කෞතුකාගාරයේ වාර්ෂික සාමාජික කාඩ් එකක් තියෙනවා කියලා හිතන්න. දවසේ ටිකට් පත ඉවර වුණාම, ඔබ ටිකට් කාර්යාලයේදී කාඩ් එක පෙන්නලා, තත්පරයකින් අලුත් ටිකට් පතක් අරගෙන, ආයෙත් ඇතුළට යනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Client එක identity provider එකේ token endpoint එකේදී තමන්ගේ refresh token එක පාවිච්චි කරනවා (OAuth 2.0 refresh token grant), ඊට පස්සේ එක පාරක් retry කරනවා. දෙවෙනි 401 එකකින් කියන්නේ session එක ඉවරයි කියලා: user ව sign in වෙන්න යවන්න.",
        ),
      ],
      example: [
        p(
          "Page එකක් එකවර requests 5ක් යවලා 5ටම 401 ලැබුණොත්, සරල client එකක් 5 පාරක් refresh කරනවා. හොඳ client එකක් එක refresh එකක් විතරක් කරලා, අනිත් requests ඒක එනකම් බලාගෙන ඉන්න තියලා, ඊට පස්සේ ඒ හැම එකක්ම එක පාරක් retry කරනවා. Refresh token rotation එකත් එක්ක identity provider එක හැම පාවිච්චියකදීම refresh token එක මාරු කරනවා, පරණ එකක් ආයෙ පාවිච්චි කළොත් ඒක සොරකමක ලකුණක් විදිහට සලකනවා.",
        ),
      ],
    },
  ),

  // ----- Scenario: 429 Too Many Requests --------------------------------------------------
  "429-burst": step(
    "එකවර requests ගොඩක්",
    "Browser එකෙන් packets පහක් එකින් එක වේගයෙන් යනවා. Badge එක “0 of 60 left” දක්වා අඩු වෙනවා.",
    {
      body: [
        p(
          "Bug එකක් නිසා app එක එකම request එක ආයෙ ආයෙත් ගොඩක් වේගයෙන් යවනවා. හැම එකකින්ම දීමනාවෙන් කොටසක් වැය වෙනවා, ඉක්මනින්ම කිසිවක් ඉතුරු වෙන්නේ නැහැ.",
        ),
      ],
      example: [
        p(
          "ආයෙත් කානිවල් එකට: කෙනෙක් තමන්ගේ tokens ඔක්කොම එක පාරටම වියදම් කරනවා. උදව්කරු තත්පරයකට එක token එකක් විතරයි දාන්නේ, ඒ නිසා ඒ කෙනාගේ කෝප්පය ඉක්මනින්ම හිස් වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Token bucket එක හිස්: refill rate r ට tokens ආපහු දාන්න පුළුවන් වේගයට වඩා වේගයෙන් burst එක capacity b ඉක්මවලා.",
        ),
      ],
      example: [
        p(
          "සාමාන්‍ය හේතුවක්: වැරදි dependency list එකක් තියෙන React effect එකක් හැම render එකකටම පස්සේ ආයෙත් run වෙලා, හැම පාරම fetch call කරනවා. එක තත්පරයක renders පහකින් tokens පහක් වැය වෙනවා, තත්පරයකට එකක refill එකකට ඒක අල්ලගන්න බැහැ.",
        ),
      ],
    },
  ),

  "429-too-many": step(
    "Gateway එක 429 කියලා උත්තර දෙනවා",
    "කිසිවක් ඉතුරු නැති වෙලාවේ තවත් request එකක් එනවා. Rate limit පහන රතු වෙනවා, badge එකේ 429 පෙන්නනවා, රතු packet එකක් ආපහු යනවා.",
    {
      body: [
        p(
          "දීමනාව ඉවර වුණු නිසා gateway එක 429 කියලා උත්තර දෙනවා. ඒකෙන් කියන්නේ “requests වැඩියි, කරුණාකර ටිකක් හෙමින්” කියන එක. ආයෙ උත්සාහ කරන්න ඕන කවදාද කියලත් එය කියනවා: තත්පර 20කින්. Services වලටයි database එකටයි මේ කලබලය දැනෙන්නේවත් නැහැ.",
        ),
      ],
      example: [
        p(
          "කානිවල් එකේ උදව්කරු කියනවා: “Tokens ඉවරයි. තත්පර 20කින් එන්න, එතකොට ඔබේ කෝප්පයේ ආයෙත් tokens ටිකක් තියෙයි.” අනිත් හැමෝටම සෙල්ලම් සාමාන්‍ය විදිහටම දිගටම යනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Reject කිරීම ලාභදායීයි (upstream call එකක් නැහැ), අරමුණත් ඒකයි: overload එක edge එකේදීම අවශෝෂණය වෙනවා. Retry-After එකෙන් client එකට බලාගෙන ඉන්න ඕන නිශ්චිත කාලය දෙනවා.",
        ),
      ],
      example: [
        p(
          "429 උත්තරයක් දෙන්න gateway එකට යන්නේ microseconds කිහිපයයි. Burst එක Orders වලට ගියා නම්, හැම request එකක්ම database connection එකක් අල්ලාගන්නවා; connections 20ක pool එකක් එක්ක requests සිය ගණනකින් අනිත් හැම user කෙනෙක්ම වැරදි client එක පිටිපස්සේ පෝලිමේ ඉන්න වෙනවා.",
        ),
      ],
    },
  ),

  "429-back-off": step(
    "ටිකක් ඉඳලා retry කරනවා",
    "Browser එකේ “waiting 20 s” පෙන්නනවා. ඊට පස්සේ එය එක request එකක් යවනවා, දීමනාව ආයෙත් පිරිලා කියලා badge එකෙන් පෙන්නනවා.",
    {
      body: [
        p(
          "හොඳින් හැසිරෙන app එකක් කියන දේ කරනවා: තත්පර 20ක් ඉඳලා, එක පාරක් උත්සාහ කරනවා. ඒ වෙනකොට දීමනාව ආයෙත් පිරිලා, request එක සාර්ථකව යනවා.",
        ),
      ],
      example: [
        p(
          "කානිවල් එකේදී ඔබේ වාරය එනකම් ඉන්නවා වගේ: ටිකක් ඉන්නකොට ඔබේ කෝප්පයේ ආයෙත් tokens තියෙනවා, ඔබට සෙල්ලම් කරන්න පුළුවන්.",
        ),
      ],
    },
    {
      body: [
        p(
          "Clients Retry-After වලට ගරු කරන්න ඕන, burst එක මූලාශ්‍රයේදීම deduplicate කරන්න ඕන (සැබෑ විසඳුම bug එක හදන එක). Loop එකක වහාම retry කිරීමෙන් වෙන්නේ bucket එක දිගටම හිස්ව තියාගන්න එක විතරයි.",
        ),
      ],
      example: [
        p(
          "TanStack Query වල retryDelay එකට error එකෙන් Retry-After කියවලා හරියටම ඒ කාලය බලාගෙන ඉන්න පුළුවන්; retry එකට අනිත් 4xx errors සම්පූර්ණයෙන්ම මඟහරින්න පුළුවන්, මොකද එකම වැරදි request එක ආයෙ යැව්වට ඒක හැදෙන්නේ නැහැ. Burst එක ඇති කරපු effect එක හදන එක තමයි තවමත් සැබෑ විසඳුම.",
        ),
      ],
    },
  ),

  // ----- Scenario: Timeout, then retry ----------------------------------------------------
  "timeout-slow-service": step(
    "Service එක හෙමින්",
    "Orders service #1 තැඹිලි පාට වෙනවා: එය හෙමින්. Gateway එක තත්පර 2කට පස්සේ අත්හරිනකම්, එය කොච්චර වෙලා බලාගෙන හිටියද කියලා gateway එකේ badge එකෙන් පෙන්නනවා.",
    {
      body: [
        p(
          "Orders service #1 හිරවෙලා, උත්තර දෙන්නේ නැහැ. Gateway එක සදහටම බලාගෙන ඉන්නේ නැහැ: තත්පර 2කට පස්සේ එය අත්හරිනවා.",
        ),
      ],
      example: [
        p(
          "ඔබ යාළුවෙකුගේ ගෙදර doorbell එක ගහනවා, කවුරුවත් එන්නේ නැහැ. ඔබ මුළු දවසම එතන හිටගෙන ඉන්නේ නැහැ: ටික වෙලාවකට පස්සේ ඔබ ගිහින් වෙන දෙයක් කරනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Gateway එකේ upstream timeout එකෙන් (මෙහි 2 s) client කෙනෙක් කොච්චර වෙලා බලාගෙන ඉන්නවද, gateway එක resources කොච්චර වෙලා අල්ලාගෙන ඉන්නවද කියලා සීමා කරනවා. Timeouts නැත්නම්, හෙමින් services නිසා upstream එකේ connection pools ඉවර වෙනවා, එක හෙමින් dependency එකක් outage එකක් බවට පත් වෙනවා.",
        ),
      ],
      example: [
        p(
          "Timeout එකක් නැත්නම්, හිරවෙච්ච හැම request එකක්ම gateway connection එකකුයි Orders worker කෙනෙකුයි අල්ලාගන්නවා. තත්පරයකට requests 200ක් එද්දී, තත්පර 30ක් හිරවෙන service එකක් එකවර requests 6,000ක් අල්ලාගන්නවා. ඒ තරම් ලොකු pools තියෙන්නේ ටිකයි, ඒ නිසා හොඳින් වැඩ කරන routes පවා අසාර්ථක වෙන්න පටන් ගන්නවා.",
        ),
      ],
    },
  ),

  "timeout-gateway-answers": step(
    "Gateway එක 504 කියලා උත්තර දෙනවා",
    "රතු packet එකක් browser එකට ආපහු යනවා, gateway එකේ badge එකේ 504 පෙන්නනවා.",
    {
      body: [
        p(
          "Gateway එක browser එකට 504 කියනවා. ඒකෙන් කියන්නේ “මගේ පිටිපස්සේ ඉන්න service එක වෙලාවට උත්තර දුන්නේ නැහැ” කියන එක. කැරකෙන රෝදයක් එක්ක ඔබව බලාගෙන ඉන්න තියනවාට වඩා ඒක ගොඩක් හොඳයි.",
        ),
      ],
      example: [
        p(
          "“සමාවෙන්න, ඔබට ඕන කෙනා උත්තර දෙන්නේ නැහැ, ටිකකින් ආයෙත් උත්සාහ කරන්න” කියන reception එකේ කෙනා, ඔබව lobby එකේ සදහටම බලාගෙන ඉන්න තියන කෙනාට වඩා ගොඩක් උදව් වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "504 කියන්නේ gateway එක upstream timeout එකක් වාර්තා කරන එක. (502 නම් upstream එක වලංගු නැති දෙයකින් උත්තර දුන්නා; 503 නම් කිසිම upstream එකකට request එක ගන්න බැරි වුණා.)",
        ),
      ],
      example: [
        p(
          "Gateway එකට තනියම retry කරන්න පුළුවන්ද? කාලය ඉතුරු තියෙන GET එකකට නම් ඔව්: එක පාරක්, වෙනත් instance එකක. මෙතනදී 2 s budget එක දැනටමත් ඉවරයි, ඒ නිසා එය 504 කියලා උත්තර දීලා තීරණය client එකට භාර දෙනවා.",
        ),
      ],
    },
  ),

  "timeout-retry-with-backoff": step(
    "Backoff එක්ක retry කරනවා",
    "Browser එක ටිකක් ඉඳලා (“retry in 1 s”) ආයෙත් අහනවා. මේ පාර gateway එක request එක Orders service #2 ට යවනවා, එය ඉක්මනින් උත්තර දෙනවා.",
    {
      body: [
        p(
          "App එක මොහොතක් ඉඳලා ආයෙත් අහනවා. මේ පාර gateway එක request එක Orders service එකේ අනිත් පිටපතට යවනවා; ඒක හොඳ තත්වයේ තියෙන නිසා ඉක්මනින් උත්තර දෙනවා.",
        ),
        p(
          "ආයෙත් අසාර්ථක වුණොත්, app එක හැම අලුත් උත්සාහයකටම කලින් ටිකක් වැඩිපුර ඉන්නවා: මුලින් තත්පර 1ක් පමණ, ඊට පස්සේ 2ක්, ඊට පස්සේ 4ක්. හැම පාරම වැඩිපුර ඉන්න එකට කියන්නේ backoff කියලා.",
        ),
      ],
      example: [
        p(
          "යාළුවෙක් phone එකට උත්තර නොදුන්නාම, ඔබ විනාඩියකට පස්සේ ආයෙත් කතා කරනවා, ඊට පස්සේ විනාඩි පහකට පස්සේ, ඊට පස්සේ පැයකට පස්සේ. ඔබ දිගටම සිය පාරක් කතා කරන්නේ නැහැ: ඒකෙන් වැඩක් නැහැ, ඒ වගේම ඒක කරදරයක්.",
        ),
      ],
    },
    {
      body: [
        p(
          "Retries වලට jitter එක්ක exponential backoff පාවිච්චි කරනවා (උදාහරණයක් විදිහට 0.5 s දක්වා, ඊට පස්සේ 1 s, ඊට පස්සේ 2 s, හැම එකක්ම අහඹු කරලා). එතකොට clients දහස් ගණනක් එකම මොහොතේ retry කරන්නේ නැහැ. Retry කරන්න ඕන safe හෝ idempotent requests විතරයි: GET එකක් කමක් නැහැ; order එකක් හදන POST එකකට idempotency key එකක් ඕන, නැත්නම් ඒක දෙපාරක් හැදෙන්න පුළුවන්.",
        ),
      ],
      example: [
        p(
          "“Full jitter” එක්ක, පළමු උත්සාහය 0 සහ 0.5 s අතර අහඹු කාලයක්, දෙවැන්න 0 සහ 1 s අතර, තුන්වැන්න 0 සහ 2 s අතර ඉන්නවා; ඊට පස්සේ client එක නවත්වලා error එකක් පෙන්නනවා. Order එකක් දාද්දී Idempotency-Key එකක් යවනවා. ඒ නිසා පළමු උත්සාහය ඇත්තටම සාර්ථක වුණා නම්, retry එක දෙවෙනි order එකක් හදන්නේ නැතුව ඒ order එකම ආපහු දෙනවා.",
        ),
        code("http", "Retry කරන්න ආරක්ෂිත POST එකක්", exampleCode.idempotentPost),
      ],
    },
  ),

  // ----- Scenario: 503, rerouted ----------------------------------------------------------
  "503-instance-down": step(
    "එක instance එකක් නතර වෙනවා",
    "Orders service #1 අඳුරු වෙනවා: එය crash වෙලා. Gateway එක පිටපත් දෙකම පරීක්ෂා කරද්දී ඒකෙන් එන ඉරි ස්පන්දනය වෙනවා.",
    {
      body: [
        p(
          "Orders service එකේ එක පිටපතක් crash වෙලා. Gateway එක ඒක දකිනවා, මොකද එය හැම පිටපතක්ම නිතිපතා පරීක්ෂා කරනවා: හරියට තත්පර කිහිපයකට සැරයක් “ඔයා හොඳින්ද?” කියලා අහනවා වගේ.",
        ),
      ],
      example: [
        p(
          "ගුරුවරයෙක් හැම උදේම පැමිණීමේ ලේඛනය කියවනවා. ළමයෙක් “මෙන්න” කියලා උත්තර නොදුන්නොත්, ඒ ළමයා අද ඇවිල්ලා නැහැ කියලා දැනගෙන ගුරුවරයා එදාට ඒ ළමයාට වැඩක් දෙන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Active health checks (අසාර්ථක /healthz එකක්) සහ passive outlier detection (පිළිවෙලින් එන 5xx responses) මගින් instance එක load-balancing pool එකෙන් ඉවත් කරනවා.",
        ),
      ],
      example: [
        p(
          "තත්පර 5කට සැරයක් /healthz call කරලා, අසාර්ථක වීම් 3ක් ඕන වෙන active check එකකට crash එකක් හඳුනාගන්න තත්පර 15ක් පමණ යනවා. Passive detection ඊට වඩා වේගවත්: පිළිවෙලින් errors 5කට පස්සේ instance එක වහාම තත්පර 30කට rotation එකෙන් ඉවත් කරලා, ඊට පස්සේ ආයෙත් උත්සාහ කරනවා.",
        ),
      ],
    },
  ),

  "503-routed-around": step(
    "වෙනත් පාරකින් යවනවා",
    "Routing පහන දැල්වෙලා request එක Orders service #2 ට යවනවා. උත්තරය සුපුරුදු විදිහටම browser එකට ආපහු එනවා.",
    {
      body: [
        p(
          "Gateway එක සරලවම request එක හොඳ තත්වයේ තියෙන පිටපතට යවනවා. ඔබට ඔබේ orders ලැබෙනවා, මොකක් හරි වැරදුණා කියලා ඔබ දැනගන්නේවත් නැහැ. Systems හැම service එකකම පිටපත් එකකට වඩා run කරන්නේ ඒ නිසයි.",
        ),
      ],
      example: [
        p(
          "Supermarket එකේ එක checkout එකක් වැහුවම, සේවකයෝ ඔබව ඊළඟට ඇරලා තියෙන checkout එකට යවනවා. ඔබට තවමත් ඔබේ බඩු වලට ගෙවන්න පුළුවන්, සමහර විට ටිකක් හෙමින්.",
        ),
      ],
    },
    {
      body: [
        p(
          "Redundancy ප්‍රයෝජනවත් වෙන්නේ router එක කවුද healthy කියලා දන්නවා නම් විතරයි. Gateway එකට අසාර්ථක උත්සාහයක් වෙනත් instance එකක එක පාරක් retry කරන්නත් පුළුවන්, retry budget එකක් ඇතුළත; එතකොට incident එකකදී retries නිසා load එක ගුණ වෙන්නේ නැහැ.",
        ),
      ],
      example: [
        p(
          "Instances දෙකෙන් එකක් නැති වුණාම ධාරිතාව බාගයකින් අඩු වෙනවා. හැම instance එකකටම තත්පරයකට requests 300ක් හසුරුවන්න පුළුවන් නම්, traffic උපරිමය 400ක් නම්, ඉතුරු වෙන instance එක overload වෙනවා. ධාරිතාව “N+1” විදිහට සැලසුම් කරන්නේ ඒ නිසයි: එකක් නැති වුණත් උපරිමයට ප්‍රමාණවත් instances.",
        ),
      ],
    },
  ),

  "503-all-down": step(
    "හැම instance එකක්ම නතර වුණොත්",
    "Orders service #2 ත් අඳුරු වෙනවා. Routing පහන රතු වෙනවා, badge එකේ 503 පෙන්නනවා, රතු packet එකක් ආපහු යනවා.",
    {
      body: [
        p(
          "දැන් පිටපත් දෙකම නතර වෙලා. Request එක යවන්න තැනක් නැති නිසා gateway එක අවංකවම, ඉක්මනින් උත්තර දෙනවා: 503. ඒකෙන් කියන්නේ “දැන් ලබාගන්න බැහැ, තත්පර 30කින් ආයෙත් උත්සාහ කරන්න” කියන එක.",
        ),
      ],
      example: [
        p(
          "හැම checkout එකක්ම වහලා නම්, දොරටුව ළඟ ඉන්න කෙනෙක් ඔබට කියනවා “සමාවෙන්න, විනාඩි කිහිපයකට අපි වහලා” කියලා. එතකොට ඔබ නිකරුණේ පෝලිමේ ඉන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "503 එකකින් ඉක්මනින් අසාර්ථක කිරීම (බොහෝ විට circuit breaker එකක් හරහා) service එකට යථා තත්වයට එන්න ඉඩ දෙනවා. Client එක timeout scenario එකේ වගේම back off කරන්න ඕන.",
        ),
      ],
      example: [
        p(
          "Orders route එකේ circuit breaker එකක් තත්පර 10ක් ඇතුළත requests වලින් බාගයක් අසාර්ථක වුණාම open වෙනවා. එය open ව තියෙද්දී gateway එක Orders call නොකර වහාම 503 උත්තර දෙනවා. තත්පර 30කට පස්සේ එය test requests කිහිපයකට යන්න ඉඩ දෙනවා (“half-open”), ඒවා සාර්ථක වුණාම ආයෙත් close වෙනවා.",
        ),
      ],
    },
  ),
};

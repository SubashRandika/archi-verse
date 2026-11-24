import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Backend for Frontend module, Sinhala step text. SERVER ONLY. Friendly spoken style;
 * technical terms stay in English (docs/CONVENTIONS.md → Writing module text).
 */
export const siSteps: Readonly<Record<string, StepCopy>> = {
  // ----- පරිච්ඡේදය 1: හැමෝටම එකම API එකක් ------------------------------------------------
  "one-api": step(
    "හැමෝටම එකම API එකක්",
    "Web browser එක Orders, Users සහ Recommendations වලට තනියම, එකකට පස්සේ එකක් call කරනවා. එහි badge එක calls ගණනයි කාලයයි ගණන් කරනවා: call 3 · 120 ms.",
    {
      body: [
        p(
          "එක order එකක් පෙන්නන්න web page එකට දේවල් තුනක් ඕනේ: order එක, ඒක කොහෙට යවන්නද කියන එක, ඔබ කැමති වෙන්න පුළුවන් වෙනත් දේවල් ගැන අදහස් ටිකක්. මේ හැම එකක්ම තියෙන්නේ වෙනම service එකක, ඒ නිසා page එක තුනෙන්ම එකින් එක අහනවා.",
        ),
        p("වේගවත් Wi-Fi එකක නම් ඒක ඉක්මනින් ඉවරයි."),
      ],
      example: [
        p(
          "රෑ කෑම හදන්න ඔබ මස් කඩේට යනවා, ඊට පස්සේ බේකරියට, ඊට පස්සේ එළවළු කඩේට. ඔක්කොම තියෙන්නේ ඔබේ පාරේම නම්, වැඩි වෙලාවක් යන්නේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "හැම service එකක්ම general-purpose REST API එකක් දෙනවා. ඒක හදලා තියෙන්නේ ඒ service එකේ data වටේ, කිසිම screen එකක් වටේ නෙවෙයි. ඒ නිසා client එක screen එක තනියම එකතු කරනවා: GET /orders/1042, ඊට පස්සේ GET /users/u_7f3a/address, ඊට පස්සේ GET /recommendations?for=1042.",
        ),
        p(
          "කලින් උත්තරයක් ඕනේ calls එකකට පස්සේ එකක් යන්නම ඕනේ: user id එක එන්නේ order එකත් එක්කමයි. (මේ module එකේ ඉලක්කම් උදාහරණ විතරයි, ඒත් ඇත්ත ලෝකයේ ප්‍රමාණයන්ට ගැළපෙනවා.)",
        ),
      ],
      example: [code("text", "Wi-Fi එකේ round trips තුනක්", exampleCode.wifi)],
    },
  ),

  "chatty-mobile": step(
    "කතා වැඩි mobile app එක",
    "Mobile app එකත් ඒ calls තුනම කරනවා. හැම round trip එකකටම ගොඩක් වැඩි වෙලාවක් යනවා: call 3 · 900 ms.",
    {
      body: [
        p(
          "Phone එකත් හරියටම ඒ දේම කරනවා, ඒත් එහි connection එක හෙමින්, ලොකු පිට්ටනියක් හරහා කෑ ගහනවා වගේ. හැම ප්‍රශ්නයක්ම යන්නත් ගොඩක් වෙලා යනවා, උත්තරය එන්නත් ගොඩක් වෙලා යනවා.",
        ),
        p("ප්‍රශ්න තුනක් කියන්නේ දිගු බලාපොරොත්තු තුනක්."),
      ],
      example: [
        p(
          "දැන් මස් කඩේ, බේකරිය, එළවළු කඩේ තියෙන්නේ වෙනස් ගම් තුනක. හැම ගමනකටම ගොඩක් වෙලා යනවා, ඔබට ගමන් තුනක් යන්න වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Mobile network එකක වැඩිපුරම බලපාන්නේ bandwidth නෙවෙයි, latency. හැම round trip එකකටම milliseconds සිය ගණනක් යනවා, අලුත් connection එකක එන requests වලට DNS, TCP, TLS වලටත් ගෙවන්න වෙනවා. එකකට පස්සේ එකක් යන calls N ගණනක් ඕනේ screen එකකට round trips N ගණනක් යනවා.",
        ),
        p("Battery එකත් වැය වෙනවා: හැම request එකකටම radio එක අවදියෙන් ඉන්නවා."),
      ],
      example: [code("text", "Mobile network එකේ ඒ calls තුනම", exampleCode.mobile)],
    },
  ),

  "too-much": step(
    "වැඩියි, මදියි",
    "Phone එකට ලොකු උත්තර තුනක් එනවා: KB 38ක් ලැබෙනවා, පාවිච්චි වෙන්නේ KB 4යි. ඊට පස්සේ උත්තරයේ නැති field එකක් නිසා web page එකට තවත් call එකක් කරන්න වෙනවා.",
    {
      body: [
        p(
          "Services හැමෝටම එකම ලොකු උත්තරය යවනවා. Phone එකට කවදාවත් පෙන්නන්නේ නැති photos සහ විස්තර ලැබෙනවා, ඒකෙන් වැඩි කොටස විසි කරන්න වෙනවා.",
        ),
        p("සමහර වෙලාවට web page එකට උත්තරයේ නැති දෙයක් ඕනේ වෙනවා, ඒ නිසා ආයෙත් අහන්න වෙනවා."),
      ],
      example: [
        p(
          "ඔබ ඇපල් ගෙඩියක් ඉල්ලනවා, ලැබෙන්නේ මුළු පෙට්ටියක්ම. ඔබේ යාළුවා ඇපල් සහ මිලත් ඉල්ලුවා, ඒත් පෙට්ටියේ මිල ලේබලයක් නැහැ, ඒ නිසා එයාට ආපහු යන්න වෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "General-purpose API එකක් හැමෝටම එකම හැඩයක් දෙනවා. ඒ නිසා සමහර clients over-fetch කරනවා (විසි කරන data: phone එකක නාස්ති වෙන bytes, parsing කාලය, memory), තවත් අය under-fetch කරනවා (නැති field එකකට තවත් call එකක් ඕනේ).",
        ),
        p(
          "එක client කෙනෙකුට fields එකතු කළාම හැමෝගෙම payload එක ලොකු වෙනවා; fields අයින් කළොත් කාගේ හරි දෙයක් කැඩෙනවා. අන්තිමට API එකේ design එක තීරණය වෙන්නේ වෙනස් අවශ්‍යතා තියෙන teams අතර සාකච්ඡාවලින්.",
        ),
      ],
      example: [code("text", "Phone එකට ලැබෙන දේ සහ එය පෙන්නන දේ", exampleCode.received)],
    },
  ),

  // ----- පරිච්ඡේදය 2: හැම front end එකකටම backend එකක් --------------------------------------
  "meet-bffs": step(
    "BFFs හඳුනාගනිමු",
    "Web BFF සහ Mobile BFF දැල්වෙනවා. මෙතැන් ඉඳන් browser එක කතා කරන්නේ Web BFF එකත් එක්ක විතරයි, phone එක Mobile BFF එකත් එක්ක විතරයි.",
    {
      body: [
        p(
          "දැන් හැම app එකකටම server එකේ තමන්ගේම උදව්කාරයෙක් ඉන්නවා. Web page එකට web උදව්කාරයෙක්, phone එකට phone උදව්කාරයෙක්.",
        ),
        p("හැම උදව්කාරයෙක්ම තමන්ගේ app එකට ඕනේ දේ හරියටම දන්නවා, ඒ වෙනුවෙන් දුවලා පැනලා වැඩ කරනවා."),
      ],
      example: [
        p(
          "කඩ තුනකට ඇවිදින්නේ නැතුව, ඔබ කැමති දේවල් දන්න personal shopper කෙනෙක් ඔබට ඉන්නවා. ඔබ එක පාරක් අහනවා, එයා ඔබට එක බෑග් එකක් ගෙනත් දෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Backend for Frontend එකක් කියන්නේ හරියටම එක user experience එකක් වෙනුවෙන් හදපු server-side component එකක්: web එකට එකක්, mobile app එකට එකක් (සමහර වෙලාවට platform එකකට එකක්, iOS සහ Android).",
        ),
        p(
          "එය ඉන්නේ API gateway එකට පිටිපස්සෙන්, services වලට ඉස්සරහින්. Gateway එක තවමත් හැමෝටම TLS, authentication සහ rate limits බලාගන්නවා; චිත්‍රය පොඩියට තියාගන්න ඒක පෙන්නන්නේ නැහැ. BFF එකක තමන්ගේම business rules නැහැ: එය එකතු කරනවා, ගළපනවා විතරයි.",
        ),
      ],
      example: [code("text", "Requests යන පාරවල්", exampleCode.paths)],
    },
  ),

  aggregation: step(
    "එක call එකක් ඇතුළට, calls තුනක් එළියට",
    "Phone එක එක request එකක් යවනවා. Mobile BFF එක Orders එකෙන් අහලා, ඊට පස්සේ Users සහ Recommendations දෙකෙන්ම එකවර අහනවා, උත්තර එකතු කරලා එක උත්තරයක් ආපහු යවනවා: call 1 · 380 ms.",
    {
      body: [
        p(
          "Phone එක තමන්ගේ උදව්කාරයාගෙන් අහන්නේ එක පාරයි. Services ළඟම ඉන්න උදව්කාරයා ඉක්මනට ඒවායින් අහලා, උත්තර එකතු කරලා එකක් ආපහු යවනවා.",
        ),
        p("Phone එකට බලන් ඉන්න වෙන්නේ හෙමින් ගමන් තුනක් වෙනුවට එකක් විතරයි."),
      ],
      example: [
        p(
          "ඔබේ personal shopper යාළුවෝ දෙන්නෙක්ව කඩ දෙකකට එකම වෙලාවේ යවනවා. ඔබට එක බෑග් එකක් ලැබෙනවා, ඒකත් ඉක්මනට.",
        ),
      ],
    },
    {
      body: [
        p(
          "BFF එක aggregate කරනවා: client request එකක් data centre එක ඇතුළේ service calls කිහිපයකට හරවනවා. එතන round trip එකකට යන්නේ 300 ms වෙනුවට 1 ms විතර.",
        ),
        p(
          "එකිනෙකට සම්බන්ධ නැති calls parallel යනවා, ඒ නිසා මුළු කාලය එකතුව නෙවෙයි, හෙමින්ම call එක විතර. කලින් උත්තරයක් ඕනේ calls තවමත් පිළිවෙළට යනවා: Users එකට order එකේ userId එක ඕනේ.",
        ),
      ],
      example: [code("text", "දැන් කාලය යන්නේ කොහෙටද", exampleCode.timing)],
    },
  ),

  shaped: step(
    "හැම screen එකකටම තමන්ගේම උත්තරයක්",
    "App දෙකම එකම වෙලාවේ අහනවා. Web එකට KB 38 උත්තරයක්, phone එකට KB 4 උත්තරයක් ලැබෙනවා. ඒ දෙක සසඳන්න ඕනෑම උත්තරයක් click කරන්න.",
    {
      body: [
        p(
          "උදව්කාරයෝ දෙන්නා වෙනස් බෑග් දෙකක් අසුරනවා. Web උදව්කාරයා ලොකු screen එකේ පෙන්නන හැමදේම අසුරනවා: photos සහ අදහස් දොළහක්. Phone උදව්කාරයා අසුරන්නේ පොඩි screen එකට ගැළපෙන දේ විතරයි: නම්, එකතුව සහ අදහස් තුනක්.",
        ),
        p("කාටවත් විසි කරන්න වෙන දේවල් ලැබෙන්නේ නැහැ."),
      ],
      example: [
        p(
          "එකම කඩේ එක පාරිභෝගිකයෙකුට ලොකු පවුලේ පෙට්ටියක් අසුරනවා, තව කෙනෙකුට පොඩි lunch box එකක්. එකම කඩේ, වෙනස් පෙට්ටි.",
        ),
      ],
    },
    {
      body: [
        p(
          "හැම BFF එකක්ම තමන්ගේ screen එකට response එක හැඩගස්වනවා: fields තෝරනවා, UI එකට ගැළපෙන්න නම් වෙනස් කරනවා, services කිහිපයකින් data එකතු කරනවා, පෙන්නන්න values (දින, මුදල්) format කරනවා, image sizes තෝරනවා.",
        ),
        p("Services වල APIs general විදිහටම තියෙනවා; වෙනස්කම් BFF එක භාර ගන්නවා."),
      ],
      example: [code("http", "Mobile උත්තරය", exampleCode.mobileAnswer)],
    },
  ),

  ownership: step(
    "Front-end team එකේ අයිතිය",
    "Browser එකයි Web BFF එකයි එකට දැල්වෙනවා, ඊට පස්සේ phone එකයි Mobile BFF එකයි: එක එක්කෙනාට එක team එකක්.",
    {
      body: [
        p(
          "Web page එක හදන අයම web උදව්කාරයාවත් හදනවා. ඔවුන් page එක වෙනස් කරනකොට, කාගෙන්වත් අහන්නේ නැතුව එදාම උදව්කාරයාවත් වෙනස් කරන්න පුළුවන්.",
        ),
        p("Phone team එකත් තමන්ගේ එක එහෙමම කරනවා."),
      ],
      example: [
        p(
          "හැම පවුලකටම තමන්ගේම shopper කෙනෙක් ඉන්නවා, එයා අහන්නේ ඒ පවුලට විතරයි. ඔබේ බෑග් එකට අලුත් දෙයක් ඕනේ නම් ඔබ ඔබේ shopper ට කියනවා, වෙන කාගෙවත් එකඟතාවයක් ඕනේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "BFF එකක අයිතිය තියෙන්නේ front end එකේ අයිතිය තියෙන team එකටමයි. ඒ නිසා screen එකයි එහි API එකයි එකට වෙනස් වෙලා එකට ship වෙනවා, වෙනත් clients ගේ teams එක්ක සාකච්ඡා කරන්නේ නැතුව. මේ තමයි හිතාමතාම පාවිච්චි කරන Conway’s law.",
        ),
        p(
          "Tokens browser එකෙන් එළියේ තියාගන්න හොඳම තැනත් web BFF එකක් (token handler pattern): BFF එක OAuth tokens server එකේ තියාගෙන browser එකට දෙන්නේ HttpOnly, Secure, SameSite session cookie එකක් විතරයි. ඒ නිසා page එකට රිංගපු script එකකට (XSS) ඒවා හොරකම් කරන්න බැහැ.",
        ),
      ],
      example: [code("text", "BFF එකක් එක්ක සහ නැතුව browser එකේ තියෙන දේ", exampleCode.tokens)],
    },
  ),

  // ----- පරිච්ඡේදය 3: Trade-offs ---------------------------------------------------------
  costs: step(
    "වියදම්, සහ වෙනත් විකල්ප",
    "BFFs දෙකම Orders එකට එකම call එක කරනවා: එකම rule එක දෙපාරක් ලියලා. ඊට පස්සේ මුළු චිත්‍රයම: හැම app එකක්ම තමන්ගේම BFF එක හරහා.",
    {
      body: [
        p(
          "උදව්කාරයෝ දෙන්නෙක් කියන්නේ බලාගන්න දේවල් දෙකක්. සමහර වෙලාවට දෙන්නාම එකම උපක්‍රමය ඉගෙන ගන්නවා; පස්සේ එක්කෙනෙක් ඒක වෙනස් කරනවා, අනිත් එක්කෙනා කරන්නේ නැහැ. එතකොට app දෙක පොඩ්ඩක් වෙනස් විදිහට වැඩ කරනවා.",
        ),
        p("App වලට ඇත්තටම වෙනස් දේවල් ඕනේ නම් BFFs හොඳයි. එහෙම නැත්නම්, පොදු උදව්කාරයෙක් එක්කෙනෙක් ලේසියි."),
      ],
      example: [
        p(
          "Personal shoppers දෙන්නෙක් ඉන්න එක හොඳයි, ඒත් ඔබ දෙන්නෙකුට ගෙවනවා, දෙන්නාටම ඔබ කැමති පාන් වර්ගය වෙනස් විදිහට මතක තියෙන්නත් පුළුවන්.",
        ),
      ],
    },
    {
      body: [
        p(
          "වියදම්: front end එකකට තවත් deployable එකක් (hosting, monitoring, on-call), BFFs අතර copy වෙලා ටිකෙන් ටික වෙනස් වෙන logic (ඇත්ත business rules services වලට ගෙනියන්න), සහ data centre එක ඇතුළේ තවත් hop එකක්.",
        ),
        list(
          [
            "API gateway",
            "හැම client කෙනෙකුටම පොදු දේවල් (TLS, authentication, rate limits). එය BFFs වලට ඉස්සරහින් ඉන්නවා, screen එකකට විශේෂ logic එහි වැඩෙන්න දෙන්න හොඳ නැහැ.",
          ],
          [
            "GraphQL",
            "හැම client කෙනෙක්ම තමන්ට ඕනේ fields විතරක් ඉල්ලන නම්‍යශීලී endpoint එකක්. Client කෙනෙකුට BFF එකක් නැතුවම over-fetching සහ under-fetching විසඳනවා, ඒත් schema එකක් සහ resolver layer එකක් ඕනේ (බොහෝ විට services උඩින් federate කරලා).",
          ],
          [
            "BFF එකක් වටින්නේ කවදාද",
            "front ends ගොඩක් වෙනස් නම් (web, mobile, TV), ඒවා හදන්නේ වෙනස් teams නම්.",
          ],
        ),
      ],
      example: [
        p(
          "SoundCloud තමන්ගේ monolith එක කඩද්දී BFFs පාවිච්චි කළා (Phil Calçado ඒ ගැන ලිව්වා), Sam Newman මේ pattern එක ගැන ලිව්වා. Netflix තමන්ගේ API platform එකේ device වර්ගයකට එකක් බැගින් device-specific adapter scripts දිව්වා.",
        ),
      ],
    },
  ),

  // ----- Scenario: එක service එකක් හෙමින් ---------------------------------------------------
  "recommendations-slow": step(
    "Recommendations හෙමින් වෙනවා",
    "Recommendations amber වෙනවා. Orders සහ Users Mobile BFF එකට උත්තර දෙනවා, Recommendations දෙන්නේ නැහැ, BFF එකේ badge එක එහි time budget එක ගණන් කරනවා.",
    {
      body: [
        p(
          "අද කඩ තුනෙන් එකක් ගොඩක් හෙමින්. උදව්කාරයා ළඟ දේවල් තුනෙන් දෙකක් දැනටමත් තියෙනවා, තුන්වෙනි එකට පොඩ්ඩක් බලන් ඉන්නවා.",
        ),
      ],
      example: [p("ඔබේ shopper ළඟ මස් සහ පාන් තියෙනවා, ඒත් එළවළු කඩේ දිගු පෝළිමක්. එයා ඔරලෝසුව බලනවා.")],
    },
    {
      body: [
        p(
          "Fan-out එකක response time එක තීරණය කරන්නේ හෙමින්ම dependency එක. ඒ නිසා හැම downstream call එකකටම, request එකේ මුළු time budget එක ඇතුළේ, තමන්ගේම timeout එකක් දෙනවා.",
        ),
        p("අනිවාර්ය data (order එක) සහ අමතර data (suggestions) වලට වෙනස් budgets තියෙන්න පුළුවන්."),
      ],
      example: [code("text", "මේ screen එකට BFF එකේ budgets", exampleCode.budget)],
    },
  ),

  "partial-answer": step(
    "තියෙන දෙයින් උත්තර දෙන්න",
    "Budget එක ඉවර වෙනවා. Mobile BFF එක suggestions නැතුව phone එකට උත්තර දෙනවා; Recommendations ගේ පරක්කු උත්තරය අතහැරෙනවා.",
    {
      body: [
        p(
          "උදව්කාරයා ඔබව හැමදාම බලන් ඉන්න තියන්නේ නැහැ. ඔබට order එකයි address එකයි දැන්ම ලැබෙනවා, අදහස් නැතුව විතරයි.",
        ),
        p("Screen එකේ ඒ කොටස හිස්ව තියෙනවා."),
      ],
      example: [
        p(
          "ඔබේ shopper මස් සහ පාන් අරගෙන ගෙදර එනවා, කියනවා: “අද එළවළු නැහැ, පෝළිම දිග වැඩියි.” රෑ කෑම තවමත් තියෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "BFF එක අමතර data වෙනුවෙන් partial response එකක් දෙනවා (suggestions තිබුණොත් හොඳයි; order එක එහෙම නෙවෙයි), නැති දේ සලකුණු කරලා, UI එකට ඒ කොටස හංගන්න දෙනවා. අනිවාර්ය data fail වුණොත් ඒක තවමත් error එකක්.",
        ),
        p(
          "හැම call එකක් වටේම circuit breaker එකක් (කලින් module එක) down වෙලා තියෙන service එකක් බලන් ඉන්න එකෙන් BFF එක නවත්තනවා.",
        ),
      ],
      example: [code("http", "අර්ධ උත්තරය", exampleCode.partial)],
    },
  ),

  // ----- Scenario: Web එකට විතරක් වෙනසක් ----------------------------------------------------
  "new-field": step(
    "Web එකට අලුත් field එකක් ඕනේ",
    "Web BFF එක ආයෙත් deploy වෙලා v2.5 වෙනවා. Mobile BFF එකයි services ටිකයි තිබුණු විදිහටම තියෙනවා.",
    {
      body: [
        p(
          "Web team එකට “බ්‍රහස්පතින්දා එනවා” කියලා පෙන්නන්න ඕනේ. ඔවුන් තමන්ගේ උදව්කාරයාට delivery දිනය අහන්න උගන්නනවා.",
        ),
        p("වෙන කාටවත් මුකුත් වෙනස් කරන්න ඕනේ නැහැ."),
      ],
      example: [
        p(
          "ඔබ ඔබේම shopper ට කියනවා: “මෙතැන් ඉඳන් පාන් අලුත්ද කියලා බලන්න.” අනිත් පවුලේ shopper ට ඒක දැනගන්න ඕනේ නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "Web team එක Orders දැනටමත් දෙන field එකක් පාවිච්චි කරලා තමන්ගේ BFF එකට estimatedDelivery එකතු කරනවා. Services වල APIs වෙනස් කරන්නේ නැහැ, mobile team එක්ක සම්බන්ධීකරණයක් නැහැ, පොදු API එකක අලුත් version එකකුත් නැහැ.",
        ),
      ],
      example: [code("text", "මුළු වෙනස, Web BFF එකේ", exampleCode.webChange)],
    },
  ),

  "web-sees-it": step(
    "ඒක දකින්නේ web එක විතරයි",
    "Browser එක ආයෙත් අහනවා, දැන් එහි උත්තරයේ order එක එන දවස තියෙනවා. Phone එක අහලා සුපුරුදු උත්තරයම ගන්නවා.",
    {
      body: [p("Web page එක delivery දවස පෙන්නනවා. Phone app එක කලින් වගේම වැඩ කරනවා.")],
      example: [p("එක පවුලකට දැන් බෑග් එකේ අලුත් පාන් ගැන සටහනක් ලැබෙනවා. අනිත් පවුලේ බෑග් එක හැමදාම වගේමයි.")],
    },
    {
      body: [
        p(
          "හැම client කෙනෙකුගේම contract එක තමන්ගේම කාලසටහනට වෙනස් වෙනවා. Mobile app එක ship වෙන්නේ app stores හරහා, පරණ versions මාස ගණන් පාවිච්චි වෙනවා; ඒකට කිසි බලපෑමක් නැහැ.",
        ),
        p(
          "App එකටත් ඒ field එක ඕනේ වුණාම, Mobile BFF එක ඒක එකතු කරනවා, පරණ app versions වලටත් දිගටම සේවය කරනවා.",
        ),
      ],
      example: [code("text", "හැම client කෙනෙකුගේම contract එක", exampleCode.contracts)],
    },
  ),
};

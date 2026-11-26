import { code, list, p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";
import { exampleCode } from "./shared";

/**
 * Idempotency module, Sinhala step text. SERVER ONLY. Friendly spoken style; technical terms stay
 * in English (docs/CONVENTIONS.md → Writing module text).
 */
export const siSteps: Readonly<Record<string, StepCopy>> = {
  // ----- පරිච්ඡේදය 1: ආයෙත් කළාට කමක් නැද්ද? -----------------------------------------------
  "same-twice": step(
    "එකම request එක, දෙපාරක්",
    "Shopper A delivery address එක දෙපාරක් දානවා: order එකට තියෙන්නේ තවමත් එක address එකයි. ඊට පස්සේ Shopper A key එකක් නැතුව දෙපාරක් ගෙවනවා: Payments DB එකේ charges දෙකක් පේනවා.",
    {
      body: [
        p(
          "සමහර දේවල් දෙපාරක් කළාට කමක් නැහැ. “මගේ address එක 12 Lake Road” කියලා දෙපාරක් කිව්වත්, කඩේට තියෙන්නේ එක address එකයි: 12 Lake Road.",
        ),
        p(
          "ඒත් “රුපියල් 12,400ක් ගන්න” කියලා දෙපාරක් කිව්වොත්, කඩේ සල්ලි දෙපාරක් ගන්නවා. මේ module එක ඒ දෙවෙනි වර්ගයත් ආරක්ෂිත කරන හැටි ගැන.",
        ),
      ],
      example: [
        p(
          "Lift button එක ආයෙත් එබුවාට lifts දෙකක් එන්නේ නැහැ. ඒත් vending machine එකට දෙපාරක් සල්ලි දැම්මොත් drinks දෙකක් එනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Operation එකක් ගොඩක් පාරවල් කළාම server එකට වෙන effect එක එක පාරක් කළා වගේම නම් ඒක idempotent. RFC 9110 GET, HEAD, OPTIONS, TRACE, PUT සහ DELETE idempotent කියලා define කරනවා: PUT resource එකක් එකම body එකෙන් replace කරනවා, DELETE ඒක එක පාරයි මකන්නේ. POST සහ PATCH එහෙම නෙවෙයි: හැම POST /payments එකක්ම අලුත් ගෙවීමක් හදනවා.",
        ),
        p(
          "Idempotent කියන්නේ effect එක ගැන, උත්තරය ගැන නෙවෙයි: දෙවෙනි DELETE එකක් 404 දෙන්න පුළුවන්, දෙවෙනි PUT එකක් 201 වෙනුවට 200 දෙන්න පුළුවන්, ඒත් දෙකම තවමත් idempotent. Method එකේ නමෙන් කියන්නේ බලාපොරොත්තු වෙන දේ විතරයි; පොරොන්දුව රකින්න ඕනේ server එක.",
        ),
      ],
      example: [code("text", "එකම request එක, දෙපාරක්", exampleCode.putVsPost)],
    },
  ),

  duplicates: step(
    "Duplicates එන්නේ කොහෙන්ද",
    "Double click එකකින් ගෙවීම් දෙකක් යනවා, උත්තර දෙකම නැති වෙනවා. Retry එක හෙමින් යන නිසා app එක time out වෙලා ආයෙත් retry කරනවා. Requests හතරයි, charges හතරයි, order එකයි.",
    {
      body: [
        p(
          "App එකට ඕනේ වුණේ හතර පාරක් ගෙවන්න නෙවෙයි. ඇඟිල්ල දෙපාරක් tap වුණා. ඊට පස්සේ “ඉවරයි!” පණිවිඩ නැති වුණා, ඒ නිසා app එක ආයෙත් ඇහුවා. ඊට පස්සේ උදව්කාරයා හෙමින් හිටියා, ඒ නිසා උත්තරේ එන්න කලින් app එක ආයෙත් ඇහුවා.",
        ),
        p("හැම පාරම උදව්කාරයා හිතුවේ ඒක අලුත් ගෙවීමක් කියලා."),
      ],
      example: [
        p(
          "ඔබ ලියුමක් post කරනවා, උත්තරයක් එන්නේ නැහැ, ආයෙත් post කරනවා. දැන් කඩේට ලියුම් දෙකක්, ඒවා එකම ලියුම කියලා දැනගන්න විදිහක් නැහැ.",
        ),
      ],
    },
    {
      body: [
        p(
          "කවුරු හරි retry කරනවා නම් delivery එක at least once: “request එක නැති වුණා”, “උත්තරය නැති වුණා”, “server එක හෙමින්” කියන ඒවා වෙන් කරලා අඳුනගන්න client ට බැහැ. Duplicates එන්නේ double submits, timeouts හෝ resets වලින් පස්සේ client retries, proxies සහ load balancers retry කිරීම, network එක මාරු වුණාම mobile apps ආයෙත් යැවීම, message queues ආයෙත් deliver කිරීම වගේ දේවල් වලින්.",
        ),
        p(
          "විශ්වාස කරන්න බැරි network එකක exactly-once delivery බැහැ; ලබන කෙනා repeats අඳුනගන්නවා නම් exactly-once effect එකක් පුළුවන්. Click එකකට පස්සේ button එක disable කරන එකෙන් හැදෙන්නේ එක මූලාශ්‍රයක් විතරයි. විසඳුම තියෙන්න ඕනේ server එකේ, මොකද හැම attempt එකක්ම දකින්නේ ඒකට විතරයි.",
        ),
      ],
      example: [code("text", "Server එකට පේන දේ", exampleCode.serverLog)],
    },
  ),

  // ----- පරිච්ඡේදය 2: Idempotency keys ------------------------------------------------------
  "one-key": step(
    "ගෙවීමකට එක key එකයි",
    "Shopper A key එකක් හදලා save කරනවා, ඊට පස්සේ ඒකෙන් ගෙවනවා. උත්තරය නැති වෙනවා, ඒ නිසා Shopper A එකම key එකෙන් retry කරනවා.",
    {
      body: [
        p(
          "ගෙවන්න කලින් app එක ගෙවීමේ රහස් number එකක් ලියනවා, ticket number එකක් වගේ: 7f3a. ඒ number එක පරිස්සමෙන් තියාගන්නවා.",
        ),
        p("ආයෙත් අහන්න වුණොත් එකම number එක පාවිච්චි කරනවා. අලුත් shopping එකකට අලුත් number එකක්."),
      ],
      example: [
        p(
          "Cloakroom ticket එකක්: ඔබේ coat එකට එක ticket එකක් ලැබෙනවා, ඒ coat එක ගැන අහන හැම පාරම එකම ticket එක පෙන්නනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Client key එක හදන්නේ attempt එකකට නෙවෙයි, operation එකකට එක පාරයි. crypto.randomUUID() එකෙන් එන random UUID v4 එකක් ඇති, ඒක අනුමාන කරන්න බැරි වෙන්න ඕනේ. Key එක operation එකත් එක්ක තියාගන්නවා (component state, form library එකක submit state, නැත්නම් reload එකකින් නැති නොවෙන්න sessionStorage) සහ IETF draft එකේ කියන විදිහට හැම attempt එකකම Idempotency-Key header එකේ යවනවා.",
        ),
        p(
          "Operation එක වෙනස් වුණොත් (වෙනස් මුදලක් හෝ cart එකක්) හෝ ඉවර වුණාට පස්සේ අලුත් key එකක් හදනවා. අලුත් ගෙවීමකට key එකක් ආයෙත් පාවිච්චි කළොත් server එක පරණ එක replay කරනවා (පියවර 7).",
        ),
      ],
      example: [code("text", "Client පැත්ත (TypeScript)", exampleCode.clientKey)],
    },
  ),

  "write-first": step(
    "Server එක මුලින්ම ලියාගන්නවා",
    "Payments key එක “in progress” විදිහට save කරනවා, Card processor හරහා card එක charge කරනවා, ඊට පස්සේ ගෙවීමයි උත්තරයයි key එකත් එක්ක save කරලා “ගෙව්වා” කියලා උත්තර දෙනවා.",
    {
      body: [
        p(
          "උදව්කාරයා මුලින්ම ticket number එක notebook එකේ ලියනවා: “7f3a: වැඩ කරනවා”. ඊට පස්සේ සල්ලි ගන්නවා.",
        ),
        p(
          "ඊට පස්සේ number එක ළඟින් උත්තරය ලියනවා: “7f3a: ඉවරයි, ගෙව්වා”. දැන් කවුරු හරි ආයෙත් ඇහුවොත් මේ ගෙවීම එයාට මතකයි.",
        ),
      ],
      example: [
        p("Cloakroom attendant කෙනෙක් ඔබේ coat එක අරන් යන්න කලින් ticket number එක hanger එකේ ලියනවා."),
      ],
    },
    {
      body: [
        p(
          "Server එක keys table එකක් තියාගන්නවා: key එක, request එකේ fingerprint එකක්, state එක (in progress හෝ done), save කරපු response එක, expiry වෙලාවක්. පළවෙනි request එක:",
        ),
        list(
          [
            "Key එක in progress විදිහට insert කරනවා",
            "key එකට unique constraint එකක් එක්ක; insert එක අසාර්ථක නම්, ඒක වෙන request එකකට අයිතියි (පියවර 5–6).",
          ],
          ["වැඩේ කරනවා", "card එක charge කරලා ගෙවීම හදනවා."],
          [
            "උත්තරය key එකත් එක්ක save කරනවා",
            "සහ done කියලා සලකුණු කරනවා, ගෙවීම් row එකේම transaction එකේ.",
          ],
        ),
        p(
          "Card processor ට යන call එක ඒ transaction එක ඇතුළේ තියෙන්න බැහැ. “අතරමගදී crash එකක්” scenario එකයි පියවර 8 යි ඒ හිඩැස ගැන කතා කරනවා.",
        ),
      ],
      example: [code("text", "පස්සේ key row එක", exampleCode.keyRow)],
    },
  ),

  replay: step(
    "Repeat එකකට save කරපු උත්තරය",
    "උත්තරය ආයෙත් නැති වෙනවා. Shopper A එකම key එකෙන් retry කරනවා; Payments ඒක “done” කියලා හොයාගෙන save කරපු උත්තරය ආපහු යවනවා. Card processor ට call කරන්නේ නැහැ.",
    {
      body: [
        p(
          "App එකට උත්තරයක් ආවේ නැහැ, ඒ නිසා ticket 7f3a එක්ක ආයෙත් අහනවා. උදව්කාරයා notebook එක බලනවා: “7f3a: ඉවරයි, ගෙව්වා”.",
        ),
        p("ඉතින් එයා ආයෙත් “ගෙව්වා!” කියනවා විතරයි. ආයෙත් සල්ලි ගන්නේ නැහැ."),
      ],
      example: [p("ඔබ cloakroom ticket එක දෙපාරක් පෙන්නුවත්, ලැබෙන්නේ එක coat එකයි.")],
    },
    {
      body: [
        p(
          "Done key එකක් එක්ක එන repeat එකකට stored response එක ලැබෙනවා: පළවෙනි පාර වගේම status code එකයි body එකයි, ඒ නිසා replay එකයි original එකයි වෙන් කරලා අඳුනගන්න client ට බැහැ. Clients ටයි logs වලටයි අඳුනගන්න Stripe Idempotent-Replayed: true එකතු කරනවා. මුකුත් ආයෙත් run වෙන්නේ නැහැ, downstream කිසිම දෙයකට call කරන්නේ නැහැ.",
        ),
        p(
          "Save කරන්නේ මොන results ද කියන එක තේරීමක්. Operation එක පටන් ගත්තාට පස්සේ ඕනෙම result එකක් Stripe save කරනවා, 500 එකක් වුණත්, ඒ නිසා retry එකකට ලැබෙන්නේ නොදන්නා effects තියෙන දෙවෙනි attempt එකක් නෙවෙයි, එකම failure එක. මොනවත් වෙනස් වෙන්න කලින් වෙන validation errors save කරන්නේ නැහැ.",
        ),
      ],
      example: [code("http", "Replay එක", exampleCode.replay)],
    },
  ),

  // ----- පරිච්ඡේදය 3: අමාරු අවස්ථා ------------------------------------------------------------
  "two-at-once": step(
    "දෙකක් එකපාර",
    "Double tap එකකින් එක key එකක් එක්ක requests දෙකක් යනවා. පළවෙනි එක වැඩේ කරනවා; දෙවෙනි එක key එක in progress කියලා දැකලා 409 ගන්නවා. ඒකේ retry එකට save කරපු උත්තරය ලැබෙනවා. එක charge එකයි.",
    {
      body: [
        p("Taps දෙකක්, එකම ticket එක, ලඟින් ලඟ. දෙවෙනි එක එනකොට උදව්කාරයා දැනටමත් 7f3a එකේ වැඩ කරනවා."),
        p("එයා කියනවා “මම තවම ඒක කරනවා, ටිකකින් ආයෙත් අහන්න”. App එක ආයෙත් අහනකොට උත්තරය ලෑස්තියි: “ගෙව්වා”."),
      ],
      example: [
        p(
          "Attendant ඔබේ coat එක අරන් එන ගමන් ඉන්නකොට ඔබ coat එක ඉල්ලනවා. එයා කියන්නේ “පොඩ්ඩක් ඉන්න” කියලා, “මෙන්න තව coat එකක්” කියලා නෙවෙයි.",
        ),
      ],
    },
    {
      body: [
        p(
          "එක key එකක් එක්ක requests දෙකක් එකට එන්න පුළුවන්, double submit එකකින් හෝ පළවෙනි attempt එක ඉවර වෙන්න කලින් client retry කරන නිසා. පරිස්සම් නොවුණොත් දෙකටම පේන්නේ “තවම key එකක් නැහැ” කියලා, දෙකම charge කරනවා. Key එකේ unique constraint එක නිසා දෙවෙනි insert එක අසාර්ථක වෙනවා, server එක 409 Conflict කියලා උත්තර දෙනවා (IETF draft එකේ තේරීම, Stripe ගෙත්). Retry module එකේ වගේ client backoff එක්ක retry කරනවා.",
        ),
        p(
          "විකල්පය තමයි දෙවෙනි request එක පළවෙනි එක ඉවර වෙනකම් ඉන්න තියලා ඒකේ උත්තරය replay කරන එක. ඒක යාළුයි, ඒත් connection එකක් අල්ලගෙන ඉන්නවා, timeout එකකුත් ඕනේ; 409 නිසා server එක සරලයි.",
        ),
      ],
      example: [code("http", "දෙවෙනි request එකේ උත්තරය", exampleCode.conflict)],
    },
  ),

  "different-body": step(
    "එකම key එක, වෙනස් request එකක්",
    "Cart එක වෙනස් වුණා, ඒත් app එක පරණ key එක තියාගත්තා, ඒ නිසා key 7f3a අලුත් මුදලක් එක්ක යවනවා. Request එක key එකට ගැලපෙන්නේ නැහැ කියලා Payments දැකලා 422 එකකින් ප්‍රතික්ෂේප කරනවා. කිසිම charge එකක් නැහැ.",
    {
      body: [
        p("App එක ticket 7f3a ආයෙත් පාවිච්චි කළා, ඒත් මේ පාර වෙනස්, ලොකු ගෙවීමකට: රුපියල් 13,900යි."),
        p(
          "Ticket 7f3a රුපියල් 12,400ට කියලා notebook එකේ තියෙනවා කියලා උදව්කාරයා දකිනවා. ඉතින් එයා ප්‍රතික්ෂේප කරනවා: “ඒ ticket එක වෙන දෙයකට”.",
        ),
      ],
      example: [p("ඔබ නිල් coat එකක ticket එකක් දීලා රතු coat එකක් ඉල්ලනවා.")],
    },
    {
      body: [
        p(
          "Server එක හැම key එකකම request එකේ fingerprint එකක් (method, path, body වල hash එකක්) save කරලා හැම repeat එකකදීම සසඳනවා. පාවිච්චි කරපු key එකක් එක්ක වෙනස් request එකක් කියන්නේ client bug එකක්; IETF draft එක 422 Unprocessable Content කියලා උත්තර දෙනවා. ඒ check එක නැත්නම් server එක පරණ ගෙවීමේ උත්තරය replay කරනවා, අලුත් මුදල ගෙව්වා කියලා shopper හිතනවා.",
        ),
        p(
          "Client පැත්තේ මේක පියවර 3 නීතිය: අලුත් operation එකකට අලුත් key එකක් ඕනේ. Key එක order number එකට විතරක් නෙවෙයි, ගෙවන දේට (cart එකට සහ මුදලට) ගැට ගහන්න.",
        ),
      ],
      example: [code("http", "ප්‍රතික්ෂේප කිරීම", exampleCode.unprocessable)],
    },
  ),

  "pass-it-on": step(
    "Expiry, සහ key එක ඉස්සරහට යැවීම",
    "එකම ගෙවීම, ඒත් දැන් Payments Card processor ට තමන්ගේම key එකක් (pay_81f2) යවනවා. Key එක expiry එකක් එක්ක save වෙනවා: පැය 24යි.",
    {
      body: [
        p(
          "උදව්කාරයාගේ notebook එකට හැම ticket එකක්ම සදහටම තියාගන්න බැහැ, ඒ නිසා දවසකට පස්සේ පරණ ඒවා විසි කරනවා.",
        ),
        p(
          "ඒ වගේම bank එකෙන් සල්ලි ඉල්ලනකොට උදව්කාරයා bank එකට තමන්ගේම ticket number එකක් දෙනවා. එතකොට උදව්කාරයාට bank එකෙන් ආයෙත් අහන්න වුණත්, bank එකත් දෙපාරක් සල්ලි ගන්නේ නැහැ.",
        ),
      ],
      example: [p("Parcel එකකට ඒක ගෙනියන හැම company එකකින්ම tracking number එකක් ලැබෙනවා.")],
    },
    {
      body: [
        p(
          "Expiry: table එක පොඩියට තියාගන්න ටික කාලෙකට පස්සේ keys මකනවා (Stripe අවම පැය 24ක් තියාගන්නවා). ඒ කාලය ඕනෙම client කෙනෙක් retry කරන කාලෙට වඩා දිග වෙන්න ඕනේ; key එක ගියාට පස්සේ එන retry එකක් අලුත් ගෙවීමක් විදිහට සලකනවා (“Key එක expire වෙලා” බලන්න). Business key එකට unique rule එකක්, order එකකට එක සාර්ථක ගෙවීමයි කියලා, හොඳ දෙවෙනි safety net එකක්.",
        ),
        p(
          "ඉස්සරහට යැවීම: හැම system එකකටම ආරක්ෂා කරගන්න පුළුවන් තමන්ව විතරයි. Payments තමන්ගේ Card processor call එකත් idempotent කරනවා, මේ ගෙවීමට වෙනස් නොවෙන තමන්ගේම key එකක් යවලා, ගෙවීමේ id එක වගේ. එතකොට timeout එකකට හෝ crash එකකට පස්සේ Payments ට ඒ call එක repeat කරන්න පුළුවන්, මුළු chain එකම charge කරන්නේ එක පාරයි.",
        ),
      ],
      example: [code("http", "Payments Card processor ට call කරනවා", exampleCode.downstream)],
    },
  ),

  // ----- Scenario: අතරමගදී crash එකක් --------------------------------------------------------
  crash: step(
    "Crash එක",
    "Payments key එක “in progress” විදිහට save කරනවා, Card processor card එක charge කරනවා. ඊට පස්සේ උත්තරය save කරන්න කලින් Payments crash වෙනවා. Shopper A ට මුකුත් ඇහෙන්නේ නැහැ.",
    {
      body: [
        p("උදව්කාරයා bank එකෙන් සල්ලි ගත්තා, ඊට පස්සේ notebook එකේ “ඉවරයි” කියලා ලියන්න කලින් නින්දට ගියා."),
        p("Notebook එකේ තවම තියෙන්නේ “7f3a: වැඩ කරනවා” කියලා. App එකට මුකුත් ඇහුණේ නැහැ."),
      ],
      example: [
        p(
          "Attendant ඔබේ coat එක අරන් ආවා, ඒත් ඔබට දෙන්න කලින් එයාට වෙන තැනකට යන්න වුණා. Hanger එකේ තවම තියෙන්නේ “ගේනවා” කියලා.",
        ),
      ],
    },
    {
      body: [
        p(
          "සල්ලි මාරු වුණා, ඒත් key row එකේ තවම තියෙන්නේ in progress කියලා, ගෙවීම් row එකක් නැහැ. මේ තමයි පිටස්තර side effect එකකුයි local transaction එකකුයි අතර හිඩැස.",
        ),
        p(
          "සාමාන්‍ය retry එකකට සදහටම 409 ලැබෙනවා, ආයෙත් මුල ඉඳන් පටන් ගන්න පරිස්සම් නැති server එකක් ආයෙත් charge කරනවා. (පියවර 8 කියන විදිහට Payments දැනටමත් Card processor ට තමන්ගේම key එකක්, pay_81f2, යවනවා; recovery එක ආරක්ෂිත කරන්නේ ඒකයි.)",
        ),
      ],
      example: [code("text", "Crash එකෙන් පස්සේ ඉතුරු වෙලා තියෙන දේ", exampleCode.crashState)],
    },
  ),

  recover: step(
    "ආරක්ෂිතව යථා තත්වයට",
    "Payments ආයෙත් ලෑස්තියි. Shopper A retry කරනවා; key එක තත්පර 60කට වඩා in progress, ඒ නිසා Payments ඒක භාර අරගෙන එකම key එකෙන් Card processor ගෙන් ආයෙත් අහනවා. Processor කලින් කරපු charge එක replay කරනවා.",
    {
      body: [
        p(
          "උදව්කාරයා ඇහැරිලා, ගොඩක් කලින් ලියපු “7f3a: වැඩ කරනවා” දකිනවා. එයා එකම ticket එකෙන් bank එකෙන් ආයෙත් අහනවා.",
        ),
        p(
          "Bank එක කියනවා “මම ඒක දැනටමත් කළා”, ඒ නිසා සල්ලි දෙපාරක් යන්නේ නැහැ. දැන් උදව්කාරයා “ඉවරයි” කියලා ලියලා “ගෙව්වා” කියනවා.",
        ),
      ],
      example: [
        p(
          "Attendant ආපහු ඇවිත් hanger එකේ “ගේනවා” දැකලා, දෙවෙනි coat එකක් ගේනවා වෙනුවට මුලින්ම coat rail එක බලනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Key row එක lock කරපු වෙලාව record කරනවා. Timeout එකකට (මෙතන තත්පර 60) වඩා පරණ lock එකක් අත්හැරපු එකක් විදිහට සලකනවා, key එක එක්ක එන ඊළඟ request එක වැඩේ ආයෙත් පටන් ගන්නවා.",
        ),
        p(
          "ආයෙත් පටන් ගන්න එක ආරක්ෂිත වෙන්නේ පිටස්තර call එකට තමන්ගේම key එකක් තියෙන නිසා විතරයි. ලොකු systems වැඩේ save කරපු recovery points තියෙන පියවර වලට කඩලා, retry එකක් එනකම් ඉන්නේ නැතුව background job එකකින් හිරවෙච්ච keys ඉවර කරනවා.",
        ),
      ],
      example: [code("text", "Recovery එක", exampleCode.recovery)],
    },
  ),

  // ----- Scenario: Key එක expire වෙලා --------------------------------------------------------
  "late-retry": step(
    "දවසකට පස්සේ retry එකක්",
    "පළවෙනි ගෙවීම සාර්ථකයි, ඒත් උත්තරය නැති වුණා, laptop එක sleep වුණා. පැය 25කට පස්සේ app එක key 7f3a එක්ක retry කරනවා. Key එක expire වෙලා, ඒ නිසා Payments ආයෙත් charge කරනවා.",
    {
      body: [
        p("App එක ගොඩක් වැඩි කාලයක් හිටියා. උදව්කාරයා පරණ ticket එක දැනටමත් විසි කරලා."),
        p("ඉතින් මේක එකම ගෙවීම කියලා එයා දැනගත්තේ නැහැ, ආයෙත් සල්ලි ගත්තා."),
      ],
      example: [
        p(
          "ඔබ සතියකට පස්සේ coat එක ගන්න එනවා. Cloakroom එක ඔබේ ticket එක විසි කරලා, කවුරු හරි ඔබට වෙන coat එකක් දෙනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "Expire වුණාට පස්සේ key එක කිසිම දෙයක් ආරක්ෂා කරන්නේ නැහැ. Key එකේ ආයු කාලය ඇතුළේම clients retry කරන එක නවත්තන්න ඕනේ (Retry module එකේ වගේ deadline එකක්).",
        ),
        p(
          "පරණ operation එකක් ආයෙත් යවන්න කලින්, client මුලින්ම වුණේ මොකක්ද කියලා බලන්න ඕනේ, උදාහරණයක් විදිහට GET /orders/1042 එකෙන්.",
        ),
      ],
      example: [code("text", "දවස් දෙකයි, ගෙවීම් දෙකයි", exampleCode.lateRetry)],
    },
  ),

  "safety-net": step(
    "Safety nets",
    "එකම පරක්කු retry එක, ඒත් Payments order එකත් බලනවා: order එකකට එක සාර්ථක ගෙවීමයි. Order 1042 ට දැනටමත් ගෙවලා, ඒ නිසා Payments ප්‍රතික්ෂේප කරනවා, කිසිම charge එකක් නැහැ.",
    {
      body: [
        p("මේ පාර උදව්කාරයා order number එකත් බලනවා."),
        p("Order 1042 ට දැනටමත් ගෙවලා, ඒ නිසා ආයෙත් සල්ලි ගන්නේ නැතුව ඒක කියනවා."),
      ],
      example: [
        p(
          "Cloakroom එක coat එකේ ඔබේ නමත් ලියනවා. Ticket එක නැතත්, ඔබ ඔබේ coat එක දැනටමත් අරන් ගියා කියලා ඔවුන්ට පේනවා.",
        ),
      ],
    },
    {
      body: [
        p(
          "කෙටි කාලයක් තියෙන key එකයි දිගටම තියෙන business rule එකයි එකතු කරන්න: order එකකට සාර්ථක ගෙවීම් වලට unique index එකක් (order_id WHERE status = 'succeeded'). සාමාන්‍ය path එකේදී ඒකට මුකුත් වැය වෙන්නේ නැහැ, keys expire වුණාට ගොඩක් කල් පස්සෙත් duplicates නවත්වනවා.",
        ),
        p(
          "Client ටත් තමන්ගේ කොටස කරන්න පුළුවන්: ලොකු පරතරයකට පස්සේ ආයෙත් යවන්න කලින්, වුණේ මොකක්ද කියලා server එකෙන් අහලා (GET /orders/1042) ඒක පෙන්නන්න.",
        ),
      ],
      example: [code("http", "Payments ප්‍රතික්ෂේප කරනවා", exampleCode.alreadyPaid)],
    },
  ),
};

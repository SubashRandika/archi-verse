# Backend for Frontend (BFF) module text (English and Sinhala)

- **Generated** by `npm run docs:module-text` from
  `src/content/modules/backend-for-frontend/text/`. Edit the TypeScript files, not this document.
- **Beginner** is written as if for a five-year-old, with an everyday example.
  **Advanced** keeps the technical depth and adds a worked example.
- **Sinhala** uses a friendly spoken style; technical terms stay in English.
- The learning objectives and scene notes are in
  [backend-for-frontend.md](backend-for-frontend.md).

---

## Main path

## One API for everyone · හැමෝටම එකම API එකක්

### 1. One API for everyone · හැමෝටම එකම API එකක්

**Watch:** The web browser calls Orders, Users and Recommendations itself, one after another. Its badge counts the calls and the time: 3 calls · 120 ms.

**බලන්න:** Web browser එක Orders, Users සහ Recommendations වලට තනියම, එකකට පස්සේ එකක් call කරනවා. එහි badge එක calls ගණනයි කාලයයි ගණන් කරනවා: call 3 · 120 ms.

#### Beginner

**In simple words**

To show one order, the web page needs three things: the order, where to deliver it, and some ideas for what else you might like. Each thing lives in a different service, so the page asks all three, one after the other.

On fast Wi-Fi that’s quick.

**Like in real life**

To make dinner you walk to the butcher, then the baker, then the greengrocer. If they are all on your street, it doesn’t take long.

**සරලව කිව්වොත්**

එක order එකක් පෙන්නන්න web page එකට දේවල් තුනක් ඕනේ: order එක, ඒක කොහෙට යවන්නද කියන එක, ඔබ කැමති වෙන්න පුළුවන් වෙනත් දේවල් ගැන අදහස් ටිකක්. මේ හැම එකක්ම තියෙන්නේ වෙනම service එකක, ඒ නිසා page එක තුනෙන්ම එකින් එක අහනවා.

වේගවත් Wi-Fi එකක නම් ඒක ඉක්මනින් ඉවරයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

රෑ කෑම හදන්න ඔබ මස් කඩේට යනවා, ඊට පස්සේ බේකරියට, ඊට පස්සේ එළවළු කඩේට. ඔක්කොම තියෙන්නේ ඔබේ පාරේම නම්, වැඩි වෙලාවක් යන්නේ නැහැ.

#### Advanced

**How it works**

Each service exposes a general-purpose REST API designed around its own data, not around any screen. The client composes the screen itself: GET /orders/1042, then GET /users/u_7f3a/address, then GET /recommendations?for=1042.

Calls that depend on an earlier answer must run one after another: the user id only arrives with the order. (The numbers in this module are illustrations, with realistic orders of magnitude.)

**Example**

_Three round trips on Wi-Fi_

```
GET /orders/1042                 40 ms
GET /users/u_7f3a/address        40 ms   (needs userId from the order)
GET /recommendations?for=1042    40 ms
total                           120 ms
```

**මෙය වැඩ කරන හැටි**

හැම service එකක්ම general-purpose REST API එකක් දෙනවා. ඒක හදලා තියෙන්නේ ඒ service එකේ data වටේ, කිසිම screen එකක් වටේ නෙවෙයි. ඒ නිසා client එක screen එක තනියම එකතු කරනවා: GET /orders/1042, ඊට පස්සේ GET /users/u_7f3a/address, ඊට පස්සේ GET /recommendations?for=1042.

කලින් උත්තරයක් ඕනේ calls එකකට පස්සේ එකක් යන්නම ඕනේ: user id එක එන්නේ order එකත් එක්කමයි. (මේ module එකේ ඉලක්කම් උදාහරණ විතරයි, ඒත් ඇත්ත ලෝකයේ ප්‍රමාණයන්ට ගැළපෙනවා.)

**උදාහරණය**

_Wi-Fi එකේ round trips තුනක්_

```
GET /orders/1042                 40 ms
GET /users/u_7f3a/address        40 ms   (needs userId from the order)
GET /recommendations?for=1042    40 ms
total                           120 ms
```

_Words to know:_ General-purpose API, Round trip, Client-side composition · _Message:_ The app asks Orders for the order

---

### 2. The chatty mobile app · කතා වැඩි mobile app එක

**Watch:** The mobile app makes the same three calls. Each round trip takes much longer: 3 calls · 900 ms.

**බලන්න:** Mobile app එකත් ඒ calls තුනම කරනවා. හැම round trip එකකටම ගොඩක් වැඩි වෙලාවක් යනවා: call 3 · 900 ms.

#### Beginner

**In simple words**

The phone does exactly the same, but its connection is slow, like shouting across a big field. Every question takes a long time to arrive, and a long time to come back.

Three questions take three long waits.

**Like in real life**

The butcher, the baker and the greengrocer are now in three different villages. Each trip takes ages, and you need three trips.

**සරලව කිව්වොත්**

Phone එකත් හරියටම ඒ දේම කරනවා, ඒත් එහි connection එක හෙමින්, ලොකු පිට්ටනියක් හරහා කෑ ගහනවා වගේ. හැම ප්‍රශ්නයක්ම යන්නත් ගොඩක් වෙලා යනවා, උත්තරය එන්නත් ගොඩක් වෙලා යනවා.

ප්‍රශ්න තුනක් කියන්නේ දිගු බලාපොරොත්තු තුනක්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

දැන් මස් කඩේ, බේකරිය, එළවළු කඩේ තියෙන්නේ වෙනස් ගම් තුනක. හැම ගමනකටම ගොඩක් වෙලා යනවා, ඔබට ගමන් තුනක් යන්න වෙනවා.

#### Advanced

**How it works**

On a mobile network, latency, not bandwidth, dominates: each round trip costs hundreds of milliseconds, and requests over a fresh connection pay for DNS, TCP and TLS too. A screen that needs N sequential calls costs N round trips.

It also costs battery: the radio stays awake for each request.

**Example**

_The same three calls on a mobile network_

```
GET /orders/1042                300 ms
GET /users/u_7f3a/address       300 ms
GET /recommendations?for=1042   300 ms
total                           900 ms   (plus any connection setup)
```

**මෙය වැඩ කරන හැටි**

Mobile network එකක වැඩිපුරම බලපාන්නේ bandwidth නෙවෙයි, latency. හැම round trip එකකටම milliseconds සිය ගණනක් යනවා, අලුත් connection එකක එන requests වලට DNS, TCP, TLS වලටත් ගෙවන්න වෙනවා. එකකට පස්සේ එකක් යන calls N ගණනක් ඕනේ screen එකකට round trips N ගණනක් යනවා.

Battery එකත් වැය වෙනවා: හැම request එකකටම radio එක අවදියෙන් ඉන්නවා.

**උදාහරණය**

_Mobile network එකේ ඒ calls තුනම_

```
GET /orders/1042                300 ms
GET /users/u_7f3a/address       300 ms
GET /recommendations?for=1042   300 ms
total                           900 ms   (plus any connection setup)
```

_Words to know:_ Latency, Chatty API · _Message:_ The app asks Users for the address

---

### 3. Too much, too little · වැඩියි, මදියි

**Watch:** Three big answers reach the phone: 38 KB received, only 4 KB used. Then the web page has to make one more call for a field the answer didn’t have.

**බලන්න:** Phone එකට ලොකු උත්තර තුනක් එනවා: KB 38ක් ලැබෙනවා, පාවිච්චි වෙන්නේ KB 4යි. ඊට පස්සේ උත්තරයේ නැති field එකක් නිසා web page එකට තවත් call එකක් කරන්න වෙනවා.

#### Beginner

**In simple words**

The services send the same big answer to everyone. The phone gets photos and details it will never show, and has to throw most of it away.

And sometimes the web page wants something the answer doesn’t have, so it must ask again.

**Like in real life**

You ask for one apple and get a whole crate. Your friend asked for apples and the price, but the crate has no price tag, so they have to go back.

**සරලව කිව්වොත්**

Services හැමෝටම එකම ලොකු උත්තරය යවනවා. Phone එකට කවදාවත් පෙන්නන්නේ නැති photos සහ විස්තර ලැබෙනවා, ඒකෙන් වැඩි කොටස විසි කරන්න වෙනවා.

සමහර වෙලාවට web page එකට උත්තරයේ නැති දෙයක් ඕනේ වෙනවා, ඒ නිසා ආයෙත් අහන්න වෙනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ ඇපල් ගෙඩියක් ඉල්ලනවා, ලැබෙන්නේ මුළු පෙට්ටියක්ම. ඔබේ යාළුවා ඇපල් සහ මිලත් ඉල්ලුවා, ඒත් පෙට්ටියේ මිල ලේබලයක් නැහැ, ඒ නිසා එයාට ආපහු යන්න වෙනවා.

#### Advanced

**How it works**

A general-purpose API returns one shape for everyone, so some clients over-fetch (data they discard: wasted bytes, parsing time and memory on a phone) and others under-fetch (they need another call for a missing field).

Adding fields for one client grows the payload for all of them; removing fields breaks someone. The API’s design ends up negotiated between teams with different needs.

**Example**

_What the phone receives, and what it shows_

```
/orders/1042            21 KB   (items with photos, prices, tax lines, history)
/users/…/address         3 KB   (full address, phone numbers, preferences)
/recommendations        14 KB   (12 products with images)
received                38 KB   used ≈ 4 KB
```

**මෙය වැඩ කරන හැටි**

General-purpose API එකක් හැමෝටම එකම හැඩයක් දෙනවා. ඒ නිසා සමහර clients over-fetch කරනවා (විසි කරන data: phone එකක නාස්ති වෙන bytes, parsing කාලය, memory), තවත් අය under-fetch කරනවා (නැති field එකකට තවත් call එකක් ඕනේ).

එක client කෙනෙකුට fields එකතු කළාම හැමෝගෙම payload එක ලොකු වෙනවා; fields අයින් කළොත් කාගේ හරි දෙයක් කැඩෙනවා. අන්තිමට API එකේ design එක තීරණය වෙන්නේ වෙනස් අවශ්‍යතා තියෙන teams අතර සාකච්ඡාවලින්.

**උදාහරණය**

_Phone එකට ලැබෙන දේ සහ එය පෙන්නන දේ_

```
/orders/1042            21 KB   (items with photos, prices, tax lines, history)
/users/…/address         3 KB   (full address, phone numbers, preferences)
/recommendations        14 KB   (12 products with images)
received                38 KB   used ≈ 4 KB
```

_Words to know:_ Over-fetching, Under-fetching · _Message:_ The whole order, for every caller (21 KB)

---

## A backend per front end · හැම front end එකකටම backend එකක්

### 4. Meet the BFFs · BFFs හඳුනාගනිමු

**Watch:** The Web BFF and the Mobile BFF light up. From now on the browser talks only to the Web BFF, and the phone only to the Mobile BFF.

**බලන්න:** Web BFF සහ Mobile BFF දැල්වෙනවා. මෙතැන් ඉඳන් browser එක කතා කරන්නේ Web BFF එකත් එක්ක විතරයි, phone එක Mobile BFF එකත් එක්ක විතරයි.

#### Beginner

**In simple words**

Now each app gets its own helper on the server. The web page has a web helper; the phone has a phone helper.

Each helper knows exactly what its app needs, and does the running around for it.

**Like in real life**

Instead of walking to three shops, you have a personal shopper who knows what you like. You ask once, and they bring you one bag.

**සරලව කිව්වොත්**

දැන් හැම app එකකටම server එකේ තමන්ගේම උදව්කාරයෙක් ඉන්නවා. Web page එකට web උදව්කාරයෙක්, phone එකට phone උදව්කාරයෙක්.

හැම උදව්කාරයෙක්ම තමන්ගේ app එකට ඕනේ දේ හරියටම දන්නවා, ඒ වෙනුවෙන් දුවලා පැනලා වැඩ කරනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කඩ තුනකට ඇවිදින්නේ නැතුව, ඔබ කැමති දේවල් දන්න personal shopper කෙනෙක් ඔබට ඉන්නවා. ඔබ එක පාරක් අහනවා, එයා ඔබට එක බෑග් එකක් ගෙනත් දෙනවා.

#### Advanced

**How it works**

A Backend for Frontend is a server-side component built for exactly one user experience: one for the web, one for the mobile app (sometimes one per platform, iOS and Android).

It sits behind the API gateway, which still handles TLS, authentication and rate limits for everyone, and in front of the services. The gateway is left out of the picture to keep it small. A BFF holds no business rules of its own: it composes and adapts.

**Example**

_The request paths_

```
web     →  gateway  →  web-bff.internal     →  orders, users, recommendations
mobile  →  gateway  →  mobile-bff.internal  →  orders, users, recommendations
```

**මෙය වැඩ කරන හැටි**

Backend for Frontend එකක් කියන්නේ හරියටම එක user experience එකක් වෙනුවෙන් හදපු server-side component එකක්: web එකට එකක්, mobile app එකට එකක් (සමහර වෙලාවට platform එකකට එකක්, iOS සහ Android).

එය ඉන්නේ API gateway එකට පිටිපස්සෙන්, services වලට ඉස්සරහින්. Gateway එක තවමත් හැමෝටම TLS, authentication සහ rate limits බලාගන්නවා; චිත්‍රය පොඩියට තියාගන්න ඒක පෙන්නන්නේ නැහැ. BFF එකක තමන්ගේම business rules නැහැ: එය එකතු කරනවා, ගළපනවා විතරයි.

**උදාහරණය**

_Requests යන පාරවල්_

```
web     →  gateway  →  web-bff.internal     →  orders, users, recommendations
mobile  →  gateway  →  mobile-bff.internal  →  orders, users, recommendations
```

_Words to know:_ Backend for Frontend (BFF), Experience API, API gateway

---

### 5. One call in, three calls out · එක call එකක් ඇතුළට, calls තුනක් එළියට

**Watch:** The phone sends one request. The Mobile BFF asks Orders, then Users and Recommendations side by side, puts the answers together and sends one answer back: 1 call · 380 ms.

**බලන්න:** Phone එක එක request එකක් යවනවා. Mobile BFF එක Orders එකෙන් අහලා, ඊට පස්සේ Users සහ Recommendations දෙකෙන්ම එකවර අහනවා, උත්තර එකතු කරලා එක උත්තරයක් ආපහු යවනවා: call 1 · 380 ms.

#### Beginner

**In simple words**

The phone asks its helper just once. The helper, who lives close to the services, asks them quickly, collects the answers and sends back one.

The phone waits for only one slow trip instead of three.

**Like in real life**

Your personal shopper sends two friends to two of the shops at the same time. You get one bag, and it arrives sooner.

**සරලව කිව්වොත්**

Phone එක තමන්ගේ උදව්කාරයාගෙන් අහන්නේ එක පාරයි. Services ළඟම ඉන්න උදව්කාරයා ඉක්මනට ඒවායින් අහලා, උත්තර එකතු කරලා එකක් ආපහු යවනවා.

Phone එකට බලන් ඉන්න වෙන්නේ හෙමින් ගමන් තුනක් වෙනුවට එකක් විතරයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබේ personal shopper යාළුවෝ දෙන්නෙක්ව කඩ දෙකකට එකම වෙලාවේ යවනවා. ඔබට එක බෑග් එකක් ලැබෙනවා, ඒකත් ඉක්මනට.

#### Advanced

**How it works**

The BFF aggregates: it turns one client request into several service calls inside the data centre, where a round trip costs about 1 ms instead of 300.

Independent calls run in parallel, so their total is roughly the slowest call, not the sum. Calls that depend on earlier answers still run in sequence: Users needs the userId from the order.

**Example**

_Where the time goes now_

```
phone → Mobile BFF                       300 ms   (one mobile round trip)
BFF → orders                              25 ms
BFF → users ∥ recommendations             55 ms   (in parallel: the slower one counts)
total                                   ≈ 380 ms   (was 900 ms)
```

**මෙය වැඩ කරන හැටි**

BFF එක aggregate කරනවා: client request එකක් data centre එක ඇතුළේ service calls කිහිපයකට හරවනවා. එතන round trip එකකට යන්නේ 300 ms වෙනුවට 1 ms විතර.

එකිනෙකට සම්බන්ධ නැති calls parallel යනවා, ඒ නිසා මුළු කාලය එකතුව නෙවෙයි, හෙමින්ම call එක විතර. කලින් උත්තරයක් ඕනේ calls තවමත් පිළිවෙළට යනවා: Users එකට order එකේ userId එක ඕනේ.

**උදාහරණය**

_දැන් කාලය යන්නේ කොහෙටද_

```
phone → Mobile BFF                       300 ms   (one mobile round trip)
BFF → orders                              25 ms
BFF → users ∥ recommendations             55 ms   (in parallel: the slower one counts)
total                                   ≈ 380 ms   (was 900 ms)
```

_Words to know:_ Aggregation, Fan-out, Parallel calls · _Message:_ The app asks the Mobile BFF for the screen

---

### 6. Each screen gets its own answer · හැම screen එකකටම තමන්ගේම උත්තරයක්

**Watch:** Both apps ask at the same time. The web gets a 38 KB answer, the phone a 4 KB one. Click either answer to compare them.

**බලන්න:** App දෙකම එකම වෙලාවේ අහනවා. Web එකට KB 38 උත්තරයක්, phone එකට KB 4 උත්තරයක් ලැබෙනවා. ඒ දෙක සසඳන්න ඕනෑම උත්තරයක් click කරන්න.

#### Beginner

**In simple words**

The two helpers pack different bags. The web helper packs everything the big screen shows: photos and twelve ideas. The phone helper packs only what fits on a small screen: names, totals and three ideas.

Nobody gets things they will throw away.

**Like in real life**

The same shop packs a big family box for one customer and a small lunch box for another. Same shop, different boxes.

**සරලව කිව්වොත්**

උදව්කාරයෝ දෙන්නා වෙනස් බෑග් දෙකක් අසුරනවා. Web උදව්කාරයා ලොකු screen එකේ පෙන්නන හැමදේම අසුරනවා: photos සහ අදහස් දොළහක්. Phone උදව්කාරයා අසුරන්නේ පොඩි screen එකට ගැළපෙන දේ විතරයි: නම්, එකතුව සහ අදහස් තුනක්.

කාටවත් විසි කරන්න වෙන දේවල් ලැබෙන්නේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

එකම කඩේ එක පාරිභෝගිකයෙකුට ලොකු පවුලේ පෙට්ටියක් අසුරනවා, තව කෙනෙකුට පොඩි lunch box එකක්. එකම කඩේ, වෙනස් පෙට්ටි.

#### Advanced

**How it works**

Each BFF shapes the response for its screen: it selects fields, renames them for the UI, merges data from several services, formats values (dates, money) for display and picks image sizes.

The services’ APIs stay general; the BFF absorbs the differences.

**Example**

_The mobile answer_

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 4113

{"order":{"id":1042,"status":"On its way","total":"LKR 12,400",
 "items":[{"name":"Desk lamp","qty":1},{"name":"USB-C cable","qty":2}]},
 "deliverTo":"Colombo",
 "suggestions":[{"id":88,"name":"Lamp bulb"},{"id":91,"name":"Cable clips"},{"id":17,"name":"Desk mat"}]}
```

**මෙය වැඩ කරන හැටි**

හැම BFF එකක්ම තමන්ගේ screen එකට response එක හැඩගස්වනවා: fields තෝරනවා, UI එකට ගැළපෙන්න නම් වෙනස් කරනවා, services කිහිපයකින් data එකතු කරනවා, පෙන්නන්න values (දින, මුදල්) format කරනවා, image sizes තෝරනවා.

Services වල APIs general විදිහටම තියෙනවා; වෙනස්කම් BFF එක භාර ගන්නවා.

**උදාහරණය**

_Mobile උත්තරය_

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 4113

{"order":{"id":1042,"status":"On its way","total":"LKR 12,400",
 "items":[{"name":"Desk lamp","qty":1},{"name":"USB-C cable","qty":2}]},
 "deliverTo":"Colombo",
 "suggestions":[{"id":88,"name":"Lamp bulb"},{"id":91,"name":"Cable clips"},{"id":17,"name":"Desk mat"}]}
```

_Words to know:_ Response shaping, Payload · _Message:_ The mobile screen’s answer (4 KB)

---

### 7. Owned by the front-end team · Front-end team එකේ අයිතිය

**Watch:** The browser and the Web BFF light up together, then the phone and the Mobile BFF: one team each.

**බලන්න:** Browser එකයි Web BFF එකයි එකට දැල්වෙනවා, ඊට පස්සේ phone එකයි Mobile BFF එකයි: එක එක්කෙනාට එක team එකක්.

#### Beginner

**In simple words**

The people who make the web page also make the web helper. When they change the page, they can change their helper the same day, without asking anybody else.

The phone team does the same with theirs.

**Like in real life**

Each family has its own shopper, who listens only to them. If you want something new in your bag, you tell your shopper, and nobody else has to agree.

**සරලව කිව්වොත්**

Web page එක හදන අයම web උදව්කාරයාවත් හදනවා. ඔවුන් page එක වෙනස් කරනකොට, කාගෙන්වත් අහන්නේ නැතුව එදාම උදව්කාරයාවත් වෙනස් කරන්න පුළුවන්.

Phone team එකත් තමන්ගේ එක එහෙමම කරනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

හැම පවුලකටම තමන්ගේම shopper කෙනෙක් ඉන්නවා, එයා අහන්නේ ඒ පවුලට විතරයි. ඔබේ බෑග් එකට අලුත් දෙයක් ඕනේ නම් ඔබ ඔබේ shopper ට කියනවා, වෙන කාගෙවත් එකඟතාවයක් ඕනේ නැහැ.

#### Advanced

**How it works**

A BFF is owned by the team that owns the front end, so a screen and its API change and ship together, without negotiating with other clients’ teams. This is Conway’s law, used on purpose.

A web BFF is also the safest place to keep tokens out of the browser (the token handler pattern): the BFF holds the OAuth tokens on the server and gives the browser only an HttpOnly, Secure, SameSite session cookie, so a script injected into the page (XSS) cannot steal them.

**Example**

_What the browser holds, with and without a BFF_

```
without BFF:  browser holds  access_token + refresh_token   (readable by any page script)
with BFF:     browser holds  Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Strict
              BFF holds      the tokens, and adds Authorization: Bearer … to service calls
```

**මෙය වැඩ කරන හැටි**

BFF එකක අයිතිය තියෙන්නේ front end එකේ අයිතිය තියෙන team එකටමයි. ඒ නිසා screen එකයි එහි API එකයි එකට වෙනස් වෙලා එකට ship වෙනවා, වෙනත් clients ගේ teams එක්ක සාකච්ඡා කරන්නේ නැතුව. මේ තමයි හිතාමතාම පාවිච්චි කරන Conway’s law.

Tokens browser එකෙන් එළියේ තියාගන්න හොඳම තැනත් web BFF එකක් (token handler pattern): BFF එක OAuth tokens server එකේ තියාගෙන browser එකට දෙන්නේ HttpOnly, Secure, SameSite session cookie එකක් විතරයි. ඒ නිසා page එකට රිංගපු script එකකට (XSS) ඒවා හොරකම් කරන්න බැහැ.

**උදාහරණය**

_BFF එකක් එක්ක සහ නැතුව browser එකේ තියෙන දේ_

```
without BFF:  browser holds  access_token + refresh_token   (readable by any page script)
with BFF:     browser holds  Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Strict
              BFF holds      the tokens, and adds Authorization: Bearer … to service calls
```

_Words to know:_ Conway’s law, Token handler, HttpOnly cookie

---

## Trade-offs · Trade-offs

### 8. The costs, and the alternatives · වියදම්, සහ වෙනත් විකල්ප

**Watch:** Both BFFs make the same call to Orders: the same rule, written twice. Then the whole picture: each app through its own BFF.

**බලන්න:** BFFs දෙකම Orders එකට එකම call එක කරනවා: එකම rule එක දෙපාරක් ලියලා. ඊට පස්සේ මුළු චිත්‍රයම: හැම app එකක්ම තමන්ගේම BFF එක හරහා.

#### Beginner

**In simple words**

Two helpers means two things to look after. Sometimes both helpers learn the same trick; later one of them changes it and the other doesn’t, so the two apps behave a little differently.

BFFs are great when the apps really need different things. When they don’t, one shared helper is simpler.

**Like in real life**

Two personal shoppers are nice, but you pay two people, and they might each remember your favourite bread differently.

**සරලව කිව්වොත්**

උදව්කාරයෝ දෙන්නෙක් කියන්නේ බලාගන්න දේවල් දෙකක්. සමහර වෙලාවට දෙන්නාම එකම උපක්‍රමය ඉගෙන ගන්නවා; පස්සේ එක්කෙනෙක් ඒක වෙනස් කරනවා, අනිත් එක්කෙනා කරන්නේ නැහැ. එතකොට app දෙක පොඩ්ඩක් වෙනස් විදිහට වැඩ කරනවා.

App වලට ඇත්තටම වෙනස් දේවල් ඕනේ නම් BFFs හොඳයි. එහෙම නැත්නම්, පොදු උදව්කාරයෙක් එක්කෙනෙක් ලේසියි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Personal shoppers දෙන්නෙක් ඉන්න එක හොඳයි, ඒත් ඔබ දෙන්නෙකුට ගෙවනවා, දෙන්නාටම ඔබ කැමති පාන් වර්ගය වෙනස් විදිහට මතක තියෙන්නත් පුළුවන්.

#### Advanced

**How it works**

Costs: one more deployable per front end (hosting, monitoring, on-call), logic that gets copied between BFFs and drifts (move real business rules into the services), and one more hop inside the data centre.

- **API gateway:** shared concerns for every client (TLS, authentication, rate limits). It sits in front of the BFFs and should not grow screen-specific logic.
- **GraphQL:** one flexible endpoint where each client asks for exactly the fields it needs. It solves over- and under-fetching without a BFF per client, at the cost of a schema and resolver layer (often federated over the services).
- **When a BFF is worth it:** when front ends differ a lot (web, mobile, TV) and are built by different teams.

**Example**

SoundCloud used BFFs while splitting its monolith (described by Phil Calçado), and Sam Newman wrote up the pattern. Netflix ran device-specific adapter scripts on its API platform, one per kind of device.

**මෙය වැඩ කරන හැටි**

වියදම්: front end එකකට තවත් deployable එකක් (hosting, monitoring, on-call), BFFs අතර copy වෙලා ටිකෙන් ටික වෙනස් වෙන logic (ඇත්ත business rules services වලට ගෙනියන්න), සහ data centre එක ඇතුළේ තවත් hop එකක්.

- **API gateway:** හැම client කෙනෙකුටම පොදු දේවල් (TLS, authentication, rate limits). එය BFFs වලට ඉස්සරහින් ඉන්නවා, screen එකකට විශේෂ logic එහි වැඩෙන්න දෙන්න හොඳ නැහැ.
- **GraphQL:** හැම client කෙනෙක්ම තමන්ට ඕනේ fields විතරක් ඉල්ලන නම්‍යශීලී endpoint එකක්. Client කෙනෙකුට BFF එකක් නැතුවම over-fetching සහ under-fetching විසඳනවා, ඒත් schema එකක් සහ resolver layer එකක් ඕනේ (බොහෝ විට services උඩින් federate කරලා).
- **BFF එකක් වටින්නේ කවදාද:** front ends ගොඩක් වෙනස් නම් (web, mobile, TV), ඒවා හදන්නේ වෙනස් teams නම්.

**උදාහරණය**

SoundCloud තමන්ගේ monolith එක කඩද්දී BFFs පාවිච්චි කළා (Phil Calçado ඒ ගැන ලිව්වා), Sam Newman මේ pattern එක ගැන ලිව්වා. Netflix තමන්ගේ API platform එකේ device වර්ගයකට එකක් බැගින් device-specific adapter scripts දිව්වා.

_Words to know:_ Code duplication, API gateway, GraphQL · _Message:_ The BFF asks Orders

---

## Scenarios

## Scenario: One service is slow · එක service එකක් හෙමින්

Recommendations is late, so the Mobile BFF answers in time, without suggestions.

Recommendations පරක්කුයි, ඒ නිසා Mobile BFF එක suggestions නැතුව වෙලාවට උත්තර දෙනවා.

### 1. Recommendations slows down · Recommendations හෙමින් වෙනවා

**Watch:** Recommendations turns amber. Orders and Users answer the Mobile BFF, Recommendations doesn’t, and the BFF’s badge counts its time budget down.

**බලන්න:** Recommendations amber වෙනවා. Orders සහ Users Mobile BFF එකට උත්තර දෙනවා, Recommendations දෙන්නේ නැහැ, BFF එකේ badge එක එහි time budget එක ගණන් කරනවා.

#### Beginner

**In simple words**

One of the three shops is very slow today. The helper already has two of the three things, and waits a little for the third.

**Like in real life**

Your shopper has the meat and the bread, but the greengrocer has a long queue. They look at their watch.

**සරලව කිව්වොත්**

අද කඩ තුනෙන් එකක් ගොඩක් හෙමින්. උදව්කාරයා ළඟ දේවල් තුනෙන් දෙකක් දැනටමත් තියෙනවා, තුන්වෙනි එකට පොඩ්ඩක් බලන් ඉන්නවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබේ shopper ළඟ මස් සහ පාන් තියෙනවා, ඒත් එළවළු කඩේ දිගු පෝළිමක්. එයා ඔරලෝසුව බලනවා.

#### Advanced

**How it works**

In a fan-out, the slowest dependency sets the response time. So each downstream call gets its own timeout, inside an overall time budget for the request.

Required data (the order) and optional data (the suggestions) can have different budgets.

**Example**

_The BFF’s budgets for this screen_

```
GET /app/v3/order-screen/1042          overall budget 600 ms
  orders           required   timeout 250 ms   →  25 ms   ✓
  users            required   timeout 250 ms   →  30 ms   ✓
  recommendations  optional   timeout 200 ms   →  —       ✗ timed out
```

**මෙය වැඩ කරන හැටි**

Fan-out එකක response time එක තීරණය කරන්නේ හෙමින්ම dependency එක. ඒ නිසා හැම downstream call එකකටම, request එකේ මුළු time budget එක ඇතුළේ, තමන්ගේම timeout එකක් දෙනවා.

අනිවාර්ය data (order එක) සහ අමතර data (suggestions) වලට වෙනස් budgets තියෙන්න පුළුවන්.

**උදාහරණය**

_මේ screen එකට BFF එකේ budgets_

```
GET /app/v3/order-screen/1042          overall budget 600 ms
  orders           required   timeout 250 ms   →  25 ms   ✓
  users            required   timeout 250 ms   →  30 ms   ✓
  recommendations  optional   timeout 200 ms   →  —       ✗ timed out
```

_Words to know:_ Fan-out, Time budget · _Message:_ The BFF asks for three suggestions

---

### 2. Answer with what you have · තියෙන දෙයින් උත්තර දෙන්න

**Watch:** The budget runs out. The Mobile BFF answers the phone without suggestions; Recommendations’ late answer is dropped.

**බලන්න:** Budget එක ඉවර වෙනවා. Mobile BFF එක suggestions නැතුව phone එකට උත්තර දෙනවා; Recommendations ගේ පරක්කු උත්තරය අතහැරෙනවා.

#### Beginner

**In simple words**

The helper doesn’t make you wait for ever. You get your order and the address now, just without the ideas.

That part of the screen stays empty.

**Like in real life**

Your shopper comes home with the meat and the bread, and says: “No vegetables today, the queue was too long.” Dinner still happens.

**සරලව කිව්වොත්**

උදව්කාරයා ඔබව හැමදාම බලන් ඉන්න තියන්නේ නැහැ. ඔබට order එකයි address එකයි දැන්ම ලැබෙනවා, අදහස් නැතුව විතරයි.

Screen එකේ ඒ කොටස හිස්ව තියෙනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබේ shopper මස් සහ පාන් අරගෙන ගෙදර එනවා, කියනවා: “අද එළවළු නැහැ, පෝළිම දිග වැඩියි.” රෑ කෑම තවමත් තියෙනවා.

#### Advanced

**How it works**

The BFF returns a partial response for optional data (suggestions are nice to have; the order is not), marks what is missing, and lets the UI hide that section. Required data failing is still an error.

A circuit breaker around each call (the previous module) stops the BFF waiting on a service that is down.

**Example**

_The partial answer_

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"order":{…}, "deliverTo":"Colombo", "suggestions":null, "missing":["suggestions"]}
```

**මෙය වැඩ කරන හැටි**

BFF එක අමතර data වෙනුවෙන් partial response එකක් දෙනවා (suggestions තිබුණොත් හොඳයි; order එක එහෙම නෙවෙයි), නැති දේ සලකුණු කරලා, UI එකට ඒ කොටස හංගන්න දෙනවා. අනිවාර්ය data fail වුණොත් ඒක තවමත් error එකක්.

හැම call එකක් වටේම circuit breaker එකක් (කලින් module එක) down වෙලා තියෙන service එකක් බලන් ඉන්න එකෙන් BFF එක නවත්තනවා.

**උදාහරණය**

_අර්ධ උත්තරය_

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"order":{…}, "deliverTo":"Colombo", "suggestions":null, "missing":["suggestions"]}
```

_Words to know:_ Partial response, Time budget · _Message:_ The answer without suggestions

---

## Scenario: A web-only change · Web එකට විතරක් වෙනසක්

The web team adds a field to its own BFF; the mobile app is untouched.

Web team එක තමන්ගේම BFF එකට field එකක් එකතු කරනවා; mobile app එකට කිසි බලපෑමක් නැහැ.

### 1. The web wants a new field · Web එකට අලුත් field එකක් ඕනේ

**Watch:** The Web BFF is deployed again and becomes v2.5. The Mobile BFF and the services stay as they are.

**බලන්න:** Web BFF එක ආයෙත් deploy වෙලා v2.5 වෙනවා. Mobile BFF එකයි services ටිකයි තිබුණු විදිහටම තියෙනවා.

#### Beginner

**In simple words**

The web team wants to show “arrives Thursday”. They teach their helper to ask for the delivery date.

Nobody else has to change anything.

**Like in real life**

You tell your own shopper: “From now on, please check when the bread is fresh.” The other family’s shopper doesn’t need to know.

**සරලව කිව්වොත්**

Web team එකට “බ්‍රහස්පතින්දා එනවා” කියලා පෙන්නන්න ඕනේ. ඔවුන් තමන්ගේ උදව්කාරයාට delivery දිනය අහන්න උගන්නනවා.

වෙන කාටවත් මුකුත් වෙනස් කරන්න ඕනේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ ඔබේම shopper ට කියනවා: “මෙතැන් ඉඳන් පාන් අලුත්ද කියලා බලන්න.” අනිත් පවුලේ shopper ට ඒක දැනගන්න ඕනේ නැහැ.

#### Advanced

**How it works**

The web team adds estimatedDelivery to its BFF, using a field Orders already returns. No change to the services’ APIs, no coordination with the mobile team, and no new version of a shared API.

**Example**

_The whole change, in the Web BFF_

```
// web-bff/src/order-details.ts
  status: order.status,
+ estimatedDelivery: formatDay(order.delivery.estimate),   // already in /orders/1042
```

**මෙය වැඩ කරන හැටි**

Web team එක Orders දැනටමත් දෙන field එකක් පාවිච්චි කරලා තමන්ගේ BFF එකට estimatedDelivery එකතු කරනවා. Services වල APIs වෙනස් කරන්නේ නැහැ, mobile team එක්ක සම්බන්ධීකරණයක් නැහැ, පොදු API එකක අලුත් version එකකුත් නැහැ.

**උදාහරණය**

_මුළු වෙනස, Web BFF එකේ_

```
// web-bff/src/order-details.ts
  status: order.status,
+ estimatedDelivery: formatDay(order.delivery.estimate),   // already in /orders/1042
```

_Words to know:_ Response shaping, Conway’s law

---

### 2. Only the web sees it · ඒක දකින්නේ web එක විතරයි

**Watch:** The browser asks again and its answer now says when the order arrives. The phone asks and gets its usual answer.

**බලන්න:** Browser එක ආයෙත් අහනවා, දැන් එහි උත්තරයේ order එක එන දවස තියෙනවා. Phone එක අහලා සුපුරුදු උත්තරයම ගන්නවා.

#### Beginner

**In simple words**

The web page shows the delivery day. The phone app works exactly as before.

**Like in real life**

One family now gets a note about fresh bread in its bag. The other family’s bag looks the same as always.

**සරලව කිව්වොත්**

Web page එක delivery දවස පෙන්නනවා. Phone app එක කලින් වගේම වැඩ කරනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

එක පවුලකට දැන් බෑග් එකේ අලුත් පාන් ගැන සටහනක් ලැබෙනවා. අනිත් පවුලේ බෑග් එක හැමදාම වගේමයි.

#### Advanced

**How it works**

Each client’s contract changes on its own schedule. The mobile app ships through the app stores and has old versions in use for months; it is not affected.

When the app wants the field too, the Mobile BFF adds it, and keeps serving the old app versions.

**Example**

_Each client’s contract_

```
web  v2.5   {order:{…, estimatedDelivery}, deliverTo, suggestions}   deployed today
app  v3     {order:{…}, deliverTo, suggestions}                      unchanged
app  v2     (still on 18 % of phones)                                unchanged
```

**මෙය වැඩ කරන හැටි**

හැම client කෙනෙකුගේම contract එක තමන්ගේම කාලසටහනට වෙනස් වෙනවා. Mobile app එක ship වෙන්නේ app stores හරහා, පරණ versions මාස ගණන් පාවිච්චි වෙනවා; ඒකට කිසි බලපෑමක් නැහැ.

App එකටත් ඒ field එක ඕනේ වුණාම, Mobile BFF එක ඒක එකතු කරනවා, පරණ app versions වලටත් දිගටම සේවය කරනවා.

**උදාහරණය**

_හැම client කෙනෙකුගේම contract එක_

```
web  v2.5   {order:{…, estimatedDelivery}, deliverTo, suggestions}   deployed today
app  v3     {order:{…}, deliverTo, suggestions}                      unchanged
app  v2     (still on 18 % of phones)                                unchanged
```

_Words to know:_ Experience API, Backend for Frontend (BFF) · _Message:_ The web answer, now with the delivery day

---

## Parts of the scene

### Web browser (web)

|                   | English                                                                                                                                                                   | සිංහල                                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                                    | Client                                                                                                                                                                       |
| Simple summary    | The shop’s web site, on a big screen with fast Wi-Fi.                                                                                                                     | ලොකු screen එකක, වේගවත් Wi-Fi එකක තියෙන කඩේ web site එක.                                                                                                                        |
| Like in real life | Like a family with a big table: it has room for everything.                                                                                                               | ලොකු මේසයක් තියෙන පවුලක් වගේ: හැමදේටම ඉඩ තියෙනවා.                                                                                                                                  |
| What it does      | Shows the whole Order details page; Asks for what the page needs                                                                                                          | මුළු Order details page එකම පෙන්නනවා; Page එකට ඕනේ දේ ඉල්ලනවා                                                                                                                    |
| Talks to          | Web BFF (through the API gateway)                                                                                                                                         | Web BFF (API gateway එක හරහා)                                                                                                                                                |
| Technical summary | The shop’s web front end, rendering the full Order details page.                                                                                                          | මුළු Order details page එක render කරන කඩේ web front end එක.                                                                                                                    |
| How it works      | Without a BFF it calls each service’s API and composes the page itself. With one, it makes one call to the Web BFF (through the gateway) and holds only a session cookie. | BFF එකක් නැත්නම් එය හැම service එකකම API එකට call කරලා page එක තනියම හදනවා. BFF එකක් තියෙනකොට එය (gateway එක හරහා) Web BFF එකට එක call එකක් කරනවා, තියාගන්නේ session cookie එකක් විතරයි. |
| Responsibilities  | Render the Order details page; Call its BFF for each screen; Hide sections whose data is missing                                                                          | Order details page එක render කරනවා; හැම screen එකකටම තමන්ගේ BFF එකට call කරනවා; Data නැති කොටස් හංගනවා                                                                          |
| Inputs            | User actions; Answers from the Web BFF                                                                                                                                    | User ක්‍රියා; Web BFF එකෙන් එන උත්තර                                                                                                                                             |
| Outputs           | Requests to the Web BFF                                                                                                                                                   | Web BFF එකට requests                                                                                                                                                         |
| Examples          | https://shop.example/orders/1042                                                                                                                                          | https://shop.example/orders/1042                                                                                                                                             |
| Advantages        | Fast network, big screen; Can be updated at any time                                                                                                                      | වේගවත් network, ලොකු screen; ඕනෑම වෙලාවක update කරන්න පුළුවන්                                                                                                                      |
| Limitations       | Anything stored in the page, like tokens, can be read by an injected script (XSS)                                                                                         | Page එකේ තියෙන ඕනෑම දෙයක්, tokens වගේ, රිංගපු script එකකට කියවන්න පුළුවන් (XSS)                                                                                                       |
| Technologies      | React, Next.js, fetch                                                                                                                                                     |                                                                                                                                                                              |

### Mobile app (mobile)

|                   | English                                                                                                                                                         | සිංහල                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                          | Client                                                                                                                                                |
| Simple summary    | The shop’s app on your phone, with a small screen and a slow connection.                                                                                        | පොඩි screen එකක් සහ හෙමින් connection එකක් තියෙන, ඔබේ phone එකේ තියෙන කඩේ app එක.                                                                            |
| Like in real life | Like someone far away on a walkie-talkie: every message takes a while.                                                                                          | Walkie-talkie එකකින් ඈත ඉඳන් කතා කරන කෙනෙක් වගේ: හැම පණිවිඩයකටම වෙලාවක් යනවා.                                                                                |
| What it does      | Shows a short Order details screen; Asks for as little as it can                                                                                                | කෙටි Order details screen එකක් පෙන්නනවා; පුළුවන් තරම් අඩුවෙන් ඉල්ලනවා                                                                                           |
| Talks to          | Mobile BFF (through the API gateway)                                                                                                                            | Mobile BFF (API gateway එක හරහා)                                                                                                                      |
| Technical summary | A native app on a slow, high-latency network, with old versions in use for months.                                                                              | හෙමින්, latency වැඩි network එකක තියෙන native app එකක්; පරණ versions මාස ගණන් පාවිච්චි වෙනවා.                                                                  |
| How it works      | Each round trip costs about 300 ms, so it wants one call per screen and small answers. It is released through the app stores, so it can’t be changed overnight. | හැම round trip එකකටම 300 ms විතර යනවා, ඒ නිසා screen එකකට එක call එකක් සහ පොඩි උත්තර ඕනේ. එය release වෙන්නේ app stores හරහා, ඒ නිසා එක රැයකින් වෙනස් කරන්න බැහැ. |
| Responsibilities  | Render the Order details screen; Make as few calls as possible; Keep working with older API contracts                                                           | Order details screen එක render කරනවා; පුළුවන් තරම් අඩු calls ගණනක් කරනවා; පරණ API contracts එක්කත් වැඩ කරනවා                                                  |
| Inputs            | User actions; Answers from the Mobile BFF                                                                                                                       | User ක්‍රියා; Mobile BFF එකෙන් එන උත්තර                                                                                                                   |
| Outputs           | Requests to the Mobile BFF                                                                                                                                      | Mobile BFF එකට requests                                                                                                                               |
| Examples          | The shop’s iOS and Android apps                                                                                                                                 | කඩේ iOS සහ Android apps                                                                                                                               |
| Advantages        | Always with the customer                                                                                                                                        | හැමවිටම පාරිභෝගිකයා ළඟ                                                                                                                                   |
| Limitations       | Every round trip is expensive (time and battery); Can’t be updated instantly (app-store releases)                                                               | හැම round trip එකක්ම මිල අධිකයි (කාලය සහ battery); එකපාරටම update කරන්න බැහැ (app-store releases)                                                          |
| Technologies      | Swift, Kotlin, React Native, Flutter                                                                                                                            |                                                                                                                                                       |

### Web BFF (web-bff)

|                   | English                                                                                                                                                                                                                                        | සිංහල                                                                                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend for Frontend                                                                                                                                                                                                                           | Backend for Frontend                                                                                                                                                                                                        |
| Simple summary    | The web page’s own helper on the server. It knows what the web page needs.                                                                                                                                                                     | Server එකේ ඉන්න web page එකේම උදව්කාරයා. Web page එකට ඕනේ දේ එයා දන්නවා.                                                                                                                                                       |
| Like in real life | Like a personal shopper for one family: ask once, get one bag, packed for you.                                                                                                                                                                 | එක පවුලකට personal shopper කෙනෙක් වගේ: එක පාරක් අහන්න, ඔබට අසුරපු එක බෑග් එකක් ගන්න.                                                                                                                                                 |
| What it does      | Asks the services for the web page; Packs one answer for the big screen; Keeps the web page’s keys safe                                                                                                                                        | Web page එක වෙනුවෙන් services වලින් අහනවා; ලොකු screen එකට එක උත්තරයක් අසුරනවා; Web page එකේ යතුරු ආරක්ෂිතව තියාගන්නවා                                                                                                                    |
| Talks to          | Web browser; Orders service; Users service; Recommendations                                                                                                                                                                                    | Web browser; Orders service; Users service; Recommendations                                                                                                                                                                 |
| Technical summary | A server-side layer for the web experience: aggregates service calls, shapes the response for the web page and keeps tokens out of the browser.                                                                                                | Web experience එක වෙනුවෙන් server-side layer එකක්: service calls එකතු කරනවා, web page එකට response එක හැඩගස්වනවා, tokens browser එකෙන් එළියේ තියාගන්නවා.                                                                             |
| How it works      | For each screen request it calls the services in the data centre (in parallel where it can), merges and formats the results for the page, and answers once. It holds the user’s OAuth tokens and gives the browser an HttpOnly session cookie. | හැම screen request එකකටම data centre එකේ services වලට call කරනවා (පුළුවන් තැන parallel), ප්‍රතිඵල page එකට එකතු කරලා format කරනවා, එක පාරක් උත්තර දෙනවා. User ගේ OAuth tokens තියාගෙන browser එකට HttpOnly session cookie එකක් දෙනවා. |
| Responsibilities  | Aggregate service calls; Shape responses for the web page; Per-call timeouts and partial answers; Keep tokens server-side (token handler)                                                                                                      | Service calls එකතු කරනවා; Web page එකට responses හැඩගස්වනවා; Call එකකට timeouts සහ අර්ධ උත්තර; Tokens server-side තියාගන්නවා (token handler)                                                                                      |
| Inputs            | Screen requests from the browser; Answers from the services                                                                                                                                                                                    | Browser එකෙන් screen requests; Services වලින් උත්තර                                                                                                                                                                             |
| Outputs           | One answer per screen; Calls to the services                                                                                                                                                                                                   | Screen එකකට එක උත්තරයක්; Services වලට calls                                                                                                                                                                                   |
| Examples          | GET /web/order-details/1042                                                                                                                                                                                                                    | GET /web/order-details/1042                                                                                                                                                                                                 |
| Advantages        | The web page gets exactly what it needs; The web team changes and ships it on its own                                                                                                                                                          | Web page එකට හරියටම ඕනේ දේ ලැබෙනවා; Web team එකට තනියම වෙනස් කරලා ship කරන්න පුළුවන්                                                                                                                                               |
| Limitations       | One more service to run; Logic copied from other BFFs can drift                                                                                                                                                                                | Run කරන්න තවත් service එකක්; වෙනත් BFFs වලින් copy කරපු logic ටිකෙන් ටික වෙනස් වෙන්න පුළුවන්                                                                                                                                               |
| Technologies      | Node.js (Express, Fastify, NestJS), Next.js route handlers, Spring Boot, Go                                                                                                                                                                    |                                                                                                                                                                                                                             |

### Mobile BFF (mobile-bff)

|                   | English                                                                                                                                                                                                              | සිංහල                                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kind              | Backend for Frontend                                                                                                                                                                                                 | Backend for Frontend                                                                                                                                                                                                     |
| Simple summary    | The phone’s own helper on the server. It knows what the small screen needs.                                                                                                                                          | Server එකේ ඉන්න phone එකේම උදව්කාරයා. පොඩි screen එකට ඕනේ දේ එයා දන්නවා.                                                                                                                                                     |
| Like in real life | Like a personal shopper who packs a small lunch box instead of a big crate.                                                                                                                                          | ලොකු පෙට්ටියක් වෙනුවට පොඩි lunch box එකක් අසුරන personal shopper කෙනෙක් වගේ.                                                                                                                                                      |
| What it does      | Asks the services for the phone; Packs one small answer; Doesn’t keep the phone waiting for a slow shop                                                                                                              | Phone එක වෙනුවෙන් services වලින් අහනවා; පොඩි උත්තරයක් අසුරනවා; හෙමින් කඩයක් නිසා phone එක බලන් ඉන්න තියන්නේ නැහැ                                                                                                                         |
| Talks to          | Mobile app; Orders service; Users service; Recommendations                                                                                                                                                           | Mobile app; Orders service; Users service; Recommendations                                                                                                                                                               |
| Technical summary | A server-side layer for the mobile app: turns one call from the phone into several calls inside the data centre, and answers with a small, screen-shaped payload.                                                    | Mobile app එක වෙනුවෙන් server-side layer එකක්: phone එකෙන් එන එක call එකක් data centre එක ඇතුළේ calls කිහිපයකට හරවලා, පොඩි, screen එකට හැඩගස්වපු payload එකකින් උත්තර දෙනවා.                                                           |
| How it works      | Calls Orders, then Users and Recommendations in parallel, each with its own timeout inside a time budget. It answers with only the fields the screen shows, and returns a partial answer when optional data is late. | Orders එකට call කරලා, ඊට පස්සේ Users සහ Recommendations වලට parallel call කරනවා, හැම එකකටම time budget එක ඇතුළේ තමන්ගේම timeout එකක් එක්ක. Screen එකේ පෙන්නන fields විතරක් එක්ක උත්තර දෙනවා, අමතර data පරක්කු වුණොත් අර්ධ උත්තරයක් දෙනවා. |
| Responsibilities  | Aggregate service calls; Shape small responses for the app; Time budgets and partial answers; Keep serving older app versions                                                                                        | Service calls එකතු කරනවා; App එකට පොඩි responses හැඩගස්වනවා; Time budgets සහ අර්ධ උත්තර; පරණ app versions වලටත් දිගටම සේවය කරනවා                                                                                                |
| Inputs            | Screen requests from the app; Answers from the services                                                                                                                                                              | App එකෙන් screen requests; Services වලින් උත්තර                                                                                                                                                                              |
| Outputs           | One small answer per screen; Calls to the services                                                                                                                                                                   | Screen එකකට එක පොඩි උත්තරයක්; Services වලට calls                                                                                                                                                                            |
| Examples          | GET /app/v3/order-screen/1042                                                                                                                                                                                        | GET /app/v3/order-screen/1042                                                                                                                                                                                            |
| Advantages        | One mobile round trip per screen; Small payloads: less data, less battery                                                                                                                                            | Screen එකකට එක mobile round trip එකයි; පොඩි payloads: data අඩුයි, battery අඩුයි                                                                                                                                                |
| Limitations       | One more service to run; Must support every app version still in use                                                                                                                                                 | Run කරන්න තවත් service එකක්; තවම පාවිච්චි වෙන හැම app version එකකටම සහාය දෙන්න ඕනේ                                                                                                                                              |
| Technologies      | Node.js (Fastify, NestJS), Kotlin, Go, a GraphQL server                                                                                                                                                              |                                                                                                                                                                                                                          |

### Orders service (orders)

|                   | English                                                                                                    | සිංහල                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                            | Backend service                                                                                                  |
| Simple summary    | Knows every order and what is in it.                                                                       | හැම order එකක්ම සහ ඒකේ තියෙන දේවල් දන්නවා.                                                                           |
| Like in real life | Like the butcher: it has what you need, and gives everyone the same big parcel.                            | මස් කඩේ වගේ: ඔබට ඕනේ දේ තියෙනවා, ඒත් හැමෝටම දෙන්නේ එකම ලොකු පාර්සලය.                                                   |
| What it does      | Keeps the orders; Says what is in each order                                                               | Orders තියාගන්නවා; හැම order එකකම මොනවද තියෙන්නේ කියනවා                                                               |
| Talks to          | Web BFF; Mobile BFF                                                                                        | Web BFF; Mobile BFF                                                                                              |
| Technical summary | A general-purpose service that owns orders and their items, with one REST API for every caller.            | Orders සහ ඒවායේ items අයිති, හැම caller කෙනෙකුටම එකම REST API එකක් දෙන general-purpose service එකක්.                  |
| How it works      | Answers from its own data store, with one response shape for every caller. It knows nothing about screens. | තමන්ගේම data store එකෙන්, හැම caller කෙනෙකුටම එකම response හැඩයකින් උත්තර දෙනවා. Screens ගැන එය කිසිවක් දන්නේ නැහැ.        |
| Responsibilities  | Own orders and their items; Keep its API stable for every caller; Hold the business rules for its data     | Orders සහ ඒවායේ items බලාගන්නවා; හැම caller කෙනෙකුටම API එක ස්ථාවරව තියාගන්නවා; තමන්ගේ data වල business rules තියාගන්නවා |
| Inputs            | Requests from the BFFs (or, before them, from the apps)                                                    | BFFs වලින් එන requests (ඒවාට කලින්, apps වලින්)                                                                        |
| Outputs           | General-purpose JSON answers                                                                               | General-purpose JSON උත්තර                                                                                        |
| Examples          | GET /orders/1042                                                                                           | GET /orders/1042                                                                                                 |
| Advantages        | One owner and one API for its data; Doesn’t change for every new screen                                    | තමන්ගේ data වලට එක අයිතිකරුවෙක් සහ එක API එකක්; හැම අලුත් screen එකකටම වෙනස් වෙන්නේ නැහැ                                   |
| Limitations       | One shape for everyone: too much for some callers, too little for others                                   | හැමෝටම එකම හැඩයක්: සමහරුන්ට වැඩියි, තවත් අයට මදියි                                                                       |
| Technologies      | Spring Boot, Go, Node.js, ASP.NET Core                                                                     |                                                                                                                  |

### Users service (users)

|                   | English                                                                                                    | සිංහල                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                            | Backend service                                                                                                     |
| Simple summary    | Knows who you are and where to deliver.                                                                    | ඔබ කවුද, කොහෙට deliver කරන්නද කියලා දන්නවා.                                                                             |
| Like in real life | Like the baker: one more shop to visit.                                                                    | බේකරිය වගේ: යන්න තියෙන තවත් එක කඩයක්.                                                                                    |
| What it does      | Keeps the addresses; Says where an order goes                                                              | Addresses තියාගන්නවා; Order එකක් යන්නේ කොහෙටද කියනවා                                                                     |
| Talks to          | Web BFF; Mobile BFF                                                                                        | Web BFF; Mobile BFF                                                                                                 |
| Technical summary | A general-purpose service that owns users and their addresses, with one REST API for every caller.         | Users සහ ඔවුන්ගේ addresses අයිති, හැම caller කෙනෙකුටම එකම REST API එකක් දෙන general-purpose service එකක්.                  |
| How it works      | Answers from its own data store, with one response shape for every caller. It knows nothing about screens. | තමන්ගේම data store එකෙන්, හැම caller කෙනෙකුටම එකම response හැඩයකින් උත්තර දෙනවා. Screens ගැන එය කිසිවක් දන්නේ නැහැ.           |
| Responsibilities  | Own users and their addresses; Keep its API stable for every caller; Hold the business rules for its data  | Users සහ ඔවුන්ගේ addresses බලාගන්නවා; හැම caller කෙනෙකුටම API එක ස්ථාවරව තියාගන්නවා; තමන්ගේ data වල business rules තියාගන්නවා |
| Inputs            | Requests from the BFFs (or, before them, from the apps)                                                    | BFFs වලින් එන requests (ඒවාට කලින්, apps වලින්)                                                                           |
| Outputs           | General-purpose JSON answers                                                                               | General-purpose JSON උත්තර                                                                                           |
| Examples          | GET /users/u_7f3a/address                                                                                  | GET /users/u_7f3a/address                                                                                           |
| Advantages        | One owner and one API for its data; Doesn’t change for every new screen                                    | තමන්ගේ data වලට එක අයිතිකරුවෙක් සහ එක API එකක්; හැම අලුත් screen එකකටම වෙනස් වෙන්නේ නැහැ                                      |
| Limitations       | One shape for everyone: too much for some callers, too little for others                                   | හැමෝටම එකම හැඩයක්: සමහරුන්ට වැඩියි, තවත් අයට මදියි                                                                          |
| Technologies      | Spring Boot, Go, Node.js, ASP.NET Core                                                                     |                                                                                                                     |

### Recommendations (recommendations)

|                   | English                                                                                                                                 | සිංහල                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                                                         | Backend service                                                                                                                        |
| Simple summary    | Suggests other things you might like.                                                                                                   | ඔබ කැමති වෙන්න පුළුවන් වෙනත් දේවල් යෝජනා කරනවා.                                                                                               |
| Like in real life | Like the greengrocer: nice to have, but dinner works without it.                                                                        | එළවළු කඩේ වගේ: තිබුණොත් හොඳයි, ඒත් ඒක නැතුවත් රෑ කෑම හරි.                                                                                       |
| What it does      | Finds products you may like                                                                                                             | ඔබ කැමති වෙන්න පුළුවන් products හොයනවා                                                                                                      |
| Talks to          | Web BFF; Mobile BFF                                                                                                                     | Web BFF; Mobile BFF                                                                                                                    |
| Technical summary | A general-purpose service that owns product suggestions, with one REST API for every caller.                                            | Product suggestions අයිති, හැම caller කෙනෙකුටම එකම REST API එකක් දෙන general-purpose service එකක්.                                          |
| How it works      | Answers from its own data store. Its answers are “nice to have”: a screen still works without them, so callers give it a short timeout. | තමන්ගේම data store එකෙන් උත්තර දෙනවා. එහි උත්තර “තිබුණොත් හොඳයි” වර්ගයේ: ඒවා නැතුවත් screen එක වැඩ කරනවා, ඒ නිසා callers ඒකට කෙටි timeout එකක් දෙනවා. |
| Responsibilities  | Own product suggestions; Keep its API stable for every caller; Hold the business rules for its data                                     | Product suggestions බලාගන්නවා; හැම caller කෙනෙකුටම API එක ස්ථාවරව තියාගන්නවා; තමන්ගේ data වල business rules තියාගන්නවා                         |
| Inputs            | Requests from the BFFs (or, before them, from the apps)                                                                                 | BFFs වලින් එන requests (ඒවාට කලින්, apps වලින්)                                                                                              |
| Outputs           | General-purpose JSON answers                                                                                                            | General-purpose JSON උත්තර                                                                                                              |
| Examples          | GET /recommendations?for=1042                                                                                                           | GET /recommendations?for=1042                                                                                                          |
| Advantages        | One owner and one API for its data; Doesn’t change for every new screen                                                                 | තමන්ගේ data වලට එක අයිතිකරුවෙක් සහ එක API එකක්; හැම අලුත් screen එකකටම වෙනස් වෙන්නේ නැහැ                                                         |
| Limitations       | One shape for everyone: too much for some callers, too little for others                                                                | හැමෝටම එකම හැඩයක්: සමහරුන්ට වැඩියි, තවත් අයට මදියි                                                                                             |
| Technologies      | Spring Boot, Go, Node.js, ASP.NET Core                                                                                                  |                                                                                                                                        |

## Words to know

| Term                       | English                                                                                                                        | සිංහල                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Aggregation                | Turning one request into several calls to other services and combining their answers into one.                                 | එක request එකක් වෙනත් services වලට calls කිහිපයකට හරවලා, ඒවායේ උත්තර එකකට එකතු කිරීම.                                              |
| API gateway                | The single way in for every client: it handles TLS, authentication and rate limits, and routes requests on (to the BFFs here). | හැම client කෙනෙකුටම ඇතුළු වෙන එකම පාර: TLS, authentication සහ rate limits බලාගෙන requests ඉස්සරහට route කරනවා (මෙතන BFFs වලට). |
| Backend for Frontend (BFF) | A small server-side layer built for one front end, and owned by the team that builds that front end.                           | එක front end එකක් වෙනුවෙන් හදපු, ඒ front end එක හදන team එකටම අයිති පොඩි server-side layer එකක්.                                   |
| Chatty API                 | An API that needs many small calls to do one job: costly on a slow network.                                                    | එක වැඩක් කරන්න පොඩි calls ගොඩක් ඕනේ API එකක්: හෙමින් network එකක මිල අධිකයි.                                                         |
| Client-side composition    | The app calls several services itself and builds the screen from their answers.                                                | App එක තනියම services කිහිපයකට call කරලා ඒවායේ උත්තරවලින් screen එක හදනවා.                                                       |
| Code duplication           | The same logic written in more than one place, where the copies can slowly drift apart.                                        | එකම logic එක තැන් කිහිපයක ලියලා, ඒ copies ටිකෙන් ටික එකිනෙකට වෙනස් වෙන්න පුළුවන්.                                                       |
| Conway’s law               | Systems end up shaped like the teams that build them. A BFF per front-end team uses this on purpose.                           | Systems අන්තිමට හැඩගැහෙන්නේ ඒවා හදන teams වගේ. Front-end team එකකට BFF එකක් මේක හිතාමතාම පාවිච්චි කරනවා.                           |
| Experience API             | An API designed for one user experience (one app or screen), not for every caller.                                             | හැම caller කෙනෙකුටම නෙවෙයි, එක user experience එකකට (එක app එකකට හෝ screen එකකට) හදපු API එකක්.                                |
| Fan-out                    | One incoming request causing several outgoing calls at once.                                                                   | ඇතුළට එන එක request එකක් නිසා එකවර එළියට calls කිහිපයක් යාම.                                                                      |
| General-purpose API        | An API designed around a service’s own data, giving the same answer to every caller.                                           | Service එකේම data වටේ හදපු, හැම caller කෙනෙකුටම එකම උත්තරය දෙන API එකක්.                                                       |
| GraphQL                    | A query language for APIs: the client asks one endpoint for exactly the fields it needs.                                       | APIs වලට query language එකක්: client එක එක endpoint එකකින් තමන්ට ඕනේ fields විතරක් ඉල්ලනවා.                                       |
| HttpOnly cookie            | A cookie the browser sends with requests but that page scripts cannot read, so XSS can’t steal it.                             | Browser එක requests එක්ක යවන, ඒත් page scripts වලට කියවන්න බැරි cookie එකක්; ඒ නිසා XSS එකකට ඒක හොරකම් කරන්න බැහැ.                  |
| Latency                    | The time a message takes to get there and back, whatever its size. High on mobile networks.                                    | පණිවිඩයක් ප්‍රමාණය කුමක් වුණත් එහාට ගිහින් ආපහු එන්න යන කාලය. Mobile networks වල වැඩියි.                                                  |
| Over-fetching              | Receiving more data than the screen uses, then throwing the rest away.                                                         | Screen එක පාවිච්චි කරනවාට වඩා data ලබාගෙන, ඉතුරු ටික විසි කිරීම.                                                                     |
| Parallel calls             | Calls made at the same time instead of one after another: the slowest one sets the total.                                      | එකකට පස්සේ එකක් නෙවෙයි, එකම වෙලාවේ කරන calls: මුළු කාලය තීරණය කරන්නේ හෙමින්ම එක.                                                    |
| Partial response           | An answer that leaves out optional data that came too late, and says what is missing.                                          | පරක්කු වෙලා ආපු අමතර data නැතුව දෙන, නැති දේ මොකක්ද කියලා කියන උත්තරයක්.                                                             |
| Payload                    | The data in a request or response body, e.g. the JSON.                                                                         | Request එකක හෝ response එකක body එකේ තියෙන data, උදා: JSON එක.                                                              |
| Response shaping           | Choosing, renaming, merging and formatting fields so the answer fits one screen.                                               | උත්තරය එක screen එකකට ගැළපෙන්න fields තෝරලා, නම් වෙනස් කරලා, එකතු කරලා, format කිරීම.                                             |
| Round trip                 | One request travelling to a server and its answer travelling back.                                                             | එක request එකක් server එකට ගිහින් එහි උත්තරය ආපහු එන එක.                                                                          |
| Time budget                | The longest a request may take overall; each call it makes gets a timeout inside it.                                           | Request එකකට මුළුමනින්ම ගත කරන්න පුළුවන් උපරිම කාලය; එය කරන හැම call එකකටම ඒ ඇතුළේ timeout එකක් ලැබෙනවා.                              |
| Token handler              | A pattern where a backend (here the web BFF) keeps the OAuth tokens and gives the browser only a session cookie.               | Backend එකක් (මෙතන web BFF එක) OAuth tokens තියාගෙන browser එකට session cookie එකක් විතරක් දෙන pattern එකක්.                     |
| Under-fetching             | An answer that lacks a field the screen needs, so another call is required.                                                    | Screen එකට ඕනේ field එකක් උත්තරයේ නැති නිසා තවත් call එකක් ඕනේ වීම.                                                               |

## Message captions

| Message                     | English                                        | සිංහල                                      |
| --------------------------- | ---------------------------------------------- | ----------------------------------------- |
| orders-request              | The app asks Orders for the order              | App එක Orders එකෙන් order එක ඉල්ලනවා        |
| orders-response             | The whole order, for every caller (21 KB)      | හැම caller කෙනෙකුටම මුළු order එකම (KB 21)   |
| users-request               | The app asks Users for the address             | App එක Users එකෙන් address එක ඉල්ලනවා       |
| users-response              | The whole address record (3 KB)                | මුළු address record එකම (KB 3)              |
| recommendations-request     | The app asks for suggestions                   | App එක suggestions ඉල්ලනවා                 |
| recommendations-response    | Twelve suggestions with images (14 KB)         | Images එක්ක suggestions දොළහක් (KB 14)      |
| delivery-request            | The web page asks again, for the delivery date | Web page එක delivery දිනය ඉල්ලලා ආයෙත් අහනවා |
| delivery-response           | The delivery estimate                          | Delivery ඇස්තමේන්තුව                         |
| web-screen-request          | The browser asks the Web BFF for the screen    | Browser එක Web BFF එකෙන් screen එක ඉල්ලනවා  |
| mobile-screen-request       | The app asks the Mobile BFF for the screen     | App එක Mobile BFF එකෙන් screen එක ඉල්ලනවා   |
| bff-orders-request          | The BFF asks Orders                            | BFF එක Orders එකෙන් අහනවා                  |
| bff-users-request           | The BFF asks Users                             | BFF එක Users එකෙන් අහනවා                   |
| bff-recommendations-request | The BFF asks for three suggestions             | BFF එක suggestions තුනක් ඉල්ලනවා             |
| web-response                | The web screen’s answer (38 KB)                | Web screen එකේ උත්තරය (KB 38)              |
| mobile-response             | The mobile screen’s answer (4 KB)              | Mobile screen එකේ උත්තරය (KB 4)            |
| partial-response            | The answer without suggestions                 | Suggestions නැති උත්තරය                     |
| late-response               | Recommendations answers too late               | Recommendations පරක්කු වෙලා උත්තර දෙනවා      |
| web-response-v2             | The web answer, now with the delivery day      | Web උත්තරය, දැන් delivery දවසත් එක්ක          |

## Scene badges

`{count}` is replaced by a number in the scene.

| Badge       | English                    | සිංහල                     |
| ----------- | -------------------------- | ------------------------ |
| calls-1     | 1 call · {count} ms        | call 1 · {count} ms      |
| calls-2     | 2 calls · {count} ms       | call 2 · {count} ms      |
| calls-3     | 3 calls · {count} ms       | call 3 · {count} ms      |
| received    | {count} KB received        | KB {count}ක් ලැබුණා        |
| waste       | 38 KB received · 4 KB used | KB 38ක් ආවා · KB 4යි පාවිච්චි |
| extra-call  | 1 more call needed         | තවත් call එකක් ඕනේ         |
| size        | {count} KB                 | KB {count}               |
| web-team    | web team                   | web team                 |
| mobile-team | mobile team                | mobile team              |
| copies      | same rule, 2 copies        | එකම rule එක, copies 2ක්   |
| slow        | slow                       | හෙමින්                     |
| budget      | waiting · {count} ms       | බලන් ඉන්නවා · {count} ms   |
| partial     | partial                    | අර්ධ                      |
| dropped     | late answer dropped        | පරක්කු උත්තරය අතහැරියා       |
| deploying   | deploying                  | deploy වෙනවා             |
| version     | v2.5                       | v2.5                     |
| unchanged   | unchanged                  | වෙනසක් නැහැ               |
| arrives     | arrives Thursday           | බ්‍රහස්පතින්දා එනවා          |
| as-before   | as before                  | කලින් වගේම                 |

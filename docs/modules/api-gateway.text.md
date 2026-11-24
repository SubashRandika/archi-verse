# API Gateway module text (English and Sinhala)

- **Generated** from `src/content/modules/api-gateway/text/` (the source of truth since the
  Phase 5 language change). Edit the TypeScript files, not this document.
- **Beginner** is written as if for a five-year-old, with an everyday example.
  **Advanced** keeps the technical depth and adds a worked example.
- **Sinhala** uses a friendly spoken style; technical terms stay in English.
- The learning objectives, running example and scene notes are in
  [api-gateway.md](api-gateway.md).

---

## Main path

## The request · Request එක

### 1. Meet the client · Client හඳුනාගනිමු

**Watch:** The browser on the left lights up. Everything else waits for it to ask.

**බලන්න:** වම් පැත්තේ තියෙන browser එක දැල්වෙනවා. අනිත් හැම දෙයක්ම එය ඉල්ලීමක් කරනකම් බලාගෙන ඉන්නවා.

#### Beginner

**In simple words**

This is the browser: the app on your computer or phone. You open the shop’s website because you want to see your orders.

But your orders are not inside your computer. They are kept on the shop’s computers, far away. So the browser has to ask for them. Asking is called sending a request.

The browser knows only one address to ask: api.shop.example. It doesn’t know what is behind that address, and it doesn’t need to.

**Like in real life**

When you want a pizza, you don’t walk into the kitchen. You call one phone number. Who answers, who cooks and who drives is the restaurant’s business, not yours. The browser works the same way: one number to call, and the shop sorts out the rest.

**සරලව කිව්වොත්**

මේ තමයි browser එක: ඔබේ computer එකේ හෝ phone එකේ තියෙන app එක. ඔබට ඔබේ orders බලන්න ඕන නිසා ඔබ කඩේ website එක open කරනවා.

නමුත් ඔබේ orders තියෙන්නේ ඔබේ computer එක ඇතුළේ නෙවෙයි. ඒවා තියෙන්නේ ගොඩක් ඈත තියෙන කඩේ computers වල. ඒ නිසා browser එකට ඒවා ඉල්ලන්න වෙනවා. මේ ඉල්ලීමට කියන්නේ request එකක් යවනවා කියලා.

Browser එක දන්නේ ඉල්ලන්න එකම ලිපිනයක් විතරයි: api.shop.example. ඒ ලිපිනය පිටිපස්සේ මොනවද තියෙන්නේ කියලා එය දන්නේ නැහැ, දැනගන්න ඕනත් නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබට pizza එකක් ඕන වුණාම ඔබ කුස්සියට ඇතුළු වෙන්නේ නැහැ. ඔබ එක phone අංකයකට කතා කරනවා. කවුද උත්තර දෙන්නේ, කවුද උයන්නේ, කවුද ගෙනත් දෙන්නේ කියන එක restaurant එකේ වැඩක්, ඔබේ නෙවෙයි. Browser එකත් ඒ වගේමයි: කතා කරන්න එක අංකයයි, ඉතුරු ටික කඩේ බලාගන්නවා.

#### Advanced

**How it works**

The client is a single-page app served from shop.example, calling an API on a different origin, api.shop.example. Because the request carries an Authorization header, it is not a CORS “simple request”: the browser first sends an OPTIONS preflight, and only sends the real request if the API answers with matching Access-Control-Allow-* headers. The preflight result can be cached (Access-Control-Max-Age), so it is usually paid once per session, not per call.

The client is deliberately unaware of the topology behind the API. One host, one auth scheme and one error format keep it simple, and let the backend change without a client release.

**Example**

Before the first call, the browser sends this preflight and gets permission back. For the next 600 seconds it skips the preflight for the same request.

_Preflight and answer_

```http
OPTIONS /api/orders?status=open HTTP/1.1
Origin: https://shop.example
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://shop.example
Access-Control-Allow-Headers: authorization
Access-Control-Max-Age: 600
```

**මෙය වැඩ කරන හැටි**

මෙහි client එක shop.example එකෙන් serve කරන single-page app එකක්. එය api.shop.example කියන වෙනත් origin එකක තියෙන API එකකට call කරනවා. Request එකේ Authorization header එකක් තියෙන නිසා මෙය CORS “simple request” එකක් නෙවෙයි: browser එක මුලින්ම OPTIONS preflight එකක් යවනවා, API එක ගැළපෙන Access-Control-Allow-* headers එක්ක උත්තර දුන්නොත් විතරයි සැබෑ request එක යවන්නේ. Preflight ප්‍රතිඵලය cache කරන්න පුළුවන් (Access-Control-Max-Age), ඒ නිසා සාමාන්‍යයෙන් ඒ වියදම දරන්න වෙන්නේ හැම call එකකටම නෙවෙයි, session එකකට එක පාරක් විතරයි.

API එක පිටිපස්සේ තියෙන topology එක ගැන client එක හිතාමතාම දන්නේ නැහැ. එක host එකක්, එක auth scheme එකක් සහ එක error format එකක් නිසා client එක සරලව තියෙනවා, ඒ වගේම client release එකක් නැතුව backend එක වෙනස් කරන්නත් පුළුවන්.

**උදාහරණය**

පළමු call එකට කලින් browser එක මේ preflight එක යවලා අවසරය ලබාගන්නවා. ඊළඟ තත්පර 600 ඇතුළත එම request එකටම එය ආයෙ preflight එකක් යවන්නේ නැහැ.

_Preflight එක සහ උත්තරය_

```http
OPTIONS /api/orders?status=open HTTP/1.1
Origin: https://shop.example
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://shop.example
Access-Control-Allow-Headers: authorization
Access-Control-Max-Age: 600
```

_Words to know:_ Client, Origin, CORS preflight

---

### 2. Anatomy of an HTTP request · HTTP request එකක කොටස්

**Watch:** A blue packet appears next to the browser. That packet is the request. Click it to read what is inside.

**බලන්න:** Browser එක ළඟ නිල් පාට packet එකක් පේනවා. ඒ packet එක තමයි request එක. ඇතුළේ මොනවද තියෙන්නේ කියලා කියවන්න එය click කරන්න.

#### Beginner

**In simple words**

Before anything moves, the browser writes the request. A request has four parts:

- **Method:** what you want to do. GET means “please give me”.
- **Path:** which thing you want. Here: my open orders.
- **Headers:** little notes, like “this is who I am” (the token) and “please answer in a way I can read”.
- **Body:** something you send along. A GET request has none, because it only asks.

**Like in real life**

It is like posting a letter. The first line says what you want: “please send me…” (the method). The address says where it goes (the path). On the back you write who it is from (the headers). And sometimes there is something inside the envelope (the body).

**සරලව කිව්වොත්**

කිසිම දෙයක් ගමන් කරන්න කලින්, browser එක request එක ලියනවා. Request එකක කොටස් හතරක් තියෙනවා:

- **Method:** ඔබට කරන්න ඕන දේ. GET කියන්නේ “කරුණාකර මට දෙන්න” කියන එක.
- **Path:** ඔබට ඕන මොන දේද කියන එක. මෙතනදී: මගේ open orders.
- **Headers:** පොඩි සටහන්. උදාහරණයක් විදිහට “මම මේ කෙනායි” (token එක) සහ “මට කියවන්න පුළුවන් විදිහට උත්තර දෙන්න”.
- **Body:** request එකත් එක්ක යවන දෙයක්. GET request එකක body එකක් නැහැ, මොකද ඒකෙන් කරන්නේ ඉල්ලන එක විතරයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

මේක ලියුමක් post කරනවා වගේ. මුල් පේළියෙන් ඔබට ඕන දේ කියනවා: “කරුණාකර මට එවන්න…” (method එක). ලිපිනයෙන් කියනවා එය යන්න ඕන කොහෙටද කියලා (path එක). පිටිපස්සේ ලියනවා කවුද එවන්නේ කියලා (headers). සමහර වෙලාවට කවරය ඇතුළේ මොනවා හරි තියෙනවා (body එක).

#### Advanced

**How it works**

An HTTP request is a method, a target, header fields and an optional body. HTTP/2 and HTTP/3 keep these semantics but encode them as binary frames: the method and path travel as pseudo-headers (:method, :path), and header fields are compressed with HPACK or QPACK.

- **Safe and idempotent:** GET must not change server state. That is what lets gateways, CDNs and clients cache it and retry it (scenario “Timeout, then retry”).
- **Authorization:** carries a signed JWT. The gateway verifies it in step 5 without calling the identity provider.
- **Accept:** starts content negotiation. A server that cannot produce JSON should answer 406 Not Acceptable.

**Example**

Over HTTP/2 the start line becomes pseudo-headers: :method GET, :scheme https, :authority api.shop.example, :path /api/orders?status=open. The long Authorization value is sent in full once; later requests on the same connection refer to it in the HPACK table with a byte or two.

**මෙය වැඩ කරන හැටි**

HTTP request එකක් කියන්නේ method එකක්, target එකක්, header fields සහ අවශ්‍ය නම් body එකක්. HTTP/2 සහ HTTP/3 මේ අර්ථයම තියාගන්නවා, නමුත් ඒවා binary frames විදිහට encode කරනවා: method එක සහ path එක pseudo-headers (:method, :path) විදිහට යනවා, header fields HPACK හෝ QPACK වලින් compress කරනවා.

- **Safe සහ idempotent:** GET එකකින් server state එක වෙනස් වෙන්න බැහැ. ඒ නිසයි gateways, CDNs සහ clients වලට එය cache කරන්නත් retry කරන්නත් පුළුවන් වෙන්නේ (“Timeout, ඊට පස්සේ retry” scenario එක).
- **Authorization:** signed JWT එකක් රැගෙන යනවා. Gateway එක 5 වෙනි පියවරේදී identity provider එකට call කරන්නේ නැතුව එය verify කරනවා.
- **Accept:** content negotiation පටන් ගන්නවා. JSON නිපදවන්න බැරි server එකක් 406 Not Acceptable කියලා උත්තර දෙන්න ඕන.

**උදාහරණය**

HTTP/2 හරහා start line එක pseudo-headers බවට පත් වෙනවා: :method GET, :scheme https, :authority api.shop.example, :path /api/orders?status=open. දිගු Authorization අගය සම්පූර්ණයෙන් යවන්නේ එක පාරයි; එම connection එකේම පස්සේ යන requests HPACK table එකේ byte එකකින් දෙකකින් ඒකට යොමු වෙනවා.

_Words to know:_ HTTP method, Header, Bearer token, Idempotent · _Message:_ The request the browser sends

---

### 3. Across the network · Network එක හරහා

**Watch:** The blue packet travels from the browser, past two internet stops, to the gateway.

**බලන්න:** නිල් packet එක browser එකේ ඉඳන් internet නැවතුම් දෙකක් පහු කරගෙන gateway එකට යනවා.

#### Beginner

**In simple words**

Now the request travels across the internet. First the browser has to find out where api.shop.example lives. It asks DNS, which works like the contacts on a phone: you know the name, and DNS gives you the number.

Then the browser and the shop agree on a secret code, so nobody on the way can read or change the request. That is what the padlock in the address bar means.

On its way, the request hops through many computers, one after another.

**Like in real life**

Think of sending a parcel to a friend in another city. The post office looks up the address, the box is sealed so nobody can peek, and it passes through a few sorting centres. The further away your friend lives, the longer it takes, even when everything goes well.

That is why the browser keeps the road open after the first trip, and uses it again for the next requests.

**සරලව කිව්වොත්**

දැන් request එක internet එක හරහා ගමන් කරනවා. මුලින්ම browser එකට api.shop.example තියෙන්නේ කොහෙද කියලා හොයාගන්න වෙනවා. ඒකට එය DNS එකෙන් අහනවා. DNS වැඩ කරන්නේ phone එකේ contacts list එක වගේ: ඔබ නම දන්නවා, DNS එකෙන් අංකය දෙනවා.

ඊට පස්සේ browser එකයි කඩෙයි රහස් කේතයකට එකඟ වෙනවා. එතකොට අතරමගදී කාටවත් request එක කියවන්නවත් වෙනස් කරන්නවත් බැහැ. Address bar එකේ තියෙන padlock ලකුණෙන් කියන්නේ ඒකයි.

ගමනේදී request එක එකින් එකට computers ගොඩක් හරහා පනිනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

වෙන නගරයක ඉන්න යාළුවෙකුට පාර්සලයක් යවනවා කියලා හිතන්න. තැපැල් කන්තෝරුව ලිපිනය හොයනවා, කාටවත් ඇතුළ බලන්න බැරි වෙන්න පෙට්ටිය සීල් කරනවා, ඊට පස්සේ එය වර්ග කරන මධ්‍යස්ථාන කිහිපයක් හරහා යනවා. යාළුවා ඉන්නේ ඈතින් නම්, හැම දෙයක්ම හරියට සිද්ධ වුණත්, ළඟා වෙන්න වැඩි කාලයක් යනවා.

ඒ නිසයි browser එක පළමු ගමනෙන් පස්සෙත් පාර ඇරලම තියාගෙන, ඊළඟ requests වලටත් ඒ පාරම පාවිච්චි කරන්නේ.

#### Advanced

**How it works**

A cold request pays for DNS resolution, a TCP handshake (1 round trip) and a TLS 1.3 handshake (1 more round trip) before the first byte of HTTP. HTTP/3 runs over QUIC, which merges the transport and TLS handshakes into a single round trip, and both TLS 1.3 and QUIC support 0-RTT resumption (only safe for idempotent requests, because 0-RTT data can be replayed).

In practice the connection is warm: HTTP/2 or HTTP/3 multiplexes many requests over one connection, so the per-request cost is one network round trip. Real deployments usually put a CDN or a load balancer in front of the gateway; this scene leaves them out to keep the focus on the gateway.

**Example**

_A user about 1,000 km away (one round trip ≈ 30 ms)_

| Request                             |                  Time |
| ----------------------------------- | --------------------: |
| Cold: DNS + TCP + TLS 1.3 + request | ~20 + 30 + 30 + 30 ms |
| Cold over HTTP/3 (QUIC)             |      ~20 + 30 + 30 ms |
| **Warm connection (most requests)** |            **~30 ms** |

**මෙය වැඩ කරන හැටි**

Cold request එකකදී HTTP වල පළමු byte එකට කලින් DNS resolution, TCP handshake එකක් (එක round trip එකක්) සහ TLS 1.3 handshake එකක් (තවත් round trip එකක්) සඳහා කාලය වැය වෙනවා. HTTP/3 run වෙන්නේ QUIC උඩ; QUIC එකෙන් transport සහ TLS handshakes එකම round trip එකකට එකතු කරනවා. TLS 1.3 සහ QUIC දෙකම 0-RTT resumption වලට සහාය දෙනවා (නමුත් එය ආරක්ෂිත වෙන්නේ idempotent requests වලට විතරයි, මොකද 0-RTT data replay කරන්න පුළුවන්).

ප්‍රායෝගිකව connection එක warm: HTTP/2 හෝ HTTP/3 එකම connection එකක් උඩ requests ගොඩක් multiplex කරනවා, ඒ නිසා එක request එකකට වැය වෙන්නේ network round trip එකක් විතරයි. සැබෑ deployments වල සාමාන්‍යයෙන් gateway එකට ඉස්සරහින් CDN එකක් හෝ load balancer එකක් තියෙනවා; gateway එක ගැන අවධානය තියාගන්න මේ scene එකේ ඒවා පෙන්නලා නැහැ.

**උදාහරණය**

_කි.මී. 1,000ක් පමණ ඈතින් ඉන්න user කෙනෙක් (එක round trip එකක් ≈ 30 ms)_

| Request                             |                  කාලය |
| ----------------------------------- | --------------------: |
| Cold: DNS + TCP + TLS 1.3 + request | ~20 + 30 + 30 + 30 ms |
| HTTP/3 (QUIC) හරහා cold             |      ~20 + 30 + 30 ms |
| **Warm connection (බොහෝ requests)** |            **~30 ms** |

_Words to know:_ DNS, TLS, Round trip (RTT) · _Message:_ The request the browser sends

---

## The gateway · Gateway එක

### 4. One front door · එකම ඉදිරි දොරටුව

**Watch:** The first light on the gateway, TLS, turns on. Behind it, the services wait their turn.

**බලන්න:** Gateway එකේ පළමු පහන, TLS, දැල්වෙනවා. ඒ පිටිපස්සේ services තමන්ගේ වාරය එනකම් බලාගෙන ඉන්නවා.

#### Beginner

**In simple words**

The request arrives at the API gateway. The gateway is the front door of the whole system. Every request from outside comes in here, and nowhere else.

Behind the door are the services that do the real work. They never talk to the outside world themselves.

First, the gateway opens the sealed envelope (the TLS light), so it can read the request.

**Like in real life**

Think of a big hotel. Guests don’t wander the corridors looking for a room. They go to the reception desk. Reception checks who they are, makes sure they are allowed in, and tells them where to go. The gateway is that reception desk, for requests.

**සරලව කිව්වොත්**

Request එක API gateway එකට ළඟා වෙනවා. Gateway එක කියන්නේ මුළු system එකේම ඉදිරි දොරටුව. පිටින් එන හැම request එකක්ම ඇතුළු වෙන්නේ මෙතනින් විතරයි, වෙන කොහෙන්වත් නෙවෙයි.

දොරටුව පිටිපස්සේ ඉන්නේ සැබෑ වැඩේ කරන services. ඒවා කවදාවත් පිට ලෝකය එක්ක කෙලින්ම කතා කරන්නේ නැහැ.

මුලින්ම gateway එක සීල් කරපු කවරය අරිනවා (TLS පහන). එතකොට එයට request එක කියවන්න පුළුවන්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ලොකු hotel එකක් ගැන හිතන්න. අමුත්තෝ කාමරයක් හොයාගෙන corridors වල ඇවිදින්නේ නැහැ. ඔවුන් reception එකට යනවා. Reception එක ඔවුන් කවුද කියලා බලනවා, ඇතුළට එන්න අවසර තියෙනවද කියලා තහවුරු කරනවා, කොහෙද යන්න ඕන කියලා කියනවා. Requests වලට gateway එක තමයි ඒ reception එක.

#### Advanced

**How it works**

An API gateway is a reverse proxy that is the single entry point for client (“north–south”) traffic. It terminates TLS and applies cross-cutting concerns once, before any service is involved: authentication, rate limiting, validation, routing, observability. Services stay focused on business logic, and the internal topology stays private.

- **vs. load balancer:** a load balancer spreads connections across instances; a gateway also understands the API (paths, methods, identities). Many gateways include load balancing.
- **vs. service mesh:** a mesh handles service-to-service (“east–west”) traffic inside the system. Gateway and mesh are complementary.
- **Availability:** the gateway is on every request’s path, so it runs as several identical, stateless replicas. Shared state such as rate-limit counters lives in a separate store.

**Example**

An Envoy listener on port 443 holds the certificate for api.shop.example and terminates TLS. Its route table sends /api/orders/* to the orders cluster and /api/users/* to the users cluster. Clients never see orders.internal, so the team can split, merge or move services without a client release.

**මෙය වැඩ කරන හැටි**

API gateway එකක් කියන්නේ client (“north–south”) traffic වලට ඇතුළු වෙන එකම තැන වෙන reverse proxy එකක්. එය TLS terminate කරනවා, ඕනම service එකක් සම්බන්ධ වෙන්න කලින් cross-cutting concerns එක පාරක් යොදනවා: authentication, rate limiting, validation, routing, observability. ඒ නිසා services business logic එකට විතරක් අවධානය දෙනවා, ඇතුළේ topology එක පෞද්ගලිකව තියෙනවා.

- **Load balancer එකට සාපේක්ෂව:** load balancer එකක් connections instances අතරේ බෙදනවා; gateway එකක් API එකත් තේරුම් ගන්නවා (paths, methods, identities). ගොඩක් gateways වල load balancing ඇතුළත් වෙනවා.
- **Service mesh එකට සාපේක්ෂව:** mesh එකක් system එක ඇතුළේ service-to-service (“east–west”) traffic හසුරුවනවා. Gateway එකයි mesh එකයි එකිනෙකට අනුපූරකයි.
- **Availability:** gateway එක හැම request එකකම පාරේ තියෙන නිසා, එය සමාන, stateless replicas කිහිපයක් විදිහට run වෙනවා. Rate-limit counters වගේ shared state වෙනම store එකක තියෙනවා.

**උදාහරණය**

Port 443 උඩ තියෙන Envoy listener එකක් api.shop.example සඳහා certificate එක තියාගෙන TLS terminate කරනවා. එහි route table එක /api/orders/* orders cluster එකටත්, /api/users/* users cluster එකටත් යවනවා. Clients කවදාවත් orders.internal දකින්නේ නැති නිසා, client release එකක් නැතුව team එකට services බෙදන්න, එකතු කරන්න හෝ තැන මාරු කරන්න පුළුවන්.

_Words to know:_ Reverse proxy, TLS termination, North–south traffic · _Message:_ The request the browser sends

---

### 5. Authentication · Authentication

**Watch:** The second light on the gateway, Authentication, turns on. The dashed line to the identity provider glows: the key the gateway checks with came from there earlier.

**බලන්න:** Gateway එකේ දෙවෙනි පහන, Authentication, දැල්වෙනවා. Identity provider එකට තියෙන කඩ ඉරි ඉර බබළනවා: gateway එක පරීක්ෂා කරන key එක කලින් ආවේ එතනින්.

#### Beginner

**In simple words**

Before the gateway lets your request in, it checks your pass. The pass is called a token. You got it from the identity provider when you signed in.

The gateway asks three questions about the token:

- Is it real?
- Is it still valid?
- Is it meant for this API?

If all three answers are yes, the request may go on.

**Like in real life**

Think of a school trip to a museum. At the door, a guard looks at your ticket. Is it a real ticket, not one you drew yourself? Is it for today, not last week? Is it for this museum, not the zoo? If all three answers are yes, you can go in.

The guard doesn’t phone the ticket office for every child. They know what the real stamp looks like. The gateway is the same: it checks the token’s signature itself, without asking the identity provider.

**සරලව කිව්වොත්**

ඔබේ request එක ඇතුළට ගන්න කලින්, gateway එක ඔබේ අවසර පත්‍රය පරීක්ෂා කරනවා. මේ අවසර පත්‍රයට කියන්නේ token එක කියලා. ඔබ sign in වුණු වෙලාවේ identity provider එකෙන් ඔබට එය ලැබුණා.

Gateway එක token එක ගැන ප්‍රශ්න තුනක් අහනවා:

- මේක ඇත්තද?
- මේක තවම වලංගුද?
- මේක මේ API එකටමද?

උත්තර තුනම “ඔව්” නම්, request එකට ඉස්සරහට යන්න පුළුවන්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

පාසලෙන් කෞතුකාගාරයකට ගිය චාරිකාවක් ගැන හිතන්න. දොරටුවේ ඉන්න මුරකරු ඔබේ ටිකට් පත බලනවා. මේක ඇත්ත ටිකට් පතක්ද, තමන්ම ඇඳපු එකක් නෙවෙයි නේද? මේක අදට වලංගුද, පහුගිය සතියේ එකක් නෙවෙයි නේද? මේක මේ කෞතුකාගාරයටමද, සත්වෝද්‍යානයට එකක් නෙවෙයි නේද? උත්තර තුනම “ඔව්” නම්, ඔබට ඇතුළට යන්න පුළුවන්.

මුරකරු හැම ළමයෙක් වෙනුවෙන්ම ටිකට් කාර්යාලයට කතා කරලා අහන්නේ නැහැ. ඇත්ත මුද්‍රාව පේන්නේ කොහොමද කියලා එයා දන්නවා. Gateway එකත් ඒ වගේමයි: identity provider එකෙන් අහන්නේ නැතුව, token එකේ signature එක තමන්ම පරීක්ෂා කරනවා.

#### Advanced

**How it works**

The token is a JWT signed with the identity provider’s private key (for example RS256 or ES256). The gateway selects the public key by the token’s kid from a cached JWKS document (refreshed periodically and on an unknown kid, which supports key rotation), verifies the signature, then checks claims: exp and nbf (time), iss (issuer) and aud (audience).

- **Self-contained vs. opaque tokens:** an opaque token would need an introspection call to the identity provider per request (or a cache). JWTs avoid the round trip, at the cost of not being revocable before they expire, which is why they are short-lived.
- **Authentication vs. authorization:** the gateway usually does coarse checks (valid user, required scope such as orders:read). “May this user see order 1042?” is business logic and belongs in the Orders service (step 8).
- **Identity downstream:** on success the gateway forwards the caller’s identity to the service, for example an X-User-Id header or the validated token itself.

**Example**

The token’s header names key k1. The gateway finds k1 in its cached JWKS, verifies the signature, then checks the claims below: the issuer and audience match, the scope includes orders:read, and it expires in 3 minutes 40 seconds. The request goes on with X-User-Id: u_7f3a.

_Token header and claims (decoded)_

```json
{ "alg": "RS256", "kid": "k1" }
{
  "iss": "https://id.shop.example",
  "aud": "api.shop.example",
  "sub": "u_7f3a",
  "scope": "orders:read",
  "exp": 1795515300
}
```

**මෙය වැඩ කරන හැටි**

Token එක කියන්නේ identity provider එකේ private key එකෙන් sign කරපු JWT එකක් (උදාහරණ: RS256 හෝ ES256). Gateway එක token එකේ kid එක අනුව, cache කරපු JWKS document එකෙන් public key එක තෝරගන්නවා (මෙය වරින් වර refresh වෙනවා, නොදන්නා kid එකක් ආවොත් වහාම refresh වෙනවා; key rotation වලට සහාය දෙන්නේ මේ විදිහට). ඊට පස්සේ signature එක verify කරලා claims පරීක්ෂා කරනවා: exp සහ nbf (කාලය), iss (issuer) සහ aud (audience).

- **Self-contained සහ opaque tokens:** opaque token එකකට හැම request එකකටම identity provider එකට introspection call එකක් (නැත්නම් cache එකක්) ඕන වෙනවා. JWTs ඒ round trip එක මඟහරිනවා; නමුත් කල් ඉකුත් වෙන්න කලින් ඒවා revoke කරන්න බැහැ. ඒ නිසයි ඒවායේ ආයු කාලය කෙටි.
- **Authentication සහ authorization:** gateway එක සාමාන්‍යයෙන් කරන්නේ පුළුල් පරීක්ෂාවන් (වලංගු user කෙනෙක්ද, orders:read වගේ අවශ්‍ය scope එක තියෙනවද). “මේ user ට order 1042 බලන්න පුළුවන්ද?” කියන එක business logic; එය අයිති Orders service එකට (8 වෙනි පියවර).
- **Identity එක ඉදිරියට:** සාර්ථක වුණොත් gateway එක caller ගේ identity එක service එකට යවනවා, උදාහරණයක් විදිහට X-User-Id header එකක් හෝ validate කරපු token එකම.

**උදාහරණය**

Token එකේ header එකේ k1 key එක සඳහන් වෙනවා. Gateway එක cache කරපු JWKS එකෙන් k1 හොයාගෙන signature එක verify කරනවා, ඊට පස්සේ පහළ තියෙන claims පරීක්ෂා කරනවා: issuer සහ audience ගැළපෙනවා, scope එකේ orders:read තියෙනවා, ඒ වගේම එය කල් ඉකුත් වෙන්න තව විනාඩි 3යි තත්පර 40ක් තියෙනවා. Request එක X-User-Id: u_7f3a එක්ක ඉදිරියට යනවා.

_Token header එක සහ claims (decode කරපු)_

```json
{ "alg": "RS256", "kid": "k1" }
{
  "iss": "https://id.shop.example",
  "aud": "api.shop.example",
  "sub": "u_7f3a",
  "scope": "orders:read",
  "exp": 1795515300
}
```

_Words to know:_ JWT, JWKS, Claims, Authentication vs. authorization · _Message:_ The request the browser sends

---

### 6. Rate limiting · Rate limiting

**Watch:** The third light, Rate limit, turns on. The badge on the gateway goes from 58 to 57 of 60 left.

**බලන්න:** තුන්වෙනි පහන, Rate limit, දැල්වෙනවා. Gateway එකේ badge එක “58 of 60 left” ඉඳන් “57 of 60 left” වෙනවා.

#### Beginner

**In simple words**

Every app gets an allowance: for example, 60 requests every minute. Each request uses one. The allowance slowly fills up again over time. The badge on the gateway shows how many are left.

Why? If a broken app sends thousands of requests, or someone tries to flood the shop, they run out of allowance and are stopped at the door. The services behind it stay safe. Normal apps never notice the limit.

**Like in real life**

At a fun fair, you get a cup with 60 tokens for the rides. Each ride costs one token, and a helper drops one new token into your cup every second. If you spend tokens faster than they come back, your cup is empty and you have to wait.

The gateway works exactly like this. The idea is even called a “token bucket”.

**සරලව කිව්වොත්**

හැම app එකකටම දීමනාවක් (allowance එකක්) ලැබෙනවා: උදාහරණයක් විදිහට විනාඩියකට requests 60ක්. හැම request එකකටම එකක් වැය වෙනවා. කාලයත් එක්ක දීමනාව හෙමින් ආයෙත් පිරෙනවා. Gateway එකේ badge එකෙන් තව කීයක් ඉතුරුද කියලා පෙන්නනවා.

ඇයි? කැඩුණු app එකක් requests දහස් ගණනක් යැව්වොත්, නැත්නම් කවුරුහරි කඩේ requests වලින් යටකරන්න හැදුවොත්, ඔවුන්ගේ දීමනාව ඉවර වෙලා දොරටුවේදීම නවත්වනවා. ඒ පිටිපස්සේ තියෙන services ආරක්ෂිතව තියෙනවා. සාමාන්‍ය apps වලට මේ සීමාව දැනෙන්නේවත් නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කානිවල් එකකදී ඔබට සෙල්ලම් කරන්න tokens 60ක් තියෙන කෝප්පයක් ලැබෙනවා. හැම සෙල්ලමකටම token එකක් වැය වෙනවා, උදව්කරුවෙක් හැම තත්පරයකටම අලුත් token එකක් ඔබේ කෝප්පයට දානවා. Tokens ආපහු එනවාට වඩා ඉක්මනට ඔබ වියදම් කළොත්, කෝප්පය හිස් වෙලා ඔබට ඉන්න වෙනවා.

Gateway එක වැඩ කරන්නෙත් හරියටම මේ විදිහට. මේ අදහසට කියන්නෙත් “token bucket” කියලා.

#### Advanced

**How it works**

A common algorithm is the token bucket: a bucket of capacity b refills at rate r; each request takes a token or is rejected. It allows short bursts up to b while enforcing an average of r. Sliding-window counters are the main alternative.

- Limits are keyed by API key, user or IP, and often differ by route or plan.
- Because the gateway runs as several replicas, counters live in a shared, fast store (typically Redis, not drawn). That is one network round trip, so some gateways trade exactness for speed with local counters that sync periodically.
- Rejected requests get 429 Too Many Requests with Retry-After. The IETF draft RateLimit and RateLimit-Policy headers also tell clients their remaining allowance.

**Example**

With b = 60 and r = 1 token per second, a client that was idle for a minute can send 60 requests at once, then about one per second. In Redis the gateway keeps two numbers per client (tokens left, time of the last refill) and updates them in one atomic step, so all gateway replicas share the same count.

**මෙය වැඩ කරන හැටි**

බහුලව පාවිච්චි වෙන algorithm එකක් තමයි token bucket එක: ධාරිතාව b වන bucket එකක් r වේගයෙන් ආයෙත් පිරෙනවා; හැම request එකක්ම token එකක් ගන්නවා, නැත්නම් reject වෙනවා. එය b දක්වා කෙටි bursts වලට ඉඩ දෙන අතරම සාමාන්‍යය r ට සීමා කරනවා. ප්‍රධාන විකල්පය sliding-window counters.

- Limits තීරණය කරන්නේ API key එක, user හෝ IP එක අනුව; බොහෝ විට route එක හෝ plan එක අනුවත් ඒවා වෙනස් වෙනවා.
- Gateway එක replicas කිහිපයක් විදිහට run වෙන නිසා, counters තියෙන්නේ shared, වේගවත් store එකක (සාමාන්‍යයෙන් Redis; scene එකේ පෙන්නලා නැහැ). ඒකට network round trip එකක් යනවා, ඒ නිසා සමහර gateways වරින් වර sync වෙන local counters පාවිච්චි කරලා, නිරවද්‍යතාව ටිකක් අඩු කරලා වේගය ලබාගන්නවා.
- Reject වෙන requests වලට Retry-After එක්ක 429 Too Many Requests ලැබෙනවා. IETF draft එකේ තියෙන RateLimit සහ RateLimit-Policy headers වලින් clients ලට ඉතුරු දීමනාවත් කියනවා.

**උදාහරණය**

b = 60 සහ තත්පරයකට r = token 1 නම්, විනාඩියක් නිෂ්ක්‍රියව හිටපු client කෙනෙකුට එකවර requests 60ක් යවන්න පුළුවන්, ඊට පස්සේ තත්පරයකට එකක් පමණ. Redis එකේ gateway එක එක client කෙනෙකුට අංක දෙකක් තියාගන්නවා (ඉතුරු tokens, අන්තිමට පිරවූ වෙලාව), ඒවා එකම atomic පියවරකින් update කරනවා. ඒ නිසා හැම gateway replica එකක්ම එකම ගණන බෙදාගන්නවා.

_Words to know:_ Token bucket, 429 Too Many Requests, Retry-After · _Message:_ The request the browser sends

---

### 7. Validation and routing · Validation සහ routing

**Watch:** The last two lights, Validation and Routing, turn on. Then the request goes to Orders service #1. Click the packet to see what the gateway added.

**බලන්න:** අන්තිම පහන් දෙක, Validation සහ Routing, දැල්වෙනවා. ඊට පස්සේ request එක Orders service #1 ට යනවා. Gateway එක එකතු කරපු දේවල් බලන්න packet එක click කරන්න.

#### Beginner

**In simple words**

Two last checks at the door. First: is the request written correctly? If something is missing or makes no sense, the gateway answers straight away with an error. The services never see broken requests.

Then: where should it go? The gateway has a list that says “anything about orders goes to the Orders service”. There are two copies of the Orders service, so the gateway picks one, to share the work fairly. Here it picks copy #1.

**Like in real life**

At the post office, the clerk first checks that your parcel has an address and a stamp. If not, it comes straight back to you. If it is fine, the clerk reads the address and puts the parcel in the right bag. When two vans go to the same town, the clerk fills them in turn, so neither van gets too full.

**සරලව කිව්වොත්**

දොරටුවේදී අන්තිම පරීක්ෂාවන් දෙකක්. පළමුවැන්න: request එක හරියට ලියලා තියෙනවද? මොනවා හරි අඩු නම්, නැත්නම් තේරුමක් නැත්නම්, gateway එක වහාම error එකකින් උත්තර දෙනවා. කැඩුණු requests කවදාවත් services වලට පේන්නේ නැහැ.

ඊළඟට: මේක යන්න ඕන කොහෙටද? Gateway එක ළඟ ලැයිස්තුවක් තියෙනවා. ඒකේ කියනවා “orders ගැන ඕනම දෙයක් Orders service එකට යවන්න” කියලා. Orders service එකේ පිටපත් දෙකක් තියෙනවා, ඒ නිසා වැඩේ සාධාරණව බෙදන්න gateway එක එකක් තෝරනවා. මෙතනදී එය පිටපත #1 තෝරනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

තැපැල් කන්තෝරුවේදී ලිපිකරු මුලින්ම බලනවා ඔබේ පාර්සලයේ ලිපිනයක් සහ මුද්දරයක් තියෙනවද කියලා. නැත්නම් එය කෙලින්ම ඔබට ආපහු එනවා. හරි නම්, ලිපිකරු ලිපිනය කියවලා පාර්සලය හරි බෑගයට දානවා. එකම නගරයට vans දෙකක් යනවා නම්, එක van එකක්වත් පිරී ඉතිරී නොයන්න ලිපිකරු ඒවා මාරුවෙන් මාරුවට පුරවනවා.

#### Advanced

**How it works**

Validation checks the request against the API contract (typically the OpenAPI document): path and query parameters, body schema, size limits. Rejecting early with 400 Bad Request is cheap and keeps malformed input away from services.

Routing matches host, path and method to an upstream cluster, then a load-balancing policy (round robin, least requests) picks a healthy instance. Health comes from active checks (probing a /healthz endpoint) and passive ones (watching for errors). The gateway also enriches the request before forwarding it (see the message below).

The traceparent header (W3C Trace Context) ties the gateway’s log line to every span the request produces inside the system.

**Example**

A typo, ?status=opne, never reaches a service: the gateway answers 400 with a problem+json body. The correct request matches the /api/orders route, and “least requests” picks orders-1, which has 3 requests in flight against 5 on orders-2.

_The answer to a malformed request_

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{ "title": "Invalid query parameter",
  "detail": "status must be open, shipped or cancelled" }
```

**මෙය වැඩ කරන හැටි**

Validation එකෙන් request එක API contract එකට (සාමාන්‍යයෙන් OpenAPI document එකට) අනුව පරීක්ෂා කරනවා: path සහ query parameters, body schema, size limits. 400 Bad Request එකකින් කලින්ම reject කිරීම ලාභදායීයි, ඒ වගේම වැරදි input services වලින් ඈත් කරලා තියනවා.

Routing එකෙන් host, path සහ method upstream cluster එකකට ගළපනවා, ඊට පස්සේ load-balancing policy එකක් (round robin, least requests) healthy instance එකක් තෝරනවා. Health තීරණය වෙන්නේ active checks (/healthz endpoint එකක් probe කිරීම) සහ passive checks (errors නිරීක්ෂණය) වලින්. Gateway එක request එක forward කරන්න කලින් ඒකට තොරතුරු එකතු කරනවා (පහළ message එක බලන්න).

traceparent header එක (W3C Trace Context) gateway එකේ log line එක, request එක system එක ඇතුළේ හදන හැම span එකකටම සම්බන්ධ කරනවා.

**උදාහරණය**

?status=opne වගේ අකුරු වැරැද්දක් කවදාවත් service එකකට යන්නේ නැහැ: gateway එක problem+json body එකක් එක්ක 400 උත්තරය දෙනවා. නිවැරදි request එක /api/orders route එකට ගැළපෙනවා, “least requests” policy එක orders-1 තෝරනවා, මොකද orders-2 එකේ in-flight requests 5ක් තියෙද්දී orders-1 එකේ තියෙන්නේ 3යි.

_වැරදියට ලියපු request එකකට උත්තරය_

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{ "title": "Invalid query parameter",
  "detail": "status must be open, shipped or cancelled" }
```

_Words to know:_ Route table, Load balancing, Health check, Trace context · _Message:_ The request the gateway forwards to Orders

---

## The backend · Backend එක

### 8. Business logic · Business logic

**Watch:** Orders service #1 lights up, then sends a small request to the Users service and gets an answer back.

**බලන්න:** Orders service #1 දැල්වෙනවා, ඊට පස්සේ Users service එකට පොඩි request එකක් යවලා උත්තරයක් ලබාගන්නවා.

#### Beginner

**In simple words**

The request finally reaches the Orders service. This service knows the shop’s rules about orders. It already knows who is asking, because the gateway checked the pass and wrote your name on the request. So it follows the rule: you may only see your own orders.

It also needs your name and delivery address, so it asks the Users service. That question stays inside the building. It never goes back out through the front door.

**Like in real life**

In a school, the front office checks every visitor. Once you are inside, your teacher doesn’t check your visitor badge again. But the teacher still decides what you may see: your own test results, not your friend’s. And if the teacher needs your address, they ask the school office down the hall, not the front gate.

**සරලව කිව්වොත්**

අන්තිමේදී request එක Orders service එකට ළඟා වෙනවා. මේ service එක orders ගැන කඩේ නීති දන්නවා. කවුද අහන්නේ කියලා එය දැනටමත් දන්නවා, මොකද gateway එක අවසර පත්‍රය පරීක්ෂා කරලා ඔබේ නම request එකේ ලියලා තියෙනවා. ඒ නිසා එය නීතිය අනුගමනය කරනවා: ඔබට බලන්න පුළුවන් ඔබේම orders විතරයි.

ඒකට ඔබේ නමයි බෙදාහරින ලිපිනයයි ඕන වෙනවා, ඒ නිසා එය Users service එකෙන් අහනවා. ඒ ප්‍රශ්නය ගොඩනැගිල්ල ඇතුළේම තියෙනවා. එය කවදාවත් ඉදිරි දොරටුවෙන් ආපහු එළියට යන්නේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

පාසලක ඉදිරි කාර්යාලය හැම අමුත්තෙක්වම පරීක්ෂා කරනවා. ඔබ ඇතුළට ආවට පස්සේ ඔබේ ගුරුවරයා ඔබේ ඇතුළුවීමේ පත්‍රය ආයෙ පරීක්ෂා කරන්නේ නැහැ. නමුත් ඔබට බලන්න පුළුවන් දේ තීරණය කරන්නේ ගුරුවරයාමයි: ඔබේම විභාග ප්‍රතිඵල, ඔබේ යාළුවාගේ ඒවා නෙවෙයි. ඒ වගේම ගුරුවරයාට ඔබේ ලිපිනය ඕන නම්, එයා අහන්නේ ශාලාවේ අනිත් පැත්තේ තියෙන පාසල් කාර්යාලයෙන්, ඉදිරි ගේට්ටුවෙන් නෙවෙයි.

#### Advanced

**How it works**

This is where authorization by data happens: the gateway proved who the caller is; the service decides what they may see (only orders where user_id = u_7f3a).

The call to the Users service is east–west traffic. It does not go through the gateway; in many systems a service mesh adds mTLS, retries and metrics to these calls. Every internal call needs its own timeout, shorter than the gateway’s, or one slow dependency can tie up the whole chain (see scenario “Timeout, then retry”).

**Example**

The gateway allows 2 s for the whole call. Orders gives itself 1.5 s and gives the Users call 300 ms, with one retry. If Users hangs, Orders stops waiting after 300 ms and can still answer without the delivery address, instead of holding the request until the gateway gives up.

**මෙය වැඩ කරන හැටි**

Data අනුව authorization සිද්ධ වෙන්නේ මෙතනදී: caller කවුද කියලා gateway එක ඔප්පු කළා; ඔවුන්ට බලන්න පුළුවන් මොනවද කියලා service එක තීරණය කරනවා (user_id = u_7f3a වන orders විතරයි).

Users service එකට යන call එක east–west traffic. එය gateway එක හරහා යන්නේ නැහැ; ගොඩක් systems වල service mesh එකක් මේ calls වලට mTLS, retries සහ metrics එකතු කරනවා. හැම internal call එකකටම gateway එකේ timeout එකට වඩා කෙටි, තමන්ගේම timeout එකක් ඕන. නැත්නම් හෙමින් වැඩ කරන එක dependency එකකට මුළු දාමයම හිර කරන්න පුළුවන් (“Timeout, ඊට පස්සේ retry” scenario එක බලන්න).

**උදාහරණය**

Gateway එක මුළු call එකටම 2 s දෙනවා. Orders තමන්ට 1.5 s ක් තියාගෙන, Users call එකට 300 ms ක් සහ එක retry එකක් දෙනවා. Users හිර වුණොත්, Orders 300 ms කට පස්සේ බලාගෙන ඉන්න එක නවත්වනවා. ඒ නිසා gateway එක අත්හරිනකම් request එක අල්ලාගෙන ඉන්නේ නැතුව, බෙදාහරින ලිපිනය නැතුව වුණත් එයට උත්තර දෙන්න පුළුවන්.

_Words to know:_ Business logic, East–west traffic, Timeout budget · _Message:_ Orders asks the Users service (inside the system)

---

### 9. Querying the database · Database එකෙන් විමසීම

**Watch:** A request goes from Orders service #1 to PostgreSQL. The database lights up, and the answer comes back.

**බලන්න:** Orders service #1 ඉඳන් PostgreSQL එකට request එකක් යනවා. Database එක දැල්වෙනවා, උත්තරය ආපහු එනවා.

#### Beginner

**In simple words**

Your orders are kept in a database: a very tidy store of information. The Orders service asks it a clear question: “Give me this person’s open orders, newest first, at most 20.”

The database answers fast because it has an index.

**Like in real life**

Think of a big book with an index at the back. To find every page about dinosaurs, you don’t read the whole book. You look up “dinosaurs” in the index and jump straight to pages 12, 47 and 103. The database’s index does the same: it jumps straight to your open orders.

**සරලව කිව්වොත්**

ඔබේ orders තියාගෙන ඉන්නේ database එකක: තොරතුරු ගොඩක් පිළිවෙලට තියාගන්න තැනක. Orders service එක එයගෙන් පැහැදිලි ප්‍රශ්නයක් අහනවා: “මේ කෙනාගේ open orders මට දෙන්න, අලුත්ම ඒවා මුලින්, උපරිම 20ක්.”

Database එක ඉක්මනට උත්තර දෙන්නේ එය ළඟ index එකක් තියෙන නිසා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

පිටිපස්සේ index එකක් තියෙන ලොකු පොතක් ගැන හිතන්න. ඩයිනොසෝරයන් ගැන තියෙන හැම පිටුවක්ම හොයන්න ඔබ මුළු පොතම කියවන්නේ නැහැ. Index එකේ “ඩයිනොසෝර” හොයලා කෙලින්ම 12, 47 සහ 103 පිටුවලට පනිනවා. Database එකේ index එකත් කරන්නේ ඒකමයි: එය කෙලින්ම ඔබේ open orders වෙතට පනිනවා.

#### Advanced

**How it works**

- **Index:** a composite index on (user_id, status, created_at) serves the filter and the sort, so the query reads a handful of rows instead of scanning the table.
- **Connection pool:** opening a PostgreSQL connection is expensive (a process per connection), so services reuse connections from a pool (in-process, or PgBouncer).
- **Parameters:** $1 is a bound parameter, not string concatenation. That prevents SQL injection and lets the database reuse the query plan.
- **Scaling reads:** heavy read traffic can move to read replicas, accepting slightly stale data (eventual consistency).

**Example**

With 5 million orders in the table, EXPLAIN shows the difference the index makes. Because the index is already sorted by created_at, the database also skips the sort step.

_EXPLAIN, without and with the index_

```sql
-- Without an index
Seq Scan on orders (rows=5000000)        ~800 ms
-- With an index on (user_id, status, created_at DESC)
Index Scan using orders_user_status (rows=2)  <1 ms
```

**මෙය වැඩ කරන හැටි**

- **Index:** (user_id, status, created_at) මත තියෙන composite index එකක් filter එකටයි sort එකටයි දෙකටම සේවය කරනවා. ඒ නිසා query එක table එක මුළුමනින්ම scan කරනවා වෙනුවට rows ටිකක් විතරයි කියවන්නේ.
- **Connection pool:** PostgreSQL connection එකක් open කිරීම වියදම් අධිකයි (connection එකකට process එකක්), ඒ නිසා services pool එකකින් connections ආයෙ ආයෙත් පාවිච්චි කරනවා (in-process, නැත්නම් PgBouncer).
- **Parameters:** $1 කියන්නේ string concatenation එකක් නෙවෙයි, bound parameter එකක්. ඒකෙන් SQL injection වළක්වනවා, ඒ වගේම database එකට query plan එක ආයෙත් පාවිච්චි කරන්න ඉඩ දෙනවා.
- **Reads scale කිරීම:** විශාල read traffic read replicas වලට මාරු කරන්න පුළුවන්; ඒකේ අඩුපාඩුව තමයි data ටිකක් පරණ වෙන්න පුළුවන් වීම (eventual consistency).

**උදාහරණය**

Table එකේ orders මිලියන 5ක් තියෙද්දී, index එකෙන් ඇති වෙන වෙනස EXPLAIN එකෙන් පෙන්නනවා. Index එක දැනටමත් created_at අනුව sort කරලා තියෙන නිසා database එක sort පියවරත් මඟහරිනවා.

_EXPLAIN: index එක නැතුව සහ ඇතුව_

```sql
-- Without an index
Seq Scan on orders (rows=5000000)        ~800 ms
-- With an index on (user_id, status, created_at DESC)
Index Scan using orders_user_status (rows=2)  <1 ms
```

_Words to know:_ Index, Connection pool, SQL injection · _Message:_ The query Orders sends to PostgreSQL

---

### 10. Building the response · Response එක සකස් කිරීම

**Watch:** Orders service #1 lights up while it builds the answer. A green packet appears: that is the response. Click it to read it.

**බලන්න:** Orders service #1 උත්තරය හදද්දී දැල්වෙනවා. කොළ පාට packet එකක් පේනවා: ඒ තමයි response එක. එය කියවන්න click කරන්න.

#### Beginner

**In simple words**

The Orders service now has everything it needs: your orders from the database, and your name from the Users service. It puts them together into one answer, called the response.

The answer is written in JSON, a simple way of writing information that every program can read. On top it puts a status code: 200 means “OK, here is what you asked for”.

**Like in real life**

Like a waiter bringing your food: the kitchen puts everything on one tray, and the waiter says “here you go” (that is the 200). If the kitchen had run out of something, the waiter would tell you, with a different message.

**සරලව කිව්වොත්**

දැන් Orders service එක ළඟ ඕන හැම දෙයක්ම තියෙනවා: database එකෙන් ආපු ඔබේ orders, සහ Users service එකෙන් ආපු ඔබේ නම. එය ඒ ඔක්කොම එකතු කරලා එක උත්තරයක් හදනවා. ඒකට කියන්නේ response එක කියලා.

උත්තරය ලියලා තියෙන්නේ JSON වලින්. ඒක ඕනම program එකකට කියවන්න පුළුවන් විදිහට තොරතුරු ලියන සරල ක්‍රමයක්. උඩින්ම එය status code එකක් දානවා: 200 කියන්නේ “හරි, ඔබ ඉල්ලපු දේ මෙන්න” කියන එක.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Waiter කෙනෙක් ඔබේ කෑම ගෙනත් දෙනවා වගේ: කුස්සියේදී ඔක්කොම එක තැටියකට දානවා, waiter “මෙන්න” කියනවා (ඒ තමයි 200). කුස්සියේ මොකක් හරි ඉවර වෙලා තිබුණා නම්, waiter වෙනත් පණිවිඩයකින් ඒක ඔබට කියනවා.

#### Advanced

**How it works**

- **Status codes:** are part of the contract: 2xx success, 4xx the client must change something, 5xx the server failed.
- **Cache-Control: private, no-store:** personal data must not be stored by shared caches.
- **Pagination:** a cursor (nextCursor) is more robust than page numbers when new orders arrive between requests.

**Example**

With 45 open orders, the response would hold the newest 20 and a nextCursor. The next request sends ?cursor=… and the query continues with WHERE created_at < … instead of OFFSET 20, so an order placed in between does not shift the pages or show up twice.

**මෙය වැඩ කරන හැටි**

- **Status codes:** contract එකේ කොටසක්: 2xx සාර්ථකයි, 4xx client එක මොනවා හරි වෙනස් කරන්න ඕන, 5xx server එක අසාර්ථක වුණා.
- **Cache-Control: private, no-store:** පෞද්ගලික data shared caches වල ගබඩා කරන්න හොඳ නැහැ.
- **Pagination:** requests අතරතුර අලුත් orders එද්දී page numbers වලට වඩා cursor එකක් (nextCursor) විශ්වාසදායකයි.

**උදාහරණය**

Open orders 45ක් තිබුණා නම්, response එකේ අලුත්ම 20 සහ nextCursor එකක් තියෙනවා. ඊළඟ request එක ?cursor=… යවනවා, query එක OFFSET 20 වෙනුවට WHERE created_at < … එකෙන් දිගටම කරගෙන යනවා. ඒ නිසා අතරමැද order එකක් දැම්මත් pages මාරු වෙන්නේවත්, එකම order එක දෙපාරක් පේන්නේවත් නැහැ.

_Words to know:_ Status code, JSON, Pagination · _Message:_ The response the Orders service builds

---

## The return trip · ආපහු ගමන

### 11. The response flows back · Response එක ආපහු යනවා

**Watch:** The green packet travels back: from Orders to the gateway, then across the internet to the browser.

**බලන්න:** කොළ packet එක ආපහු ගමන් කරනවා: Orders ඉඳන් gateway එකට, ඊට පස්සේ internet එක හරහා browser එකට.

#### Beginner

**In simple words**

The answer goes back the way the request came: to the gateway, then across the internet to your browser. Your browser shows your two open orders.

On the way out, the gateway does a few small jobs: it squeezes the answer so it travels faster, adds safety notes for the browser, and writes down how the request went.

**Like in real life**

When a shop sends you a parcel, it packs things tightly so the box is small, puts a “fragile” sticker on it, and writes the parcel number in its records, in case you call to ask where it is.

**සරලව කිව්වොත්**

Request එක ආපු පාරෙන්ම උත්තරය ආපහු යනවා: gateway එකට, ඊට පස්සේ internet එක හරහා ඔබේ browser එකට. ඔබේ browser එක ඔබේ open orders දෙක පෙන්නනවා.

එළියට යන ගමනේදී gateway එක පොඩි වැඩ කිහිපයක් කරනවා: උත්තරය ඉක්මනට යන්න ඒක හකුළනවා, browser එකට ආරක්ෂක සටහන් එකතු කරනවා, request එක ගිය විදිහ ලියලා තියාගන්නවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කඩයක් ඔබට පාර්සලයක් එවද්දී, පෙට්ටිය පොඩි වෙන්න බඩු තදට අසුරනවා, ඒකට “බිඳෙනසුලුයි” ස්ටිකරයක් අලවනවා, ඔබ කතා කරලා ඒක කොහෙද කියලා ඇහුවොත් කියන්න පාර්සල් අංකය තමන්ගේ වාර්තාවල ලියලා තියාගන්නවා.

#### Advanced

**How it works**

The gateway does not change the meaning of the response, but it often:

- compresses it (Brotli or gzip, chosen from Accept-Encoding, with Vary: Accept-Encoding);
- adds CORS headers (Access-Control-Allow-Origin: https://shop.example) and security headers (Strict-Transport-Security, X-Content-Type-Options);
- records an access log line, latency and status metrics, and closes the trace span.

Status codes pass through unchanged, except errors the gateway raises itself: 401, 429, 502, 503, 504.

**Example**

Brotli shrinks the 1.8 KB JSON body to about 450 bytes. The access log line below carries the same request id (9c1e…) as the traces in the gateway, Orders and Users, so one search finds the request everywhere.

_The gateway’s access log line_

```
2026-11-24T10:11:20Z GET /api/orders 200 41ms 450B
  user=u_7f3a req=9c1e… upstream=orders-1
```

**මෙය වැඩ කරන හැටි**

Gateway එක response එකේ තේරුම වෙනස් කරන්නේ නැහැ, නමුත් බොහෝ විට එය:

- compress කරනවා (Accept-Encoding අනුව Brotli හෝ gzip තෝරලා, Vary: Accept-Encoding එක්ක);
- CORS headers (Access-Control-Allow-Origin: https://shop.example) සහ security headers (Strict-Transport-Security, X-Content-Type-Options) එකතු කරනවා;
- access log line එකක්, latency සහ status metrics සටහන් කරලා trace span එක වහනවා.

Status codes වෙනස් නොවී යනවා, gateway එකම හදන errors හැර: 401, 429, 502, 503, 504.

**උදාහරණය**

Brotli වලින් 1.8 KB JSON body එක bytes 450ක් පමණ දක්වා අඩු කරනවා. පහළ තියෙන access log line එකේ, gateway, Orders සහ Users වල traces වල තියෙන request id එකම (9c1e…) තියෙනවා. ඒ නිසා එක search එකකින් හැම තැනම request එක හොයාගන්න පුළුවන්.

_Gateway එකේ access log line එක_

```
2026-11-24T10:11:20Z GET /api/orders 200 41ms 450B
  user=u_7f3a req=9c1e… upstream=orders-1
```

_Words to know:_ Compression, Access log, Observability · _Message:_ The response the browser receives

---

### 12. The full lifecycle · සම්පූර්ණ ගමන

**Watch:** The whole journey plays again, faster: there and back, through every light on the gateway.

**බලන්න:** මුළු ගමනම ආයෙත් ඉක්මනින් පෙන්නනවා: ගිහින් ආපහු, gateway එකේ හැම පහනක් හරහාම.

#### Beginner

**In simple words**

That was one request, from start to finish. It crossed the internet twice, passed five checks at the front door, and visited two services and a database. And it all took less than a tenth of a second: faster than a blink.

Most of that time went into travelling across the internet. The gateway’s checks took about one thousandth of a second. That is why a front door is worth having: a lot of safety, for a tiny cost.

**Like in real life**

Think of asking for a book at a library where the books are kept in the back. You hand your slip to the desk, the librarian checks your card, a helper fetches the book from the shelves, and brings it to you. Most of the waiting is the walking, not the checking.

**සරලව කිව්වොත්**

ඒ තමයි මුල ඉඳන් අගට එක request එකක්. එය internet එක දෙපාරක් හරහා ගියා, ඉදිරි දොරටුවේදී පරීක්ෂාවන් පහක් පසු කළා, services දෙකකටයි database එකකටයි ගියා. ඒ ඔක්කොටම ගියේ තත්පරයකින් දහයෙන් පංගුවකටත් අඩු කාලයක්: ඇහිපිල්ලමක් ගහනවාටත් වඩා ඉක්මනින්.

ඒ කාලයෙන් වැඩි හරියක් ගියේ internet එක හරහා ගමන් කරන්න. Gateway එකේ පරීක්ෂාවන්ට ගියේ තත්පරයකින් දහසෙන් පංගුවක් පමණයි. ඉදිරි දොරටුවක් තියාගන්න වටින්නේ ඒ නිසයි: ගොඩක් ආරක්ෂාවක්, ඉතාම පොඩි වියදමකට.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

පොත් පිටිපස්සේ කාමරයක තියාගෙන ඉන්න පුස්තකාලයකින් පොතක් ඉල්ලනවා කියලා හිතන්න. ඔබ ඉල්ලුම් පත්‍රය කවුන්ටරයට දෙනවා, පුස්තකාලයාධිපති ඔබේ කාඩ් එක පරීක්ෂා කරනවා, සහායකයෙක් රාක්කවලින් පොත අරන් ඇවිත් ඔබට දෙනවා. වැඩිපුරම බලාගෙන ඉන්න වෙන්නේ ඇවිදින නිසා, පරීක්ෂා කරන නිසා නෙවෙයි.

#### Advanced

**How it works**

_Illustrative latency: a user about 1,000 km from the data centre, on a warm connection_

| Segment                                                 |       Time |
| ------------------------------------------------------- | ---------: |
| Browser → gateway (network, one way)                    |     ~15 ms |
| Gateway: auth 0.2, rate limit 1, validate and route 0.2 |    ~1.5 ms |
| Gateway → Orders (same data centre)                     |    ~0.5 ms |
| Orders logic, including the Users call                  |      ~4 ms |
| Database query (indexed)                                |      ~3 ms |
| Response: JSON, back to the gateway, compression        |      ~2 ms |
| Gateway → browser (network, one way)                    |     ~15 ms |
| **Total**                                               | **~41 ms** |

The network is about three quarters of the total, which is why connection reuse, CDNs and fewer round trips matter more than shaving the gateway. Tail latency (p99) is driven by the slowest dependency on the path, which is what timeouts and retries (the scenarios) manage.

**Example**

The same request from a user on another continent (about 150 ms each way) takes about 310 ms, while the work inside the data centre stays at about 11 ms. Moving only the gateway closer to the user would not help much, because the services are still far away. That is why read-heavy APIs cache responses at the edge.

**මෙය වැඩ කරන හැටි**

_උදාහරණ latency: data centre එකේ ඉඳන් කි.මී. 1,000ක් පමණ ඈතින් ඉන්න user කෙනෙක්, warm connection එකක_

| කොටස                                                   |       කාලය |
| ------------------------------------------------------ | ---------: |
| Browser → gateway (network, එක පැත්තකට)                 |     ~15 ms |
| Gateway: auth 0.2, rate limit 1, validate සහ route 0.2 |    ~1.5 ms |
| Gateway → Orders (එකම data centre එක)                  |    ~0.5 ms |
| Orders logic, Users call එකත් ඇතුළුව                      |      ~4 ms |
| Database query (indexed)                               |      ~3 ms |
| Response: JSON, gateway එකට ආපහු, compression           |      ~2 ms |
| Gateway → browser (network, එක පැත්තකට)                 |     ~15 ms |
| **එකතුව**                                               | **~41 ms** |

මුළු කාලයෙන් හතරෙන් තුනක් පමණ යන්නේ network එකට. Gateway එකෙන් මිලි තත්පර කපනවාට වඩා connection reuse, CDNs සහ round trips අඩු කිරීම වැදගත් වෙන්නේ ඒ නිසයි. Tail latency (p99) තීරණය වෙන්නේ පාරේ තියෙන හෙමින්ම dependency එකෙන්; timeouts සහ retries (scenarios) වලින් හසුරුවන්නේ ඒකයි.

**උදාහරණය**

වෙනත් මහාද්වීපයක ඉන්න user කෙනෙකුගෙන් (එක පැත්තකට 150 ms පමණ) එන එකම request එකට 310 ms පමණ යනවා, නමුත් data centre එක ඇතුළේ වැඩට තවමත් යන්නේ 11 ms පමණයි. Gateway එක විතරක් user ට ළං කළාට වැඩි ප්‍රයෝජනයක් නැහැ, මොකද services තවමත් ඈතින්. Read-heavy APIs edge එකේදී responses cache කරන්නේ ඒ නිසයි.

_Words to know:_ Latency, Tail latency (p99)

---

## Scenarios

## Scenario: 401 Unauthorized · 401 Unauthorized

An expired token is turned away at the door, then refreshed.

කල් ඉකුත් වූ token එකක් දොරටුවේදීම නවත්වලා, ඊට පස්සේ refresh කරනවා.

### 1. An expired token arrives · කල් ඉකුත් වූ token එකක් එනවා

**Watch:** The request reaches the gateway, and the Authentication light turns red. The badge shows 401.

**බලන්න:** Request එක gateway එකට ළඟා වෙනවා, Authentication පහන රතු වෙනවා. Badge එකේ 401 පෙන්නනවා.

#### Beginner

**In simple words**

This time the pass is too old: it expired a few minutes ago. The gateway sees that straight away and stops the request at the door. No service is bothered.

**Like in real life**

It is like trying to enter the museum with last week’s ticket. The guard says no at the door. Nobody inside even knows you tried.

**සරලව කිව්වොත්**

මේ පාර අවසර පත්‍රය පරණයි: විනාඩි කිහිපයකට කලින් එය කල් ඉකුත් වුණා. Gateway එක ඒක වහාම දැකලා request එක දොරටුවේදීම නවත්වනවා. කිසිම service එකකට කරදරයක් නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

මේක පහුගිය සතියේ ටිකට් පතක් අරගෙන කෞතුකාගාරයට ඇතුළු වෙන්න හදනවා වගේ. මුරකරු දොරටුවේදීම බැහැ කියනවා. ඔබ උත්සාහ කළා කියලාවත් ඇතුළේ කවුරුවත් දන්නේ නැහැ.

#### Advanced

**How it works**

exp is in the past, so the signature check doesn’t matter. The gateway answers immediately; failing at the edge protects services and keeps error handling uniform.

**Example**

exp was 10:07:20 and the time is 10:11:20: the token expired 4 minutes ago. Gateways usually allow a small clock difference between machines (often 30 to 60 seconds) when checking exp and nbf; 4 minutes is far beyond it.

**මෙය වැඩ කරන හැටි**

exp අතීතයේ තියෙන නිසා signature check එක වැදගත් නැහැ. Gateway එක වහාම උත්තර දෙනවා; edge එකේදීම අසාර්ථක කිරීමෙන් services ආරක්ෂා වෙනවා, error handling එකම විදිහට තියෙනවා.

**උදාහරණය**

exp තිබුණේ 10:07:20, දැන් වෙලාව 10:11:20: token එක කල් ඉකුත් වෙලා විනාඩි 4යි. exp සහ nbf පරීක්ෂා කරද්දී gateways සාමාන්‍යයෙන් machines අතර පොඩි clock වෙනසකට (බොහෝ විට තත්පර 30 සිට 60 දක්වා) ඉඩ දෙනවා; විනාඩි 4 ඒකට වඩා ගොඩක් වැඩියි.

_Words to know:_ JWT, Claims · _Message:_ The same request, with a token that expired 4 minutes ago

---

### 2. The gateway answers 401 · Gateway එක 401 කියලා උත්තර දෙනවා

**Watch:** A red packet travels back to the browser. Click it to read the gateway’s answer.

**බලන්න:** රතු packet එකක් browser එකට ආපහු යනවා. Gateway එකේ උත්තරය කියවන්න එය click කරන්න.

#### Beginner

**In simple words**

The gateway sends back a short answer: 401. It means “I can’t let you in: your pass is not valid”. It also says why: the pass expired.

**Like in real life**

The museum guard doesn’t just say “no”. They say “your ticket has expired, please get a new one”. Now you know exactly what to do.

**සරලව කිව්වොත්**

Gateway එක කෙටි උත්තරයක් ආපහු යවනවා: 401. ඒකෙන් කියන්නේ “මට ඔබව ඇතුළට ගන්න බැහැ: ඔබේ අවසර පත්‍රය වලංගු නැහැ” කියන එක. ඇයි කියලත් එය කියනවා: අවසර පත්‍රය කල් ඉකුත් වෙලා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කෞතුකාගාරයේ මුරකරු නිකන්ම “බැහැ” කියන්නේ නැහැ. එයා කියනවා “ඔබේ ටිකට් පත කල් ඉකුත් වෙලා, කරුණාකර අලුත් එකක් ගන්න” කියලා. දැන් ඔබට කරන්න ඕන දේ හරියටම තේරෙනවා.

#### Advanced

**How it works**

401 means “not authenticated” (missing, invalid or expired credentials). 403 would mean “authenticated, but not allowed”. The WWW-Authenticate header tells the client which scheme and what went wrong.

**Example**

A valid token without the orders:read scope gets 403 instead. The client must not refresh and retry then: a new token would carry the same permissions.

_403: authenticated, but not allowed_

```http
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer error="insufficient_scope",
  scope="orders:read"
```

**මෙය වැඩ කරන හැටි**

401 කියන්නේ “authenticate වෙලා නැහැ” (credentials නැහැ, වලංගු නැහැ, නැත්නම් කල් ඉකුත් වෙලා). 403 නම් කියන්නේ “authenticate වෙලා, නමුත් අවසර නැහැ”. WWW-Authenticate header එකෙන් client එකට scheme එකයි වැරදුණේ මොකක්ද කියලත් කියනවා.

**උදාහරණය**

orders:read scope එක නැති වලංගු token එකකට ලැබෙන්නේ 403. එහෙම වෙලාවක client එක refresh කරලා retry කරන්න හොඳ නැහැ: අලුත් token එකටත් තියෙන්නේ ඒ අවසරම.

_403: authenticate වෙලා, නමුත් අවසර නැහැ_

```http
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer error="insufficient_scope",
  scope="orders:read"
```

_Words to know:_ 401 Unauthorized, Authentication vs. authorization · _Message:_ The gateway’s answer

---

### 3. Refresh and try again · Refresh කරලා ආයෙත් උත්සාහ කරනවා

**Watch:** The browser quietly asks the identity provider for a new pass, gets it, and sends the request again. This time it goes through.

**බලන්න:** Browser එක නිශ්ශබ්දව identity provider එකෙන් අලුත් අවසර පත්‍රයක් ඉල්ලලා, ඒක අරගෙන, request එක ආයෙත් යවනවා. මේ පාර එය සාර්ථකව යනවා.

#### Beginner

**In simple words**

The app keeps a second, longer-lasting pass, called a refresh token. It uses it to get a fresh pass from the identity provider, then asks again. You never notice any of this.

**Like in real life**

Imagine you have a yearly membership card for the museum. When your day ticket runs out, you show the card at the ticket office, get a new day ticket in a second, and walk back in.

**සරලව කිව්වොත්**

App එක ළඟ වැඩි කාලයක් වලංගු තවත් අවසර පත්‍රයක් තියෙනවා. ඒකට කියන්නේ refresh token එක කියලා. ඒකෙන් identity provider එකෙන් අලුත් අවසර පත්‍රයක් අරගෙන, ආයෙත් අහනවා. මේ කිසිම දෙයක් ඔබට දැනෙන්නේවත් නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ ළඟ කෞතුකාගාරයේ වාර්ෂික සාමාජික කාඩ් එකක් තියෙනවා කියලා හිතන්න. දවසේ ටිකට් පත ඉවර වුණාම, ඔබ ටිකට් කාර්යාලයේදී කාඩ් එක පෙන්නලා, තත්පරයකින් අලුත් ටිකට් පතක් අරගෙන, ආයෙත් ඇතුළට යනවා.

#### Advanced

**How it works**

The client uses its refresh token at the identity provider’s token endpoint (the OAuth 2.0 refresh token grant), then retries once. A second 401 means the session is over: send the user to sign in.

**Example**

If a page sends 5 requests at once and all 5 get 401, a naive client refreshes 5 times. A good client runs one refresh, lets the other requests wait for it, then retries each of them once. With refresh token rotation, the identity provider also replaces the refresh token on every use, and treats reuse of an old one as a sign of theft.

**මෙය වැඩ කරන හැටි**

Client එක identity provider එකේ token endpoint එකේදී තමන්ගේ refresh token එක පාවිච්චි කරනවා (OAuth 2.0 refresh token grant), ඊට පස්සේ එක පාරක් retry කරනවා. දෙවෙනි 401 එකකින් කියන්නේ session එක ඉවරයි කියලා: user ව sign in වෙන්න යවන්න.

**උදාහරණය**

Page එකක් එකවර requests 5ක් යවලා 5ටම 401 ලැබුණොත්, සරල client එකක් 5 පාරක් refresh කරනවා. හොඳ client එකක් එක refresh එකක් විතරක් කරලා, අනිත් requests ඒක එනකම් බලාගෙන ඉන්න තියලා, ඊට පස්සේ ඒ හැම එකක්ම එක පාරක් retry කරනවා. Refresh token rotation එකත් එක්ක identity provider එක හැම පාවිච්චියකදීම refresh token එක මාරු කරනවා, පරණ එකක් ආයෙ පාවිච්චි කළොත් ඒක සොරකමක ලකුණක් විදිහට සලකනවා.

_Words to know:_ Refresh token · _Message:_ The app asks the identity provider for a new access token

---

## Scenario: 429 Too Many Requests · 429 Too Many Requests

A burst uses up the allowance; the gateway asks the client to slow down.

එකවර එන requests ගොඩකින් දීමනාව ඉවර වෙනවා; gateway එක client එකට හෙමින් යන්න කියනවා.

### 1. A burst of requests · එකවර requests ගොඩක්

**Watch:** Five packets rush from the browser, one after another. The badge counts down to 0 of 60 left.

**බලන්න:** Browser එකෙන් packets පහක් එකින් එක වේගයෙන් යනවා. Badge එක “0 of 60 left” දක්වා අඩු වෙනවා.

#### Beginner

**In simple words**

A bug makes the app send the same request again and again, very fast. Each one uses up part of the allowance, and soon nothing is left.

**Like in real life**

Back at the fun fair: someone spends all their ride tokens in one go. The helper adds only one token a second, so their cup is quickly empty.

**සරලව කිව්වොත්**

Bug එකක් නිසා app එක එකම request එක ආයෙ ආයෙත් ගොඩක් වේගයෙන් යවනවා. හැම එකකින්ම දීමනාවෙන් කොටසක් වැය වෙනවා, ඉක්මනින්ම කිසිවක් ඉතුරු වෙන්නේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ආයෙත් කානිවල් එකට: කෙනෙක් තමන්ගේ tokens ඔක්කොම එක පාරටම වියදම් කරනවා. උදව්කරු තත්පරයකට එක token එකක් විතරයි දාන්නේ, ඒ නිසා ඒ කෙනාගේ කෝප්පය ඉක්මනින්ම හිස් වෙනවා.

#### Advanced

**How it works**

The token bucket is empty: the burst exceeded capacity b faster than the refill rate r could replace tokens.

**Example**

A typical cause: a React effect with a wrong dependency list runs again after every render and calls fetch each time. Five renders in one second spend five tokens, and a refill of one per second can’t keep up.

**මෙය වැඩ කරන හැටි**

Token bucket එක හිස්: refill rate r ට tokens ආපහු දාන්න පුළුවන් වේගයට වඩා වේගයෙන් burst එක capacity b ඉක්මවලා.

**උදාහරණය**

සාමාන්‍ය හේතුවක්: වැරදි dependency list එකක් තියෙන React effect එකක් හැම render එකකටම පස්සේ ආයෙත් run වෙලා, හැම පාරම fetch call කරනවා. එක තත්පරයක renders පහකින් tokens පහක් වැය වෙනවා, තත්පරයකට එකක refill එකකට ඒක අල්ලගන්න බැහැ.

_Words to know:_ Token bucket · _Message:_ The request the browser sends

---

### 2. The gateway answers 429 · Gateway එක 429 කියලා උත්තර දෙනවා

**Watch:** Another request arrives with nothing left. The Rate limit light turns red, the badge shows 429, and a red packet goes back.

**බලන්න:** කිසිවක් ඉතුරු නැති වෙලාවේ තවත් request එකක් එනවා. Rate limit පහන රතු වෙනවා, badge එකේ 429 පෙන්නනවා, රතු packet එකක් ආපහු යනවා.

#### Beginner

**In simple words**

With the allowance used up, the gateway answers 429. It means “too many requests, please slow down”. It also says when to try again: in 20 seconds. The services and the database never even notice the rush.

**Like in real life**

The fun fair helper says: “No tokens left. Come back in 20 seconds, when your cup has some again.” The rides keep running normally for everyone else.

**සරලව කිව්වොත්**

දීමනාව ඉවර වුණු නිසා gateway එක 429 කියලා උත්තර දෙනවා. ඒකෙන් කියන්නේ “requests වැඩියි, කරුණාකර ටිකක් හෙමින්” කියන එක. ආයෙ උත්සාහ කරන්න ඕන කවදාද කියලත් එය කියනවා: තත්පර 20කින්. Services වලටයි database එකටයි මේ කලබලය දැනෙන්නේවත් නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කානිවල් එකේ උදව්කරු කියනවා: “Tokens ඉවරයි. තත්පර 20කින් එන්න, එතකොට ඔබේ කෝප්පයේ ආයෙත් tokens ටිකක් තියෙයි.” අනිත් හැමෝටම සෙල්ලම් සාමාන්‍ය විදිහටම දිගටම යනවා.

#### Advanced

**How it works**

Rejection is cheap (no upstream call), which is the point: overload is absorbed at the edge. Retry-After gives the client a concrete wait.

**Example**

Answering 429 costs the gateway microseconds. Had the burst reached Orders, every request would have held a database connection; with a pool of 20 connections, a few hundred requests would make every other user queue behind the faulty client.

**මෙය වැඩ කරන හැටි**

Reject කිරීම ලාභදායීයි (upstream call එකක් නැහැ), අරමුණත් ඒකයි: overload එක edge එකේදීම අවශෝෂණය වෙනවා. Retry-After එකෙන් client එකට බලාගෙන ඉන්න ඕන නිශ්චිත කාලය දෙනවා.

**උදාහරණය**

429 උත්තරයක් දෙන්න gateway එකට යන්නේ microseconds කිහිපයයි. Burst එක Orders වලට ගියා නම්, හැම request එකක්ම database connection එකක් අල්ලාගන්නවා; connections 20ක pool එකක් එක්ක requests සිය ගණනකින් අනිත් හැම user කෙනෙක්ම වැරදි client එක පිටිපස්සේ පෝලිමේ ඉන්න වෙනවා.

_Words to know:_ 429 Too Many Requests, Retry-After · _Message:_ The gateway’s answer

---

### 3. Back off and retry · ටිකක් ඉඳලා retry කරනවා

**Watch:** The browser shows “waiting 20 s”. Then it sends one request, and the badge shows the allowance has filled up again.

**බලන්න:** Browser එකේ “waiting 20 s” පෙන්නනවා. ඊට පස්සේ එය එක request එකක් යවනවා, දීමනාව ආයෙත් පිරිලා කියලා badge එකෙන් පෙන්නනවා.

#### Beginner

**In simple words**

A well-behaved app does what it is told: it waits 20 seconds, then tries once. By then the allowance has filled up again, and the request goes through.

**Like in real life**

Waiting your turn at the fun fair: after a short wait your cup has tokens again, and you can ride.

**සරලව කිව්වොත්**

හොඳින් හැසිරෙන app එකක් කියන දේ කරනවා: තත්පර 20ක් ඉඳලා, එක පාරක් උත්සාහ කරනවා. ඒ වෙනකොට දීමනාව ආයෙත් පිරිලා, request එක සාර්ථකව යනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කානිවල් එකේදී ඔබේ වාරය එනකම් ඉන්නවා වගේ: ටිකක් ඉන්නකොට ඔබේ කෝප්පයේ ආයෙත් tokens තියෙනවා, ඔබට සෙල්ලම් කරන්න පුළුවන්.

#### Advanced

**How it works**

Clients must honour Retry-After and deduplicate the burst at the source (the real fix is the bug). Retrying immediately in a loop just keeps the bucket empty.

**Example**

In TanStack Query, retryDelay can read Retry-After from the error and wait exactly that long, and retry can skip other 4xx errors entirely, because sending the same bad request again won’t fix it. Fixing the effect that caused the burst is still the real cure.

**මෙය වැඩ කරන හැටි**

Clients Retry-After වලට ගරු කරන්න ඕන, burst එක මූලාශ්‍රයේදීම deduplicate කරන්න ඕන (සැබෑ විසඳුම bug එක හදන එක). Loop එකක වහාම retry කිරීමෙන් වෙන්නේ bucket එක දිගටම හිස්ව තියාගන්න එක විතරයි.

**උදාහරණය**

TanStack Query වල retryDelay එකට error එකෙන් Retry-After කියවලා හරියටම ඒ කාලය බලාගෙන ඉන්න පුළුවන්; retry එකට අනිත් 4xx errors සම්පූර්ණයෙන්ම මඟහරින්න පුළුවන්, මොකද එකම වැරදි request එක ආයෙ යැව්වට ඒක හැදෙන්නේ නැහැ. Burst එක ඇති කරපු effect එක හදන එක තමයි තවමත් සැබෑ විසඳුම.

_Words to know:_ Retry-After, Exponential backoff · _Message:_ The request the browser sends

---

## Scenario: Timeout, then retry · Timeout, ඊට පස්සේ retry

A slow service makes the gateway give up; the client retries with backoff.

හෙමින් service එකක් නිසා gateway එක අත්හරිනවා; client එක backoff එක්ක retry කරනවා.

### 1. The service is slow · Service එක හෙමින්

**Watch:** Orders service #1 turns amber: it is slow. The gateway’s badge shows how long it has waited, until it gives up after 2 seconds.

**බලන්න:** Orders service #1 තැඹිලි පාට වෙනවා: එය හෙමින්. Gateway එක තත්පර 2කට පස්සේ අත්හරිනකම්, එය කොච්චර වෙලා බලාගෙන හිටියද කියලා gateway එකේ badge එකෙන් පෙන්නනවා.

#### Beginner

**In simple words**

Orders service #1 is stuck and doesn’t answer. The gateway won’t wait forever: after 2 seconds, it gives up.

**Like in real life**

You ring a friend’s doorbell, and nobody comes. You don’t stand there all day: after a little while, you go and try something else.

**සරලව කිව්වොත්**

Orders service #1 හිරවෙලා, උත්තර දෙන්නේ නැහැ. Gateway එක සදහටම බලාගෙන ඉන්නේ නැහැ: තත්පර 2කට පස්සේ එය අත්හරිනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ යාළුවෙකුගේ ගෙදර doorbell එක ගහනවා, කවුරුවත් එන්නේ නැහැ. ඔබ මුළු දවසම එතන හිටගෙන ඉන්නේ නැහැ: ටික වෙලාවකට පස්සේ ඔබ ගිහින් වෙන දෙයක් කරනවා.

#### Advanced

**How it works**

The gateway’s upstream timeout (2 s here) bounds how long a client waits and how long the gateway holds resources. Without timeouts, slow services exhaust connection pools upstream, and one slow dependency becomes an outage.

**Example**

Without a timeout, each stuck request holds a gateway connection and an Orders worker. At 200 requests per second, a service that hangs for 30 seconds ties up 6,000 requests at once. Few pools are that large, so even healthy routes start to fail.

**මෙය වැඩ කරන හැටි**

Gateway එකේ upstream timeout එකෙන් (මෙහි 2 s) client කෙනෙක් කොච්චර වෙලා බලාගෙන ඉන්නවද, gateway එක resources කොච්චර වෙලා අල්ලාගෙන ඉන්නවද කියලා සීමා කරනවා. Timeouts නැත්නම්, හෙමින් services නිසා upstream එකේ connection pools ඉවර වෙනවා, එක හෙමින් dependency එකක් outage එකක් බවට පත් වෙනවා.

**උදාහරණය**

Timeout එකක් නැත්නම්, හිරවෙච්ච හැම request එකක්ම gateway connection එකකුයි Orders worker කෙනෙකුයි අල්ලාගන්නවා. තත්පරයකට requests 200ක් එද්දී, තත්පර 30ක් හිරවෙන service එකක් එකවර requests 6,000ක් අල්ලාගන්නවා. ඒ තරම් ලොකු pools තියෙන්නේ ටිකයි, ඒ නිසා හොඳින් වැඩ කරන routes පවා අසාර්ථක වෙන්න පටන් ගන්නවා.

_Words to know:_ Timeout budget · _Message:_ The request the gateway forwards to Orders

---

### 2. The gateway answers 504 · Gateway එක 504 කියලා උත්තර දෙනවා

**Watch:** A red packet goes back to the browser, and the gateway’s badge shows 504.

**බලන්න:** රතු packet එකක් browser එකට ආපහු යනවා, gateway එකේ badge එකේ 504 පෙන්නනවා.

#### Beginner

**In simple words**

The gateway tells the browser 504. It means “the service behind me didn’t answer in time”. That is much better than leaving you waiting with a spinning wheel.

**Like in real life**

A receptionist who says “sorry, the person you want isn’t answering, please try again in a moment” is more helpful than one who leaves you waiting in the lobby forever.

**සරලව කිව්වොත්**

Gateway එක browser එකට 504 කියනවා. ඒකෙන් කියන්නේ “මගේ පිටිපස්සේ ඉන්න service එක වෙලාවට උත්තර දුන්නේ නැහැ” කියන එක. කැරකෙන රෝදයක් එක්ක ඔබව බලාගෙන ඉන්න තියනවාට වඩා ඒක ගොඩක් හොඳයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

“සමාවෙන්න, ඔබට ඕන කෙනා උත්තර දෙන්නේ නැහැ, ටිකකින් ආයෙත් උත්සාහ කරන්න” කියන reception එකේ කෙනා, ඔබව lobby එකේ සදහටම බලාගෙන ඉන්න තියන කෙනාට වඩා ගොඩක් උදව් වෙනවා.

#### Advanced

**How it works**

504 is the gateway reporting an upstream timeout. (502 would mean the upstream answered with something invalid; 503 that no upstream could take the request.)

**Example**

Could the gateway retry by itself? For a GET with time to spare, yes: once, on another instance. Here the 2 s budget is already used up, so it answers 504 and leaves the decision to the client.

**මෙය වැඩ කරන හැටි**

504 කියන්නේ gateway එක upstream timeout එකක් වාර්තා කරන එක. (502 නම් upstream එක වලංගු නැති දෙයකින් උත්තර දුන්නා; 503 නම් කිසිම upstream එකකට request එක ගන්න බැරි වුණා.)

**උදාහරණය**

Gateway එකට තනියම retry කරන්න පුළුවන්ද? කාලය ඉතුරු තියෙන GET එකකට නම් ඔව්: එක පාරක්, වෙනත් instance එකක. මෙතනදී 2 s budget එක දැනටමත් ඉවරයි, ඒ නිසා එය 504 කියලා උත්තර දීලා තීරණය client එකට භාර දෙනවා.

_Words to know:_ Status code · _Message:_ The gateway’s answer

---

### 3. Retry with backoff · Backoff එක්ක retry කරනවා

**Watch:** The browser waits (“retry in 1 s”), then asks again. This time the gateway sends the request to Orders service #2, which answers quickly.

**බලන්න:** Browser එක ටිකක් ඉඳලා (“retry in 1 s”) ආයෙත් අහනවා. මේ පාර gateway එක request එක Orders service #2 ට යවනවා, එය ඉක්මනින් උත්තර දෙනවා.

#### Beginner

**In simple words**

The app waits a moment and asks again. This time the gateway sends the request to the other copy of the Orders service, which is healthy and answers quickly.

If it fails again, the app waits a bit longer before each new try: first about 1 second, then 2, then 4. Waiting longer each time is called backoff.

**Like in real life**

When a friend doesn’t pick up the phone, you call again after a minute, then after five minutes, then after an hour. You don’t call a hundred times in a row: that wouldn’t help, and it would be annoying.

**සරලව කිව්වොත්**

App එක මොහොතක් ඉඳලා ආයෙත් අහනවා. මේ පාර gateway එක request එක Orders service එකේ අනිත් පිටපතට යවනවා; ඒක හොඳ තත්වයේ තියෙන නිසා ඉක්මනින් උත්තර දෙනවා.

ආයෙත් අසාර්ථක වුණොත්, app එක හැම අලුත් උත්සාහයකටම කලින් ටිකක් වැඩිපුර ඉන්නවා: මුලින් තත්පර 1ක් පමණ, ඊට පස්සේ 2ක්, ඊට පස්සේ 4ක්. හැම පාරම වැඩිපුර ඉන්න එකට කියන්නේ backoff කියලා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

යාළුවෙක් phone එකට උත්තර නොදුන්නාම, ඔබ විනාඩියකට පස්සේ ආයෙත් කතා කරනවා, ඊට පස්සේ විනාඩි පහකට පස්සේ, ඊට පස්සේ පැයකට පස්සේ. ඔබ දිගටම සිය පාරක් කතා කරන්නේ නැහැ: ඒකෙන් වැඩක් නැහැ, ඒ වගේම ඒක කරදරයක්.

#### Advanced

**How it works**

Retries use exponential backoff with jitter (for example up to 0.5 s, then 1 s, then 2 s, each randomised) so thousands of clients don’t retry in lockstep. Only retry safe or idempotent requests: GET is fine; a POST that creates an order needs an idempotency key, or it might be created twice.

**Example**

With “full jitter”, attempt 1 waits a random time between 0 and 0.5 s, attempt 2 between 0 and 1 s, attempt 3 between 0 and 2 s; then the client stops and shows an error. Placing an order sends an Idempotency-Key, so if the first attempt did succeed, the retry returns the same order instead of creating a second one.

_A retry-safe POST_

```http
POST /api/orders HTTP/1.1
Idempotency-Key: 5b2e9f0c-…
Content-Type: application/json
```

**මෙය වැඩ කරන හැටි**

Retries වලට jitter එක්ක exponential backoff පාවිච්චි කරනවා (උදාහරණයක් විදිහට 0.5 s දක්වා, ඊට පස්සේ 1 s, ඊට පස්සේ 2 s, හැම එකක්ම අහඹු කරලා). එතකොට clients දහස් ගණනක් එකම මොහොතේ retry කරන්නේ නැහැ. Retry කරන්න ඕන safe හෝ idempotent requests විතරයි: GET එකක් කමක් නැහැ; order එකක් හදන POST එකකට idempotency key එකක් ඕන, නැත්නම් ඒක දෙපාරක් හැදෙන්න පුළුවන්.

**උදාහරණය**

“Full jitter” එක්ක, පළමු උත්සාහය 0 සහ 0.5 s අතර අහඹු කාලයක්, දෙවැන්න 0 සහ 1 s අතර, තුන්වැන්න 0 සහ 2 s අතර ඉන්නවා; ඊට පස්සේ client එක නවත්වලා error එකක් පෙන්නනවා. Order එකක් දාද්දී Idempotency-Key එකක් යවනවා. ඒ නිසා පළමු උත්සාහය ඇත්තටම සාර්ථක වුණා නම්, retry එක දෙවෙනි order එකක් හදන්නේ නැතුව ඒ order එකම ආපහු දෙනවා.

_Retry කරන්න ආරක්ෂිත POST එකක්_

```http
POST /api/orders HTTP/1.1
Idempotency-Key: 5b2e9f0c-…
Content-Type: application/json
```

_Words to know:_ Exponential backoff, Idempotent · _Message:_ The request the browser sends

---

## Scenario: 503, rerouted · 503, වෙනත් පාරකින්

One instance goes down and traffic moves to the healthy one.

එක instance එකක් නතර වෙනවා, traffic හොඳ තත්වයේ තියෙන එකට මාරු වෙනවා.

### 1. An instance goes down · එක instance එකක් නතර වෙනවා

**Watch:** Orders service #1 goes dark: it has crashed. The lines from the gateway pulse as it checks on both copies.

**බලන්න:** Orders service #1 අඳුරු වෙනවා: එය crash වෙලා. Gateway එක පිටපත් දෙකම පරීක්ෂා කරද්දී ඒකෙන් එන ඉරි ස්පන්දනය වෙනවා.

#### Beginner

**In simple words**

One copy of the Orders service has crashed. The gateway notices, because it checks on every copy regularly, a bit like asking “are you OK?” every few seconds.

**Like in real life**

A teacher takes the register every morning. When a child doesn’t answer “here”, the teacher knows they are away and doesn’t give them a job that day.

**සරලව කිව්වොත්**

Orders service එකේ එක පිටපතක් crash වෙලා. Gateway එක ඒක දකිනවා, මොකද එය හැම පිටපතක්ම නිතිපතා පරීක්ෂා කරනවා: හරියට තත්පර කිහිපයකට සැරයක් “ඔයා හොඳින්ද?” කියලා අහනවා වගේ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ගුරුවරයෙක් හැම උදේම පැමිණීමේ ලේඛනය කියවනවා. ළමයෙක් “මෙන්න” කියලා උත්තර නොදුන්නොත්, ඒ ළමයා අද ඇවිල්ලා නැහැ කියලා දැනගෙන ගුරුවරයා එදාට ඒ ළමයාට වැඩක් දෙන්නේ නැහැ.

#### Advanced

**How it works**

Active health checks (a failing /healthz) and passive outlier detection (consecutive 5xx responses) eject the instance from the load-balancing pool.

**Example**

An active check that calls /healthz every 5 s and needs 3 failures takes about 15 s to notice a crash. Passive detection is faster: after 5 errors in a row, the instance is taken out of rotation at once, for 30 s, then tried again.

**මෙය වැඩ කරන හැටි**

Active health checks (අසාර්ථක /healthz එකක්) සහ passive outlier detection (පිළිවෙලින් එන 5xx responses) මගින් instance එක load-balancing pool එකෙන් ඉවත් කරනවා.

**උදාහරණය**

තත්පර 5කට සැරයක් /healthz call කරලා, අසාර්ථක වීම් 3ක් ඕන වෙන active check එකකට crash එකක් හඳුනාගන්න තත්පර 15ක් පමණ යනවා. Passive detection ඊට වඩා වේගවත්: පිළිවෙලින් errors 5කට පස්සේ instance එක වහාම තත්පර 30කට rotation එකෙන් ඉවත් කරලා, ඊට පස්සේ ආයෙත් උත්සාහ කරනවා.

_Words to know:_ Health check

---

### 2. Routed around it · වෙනත් පාරකින් යවනවා

**Watch:** The Routing light turns on and sends the request to Orders service #2. The answer comes back to the browser as usual.

**බලන්න:** Routing පහන දැල්වෙලා request එක Orders service #2 ට යවනවා. උත්තරය සුපුරුදු විදිහටම browser එකට ආපහු එනවා.

#### Beginner

**In simple words**

The gateway simply sends the request to the healthy copy. You get your orders, and you never know anything went wrong. That is why systems run more than one copy of each service.

**Like in real life**

When one checkout at the supermarket closes, the staff send you to the next one that is open. You still pay for your shopping, maybe a little more slowly.

**සරලව කිව්වොත්**

Gateway එක සරලවම request එක හොඳ තත්වයේ තියෙන පිටපතට යවනවා. ඔබට ඔබේ orders ලැබෙනවා, මොකක් හරි වැරදුණා කියලා ඔබ දැනගන්නේවත් නැහැ. Systems හැම service එකකම පිටපත් එකකට වඩා run කරන්නේ ඒ නිසයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Supermarket එකේ එක checkout එකක් වැහුවම, සේවකයෝ ඔබව ඊළඟට ඇරලා තියෙන checkout එකට යවනවා. ඔබට තවමත් ඔබේ බඩු වලට ගෙවන්න පුළුවන්, සමහර විට ටිකක් හෙමින්.

#### Advanced

**How it works**

Redundancy only helps if the router knows who is healthy. The gateway may also retry a failed attempt once on another instance, within a retry budget, so retries can’t multiply load during an incident.

**Example**

Losing one of two instances halves capacity. If each instance handles 300 requests per second and traffic peaks at 400, the survivor is overloaded. That is why capacity is planned as “N+1”: enough instances that losing one still covers the peak.

**මෙය වැඩ කරන හැටි**

Redundancy ප්‍රයෝජනවත් වෙන්නේ router එක කවුද healthy කියලා දන්නවා නම් විතරයි. Gateway එකට අසාර්ථක උත්සාහයක් වෙනත් instance එකක එක පාරක් retry කරන්නත් පුළුවන්, retry budget එකක් ඇතුළත; එතකොට incident එකකදී retries නිසා load එක ගුණ වෙන්නේ නැහැ.

**උදාහරණය**

Instances දෙකෙන් එකක් නැති වුණාම ධාරිතාව බාගයකින් අඩු වෙනවා. හැම instance එකකටම තත්පරයකට requests 300ක් හසුරුවන්න පුළුවන් නම්, traffic උපරිමය 400ක් නම්, ඉතුරු වෙන instance එක overload වෙනවා. ධාරිතාව “N+1” විදිහට සැලසුම් කරන්නේ ඒ නිසයි: එකක් නැති වුණත් උපරිමයට ප්‍රමාණවත් instances.

_Words to know:_ Load balancing, Health check · _Message:_ The request the gateway forwards to Orders

---

### 3. If every instance is down · හැම instance එකක්ම නතර වුණොත්

**Watch:** Orders service #2 goes dark too. The Routing light turns red, the badge shows 503, and a red packet goes back.

**බලන්න:** Orders service #2 ත් අඳුරු වෙනවා. Routing පහන රතු වෙනවා, badge එකේ 503 පෙන්නනවා, රතු packet එකක් ආපහු යනවා.

#### Beginner

**In simple words**

Now both copies are down. With nowhere to send the request, the gateway answers honestly and quickly: 503. It means “not available right now, try again in 30 seconds”.

**Like in real life**

If every checkout is closed, someone at the door tells you “sorry, we’re closed for a few minutes”, so you don’t queue for nothing.

**සරලව කිව්වොත්**

දැන් පිටපත් දෙකම නතර වෙලා. Request එක යවන්න තැනක් නැති නිසා gateway එක අවංකවම, ඉක්මනින් උත්තර දෙනවා: 503. ඒකෙන් කියන්නේ “දැන් ලබාගන්න බැහැ, තත්පර 30කින් ආයෙත් උත්සාහ කරන්න” කියන එක.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

හැම checkout එකක්ම වහලා නම්, දොරටුව ළඟ ඉන්න කෙනෙක් ඔබට කියනවා “සමාවෙන්න, විනාඩි කිහිපයකට අපි වහලා” කියලා. එතකොට ඔබ නිකරුණේ පෝලිමේ ඉන්නේ නැහැ.

#### Advanced

**How it works**

Failing fast with 503 (often via a circuit breaker) gives the service room to recover. The client should back off as in the timeout scenario.

**Example**

A circuit breaker on the orders route opens when half the requests fail within 10 s. While it is open, the gateway answers 503 at once, without calling Orders. After 30 s it lets a few test requests through (“half-open”), and closes again when they succeed.

**මෙය වැඩ කරන හැටි**

503 එකකින් ඉක්මනින් අසාර්ථක කිරීම (බොහෝ විට circuit breaker එකක් හරහා) service එකට යථා තත්වයට එන්න ඉඩ දෙනවා. Client එක timeout scenario එකේ වගේම back off කරන්න ඕන.

**උදාහරණය**

Orders route එකේ circuit breaker එකක් තත්පර 10ක් ඇතුළත requests වලින් බාගයක් අසාර්ථක වුණාම open වෙනවා. එය open ව තියෙද්දී gateway එක Orders call නොකර වහාම 503 උත්තර දෙනවා. තත්පර 30කට පස්සේ එය test requests කිහිපයකට යන්න ඉඩ දෙනවා (“half-open”), ඒවා සාර්ථක වුණාම ආයෙත් close වෙනවා.

_Words to know:_ Status code, Retry-After · _Message:_ The gateway’s answer

---

## Parts of the scene

### Browser (browser)

|                   | English                                                                                                                                               | සිංහල                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                | Client                                                                                                                                                          |
| Simple summary    | The app you use. It asks the shop for information and shows it to you.                                                                                | ඔබ පාවිච්චි කරන app එක. එය කඩෙන් තොරතුරු ඉල්ලලා ඔබට පෙන්නනවා.                                                                                                           |
| Like in real life | Like a customer at a shop counter: you ask for what you want and it is handed to you. You never go into the storeroom yourself.                       | කඩේ කවුන්ටරය ළඟ ඉන්න පාරිභෝගිකයෙක් වගේ: ඔබට ඕන දේ ඉල්ලනවා, ඒක ඔබේ අතට දෙනවා. ඔබ කවදාවත් ගබඩා කාමරයට යන්නේ නැහැ.                                                          |
| What it does      | Shows you the shop’s pages; Sends a request when you click; Keeps your pass (token) after you sign in; Tries again politely when something goes wrong | කඩේ pages ඔබට පෙන්නනවා; ඔබ click කරද්දී request එකක් යවනවා; ඔබ sign in වුණාට පස්සේ ඔබේ අවසර පත්‍රය (token) තියාගන්නවා; මොකක් හරි වැරදුණොත් හෙමින්, ආචාරශීලීව ආයෙත් උත්සාහ කරනවා    |
| Talks to          | API gateway; Identity provider (sign-in and refresh only)                                                                                             | API gateway; Identity provider (sign-in සහ refresh විතරයි)                                                                                                        |
| Technical summary | A single-page app on its own origin, calling the API over HTTPS with a bearer token.                                                                  | තමන්ගේම origin එකක තියෙන single-page app එකක්. එය bearer token එකක් එක්ක HTTPS හරහා API එකට call කරනවා.                                                              |
| How it works      | fetch sends HTTPS requests over a reused HTTP/2 or HTTP/3 connection. Cross-origin calls that carry credentials are preceded by a CORS preflight.     | fetch එක ආයෙ ආයෙත් පාවිච්චි කරන HTTP/2 හෝ HTTP/3 connection එකක් හරහා HTTPS requests යවනවා. Credentials රැගෙන යන cross-origin calls වලට කලින් CORS preflight එකක් යනවා. |
| Responsibilities  | Render the user interface; Keep the access and refresh tokens; Call the API; Handle errors: refresh on 401, back off on 429, 503 and 504              | User interface එක render කිරීම; Access සහ refresh tokens තියාගැනීම; API එකට call කිරීම; Errors හැසිරවීම: 401 ට refresh, 429, 503 සහ 504 ට back off                      |
| Inputs            | User actions; API responses                                                                                                                           | User ගේ ක්‍රියා; API responses                                                                                                                                    |
| Outputs           | API requests                                                                                                                                          | API requests                                                                                                                                                    |
| Examples          | A React single-page app calling a REST API; A mobile app using the same API                                                                           | REST API එකකට call කරන React single-page app එකක්; එම API එකම පාවිච්චි කරන mobile app එකක්                                                                           |
| Advantages        | Rich, responsive interface; Works offline-first if designed to                                                                                        | පොහොසත්, ඉක්මනින් ප්‍රතිචාර දක්වන interface එකක්; එහෙම design කළොත් offline-first වැඩ කරනවා                                                                              |
| Limitations       | Runs on an untrusted device: never trust its input; Never put secrets in it                                                                           | විශ්වාස කරන්න බැරි device එකක run වෙනවා: එහි input කවදාවත් විශ්වාස කරන්න එපා; කවදාවත් එහි secrets දාන්න එපා                                                                 |
| Technologies      | React, Vue, Angular, fetch, TanStack Query                                                                                                            |                                                                                                                                                                 |

### API Gateway (gateway)

|                   | English                                                                                                                                                                                                                                                                                    | සිංහල                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Edge component                                                                                                                                                                                                                                                                             | Edge component                                                                                                                                                                                                                                                                      |
| Simple summary    | The front door of the system. Every request comes through it first.                                                                                                                                                                                                                        | System එකේ ඉදිරි දොරටුව. හැම request එකක්ම මුලින්ම එන්නේ මේ හරහා.                                                                                                                                                                                                                           |
| Like in real life | Like a hotel reception desk: it checks who you are, makes sure you are allowed in, and sends you to the right room.                                                                                                                                                                        | Hotel එකක reception එක වගේ: ඔබ කවුද කියලා බලනවා, ඇතුළට එන්න අවසර තියෙනවද කියලා තහවුරු කරනවා, ඔබව හරි කාමරයට යවනවා.                                                                                                                                                                           |
| What it does      | Opens the sealed (encrypted) request; Checks your pass; Stops anyone who sends too many requests; Checks that the request is written correctly; Sends it to the right service                                                                                                              | සීල් කරපු (encrypt කරපු) request එක අරිනවා; ඔබේ අවසර පත්‍රය පරීක්ෂා කරනවා; requests වැඩිපුර යවන අයව නවත්වනවා; request එක හරියට ලියලා තියෙනවද කියලා බලනවා; එය හරි service එකට යවනවා                                                                                                                  |
| Talks to          | Browser; Identity provider (keys only); Orders service                                                                                                                                                                                                                                     | Browser; Identity provider (keys විතරයි); Orders service                                                                                                                                                                                                                              |
| Technical summary | A reverse proxy that acts as the single entry point for client traffic. It terminates TLS, authenticates requests, enforces rate limits and routes each request to the right upstream service, so cross-cutting concerns live in one place instead of in every service.                    | Client traffic වලට ඇතුළු වෙන එකම තැන විදිහට වැඩ කරන reverse proxy එකක්. එය TLS terminate කරනවා, requests authenticate කරනවා, rate limits ක්‍රියාත්මක කරනවා, හැම request එකක්ම හරි upstream service එකට route කරනවා. ඒ නිසා cross-cutting concerns හැම service එකකම නෙවෙයි, එක තැනක තියෙනවා.      |
| How it works      | Each request passes five stations in order: TLS (decrypt), authentication (verify the token), rate limit (check the allowance), validation (check the shape) and routing (pick a healthy instance). On the way back it compresses the response, adds headers and records logs and metrics. | හැම request එකක්ම පිළිවෙලින් stations පහක් පසු කරනවා: TLS (decrypt), authentication (token එක verify කිරීම), rate limit (දීමනාව පරීක්ෂාව), validation (හැඩය පරීක්ෂාව) සහ routing (healthy instance එකක් තේරීම). ආපහු යද්දී එය response එක compress කරලා, headers එකතු කරලා, logs සහ metrics සටහන් කරනවා. |
| Responsibilities  | Terminate TLS; Authenticate requests (JWT validation); Enforce rate limits and quotas; Validate requests before they reach services; Route and load-balance to upstream services; Emit logs, metrics and traces for every request                                                          | TLS terminate කිරීම; Requests authenticate කිරීම (JWT validation); Rate limits සහ quotas ක්‍රියාත්මක කිරීම; Requests services වලට යන්න කලින් validate කිරීම; Upstream services වලට route සහ load-balance කිරීම; හැම request එකකටම logs, metrics සහ traces නිකුත් කිරීම                                   |
| Inputs            | HTTPS requests from clients                                                                                                                                                                                                                                                                | Clients ගෙන් එන HTTPS requests                                                                                                                                                                                                                                                       |
| Outputs           | Requests to upstream services; Responses back to clients                                                                                                                                                                                                                                   | Upstream services වලට requests; Clients ලට ආපහු responses                                                                                                                                                                                                                            |
| Examples          | Netflix’s edge gateway (Zuul) routes device requests to backend services; AWS API Gateway in front of Lambda functions                                                                                                                                                                     | Netflix ගේ edge gateway එක (Zuul) devices වලින් එන requests backend services වලට route කරනවා; Lambda functions වලට ඉස්සරහින් AWS API Gateway                                                                                                                                             |
| Advantages        | One place for cross-cutting concerns; Hides the internal service topology from clients; Simpler clients: one host, one auth scheme                                                                                                                                                         | Cross-cutting concerns වලට එකම තැනක්; ඇතුළේ service topology එක clients ලගෙන් සඟවනවා; සරල clients: එක host එකක්, එක auth scheme එකක්                                                                                                                                                     |
| Limitations       | Adds a network hop and some latency; Must be redundant, or it becomes a single point of failure; Business logic tends to creep in over time                                                                                                                                                | Network hop එකක් සහ පොඩි latency එකක් එකතු කරනවා; Redundant විය යුතුයි, නැත්නම් single point of failure එකක් වෙනවා; කාලයත් එක්ක business logic ඇතුළට රිංගන්න පුළුවන්                                                                                                                                   |
| Technologies      | Kong, Envoy, NGINX, AWS API Gateway, Azure API Management, Apigee                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                     |

### Identity provider (identity)

|                   | English                                                                                                                                                                                   | සිංහල                                                                                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kind              | Security service                                                                                                                                                                          | Security service                                                                                                                                                                                                         |
| Simple summary    | The office that gives you a pass when you sign in.                                                                                                                                        | ඔබ sign in වුණාම ඔබට අවසර පත්‍රයක් දෙන කාර්යාලය.                                                                                                                                                                             |
| Like in real life | Like the ticket office of a museum: it checks who you are once and gives you a ticket. After that, the guards only look at the ticket.                                                    | කෞතුකාගාරයක ටිකට් කාර්යාලය වගේ: එය එක පාරක් ඔබ කවුද කියලා බලලා ටිකට් පතක් දෙනවා. ඊට පස්සේ මුරකරුවෝ බලන්නේ ටිකට් පත විතරයි.                                                                                                                 |
| What it does      | Checks your password when you sign in; Gives out passes (tokens); Gives you a new pass when the old one expires; Shares the stamp (public key) that guards use to spot fake passes        | ඔබ sign in වෙද්දී ඔබේ password එක පරීක්ෂා කරනවා; අවසර පත්‍ර (tokens) දෙනවා; පරණ එක කල් ඉකුත් වුණාම අලුත් අවසර පත්‍රයක් දෙනවා; බොරු අවසර පත්‍ර අල්ලගන්න මුරකරුවන් පාවිච්චි කරන මුද්‍රාව (public key) බෙදාදෙනවා                                     |
| Talks to          | Browser (sign-in, refresh); API gateway (fetches its keys now and then)                                                                                                                   | Browser (sign-in, refresh); API gateway (වරින් වර එහි keys ගන්නවා)                                                                                                                                                           |
| Technical summary | An OAuth 2.0 / OpenID Connect authorization server that issues signed tokens and publishes its public keys (JWKS).                                                                        | Signed tokens නිකුත් කරලා, තමන්ගේ public keys (JWKS) ප්‍රසිද්ධ කරන OAuth 2.0 / OpenID Connect authorization server එකක්.                                                                                                         |
| How it works      | After sign-in it issues a short-lived JWT access token and a longer-lived refresh token. Anyone with its public keys can verify its tokens offline, so it is not called on every request. | Sign-in වුණාට පස්සේ එය කෙටි කාලයකට වලංගු JWT access token එකකුයි, වැඩි කාලයකට වලංගු refresh token එකකුයි නිකුත් කරනවා. එහි public keys තියෙන ඕනම කෙනෙකුට ඒ tokens offline verify කරන්න පුළුවන්, ඒ නිසා හැම request එකකදීම එයට call කරන්නේ නැහැ. |
| Responsibilities  | Authenticate users (password, MFA, SSO); Issue access and refresh tokens; Publish its signing keys and rotate them                                                                        | Users authenticate කිරීම (password, MFA, SSO); Access සහ refresh tokens නිකුත් කිරීම; තමන්ගේ signing keys ප්‍රසිද්ධ කරලා rotate කිරීම                                                                                                 |
| Inputs            | Sign-in and token requests                                                                                                                                                                | Sign-in සහ token requests                                                                                                                                                                                                |
| Outputs           | Tokens; Public keys (JWKS)                                                                                                                                                                | Tokens; Public keys (JWKS)                                                                                                                                                                                               |
| Examples          | Signing in with Google or Microsoft (OpenID Connect); Keycloak issuing tokens for an internal app                                                                                         | Google හෝ Microsoft එක්ක sign in වීම (OpenID Connect); Internal app එකකට Keycloak tokens නිකුත් කිරීම                                                                                                                           |
| Advantages        | One place for identity; Tokens can be verified offline                                                                                                                                    | Identity වලට එකම තැනක්; Tokens offline verify කරන්න පුළුවන්                                                                                                                                                                   |
| Limitations       | Short-lived tokens can’t be revoked instantly; Critical for sign-in, so it must be highly available                                                                                       | කෙටි කාලීන tokens වහාම revoke කරන්න බැහැ; Sign-in වලට අත්‍යවශ්‍ය නිසා, එය highly available විය යුතුයි                                                                                                                              |
| Technologies      | Auth0, Okta, Microsoft Entra ID, Keycloak, AWS Cognito                                                                                                                                    |                                                                                                                                                                                                                          |

### Orders service (orders-1)

|                   | English                                                                                                                                                                                     | සිංහල                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kind              | Backend service (copy #1 of 2)                                                                                                                                                              | Backend service (පිටපත් 2න් #1)                                                                                                                                                                     |
| Simple summary    | The part of the system that knows everything about orders.                                                                                                                                  | Orders ගැන හැම දෙයක්ම දන්න system එකේ කොටස.                                                                                                                                                        |
| Like in real life | Like the orders department of a company: it keeps track of what everyone bought, and follows the rules about who may see what.                                                              | සමාගමක orders අංශය වගේ: හැමෝම මිලදී ගත්තේ මොනවද කියලා එය සටහන් කරලා තියාගන්නවා, කාට මොනවා බලන්න පුළුවන්ද කියන නීති අනුගමනය කරනවා.                                                                               |
| What it does      | Follows the rules about orders; Reads and saves orders in the database; Asks other services for extra details; Writes the answer                                                            | Orders ගැන නීති අනුගමනය කරනවා; Database එකේ orders කියවනවා, save කරනවා; වැඩිපුර විස්තර අනිත් services වලින් අහනවා; උත්තරය ලියනවා                                                                               |
| Talks to          | API gateway; Users service; PostgreSQL                                                                                                                                                      | API gateway; Users service; PostgreSQL                                                                                                                                                           |
| Technical summary | A domain service owning the orders data and rules, running as several stateless instances.                                                                                                  | Orders data සහ නීති අයිති, stateless instances කිහිපයක් විදිහට run වෙන domain service එකක්.                                                                                                                |
| How it works      | Receives requests already authenticated by the gateway (the caller’s identity in a header), queries PostgreSQL through a connection pool, and calls the Users service with its own timeout. | Gateway එකෙන් දැනටමත් authenticate කරපු requests ලබාගන්නවා (caller ගේ identity එක header එකක). Connection pool එකක් හරහා PostgreSQL query කරනවා, තමන්ගේම timeout එකක් එක්ක Users service එකට call කරනවා. |
| Responsibilities  | Enforce order rules (who may see what); Read and write orders; Combine data from other services; Return API responses                                                                       | Order නීති ක්‍රියාත්මක කිරීම (කාට මොනවා බලන්න පුළුවන්ද); Orders කියවීම සහ ලිවීම; අනිත් services වල data එකතු කිරීම; API responses ආපහු දීම                                                                             |
| Inputs            | Requests from the gateway; Data from the Users service and PostgreSQL                                                                                                                       | Gateway එකෙන් එන requests; Users service එකෙන් සහ PostgreSQL එකෙන් එන data                                                                                                                          |
| Outputs           | API responses; Queries; Internal requests                                                                                                                                                   | API responses; Queries; Internal requests                                                                                                                                                        |
| Examples          | An e-commerce service owning carts and orders                                                                                                                                               | Carts සහ orders අයිති e-commerce service එකක්                                                                                                                                                       |
| Advantages        | Independent deploys and scaling; Clear ownership of orders                                                                                                                                  | ස්වාධීනව deploy සහ scale කරන්න පුළුවන්; Orders වල අයිතිය පැහැදිලියි                                                                                                                                         |
| Limitations       | Calls between services add latency; New failure modes: timeouts, partial outages                                                                                                            | Services අතර calls නිසා latency වැඩි වෙනවා; අලුත් failure modes: timeouts, අර්ධ outages                                                                                                               |
| Technologies      | Node.js, Java / Spring, Go, .NET, A /healthz endpoint                                                                                                                                       |                                                                                                                                                                                                  |

### Orders service (orders-2)

|                   | English                                                                                                                      | සිංහල                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service (copy #2 of 2)                                                                                               | Backend service (පිටපත් 2න් #2)                                                                                                           |
| Simple summary    | A second copy of the Orders service, ready to share the work.                                                                | වැඩේ බෙදාගන්න ලෑස්තියෙන් ඉන්න Orders service එකේ දෙවෙනි පිටපත.                                                                                |
| Like in real life | Like a second checkout at a supermarket: it does the same job, so if one is busy or closed, the other one serves you.        | Supermarket එකක දෙවෙනි checkout එක වගේ: එකම වැඩේ කරනවා, ඒ නිසා එකක් කාර්යබහුල නම් හෝ වහලා නම් අනිත් එකෙන් ඔබට සේවය ලැබෙනවා.                      |
| What it does      | Shares the work with copy #1; Takes over if copy #1 breaks                                                                   | පිටපත #1 එක්ක වැඩේ බෙදාගන්නවා; පිටපත #1 කැඩුණොත් වැඩේ භාරගන්නවා                                                                               |
| Talks to          | API gateway; Users service; PostgreSQL                                                                                       | API gateway; Users service; PostgreSQL                                                                                                 |
| Technical summary | An identical, stateless instance. The gateway load-balances across both and routes around one that fails.                    | සමාන, stateless instance එකක්. Gateway එක දෙක අතරේ load-balance කරනවා, එකක් අසාර්ථක වුණොත් ඒක මඟහැරලා route කරනවා.                          |
| How it works      | Same code and database as instance #1. Because instances keep no state between requests, any of them can answer any request. | Instance #1 එකේ තියෙන code එකම සහ database එකම. Instances requests අතර state තියාගන්නේ නැති නිසා, ඕනම එකකට ඕනම request එකකට උත්තර දෙන්න පුළුවන්. |
| Responsibilities  | Share the load; Take over when the other instance fails                                                                      | Load එක බෙදාගැනීම; අනිත් instance එක අසාර්ථක වුණාම වැඩේ භාරගැනීම                                                                             |
| Inputs            | Requests from the gateway                                                                                                    | Gateway එකෙන් එන requests                                                                                                               |
| Outputs           | API responses                                                                                                                | API responses                                                                                                                          |
| Examples          | Two to dozens of replicas behind one route                                                                                   | එක route එකක් පිටිපස්සේ replicas දෙකේ ඉඳන් දුසිම් ගණනක් දක්වා                                                                                    |
| Advantages        | Redundancy; Horizontal scaling                                                                                               | Redundancy; Horizontal scaling                                                                                                         |
| Limitations       | Only works if instances are stateless; Needs health checks to be useful                                                      | Instances stateless නම් විතරයි වැඩ කරන්නේ; ප්‍රයෝජනවත් වෙන්න health checks ඕන                                                                 |
| Technologies      | Container orchestration (Kubernetes, ECS), Autoscaling                                                                       |                                                                                                                                        |

### Users service (users)

|                   | English                                                                                                   | සිංහල                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                           | Backend service                                                                                            |
| Simple summary    | The part of the system that keeps customer details, like names and addresses.                             | නම් සහ ලිපිනයන් වගේ පාරිභෝගික විස්තර තියාගන්න system එකේ කොටස.                                                       |
| Like in real life | Like the school office that keeps every student’s address: teachers ask it when they need one.            | හැම ශිෂ්‍යයෙකුගේම ලිපිනය තියාගන්න පාසල් කාර්යාලය වගේ: ගුරුවරුන්ට ලිපිනයක් ඕන වුණාම එතනින් අහනවා.                              |
| What it does      | Keeps customer details; Answers other services when they ask                                              | පාරිභෝගික විස්තර තියාගන්නවා; අනිත් services ඇහුවාම උත්තර දෙනවා                                                       |
| Talks to          | Orders service (and other services)                                                                       | Orders service (සහ අනිත් services)                                                                           |
| Technical summary | The domain service owning user profiles, called internally by other services.                             | User profiles අයිති, අනිත් services ඇතුළතින් call කරන domain service එක.                                          |
| How it works      | Serves profile data to other services over internal (east–west) calls that never pass the gateway.        | Gateway එක හරහා කවදාවත් නොයන internal (east–west) calls හරහා අනිත් services වලට profile data දෙනවා.           |
| Responsibilities  | Store and return user profiles; Own user data and its rules                                               | User profiles ගබඩා කරලා ආපහු දීම; User data සහ ඒවායේ නීති අයිති වීම                                               |
| Inputs            | Internal requests                                                                                         | Internal requests                                                                                          |
| Outputs           | User profiles                                                                                             | User profiles                                                                                              |
| Examples          | A profile service used by checkout, emails and support tools                                              | Checkout, emails සහ support tools පාවිච්චි කරන profile service එකක්                                            |
| Advantages        | A single source of truth for users                                                                        | Users ගැන එකම source of truth එකක්                                                                          |
| Limitations       | Every service that needs user data now depends on it (consider caching, or copying the few fields needed) | User data ඕන හැම service එකක්ම දැන් මේක මත රඳා පවතිනවා (caching ගැන, නැත්නම් ඕන fields ටික copy කරගැනීම ගැන හිතන්න) |
| Technologies      | Node.js, Java / Spring, Go, .NET                                                                          |                                                                                                            |

### PostgreSQL (postgres)

|                   | English                                                                                                                                      | සිංහල                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Data store (the Orders database)                                                                                                             | Data store (Orders database එක)                                                                                                             |
| Simple summary    | The database: where the orders are kept safely.                                                                                              | Database එක: orders ආරක්ෂිතව තියාගන්න තැන.                                                                                                      |
| Like in real life | Like a tidy filing cabinet with an index card for everything, so any file can be found in seconds.                                           | හැම දෙයකටම index කාඩ් එකක් තියෙන පිළිවෙළට තියෙන file කබඩ් එකක් වගේ: ඕනම file එකක් තත්පර කිහිපයකින් හොයාගන්න පුළුවන්.                                          |
| What it does      | Keeps orders safe, even if the power goes off; Finds the right orders quickly; Makes sure two changes at the same time don’t mix up the data | කරන්ට් ගියත් orders ආරක්ෂිතව තියාගන්නවා; හරි orders ඉක්මනින් හොයාගන්නවා; එකම වෙලාවේ වෙනස්කම් දෙකක් ආවත් data පැටලෙන්නේ නැති බව තහවුරු කරනවා                      |
| Talks to          | Orders service only: each service owns its database                                                                                          | Orders service විතරයි: හැම service එකකටම තමන්ගේම database එකක්                                                                                  |
| Technical summary | A relational database providing transactions (ACID), indexes and SQL.                                                                        | Transactions (ACID), indexes සහ SQL සපයන relational database එකක්.                                                                           |
| How it works      | Queries use indexes to find rows quickly. Each write is logged before it is acknowledged (the write-ahead log), so it survives crashes.      | Rows ඉක්මනින් හොයාගන්න queries indexes පාවිච්චි කරනවා. හැම write එකක්ම acknowledge කරන්න කලින් log කරනවා (write-ahead log), ඒ නිසා crash වුණත් එය ආරක්ෂිතයි. |
| Responsibilities  | Store orders durably; Answer queries quickly; Keep data consistent under concurrent writes                                                   | Orders durable ලෙස ගබඩා කිරීම; Queries වලට ඉක්මනින් උත්තර දීම; එකවර එන writes යටතේ data consistent ලෙස තියාගැනීම                                     |
| Inputs            | SQL queries                                                                                                                                  | SQL queries                                                                                                                                 |
| Outputs           | Rows                                                                                                                                         | Rows                                                                                                                                        |
| Examples          | An orders table indexed by user and status; A read replica serving reporting queries                                                         | User සහ status අනුව index කරපු orders table එකක්; Reporting queries වලට සේවය කරන read replica එකක්                                              |
| Advantages        | Strong consistency; Flexible queries                                                                                                         | Strong consistency; නම්‍යශීලී queries                                                                                                          |
| Limitations       | Scaling writes beyond one primary is hard (sharding); Connections are expensive                                                              | එක primary එකකට වඩා writes scale කිරීම අමාරුයි (sharding); Connections වියදම් අධිකයි                                                                |
| Technologies      | PostgreSQL, Amazon RDS / Aurora, Azure Database, Cloud SQL, PgBouncer                                                                        |                                                                                                                                             |

## Words to know

| Term                             | English                                                                                                     | සිංහල                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 401 Unauthorized                 | The answer when the pass is missing, wrong or expired.                                                      | අවසර පත්‍රය නැති, වැරදි හෝ කල් ඉකුත් වුණු විට දෙන උත්තරය.                                                                  |
| 429 Too Many Requests            | The answer for a client that has used up its allowance.                                                     | තමන්ගේ දීමනාව ඉවර කරපු client කෙනෙකුට දෙන උත්තරය.                                                                     |
| Client                           | The program that sends requests: here, the browser.                                                         | Requests යවන program එක: මෙතනදී browser එක.                                                                       |
| Origin                           | The scheme, host and port of a web address. The browser keeps different origins apart.                      | Web ලිපිනයක scheme එක, host එක සහ port එක. Browser එක වෙනස් origins එකිනෙකින් වෙන් කරලා තියනවා.                          |
| CORS preflight                   | A small OPTIONS request the browser sends first, to ask whether a call to another origin is allowed.        | වෙනත් origin එකකට call කරන්න අවසර තියෙනවද කියලා අහන්න browser එක මුලින්ම යවන පොඩි OPTIONS request එකක්.                    |
| HTTP method                      | The action a request asks for, such as GET (give me) or POST (create this).                                 | Request එකෙන් ඉල්ලන ක්‍රියාව, උදාහරණ GET (මට දෙන්න) හෝ POST (මේක හදන්න).                                               |
| Header                           | A named note sent along with a message.                                                                     | Message එකක් එක්ක යවන නමක් තියෙන සටහනක්.                                                                              |
| Bearer token                     | A pass that proves who you are. Whoever holds it is trusted, so keep it safe.                               | ඔබ කවුද කියලා ඔප්පු කරන අවසර පත්‍රයක්. එය අතේ තියෙන ඕනම කෙනෙක්ව විශ්වාස කරන නිසා, ඒක ආරක්ෂිතව තියාගන්න.                         |
| Idempotent                       | Sending the request twice has the same effect as sending it once.                                           | Request එක දෙපාරක් යැව්වත්, එක පාරක් යැව්වා වගේම ප්‍රතිඵලය.                                                             |
| DNS                              | The internet’s contacts list: it turns names like api.shop.example into addresses.                          | Internet එකේ contacts list එක: api.shop.example වගේ නම් ලිපිනයන් බවට හරවනවා.                                         |
| TLS                              | The secret code that keeps a connection private and proves who is on the other side (the “S” in HTTPS).     | Connection එකක් පෞද්ගලිකව තියාගෙන, අනිත් පැත්තේ ඉන්නේ කවුද කියලා ඔප්පු කරන රහස් කේතය (HTTPS වල “S” එක).                       |
| Round trip (RTT)                 | The time for a message to reach the other side and an answer to come back.                                  | Message එකක් අනිත් පැත්තට ගිහින් උත්තරයක් ආපහු එන්න යන කාලය.                                                                |
| Reverse proxy                    | A server that receives requests for other servers and passes them on.                                       | අනිත් servers වෙනුවෙන් requests ලබාගෙන ඒවා ඉදිරියට යවන server එකක්.                                                     |
| TLS termination                  | Unlocking the secure connection at the front door, so the request can be read.                              | Request එක කියවන්න පුළුවන් වෙන්න, ඉදිරි දොරටුවේදීම ආරක්ෂිත connection එක ඇරීම.                                                |
| North–south traffic              | Requests coming into the system from outside, and their answers.                                            | පිටතින් system එකට එන requests සහ ඒවායේ උත්තර.                                                                       |
| JWT                              | JSON Web Token: a signed pass with facts about a user, which anyone with the public key can check.          | JSON Web Token: user කෙනෙක් ගැන කරුණු තියෙන, sign කරපු අවසර පත්‍රයක්. Public key එක තියෙන ඕනම කෙනෙකුට එය පරීක්ෂා කරන්න පුළුවන්. |
| JWKS                             | JSON Web Key Set: the public keys an identity provider shares, so others can check its tokens.              | JSON Web Key Set: අනිත් අයට තමන්ගේ tokens පරීක්ෂා කරන්න පුළුවන් වෙන්න identity provider එකක් බෙදාදෙන public keys.           |
| Claims                           | The facts written inside a token, such as who it is for and when it expires.                                | Token එකක් ඇතුළේ ලියලා තියෙන කරුණු: උදාහරණ, එය කාටද සහ කල් ඉකුත් වෙන්නේ කවදාද.                                             |
| Authentication vs. authorization | “Who are you?” (authentication) versus “what may you do?” (authorization).                                  | “ඔබ කවුද?” (authentication) සහ “ඔබට මොනවා කරන්න පුළුවන්ද?” (authorization).                                           |
| Token bucket                     | A way to limit requests: a bucket of tokens refills steadily, and each request takes one.                   | Requests සීමා කරන ක්‍රමයක්: tokens තියෙන bucket එකක් නිතිපතා පිරෙනවා, හැම request එකක්ම එකක් ගන්නවා.                        |
| Retry-After                      | A header that tells the client how long to wait before trying again.                                        | ආයෙත් උත්සාහ කරන්න කලින් කොච්චර වෙලා ඉන්න ඕනද කියලා client එකට කියන header එකක්.                                           |
| Route table                      | The gateway’s list of which addresses go to which service.                                                  | කුමන ලිපිනයන් කුමන service එකට යනවද කියන gateway එකේ ලැයිස්තුව.                                                           |
| Load balancing                   | Sharing requests between several copies of a service.                                                       | Service එකක පිටපත් කිහිපයක් අතර requests බෙදීම.                                                                        |
| Health check                     | A regular “are you OK?” that tells the gateway whether a copy can take requests.                            | පිටපතකට requests ගන්න පුළුවන්ද කියලා gateway එකට කියන, නිතිපතා අහන “ඔයා හොඳින්ද?” ප්‍රශ්නය.                                   |
| Trace context                    | Headers (traceparent) that link every step of one request across services, so it can be followed.           | එක request එකක හැම පියවරක්ම services හරහා සම්බන්ධ කරන headers (traceparent), ඒ නිසා එය පසුපස යන්න පුළුවන්.                 |
| Business logic                   | The rules of the product itself, such as who may see which orders.                                          | Product එකේම නීති: උදාහරණයක් විදිහට කාට කුමන orders බලන්න පුළුවන්ද කියන එක.                                                 |
| East–west traffic                | Requests between services inside the system.                                                                | System එක ඇතුළේ services අතර යන requests.                                                                         |
| Timeout budget                   | How long each call may take. Calls deeper inside get less time, so callers give up in order.                | හැම call එකකටම ගන්න පුළුවන් කාලය. ඇතුළටම යන calls වලට අඩු කාලයක් ලැබෙන නිසා, callers පිළිවෙලට අත්හරිනවා.                     |
| Index                            | A database shortcut that finds matching rows without reading the whole table.                               | මුළු table එකම කියවන්නේ නැතුව ගැළපෙන rows හොයාගන්න database එකේ කෙටි මඟක්.                                               |
| Connection pool                  | A set of open database connections that are reused, instead of opening new ones.                            | අලුතින් open කරනවා වෙනුවට ආයෙ ආයෙත් පාවිච්චි කරන, open කරපු database connections ගොඩක්.                                    |
| SQL injection                    | An attack that sneaks SQL commands into a query through unchecked input.                                    | පරීක්ෂා නොකරපු input හරහා query එකකට SQL commands රිංගවන ප්‍රහාරයක්.                                                   |
| Status code                      | The three-digit result of a request: 2xx success, 4xx the client’s mistake, 5xx the server’s problem.       | Request එකක ඉලක්කම් තුනේ ප්‍රතිඵලය: 2xx සාර්ථකයි, 4xx client ගේ වැරැද්ද, 5xx server එකේ ප්‍රශ්නයක්.                         |
| JSON                             | A simple text format for information, readable by any program.                                              | ඕනම program එකකට කියවන්න පුළුවන්, තොරතුරු ලියන සරල text format එකක්.                                                      |
| Pagination                       | Sending a long list in pages, with a way to ask for the next page.                                          | දිගු ලැයිස්තුවක් pages වලට බෙදලා, ඊළඟ page එක ඉල්ලන්න ක්‍රමයක් එක්ක යැවීම.                                                   |
| Compression                      | Squeezing a response (gzip, Brotli) so it travels faster.                                                   | Response එකක් ඉක්මනට යන්න හකුළන එක (gzip, Brotli).                                                                   |
| Access log                       | One line per request: who called what, the result and how long it took.                                     | එක request එකකට එක පේළියක්: කවුද මොකටද call කළේ, ප්‍රතිඵලය, සහ ගිය කාලය.                                               |
| Observability                    | Logs, metrics and traces that let a team see what the system is doing.                                      | System එක මොනවද කරන්නේ කියලා team එකට බලන්න පුළුවන් කරන logs, metrics සහ traces.                                       |
| Latency                          | How long a request takes, from start to finish.                                                             | Request එකකට මුල ඉඳන් අගට යන කාලය.                                                                                 |
| Tail latency (p99)               | The time only the slowest 1% of requests go over.                                                           | හෙමින්ම යන requests වලින් 1%ක් විතරක් ඉක්මවන කාලය.                                                                       |
| Refresh token                    | A longer-lasting pass used only to get new access tokens.                                                   | අලුත් access tokens ගන්න විතරක් පාවිච්චි කරන, වැඩි කාලයක් වලංගු අවසර පත්‍රයක්.                                                |
| Exponential backoff              | Waiting longer after each failed try, with a little randomness (jitter) so clients don’t all retry at once. | අසාර්ථක වෙන හැම උත්සාහයකටම පස්සේ වැඩිපුර ඉන්න එක; clients ඔක්කොම එකපාර retry නොකරන්න පොඩි අහඹු බවක් (jitter) එකතු කරනවා.     |

## Message captions

| Message          | English                                                   | සිංහල                                                      |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| request          | The request the browser sends                             | Browser එක යවන request එක                                 |
| expired-request  | The same request, with a token that expired 4 minutes ago | එම request එකම, විනාඩි 4කට කලින් කල් ඉකුත් වූ token එකක් එක්ක       |
| forwarded        | The request the gateway forwards to Orders                | Gateway එක Orders වෙත යවන request එක                      |
| users-call       | Orders asks the Users service (inside the system)         | Orders එක Users service එකෙන් අහනවා (system එක ඇතුළේ)       |
| users-reply      | The Users service answers                                 | Users service එකේ උත්තරය                                   |
| sql-query        | The query Orders sends to PostgreSQL                      | Orders එක PostgreSQL එකට යවන query එක                     |
| sql-rows         | PostgreSQL returns two rows                               | PostgreSQL එක rows දෙකක් ආපහු දෙනවා                         |
| service-response | The response the Orders service builds                    | Orders service එක හදන response එක                         |
| final-response   | The response the browser receives                         | Browser එකට ලැබෙන response එක                             |
| 401-response     | The gateway’s answer                                      | Gateway එකේ උත්තරය                                         |
| refresh-request  | The app asks the identity provider for a new access token | App එක identity provider එකෙන් අලුත් access token එකක් ඉල්ලනවා |
| refresh-response | A fresh access token                                      | අලුත් access token එකක්                                      |
| 429-response     | The gateway’s answer                                      | Gateway එකේ උත්තරය                                         |
| 504-response     | The gateway’s answer                                      | Gateway එකේ උත්තරය                                         |
| 503-response     | The gateway’s answer                                      | Gateway එකේ උත්තරය                                         |

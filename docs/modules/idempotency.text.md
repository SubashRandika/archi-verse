# Idempotency module text (English and Sinhala)

- **Generated** by `npm run docs:module-text` from
  `src/content/modules/idempotency/text/`. Edit the TypeScript files, not this document.
- **Beginner** is written as if for a five-year-old, with an everyday example.
  **Advanced** keeps the technical depth and adds a worked example.
- **Sinhala** uses a friendly spoken style; technical terms stay in English.
- The learning objectives and scene notes are in
  [idempotency.md](idempotency.md).

---

## Main path

## Safe to repeat? · ආයෙත් කළාට කමක් නැද්ද?

### 1. Same request, twice · එකම request එක, දෙපාරක්

**Watch:** Shopper A sets the delivery address twice: the order still has one address. Then Shopper A pays twice without a key: the Payments DB shows two charges.

**බලන්න:** Shopper A delivery address එක දෙපාරක් දානවා: order එකට තියෙන්නේ තවමත් එක address එකයි. ඊට පස්සේ Shopper A key එකක් නැතුව දෙපාරක් ගෙවනවා: Payments DB එකේ charges දෙකක් පේනවා.

#### Beginner

**In simple words**

Some things are fine to do twice. If you say “my address is 12 Lake Road” two times, the shop still has one address: 12 Lake Road.

But if you say “take 12,400 rupees” two times, the shop takes the money two times. This module is about making the second kind safe too.

**Like in real life**

Pressing the lift button again doesn’t call two lifts. But putting money into a vending machine twice does buy you two drinks.

**සරලව කිව්වොත්**

සමහර දේවල් දෙපාරක් කළාට කමක් නැහැ. “මගේ address එක 12 Lake Road” කියලා දෙපාරක් කිව්වත්, කඩේට තියෙන්නේ එක address එකයි: 12 Lake Road.

ඒත් “රුපියල් 12,400ක් ගන්න” කියලා දෙපාරක් කිව්වොත්, කඩේ සල්ලි දෙපාරක් ගන්නවා. මේ module එක ඒ දෙවෙනි වර්ගයත් ආරක්ෂිත කරන හැටි ගැන.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Lift button එක ආයෙත් එබුවාට lifts දෙකක් එන්නේ නැහැ. ඒත් vending machine එකට දෙපාරක් සල්ලි දැම්මොත් drinks දෙකක් එනවා.

#### Advanced

**How it works**

An operation is idempotent if doing it many times has the same effect on the server as doing it once. RFC 9110 defines GET, HEAD, OPTIONS, TRACE, PUT and DELETE as idempotent: PUT replaces a resource with the same body, DELETE removes it once. POST and PATCH are not: each POST /payments creates a new payment.

Idempotent is about the effect, not the answer: a second DELETE may return 404 and a second PUT 200 instead of 201, and both are still idempotent. The method name only states what is expected; the server has to keep the promise.

**Example**

_The same request, twice_

```
PUT  /orders/1042/address   → 200 OK        (address = 12 Lake Rd)
PUT  /orders/1042/address   → 200 OK        (address = 12 Lake Rd, unchanged)

POST /payments              → 201 Created   pay_81f2
POST /payments              → 201 Created   pay_9c04   (a second charge)
```

**මෙය වැඩ කරන හැටි**

Operation එකක් ගොඩක් පාරවල් කළාම server එකට වෙන effect එක එක පාරක් කළා වගේම නම් ඒක idempotent. RFC 9110 GET, HEAD, OPTIONS, TRACE, PUT සහ DELETE idempotent කියලා define කරනවා: PUT resource එකක් එකම body එකෙන් replace කරනවා, DELETE ඒක එක පාරයි මකන්නේ. POST සහ PATCH එහෙම නෙවෙයි: හැම POST /payments එකක්ම අලුත් ගෙවීමක් හදනවා.

Idempotent කියන්නේ effect එක ගැන, උත්තරය ගැන නෙවෙයි: දෙවෙනි DELETE එකක් 404 දෙන්න පුළුවන්, දෙවෙනි PUT එකක් 201 වෙනුවට 200 දෙන්න පුළුවන්, ඒත් දෙකම තවමත් idempotent. Method එකේ නමෙන් කියන්නේ බලාපොරොත්තු වෙන දේ විතරයි; පොරොන්දුව රකින්න ඕනේ server එක.

**උදාහරණය**

_එකම request එක, දෙපාරක්_

```
PUT  /orders/1042/address   → 200 OK        (address = 12 Lake Rd)
PUT  /orders/1042/address   → 200 OK        (address = 12 Lake Rd, unchanged)

POST /payments              → 201 Created   pay_81f2
POST /payments              → 201 Created   pay_9c04   (a second charge)
```

_Words to know:_ Idempotent, Idempotent methods, Safe methods · _Message:_ Shopper A sets the delivery address

---

### 2. Where duplicates come from · Duplicates එන්නේ කොහෙන්ද

**Watch:** A double click sends two payments, and both answers are lost. The retry is slow, so the app times out and retries again. Four requests, four charges, one order.

**බලන්න:** Double click එකකින් ගෙවීම් දෙකක් යනවා, උත්තර දෙකම නැති වෙනවා. Retry එක හෙමින් යන නිසා app එක time out වෙලා ආයෙත් retry කරනවා. Requests හතරයි, charges හතරයි, order එකයි.

#### Beginner

**In simple words**

The app didn’t mean to pay four times. A finger tapped twice. Then the “done!” messages got lost, so the app asked again. Then the helper was slow, so the app asked again before the answer came.

Each time, the helper thought it was a new payment.

**Like in real life**

You post a letter, don’t hear back, and post it again. The shop now has two letters and can’t tell they are the same.

**සරලව කිව්වොත්**

App එකට ඕනේ වුණේ හතර පාරක් ගෙවන්න නෙවෙයි. ඇඟිල්ල දෙපාරක් tap වුණා. ඊට පස්සේ “ඉවරයි!” පණිවිඩ නැති වුණා, ඒ නිසා app එක ආයෙත් ඇහුවා. ඊට පස්සේ උදව්කාරයා හෙමින් හිටියා, ඒ නිසා උත්තරේ එන්න කලින් app එක ආයෙත් ඇහුවා.

හැම පාරම උදව්කාරයා හිතුවේ ඒක අලුත් ගෙවීමක් කියලා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ ලියුමක් post කරනවා, උත්තරයක් එන්නේ නැහැ, ආයෙත් post කරනවා. දැන් කඩේට ලියුම් දෙකක්, ඒවා එකම ලියුම කියලා දැනගන්න විදිහක් නැහැ.

#### Advanced

**How it works**

As soon as anyone retries, delivery is at least once: a client can’t tell “the request was lost” from “the answer was lost” from “the server is slow”. Duplicates come from double submits, client retries after timeouts or resets, proxies and load balancers retrying, mobile apps resending after a network switch, and message queues redelivering.

Exactly-once delivery is impossible over an unreliable network; an exactly-once effect is possible if the receiver recognises repeats. Disabling the button after a click fixes one source only. The fix belongs on the server, because only it sees every attempt.

**Example**

_What the server sees_

```
10:00:00.120  POST /payments  order 1042   ← click
10:00:00.310  POST /payments  order 1042   ← second click
10:00:05.400  POST /payments  order 1042   ← retry after a lost answer
10:00:15.900  POST /payments  order 1042   ← retry after a 10 s timeout
```

**මෙය වැඩ කරන හැටි**

කවුරු හරි retry කරනවා නම් delivery එක at least once: “request එක නැති වුණා”, “උත්තරය නැති වුණා”, “server එක හෙමින්” කියන ඒවා වෙන් කරලා අඳුනගන්න client ට බැහැ. Duplicates එන්නේ double submits, timeouts හෝ resets වලින් පස්සේ client retries, proxies සහ load balancers retry කිරීම, network එක මාරු වුණාම mobile apps ආයෙත් යැවීම, message queues ආයෙත් deliver කිරීම වගේ දේවල් වලින්.

විශ්වාස කරන්න බැරි network එකක exactly-once delivery බැහැ; ලබන කෙනා repeats අඳුනගන්නවා නම් exactly-once effect එකක් පුළුවන්. Click එකකට පස්සේ button එක disable කරන එකෙන් හැදෙන්නේ එක මූලාශ්‍රයක් විතරයි. විසඳුම තියෙන්න ඕනේ server එකේ, මොකද හැම attempt එකක්ම දකින්නේ ඒකට විතරයි.

**උදාහරණය**

_Server එකට පේන දේ_

```
10:00:00.120  POST /payments  order 1042   ← click
10:00:00.310  POST /payments  order 1042   ← second click
10:00:05.400  POST /payments  order 1042   ← retry after a lost answer
10:00:15.900  POST /payments  order 1042   ← retry after a 10 s timeout
```

_Words to know:_ At-least-once delivery, Exactly-once effect, Double submit · _Message:_ Shopper A pays for order 1042 (no key)

---

## Idempotency keys · Idempotency keys

### 3. One key per payment · ගෙවීමකට එක key එකයි

**Watch:** Shopper A makes a key and saves it, then pays with it. The answer is lost, so Shopper A retries with the same key.

**බලන්න:** Shopper A key එකක් හදලා save කරනවා, ඊට පස්සේ ඒකෙන් ගෙවනවා. උත්තරය නැති වෙනවා, ඒ නිසා Shopper A එකම key එකෙන් retry කරනවා.

#### Beginner

**In simple words**

Before paying, the app writes a secret number on the payment, like a ticket number: 7f3a. It keeps the number safe.

If it has to ask again, it uses the same number. A new shopping trip gets a new number.

**Like in real life**

A cloakroom ticket: you get one ticket for your coat, and you show the same ticket every time you ask about that coat.

**සරලව කිව්වොත්**

ගෙවන්න කලින් app එක ගෙවීමේ රහස් number එකක් ලියනවා, ticket number එකක් වගේ: 7f3a. ඒ number එක පරිස්සමෙන් තියාගන්නවා.

ආයෙත් අහන්න වුණොත් එකම number එක පාවිච්චි කරනවා. අලුත් shopping එකකට අලුත් number එකක්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Cloakroom ticket එකක්: ඔබේ coat එකට එක ticket එකක් ලැබෙනවා, ඒ coat එක ගැන අහන හැම පාරම එකම ticket එක පෙන්නනවා.

#### Advanced

**How it works**

The client generates the key once per operation, not per attempt. A random UUID v4 from crypto.randomUUID() is enough, and it must be unpredictable. It keeps the key with the operation (component state, a form library’s submit state, or sessionStorage so a reload keeps it) and sends it on every attempt in the Idempotency-Key header, as the IETF draft describes.

It makes a new key when the operation changes (a different amount or cart) or after it has finished. Reusing a key for a new payment would make the server replay the old one (step 7).

**Example**

_The client side (TypeScript)_

```
const key = sessionStorage.getItem("pay:1042") ?? crypto.randomUUID();
sessionStorage.setItem("pay:1042", key);

await retry(() =>
  fetch("/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify({ orderId: 1042, amount: "12400.00", currency: "LKR" }),
  }),
);
sessionStorage.removeItem("pay:1042"); // done: the next payment gets a new key
```

**මෙය වැඩ කරන හැටි**

Client key එක හදන්නේ attempt එකකට නෙවෙයි, operation එකකට එක පාරයි. crypto.randomUUID() එකෙන් එන random UUID v4 එකක් ඇති, ඒක අනුමාන කරන්න බැරි වෙන්න ඕනේ. Key එක operation එකත් එක්ක තියාගන්නවා (component state, form library එකක submit state, නැත්නම් reload එකකින් නැති නොවෙන්න sessionStorage) සහ IETF draft එකේ කියන විදිහට හැම attempt එකකම Idempotency-Key header එකේ යවනවා.

Operation එක වෙනස් වුණොත් (වෙනස් මුදලක් හෝ cart එකක්) හෝ ඉවර වුණාට පස්සේ අලුත් key එකක් හදනවා. අලුත් ගෙවීමකට key එකක් ආයෙත් පාවිච්චි කළොත් server එක පරණ එක replay කරනවා (පියවර 7).

**උදාහරණය**

_Client පැත්ත (TypeScript)_

```
const key = sessionStorage.getItem("pay:1042") ?? crypto.randomUUID();
sessionStorage.setItem("pay:1042", key);

await retry(() =>
  fetch("/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify({ orderId: 1042, amount: "12400.00", currency: "LKR" }),
  }),
);
sessionStorage.removeItem("pay:1042"); // done: the next payment gets a new key
```

_Words to know:_ Idempotency key, UUID · _Message:_ Shopper A pays, with an idempotency key

---

### 4. The server writes it down first · Server එක මුලින්ම ලියාගන්නවා

**Watch:** Payments saves the key as “in progress”, charges the card through the Card processor, then saves the payment and the answer with the key, and replies “paid”.

**බලන්න:** Payments key එක “in progress” විදිහට save කරනවා, Card processor හරහා card එක charge කරනවා, ඊට පස්සේ ගෙවීමයි උත්තරයයි key එකත් එක්ක save කරලා “ගෙව්වා” කියලා උත්තර දෙනවා.

#### Beginner

**In simple words**

The helper first writes the ticket number in its notebook: “7f3a: working on it”. Then it takes the money.

Then it writes down the answer next to the number: “7f3a: done, paid”. Now it will remember this payment if anyone asks again.

**Like in real life**

A cloakroom attendant writes your ticket number on the hanger before walking off with your coat.

**සරලව කිව්වොත්**

උදව්කාරයා මුලින්ම ticket number එක notebook එකේ ලියනවා: “7f3a: වැඩ කරනවා”. ඊට පස්සේ සල්ලි ගන්නවා.

ඊට පස්සේ number එක ළඟින් උත්තරය ලියනවා: “7f3a: ඉවරයි, ගෙව්වා”. දැන් කවුරු හරි ආයෙත් ඇහුවොත් මේ ගෙවීම එයාට මතකයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Cloakroom attendant කෙනෙක් ඔබේ coat එක අරන් යන්න කලින් ticket number එක hanger එකේ ලියනවා.

#### Advanced

**How it works**

The server keeps a table of keys: the key, a fingerprint of the request, the state (in progress or done), the stored response and an expiry time. The first request:

- **Inserts the key as in progress:** with a unique constraint on the key; if the insert fails, another request has it (steps 5–6).
- **Does the work:** charges the card and creates the payment.
- **Saves the answer with the key:** and marks it done, in the same transaction as the payment row.

The call to the Card processor can’t be inside that transaction. The “Crash halfway” scenario and step 8 deal with that gap.

**Example**

_The key row afterwards_

```
key            7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47
request_hash   sha256:c1e9…
state          done
response       201 {"id":"pay_81f2","status":"succeeded"}
expires_at     now + 24 hours
```

**මෙය වැඩ කරන හැටි**

Server එක keys table එකක් තියාගන්නවා: key එක, request එකේ fingerprint එකක්, state එක (in progress හෝ done), save කරපු response එක, expiry වෙලාවක්. පළවෙනි request එක:

- **Key එක in progress විදිහට insert කරනවා:** key එකට unique constraint එකක් එක්ක; insert එක අසාර්ථක නම්, ඒක වෙන request එකකට අයිතියි (පියවර 5–6).
- **වැඩේ කරනවා:** card එක charge කරලා ගෙවීම හදනවා.
- **උත්තරය key එකත් එක්ක save කරනවා:** සහ done කියලා සලකුණු කරනවා, ගෙවීම් row එකේම transaction එකේ.

Card processor ට යන call එක ඒ transaction එක ඇතුළේ තියෙන්න බැහැ. “අතරමගදී crash එකක්” scenario එකයි පියවර 8 යි ඒ හිඩැස ගැන කතා කරනවා.

**උදාහරණය**

_පස්සේ key row එක_

```
key            7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47
request_hash   sha256:c1e9…
state          done
response       201 {"id":"pay_81f2","status":"succeeded"}
expires_at     now + 24 hours
```

_Words to know:_ Key table, Request fingerprint, Atomic transaction · _Message:_ Payments writes the key down first: in progress

---

### 5. A repeat gets the saved answer · Repeat එකකට save කරපු උත්තරය

**Watch:** The answer is lost again. Shopper A retries with the same key; Payments finds it “done” and sends the saved answer back. The Card processor isn’t called.

**බලන්න:** උත්තරය ආයෙත් නැති වෙනවා. Shopper A එකම key එකෙන් retry කරනවා; Payments ඒක “done” කියලා හොයාගෙන save කරපු උත්තරය ආපහු යවනවා. Card processor ට call කරන්නේ නැහැ.

#### Beginner

**In simple words**

The app didn’t hear back, so it asks again with ticket 7f3a. The helper looks in the notebook: “7f3a: done, paid”.

So it just says “paid!” again. It doesn’t take the money again.

**Like in real life**

You show your cloakroom ticket twice; you still get one coat.

**සරලව කිව්වොත්**

App එකට උත්තරයක් ආවේ නැහැ, ඒ නිසා ticket 7f3a එක්ක ආයෙත් අහනවා. උදව්කාරයා notebook එක බලනවා: “7f3a: ඉවරයි, ගෙව්වා”.

ඉතින් එයා ආයෙත් “ගෙව්වා!” කියනවා විතරයි. ආයෙත් සල්ලි ගන්නේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ cloakroom ticket එක දෙපාරක් පෙන්නුවත්, ලැබෙන්නේ එක coat එකයි.

#### Advanced

**How it works**

A repeat with a done key gets the stored response: the same status code and body as the first time, so the client can’t tell a replay from the original. Stripe adds Idempotent-Replayed: true so clients and logs can tell. Nothing runs again and nothing downstream is called.

Which results to store is a choice. Stripe stores any result once the operation has started, including a 500, so a retry gets the same failure instead of a second attempt with unknown effects. Validation errors that happen before anything changed are not stored.

**Example**

_The replay_

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /payments/pay_81f2
Idempotent-Replayed: true

{"id":"pay_81f2","orderId":1042,"status":"succeeded"}
```

**මෙය වැඩ කරන හැටි**

Done key එකක් එක්ක එන repeat එකකට stored response එක ලැබෙනවා: පළවෙනි පාර වගේම status code එකයි body එකයි, ඒ නිසා replay එකයි original එකයි වෙන් කරලා අඳුනගන්න client ට බැහැ. Clients ටයි logs වලටයි අඳුනගන්න Stripe Idempotent-Replayed: true එකතු කරනවා. මුකුත් ආයෙත් run වෙන්නේ නැහැ, downstream කිසිම දෙයකට call කරන්නේ නැහැ.

Save කරන්නේ මොන results ද කියන එක තේරීමක්. Operation එක පටන් ගත්තාට පස්සේ ඕනෙම result එකක් Stripe save කරනවා, 500 එකක් වුණත්, ඒ නිසා retry එකකට ලැබෙන්නේ නොදන්නා effects තියෙන දෙවෙනි attempt එකක් නෙවෙයි, එකම failure එක. මොනවත් වෙනස් වෙන්න කලින් වෙන validation errors save කරන්නේ නැහැ.

**උදාහරණය**

_Replay එක_

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /payments/pay_81f2
Idempotent-Replayed: true

{"id":"pay_81f2","orderId":1042,"status":"succeeded"}
```

_Words to know:_ Replay, Stored response · _Message:_ The saved answer, replayed

---

## The hard cases · අමාරු අවස්ථා

### 6. Two at once · දෙකක් එකපාර

**Watch:** A double tap sends two requests with one key. The first does the work; the second finds the key in progress and gets 409. Its retry gets the saved answer. One charge.

**බලන්න:** Double tap එකකින් එක key එකක් එක්ක requests දෙකක් යනවා. පළවෙනි එක වැඩේ කරනවා; දෙවෙනි එක key එක in progress කියලා දැකලා 409 ගන්නවා. ඒකේ retry එකට save කරපු උත්තරය ලැබෙනවා. එක charge එකයි.

#### Beginner

**In simple words**

Two taps, same ticket, at almost the same moment. The helper is already working on 7f3a when the second one arrives.

It says “I’m still doing that one, ask me again in a moment”. When the app asks again, the answer is ready: “paid”.

**Like in real life**

You ask for your coat while the attendant is still walking back with it. They say “one moment”, not “here’s another coat”.

**සරලව කිව්වොත්**

Taps දෙකක්, එකම ticket එක, ලඟින් ලඟ. දෙවෙනි එක එනකොට උදව්කාරයා දැනටමත් 7f3a එකේ වැඩ කරනවා.

එයා කියනවා “මම තවම ඒක කරනවා, ටිකකින් ආයෙත් අහන්න”. App එක ආයෙත් අහනකොට උත්තරය ලෑස්තියි: “ගෙව්වා”.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Attendant ඔබේ coat එක අරන් එන ගමන් ඉන්නකොට ඔබ coat එක ඉල්ලනවා. එයා කියන්නේ “පොඩ්ඩක් ඉන්න” කියලා, “මෙන්න තව coat එකක්” කියලා නෙවෙයි.

#### Advanced

**How it works**

Two requests with one key can arrive together, from a double submit or a client retrying before the first attempt has finished. Without care, both would see “no key yet” and both would charge. The unique constraint on the key makes the second insert fail, and the server answers 409 Conflict (the IETF draft’s choice, and Stripe’s). The client retries with backoff, as in the Retry module.

The alternative is to make the second request wait for the first and then replay its answer. It’s friendlier, but it ties up a connection and needs a timeout; 409 keeps the server simple.

**Example**

_The second request’s answer_

```http
HTTP/1.1 409 Conflict
Content-Type: application/json
Retry-After: 1

{"error":"idempotency_key_in_use","message":"A request with this key is still in progress."}
```

**මෙය වැඩ කරන හැටි**

එක key එකක් එක්ක requests දෙකක් එකට එන්න පුළුවන්, double submit එකකින් හෝ පළවෙනි attempt එක ඉවර වෙන්න කලින් client retry කරන නිසා. පරිස්සම් නොවුණොත් දෙකටම පේන්නේ “තවම key එකක් නැහැ” කියලා, දෙකම charge කරනවා. Key එකේ unique constraint එක නිසා දෙවෙනි insert එක අසාර්ථක වෙනවා, server එක 409 Conflict කියලා උත්තර දෙනවා (IETF draft එකේ තේරීම, Stripe ගෙත්). Retry module එකේ වගේ client backoff එක්ක retry කරනවා.

විකල්පය තමයි දෙවෙනි request එක පළවෙනි එක ඉවර වෙනකම් ඉන්න තියලා ඒකේ උත්තරය replay කරන එක. ඒක යාළුයි, ඒත් connection එකක් අල්ලගෙන ඉන්නවා, timeout එකකුත් ඕනේ; 409 නිසා server එක සරලයි.

**උදාහරණය**

_දෙවෙනි request එකේ උත්තරය_

```http
HTTP/1.1 409 Conflict
Content-Type: application/json
Retry-After: 1

{"error":"idempotency_key_in_use","message":"A request with this key is still in progress."}
```

_Words to know:_ Concurrent requests, 409 Conflict, Lock · _Message:_ 409: still in progress, try again shortly

---

### 7. Same key, different request · එකම key එක, වෙනස් request එකක්

**Watch:** The cart changed but the app kept the old key, so it sends key 7f3a with a new amount. Payments sees the request doesn’t match the key and refuses with 422. Nothing is charged.

**බලන්න:** Cart එක වෙනස් වුණා, ඒත් app එක පරණ key එක තියාගත්තා, ඒ නිසා key 7f3a අලුත් මුදලක් එක්ක යවනවා. Request එක key එකට ගැලපෙන්නේ නැහැ කියලා Payments දැකලා 422 එකකින් ප්‍රතික්ෂේප කරනවා. කිසිම charge එකක් නැහැ.

#### Beginner

**In simple words**

The app used ticket 7f3a again, but this time for a different, bigger payment: 13,900 rupees.

The helper notices that the notebook says ticket 7f3a was for 12,400 rupees. So it refuses: “that ticket was for something else”.

**Like in real life**

You hand in a ticket for a blue coat and ask for a red one.

**සරලව කිව්වොත්**

App එක ticket 7f3a ආයෙත් පාවිච්චි කළා, ඒත් මේ පාර වෙනස්, ලොකු ගෙවීමකට: රුපියල් 13,900යි.

Ticket 7f3a රුපියල් 12,400ට කියලා notebook එකේ තියෙනවා කියලා උදව්කාරයා දකිනවා. ඉතින් එයා ප්‍රතික්ෂේප කරනවා: “ඒ ticket එක වෙන දෙයකට”.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ නිල් coat එකක ticket එකක් දීලා රතු coat එකක් ඉල්ලනවා.

#### Advanced

**How it works**

The server stores a fingerprint of each key’s request (a hash of method, path and body) and compares it on every repeat. A different request with a used key is a client bug; the IETF draft answers 422 Unprocessable Content. Without the check, the server would replay the old payment’s answer, and the shopper would think the new amount was paid.

On the client this is step 3’s rule: a new operation needs a new key. Tie the key to what is being paid (the cart and the amount), not only to the order number.

**Example**

_The refusal_

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/json

{"error":"idempotency_key_reused","message":"This key was used with a different request."}
```

**මෙය වැඩ කරන හැටි**

Server එක හැම key එකකම request එකේ fingerprint එකක් (method, path, body වල hash එකක්) save කරලා හැම repeat එකකදීම සසඳනවා. පාවිච්චි කරපු key එකක් එක්ක වෙනස් request එකක් කියන්නේ client bug එකක්; IETF draft එක 422 Unprocessable Content කියලා උත්තර දෙනවා. ඒ check එක නැත්නම් server එක පරණ ගෙවීමේ උත්තරය replay කරනවා, අලුත් මුදල ගෙව්වා කියලා shopper හිතනවා.

Client පැත්තේ මේක පියවර 3 නීතිය: අලුත් operation එකකට අලුත් key එකක් ඕනේ. Key එක order number එකට විතරක් නෙවෙයි, ගෙවන දේට (cart එකට සහ මුදලට) ගැට ගහන්න.

**උදාහරණය**

_ප්‍රතික්ෂේප කිරීම_

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/json

{"error":"idempotency_key_reused","message":"This key was used with a different request."}
```

_Words to know:_ Request fingerprint, 422 Unprocessable Content · _Message:_ 422: this key was used for a different request

---

### 8. Expiry, and passing the key on · Expiry, සහ key එක ඉස්සරහට යැවීම

**Watch:** The same payment, but Payments now sends its own key (pay_81f2) to the Card processor. The key is saved with an expiry: 24 hours.

**බලන්න:** එකම ගෙවීම, ඒත් දැන් Payments Card processor ට තමන්ගේම key එකක් (pay_81f2) යවනවා. Key එක expiry එකක් එක්ක save වෙනවා: පැය 24යි.

#### Beginner

**In simple words**

The helper’s notebook can’t keep every ticket forever, so it throws old ones away after a day.

And when the helper asks the bank for the money, it gives the bank a ticket number of its own. Then, if the helper has to ask the bank again, the bank won’t take the money twice either.

**Like in real life**

A parcel gets a tracking number at every company that carries it.

**සරලව කිව්වොත්**

උදව්කාරයාගේ notebook එකට හැම ticket එකක්ම සදහටම තියාගන්න බැහැ, ඒ නිසා දවසකට පස්සේ පරණ ඒවා විසි කරනවා.

ඒ වගේම bank එකෙන් සල්ලි ඉල්ලනකොට උදව්කාරයා bank එකට තමන්ගේම ticket number එකක් දෙනවා. එතකොට උදව්කාරයාට bank එකෙන් ආයෙත් අහන්න වුණත්, bank එකත් දෙපාරක් සල්ලි ගන්නේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Parcel එකකට ඒක ගෙනියන හැම company එකකින්ම tracking number එකක් ලැබෙනවා.

#### Advanced

**How it works**

Expiry: keys are deleted after a while (Stripe keeps them at least 24 hours) to keep the table small. The lifetime must be longer than any client keeps retrying; a retry after the key is gone is treated as a new payment (see “Key expired”). A unique rule on the business key, one successful payment per order, is a good second safety net.

Passing it on: each system can only protect itself. Payments makes its Card processor call idempotent too, by sending its own key that stays the same for this payment, such as the payment’s id. Then Payments can repeat that call after a timeout or a crash, and the whole chain charges once.

**Example**

_Payments calling the Card processor_

```http
POST /v1/charges HTTP/1.1
Host: api.cardprocessor.example
Idempotency-Key: pay_81f2

{"amount":1240000,"currency":"lkr","source":"tok_visa"}
```

**මෙය වැඩ කරන හැටි**

Expiry: table එක පොඩියට තියාගන්න ටික කාලෙකට පස්සේ keys මකනවා (Stripe අවම පැය 24ක් තියාගන්නවා). ඒ කාලය ඕනෙම client කෙනෙක් retry කරන කාලෙට වඩා දිග වෙන්න ඕනේ; key එක ගියාට පස්සේ එන retry එකක් අලුත් ගෙවීමක් විදිහට සලකනවා (“Key එක expire වෙලා” බලන්න). Business key එකට unique rule එකක්, order එකකට එක සාර්ථක ගෙවීමයි කියලා, හොඳ දෙවෙනි safety net එකක්.

ඉස්සරහට යැවීම: හැම system එකකටම ආරක්ෂා කරගන්න පුළුවන් තමන්ව විතරයි. Payments තමන්ගේ Card processor call එකත් idempotent කරනවා, මේ ගෙවීමට වෙනස් නොවෙන තමන්ගේම key එකක් යවලා, ගෙවීමේ id එක වගේ. එතකොට timeout එකකට හෝ crash එකකට පස්සේ Payments ට ඒ call එක repeat කරන්න පුළුවන්, මුළු chain එකම charge කරන්නේ එක පාරයි.

**උදාහරණය**

_Payments Card processor ට call කරනවා_

```http
POST /v1/charges HTTP/1.1
Host: api.cardprocessor.example
Idempotency-Key: pay_81f2

{"amount":1240000,"currency":"lkr","source":"tok_visa"}
```

_Words to know:_ Key expiry, Business key, End-to-end idempotency · _Message:_ Payments asks the Card processor, with its own key

---

## Scenarios

## Scenario: Crash halfway · අතරමගදී crash එකක්

Payments charges the card, then crashes before saving the answer. The retry finishes the job without a second charge.

Payments card එකෙන් සල්ලි ගන්නවා, ඊට පස්සේ උත්තරය save කරන්න කලින් crash වෙනවා. Retry එක දෙවෙනි charge එකක් නැතුව වැඩේ ඉවර කරනවා.

### 1. The crash · Crash එක

**Watch:** Payments saves the key as “in progress” and the Card processor charges the card. Then Payments crashes before saving the answer. Shopper A hears nothing.

**බලන්න:** Payments key එක “in progress” විදිහට save කරනවා, Card processor card එක charge කරනවා. ඊට පස්සේ උත්තරය save කරන්න කලින් Payments crash වෙනවා. Shopper A ට මුකුත් ඇහෙන්නේ නැහැ.

#### Beginner

**In simple words**

The helper took the money from the bank, and then, before writing “done” in the notebook, it fell asleep.

The notebook still says “7f3a: working on it”. The app heard nothing.

**Like in real life**

The attendant fetched your coat and then got called away before handing it over. The hanger still says “being fetched”.

**සරලව කිව්වොත්**

උදව්කාරයා bank එකෙන් සල්ලි ගත්තා, ඊට පස්සේ notebook එකේ “ඉවරයි” කියලා ලියන්න කලින් නින්දට ගියා.

Notebook එකේ තවම තියෙන්නේ “7f3a: වැඩ කරනවා” කියලා. App එකට මුකුත් ඇහුණේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Attendant ඔබේ coat එක අරන් ආවා, ඒත් ඔබට දෙන්න කලින් එයාට වෙන තැනකට යන්න වුණා. Hanger එකේ තවම තියෙන්නේ “ගේනවා” කියලා.

#### Advanced

**How it works**

The money moved, but the key row still says in progress and no payment row exists. This is the gap between an outside side effect and the local transaction.

A plain retry would get 409 forever, and a careless server that started over would charge again. (Payments already sends its own key, pay_81f2, to the Card processor, as step 8 explains; that is what makes the recovery safe.)

**Example**

_What is left after the crash_

```
key 7f3a…   in_progress (since 10:00:00)
payments    no row for order 1042
card        charged (ch_3f1a)
```

**මෙය වැඩ කරන හැටි**

සල්ලි මාරු වුණා, ඒත් key row එකේ තවම තියෙන්නේ in progress කියලා, ගෙවීම් row එකක් නැහැ. මේ තමයි පිටස්තර side effect එකකුයි local transaction එකකුයි අතර හිඩැස.

සාමාන්‍ය retry එකකට සදහටම 409 ලැබෙනවා, ආයෙත් මුල ඉඳන් පටන් ගන්න පරිස්සම් නැති server එකක් ආයෙත් charge කරනවා. (පියවර 8 කියන විදිහට Payments දැනටමත් Card processor ට තමන්ගේම key එකක්, pay_81f2, යවනවා; recovery එක ආරක්ෂිත කරන්නේ ඒකයි.)

**උදාහරණය**

_Crash එකෙන් පස්සේ ඉතුරු වෙලා තියෙන දේ_

```
key 7f3a…   in_progress (since 10:00:00)
payments    no row for order 1042
card        charged (ch_3f1a)
```

_Words to know:_ Atomic transaction, End-to-end idempotency · _Message:_ Payments asks the Card processor, with its own key

---

### 2. Recovering safely · ආරක්ෂිතව යථා තත්වයට

**Watch:** Payments is back. Shopper A retries; the key has been in progress for over 60 s, so Payments takes it over and asks the Card processor again with the same key. The processor replays its earlier charge.

**බලන්න:** Payments ආයෙත් ලෑස්තියි. Shopper A retry කරනවා; key එක තත්පර 60කට වඩා in progress, ඒ නිසා Payments ඒක භාර අරගෙන එකම key එකෙන් Card processor ගෙන් ආයෙත් අහනවා. Processor කලින් කරපු charge එක replay කරනවා.

#### Beginner

**In simple words**

The helper wakes up and sees “7f3a: working on it” from long ago. It asks the bank again, with the same ticket.

The bank says “I already did that one”, so no money moves twice. Now the helper writes “done” and says “paid”.

**Like in real life**

The attendant comes back, sees “being fetched” on the hanger and checks the coat rail first, instead of fetching a second coat.

**සරලව කිව්වොත්**

උදව්කාරයා ඇහැරිලා, ගොඩක් කලින් ලියපු “7f3a: වැඩ කරනවා” දකිනවා. එයා එකම ticket එකෙන් bank එකෙන් ආයෙත් අහනවා.

Bank එක කියනවා “මම ඒක දැනටමත් කළා”, ඒ නිසා සල්ලි දෙපාරක් යන්නේ නැහැ. දැන් උදව්කාරයා “ඉවරයි” කියලා ලියලා “ගෙව්වා” කියනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Attendant ආපහු ඇවිත් hanger එකේ “ගේනවා” දැකලා, දෙවෙනි coat එකක් ගේනවා වෙනුවට මුලින්ම coat rail එක බලනවා.

#### Advanced

**How it works**

The key row records when it was locked. A lock older than a timeout (here 60 s) is treated as abandoned, and the next request with the key resumes the work.

Resuming is safe only because the outside call carries its own key. Larger systems split the work into steps with saved recovery points, and finish stuck keys in a background job instead of waiting for a retry.

**Example**

_The recovery_

```
10:01:10  retry, key 7f3a…   lock 70 s old → take over
10:01:10  POST /v1/charges  Idempotency-Key: pay_81f2  → 200 (replayed, no new charge)
10:01:10  key 7f3a… done, 201 saved
```

**මෙය වැඩ කරන හැටි**

Key row එක lock කරපු වෙලාව record කරනවා. Timeout එකකට (මෙතන තත්පර 60) වඩා පරණ lock එකක් අත්හැරපු එකක් විදිහට සලකනවා, key එක එක්ක එන ඊළඟ request එක වැඩේ ආයෙත් පටන් ගන්නවා.

ආයෙත් පටන් ගන්න එක ආරක්ෂිත වෙන්නේ පිටස්තර call එකට තමන්ගේම key එකක් තියෙන නිසා විතරයි. ලොකු systems වැඩේ save කරපු recovery points තියෙන පියවර වලට කඩලා, retry එකක් එනකම් ඉන්නේ නැතුව background job එකකින් හිරවෙච්ච keys ඉවර කරනවා.

**උදාහරණය**

_Recovery එක_

```
10:01:10  retry, key 7f3a…   lock 70 s old → take over
10:01:10  POST /v1/charges  Idempotency-Key: pay_81f2  → 200 (replayed, no new charge)
10:01:10  key 7f3a… done, 201 saved
```

_Words to know:_ Lock, Replay · _Message:_ Found: in progress, but abandoned 70 s ago

---

## Scenario: Key expired · Key එක expire වෙලා

A retry arrives 25 hours later, after the key is gone, and charges again; then the order check that stops it.

Key එක මැකිලා ගියාට පස්සේ, පැය 25කට පස්සේ retry එකක් එනවා, ආයෙත් charge කරනවා; ඊට පස්සේ ඒක නවත්වන order check එක.

### 1. A retry a day later · දවසකට පස්සේ retry එකක්

**Watch:** The first payment went through, but its answer was lost and the laptop went to sleep. 25 hours later the app retries with key 7f3a. The key has expired, so Payments charges again.

**බලන්න:** පළවෙනි ගෙවීම සාර්ථකයි, ඒත් උත්තරය නැති වුණා, laptop එක sleep වුණා. පැය 25කට පස්සේ app එක key 7f3a එක්ක retry කරනවා. Key එක expire වෙලා, ඒ නිසා Payments ආයෙත් charge කරනවා.

#### Beginner

**In simple words**

The app waited much too long. The helper had already thrown the old ticket away.

So it didn’t know this was the same payment, and took the money again.

**Like in real life**

You come back for your coat a week later. The cloakroom has thrown your ticket away, and someone hands you a different coat.

**සරලව කිව්වොත්**

App එක ගොඩක් වැඩි කාලයක් හිටියා. උදව්කාරයා පරණ ticket එක දැනටමත් විසි කරලා.

ඉතින් මේක එකම ගෙවීම කියලා එයා දැනගත්තේ නැහැ, ආයෙත් සල්ලි ගත්තා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ සතියකට පස්සේ coat එක ගන්න එනවා. Cloakroom එක ඔබේ ticket එක විසි කරලා, කවුරු හරි ඔබට වෙන coat එකක් දෙනවා.

#### Advanced

**How it works**

After expiry the key protects nothing. Clients must stop retrying well inside the key’s lifetime (a deadline, as in the Retry module).

Before resending an old operation, a client should check what happened first, for example with GET /orders/1042.

**Example**

_Two days, two payments_

```
day 1  10:00  POST /payments  key 7f3a…  → 201 pay_81f2 (answer lost)
day 2  11:00  key 7f3a… deleted (24 h)
day 2  11:05  POST /payments  key 7f3a…  → new payment pay_a51c (charged twice)
```

**මෙය වැඩ කරන හැටි**

Expire වුණාට පස්සේ key එක කිසිම දෙයක් ආරක්ෂා කරන්නේ නැහැ. Key එකේ ආයු කාලය ඇතුළේම clients retry කරන එක නවත්තන්න ඕනේ (Retry module එකේ වගේ deadline එකක්).

පරණ operation එකක් ආයෙත් යවන්න කලින්, client මුලින්ම වුණේ මොකක්ද කියලා බලන්න ඕනේ, උදාහරණයක් විදිහට GET /orders/1042 එකෙන්.

**උදාහරණය**

_දවස් දෙකයි, ගෙවීම් දෙකයි_

```
day 1  10:00  POST /payments  key 7f3a…  → 201 pay_81f2 (answer lost)
day 2  11:00  key 7f3a… deleted (24 h)
day 2  11:05  POST /payments  key 7f3a…  → new payment pay_a51c (charged twice)
```

_Words to know:_ Key expiry · _Message:_ Not found: the key has expired

---

### 2. The safety nets · Safety nets

**Watch:** The same late retry, but Payments also checks the order: one successful payment per order. Order 1042 is already paid, so Payments refuses and nothing is charged.

**බලන්න:** එකම පරක්කු retry එක, ඒත් Payments order එකත් බලනවා: order එකකට එක සාර්ථක ගෙවීමයි. Order 1042 ට දැනටමත් ගෙවලා, ඒ නිසා Payments ප්‍රතික්ෂේප කරනවා, කිසිම charge එකක් නැහැ.

#### Beginner

**In simple words**

This time the helper also looks at the order number.

Order 1042 is already paid, so it says so instead of taking the money again.

**Like in real life**

The cloakroom also writes your name on the coat. Even without the ticket, they can see you already took yours.

**සරලව කිව්වොත්**

මේ පාර උදව්කාරයා order number එකත් බලනවා.

Order 1042 ට දැනටමත් ගෙවලා, ඒ නිසා ආයෙත් සල්ලි ගන්නේ නැතුව ඒක කියනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Cloakroom එක coat එකේ ඔබේ නමත් ලියනවා. Ticket එක නැතත්, ඔබ ඔබේ coat එක දැනටමත් අරන් ගියා කියලා ඔවුන්ට පේනවා.

#### Advanced

**How it works**

Combine the short-lived key with a lasting business rule: a unique index on succeeded payments per order (order_id WHERE status = 'succeeded'). It costs nothing on the happy path and stops duplicates long after keys expire.

The client can do its part too: before resending after a long gap, ask the server what happened (GET /orders/1042) and show that instead.

**Example**

_Payments refuses_

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{"error":"order_already_paid","paymentId":"pay_81f2"}
```

**මෙය වැඩ කරන හැටි**

කෙටි කාලයක් තියෙන key එකයි දිගටම තියෙන business rule එකයි එකතු කරන්න: order එකකට සාර්ථක ගෙවීම් වලට unique index එකක් (order_id WHERE status = 'succeeded'). සාමාන්‍ය path එකේදී ඒකට මුකුත් වැය වෙන්නේ නැහැ, keys expire වුණාට ගොඩක් කල් පස්සෙත් duplicates නවත්වනවා.

Client ටත් තමන්ගේ කොටස කරන්න පුළුවන්: ලොකු පරතරයකට පස්සේ ආයෙත් යවන්න කලින්, වුණේ මොකක්ද කියලා server එකෙන් අහලා (GET /orders/1042) ඒක පෙන්නන්න.

**උදාහරණය**

_Payments ප්‍රතික්ෂේප කරනවා_

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{"error":"order_already_paid","paymentId":"pay_81f2"}
```

_Words to know:_ Business key · _Message:_ Payments checks whether the order is already paid

---

## Parts of the scene

### Shopper A (shopper-a)

|                   | English                                                                                                                                                                                                                         | සිංහල                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                                                                                          | Client                                                                                                                                                                                                   |
| Simple summary    | Someone paying for order 1042 on their laptop.                                                                                                                                                                                  | තමන්ගේ laptop එකෙන් order 1042 ට ගෙවන කෙනෙක්.                                                                                                                                                               |
| Like in real life | Like someone at a cloakroom: they keep their ticket and show the same one every time they ask.                                                                                                                                  | Cloakroom එකක ඉන්න කෙනෙක් වගේ: ticket එක තියාගෙන, අහන හැම පාරම එකම ticket එක පෙන්නනවා.                                                                                                                       |
| What it does      | Makes one ticket number (key) for each payment; Sends the same key every time it asks again; Makes a new key for a new payment                                                                                                  | හැම ගෙවීමකටම ticket number එකක් (key එකක්) හදනවා; ආයෙත් අහන හැම පාරම එකම key එක යවනවා; අලුත් ගෙවීමකට අලුත් key එකක් හදනවා                                                                                          |
| Talks to          | Payments                                                                                                                                                                                                                        | Payments                                                                                                                                                                                                 |
| Technical summary | The client that owns the idempotency key: one per operation, kept across retries and reloads, replaced when the operation changes.                                                                                              | Idempotency key එක අයිති client එක: operation එකකට එකයි, retries සහ reloads හරහා තියාගන්නවා, operation එක වෙනස් වුණොත් මාරු කරනවා.                                                                                |
| How it works      | When the shopper presses Pay it creates a key with crypto.randomUUID(), keeps it in sessionStorage, and sends it in the Idempotency-Key header on every attempt. On 409 it retries with backoff; on success it forgets the key. | Shopper Pay ඔබනකොට crypto.randomUUID() එකෙන් key එකක් හදලා sessionStorage එකේ තියාගන්නවා, හැම attempt එකකම Idempotency-Key header එකේ යවනවා. 409 ආවොත් backoff එක්ක retry කරනවා; සාර්ථක වුණාම key එක අමතක කරනවා. |
| Responsibilities  | One key per operation, not per attempt; Keep the key across retries and page reloads; Make a new key when the amount or cart changes; Retry 409 with backoff; never retry 422                                                   | Attempt එකකට නෙවෙයි, operation එකකට එක key එකක්; Retries සහ page reloads හරහා key එක තියාගන්නවා; මුදල හෝ cart එක වෙනස් වුණොත් අලුත් key එකක්; 409 backoff එක්ක retry කරනවා; 422 කවදාවත් retry කරන්නේ නැහැ              |
| Inputs            | The shopper pressing Pay; Answers from Payments (201, 409, 422)                                                                                                                                                                 | Shopper Pay ඔබන එක; Payments එකෙන් එන උත්තර (201, 409, 422)                                                                                                                                                |
| Outputs           | POST /payments with an Idempotency-Key header                                                                                                                                                                                   | Idempotency-Key header එකක් එක්ක POST /payments                                                                                                                                                            |
| Examples          | Idempotency-Key: 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47                                                                                                                                                                           | Idempotency-Key: 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47                                                                                                                                                    |
| Advantages        | Every retry is safe, whatever went wrong                                                                                                                                                                                        | මොකක් වැරදුණත් හැම retry එකක්ම ආරක්ෂිතයි                                                                                                                                                                        |
| Limitations       | A key reused for a different payment is a bug the server must catch; Retries after the key expires are not protected                                                                                                            | වෙන ගෙවීමකට key එකක් ආයෙත් පාවිච්චි කිරීම server එක අල්ලගන්න ඕනේ bug එකක්; Key එක expire වුණාට පස්සේ එන retries ආරක්ෂා වෙන්නේ නැහැ                                                                                      |
| Technologies      | crypto.randomUUID(), sessionStorage, TanStack Query mutations, Form libraries' submit state                                                                                                                                     |                                                                                                                                                                                                          |

### Payments (payments)

|                   | English                                                                                                                                                                                                                                                                                               | සිංහල                                                                                                                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                                                                                                                                                                                                                       | Backend service                                                                                                                                                                                                                                                                         |
| Simple summary    | The helper that takes the money and keeps a notebook of ticket numbers.                                                                                                                                                                                                                               | සල්ලි ගන්න, ticket numbers ලියන notebook එකක් තියාගන්න උදව්කාරයා.                                                                                                                                                                                                                               |
| Like in real life | Like a cloakroom attendant who writes your ticket number on the hanger before fetching your coat.                                                                                                                                                                                                     | ඔබේ coat එක ගේන්න යන්න කලින් ticket number එක hanger එකේ ලියන cloakroom attendant කෙනෙක් වගේ.                                                                                                                                                                                                 |
| What it does      | Writes the key down before doing anything; Takes the money once; Gives the saved answer to anyone who asks again                                                                                                                                                                                      | මොනවා හරි කරන්න කලින් key එක ලියාගන්නවා; සල්ලි ගන්නේ එක පාරයි; ආයෙත් අහන ඕනෙම කෙනෙක්ට save කරපු උත්තරය දෙනවා                                                                                                                                                                                          |
| Talks to          | Shopper A; Payments DB; Card processor                                                                                                                                                                                                                                                                | Shopper A; Payments DB; Card processor                                                                                                                                                                                                                                                  |
| Technical summary | The service that turns many attempts into one effect: it records the key first, does the work once, and replays the stored answer.                                                                                                                                                                    | Attempts ගොඩක් එක effect එකක් කරන service එක: මුලින්ම key එක record කරනවා, වැඩේ එක පාරයි කරන්නේ, save කරපු උත්තරය replay කරනවා.                                                                                                                                                                  |
| How it works      | It inserts the key as in progress (unique on the key), charges the card through the Card processor with its own key, then saves the payment and the response with the key in one transaction. A repeat gets the stored response; a key in progress gets 409; a key with a different request gets 422. | Key එක in progress විදිහට insert කරනවා (key එක unique), තමන්ගේම key එකක් එක්ක Card processor හරහා card එක charge කරනවා, ඊට පස්සේ ගෙවීමයි response එකයි key එකත් එක්ක එක transaction එකකින් save කරනවා. Repeat එකකට save කරපු response එක; in progress key එකකට 409; වෙන request එකක් එක්ක key එකකට 422. |
| Responsibilities  | Record the key before the work; Compare request fingerprints; Replay stored responses; Answer 409 for keys in progress and 422 for reused keys; Send its own key to the Card processor                                                                                                                | වැඩේට කලින් key එක record කරනවා; Request fingerprints සසඳනවා; Save කරපු responses replay කරනවා; In progress keys වලට 409, ආයෙත් පාවිච්චි කරපු keys වලට 422; Card processor ට තමන්ගේම key එකක් යවනවා                                                                                               |
| Inputs            | POST /payments with Idempotency-Key                                                                                                                                                                                                                                                                   | Idempotency-Key එක්ක POST /payments                                                                                                                                                                                                                                                      |
| Outputs           | 201 (or the replayed 201); 409 Conflict; 422 Unprocessable Content; Charges to the Card processor                                                                                                                                                                                                     | 201 (හෝ replay කරපු 201); 409 Conflict; 422 Unprocessable Content; Card processor ට charges                                                                                                                                                                                              |
| Examples          | Idempotent-Replayed: true on a replayed answer                                                                                                                                                                                                                                                        | Replay කරපු උත්තරයක Idempotent-Replayed: true                                                                                                                                                                                                                                             |
| Advantages        | Retries, double clicks and redeliveries all charge once                                                                                                                                                                                                                                               | Retries, double clicks, redeliveries ඔක්කොම charge වෙන්නේ එක පාරයි                                                                                                                                                                                                                         |
| Limitations       | Needs storage and a lookup on every request; Side effects outside its database need their own keys                                                                                                                                                                                                    | හැම request එකකටම storage එකකුයි lookup එකකුයි ඕනේ; තමන්ගේ database එකෙන් එළියේ side effects වලට තමන්ගේම keys ඕනේ                                                                                                                                                                               |
| Technologies      | Stripe-style idempotency middleware, Postgres unique constraints and row locks, Redis (SET NX) as an alternative key store                                                                                                                                                                            |                                                                                                                                                                                                                                                                                         |

### Payments DB (payments-db)

|                   | English                                                                                                                                                                                                                        | සිංහල                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Database                                                                                                                                                                                                                       | Database                                                                                                                                                                                                             |
| Simple summary    | The notebook where payments and ticket numbers are written down.                                                                                                                                                               | ගෙවීමුයි ticket numbers උයි ලියලා තියෙන notebook එක.                                                                                                                                                                       |
| Like in real life | Like the attendant's book: ticket number, which coat, and whether it's back.                                                                                                                                                   | Attendant ගේ පොත වගේ: ticket number එක, මොන coat එකද, ආපහු දුන්නද කියලා.                                                                                                                                                 |
| What it does      | Remembers every key and its answer; Remembers every payment                                                                                                                                                                    | හැම key එකක්ම, ඒකේ උත්තරයත් මතක තියාගන්නවා; හැම ගෙවීමක්ම මතක තියාගන්නවා                                                                                                                                                       |
| Talks to          | Payments                                                                                                                                                                                                                       | Payments                                                                                                                                                                                                             |
| Technical summary | Holds the payments and the idempotency-key table, written in one transaction so a payment and its saved answer always go together.                                                                                             | ගෙවීම් සහ idempotency-key table එක තියාගන්නවා, එක transaction එකකින් ලියන නිසා ගෙවීමකුයි ඒකේ save කරපු උත්තරයයි හැමවෙලේම එකට යනවා.                                                                                                 |
| How it works      | The key table has the key (unique), a request fingerprint, the state (in progress or done), when it was locked, the stored response and an expiry time. A unique index on succeeded payments per order is a second safety net. | Key table එකේ key එක (unique), request fingerprint එකක්, state එක (in progress හෝ done), lock කරපු වෙලාව, save කරපු response එක, expiry වෙලාවක් තියෙනවා. Order එකකට සාර්ථක ගෙවීම් වලට unique index එකක් දෙවෙනි safety net එකක්. |
| Responsibilities  | Enforce one row per key; Store responses with their keys; Expire old keys; Allow one successful payment per order                                                                                                              | Key එකකට එක row එකයි; Responses keys එක්ක save කරනවා; පරණ keys expire කරනවා; Order එකකට එක සාර්ථක ගෙවීමයි                                                                                                                 |
| Inputs            | Key inserts, lookups and updates; Payment rows                                                                                                                                                                                 | Key inserts, lookups සහ updates; ගෙවීම් rows                                                                                                                                                                           |
| Outputs           | Stored answers; Unique-constraint errors for duplicates                                                                                                                                                                        | Save කරපු උත්තර; Duplicates වලට unique-constraint errors                                                                                                                                                               |
| Examples          | CREATE UNIQUE INDEX … ON payments (order_id) WHERE status = 'succeeded'                                                                                                                                                        | CREATE UNIQUE INDEX … ON payments (order_id) WHERE status = 'succeeded'                                                                                                                                              |
| Advantages        | One transaction keeps the payment and its answer consistent                                                                                                                                                                    | එක transaction එකක් නිසා ගෙවීමයි උත්තරයයි හැමවෙලේම ගැලපෙනවා                                                                                                                                                                |
| Limitations       | The key table grows; expired keys must be deleted                                                                                                                                                                              | Key table එක ලොකු වෙනවා; expire වුණු keys මකන්න ඕනේ                                                                                                                                                                      |
| Technologies      | PostgreSQL, MySQL, Redis for keys (no shared transaction)                                                                                                                                                                      |                                                                                                                                                                                                                      |

### Card processor (card-processor)

|                   | English                                                                                                                                                      | සිංහල                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | External service                                                                                                                                             | External service                                                                                                                                |
| Simple summary    | The bank that actually moves the money.                                                                                                                      | ඇත්තටම සල්ලි මාරු කරන bank එක.                                                                                                                      |
| Like in real life | Like a bank that also keeps a list of ticket numbers it has already paid.                                                                                    | දැනටමත් ගෙවපු ticket numbers ලිස්ට් එකක් තියාගන්න bank එකක් වගේ.                                                                                         |
| What it does      | Takes the money from the card; Doesn't take it twice for the same key                                                                                        | Card එකෙන් සල්ලි ගන්නවා; එකම key එකට දෙපාරක් ගන්නේ නැහැ                                                                                               |
| Talks to          | Payments                                                                                                                                                     | Payments                                                                                                                                        |
| Technical summary | An outside API (Stripe, Adyen, a bank) that accepts its own Idempotency-Key, so its callers can repeat a charge safely.                                      | තමන්ගේම Idempotency-Key එකක් පිළිගන්න පිටස්තර API එකක් (Stripe, Adyen, bank එකක්), ඒ නිසා ඒකට call කරන අයට charge එකක් ආරක්ෂිතව repeat කරන්න පුළුවන්.            |
| How it works      | Payments sends each charge with a key that stays the same for this payment (pay_81f2). A repeat with that key returns the first charge instead of a new one. | Payments හැම charge එකක්ම මේ ගෙවීමට වෙනස් නොවෙන key එකක් (pay_81f2) එක්ක යවනවා. ඒ key එකෙන් repeat එකක් ආවොත් අලුත් එකක් නෙවෙයි, පළවෙනි charge එක ආපහු දෙනවා. |
| Responsibilities  | Charge cards; Deduplicate charges by key                                                                                                                     | Cards charge කරනවා; Key එකෙන් charges deduplicate කරනවා                                                                                          |
| Inputs            | POST /v1/charges with Idempotency-Key                                                                                                                        | Idempotency-Key එක්ක POST /v1/charges                                                                                                            |
| Outputs           | The charge (or the replayed charge)                                                                                                                          | Charge එක (හෝ replay කරපු charge එක)                                                                                                             |
| Examples          | Idempotency-Key: pay_81f2                                                                                                                                    | Idempotency-Key: pay_81f2                                                                                                                       |
| Advantages        | Makes the whole chain safe to repeat                                                                                                                         | මුළු chain එකම repeat කරන්න ආරක්ෂිත කරනවා                                                                                                            |
| Limitations       | Its keys expire too (Stripe: at least 24 hours)                                                                                                              | ඒකේ keys ත් expire වෙනවා (Stripe: අවම පැය 24යි)                                                                                                   |
| Technologies      | Stripe, Adyen, Braintree, bank APIs                                                                                                                          |                                                                                                                                                 |

## Words to know

| Term                      | English                                                                                                                          | සිංහල                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Idempotent                | An operation whose effect is the same whether it runs once or many times. The answer may differ; the effect may not.             | එක පාරක් කළත් ගොඩක් පාරවල් කළත් effect එක එකම වෙන operation එකක්. උත්තරය වෙනස් වෙන්න පුළුවන්; effect එක නෙවෙයි.                              |
| Idempotent methods        | HTTP methods defined as idempotent by RFC 9110: GET, HEAD, OPTIONS, TRACE, PUT and DELETE. POST and PATCH are not.               | RFC 9110 idempotent කියලා define කරන HTTP methods: GET, HEAD, OPTIONS, TRACE, PUT සහ DELETE. POST සහ PATCH නෙවෙයි.                |
| Safe methods              | Methods that only read (GET, HEAD, OPTIONS, TRACE). Every safe method is idempotent; PUT and DELETE are idempotent but not safe. | කියවන්න විතරක් කරන methods (GET, HEAD, OPTIONS, TRACE). හැම safe method එකක්ම idempotent; PUT සහ DELETE idempotent, ඒත් safe නෙවෙයි.   |
| At-least-once delivery    | What retries give you: a request is sure to arrive, but may arrive more than once.                                               | Retries වලින් ලැබෙන දේ: request එක එනවා කියන එක ස්ථිරයි, ඒත් එක පාරකට වඩා එන්න පුළුවන්.                                                    |
| Exactly-once effect       | Many deliveries, one result: the receiver recognises repeats and applies the operation once.                                     | Deliveries ගොඩක්, එක result එකයි: ලබන කෙනා repeats අඳුනගෙන operation එක එක පාරයි කරන්නේ.                                             |
| Double submit             | The same form or button sent twice, from a double click or an impatient tap.                                                     | Double click එකකින් හෝ ඉවසිල්ලක් නැති tap එකකින් එකම form එක හෝ button එක දෙපාරක් යැවීම.                                                  |
| Idempotency key           | A unique value the client sends with every attempt of one operation, so the server can tell repeats from new requests.           | එක operation එකක හැම attempt එකකම client යවන unique අගයක්, ඒ නිසා repeats අලුත් requests වලින් වෙන් කරලා අඳුනගන්න server එකට පුළුවන්.       |
| UUID                      | A 128-bit random identifier (version 4), such as 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47; crypto.randomUUID() makes one.            | Bits 128ක random identifier එකක් (version 4), උදාහරණයක් 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47; crypto.randomUUID() එකෙන් එකක් හදනවා. |
| Key table                 | Where the server keeps each key with its request fingerprint, state, stored response and expiry.                                 | Server එක හැම key එකක්ම, ඒකේ request fingerprint එක, state එක, save කරපු response එක, expiry එකත් එක්ක තියාගන්න තැන.                  |
| Request fingerprint       | A hash of a request's method, path and body, stored with the key to detect a key reused for a different request.                 | Request එකක method, path, body වල hash එකක්, key එක වෙන request එකකට ආයෙත් පාවිච්චි කළොත් අල්ලගන්න key එකත් එක්ක save කරනවා.              |
| Atomic transaction        | Several database writes that succeed or fail together, such as a payment and its key's saved answer.                             | එකට සාර්ථක වෙන හෝ එකට අසාර්ථක වෙන database writes කිහිපයක්, ගෙවීමකුයි ඒකේ key එකේ save කරපු උත්තරයයි වගේ.                                  |
| Replay                    | Answering a repeat with the stored response of the first request, without doing the work again.                                  | වැඩේ ආයෙත් නොකර, පළවෙනි request එකේ save කරපු response එකෙන් repeat එකකට උත්තර දෙන එක.                                               |
| Stored response           | The status code and body of a key's first request, kept to answer repeats.                                                       | Key එකක පළවෙනි request එකේ status code එකයි body එකයි, repeats වලට උත්තර දෙන්න තියාගන්නවා.                                             |
| Concurrent requests       | Requests handled at the same time, such as two taps with one key.                                                                | එකම වෙලාවේ handle වෙන requests, එක key එකක් එක්ක taps දෙකක් වගේ.                                                                   |
| 409 Conflict              | The request conflicts with the server's current state; for keys, another request with the same key is still in progress.         | Request එක server එකේ දැන් තත්වයත් එක්ක ගැටෙනවා; keys වලදී, එකම key එකෙන් තව request එකක් තවම වැඩ කරනවා.                               |
| Lock                      | A marker that one request owns a key while it works; others wait or get 409. An old lock is treated as abandoned.                | වැඩ කරන අතරේ key එකක් එක request එකකට අයිති කියන සලකුණක්; අනිත් අය ඉන්නවා හෝ 409 ගන්නවා. පරණ lock එකක් අත්හැරපු එකක් විදිහට සලකනවා.             |
| 422 Unprocessable Content | The server understood the request but can't process it; for keys, the key was used with a different request.                     | Server එකට request එක තේරුණා, ඒත් process කරන්න බැහැ; keys වලදී, key එක වෙන request එකක් එක්ක පාවිච්චි කරලා.                             |
| Key expiry                | Deleting keys after a while (Stripe: at least 24 hours); retries after that are treated as new.                                  | ටික කාලෙකට පස්සේ keys මකන එක (Stripe: අවම පැය 24යි); ඊට පස්සේ එන retries අලුත් ඒවා විදිහට සලකනවා.                                       |
| Business key              | A value that identifies the real-world thing, such as the order number; a unique rule on it stops duplicates for good.           | ඇත්ත ලෝකයේ දේ අඳුනගන්න අගයක්, order number එක වගේ; ඒකට unique rule එකක් දැම්මොත් duplicates සදහටම නවතිනවා.                              |
| End-to-end idempotency    | Every hop protects itself: each service sends its own key to the next, so the whole chain can be repeated safely.                | හැම hop එකක්ම තමන්ව ආරක්ෂා කරගන්නවා: හැම service එකක්ම ඊළඟ එකට තමන්ගේම key එකක් යවනවා, ඒ නිසා මුළු chain එකම ආරක්ෂිතව repeat කරන්න පුළුවන්.     |

## Message captions

| Message              | English                                                  | සිංහල                                                  |
| -------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| put-address          | Shopper A sets the delivery address                      | Shopper A delivery address එක දානවා                   |
| update-address       | Payments updates the order's address                     | Payments order එකේ address එක update කරනවා            |
| address-updated      | The address is the same as before                        | Address එක කලින් තිබ්බ එකමයි                               |
| address-ok           | Address saved                                            | Address එක save වුණා                                   |
| pay-no-key           | Shopper A pays for order 1042 (no key)                   | Shopper A order 1042 ට ගෙවනවා (key එකක් නැතුව)          |
| charge-card          | Payments asks the Card processor to take the money       | සල්ලි ගන්න කියලා Payments Card processor ගෙන් ඉල්ලනවා       |
| card-charged         | The card is charged                                      | Card එකෙන් සල්ලි ගත්තා                                    |
| insert-payment       | Payments records the payment                             | Payments ගෙවීම record කරනවා                            |
| payment-saved        | The payment is saved                                     | ගෙවීම save වුණා                                         |
| created              | Payment succeeded                                        | ගෙවීම සාර්ථකයි                                           |
| created-again        | Payment succeeded (a second payment)                     | ගෙවීම සාර්ථකයි (දෙවෙනි ගෙවීමක්)                             |
| lost-response        | The answer is lost on the way back                       | උත්තරය ආපහු එන අතරමගදී නැති වෙනවා                         |
| keyed-request        | Shopper A pays, with an idempotency key                  | Shopper A idempotency key එකක් එක්ක ගෙවනවා              |
| keyed-retry          | Shopper A retries, with the same key                     | Shopper A එකම key එක එක්ක retry කරනවා                  |
| insert-key           | Payments writes the key down first: in progress          | Payments මුලින්ම key එක ලියාගන්නවා: in progress            |
| key-inserted         | The key is saved as in progress                          | Key එක in progress විදිහට save වුණා                      |
| save-done            | Payments saves the payment and the key's answer together | Payments ගෙවීමයි key එකේ උත්තරයයි එකට save කරනවා          |
| saved-done           | Payment and answer saved in one transaction              | ගෙවීමයි උත්තරයයි එක transaction එකකින් save වුණා             |
| key-lookup           | Payments looks the key up                                | Payments key එක හොයනවා                                |
| key-found-done       | Found: done, with the saved answer                       | හම්බුණා: done, save කරපු උත්තරයත් එක්ක                      |
| replayed             | The saved answer, replayed                               | Save කරපු උත්තරය, ආයෙත් යවනවා                            |
| key-conflict         | The key is already taken                                 | Key එක දැනටමත් අරගෙන                                   |
| conflict             | 409: still in progress, try again shortly                | 409: තවම වැඩ කරනවා, ටිකකින් ආයෙත් try කරන්න                |
| changed-request      | Shopper A pays a new amount with the old key             | Shopper A පරණ key එකෙන් අලුත් මුදලක් ගෙවනවා                |
| fingerprint-differs  | The request doesn't match the key's fingerprint          | Request එක key එකේ fingerprint එකට ගැලපෙන්නේ නැහැ      |
| unprocessable        | 422: this key was used for a different request           | 422: මේ key එක වෙන request එකකට පාවිච්චි කරලා            |
| charge-with-key      | Payments asks the Card processor, with its own key       | Payments තමන්ගේම key එකක් එක්ක Card processor ගෙන් ඉල්ලනවා |
| key-found-stale      | Found: in progress, but abandoned 70 s ago               | හම්බුණා: in progress, ඒත් තත්පර 70කට කලින් අත්හැරලා          |
| card-replayed        | The Card processor replays the earlier charge            | Card processor කලින් කරපු charge එක ආයෙත් යවනවා           |
| key-missing          | Not found: the key has expired                           | හම්බුණේ නැහැ: key එක expire වෙලා                        |
| charge-card-new      | Payments charges the card again (a new key)              | Payments ආයෙත් card එකෙන් සල්ලි ගන්නවා (අලුත් key එකක්)       |
| card-charged-again   | The card is charged a second time                        | Card එකෙන් දෙවෙනි පාරටත් සල්ලි ගත්තා                        |
| insert-payment-again | Payments records a second payment                        | Payments දෙවෙනි ගෙවීමක් record කරනවා                     |
| payment-saved-again  | A second payment for order 1042                          | Order 1042 ට දෙවෙනි ගෙවීමක්                              |
| created-late         | Payment succeeded (a second payment)                     | ගෙවීම සාර්ථකයි (දෙවෙනි ගෙවීමක්)                             |
| check-order          | Payments checks whether the order is already paid        | Order එකට දැනටමත් ගෙවලාද කියලා Payments බලනවා           |
| order-paid           | Order 1042 is already paid                               | Order 1042 ට දැනටමත් ගෙවලා                             |
| already-paid         | 409: order already paid                                  | 409: order එකට දැනටමත් ගෙවලා                           |

## Scene badges

`{count}` is replaced by a number in the scene.

| Badge                 | English                      | සිංහල                            |
| --------------------- | ---------------------------- | ------------------------------- |
| address-same          | address: 12 Lake Rd · same   | address: 12 Lake Rd · එකමයි      |
| charged-once          | charged once                 | එක පාරයි ගත්තේ                    |
| charged-twice         | charged twice                | දෙපාරක් ගත්තා                     |
| charges-one-order     | {count} charges · 1 order    | charges {count} · order 1       |
| double-click          | double click                 | double click                    |
| no-answer             | no answer                    | උත්තරයක් නැහැ                     |
| slow                  | slow                         | හෙමින්                            |
| timed-out             | timed out · retry            | timed out · retry               |
| key-saved             | key 7f3a… · saved            | key 7f3a… · save කළා            |
| key-attempt-2         | key 7f3a… · attempt 2        | key 7f3a… · attempt 2           |
| paid                  | paid                         | ගෙව්වා                           |
| in-progress           | key 7f3a… · in progress      | key 7f3a… · in progress         |
| done                  | key 7f3a… · done · 201 saved | key 7f3a… · done · 201 save කළා |
| replayed              | replayed                     | replay කළා                      |
| one-charge-requests   | 1 charge · {count} requests  | charge 1 · requests {count}     |
| double-tap            | double tap                   | double tap                      |
| conflict              | 409 · try again shortly      | 409 · ටිකකින් ආයෙත්                 |
| new-cart              | new cart · same key          | අලුත් cart · එකම key              |
| different-body        | different body               | වෙනස් body එකක්                   |
| key-reused            | 422 · key reused             | 422 · key එක ආයෙත් පාවිච්චි කළා     |
| downstream-key        | key pay_81f2 · charged once  | key pay_81f2 · එක පාරයි ගත්තේ     |
| expires               | key 7f3a… · expires in 24 h  | key 7f3a… · පැය 24කින් expire     |
| crashed               | crashed                      | crash වුණා                       |
| taking-over           | taking over                  | භාර ගන්නවා                       |
| charged-once-replayed | charged once · replayed      | එක පාරයි ගත්තේ · replay කළා       |
| late-retry            | 25 h later · retry           | පැය 25කට පස්සේ · retry           |
| key-expired           | key 7f3a… · expired          | key 7f3a… · expire වෙලා         |
| already-paid          | already paid · order 1042    | දැනටමත් ගෙවලා · order 1042       |
| one-charge            | 1 charge                     | charge 1                        |

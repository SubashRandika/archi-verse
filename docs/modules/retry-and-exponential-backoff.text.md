# Retry and Exponential Backoff module text (English and Sinhala)

- **Generated** by `npm run docs:module-text` from
  `src/content/modules/retry-and-exponential-backoff/text/`. Edit the TypeScript files, not this document.
- **Beginner** is written as if for a five-year-old, with an everyday example.
  **Advanced** keeps the technical depth and adds a worked example.
- **Sinhala** uses a friendly spoken style; technical terms stay in English.
- The learning objectives and scene notes are in
  [retry-and-exponential-backoff.md](retry-and-exponential-backoff.md).

---

## Main path

## Things fail for a moment · මොහොතකට දේවල් අසාර්ථක වෙනවා

### 1. A blip · පොඩි බාධාවක්

**Watch:** Shopper A presses Pay while Payments is restarting. Payments answers 503 Service Unavailable, and a moment later it is ready again.

**බලන්න:** Payments restart වෙන වෙලාවේ Shopper A Pay ඔබනවා. Payments 503 Service Unavailable කියලා උත්තර දෙනවා, මොහොතකින් ආයෙත් ලෑස්ති වෙනවා.

#### Beginner

**In simple words**

Shopper A presses Pay. The payment helper on the server is busy for a moment, so it says “sorry, not now”.

A second later it is fine again. Nothing is really broken; the timing was just unlucky.

**Like in real life**

You phone a shop and the line is busy. That doesn’t mean the shop has closed. It means everyone called at once, or the person was away for a minute.

**සරලව කිව්වොත්**

Shopper A Pay ඔබනවා. Server එකේ ඉන්න ගෙවීම් උදව්කාරයා මොහොතකට කාර්යබහුලයි, ඒ නිසා “සමාවෙන්න, දැන් බැහැ” කියනවා.

තත්පරයකින් ඔක්කොම ආයෙත් හරි. ඇත්තටම කිසිම දෙයක් කැඩිලා නැහැ; වෙලාව විතරයි වැරදුණේ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ කඩේකට call කරනවා, line එක busy. ඒකෙන් කියන්නේ කඩේ වහලා කියලා නෙවෙයි. හැමෝම එකපාර call කළා, නැත්නම් එතන ඉන්න කෙනා විනාඩියකට පැත්තකට ගියා.

#### Advanced

**How it works**

Many failures in distributed systems are transient: they last milliseconds to seconds and go away without anyone acting. Typical causes are a deploy restarting instances, a brief overload, a dropped connection, a database failover or a network hiccup.

A permanent failure (a bad request, a missing resource, a bug) gives the same error every time. (The numbers in this module are illustrations, and playback compresses time; the badges show the real values.)

**Example**

_The failed payment_

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json

{"error":"service_unavailable","message":"Please try again shortly."}
```

**මෙය වැඩ කරන හැටි**

Distributed systems වල එන ගොඩක් failures transient: ඒවා milliseconds සිට තත්පර කිහිපයක් තියෙනවා, කවුරුවත් කිසිම දෙයක් නොකර නැති වෙනවා. සාමාන්‍ය හේතු: deploy එකකදී instances restart වීම, කෙටි overload එකක්, connection එකක් drop වීම, database failover එකක්, network එකේ පොඩි අවුලක්.

Permanent failure එකක් (වැරදි request එකක්, නැති resource එකක්, bug එකක්) හැම වෙලාවෙම එකම error එක දෙනවා. (මේ module එකේ ඉලක්කම් උදාහරණ විතරයි, playback එකේ කාලය කෙටි කරලා; badges පෙන්නන්නේ ඇත්ත අගයන්.)

**උදාහරණය**

_අසාර්ථක වුණු ගෙවීම_

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json

{"error":"service_unavailable","message":"Please try again shortly."}
```

_Words to know:_ Transient failure, Permanent failure, 503 Service Unavailable · _Message:_ 503: not now, try again shortly

---

### 2. Just try again · ආයෙත් try කරන්න

**Watch:** Shopper A waits a moment and sends the same payment again. This time Payments charges it and answers 201 Created: paid on attempt 2.

**බලන්න:** Shopper A මොහොතක් ඉඳලා එකම ගෙවීම ආයෙත් යවනවා. මේ පාර Payments charge කරලා 201 Created කියනවා: attempt 2 දී ගෙව්වා.

#### Beginner

**In simple words**

Shopper A’s app waits a tiny moment and asks again. This time the helper says yes, and the payment goes through.

Shopper A never even noticed that the first try failed.

**Like in real life**

The line was busy, so you wait a moment and call again, and this time someone answers.

**සරලව කිව්වොත්**

Shopper A ගේ app එක පොඩි මොහොතක් ඉඳලා ආයෙත් අහනවා. මේ පාර උදව්කාරයා “හරි” කියනවා, ගෙවීම යනවා.

පළවෙනි පාර අසාර්ථක වුණා කියලවත් Shopper A දැනගත්තේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Line එක busy, ඒ නිසා ඔබ මොහොතක් ඉඳලා ආයෙත් call කරනවා, මේ පාර කවුරුහරි උත්තර දෙනවා.

#### Advanced

**How it works**

A retry sends the same request again after a failure. It is worth it only for errors that might succeed next time:

- **Retry:** timeouts, dropped connections, 408, 429, 502, 503 and 504. Often 500 too, carefully.
- **Don’t retry:** 400, 401, 403, 404, 409 and 422. The same request will fail the same way; retrying only adds load and delay.

The browser’s fetch never retries for you. Libraries do: TanStack Query retries a failed query 3 times by default, gRPC has a retry policy in its service config, and the AWS SDKs retry throttling and transient errors by default.

**Example**

_A retry decision (TypeScript)_

```
function isRetryable(error: HttpError): boolean {
  if (error.kind === "timeout" || error.kind === "network") return true;
  return [408, 429, 502, 503, 504].includes(error.status);
}
```

**මෙය වැඩ කරන හැටි**

Retry එකක් කියන්නේ failure එකකට පස්සේ එකම request එක ආයෙත් යැවීම. ඒක වටින්නේ ඊළඟ පාර සාර්ථක වෙන්න පුළුවන් errors වලට විතරයි:

- **Retry කරන්න:** timeouts, drop වුණු connections, 408, 429, 502, 503, 504. සමහර වෙලාවට 500 ත්, පරිස්සමෙන්.
- **Retry කරන්න එපා:** 400, 401, 403, 404, 409, 422. එකම request එක එකම විදිහට අසාර්ථක වෙනවා; retry කිරීමෙන් load එකයි ප්‍රමාදයයි විතරයි වැඩි වෙන්නේ.

Browser එකේ fetch කවදාවත් ඔබ වෙනුවෙන් retry කරන්නේ නැහැ. Libraries කරනවා: TanStack Query default විදිහට අසාර්ථක query එකක් 3 පාරක් retry කරනවා, gRPC එකේ service config එකේ retry policy එකක් තියෙනවා, AWS SDKs default විදිහට throttling සහ transient errors retry කරනවා.

**උදාහරණය**

_Retry කරන්නද නැද්ද තීරණය (TypeScript)_

```
function isRetryable(error: HttpError): boolean {
  if (error.kind === "timeout" || error.kind === "network") return true;
  return [408, 429, 502, 503, 504].includes(error.status);
}
```

_Words to know:_ Retry, Retryable error · _Message:_ Shopper A pays for order 1042

---

## Retrying without making it worse · තත්ත්වය නරක් නොකර retry කිරීම

### 3. Everyone retries at once · හැමෝම එකපාර retry කරනවා

**Watch:** All three shoppers pay while Payments is restarting, and every app retries straight away, again and again. Payments’ load climbs to 30 requests a second, three times what it can handle.

**බලන්න:** Payments restart වෙනකොට shoppers තුන්දෙනාම ගෙවනවා, හැම app එකක්ම වහාම, ආයෙ ආයෙත් retry කරනවා. Payments එකේ load එක තත්පරයට requests 30 දක්වා යනවා, එයට දරාගන්න පුළුවන් ප්‍රමාණය මෙන් තුන් ගුණයක්.

#### Beginner

**In simple words**

Now everyone’s payment fails at the same moment, and every app asks again straight away, and again, and again.

The helper was only a little busy before. Now it has three times more questions than it can answer, so it stays stuck.

**Like in real life**

A lift is full, and everyone waiting keeps pressing the button non-stop. The lift doesn’t come any faster; the crowd just grows.

**සරලව කිව්වොත්**

දැන් හැමෝගෙම ගෙවීම එකම මොහොතේ අසාර්ථක වෙනවා, හැම app එකක්ම වහාම ආයෙත් අහනවා, ආයෙත්, ආයෙත්.

කලින් උදව්කාරයා පොඩ්ඩක් විතරයි කාර්යබහුල වුණේ. දැන් එයාට උත්තර දෙන්න පුළුවන් ප්‍රමාණය මෙන් තුන් ගුණයක් ප්‍රශ්න, ඒ නිසා එයා හිර වෙලා ඉන්නවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Lift එක පිරිලා, බලන් ඉන්න හැමෝම නොනවත්වා button එක ඔබනවා. Lift එක ඉක්මනට එන්නේ නැහැ; සෙනඟ විතරක් වැඩි වෙනවා.

#### Advanced

**How it works**

Retrying immediately turns a short failure into a long one. Every failed request comes back as one or more new requests, so the load on the struggling service multiplies just when it has the least capacity. This is a retry storm.

It can leave a system stuck in an overloaded state after the original cause has gone: the restart finished, but the backlog of retries keeps it failing. This is called a metastable failure. (The three shoppers stand for everyone paying at that moment.)

**Example**

_Immediate retries during the restart_

```
normal traffic                           10 req/s   (capacity 10 req/s)
each failure retried 2 more times, now  +20 req/s
load on Payments                        30 req/s   → every request fails → more retries
```

**මෙය වැඩ කරන හැටි**

වහාම retry කිරීමෙන් කෙටි failure එකක් දිගු එකක් වෙනවා. අසාර්ථක වෙන හැම request එකක්ම අලුත් requests එකක් හෝ කිහිපයක් විදිහට ආපහු එනවා, ඒ නිසා අමාරුවෙන් ඉන්න service එකේ load එක වැඩිම වෙන්නේ එයට අඩුම capacity එක තියෙන වෙලාවේ. මේක retry storm එකක්.

මුල් හේතුව නැති වුණාට පස්සෙත් system එක overload තත්ත්වයේම හිර වෙන්න පුළුවන්: restart එක ඉවරයි, ඒත් retries ගොඩ නිසා එය දිගටම අසාර්ථක වෙනවා. මේකට කියන්නේ metastable failure එකක් කියලා. (Shoppers තුන්දෙනා ඒ මොහොතේ ගෙවන හැමෝම වෙනුවෙන් ඉන්නවා.)

**උදාහරණය**

_Restart එක අතරතුර වහාම කරන retries_

```
normal traffic                           10 req/s   (capacity 10 req/s)
each failure retried 2 more times, now  +20 req/s
load on Payments                        30 req/s   → every request fails → more retries
```

_Words to know:_ Retry storm, Metastable failure, Load amplification · _Message:_ 503: not now, try again shortly

---

### 4. Exponential backoff · Exponential backoff

**Watch:** Each shopper now waits before retrying, and every wait is twice as long: 1 s, 2 s, then 4 s. The fourth attempts succeed, but the three retries always reach Payments together.

**බලන්න:** දැන් හැම shopper කෙනෙක්ම retry කරන්න කලින් ඉන්නවා, හැම පාරම දෙගුණයක්: 1 s, 2 s, ඊට පස්සේ 4 s. හතරවෙනි attempts සාර්ථකයි, ඒත් retries තුනම හැම වෙලාවෙම Payments ට එන්නේ එකට.

#### Beginner

**In simple words**

This time each app waits before asking again, and every time it fails, it waits twice as long: one second, then two, then four. That gives the helper time to get back on its feet.

But look: all three apps wait exactly the same, so their questions still arrive at the same moment.

**Like in real life**

If the line is busy, you wait a minute before calling again, then two minutes, then four. You stop jamming the line. But if all your friends use the same rule, you all call back at exactly the same moment.

**සරලව කිව්වොත්**

මේ පාර හැම app එකක්ම ආයෙත් අහන්න කලින් ඉන්නවා, අසාර්ථක වෙන හැම පාරම දෙගුණයක් ඉන්නවා: තත්පරයක්, ඊට පස්සේ දෙකක්, ඊට පස්සේ හතරක්. ඒකෙන් උදව්කාරයාට ආයෙත් කකුල් උඩ හිටගන්න වෙලාව ලැබෙනවා.

ඒත් බලන්න: apps තුනම හරියටම එක වගේ ඉන්න නිසා, ඒවායේ ප්‍රශ්න තවමත් එකම මොහොතේ එනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Line එක busy නම්, ආයෙත් call කරන්න කලින් ඔබ විනාඩියක් ඉන්නවා, ඊට පස්සේ විනාඩි දෙකක්, ඊට පස්සේ හතරක්. ඔබ line එක හිර කරන එක නවත්වනවා. ඒත් ඔබේ යාළුවෝ හැමෝම එකම rule එක පාවිච්චි කළොත්, ඔක්කොම ආයෙත් call කරන්නේ හරියටම එකම මොහොතේ.

#### Advanced

**How it works**

Exponential backoff makes the wait before retry n grow geometrically, base × 2^(n−1), limited by a cap so it never gets absurdly long. Fewer retries reach the service while it is down, and quick blips still recover quickly.

But clients that failed together keep retrying together, in synchronised waves. TanStack Query’s default delay is exactly this: base 1 s, cap 30 s.

**Example**

_Base 1 s, cap 30 s_

```
attempt 1   fails (503)
wait 1 s    attempt 2   fails
wait 2 s    attempt 3   fails
wait 4 s    attempt 4   succeeds        total wait 7 s
(a 5th try would wait 8 s, then 16 s, then 30 s: the cap)
```

_TanStack Query’s default retryDelay_

```
const delay = Math.min(1000 * 2 ** attemptIndex, 30_000); // TanStack Query
```

**මෙය වැඩ කරන හැටි**

Exponential backoff එකෙන් retry n ට කලින් ඉන්න කාලය geometric විදිහට වැඩි වෙනවා, base × 2^(n−1), cap එකකින් සීමා කරලා, ඒ නිසා කවදාවත් අසාමාන්‍ය විදිහට දිගු වෙන්නේ නැහැ. Service එක down වෙලා ඉන්නකොට අඩු retries ගණනක් එයට එනවා, ඉක්මන් blips ඉක්මනින්ම හරි යනවා.

ඒත් එකට අසාර්ථක වුණු clients දිගටම එකට retry කරනවා, synchronised waves විදිහට. TanStack Query ගේ default delay එක හරියටම මේක: base 1 s, cap 30 s.

**උදාහරණය**

_Base 1 s, cap 30 s_

```
attempt 1   fails (503)
wait 1 s    attempt 2   fails
wait 2 s    attempt 3   fails
wait 4 s    attempt 4   succeeds        total wait 7 s
(a 5th try would wait 8 s, then 16 s, then 30 s: the cap)
```

_TanStack Query ගේ default retryDelay_

```
const delay = Math.min(1000 * 2 ** attemptIndex, 30_000); // TanStack Query
```

_Words to know:_ Exponential backoff, Base delay, Cap · _Message:_ Shopper A pays for order 1042

---

### 5. Add jitter · Jitter එකතු කරන්න

**Watch:** Each shopper now waits a random part of the backoff, so their retries drift apart and reach Payments one at a time. The random waits are fixed here, so every replay looks the same.

**බලන්න:** දැන් හැම shopper කෙනෙක්ම backoff එකේ random කොටසක් ඉන්නවා, ඒ නිසා retries එකිනෙකින් ඈත් වෙලා Payments ට එන්නේ එකින් එක. මෙතන random waits fix කරලා, ඒ නිසා හැම replay එකක්ම එක වගේ.

#### Beginner

**In simple words**

Now each app adds a little surprise: it waits a random part of its waiting time, not exactly the same as the others.

So the questions arrive one by one instead of all at once, and the helper can answer each of them.

**Like in real life**

Instead of everyone calling back at exactly 2 o’clock, each friend calls sometime between 2 and 2:10. The line is never jammed.

**සරලව කිව්වොත්**

දැන් හැම app එකක්ම පොඩි surprise එකක් එකතු කරනවා: එය ඉන්න කාලයෙන් random කොටසක් ඉන්නවා, අනිත් අය වගේ හරියටම එකම කාලයක් නෙවෙයි.

ඒ නිසා ප්‍රශ්න එකපාර ඔක්කොම නෙවෙයි, එකින් එක එනවා, උදව්කාරයාට හැම එකකටම උත්තර දෙන්න පුළුවන්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

හැමෝම හරියටම 2 ට ආයෙත් call කරනවා වෙනුවට, හැම යාළුවෙක්ම 2 ත් 2:10 ත් අතර කවදා හරි call කරනවා. Line එක කවදාවත් හිර වෙන්නේ නැහැ.

#### Advanced

**How it works**

Jitter adds randomness to each wait so that clients that failed together spread out. Marc Brooker’s AWS Architecture Blog post “Exponential Backoff and Jitter” compared the variants.

Full jitter is simple and works well: sleep = random(0, min(cap, base × 2^attempt)). Compared with backoff alone, it cuts both the work the server does and the time until clients finish. The animation uses fixed “random” values so that replays match; real clients use Math.random().

**Example**

_The waits before attempts 2 and 3, with full jitter_

```
             before attempt 2       before attempt 3
             random(0, 1 s)         random(0, 2 s)
Shopper A    0.4 s                  1.3 s
Shopper B    0.9 s                  0.5 s
Shopper C    0.7 s                  1.8 s
```

_Full jitter_

```
const delay = Math.random() * Math.min(capMs, baseMs * 2 ** attempt);
```

**මෙය වැඩ කරන හැටි**

Jitter එකෙන් හැම wait එකකටම randomness එකතු කරනවා, එකට අසාර්ථක වුණු clients විසිරෙන්න. Marc Brooker ගේ AWS Architecture Blog post එක “Exponential Backoff and Jitter” මේ variants සංසන්දනය කළා.

Full jitter සරලයි, හොඳට වැඩ කරනවා: sleep = random(0, min(cap, base × 2^attempt)). Backoff විතරක් එක්ක බලනකොට, server එක කරන වැඩයි clients ඉවර වෙන්න යන කාලයයි දෙකම අඩු කරනවා. Replays එක වගේ වෙන්න animation එක fix කරපු “random” අගයන් පාවිච්චි කරනවා; ඇත්ත clients Math.random() පාවිච්චි කරනවා.

**උදාහරණය**

_Full jitter එක්ක attempts 2 සහ 3 ට කලින් ඉන්න කාලය_

```
             before attempt 2       before attempt 3
             random(0, 1 s)         random(0, 2 s)
Shopper A    0.4 s                  1.3 s
Shopper B    0.9 s                  0.5 s
Shopper C    0.7 s                  1.8 s
```

_Full jitter_

```
const delay = Math.random() * Math.min(capMs, baseMs * 2 ** attempt);
```

_Words to know:_ Jitter, Full jitter, Thundering herd · _Message:_ Shopper B pays for order 1043

---

### 6. Know when to stop · නවතින්න දැනගන්න

**Watch:** This time the deploy goes wrong and Payments stays down. Shopper A tries four times with backoff, then stops and shows a clear message.

**බලන්න:** මේ පාර deploy එක වැරදෙනවා, Payments down වෙලාම ඉන්නවා. Shopper A backoff එක්ක හතර පාරක් try කරලා, නවතිලා පැහැදිලි පණිවිඩයක් පෙන්නනවා.

#### Beginner

**In simple words**

Sometimes the helper is not coming back soon. Asking for ever would only make you wait for ever.

So the app tries a few times, then stops and tells you honestly: “Payment didn’t go through. You weren’t charged. Please try again later.”

**Like in real life**

After calling three or four times with no answer, you stop and send a message instead. You don’t spend the whole day redialling.

**සරලව කිව්වොත්**

සමහර වෙලාවට උදව්කාරයා ඉක්මනට ආපහු එන්නේ නැහැ. සදහටම අහගෙන හිටියොත් ඔබට සදහටම බලන් ඉන්න වෙනවා.

ඒ නිසා app එක පාර කිහිපයක් try කරලා නවතිනවා, අවංකව කියනවා: “ගෙවීම සිද්ධ වුණේ නැහැ. ඔබෙන් මුදල් අය කළේ නැහැ. කරුණාකර පස්සේ ආයෙත් try කරන්න.”

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

තුන් හතර පාරක් call කරලත් උත්තරයක් නැත්නම්, ඔබ නවතිලා message එකක් යවනවා. මුළු දවසම ආයෙ ආයෙ dial කරන්නේ නැහැ.

#### Advanced

**How it works**

Every retry loop needs limits:

- **Max attempts:** here 4 (the first try and 3 retries).
- **A deadline:** an overall time budget for the whole operation, here 10 s. Each attempt’s timeout must fit inside what is left of it.
- **A retry budget:** retries as a share of all requests (Google’s SRE book suggests about 10% per client), so a big outage cannot multiply the load.
- **A circuit breaker:** when most calls are failing, stop sending even first attempts for a while (see the Circuit Breaker module). Retries handle blips; the breaker handles outages.

Then fail clearly: tell the user what happened and whether anything was charged.

**Example**

_The give-up path_

```
attempt 1   t = 0 s     503
attempt 2   t = 1 s     503
attempt 3   t = 3 s     503
attempt 4   t = 7 s     503     → stop: max attempts reached (deadline 10 s)
UI: “Payment didn’t go through. You weren’t charged. Please try again in a few minutes.”
```

**මෙය වැඩ කරන හැටි**

හැම retry loop එකකටම සීමා ඕනේ:

- **Max attempts:** මෙතන 4 (පළවෙනි try එක සහ retries 3).
- **Deadline එකක්:** මුළු operation එකටම කාල සීමාවක්, මෙතන 10 s. හැම attempt එකකම timeout එක ඉතුරු කාලය ඇතුළේ තියෙන්න ඕනේ.
- **Retry budget එකක්:** මුළු requests වලින් retries වලට ඉඩ දෙන කොටස (Google ගේ SRE book එක client කෙනෙකුට 10% විතර යෝජනා කරනවා), ඒ නිසා ලොකු outage එකකට load එක ගුණ කරන්න බැහැ.
- **Circuit breaker එකක්:** ගොඩක් calls අසාර්ථක වෙනකොට, ටික වෙලාවකට පළවෙනි attempts පවා යවන එක නවත්වන්න (Circuit Breaker module එක බලන්න). Retries blips බලාගන්නවා; breaker එක outages බලාගන්නවා.

ඊට පස්සේ පැහැදිලිව fail වෙන්න: මොකද වුණේ, මුදල් අය වුණාද කියලා user ට කියන්න.

**උදාහරණය**

_නවතින පාර_

```
attempt 1   t = 0 s     503
attempt 2   t = 1 s     503
attempt 3   t = 3 s     503
attempt 4   t = 7 s     503     → stop: max attempts reached (deadline 10 s)
UI: “Payment didn’t go through. You weren’t charged. Please try again in a few minutes.”
```

_Words to know:_ Max attempts, Deadline, Retry budget, Circuit breaker · _Message:_ Shopper A stops after four attempts

---

## Is it safe to repeat? · ආයෙත් කරන එක ආරක්ෂිතද?

### 7. The double charge · දෙපාරක් අය කිරීම

**Watch:** Payments charges Shopper A, but its answer is lost halfway back. The app times out and retries, and Payments charges again: charged twice.

**බලන්න:** Payments Shopper A ගෙන් අය කරනවා, ඒත් එහි උත්තරය ආපහු එන අතරමගදී නැති වෙනවා. App එක time out වෙලා retry කරනවා, Payments ආයෙත් අය කරනවා: දෙපාරක් අය කළා.

#### Beginner

**In simple words**

Shopper A pays, and the payment goes through, but the “done!” message gets lost on the way back.

The app doesn’t know it worked, so it asks again, and the helper takes the money a second time. Oops.

**Like in real life**

You post a letter with money inside, but you never hear back. So you send another letter with more money, and later find out both arrived.

**සරලව කිව්වොත්**

Shopper A ගෙවනවා, ගෙවීම සිද්ධ වෙනවා, ඒත් “හරි!” කියන පණිවිඩය ආපහු එන පාරේදී නැති වෙනවා.

ඒක වැඩ කළා කියලා app එක දන්නේ නැහැ, ඒ නිසා ආයෙත් අහනවා, උදව්කාරයා දෙවෙනි පාරටත් සල්ලි ගන්නවා. අයියෝ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ සල්ලි දාපු ලියුමක් post කරනවා, ඒත් කිසිම උත්තරයක් එන්නේ නැහැ. ඒ නිසා ඔබ තවත් සල්ලි දාලා තව ලියුමක් යවනවා, පස්සේ දැනගන්නවා දෙකම ලැබිලා කියලා.

#### Advanced

**How it works**

A timeout tells the client nothing about what happened on the server: the request may never have arrived, may have failed, or may have succeeded with the response lost. Retrying is safe only if doing the operation twice has the same effect as doing it once: if it is idempotent.

In HTTP, GET, HEAD, PUT and DELETE are defined as idempotent; POST and PATCH are not. That is why TanStack Query retries queries by default but not mutations (retry: 0 for useMutation).

**Example**

_What each side saw_

```
client    POST /payments  {orderId: 1042}  ──▶
server    charge LKR 12,400 → saved as pay_81f2 → 201 Created  ──╳  (connection reset)
client    timeout after 5 s → retry: POST /payments  {orderId: 1042}  ──▶
server    charge LKR 12,400 → saved as pay_9c07 → 201 Created
result    two charges for one order
```

**මෙය වැඩ කරන හැටි**

Timeout එකකින් server එකේ මොකද වුණේ කියලා client ට කිසිම දෙයක් කියන්නේ නැහැ: request එක කවදාවත් ගිහින් නැතුව ඇති, අසාර්ථක වෙලා ඇති, නැත්නම් සාර්ථක වෙලා response එක නැති වෙලා ඇති. Retry කිරීම ආරක්ෂිත වෙන්නේ operation එක දෙපාරක් කළාම එක පාරක් කළා වගේම බලපෑමක් තියෙනවා නම් විතරයි: ඒ කියන්නේ idempotent නම්.

HTTP වල GET, HEAD, PUT සහ DELETE idempotent කියලා define කරලා තියෙනවා; POST සහ PATCH එහෙම නැහැ. ඒ නිසයි TanStack Query default විදිහට queries retry කරලා mutations retry නොකරන්නේ (useMutation වලට retry: 0).

**උදාහරණය**

_දෙපැත්තම දැක්ක දේ_

```
client    POST /payments  {orderId: 1042}  ──▶
server    charge LKR 12,400 → saved as pay_81f2 → 201 Created  ──╳  (connection reset)
client    timeout after 5 s → retry: POST /payments  {orderId: 1042}  ──▶
server    charge LKR 12,400 → saved as pay_9c07 → 201 Created
result    two charges for one order
```

_Words to know:_ Idempotent, Idempotent methods, At-least-once · _Message:_ “Payment succeeded”, lost on the way back

---

### 8. Idempotency keys · Idempotency keys

**Watch:** This time the payment carries a key. The answer is lost again, and the app retries with the same key. Payments finds the key and returns the first result: charged once.

**බලන්න:** මේ පාර ගෙවීමත් එක්ක key එකක් යනවා. උත්තරය ආයෙත් නැති වෙනවා, app එක එකම key එකෙන් retry කරනවා. Payments key එක හොයාගෙන පළවෙනි result එකම දෙනවා: එක පාරයි අය කළේ.

#### Beginner

**In simple words**

Now the app writes a special number on the payment, like a ticket number, and keeps it. If it has to ask again, it sends the same number.

The helper checks: “I already did this ticket”, and just says “done” again, without taking more money.

**Like in real life**

You write a reference number on the letter. If you send a second letter with the same number, the shop knows it’s the same order and doesn’t charge you again.

**සරලව කිව්වොත්**

දැන් app එක ගෙවීම උඩ ticket අංකයක් වගේ විශේෂ අංකයක් ලියලා ඒක තියාගන්නවා. ආයෙත් අහන්න වුණොත්, එකම අංකය යවනවා.

උදව්කාරයා බලනවා: “මේ ticket එක මම දැනටමත් කළා”, තව සල්ලි නොගෙන ආයෙත් “හරි” කියනවා විතරයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ ලියුම උඩ reference අංකයක් ලියනවා. එකම අංකයෙන් දෙවෙනි ලියුමක් යැව්වොත්, ඒ එකම order එක කියලා කඩේ දන්නවා, ආයෙත් අය කරන්නේ නැහැ.

#### Advanced

**How it works**

The client makes a unique idempotency key once per operation (not per attempt) and sends it with every attempt. The server stores the key with the result of the first request; a repeat with the same key gets the stored result instead of a second charge. Stripe’s API works this way, and the IETF Idempotency-Key header draft describes it for any HTTP API.

Details that matter, covered in the Idempotency concept: keys expire (Stripe keeps them for at least 24 hours), the same key with a different body is an error, and two concurrent requests with one key need a lock.

**Example**

_The retry, with a key_

```http
POST /payments HTTP/1.1
Host: api.shop.example
Content-Type: application/json
Idempotency-Key: 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47

{"orderId":1042,"amount":"12400.00","currency":"LKR"}
```

_The first result, not a new charge_

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /payments/pay_81f2
Idempotent-Replayed: true

{"id":"pay_81f2","orderId":1042,"status":"succeeded"}
```

**මෙය වැඩ කරන හැටි**

Client එක operation එකකට එක පාරක් (attempt එකකට නෙවෙයි) unique idempotency key එකක් හදලා, හැම attempt එකකම ඒක යවනවා. Server එක key එක පළවෙනි request එකේ result එකත් එක්ක save කරනවා; එකම key එකෙන් එන repeat එකකට දෙවෙනි charge එකක් වෙනුවට save කරපු result එක ලැබෙනවා. Stripe ගේ API එක වැඩ කරන්නේ මෙහෙමයි, IETF Idempotency-Key header draft එක ඕනෑම HTTP API එකකට මේක විස්තර කරනවා.

වැදගත් විස්තර, Idempotency concept එකේ තියෙනවා: keys expire වෙනවා (Stripe ඒවා අවම වශයෙන් පැය 24ක් තියාගන්නවා), එකම key එක වෙනස් body එකක් එක්ක ආවොත් ඒක error එකක්, එක key එකක් එක්ක එකවර එන requests දෙකකට lock එකක් ඕනේ.

**උදාහරණය**

_Key එකත් එක්ක retry එක_

```http
POST /payments HTTP/1.1
Host: api.shop.example
Content-Type: application/json
Idempotency-Key: 7f3a9c2e-4b1d-4e8a-9f60-2d5c1b8e3a47

{"orderId":1042,"amount":"12400.00","currency":"LKR"}
```

_පළවෙනි result එක, අලුත් charge එකක් නෙවෙයි_

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /payments/pay_81f2
Idempotent-Replayed: true

{"id":"pay_81f2","orderId":1042,"status":"succeeded"}
```

_Words to know:_ Idempotency key, Exactly-once effect · _Message:_ The payment, with an idempotency key

---

## Scenarios

## Scenario: The server says when · Server එක කියනවා කවදද කියලා

Payments answers 503 with Retry-After: 5, and the apps wait exactly that long.

Payments Retry-After: 5 එක්ක 503 කියනවා, apps හරියටම ඒ තරම් ඉන්නවා.

### 1. A 503 with Retry-After · Retry-After එක්ක 503

**Watch:** The three shoppers pay while Payments is restarting. Payments answers each with 503 and Retry-After: 5, so each app knows how long to wait.

**බලන්න:** Payments restart වෙනකොට shoppers තුන්දෙනා ගෙවනවා. Payments හැමෝටම 503 සහ Retry-After: 5 කියලා උත්තර දෙනවා, ඒ නිසා කොච්චර ඉන්න ඕනෙද කියලා හැම app එකක්ම දන්නවා.

#### Beginner

**In simple words**

This time the helper says more than “not now”. It says “come back in five seconds”.

So the apps don’t have to guess.

**Like in real life**

The shop’s answering machine says: “We open again at ten.” You don’t keep calling; you call at ten.

**සරලව කිව්වොත්**

මේ පාර උදව්කාරයා “දැන් බැහැ” කියනවාට වඩා දෙයක් කියනවා. එයා කියනවා “තත්පර පහකින් එන්න”.

ඒ නිසා apps වලට අනුමාන කරන්න ඕනේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කඩේ answering machine එක කියනවා: “අපි ආයෙත් දහයට අරිනවා.” ඔබ දිගටම call කරන්නේ නැහැ; දහයට call කරනවා.

#### Advanced

**How it works**

Retry-After (RFC 9110) tells the client how long to wait, as seconds (Retry-After: 5) or as an HTTP date. Servers send it with 503, and with 429 Too Many Requests (see the Rate Limiting concept).

A good client honours it as the minimum wait, still adds a little jitter, and gives up if the wait would pass its deadline.

**Example**

_The hint_

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 5
```

**මෙය වැඩ කරන හැටි**

Retry-After (RFC 9110) client ට කොච්චර ඉන්න ඕනෙද කියනවා, තත්පර විදිහට (Retry-After: 5) හෝ HTTP date එකක් විදිහට. Servers ඒක 503 එක්ක සහ 429 Too Many Requests එක්ක යවනවා (Rate Limiting concept එක බලන්න).

හොඳ client කෙනෙක් ඒක අවම wait එක විදිහට ගරු කරනවා, තවමත් පොඩි jitter එකක් එකතු කරනවා, wait එක deadline එක පහු කරනවා නම් අත්හරිනවා.

**උදාහරණය**

_Hint එක_

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 5
```

_Words to know:_ Retry-After, 503 Service Unavailable · _Message:_ 503, with “come back in 5 seconds”

---

### 2. Everyone comes back at the right time · හැමෝම හරි වෙලාවට එනවා

**Watch:** After the wait, each with a little jitter of its own, the three retries reach Payments, which is ready: all three are paid.

**බලන්න:** Wait එකෙන් පස්සේ, හැමෝම තමන්ගේම පොඩි jitter එකක් එක්ක, retries තුන Payments ට එනවා, එය ලෑස්තියි: තුන්දෙනාම ගෙව්වා.

#### Beginner

**In simple words**

The apps waited as long as they were told, and the helper was ready for them.

**Like in real life**

You called at ten, and the shop picked up straight away.

**සරලව කිව්වොත්**

Apps කියපු තරම් වෙලාව හිටියා, උදව්කාරයා ඒ අය වෙනුවෙන් ලෑස්ති වෙලා හිටියා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ දහයට call කළා, කඩේ වහාම phone එක ගත්තා.

#### Advanced

**How it works**

The server knows its own state (a restart takes about 5 s, a rate-limit window resets in 5 s), so its hint beats any guess.

Without the header, the client falls back to its own backoff with jitter.

**Example**

_How a client uses Retry-After_

```
Retry-After: 5          → wait 5 s + jitter random(0, 0.5 s)
Retry-After: Wed, 25 Nov 2026 20:15:05 GMT  → wait until then (+ jitter)
no header               → our own backoff: random(0, min(30 s, 1 s · 2^attempt))
wait passes the deadline → give up now, don’t wait
```

**මෙය වැඩ කරන හැටි**

Server එක තමන්ගේම තත්ත්වය දන්නවා (restart එකකට 5 s විතර යනවා, rate-limit window එකක් 5 s කින් reset වෙනවා), ඒ නිසා එහි hint එක ඕනෑම අනුමානයකට වඩා හොඳයි.

Header එක නැත්නම්, client එක තමන්ගේම backoff එකට jitter එක්ක ආපහු යනවා.

**උදාහරණය**

_Client කෙනෙක් Retry-After පාවිච්චි කරන විදිහ_

```
Retry-After: 5          → wait 5 s + jitter random(0, 0.5 s)
Retry-After: Wed, 25 Nov 2026 20:15:05 GMT  → wait until then (+ jitter)
no header               → our own backoff: random(0, min(30 s, 1 s · 2^attempt))
wait passes the deadline → give up now, don’t wait
```

_Words to know:_ Retry-After, Jitter · _Message:_ Shopper B pays for order 1043

---

## Scenario: Retries multiply · Retries ගුණ වෙනවා

Payments and the app both retry, so one tap becomes 16 database queries.

Payments සහ app එක දෙකම retry කරනවා, ඒ නිසා එක tap එකක් database queries 16ක් වෙනවා.

### 1. Two layers retrying · Layers දෙකක් retry කරනවා

**Watch:** The Payments DB is overloaded. Each time Shopper A tries, Payments tries the database four times, and Shopper A tries four times: the database’s badge counts 16 queries for one tap.

**බලන්න:** Payments DB එක overload වෙලා. Shopper A try කරන හැම පාරකම Payments database එක හතර පාරක් try කරනවා, Shopper A හතර පාරක් try කරනවා: database එකේ badge එක එක tap එකකට queries 16ක් ගණන් කරනවා.

#### Beginner

**In simple words**

The app asks the helper again and again, and each time, the helper asks the database again and again.

One press of a button turns into sixteen questions to the database, which is already struggling.

**Like in real life**

You ask your friend four times to call the shop, and each time your friend calls four times. The shop’s phone rings sixteen times.

**සරලව කිව්වොත්**

App එක උදව්කාරයාගෙන් ආයෙ ආයෙත් අහනවා, හැම පාරම උදව්කාරයා database එකෙන් ආයෙ ආයෙත් අහනවා.

Button එකක් එක පාරක් එබුවාම, දැනටමත් අමාරුවෙන් ඉන්න database එකට ප්‍රශ්න දාසයක් යනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ යාළුවාට හතර පාරක් කඩේට call කරන්න කියනවා, හැම පාරම යාළුවා හතර පාරක් call කරනවා. කඩේ phone එක දාසය පාරක් නාද වෙනවා.

#### Advanced

**How it works**

Retries at several layers multiply: 4 attempts at the client × 4 attempts at Payments = up to 16 database calls for one user action. Three layers would make 64.

The layers also wait for each other, so the user waits far longer than any single deadline.

**Example**

_One tap, two layers retrying_

```
client attempt 1 → Payments → DB ×4 → 503
client attempt 2 → Payments → DB ×4 → 503
client attempt 3 → Payments → DB ×4 → 503
client attempt 4 → Payments → DB ×4 → 503      = 16 DB calls
```

**මෙය වැඩ කරන හැටි**

Layers කිහිපයක retries ගුණ වෙනවා: client එකේ attempts 4 × Payments එකේ attempts 4 = එක user ක්‍රියාවකට database calls 16 දක්වා. Layers තුනක් නම් 64යි.

Layers එකිනෙකා එනකම් බලන් ඉන්නත් ඕනේ, ඒ නිසා user ට ඕනෑම එක deadline එකකට වඩා ගොඩක් වැඩි වෙලාවක් ඉන්න වෙනවා.

**උදාහරණය**

_එක tap එකක්, layers දෙකක් retry කරනවා_

```
client attempt 1 → Payments → DB ×4 → 503
client attempt 2 → Payments → DB ×4 → 503
client attempt 3 → Payments → DB ×4 → 503
client attempt 4 → Payments → DB ×4 → 503      = 16 DB calls
```

_Words to know:_ Load amplification, Retry · _Message:_ The database doesn’t answer in time

---

### 2. Retry at one layer · එක layer එකක විතරක් retry කරන්න

**Watch:** Payments now fails fast and passes the error up; only Shopper A retries. The database’s badge stops at 4 queries for one tap.

**බලන්න:** දැන් Payments වහාම fail වෙලා error එක උඩට යවනවා; retry කරන්නේ Shopper A විතරයි. Database එකේ badge එක එක tap එකකට queries 4 කින් නවතිනවා.

#### Beginner

**In simple words**

Now only the app asks again. The helper just says “the database isn’t answering” straight away.

Four questions instead of sixteen.

**Like in real life**

Your friend calls the shop once, and if nobody answers, comes straight back to tell you. You decide when to try again.

**සරලව කිව්වොත්**

දැන් ආයෙත් අහන්නේ app එක විතරයි. උදව්කාරයා වහාම කියනවා “database එක උත්තර දෙන්නේ නැහැ” කියලා.

ප්‍රශ්න දාසයක් වෙනුවට හතරයි.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබේ යාළුවා කඩේට එක පාරක් call කරනවා, කවුරුවත් උත්තර දුන්නේ නැත්නම් වහාම ඇවිත් ඔබට කියනවා. ආයෙත් try කරන්නේ කවදද කියලා ඔබ තීරණය කරනවා.

#### Advanced

**How it works**

Retry at a single layer, usually the one that knows whether the operation is safe to repeat and holds the user’s deadline. Inner layers fail fast and return a retryable error, with Retry-After if they know.

Retry budgets and circuit breakers cap the rest.

**Example**

_One tap, one layer retrying_

```
client attempt 1 → Payments → DB ×1 → 503 (fail fast)
client attempt 2 → Payments → DB ×1 → 503
client attempt 3 → Payments → DB ×1 → 503
client attempt 4 → Payments → DB ×1 → 503      = 4 DB calls
```

**මෙය වැඩ කරන හැටි**

එක layer එකක විතරක් retry කරන්න, සාමාන්‍යයෙන් operation එක ආයෙත් කරන එක ආරක්ෂිතද කියලා දන්න, user ගේ deadline එක තියාගෙන ඉන්න layer එකේ. ඇතුළේ layers වහාම fail වෙලා retryable error එකක් දෙනවා, දන්නවා නම් Retry-After එකත් එක්ක.

ඉතුරු ටික retry budgets සහ circuit breakers සීමා කරනවා.

**උදාහරණය**

_එක tap එකක්, එක layer එකක් retry කරනවා_

```
client attempt 1 → Payments → DB ×1 → 503 (fail fast)
client attempt 2 → Payments → DB ×1 → 503
client attempt 3 → Payments → DB ×1 → 503
client attempt 4 → Payments → DB ×1 → 503      = 4 DB calls
```

_Words to know:_ Fail fast, Retry budget · _Message:_ 503: not now, try again shortly

---

## Parts of the scene

### Shopper A (shopper-a)

|                   | English                                                                                                                                                                                                                                                     | සිංහල                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                                                                                                                      | Client                                                                                                                                                                                                                                            |
| Simple summary    | Someone paying for order 1042 on their laptop.                                                                                                                                                                                                              | තමන්ගේ laptop එකෙන් order 1042 ට ගෙවන කෙනෙක්.                                                                                                                                                                                                        |
| Like in real life | Like someone phoning a shop: if the line is busy, they decide when to call back.                                                                                                                                                                            | කඩේකට call කරන කෙනෙක් වගේ: line එක busy නම්, ආයෙත් call කරන්නේ කවදද කියලා එයා තීරණය කරනවා.                                                                                                                                                              |
| What it does      | Sends the payment; Tries again when it fails for a moment; Knows when to stop                                                                                                                                                                               | ගෙවීම යවනවා; මොහොතකට අසාර්ථක වුණොත් ආයෙත් try කරනවා; නවතින්න ඕනේ කවදද කියලා දන්නවා                                                                                                                                                                         |
| Talks to          | Payments                                                                                                                                                                                                                                                    | Payments                                                                                                                                                                                                                                          |
| Technical summary | A client that owns the retry policy: which errors to retry, backoff with jitter, max attempts, a deadline, and one idempotency key per payment.                                                                                                             | Retry policy එක අයිති client එකක්: retry කරන්නේ මොන errors ද, jitter එක්ක backoff, max attempts, deadline එකක්, ගෙවීමකට එක idempotency key එකක්.                                                                                                          |
| How it works      | On a retryable error (timeout, 429, 502, 503, 504) it waits random(0, min(cap, base · 2^attempt)), or as long as Retry-After says, and tries again, up to 4 attempts inside a 10 s deadline. Every attempt of one payment carries the same Idempotency-Key. | Retryable error එකක් (timeout, 429, 502, 503, 504) ආවොත් random(0, min(cap, base · 2^attempt)) කාලයක්, නැත්නම් Retry-After කියන තරම් ඉඳලා ආයෙත් try කරනවා, 10 s deadline එකක් ඇතුළේ attempts 4 දක්වා. එක ගෙවීමක හැම attempt එකකම යන්නේ එකම Idempotency-Key එක. |
| Responsibilities  | Decide which errors are worth retrying; Back off with jitter; Stop at the attempt limit or the deadline; Send the same idempotency key on every attempt                                                                                                     | Retry කරන්න වටින්නේ මොන errors ද කියලා තීරණය කරනවා; Jitter එක්ක back off කරනවා; Attempt සීමාවට හෝ deadline එකට නවතිනවා; හැම attempt එකකම එකම idempotency key එක යවනවා                                                                                     |
| Inputs            | The shopper pressing Pay; Answers and errors from Payments                                                                                                                                                                                                  | Shopper Pay ඔබන එක; Payments එකෙන් එන උත්තර සහ errors                                                                                                                                                                                               |
| Outputs           | Payment requests (and retries) to Payments; A clear message when it gives up                                                                                                                                                                                | Payments ට ගෙවීම් requests (සහ retries); අත්හරිනකොට පැහැදිලි පණිවිඩයක්                                                                                                                                                                                     |
| Examples          | POST /payments {"orderId":1042}                                                                                                                                                                                                                             | POST /payments {"orderId":1042}                                                                                                                                                                                                                   |
| Advantages        | Hides short blips from the shopper                                                                                                                                                                                                                          | කෙටි blips shopper ට පේන්නේ නැති කරනවා                                                                                                                                                                                                               |
| Limitations       | Every retry adds load and delay; Unsafe for payments without an idempotency key                                                                                                                                                                             | හැම retry එකකින්ම load එකයි ප්‍රමාදයයි වැඩි වෙනවා; Idempotency key එකක් නැතුව ගෙවීම් වලට ආරක්ෂිත නැහැ                                                                                                                                                         |
| Technologies      | fetch with a small retry helper, TanStack Query (retry, retryDelay), ky                                                                                                                                                                                     |                                                                                                                                                                                                                                                   |

### Shopper B (shopper-b)

|                   | English                                                                                                                                                                                                                                                     | සිංහල                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                                                                                                                      | Client                                                                                                                                                                                                                                            |
| Simple summary    | Someone paying for order 1043 on their phone.                                                                                                                                                                                                               | තමන්ගේ phone එකෙන් order 1043 ට ගෙවන කෙනෙක්.                                                                                                                                                                                                         |
| Like in real life | Like someone phoning a shop: if the line is busy, they decide when to call back.                                                                                                                                                                            | කඩේකට call කරන කෙනෙක් වගේ: line එක busy නම්, ආයෙත් call කරන්නේ කවදද කියලා එයා තීරණය කරනවා.                                                                                                                                                              |
| What it does      | Sends the payment; Tries again when it fails for a moment; Knows when to stop                                                                                                                                                                               | ගෙවීම යවනවා; මොහොතකට අසාර්ථක වුණොත් ආයෙත් try කරනවා; නවතින්න ඕනේ කවදද කියලා දන්නවා                                                                                                                                                                         |
| Talks to          | Payments                                                                                                                                                                                                                                                    | Payments                                                                                                                                                                                                                                          |
| Technical summary | A client that owns the retry policy: which errors to retry, backoff with jitter, max attempts, a deadline, and one idempotency key per payment.                                                                                                             | Retry policy එක අයිති client එකක්: retry කරන්නේ මොන errors ද, jitter එක්ක backoff, max attempts, deadline එකක්, ගෙවීමකට එක idempotency key එකක්.                                                                                                          |
| How it works      | On a retryable error (timeout, 429, 502, 503, 504) it waits random(0, min(cap, base · 2^attempt)), or as long as Retry-After says, and tries again, up to 4 attempts inside a 10 s deadline. Every attempt of one payment carries the same Idempotency-Key. | Retryable error එකක් (timeout, 429, 502, 503, 504) ආවොත් random(0, min(cap, base · 2^attempt)) කාලයක්, නැත්නම් Retry-After කියන තරම් ඉඳලා ආයෙත් try කරනවා, 10 s deadline එකක් ඇතුළේ attempts 4 දක්වා. එක ගෙවීමක හැම attempt එකකම යන්නේ එකම Idempotency-Key එක. |
| Responsibilities  | Decide which errors are worth retrying; Back off with jitter; Stop at the attempt limit or the deadline; Send the same idempotency key on every attempt                                                                                                     | Retry කරන්න වටින්නේ මොන errors ද කියලා තීරණය කරනවා; Jitter එක්ක back off කරනවා; Attempt සීමාවට හෝ deadline එකට නවතිනවා; හැම attempt එකකම එකම idempotency key එක යවනවා                                                                                     |
| Inputs            | The shopper pressing Pay; Answers and errors from Payments                                                                                                                                                                                                  | Shopper Pay ඔබන එක; Payments එකෙන් එන උත්තර සහ errors                                                                                                                                                                                               |
| Outputs           | Payment requests (and retries) to Payments; A clear message when it gives up                                                                                                                                                                                | Payments ට ගෙවීම් requests (සහ retries); අත්හරිනකොට පැහැදිලි පණිවිඩයක්                                                                                                                                                                                     |
| Examples          | POST /payments {"orderId":1043}                                                                                                                                                                                                                             | POST /payments {"orderId":1043}                                                                                                                                                                                                                   |
| Advantages        | Hides short blips from the shopper                                                                                                                                                                                                                          | කෙටි blips shopper ට පේන්නේ නැති කරනවා                                                                                                                                                                                                               |
| Limitations       | Every retry adds load and delay; Unsafe for payments without an idempotency key                                                                                                                                                                             | හැම retry එකකින්ම load එකයි ප්‍රමාදයයි වැඩි වෙනවා; Idempotency key එකක් නැතුව ගෙවීම් වලට ආරක්ෂිත නැහැ                                                                                                                                                         |
| Technologies      | OkHttp interceptors (Android), URLSession (iOS), TanStack Query in React Native                                                                                                                                                                             |                                                                                                                                                                                                                                                   |

### Shopper C (shopper-c)

|                   | English                                                                                                                                                                                                                                                     | සිංහල                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                                                                                                                                      | Client                                                                                                                                                                                                                                            |
| Simple summary    | Someone paying for order 1044 on their phone.                                                                                                                                                                                                               | තමන්ගේ phone එකෙන් order 1044 ට ගෙවන කෙනෙක්.                                                                                                                                                                                                         |
| Like in real life | Like someone phoning a shop: if the line is busy, they decide when to call back.                                                                                                                                                                            | කඩේකට call කරන කෙනෙක් වගේ: line එක busy නම්, ආයෙත් call කරන්නේ කවදද කියලා එයා තීරණය කරනවා.                                                                                                                                                              |
| What it does      | Sends the payment; Tries again when it fails for a moment; Knows when to stop                                                                                                                                                                               | ගෙවීම යවනවා; මොහොතකට අසාර්ථක වුණොත් ආයෙත් try කරනවා; නවතින්න ඕනේ කවදද කියලා දන්නවා                                                                                                                                                                         |
| Talks to          | Payments                                                                                                                                                                                                                                                    | Payments                                                                                                                                                                                                                                          |
| Technical summary | A client that owns the retry policy: which errors to retry, backoff with jitter, max attempts, a deadline, and one idempotency key per payment.                                                                                                             | Retry policy එක අයිති client එකක්: retry කරන්නේ මොන errors ද, jitter එක්ක backoff, max attempts, deadline එකක්, ගෙවීමකට එක idempotency key එකක්.                                                                                                          |
| How it works      | On a retryable error (timeout, 429, 502, 503, 504) it waits random(0, min(cap, base · 2^attempt)), or as long as Retry-After says, and tries again, up to 4 attempts inside a 10 s deadline. Every attempt of one payment carries the same Idempotency-Key. | Retryable error එකක් (timeout, 429, 502, 503, 504) ආවොත් random(0, min(cap, base · 2^attempt)) කාලයක්, නැත්නම් Retry-After කියන තරම් ඉඳලා ආයෙත් try කරනවා, 10 s deadline එකක් ඇතුළේ attempts 4 දක්වා. එක ගෙවීමක හැම attempt එකකම යන්නේ එකම Idempotency-Key එක. |
| Responsibilities  | Decide which errors are worth retrying; Back off with jitter; Stop at the attempt limit or the deadline; Send the same idempotency key on every attempt                                                                                                     | Retry කරන්න වටින්නේ මොන errors ද කියලා තීරණය කරනවා; Jitter එක්ක back off කරනවා; Attempt සීමාවට හෝ deadline එකට නවතිනවා; හැම attempt එකකම එකම idempotency key එක යවනවා                                                                                     |
| Inputs            | The shopper pressing Pay; Answers and errors from Payments                                                                                                                                                                                                  | Shopper Pay ඔබන එක; Payments එකෙන් එන උත්තර සහ errors                                                                                                                                                                                               |
| Outputs           | Payment requests (and retries) to Payments; A clear message when it gives up                                                                                                                                                                                | Payments ට ගෙවීම් requests (සහ retries); අත්හරිනකොට පැහැදිලි පණිවිඩයක්                                                                                                                                                                                     |
| Examples          | POST /payments {"orderId":1044}                                                                                                                                                                                                                             | POST /payments {"orderId":1044}                                                                                                                                                                                                                   |
| Advantages        | Hides short blips from the shopper                                                                                                                                                                                                                          | කෙටි blips shopper ට පේන්නේ නැති කරනවා                                                                                                                                                                                                               |
| Limitations       | Every retry adds load and delay; Unsafe for payments without an idempotency key                                                                                                                                                                             | හැම retry එකකින්ම load එකයි ප්‍රමාදයයි වැඩි වෙනවා; Idempotency key එකක් නැතුව ගෙවීම් වලට ආරක්ෂිත නැහැ                                                                                                                                                         |
| Technologies      | OkHttp interceptors (Android), URLSession (iOS), TanStack Query in React Native                                                                                                                                                                             |                                                                                                                                                                                                                                                   |

### Payments (payments)

|                   | English                                                                                                                                                                                                                                                                   | සිංහල                                                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                                                                                                                                                                                           | Backend service                                                                                                                                                                                                                                         |
| Simple summary    | The helper on the server that takes the money.                                                                                                                                                                                                                            | Server එකේ සල්ලි ගන්න උදව්කාරයා.                                                                                                                                                                                                                            |
| Like in real life | Like the shop’s till: sometimes it restarts, and you have to wait a moment.                                                                                                                                                                                               | කඩේ cash register එක වගේ: සමහර වෙලාවට restart වෙනවා, ඔබට මොහොතක් ඉන්න වෙනවා.                                                                                                                                                                              |
| What it does      | Charges the card; Says “not now” when it is busy; Never charges the same ticket twice                                                                                                                                                                                     | Card එකෙන් අය කරනවා; කාර්යබහුල නම් “දැන් බැහැ” කියනවා; එකම ticket එකට කවදාවත් දෙපාරක් අය කරන්නේ නැහැ                                                                                                                                                             |
| Talks to          | Shopper A; Shopper B; Shopper C; Payments DB                                                                                                                                                                                                                              | Shopper A; Shopper B; Shopper C; Payments DB                                                                                                                                                                                                            |
| Technical summary | A service that charges cards and records payments. During a deploy it briefly returns 503; it stores idempotency keys with their results.                                                                                                                                 | Cards වලින් අය කරලා ගෙවීම් record කරන service එකක්. Deploy එකකදී කෙටි වෙලාවකට 503 දෙනවා; idempotency keys ඒවායේ results එක්ක save කරනවා.                                                                                                                        |
| How it works      | Each payment runs in one transaction: the charge and its idempotency key are saved together. A request whose key already exists gets the stored result (Idempotent-Replayed: true). When it can’t serve, it answers 503 quickly, with Retry-After when it knows how long. | හැම ගෙවීමක්ම එක transaction එකක: charge එකයි එහි idempotency key එකයි එකට save වෙනවා. Key එක දැනටමත් තියෙන request එකකට save කරපු result එක ලැබෙනවා (Idempotent-Replayed: true). Serve කරන්න බැරි නම් ඉක්මනින් 503 කියනවා, කොච්චර වෙලාවක්ද දන්නවා නම් Retry-After එකත් එක්ක. |
| Responsibilities  | Charge once per idempotency key; Return clear, retryable errors (with Retry-After when it knows); Fail fast instead of retrying its own dependencies at every layer                                                                                                       | Idempotency key එකකට එක පාරයි අය කරන්නේ; පැහැදිලි, retryable errors දෙනවා (දන්නවා නම් Retry-After එක්ක); හැම layer එකකම තමන්ගේ dependencies retry කරනවා වෙනුවට වහාම fail වෙනවා                                                                                   |
| Inputs            | Payment requests from the shoppers’ apps                                                                                                                                                                                                                                  | Shoppers ගේ apps වලින් එන ගෙවීම් requests                                                                                                                                                                                                                   |
| Outputs           | 201 Created, or a 503; Charges and keys in the Payments DB                                                                                                                                                                                                                | 201 Created, නැත්නම් 503; Payments DB එකේ charges සහ keys                                                                                                                                                                                                 |
| Examples          | POST /payments; Idempotency-Key: 7f3a9c2e-…                                                                                                                                                                                                                               | POST /payments; Idempotency-Key: 7f3a9c2e-…                                                                                                                                                                                                             |
| Advantages        | Safe to retry, thanks to idempotency keys                                                                                                                                                                                                                                 | Idempotency keys නිසා retry කරන්න ආරක්ෂිතයි                                                                                                                                                                                                                  |
| Limitations       | Needs capacity headroom for retries; Must store keys (and expire them)                                                                                                                                                                                                    | Retries වලට අමතර capacity ඕනේ; Keys save කරන්න (සහ expire කරන්න) ඕනේ                                                                                                                                                                                      |
| Technologies      | Stripe or Adyen behind it, Spring Boot, Go, Node.js                                                                                                                                                                                                                       |                                                                                                                                                                                                                                                         |

### Payments DB (payments-db)

|                   | English                                                                                                                                   | සිංහල                                                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Database                                                                                                                                  | Database                                                                                                                                      |
| Simple summary    | The notebook where every payment is written down.                                                                                         | හැම ගෙවීමක්ම ලියලා තියන notebook එක.                                                                                                              |
| Like in real life | Like the shop’s receipt book: each ticket number appears only once.                                                                       | කඩේ receipt පොත වගේ: හැම ticket අංකයක්ම තියෙන්නේ එක පාරයි.                                                                                        |
| What it does      | Keeps every charge; Remembers each ticket number and its result                                                                           | හැම charge එකක්ම තියාගන්නවා; හැම ticket අංකයක්ම සහ එහි result එක මතක තියාගන්නවා                                                                      |
| Talks to          | Payments                                                                                                                                  | Payments                                                                                                                                      |
| Technical summary | Stores charges and an idempotency table: key, request fingerprint, stored response and expiry.                                            | Charges සහ idempotency table එකක් තියාගන්නවා: key, request fingerprint, save කරපු response, expiry.                                               |
| How it works      | A unique constraint on the key means two requests with one key can’t both insert a charge. Expired keys are deleted after about 24 hours. | Key එකේ unique constraint එකක් නිසා එක key එකක් තියෙන requests දෙකකට charge දෙකක් insert කරන්න බැහැ. Expire වුණු keys පැය 24කට විතර පස්සේ delete වෙනවා. |
| Responsibilities  | Store charges; Store idempotency keys with their responses; Enforce one row per key                                                       | Charges save කරනවා; Idempotency keys ඒවායේ responses එක්ක save කරනවා; Key එකකට එක row එකයි කියන එක බලාගන්නවා                                      |
| Inputs            | Inserts and lookups from Payments                                                                                                         | Payments එකෙන් එන inserts සහ lookups                                                                                                           |
| Outputs           | Saved rows; Stored responses for repeated keys                                                                                            | Save වුණු rows; නැවත එන keys වලට save කරපු responses                                                                                             |
| Examples          | SELECT response FROM idempotency_keys WHERE key = '7f3a…'                                                                                 | SELECT response FROM idempotency_keys WHERE key = '7f3a…'                                                                                     |
| Advantages        | The single source of truth for “was this charged?”                                                                                        | “මේක අය කළාද?” කියන එකට තියෙන එකම සත්‍ය මූලාශ්‍රය                                                                                                  |
| Limitations       | Under overload, retried queries pile up on it                                                                                             | Overload වෙලා ඉන්නකොට retry කරපු queries එය උඩ ගොඩ ගැහෙනවා                                                                                      |
| Technologies      | PostgreSQL, MySQL, DynamoDB (conditional writes)                                                                                          |                                                                                                                                               |

## Words to know

| Term                    | English                                                                                                     | සිංහල                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| At-least-once           | What retries give you: the request is sure to be processed, but maybe more than once.                       | Retries වලින් ලැබෙන දේ: request එක process වෙනවා කියන එක ස්ථිරයි, ඒත් එක පාරකට වඩා වෙන්න පුළුවන්.                        |
| Base delay              | The first wait in a backoff schedule; later waits are multiples of it.                                      | Backoff schedule එකක පළවෙනි wait එක; පස්සේ එන waits ඒකේ ගුණාකාර.                                                 |
| Cap                     | The longest a backoff wait may grow, e.g. 30 s.                                                             | Backoff wait එකකට වැඩි වෙන්න පුළුවන් උපරිම කාලය, උදා. 30 s.                                                         |
| Circuit breaker         | A guard that stops calling a failing service for a while, so calls fail fast instead of piling up.          | අසාර්ථක වෙන service එකකට ටික වෙලාවකට call කරන එක නවත්වන ආරක්ෂකයෙක්, ඒ නිසා calls ගොඩ ගැහෙනවා වෙනුවට වහාම fail වෙනවා. |
| Deadline                | The latest time an operation may finish, retries included. Each attempt’s timeout must fit in what is left. | Retries එක්කම operation එකක් ඉවර වෙන්න ඕනේ අන්තිම වෙලාව. හැම attempt එකකම timeout එක ඉතුරු කාලය ඇතුළේ තියෙන්න ඕනේ.      |
| Exactly-once effect     | A request may be delivered more than once, but its effect (the charge) happens only once.                   | Request එක එක පාරකට වඩා ලැබෙන්න පුළුවන්, ඒත් එහි බලපෑම (charge එක) වෙන්නේ එක පාරයි.                                   |
| Exponential backoff     | Waiting longer after each failure, doubling every time: 1 s, 2 s, 4 s, …                                    | හැම failure එකකටම පස්සේ වැඩියෙන් ඉන්න එක, හැම පාරම දෙගුණයක්: 1 s, 2 s, 4 s, …                                       |
| Fail fast               | Returning an error straight away instead of waiting or retrying, so the caller can decide.                  | බලන් ඉන්නවා හෝ retry කරනවා වෙනුවට වහාම error එකක් දෙන එක, ඒ නිසා caller ට තීරණය කරන්න පුළුවන්.                          |
| Full jitter             | Waiting a random time between zero and the backoff: random(0, min(cap, base · 2^n)).                        | බිංදුවත් backoff එකත් අතර random කාලයක් ඉන්න එක: random(0, min(cap, base · 2^n)).                                   |
| Idempotent              | Doing it twice has the same effect as doing it once.                                                        | දෙපාරක් කළාම එක පාරක් කළා වගේම බලපෑමයි.                                                                          |
| Idempotency key         | A unique id the client sends with an operation (and every retry of it), so the server does it only once.    | Client එක operation එකක් එක්ක (සහ එහි හැම retry එකක් එක්කම) යවන unique id එකක්, ඒ නිසා server එක ඒක කරන්නේ එක පාරයි.   |
| Idempotent methods      | HTTP methods defined as idempotent: GET, HEAD, PUT, DELETE (not POST or PATCH).                             | Idempotent කියලා define කරපු HTTP methods: GET, HEAD, PUT, DELETE (POST හෝ PATCH නෙවෙයි).                        |
| Jitter                  | Randomness added to retry waits, so clients that failed together spread out.                                | Retry waits වලට එකතු කරන randomness, ඒ නිසා එකට අසාර්ථක වුණු clients විසිරෙනවා.                                      |
| Load amplification      | One user action turning into many requests, e.g. because of retries.                                        | එක user ක්‍රියාවක් requests ගොඩකට හැරෙන එක, උදා. retries නිසා.                                                    |
| Max attempts            | The most times an operation is tried, the first try included.                                               | Operation එකක් try කරන උපරිම වාර ගණන, පළවෙනි try එකත් එක්කම.                                                       |
| Metastable failure      | A system that stays overloaded after the cause has gone, kept down by its own retries.                      | හේතුව නැති වුණාට පස්සෙත්, තමන්ගේම retries නිසා overload වෙලාම ඉන්න system එකක්.                                        |
| Permanent failure       | An error that happens every time (a bad request, a missing item): don’t retry it.                           | හැම පාරම වෙන error එකක් (වැරදි request එකක්, නැති item එකක්): ඒක retry කරන්න එපා.                                   |
| Retry                   | Sending the same request again after it failed.                                                             | අසාර්ථක වුණු request එකම ආයෙත් යැවීම.                                                                              |
| Retry-After             | An HTTP header (sent with 503 or 429) telling the client how long to wait: seconds or a date.               | Client ට කොච්චර ඉන්න ඕනෙද කියන HTTP header එකක් (503 හෝ 429 එක්ක එනවා): තත්පර හෝ date එකක්.                          |
| Retry budget            | A limit on retries as a share of all requests, e.g. at most 10%.                                            | මුළු requests වලින් retries වලට දෙන සීමාව, උදා. උපරිම 10%.                                                          |
| Retry storm             | Many clients retrying at once, multiplying the load on a service that is already struggling.                | Clients ගොඩක් එකපාර retry කරලා, දැනටමත් අමාරුවෙන් ඉන්න service එකක load එක ගුණ කරන එක.                              |
| Retryable error         | An error that might not happen next time: a timeout, 429, 502, 503 or 504.                                  | ඊළඟ පාර නොවෙන්න පුළුවන් error එකක්: timeout, 429, 502, 503 හෝ 504.                                                 |
| 503 Service Unavailable | The server can’t handle the request right now, usually for a short time.                                    | Server එකට දැන් request එක handle කරන්න බැහැ, සාමාන්‍යයෙන් කෙටි කාලයකට.                                            |
| Thundering herd         | Many clients waking up and hitting a service at the same moment.                                            | Clients ගොඩක් එකම මොහොතේ අවදි වෙලා service එකකට එකපාර එන එක.                                                    |
| Transient failure       | A failure that goes away by itself, usually within seconds.                                                 | තනියම නැති වෙන failure එකක්, සාමාන්‍යයෙන් තත්පර කිහිපයකින්.                                                             |

## Message captions

| Message       | English                                    | සිංහල                                          |
| ------------- | ------------------------------------------ | --------------------------------------------- |
| pay-a         | Shopper A pays for order 1042              | Shopper A order 1042 ට ගෙවනවා                 |
| pay-b         | Shopper B pays for order 1043              | Shopper B order 1043 ට ගෙවනවා                 |
| pay-c         | Shopper C pays for order 1044              | Shopper C order 1044 ට ගෙවනවා                 |
| charge-a      | Payments records the charge for order 1042 | Payments order 1042 ගේ charge එක record කරනවා |
| charge-b      | Payments records the charge for order 1043 | Payments order 1043 ගේ charge එක record කරනවා |
| charge-c      | Payments records the charge for order 1044 | Payments order 1044 ගේ charge එක record කරනවා |
| charged-a     | The charge is saved                        | Charge එක save වුණා                            |
| charged-b     | The charge is saved                        | Charge එක save වුණා                            |
| charged-c     | The charge is saved                        | Charge එක save වුණා                            |
| created-a     | Payment succeeded                          | ගෙවීම සාර්ථකයි                                   |
| created-b     | Payment succeeded                          | ගෙවීම සාර්ථකයි                                   |
| created-c     | Payment succeeded                          | ගෙවීම සාර්ථකයි                                   |
| unavailable   | 503: not now, try again shortly            | 503: දැන් බැහැ, ටිකකින් ආයෙත් try කරන්න             |
| retry-after   | 503, with “come back in 5 seconds”         | “තත්පර 5කින් එන්න” කියන 503                        |
| gave-up       | Shopper A stops after four attempts        | Shopper A attempts හතරකට පස්සේ නවතිනවා          |
| lost-response | “Payment succeeded”, lost on the way back  | “ගෙවීම සාර්ථකයි”, ආපහු එන පාරේ නැති වුණා            |
| charge-again  | The same payment, charged again            | එකම ගෙවීම, ආයෙත් අය කරනවා                       |
| charged-again | A second charge is saved                   | දෙවෙනි charge එකක් save වුණා                     |
| created-again | “Payment succeeded”, again                 | “ගෙවීම සාර්ථකයි”, ආයෙත්                           |
| keyed-request | The payment, with an idempotency key       | Idempotency key එකක් එක්ක ගෙවීම                  |
| keyed-retry   | The retry, with the same key               | එකම key එක එක්ක retry එක                       |
| store-key     | The charge and its key, saved together     | Charge එකයි එහි key එකයි එකට save කරනවා          |
| key-stored    | Charge and key saved                       | Charge එකයි key එකයි save වුණා                   |
| key-lookup    | Payments looks the key up                  | Payments key එක හොයනවා                        |
| key-found     | Key found: here is the first result        | Key එක හම්බුණා: මෙන්න පළවෙනි result එක            |
| replayed      | The first result again, no new charge      | පළවෙනි result එකම ආයෙත්, අලුත් charge එකක් නැහැ    |
| db-timeout    | The database doesn’t answer in time        | Database එක වෙලාවට උත්තර දෙන්නේ නැහැ            |

## Scene badges

`{count}` is replaced by a number in the scene.

| Badge         | English                     | සිංහල                        |
| ------------- | --------------------------- | --------------------------- |
| restarting    | restarting                  | restart වෙනවා               |
| ready         | ready                       | ලෑස්තියි                       |
| failed        | {count} · failed            | {count} · අසාර්ථකයි           |
| retry-2       | attempt 2 · wait 1 s        | attempt 2 · 1 s ඉන්න         |
| retry-3       | attempt 3 · wait 2 s        | attempt 3 · 2 s ඉන්න         |
| retry-4       | attempt 4 · wait 4 s        | attempt 4 · 4 s ඉන්න         |
| paid-on       | attempt {count} · paid      | attempt {count} · ගෙව්වා     |
| paid          | paid                        | ගෙව්වා                       |
| no-wait       | attempt {count} · no wait   | attempt {count} · ඉන්නේ නැහැ |
| load          | {count} req/s · capacity 10 | {count} req/s · capacity 10 |
| together      | 3 retries at once           | retries 3ම එකපාර            |
| wait-ms       | wait {count} ms             | {count} ms ඉන්න              |
| one-at-a-time | 1 at a time                 | එකින් එක                      |
| deploy-failed | deploy failed               | deploy එක අසාර්ථකයි           |
| gave-up       | gave up after 4 tries       | tries 4කින් පස්සේ නැවැත්තුවා     |
| timed-out     | no answer · timed out       | උත්තරයක් නැහැ · timeout       |
| charged-once  | charged once                | එක පාරයි අය කළේ              |
| charged-twice | charged twice               | දෙපාරක් අය කළා               |
| replayed      | same key · first answer     | එකම key · පළවෙනි උත්තරය       |
| server-wait   | wait 5 s · server said      | 5 s ඉන්න · server කිව්වා       |
| overloaded    | overloaded                  | overload වෙලා               |
| queries       | {count} queries · 1 tap     | queries {count} · tap 1     |
| fails-fast    | fails fast                  | වහාම fail වෙනවා             |

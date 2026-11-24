# Circuit Breaker module text (English and Sinhala)

- **Generated** by `npm run docs:module-text` from
  `src/content/modules/circuit-breaker/text/`. Edit the TypeScript files, not this document.
- **Beginner** is written as if for a five-year-old, with an everyday example.
  **Advanced** keeps the technical depth and adds a worked example.
- **Sinhala** uses a friendly spoken style; technical terms stay in English.
- The learning objectives and scene notes are in
  [circuit-breaker.md](circuit-breaker.md).

---

## Main path

## When a service gets slow · Service එකක් හෙමින් වුණාම

### 1. A healthy chain · හොඳින් වැඩ කරන දාමයක්

**Watch:** A request goes from the browser through Orders and the breaker to Payments and its database, and the answers come straight back.

**බලන්න:** Request එකක් browser එකේ ඉඳන් Orders සහ breaker එක හරහා Payments සහ එහි database එකට යනවා, උත්තර කෙලින්ම ආපහු එනවා.

#### Beginner

**In simple words**

When you open “My orders”, the Orders service makes your list. But it doesn’t know if each order is paid, so it asks the Payments service. Payments looks in its notebook, the database, and answers.

All of this takes less time than a blink.

**Like in real life**

A waiter takes your order and asks the kitchen: “Is the soup ready?” The kitchen answers straight away, and the waiter tells you.

**සරලව කිව්වොත්**

ඔබ “My orders” open කරනකොට Orders service එක ඔබේ ලැයිස්තුව හදනවා. ඒත් එක එක order එකට ගෙවලා තියෙනවද කියලා ඒක දන්නේ නැහැ, ඒ නිසා Payments service එකෙන් අහනවා. Payments තමන්ගේ පොත, ඒ කියන්නේ database එක, බලලා උත්තර දෙනවා.

මේ ඔක්කොම වෙන්නේ ඇහැ පිල්ලමක් ගහන්නත් කලින්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Waiter කෙනෙක් ඔබේ order එක අරගෙන කුස්සියෙන් අහනවා: “සුප් එක ලෑස්තිද?” කුස්සිය එකපාරටම උත්තර දෙනවා, waiter ඔබට කියනවා.

#### Advanced

**How it works**

Orders calls Payments synchronously while it builds its response: one request, one HTTP call downstream, and a database query behind that. In a healthy system the whole chain takes about 60 ms, and one of Orders’ threads is busy for all of it.

The circuit breaker sits around that call, in Orders’ code. Right now it is closed: it only watches, recording each call’s result and duration. (The API gateway from the previous module is still in front of Orders; it is left out to keep the picture small.)

**Example**

_The call and its answer_

```http
GET /payments?orderIds=1042,1043 HTTP/1.1   →   200 OK in 38 ms
[{"orderId":1042,"status":"paid"},{"orderId":1043,"status":"pending"}]
```

**මෙය වැඩ කරන හැටි**

Orders තමන්ගේ response එක හදන ගමන් Payments වෙත synchronous call එකක් කරනවා: එක request එකක්, පහළට එක HTTP call එකක්, ඒ පිටිපස්සේ database query එකක්. හොඳින් වැඩ කරන system එකක මේ මුළු දාමයටම 60 ms විතර යනවා, ඒ කාලය පුරාම Orders එකේ එක thread එකක් කාර්යබහුලයි.

Circuit breaker එක තියෙන්නේ ඒ call එක වටේ, Orders එකේ code එක ඇතුළේ. දැන් එය closed: එය බලාගෙන ඉඳලා හැම call එකකම ප්‍රතිඵලය සහ කාලය සටහන් කරනවා විතරයි. (කලින් module එකේ API gateway එක තවමත් Orders ඉස්සරහ තියෙනවා; චිත්‍රය පොඩියට තියාගන්න ඒක පෙන්නන්නේ නැහැ.)

**උදාහරණය**

_Call එක සහ එහි උත්තරය_

```http
GET /payments?orderIds=1042,1043 HTTP/1.1   →   200 OK in 38 ms
[{"orderId":1042,"status":"paid"},{"orderId":1043,"status":"pending"}]
```

_Words to know:_ Dependency, Synchronous call, Circuit breaker · _Message:_ Orders asks Payments

---

### 2. One slow service, everyone waits · එක service එකක් හෙමින්, හැමෝම බලාගෙන

**Watch:** The database turns amber. Requests reach Payments but no answers come back, and Orders’ busy-threads badge climbs.

**බලන්න:** Database එක amber පාට වෙනවා. Requests Payments වෙත යනවා, ඒත් උත්තර එන්නේ නැහැ, Orders එකේ busy threads badge එක වැඩි වෙනවා.

#### Beginner

**In simple words**

Today the Payments notebook is very slow. Payments asks it, and waits, and waits. Orders asks Payments, and waits too.

More people open “My orders”, so more and more of Orders’ helpers are stuck waiting. Soon Orders has no free helpers left, even for people who don’t need Payments at all.

**Like in real life**

The kitchen stops answering. Every waiter who asks stands at the kitchen door, waiting. After a while no waiter is left to take new orders, and the whole restaurant stops, even though only the kitchen has a problem.

**සරලව කිව්වොත්**

අද Payments එකේ පොත ගොඩක් හෙමින්. Payments ඒකෙන් අහනවා, බලාගෙන ඉන්නවා, තව බලාගෙන ඉන්නවා. Orders Payments එකෙන් අහලා ඒකත් බලාගෙන ඉන්නවා.

තව තව අය “My orders” open කරනවා, ඒ නිසා Orders එකේ උදව්කාරයෝ තව තව බලාගෙන හිරවෙනවා. ටික වෙලාවකින් Orders එකට නිදහස් උදව්කාරයෙක්වත් නැහැ, Payments ඕන නැති අයටත්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කුස්සිය උත්තර දෙන එක නවත්වනවා. අහන්න යන හැම waiter කෙනෙක්ම කුස්සියේ දොර ළඟ බලාගෙන ඉන්නවා. ටික වෙලාවකින් අලුත් orders ගන්න waiter කෙනෙක්වත් ඉතුරු නැහැ, ප්‍රශ්නය තියෙන්නේ කුස්සියේ විතරක් වුණත් මුළු restaurant එකම නවතිනවා.

#### Advanced

**How it works**

This is how a cascading failure starts. Each call to Payments holds one of Orders’ threads (or connections, or event-loop slots) until it returns. When Payments slows from 40 ms to 10 s, the number of calls in flight grows by the same factor (Little’s law). Orders has 50 threads; requests that never touch Payments start failing too.

A 2 s timeout helps: each stuck call now holds a thread for 2 s instead of 10. But Orders still pays 2 s for every call it could already guess will fail, and it keeps sending load to a service that is struggling.

**Example**

_Threads busy waiting for Payments_

```
in flight = arrival rate × time per call     (Little's law)
healthy:   20 req/s × 0.04 s =   0.8 threads busy
timeout:   20 req/s × 2 s    =  40   threads busy   (of 50)
no limit:  20 req/s × 10 s   = 200   threads needed (of 50)
```

**මෙය වැඩ කරන හැටි**

Cascading failure එකක් පටන් ගන්නේ මෙහෙමයි. Payments වෙත යන හැම call එකක්ම ඒක ආපහු එනකම් Orders එකේ එක thread එකක් (හෝ connection එකක්, event-loop slot එකක්) අල්ලගෙන ඉන්නවා. Payments 40 ms ඉඳන් 10 s දක්වා හෙමින් වුණාම, එකවර යන calls ගණනත් ඒ ප්‍රමාණයෙන්ම වැඩි වෙනවා (Little’s law). Orders එකට තියෙන්නේ threads 50යි; Payments ස්පර්ශ නොකරන requests පවා fail වෙන්න පටන් ගන්නවා.

2 s timeout එකක් උදව් වෙනවා: දැන් හිරවුණු call එකක් thread එකක් අල්ලගෙන ඉන්නේ තත්පර 10ක් නෙවෙයි, 2යි. ඒත් fail වෙනවා කියලා අනුමාන කරන්න පුළුවන් හැම call එකකටම Orders තවමත් තත්පර 2ක් ගෙවනවා, අමාරුවෙන් ඉන්න service එකට load එක යවනවා.

**උදාහරණය**

_Payments වෙනුවෙන් බලාගෙන ඉන්න threads_

```
in flight = arrival rate × time per call     (Little's law)
healthy:   20 req/s × 0.04 s =   0.8 threads busy
timeout:   20 req/s × 2 s    =  40   threads busy   (of 50)
no limit:  20 req/s × 10 s   = 200   threads needed (of 50)
```

_Words to know:_ Cascading failure, Thread pool, Timeout, Little’s law · _Message:_ Orders asks Payments

---

## The breaker · Breaker එක

### 3. Meet the circuit breaker · Circuit breaker එක හඳුනාගනිමු

**Watch:** The breaker’s “closed” lamp flashes. One call passes straight through it on its way to Payments.

**බලන්න:** Breaker එකේ “closed” lamp එක දැල්වෙනවා. එක call එකක් ඒක හරහා කෙලින්ම Payments වෙත යනවා.

#### Beginner

**In simple words**

The circuit breaker is a small guard between Orders and Payments. It watches every call. As long as Payments answers well, it lets everything through.

That is called closed: like a closed switch, the calls flow through.

**Like in real life**

The fuse box in your house. Normally the electricity flows. If something goes wrong too many times, it switches off to keep the house safe.

**සරලව කිව්වොත්**

Circuit breaker එක Orders සහ Payments අතර ඉන්න පොඩි ආරක්ෂකයෙක්. එය හැම call එකක්ම බලනවා. Payments හොඳට උත්තර දෙනකම් එය හැම දෙයක්ම යන්න දෙනවා.

ඒකට කියන්නේ closed කියලා: වහපු switch එකක් වගේ, calls හරහා යනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබේ ගෙදර fuse box එක. සාමාන්‍යයෙන් විදුලිය ගලනවා. මොකක් හරි ආයෙ ආයෙත් වැරදුනොත්, ගෙදර ආරක්ෂා කරන්න ඒක off වෙනවා.

#### Advanced

**How it works**

A circuit breaker wraps the calls to one dependency and keeps a small state machine:

- **Closed:** calls pass through; their results are counted.
- **Open:** calls fail at once, without being tried.
- **Half-open:** a few trial calls test whether the dependency has recovered.

It lives in the caller, usually as a library around the HTTP client, with one breaker per dependency (or per endpoint). Here it is drawn as its own box so you can see its state.

**Example**

_The breaker’s settings in resilience4j (Java)_

```
slidingWindowType=COUNT_BASED   slidingWindowSize=5   minimumNumberOfCalls=5
failureRateThreshold=100        slowCallRateThreshold=100   slowCallDurationThreshold=2s
waitDurationInOpenState=30s     permittedNumberOfCallsInHalfOpenState=1
```

**මෙය වැඩ කරන හැටි**

Circuit breaker එකක් එක dependency එකකට යන calls වටේ තියෙනවා, ඒ වගේම පොඩි state machine එකක් තියාගන්නවා:

- **Closed:** calls යනවා; ඒවායේ ප්‍රතිඵල ගණන් කරනවා.
- **Open:** calls උත්සාහ නොකර එකපාරටම fail වෙනවා.
- **Half-open:** dependency එක සනීප වෙලාද කියලා trial calls කිහිපයකින් බලනවා.

එය ජීවත් වෙන්නේ caller එක ඇතුළේ, සාමාන්‍යයෙන් HTTP client එක වටේ library එකක් විදිහට, එක dependency එකකට (හෝ endpoint එකකට) එක breaker එක බැගින්. මෙතන එහි state එක පේන්න ඒක වෙනම box එකක් විදිහට ඇඳලා තියෙනවා.

**උදාහරණය**

_resilience4j (Java) වල breaker එකේ settings_

```
slidingWindowType=COUNT_BASED   slidingWindowSize=5   minimumNumberOfCalls=5
failureRateThreshold=100        slowCallRateThreshold=100   slowCallDurationThreshold=2s
waitDurationInOpenState=30s     permittedNumberOfCallsInHalfOpenState=1
```

_Words to know:_ Closed state, Open state, Half-open state · _Message:_ Orders asks Payments

---

### 4. Failures add up · Failures එකතු වෙනවා

**Watch:** Five calls go to Payments. Each one times out and comes back as a rose error, and the breaker’s badge counts 1 of 5 … 5 of 5.

**බලන්න:** Calls පහක් Payments වෙත යනවා. හැම එකක්ම timeout වෙලා rose පාට error එකක් විදිහට ආපහු එනවා, breaker එකේ badge එක 1 of 5 … 5 of 5 ගණන් කරනවා.

#### Beginner

**In simple words**

Payments is still slow. Each time Orders asks, it gives up after two seconds and comes back with “no answer”.

The guard keeps count: one failure, two, three, four, five.

**Like in real life**

You call a friend and nobody picks up. You try again. And again. After five tries you stop and think: “They’re busy. I’ll call later.”

**සරලව කිව්වොත්**

Payments තවමත් හෙමින්. Orders අහන හැම වෙලාවකම තත්පර දෙකකින් අත්හැරලා “උත්තරයක් නැහැ” කියලා ආපහු එනවා.

ආරක්ෂකයා ගණන් කරනවා: එක failure එකක්, දෙකක්, තුනක්, හතරක්, පහක්.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ යාළුවෙකුට call කරනවා, කවුරුත් answer කරන්නේ නැහැ. ආයෙත් try කරනවා. ආයෙත්. පස් පාරක් try කරලා ඔබ නවතිලා හිතනවා: “එයා busy. පස්සේ කතා කරන්නම්.”

#### Advanced

**How it works**

The breaker records each outcome. A call counts as a failure if it throws, returns an error the policy counts (a 5xx, a refused connection) or takes longer than the slow-call threshold. 4xx answers usually do not count: they are the caller’s mistake, not a sick dependency.

Real breakers rarely use “5 in a row”. They use a failure rate over a sliding window, for example 50 % of the last 20 calls once at least 10 were made, so one unlucky call in a busy minute doesn’t trip it. The scene uses 5 in a row to keep the counting visible.

**Example**

_A count-based window of the last 10 calls_

```
✓ ✓ ✗ ✓ ✗ ✗ ✓ ✗ ✗ ✗   →   6 of 10 failed = 60 %  ≥ 50 %   →   trip
```

**මෙය වැඩ කරන හැටි**

Breaker එක හැම ප්‍රතිඵලයක්ම සටහන් කරනවා. Call එකක් failure එකක් ලෙස ගණන් ගන්නේ එය exception එකක් දැම්මොත්, policy එක ගණන් ගන්න error එකක් දුන්නොත් (5xx, refused connection) හෝ slow-call සීමාවට වඩා වැඩි කාලයක් ගත්තොත්. 4xx උත්තර සාමාන්‍යයෙන් ගණන් ගන්නේ නැහැ: ඒවා caller එකේ වැරදි, ලෙඩ වෙච්ච dependency එකක ලකුණු නෙවෙයි.

සැබෑ breakers “දිගටම 5ක්” පාවිච්චි කරන්නේ කලාතුරකින්. ඒවා sliding window එකක් පුරා failure rate එකක් පාවිච්චි කරනවා, උදාහරණයක් විදිහට අවම වශයෙන් calls 10ක් ගිහින් තියෙනකොට අන්තිම calls 20න් 50%ක්, ඒ නිසා busy විනාඩියක එක අවාසනාවන්ත call එකකින් ඒක trip වෙන්නේ නැහැ. ගණන් කිරීම පේන්න scene එක “දිගටම 5ක්” පාවිච්චි කරනවා.

**උදාහරණය**

_අන්තිම calls 10ක count-based window එකක්_

```
✓ ✓ ✗ ✓ ✗ ✗ ✓ ✗ ✗ ✗   →   6 of 10 failed = 60 %  ≥ 50 %   →   trip
```

_Words to know:_ Failure threshold, Sliding window, Slow call · _Message:_ No answer in time

---

### 5. The breaker trips · Breaker එක trip වෙනවා

**Watch:** The breaker’s “open” lamp flashes and it turns rose: “open · 30 s”.

**බලන්න:** Breaker එකේ “open” lamp එක දැල්වෙලා එය rose පාට වෙනවා: “open · 30 s”.

#### Beginner

**In simple words**

Five failures! The guard decides: “Payments is not well. Let’s stop asking for a while.”

It opens: no more calls go to Payments for 30 seconds.

**Like in real life**

The fuse switches off. The lights go out in one room, but the rest of the house is safe, and nothing burns.

**සරලව කිව්වොත්**

Failures පහක්! ආරක්ෂකයා තීරණය කරනවා: “Payments හොඳ තත්වයේ නැහැ. ටික වෙලාවකට අහන එක නවත්වමු.”

එය open වෙනවා: තත්පර 30ක් Payments වෙත කිසිම call එකක් යන්නේ නැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Fuse එක off වෙනවා. එක කාමරයක ලයිට් නිවෙනවා, ඒත් ගෙදර ඉතුරු ටික ආරක්ෂිතයි, කිසිම දෙයක් පිච්චෙන්නේ නැහැ.

#### Advanced

**How it works**

The failure threshold was reached, so the breaker moves from closed to open and starts its wait timer (30 s here).

The transition is an event worth logging and alerting on: it is the clearest signal that a dependency is unhealthy, and it often fires before any dashboard shows a problem.

**Example**

_The log line and the metric_

```
12:04:17.302 WARN CircuitBreaker 'payments' changed state from CLOSED to OPEN
             (failure rate 100.0 %, 5 of 5 calls)
resilience4j_circuitbreaker_state{name="payments",state="open"} 1
```

**මෙය වැඩ කරන හැටි**

Failure threshold එකට ආවා, ඒ නිසා breaker එක closed ඉඳන් open වෙලා තමන්ගේ wait timer එක පටන් ගන්නවා (මෙතන 30 s).

මේ මාරුව log කරන්නත් alert කරන්නත් වටින event එකක්: dependency එකක් ලෙඩ කියන එකට තියෙන පැහැදිලිම ලකුණ එයයි, ගොඩක් වෙලාවට dashboard එකක ප්‍රශ්නයක් පේන්නත් කලින් එය වෙනවා.

**උදාහරණය**

_Log line එක සහ metric එක_

```
12:04:17.302 WARN CircuitBreaker 'payments' changed state from CLOSED to OPEN
             (failure rate 100.0 %, 5 of 5 calls)
resilience4j_circuitbreaker_state{name="payments",state="open"} 1
```

_Words to know:_ Trip, Wait duration

---

### 6. Failing fast, with a fallback · ඉක්මනින් fail වෙන එක, fallback එකක් එක්ක

**Watch:** New calls stop at the breaker and bounce straight back. Orders answers the browser at once, and its busy-threads badge drops.

**බලන්න:** අලුත් calls breaker එක ළඟ නැවතිලා කෙලින්ම ආපහු එනවා. Orders එකපාරටම browser එකට උත්තර දෙනවා, එහි busy threads badge එක අඩු වෙනවා.

#### Beginner

**In simple words**

Now when Orders asks, the guard answers right away: “Payments is resting, don’t wait.” So Orders doesn’t get stuck.

It shows your orders anyway, and says “payment status: we’ll check again soon”. And Payments gets some quiet time to get better.

**Like in real life**

The waiter knows the kitchen is in trouble, so he doesn’t go and wait at its door. He tells you: “The soup will take a while. Can I bring you some bread now?”

**සරලව කිව්වොත්**

දැන් Orders අහනකොට ආරක්ෂකයා එකපාරටම උත්තර දෙනවා: “Payments විවේක ගන්නවා, බලාගෙන ඉන්න එපා.” ඒ නිසා Orders හිරවෙන්නේ නැහැ.

ඒක කොහොමත් ඔබේ orders පෙන්නනවා, “payment status: ඉක්මනින් ආයෙ බලනවා” කියලා කියනවා. Payments එකටත් සනීප වෙන්න නිස්කලංක වෙලාවක් ලැබෙනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කුස්සියේ ප්‍රශ්නයක් තියෙනවා කියලා waiter දන්නවා, ඒ නිසා එයා කුස්සියේ දොර ළඟ බලාගෙන ඉන්න යන්නේ නැහැ. එයා ඔබට කියනවා: “සුප් එකට ටික වෙලාවක් යයි. දැන් පාන් ටිකක් ගෙනත් දෙන්නද?”

#### Advanced

**How it works**

While open, the breaker rejects calls immediately (CallNotPermittedException), in microseconds instead of a 2 s timeout. That frees Orders’ threads, keeps its latency low and takes the load off Payments, which helps it recover.

A fallback turns the fast failure into a useful answer. Options, best first:

- Cached or last-known data
- A safe default (“unknown”)
- A smaller feature (hide the payment column)
- An honest error

A fallback must be cheap, and must never call the failing dependency again.

**Example**

_Orders’ answer during the outage_

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"orders":[{"id":1042,"paymentStatus":"unknown"},{"id":1043,"paymentStatus":"unknown"}],
 "degraded":["payments"]}
```

**මෙය වැඩ කරන හැටි**

Open වෙලා ඉන්නකොට breaker එක calls එකපාරටම reject කරනවා (CallNotPermittedException), 2 s timeout එකක් වෙනුවට microseconds වලින්. ඒකෙන් Orders එකේ threads නිදහස් වෙනවා, එහි latency එක අඩුවෙන් තියෙනවා, Payments එකෙන් load එක අයින් වෙනවා, ඒක සනීප වෙන්න උදව් වෙනවා.

Fallback එකකින් ඉක්මන් failure එක ප්‍රයෝජනවත් උත්තරයක් බවට පත් කරනවා. විකල්ප, හොඳම එකේ ඉඳන්:

- Cache කරපු හෝ අන්තිමට දැනගත්ත data
- ආරක්ෂිත default එකක් (“unknown”)
- පොඩි කරපු feature එකක් (payment column එක හංගනවා)
- අවංක error එකක්

Fallback එකක් ලාභ වෙන්න ඕන, fail වෙන dependency එකට ආයෙ කවදාවත් call කරන්න හොඳ නැහැ.

**උදාහරණය**

_ප්‍රශ්නය තියෙන අතරේ Orders දෙන උත්තරය_

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"orders":[{"id":1042,"paymentStatus":"unknown"},{"id":1043,"paymentStatus":"unknown"}],
 "degraded":["payments"]}
```

_Words to know:_ Fail fast, Fallback, Graceful degradation · _Message:_ Orders answers with the fallback

---

## Recovery · සනීප වීම

### 7. Half-open: one careful try · Half-open: පරිස්සමෙන් එක try එකක්

**Watch:** The breaker counts down from 30 s, its “half-open” lamp flashes, and exactly one call goes through to Payments, which answers quickly.

**බලන්න:** Breaker එක 30 s ඉඳන් පහළට ගණන් කරනවා, එහි “half-open” lamp එක දැල්වෙනවා, හරියටම එක call එකක් Payments වෙත යනවා, ඒක ඉක්මනින් උත්තර දෙනවා.

#### Beginner

**In simple words**

After 30 seconds the guard thinks: “Maybe Payments feels better now. Let’s try once.” It lets one call through, and only one.

This is half-open: the door is open just a crack.

**Like in real life**

After a fuse trips, you switch it back on carefully and watch. You don’t plug everything in at once.

**සරලව කිව්වොත්**

තත්පර 30කට පස්සේ ආරක්ෂකයා හිතනවා: “සමහර විට Payments දැන් හොඳයි. එක පාරක් try කරලා බලමු.” එය එක call එකක් යන්න දෙනවා, එකක් විතරයි.

මේ තමයි half-open: දොර ටිකක් විතරක් ඇරලා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Fuse එකක් off වුණාට පස්සේ ඔබ ඒක පරිස්සමෙන් ආයෙ on කරලා බලාගෙන ඉන්නවා. ඔක්කොම එකපාරට plug කරන්නේ නැහැ.

#### Advanced

**How it works**

When the wait is over, the breaker moves to half-open and permits a small number of trial calls (1 here, often 3–10). Their results decide: if they succeed, it closes; if one fails, it opens again with a fresh timer.

Limiting the trials matters: a service that has just recovered often falls over again if it suddenly gets all of its traffic back.

**Example**

_The timeline_

```
12:04:17  CLOSED → OPEN        5 of 5 calls failed
12:04:47  OPEN → HALF_OPEN     wait of 30 s over, 1 trial call permitted
12:04:47  trial call           200 OK in 45 ms
12:04:47  HALF_OPEN → CLOSED   window reset
```

**මෙය වැඩ කරන හැටි**

Wait එක ඉවර වුණාම breaker එක half-open වෙලා trial calls කීපයකට ඉඩ දෙනවා (මෙතන 1යි, ගොඩක් වෙලාවට 3–10). ඒවායේ ප්‍රතිඵල තීරණය කරනවා: සාර්ථක නම් ඒක close වෙනවා; එකක් fail වුණොත් අලුත් timer එකක් එක්ක ආයෙ open වෙනවා.

Trials සීමා කරන එක වැදගත්: දැන් සනීප වෙච්ච service එකකට එකපාරටම එහි මුළු traffic එකම ආපහු ආවොත් ගොඩක් වෙලාවට ඒක ආයෙ වැටෙනවා.

**උදාහරණය**

_කාල රේඛාව_

```
12:04:17  CLOSED → OPEN        5 of 5 calls failed
12:04:47  OPEN → HALF_OPEN     wait of 30 s over, 1 trial call permitted
12:04:47  trial call           200 OK in 45 ms
12:04:47  HALF_OPEN → CLOSED   window reset
```

_Words to know:_ Trial call, Probe · _Message:_ Payments answers

---

### 8. Closed again · ආයෙත් closed

**Watch:** The “closed” lamp flashes and requests flow through the whole chain again. Then the three lamps flash in turn: closed, open, half-open, closed.

**බලන්න:** “closed” lamp එක දැල්වෙලා requests ආයෙත් මුළු දාමය හරහාම යනවා. ඊට පස්සේ lamps තුන වාරෙන් වාරෙට දැල්වෙනවා: closed, open, half-open, closed.

#### Beginner

**In simple words**

The try worked! Payments is better. The guard closes again, and everything flows like before. It starts counting from zero, and keeps watching.

The guard has three moods: closed (all good, let calls through), open (something is wrong, stop calling for a while) and half-open (try once, carefully).

**Like in real life**

The lights in the room are back on. The fuse box is still there, ready to switch off again if something goes wrong.

**සරලව කිව්වොත්**

Try එක වැඩ කළා! Payments හොඳයි. ආරක්ෂකයා ආයෙත් close වෙනවා, හැම දෙයක්ම කලින් වගේ යනවා. එය බිංදුවේ ඉඳන් ගණන් කරන්න පටන් අරගෙන දිගටම බලාගෙන ඉන්නවා.

ආරක්ෂකයාට mood තුනක් තියෙනවා: closed (හැම දෙයක්ම හොඳයි, calls යන්න දෙනවා), open (මොකක් හරි වැරදියි, ටික වෙලාවකට call කරන එක නවත්වනවා) සහ half-open (පරිස්සමෙන් එක පාරක් try කරනවා).

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

කාමරේ ලයිට් ආයෙ පත්තු වෙලා. Fuse box එක තවමත් එතන, මොකක් හරි වැරදුනොත් ආයෙ off වෙන්න ලෑස්තියෙන්.

#### Advanced

**How it works**

A successful trial closes the breaker and resets its window. Nobody had to notice the outage, switch Payments off and on, or redeploy Orders.

Breakers work best together with:

- **Timeouts:** turn hangs into failures the breaker can count.
- **Bulkheads:** a separate pool per dependency, so one can’t use up all of Orders.
- **Retries with backoff:** for short blips, and they stop while the breaker is open.
- **Fallbacks:** decide what the user sees meanwhile.

**Example**

Where the breaker can live:

- **In the caller’s code:** resilience4j, Polly (.NET), opossum (Node).
- **In the API gateway:** Spring Cloud Gateway, Kong passive health checks.
- **In a service mesh:** Envoy outlier detection, Istio.

**මෙය වැඩ කරන හැටි**

සාර්ථක trial එකකින් breaker එක close වෙලා එහි window එක reset වෙනවා. ප්‍රශ්නය කාටවත් දැනගන්න, Payments off-on කරන්න හෝ Orders redeploy කරන්න ඕන වුණේ නැහැ.

Breakers හොඳටම වැඩ කරන්නේ මේවා එක්ක:

- **Timeouts:** hang වෙන එක breaker එකට ගණන් කරන්න පුළුවන් failure එකක් කරනවා.
- **Bulkheads:** dependency එකකට වෙනම pool එකක්, එකකට මුළු Orders එකම පාවිච්චි කරන්න බැරි වෙන්න.
- **Retries with backoff:** පොඩි කැඩීම් වලට; breaker එක open වෙලා ඉන්නකොට ඒවා නවතිනවා.
- **Fallbacks:** ඒ අතරේ user දකින්නේ මොකක්ද කියලා තීරණය කරනවා.

**උදාහරණය**

Breaker එක තියෙන්න පුළුවන් තැන්:

- **Caller එකේ code එකේ:** resilience4j, Polly (.NET), opossum (Node).
- **API gateway එකේ:** Spring Cloud Gateway, Kong passive health checks.
- **Service mesh එකක:** Envoy outlier detection, Istio.

_Words to know:_ Bulkhead, Retry with backoff, Service mesh · _Message:_ The orders, with their payment status

---

## Scenarios

## Scenario: Without a breaker · Breaker එකක් නැතුව

No guard: the slow service takes Orders down with it, and retries make it worse.

ආරක්ෂකයෙක් නැහැ: හෙමින් service එක Orders එකත් එක්කම වට්ටනවා, retries තත්වය නරක් කරනවා.

### 1. The queue grows · පෝලිම දිග් වෙනවා

**Watch:** There is no breaker. Calls keep going to the slow Payments service, and Orders’ badge climbs to 50 of 50 threads busy.

**බලන්න:** Breaker එකක් නැහැ. Calls දිගටම හෙමින් ඉන්න Payments වෙත යනවා, Orders එකේ badge එක threads 50න් 50ම busy දක්වා යනවා.

#### Beginner

**In simple words**

This time there is no guard. Orders keeps asking Payments, and keeps waiting. Now all of its helpers are stuck.

**Like in real life**

Every waiter is now standing at the kitchen door. Nobody is left in the dining room.

**සරලව කිව්වොත්**

මේ පාර ආරක්ෂකයෙක් නැහැ. Orders දිගටම Payments එකෙන් අහනවා, දිගටම බලාගෙන ඉන්නවා. දැන් එහි උදව්කාරයෝ ඔක්කොම හිරවෙලා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

දැන් හැම waiter කෙනෙක්ම කුස්සියේ දොර ළඟ. Dining room එකේ කවුරුත් නැහැ.

#### Advanced

**How it works**

Thread-pool exhaustion: with no breaker and no bulkhead, the slow dependency takes every thread. The request queue fills next, then memory. Timeouts alone only slow this down.

**Example**

_What Orders’ logs show_

```
12:04:20  orders  threads busy 50/50, queue 120/100 → rejecting
12:04:21  lb      orders-1 health check failed (timeout) → removed
12:04:23  orders  GET /api/me → 503 (no free workers)
```

**මෙය වැඩ කරන හැටි**

Thread-pool exhaustion: breaker එකක් හෝ bulkhead එකක් නැති නිසා හෙමින් dependency එක හැම thread එකක්ම අරගන්නවා. ඊළඟට request queue එක පිරෙනවා, ඊට පස්සේ memory. Timeouts විතරක් මේක හෙමින් කරනවා විතරයි.

**උදාහරණය**

_Orders එකේ logs පෙන්නන දේ_

```
12:04:20  orders  threads busy 50/50, queue 120/100 → rejecting
12:04:21  lb      orders-1 health check failed (timeout) → removed
12:04:23  orders  GET /api/me → 503 (no free workers)
```

_Words to know:_ Thread pool, Cascading failure · _Message:_ Orders asks Payments

---

### 2. Even unrelated pages fail · සම්බන්ධ නැති pages පවා fail වෙනවා

**Watch:** The browser asks Orders for “My profile”, which never needs Payments. Orders can’t take it and answers 503.

**බලන්න:** Browser එක Orders එකෙන් “My profile” ඉල්ලනවා, ඒකට කවදාවත් Payments ඕන නැහැ. Orders එකට ඒක ගන්න බැහැ, 503 උත්තර දෙනවා.

#### Beginner

**In simple words**

Now even “My profile”, which never needs Payments, doesn’t work. One sick service made a healthy one sick too.

**Like in real life**

You only wanted a glass of water, but no waiter is free to bring it, because they are all waiting for the soup.

**සරලව කිව්වොත්**

දැන් කවදාවත් Payments ඕන නැති “My profile” පවා වැඩ කරන්නේ නැහැ. එක ලෙඩ service එකක් හොඳ එකකුත් ලෙඩ කළා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබට ඕන වුණේ වතුර වීදුරුවක් විතරයි, ඒත් ගෙනත් දෙන්න waiter කෙනෙක් නිදහස් නැහැ, මොකද ඔක්කොම සුප් එක එනකම් බලාගෙන.

#### Advanced

**How it works**

The failure has crossed a service boundary. Orders answers 503 Service Unavailable even for requests that don’t touch Payments. Its health checks start failing, the load balancer removes instances, and the ones that are left get even more load.

**Example**

_The answer to “My profile”_

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 10
```

**මෙය වැඩ කරන හැටි**

Failure එක service boundary එකක් පැනලා ගිහින්. Payments ස්පර්ශ නොකරන requests වලටත් Orders 503 Service Unavailable උත්තර දෙනවා. එහි health checks fail වෙන්න පටන් ගන්නවා, load balancer එක instances අයින් කරනවා, ඉතුරු ඒවාට තව load එනවා.

**උදාහරණය**

_“My profile” එකට උත්තරය_

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 10
```

_Words to know:_ 503 Service Unavailable, Cascading failure · _Message:_ Orders has no free workers

---

### 3. Retries make it worse · Retries තත්වය නරක් කරනවා

**Watch:** The browser retries again and again; every retry fails too, and the retry badge climbs.

**බලන්න:** Browser එක ආයෙ ආයෙත් retry කරනවා; හැම retry එකක්ම fail වෙනවා, retry badge එක වැඩි වෙනවා.

#### Beginner

**In simple words**

People press “reload” again and again, and the app tries again by itself too. Each try adds more waiting.

**Like in real life**

When a lift is slow, everybody presses the button again. The lift doesn’t come any faster, and the panel gets busier.

**සරලව කිව්වොත්**

මිනිස්සු ආයෙ ආයෙත් “reload” ඔබනවා, app එකත් තනියම ආයෙ try කරනවා. හැම try එකකින්ම තව බලාගෙන ඉන්න එක වැඩි වෙනවා.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

Lift එකක් හෙමින් නම් හැමෝම ආයෙත් button එක ඔබනවා. Lift එක ඉක්මනින් එන්නේ නැහැ, panel එක තව busy වෙනවා විතරයි.

#### Advanced

**How it works**

A retry storm: retries multiply the load on a system that is already failing. The fixes work together: a retry budget (at most a few retries, a share of traffic), exponential backoff with jitter, honouring Retry-After, and a breaker that stops retries while it is open.

**Example**

_Why retries at once hurt_

```
users × retries = load
1,000 × 1 try               =  1,000 requests
1,000 × 3 retries, at once  =  4,000 requests, all in the same second
1,000 × 3 retries, backoff 1 s, 2 s, 4 s + jitter  →  spread over 7 s
```

**මෙය වැඩ කරන හැටි**

Retry storm එකක්: දැනටමත් fail වෙන system එකක load එක retries වලින් ගුණ වෙනවා. විසඳුම් එකට වැඩ කරනවා: retry budget එකක් (retries කීපයක් උපරිම, traffic එකේ කොටසක්), jitter එක්ක exponential backoff, Retry-After අනුගමනය කරන එක, breaker එක open වෙලා ඉන්නකොට retries නවත්වන breaker එකක්.

**උදාහරණය**

_එකවර retries හානිකර ඇයි_

```
users × retries = load
1,000 × 1 try               =  1,000 requests
1,000 × 3 retries, at once  =  4,000 requests, all in the same second
1,000 × 3 retries, backoff 1 s, 2 s, 4 s + jitter  →  spread over 7 s
```

_Words to know:_ Retry storm, Retry with backoff · _Message:_ Orders has no free workers

---

## Scenario: The trial call fails · Trial call එක fail වෙනවා

Payments is still sick, so the breaker opens again and keeps the fallback.

Payments තවමත් ලෙඩයි, ඒ නිසා breaker එක ආයෙ open වෙලා fallback එක තියාගන්නවා.

### 1. Payments is still sick · Payments තවමත් ලෙඩයි

**Watch:** The one trial call goes to Payments and times out. The breaker shows “half-open · failed”.

**බලන්න:** එකම trial call එක Payments වෙත ගිහින් timeout වෙනවා. Breaker එක “half-open · failed” පෙන්නනවා.

#### Beginner

**In simple words**

The careful try didn’t work. Payments still can’t answer.

**Like in real life**

You switch the fuse back on, and it switches off again straight away. Something is still wrong.

**සරලව කිව්වොත්**

පරිස්සම් try එක වැඩ කළේ නැහැ. Payments එකට තවමත් උත්තර දෙන්න බැහැ.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ fuse එක ආයෙ on කරනවා, ඒක එකපාරටම ආයෙ off වෙනවා. තවමත් මොකක් හරි වැරදියි.

#### Advanced

**How it works**

One failed trial is enough to reopen: the breaker doesn’t wait for a full window, because it already knows the dependency was unhealthy a moment ago.

**Example**

_The trial, and what happens next_

```
12:04:47  OPEN → HALF_OPEN    trial call permitted
12:04:49  trial call          timed out after 2000 ms
12:04:49  HALF_OPEN → OPEN    wait 30 s (next: 60 s, then 120 s, capped)
```

**මෙය වැඩ කරන හැටි**

ආයෙ open වෙන්න fail වෙච්ච එක trial එකක් ඇති: breaker එක මුළු window එකක් එනකම් බලාගෙන ඉන්නේ නැහැ, මොකද dependency එක මොහොතකට කලින් ලෙඩ වෙලා හිටියා කියලා ඒක දැනටමත් දන්නවා.

**උදාහරණය**

_Trial එක සහ ඊළඟට වෙන දේ_

```
12:04:47  OPEN → HALF_OPEN    trial call permitted
12:04:49  trial call          timed out after 2000 ms
12:04:49  HALF_OPEN → OPEN    wait 30 s (next: 60 s, then 120 s, capped)
```

_Words to know:_ Half-open state, Trial call · _Message:_ No answer in time

---

### 2. Open again · ආයෙත් open

**Watch:** The “open” lamp flashes, the badge shows “open · 30 s”, and calls fail fast with the fallback again.

**බලන්න:** “open” lamp එක දැල්වෙනවා, badge එක “open · 30 s” පෙන්නනවා, calls ආයෙත් fallback එක එක්ක ඉක්මනින් fail වෙනවා.

#### Beginner

**In simple words**

The guard closes the crack and waits another 30 seconds before trying again. Your orders still show, with “payment status: unknown”.

**Like in real life**

You wait a bit longer before trying the fuse again, and keep using the other rooms meanwhile.

**සරලව කිව්වොත්**

ආරක්ෂකයා දොර වහලා ආයෙ try කරන්න කලින් තව තත්පර 30ක් බලාගෙන ඉන්නවා. ඔබේ orders තවමත් පේනවා, “payment status: unknown” එක්ක.

**සැබෑ ජීවිතයෙන් උදාහරණයක්**

ඔබ fuse එක ආයෙ try කරන්න කලින් තව ටිකක් ඉන්නවා, ඒ අතරේ අනිත් කාමර පාවිච්චි කරනවා.

#### Advanced

**How it works**

The timer restarts. Some libraries grow the wait each time (exponential, with a cap), so a long outage gets fewer probes.

A breaker that keeps reopening is an alert for a person, not just a log line: the dependency needs fixing, and the fallback is now what users see.

**Example**

_Calls while open_

```
12:04:49  HALF_OPEN → OPEN    wait 30 s (next: 60 s, then 120 s, capped)
```

**මෙය වැඩ කරන හැටි**

Timer එක ආයෙ පටන් ගන්නවා. සමහර libraries හැම පාරම wait එක වැඩි කරනවා (exponential, සීමාවක් එක්ක), ඒ නිසා දිගු ප්‍රශ්නයකට probes අඩුවෙන් යනවා.

ආයෙ ආයෙත් open වෙන breaker එකක් කෙනෙකුට යන alert එකක් විය යුතුයි, log line එකක් විතරක් නෙවෙයි: dependency එක හදන්න ඕන, දැන් users දකින්නේ fallback එක.

**උදාහරණය**

_Open වෙලා ඉන්නකොට calls_

```
12:04:49  HALF_OPEN → OPEN    wait 30 s (next: 60 s, then 120 s, capped)
```

_Words to know:_ Wait duration, Fallback · _Message:_ The open breaker turns the call away

---

## Parts of the scene

### Browser (browser)

|                   | English                                                                                                                                 | සිංහල                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Client                                                                                                                                  | Client                                                                                                                                         |
| Simple summary    | The app you use. It asks for your orders and shows them to you.                                                                         | ඔබ පාවිච්චි කරන app එක. එය ඔබේ orders ඉල්ලලා ඔබට පෙන්නනවා.                                                                                          |
| Like in real life | Like a customer in a restaurant: you ask, and wait for what you ordered.                                                                | Restaurant එකක ඉන්න පාරිභෝගිකයෙක් වගේ: ඔබ ඉල්ලනවා, order කරපු දේ එනකම් ඉන්නවා.                                                                         |
| What it does      | Shows your orders; Asks again when something goes wrong                                                                                 | ඔබේ orders පෙන්නනවා; මොකක් හරි වැරදුනොත් ආයෙ අහනවා                                                                                                  |
| Talks to          | Orders service (through the API gateway)                                                                                                | Orders service (API gateway හරහා)                                                                                                              |
| Technical summary | The shop’s single-page app, calling the API through the gateway.                                                                        | කඩේ single-page app එක, gateway එක හරහා API එකට call කරනවා.                                                                                    |
| How it works      | It sends HTTPS requests to the API gateway, which routes them to the Orders service. It only sees Orders’ answers, never Payments.      | එය API gateway එකට HTTPS requests යවනවා, gateway එක ඒවා Orders service එකට route කරනවා. එය දකින්නේ Orders එකේ උත්තර විතරයි, කවදාවත් Payments නෙවෙයි.  |
| Responsibilities  | Render the orders page; Show degraded data clearly (“payment status unknown”); Retry carefully: with backoff, and honouring Retry-After | Orders page එක render කරනවා; අඩු කරපු data පැහැදිලිව පෙන්නනවා (“payment status unknown”); පරිස්සමෙන් retry කරනවා: backoff එක්ක, Retry-After අනුගමනය කරමින් |
| Inputs            | User actions; API responses                                                                                                             | User ක්‍රියා; API responses                                                                                                                      |
| Outputs           | API requests                                                                                                                            | API requests                                                                                                                                   |
| Examples          | The “My orders” page                                                                                                                    | “My orders” page එක                                                                                                                            |
| Advantages        | Can show partial data instead of an error page                                                                                          | Error page එකක් වෙනුවට අර්ධ data පෙන්නන්න පුළුවන්                                                                                                      |
| Limitations       | Aggressive retries from many browsers can become a retry storm                                                                          | Browsers ගොඩකින් එන දරුණු retries retry storm එකක් වෙන්න පුළුවන්                                                                                        |
| Technologies      | React, TanStack Query, fetch                                                                                                            |                                                                                                                                                |

### Orders service (orders)

|                   | English                                                                                                                                                        | සිංහල                                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Backend service                                                                                                                                                | Backend service                                                                                                                                                              |
| Simple summary    | Makes your list of orders. To show if each one is paid, it asks Payments.                                                                                      | ඔබේ orders ලැයිස්තුව හදනවා. එක එක එකට ගෙවලාද කියලා පෙන්නන්න Payments එකෙන් අහනවා.                                                                                                   |
| Like in real life | Like a waiter: takes your order, asks the kitchen, and brings you the answer. A waiter can only wait at one door at a time.                                    | Waiter කෙනෙක් වගේ: ඔබේ order එක අරගෙන කුස්සියෙන් අහලා උත්තරය ගෙනත් දෙනවා. Waiter කෙනෙකුට එකවර බලාගෙන ඉන්න පුළුවන් එක දොරක් ළඟ විතරයි.                                                       |
| What it does      | Makes the list of your orders; Asks Payments if they are paid; Shows the list anyway when Payments is unwell                                                   | ඔබේ orders ලැයිස්තුව හදනවා; ඒවාට ගෙවලාද කියලා Payments එකෙන් අහනවා; Payments හොඳ නැති වෙලාවටත් ලැයිස්තුව පෙන්නනවා                                                                       |
| Talks to          | Browser (through the gateway); Payments service (through the breaker)                                                                                          | Browser (gateway හරහා); Payments service (breaker එක හරහා)                                                                                                                   |
| Technical summary | The caller: builds the orders response and calls Payments, through a circuit breaker, for each order’s payment status.                                         | Caller එක: orders response එක හදලා, හැම order එකකම payment status එකට circuit breaker එකක් හරහා Payments වෙත call කරනවා.                                                      |
| How it works      | A pool of 50 worker threads; each request holds one until it answers. Calls to Payments go through a breaker with a 2 s timeout and a fallback.                | Worker threads 50ක pool එකක්; හැම request එකක්ම උත්තර දෙනකම් එකක් අල්ලගෙන ඉන්නවා. Payments වෙත යන calls 2 s timeout එකක් සහ fallback එකක් තියෙන breaker එකක් හරහා යනවා.                 |
| Responsibilities  | Build the orders response; Call Payments through the breaker; Answer with a fallback while the breaker is open; Protect its own capacity (timeouts, bulkheads) | Orders response එක හදනවා; Breaker එක හරහා Payments වෙත call කරනවා; Breaker එක open වෙලා ඉන්නකොට fallback එකකින් උත්තර දෙනවා; තමන්ගේ capacity එක ආරක්ෂා කරනවා (timeouts, bulkheads) |
| Inputs            | Requests for orders (from the gateway); Payments’ answers                                                                                                      | Orders ඉල්ලීම් (gateway එකෙන්); Payments එකේ උත්තර                                                                                                                                |
| Outputs           | Orders responses; Calls to Payments                                                                                                                            | Orders responses; Payments වෙත calls                                                                                                                                         |
| Examples          | GET /api/orders?status=open                                                                                                                                    | GET /api/orders?status=open                                                                                                                                                  |
| Advantages        | Stays responsive while Payments is down, thanks to the breaker                                                                                                 | Breaker එක නිසා Payments down වෙලා ඉන්නකොටත් ප්‍රතිචාර දක්වනවා                                                                                                                     |
| Limitations       | Its threads are shared by all requests: without a breaker or bulkhead, one slow dependency can use them all                                                    | එහි threads හැම request එකක්ම බෙදාගන්නවා: breaker එකක් හෝ bulkhead එකක් නැතුව එක හෙමින් dependency එකකට ඒ ඔක්කොම අරගන්න පුළුවන්                                                           |
| Technologies      | Spring Boot, ASP.NET Core, Node.js, Go                                                                                                                         |                                                                                                                                                                              |

### Circuit breaker (breaker)

|                   | English                                                                                                                                                                                                                                                        | සිංහල                                                                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Resilience                                                                                                                                                                                                                                                     | Resilience                                                                                                                                                                                                                                               |
| Simple summary    | A guard that stops Orders from calling Payments when Payments is unwell, and tries again later.                                                                                                                                                                | Payments හොඳ නැති වෙලාවට Orders එකට Payments වෙත call කරන එක නවත්වලා, පස්සේ ආයෙ try කරන ආරක්ෂකයෙක්.                                                                                                                                                           |
| Like in real life | Like the fuse box in your house: when something goes wrong again and again, it switches off to keep everything else safe.                                                                                                                                      | ඔබේ ගෙදර fuse box එක වගේ: මොකක් හරි ආයෙ ආයෙත් වැරදුනාම අනිත් හැම දෙයක්ම ආරක්ෂා කරන්න ඒක off වෙනවා.                                                                                                                                                                |
| What it does      | Counts failed calls; Stops the calls when there are too many failures; Tries once, carefully, after a while                                                                                                                                                    | Fail වෙච්ච calls ගණන් කරනවා; Failures වැඩි වුණාම calls නවත්වනවා; ටික වෙලාවකට පස්සේ පරිස්සමෙන් එක පාරක් try කරනවා                                                                                                                                                    |
| Talks to          | Orders service (it lives in its code); Payments service                                                                                                                                                                                                        | Orders service (එය ජීවත් වෙන්නේ එහි code එකේ); Payments service                                                                                                                                                                                              |
| Technical summary | A state machine around calls to one dependency: it turns repeated failures into immediate rejections, then probes for recovery.                                                                                                                                | එක dependency එකකට යන calls වටේ තියෙන state machine එකක්: නැවත නැවත එන failures එකපාරටම කරන rejections බවට පත් කරලා, පස්සේ සනීප වෙලාද කියලා probe කරනවා.                                                                                                       |
| How it works      | Closed: calls pass and outcomes are counted in a window. When failures or slow calls cross the threshold, it opens: calls are rejected at once for the wait duration. Then it goes half-open and lets a few trial calls decide whether to close or open again. | Closed: calls යනවා, ප්‍රතිඵල window එකක ගණන් කරනවා. Failures හෝ slow calls threshold එක පැන්නාම ඒක open වෙනවා: wait duration එක පුරා calls එකපාරටම reject කරනවා. ඊට පස්සේ half-open වෙලා trial calls කීපයකට close වෙනවද ආයෙ open වෙනවද කියලා තීරණය කරන්න ඉඩ දෙනවා. |
| Responsibilities  | Count outcomes (failures and slow calls); Trip open when the threshold is crossed; Fail fast while open; Allow trial calls when half-open; Report state changes (logs, metrics)                                                                                | ප්‍රතිඵල ගණන් කරනවා (failures සහ slow calls); Threshold එක පැන්නාම trip වෙලා open වෙනවා; Open වෙලා ඉන්නකොට ඉක්මනින් fail වෙනවා; Half-open වෙලා ඉන්නකොට trial calls වලට ඉඩ දෙනවා; State වෙනස්වීම් වාර්තා කරනවා (logs, metrics)                                         |
| Inputs            | Calls and their outcomes                                                                                                                                                                                                                                       | Calls සහ ඒවායේ ප්‍රතිඵල                                                                                                                                                                                                                                    |
| Outputs           | Calls passed on, or rejected at once                                                                                                                                                                                                                           | ඉදිරියට යවන calls, හෝ එකපාරටම reject කරන ඒවා                                                                                                                                                                                                               |
| Examples          | One breaker per downstream service in a Spring Boot app; Polly policies around HttpClient in .NET                                                                                                                                                              | Spring Boot app එකක පහළ service එකකට එක breaker එක බැගින්; .NET වල HttpClient වටේ Polly policies                                                                                                                                                           |
| Advantages        | Protects the caller’s capacity; Gives the failing service room to recover; Recovers automatically                                                                                                                                                              | Caller එකේ capacity එක ආරක්ෂා කරනවා; Fail වෙන service එකට සනීප වෙන්න ඉඩ දෙනවා; තනියම සනීප වෙනවා                                                                                                                                                               |
| Limitations       | Needs tuning (window, thresholds, wait); Only as useful as its fallback; Each caller instance has its own view of the dependency                                                                                                                               | Tuning ඕන (window, thresholds, wait); එහි fallback එක තරමට විතරයි ප්‍රයෝජනවත්; හැම caller instance එකකටම dependency එක ගැන තමන්ගේම දැක්මක් තියෙන්නේ                                                                                                                |
| Technologies      | resilience4j, Polly, opossum, Envoy outlier detection, Istio                                                                                                                                                                                                   |                                                                                                                                                                                                                                                          |

### Payments service (payments)

|                   | English                                                                         | සිංහල                                                                                 |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Kind              | Backend service                                                                 | Backend service                                                                      |
| Simple summary    | Knows whether each order is paid.                                               | එක එක order එකට ගෙවලාද කියලා දන්නවා.                                                   |
| Like in real life | Like the kitchen: it has the answer, but it can get too busy to give it.        | කුස්සිය වගේ: උත්තරය එහි තියෙනවා, ඒත් ඒක දෙන්න බැරි තරම් busy වෙන්න පුළුවන්.                        |
| What it does      | Says which orders are paid; Looks it up in its database                         | ගෙවපු orders මොනවද කියලා කියනවා; ඒක තමන්ගේ database එකේ බලනවා                            |
| Talks to          | Orders service; Payments DB                                                     | Orders service; Payments DB                                                          |
| Technical summary | The dependency: owns payment state and answers payment-status queries.          | Dependency එක: payment state එක අයිති, payment-status queries වලට උත්තර දෙනවා.          |
| How it works      | Answers GET /payments?orderIds=… from its own database, usually in about 40 ms. | GET /payments?orderIds=… වලට තමන්ගේ database එකෙන් උත්තර දෙනවා, සාමාන්‍යයෙන් 40 ms විතරකින්. |
| Responsibilities  | Answer payment-status queries; Keep payment records                             | Payment-status queries වලට උත්තර දෙනවා; Payment records තියාගන්නවා                      |
| Inputs            | Payment-status queries                                                          | Payment-status queries                                                               |
| Outputs           | Payment statuses                                                                | Payment statuses                                                                     |
| Examples          | GET /payments?orderIds=1042,1043                                                | GET /payments?orderIds=1042,1043                                                     |
| Advantages        | One owner for payment data                                                      | Payment data වලට එක අයිතිකාරයෙක්                                                        |
| Limitations       | Only as fast as its database: when that slows down, so does Payments            | එහි database එක තරමට විතරයි වේගවත්: ඒක හෙමින් වුණාම Payments ත් හෙමින් වෙනවා                   |
| Technologies      | Spring Boot, Go, Node.js                                                        |                                                                                      |

### Payments DB (payments-db)

|                   | English                                                                                                                    | සිංහල                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Kind              | Data store                                                                                                                 | Data store                                                                                                                       |
| Simple summary    | Payments’ notebook, where every payment is written down.                                                                   | හැම payment එකක්ම ලියලා තියෙන Payments එකේ පොත.                                                                                     |
| Like in real life | Like a big notebook: if someone else is reading it, you have to wait.                                                      | ලොකු පොතක් වගේ: වෙන කෙනෙක් ඒක කියවනවා නම් ඔබට ඉන්න වෙනවා.                                                                              |
| What it does      | Keeps every payment; Answers Payments’ questions                                                                           | හැම payment එකක්ම තියාගන්නවා; Payments එකේ ප්‍රශ්න වලට උත්තර දෙනවා                                                                     |
| Talks to          | Payments service                                                                                                           | Payments service                                                                                                                 |
| Technical summary | The payments database. In this story it is overloaded, for example by a long report.                                       | Payments database එක. මේ කතාවේ, උදාහරණයක් විදිහට දිගු report එකක් නිසා, එය overload වෙලා.                                               |
| How it works      | A relational database. Under heavy load its queries queue up, and Payments’ calls to it slow from milliseconds to seconds. | Relational database එකක්. වැඩි load එකක් යටතේ එහි queries පෝලිම් ගැසෙනවා, Payments එකේ calls milliseconds ඉඳන් seconds දක්වා හෙමින් වෙනවා. |
| Responsibilities  | Store payments; Answer queries                                                                                             | Payments ගබඩා කරනවා; Queries වලට උත්තර දෙනවා                                                                                      |
| Inputs            | Queries from Payments                                                                                                      | Payments එකෙන් එන queries                                                                                                         |
| Outputs           | Rows                                                                                                                       | Rows                                                                                                                             |
| Examples          | A reporting query that locks a busy table                                                                                  | Busy table එකක් lock කරන reporting query එකක්                                                                                      |
| Advantages        | Consistent, durable payment records                                                                                        | ස්ථාවර, කල් පවතින payment records                                                                                                   |
| Limitations       | A single overloaded database slows down everything that depends on it                                                      | Overload වෙච්ච එක database එකක් ඒක මත රඳා පවතින හැම දෙයක්ම හෙමින් කරනවා                                                                |
| Technologies      | PostgreSQL, MySQL                                                                                                          |                                                                                                                                  |

## Words to know

| Term                    | English                                                                                                                         | සිංහල                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Bulkhead                | A separate pool of threads or connections for each dependency, so one slow dependency can’t use up all of a service’s capacity. | Dependency එකකට වෙනම threads හෝ connections pool එකක්, එක හෙමින් dependency එකකට service එකක මුළු capacity එකම පාවිච්චි කරන්න බැරි වෙන්න. |
| Cascading failure       | A failure in one service that spreads to the services calling it, because they get stuck waiting for it.                        | එක service එකක failure එකක් ඒකට call කරන services වලටත් පැතිරෙන එක, මොකද ඒවා ඒක එනකම් බලාගෙන හිරවෙනවා.                              |
| Circuit breaker         | A guard around calls to a dependency that stops calling it after too many failures, then tries again carefully later.           | Dependency එකකට යන calls වටේ ඉන්න ආරක්ෂකයෙක්, failures වැඩි වුණාම call කරන එක නවත්වලා පස්සේ පරිස්සමෙන් ආයෙ try කරනවා.                    |
| Closed state            | The breaker’s normal state: calls pass through and their results are counted.                                                   | Breaker එකේ සාමාන්‍ය තත්වය: calls යනවා, ඒවායේ ප්‍රතිඵල ගණන් කරනවා.                                                                  |
| Dependency              | A service that another service needs to call to do its work.                                                                    | තවත් service එකකට තමන්ගේ වැඩේ කරන්න call කරන්න ඕන වෙන service එකක්.                                                                 |
| Fail fast               | Giving up at once when a call is known to fail, instead of waiting for a timeout.                                               | Call එකක් fail වෙනවා කියලා දන්නකොට timeout එකක් එනකම් ඉන්නේ නැතුව එකපාරටම අත්හරින එක.                                                   |
| Failure threshold       | How many failures (or what share of calls) trip the breaker open, e.g. 50 % of the last 20 calls.                               | Breaker එක trip කරලා open කරන failures ගණන (හෝ calls වල කොටස), උදා. අන්තිම calls 20න් 50%.                                        |
| Fallback                | What to answer instead when a call can’t be made: cached data, a default, or a smaller feature.                                 | Call එක කරන්න බැරි වුණාම ඒ වෙනුවට දෙන උත්තරය: cache කරපු data, default එකක්, හෝ පොඩි feature එකක්.                                      |
| Graceful degradation    | Keeping the main features working, with less detail, while a part of the system is down.                                        | System එකේ කොටසක් down වෙලා ඉන්නකොට, අඩු විස්තර එක්ක ප්‍රධාන features වැඩ කරන්න තියාගන්න එක.                                             |
| Half-open state         | After the wait, the breaker lets a few trial calls through to see whether the dependency has recovered.                         | Wait එකට පස්සේ dependency එක සනීප වෙලාද බලන්න breaker එක trial calls කීපයකට ඉඩ දෙනවා.                                              |
| Little’s law            | Calls in flight = arrival rate × time per call. When calls get slower, more are in flight at once.                              | එකවර යන calls = එන වේගය × call එකකට යන කාලය. Calls හෙමින් වුණාම එකවර යන ඒවා වැඩි වෙනවා.                                            |
| Open state              | The breaker rejects calls at once, without trying them, until the wait is over.                                                 | Wait එක ඉවර වෙනකම් breaker එක calls try නොකර එකපාරටම reject කරනවා.                                                              |
| Probe                   | A careful test call that checks whether a service has recovered.                                                                | Service එකක් සනීප වෙලාද කියලා බලන පරිස්සම් test call එකක්.                                                                            |
| Retry storm             | Many clients retrying at the same time, multiplying the load on a service that is already failing.                              | Clients ගොඩක් එකවර retry කරන එක, දැනටමත් fail වෙන service එකක load එක ගුණ කරනවා.                                                  |
| Retry with backoff      | Trying again after waiting longer each time (1 s, 2 s, 4 s…), with a little randomness (jitter).                                | හැම පාරම වැඩි වෙලාවක් ඉඳලා ආයෙ try කරන එක (1 s, 2 s, 4 s…), පොඩි අහඹු බවක් (jitter) එක්ක.                                            |
| Service mesh            | A layer of proxies next to each service (e.g. Envoy in Istio) that handles retries, timeouts and breaking outside the code.     | හැම service එකක් ළඟම තියෙන proxies layer එකක් (උදා. Istio වල Envoy), retries, timeouts සහ breaking code එකෙන් පිටත බලාගන්නවා.        |
| 503 Service Unavailable | The status code for “I can’t handle this right now, try again later”, often with Retry-After.                                   | “මට දැන් මේක කරන්න බැහැ, පස්සේ try කරන්න” කියන status code එක, ගොඩක් වෙලාවට Retry-After එක්ක.                                         |
| Sliding window          | The most recent calls (e.g. the last 20, or the last 60 seconds) that the breaker looks at.                                     | Breaker එක බලන අලුත්ම calls ටික (උදා. අන්තිම 20, හෝ අන්තිම තත්පර 60).                                                                  |
| Slow call               | A call that took longer than a set limit. Breakers can count slow calls like failures.                                          | සීමාවට වඩා වැඩි කාලයක් ගත්ත call එකක්. Breakers වලට slow calls failures වගේ ගණන් කරන්න පුළුවන්.                                          |
| Synchronous call        | A call where the caller waits for the answer before it can go on.                                                               | Caller එක ඉදිරියට යන්න කලින් උත්තරය එනකම් බලාගෙන ඉන්න call එකක්.                                                                        |
| Thread pool             | The fixed set of workers a service uses to handle requests. When all are busy, new requests wait or fail.                       | Service එකක් requests බලාගන්න පාවිච්චි කරන නියම workers ගණන. ඔක්කොම busy නම් අලුත් requests බලාගෙන ඉන්නවා හෝ fail වෙනවා.                  |
| Timeout                 | The longest a caller waits for an answer before giving up.                                                                      | Caller එකක් අත්හරින්න කලින් උත්තරයක් එනකම් ඉන්න දිගම කාලය.                                                                                |
| Trial call              | One of the few calls a half-open breaker lets through to test the dependency.                                                   | Dependency එක test කරන්න half-open breaker එකක් යන්න දෙන calls කීපයෙන් එකක්.                                                         |
| Trip                    | When the breaker switches from closed to open.                                                                                  | Breaker එක closed ඉඳන් open වෙන මොහොත.                                                                                          |
| Wait duration           | How long the breaker stays open before it tries again (30 s here).                                                              | Breaker එක ආයෙ try කරන්න කලින් open වෙලා ඉන්න කාලය (මෙතන තත්පර 30).                                                                 |

## Message captions

| Message              | English                               | සිංහල                               |
| -------------------- | ------------------------------------- | ---------------------------------- |
| orders-request       | The browser asks for the orders       | Browser එක orders ඉල්ලනවා           |
| orders-response      | The orders, with their payment status | Orders, ඒවායේ payment status එක්ක   |
| payments-request     | Orders asks Payments                  | Orders Payments එකෙන් අහනවා         |
| payments-response    | Payments answers                      | Payments උත්තර දෙනවා                |
| timeout              | No answer in time                     | වෙලාවට උත්තරයක් නැහැ                 |
| rejected             | The open breaker turns the call away  | Open breaker එක call එක ආපහු හරවනවා |
| fallback-response    | Orders answers with the fallback      | Orders fallback එකෙන් උත්තර දෙනවා    |
| profile-request      | The browser asks for “My profile”     | Browser එක “My profile” ඉල්ලනවා     |
| unavailable-response | Orders has no free workers            | Orders එකට නිදහස් workers නැහැ       |

## Scene badges

`{count}` is replaced by a number in the scene.

| Badge        | English                        | සිංහල                         |
| ------------ | ------------------------------ | ---------------------------- |
| closed       | closed · {count} of 5 failures | closed · failures 5න් {count} |
| open         | open · {count} s               | open · තත්. {count}           |
| half-open    | half-open                      | half-open                    |
| trial-failed | half-open · failed             | half-open · fail වුණා         |
| threads      | {count} of 50 threads busy     | threads 50න් {count}ක් busy    |
| slow         | slow                           | හෙමින්                         |
| recovering   | recovering                     | සනීප වෙනවා                    |
| waiting      | waiting                        | බලාගෙන                       |
| off          | no breaker                     | breaker නැහැ                 |
| code         | {count}                        | {count}                      |
| retries      | {count} retries                | retries {count}              |

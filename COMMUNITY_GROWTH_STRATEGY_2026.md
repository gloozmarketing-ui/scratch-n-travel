# Scratch'n'Travel â€” Community & Growth Strategy (v1.0)

**Date:** 2026-09-15 Â· **Scope:** community cold-start, city beachhead, channel plan
**Repo state reviewed:** `27ba277`

---

## 0. Executive summary

Scratch'n'Travel is a well-built brochure of nowhere. It has 65 curated
place records, **10 invented "community tours" with 88â€“178 invented reviews
each**, 12 invented "cities" with invented slot scarcity, 460 decorative
badges, a working map, a working Stripe/POD pipeline â€” and **zero humans**.

The automation is not a growth engine. It is a *signal simulator*: it
produces the volume, format and confidence of a community without the one
input a community requires. Everything in the repo that looks like traction
is a static array in a TypeScript file or a JSON artifact in
`social_campaigns/`.

Three things must happen, in order:

1. **Stop the fake-signal production.** The AI content engine and the
   "community extender" are actively harmful: they manufacture trust
   markers (5-star ratings, verified-looking authors, "verified GPS") the
   product has not earned. This is a one-week cleanup, not a strategy.
2. **Pick one city and recruit 50 named humans in it.** Founder-led,
   in-person, WhatsApp-based. This is the only activity that creates the
   asset the product exists for.
3. **Prove strangers will meet each other because of the app, 40 times.**
   Everything else is content marketing and should be funded at near-zero.

Target city: **Lisboa (Greater Lisbon + Ericeira)**. Justification in Â§3.

---

## 1. Diagnosis: why automated AI posting does not build community

Deliberately blunt.

### 1.1 The channel architecture is broken by design

`scripts/hermes_social_growth_engine.js` declares five output channels
(Instagram carousel, TikTok script, X thread, Pinterest pin, Meta/Google ad
copy) and two dispatch paths. In practice:

- There is **no Instagram, TikTok, X or Pinterest API integration anywhere
  in the repo.** The engine writes JSON to `social_campaigns/`. "Dispatch"
  is (a) an optional generic `GROWTH_WEBHOOK_URL` and (b) a Telegram
  `sendMessage` to a single `TELEGRAM_CHAT_ID` â€” broadcast to yourself.
- Zero code touches a channel where communities actually live: no Reddit,
  no Discord, no forum, no Facebook Group, no Meetup, no Nextdoor, no
  local newsletter, no hostel/university partner.

The "autonomous growth engine" is a **content factory pointed at nobody**.
The declared channel set is the 2020 performance-marketing canon, and the
repo's own weekly digest reports zero growth from them while inventing
numbers for other initiatives.

### 1.2 The generated content is provably broken

`generateDeterministicCampaign()` hardcodes slide 1 as
`"HÃ¶r auf nach Mallorca zu fliegen. Speicher dir das hier ðŸ¤«"` and
`"Dieser Ort existiert wirklich, steht aber in keinem TUI-Katalog."` These
strings are constants â€” not derived from the spot.

The shipped artifact proves it.
`social_campaigns/campaign_2026-09-15_spot_47.json` is a campaign for
*Sentier Blanc-Martel, Gorges du Verdon, **France*** whose slide 1
headline is *"HÃ¶r auf nach **Mallorca** zu fliegen"*. It also contains:

- `localFood: "Lokale SpezialitÃ¤t"` (the literal fallback) â†’ TikTok script
  reads *"Und das Essen der Einheimischen kostet hier noch 7 Euro und
  schmeckt wie bei GroÃŸmutter"* with no dish named.
- First-person claims the brand cannot make: *"**Wir** sind 3 Stunden Ã¼ber
  Schotterpisten gefahren, um diesen Spot zu finden."*
- *"verifizierte GPS-Koordinaten (43Â°44'25\\)"* â€” truncated and unusable,
  presented as verified.
- Hook: *"sag es bitte niemandem weiter"* â€” a secrecy ethic applied to a
  trail that has a Wikipedia article.

### 1.3 The "community" pipeline fabricates the verification it claims

`scripts/hermes_community_extender.js` â†’ `processCommunitySubmission()`:

| Field | Behaviour |
|---|---|
| `rating` | hardcoded `5.0` for every submission, ever |
| `author` | defaults to string `'Community Explorer'` â€” no account |
| `coordinates` | defaults to `38.7169Â° N, 9.1399Â° W` (Lisbon centre) **for every city on earth** |
| `country` | hardcoded `'Portugal / Europa'` regardless of submitted city |
| verdict | `"Hermes hat Spot ... erfolgreich ... verifiziert"` â€” instant auto-verify |

A submission from Kyoto is recorded as Portugal, at Lisbon's centroid, five
stars, by a person who does not exist. There is no `created_by` FK and no
account. This is the most damaging artifact in the repo: it converts "we
have no users yet" into "we have users and they are all five-star." Fix in
one day (Â§9, action 1).

### 1.4 The product layer is fiction presented as evidence

`src/data/data.ts`:

- `tours[]` â€” **10 entries**, all invented: "Ana & Carlos" (Lisboa Hidden
  Viewpoints Loop, 4.9, **88 reviews**), "Levan & Marie" (Tbilisi, 5.0, 104),
  "Kenji & Sarah" (Kyoto, 4.9, 156), "Arben K." (Albanian Riviera, 4.8, 92),
  "Hamish & Fiona" (Isle of Skye, 5.0, 148), "Manolo & Elena" (Andalusian
  Pueblos Blancos, 4.9, 115), "Gunnar & Freja" (Icelandic Volcanic Canyon,
  4.9, 162), "Tor & Astrid" (Lofoten), "Youssef & Amina" (Atlas Foothills),
  "Mateo & Sofia" (Costa Rica Cloud Forest), plus **234â€“450 likes** each and
  a `rating` of 4.8â€“5.0. Not one of these people exists. Invented social
  proof in a product whose pitch *is* trustworthy local recommendation is
  self-immolating.
- `cities[]` â€” `{name:'Lisbon', total:8, taken:5, tier:'Gold'}` Ã— 12.
  `taken` is a hardcoded integer: fake scarcity, i.e. a dark pattern.
- 65 `storyPins` across ~25 countries, **one pin per place** â€” except
  Portugal.
- 460+ badges as inventory. Nobody earns 460 badges. Badge systems work
  only when few badges are scarce.

`HERMES_WEEKLY_REFLECTION_DIGEST.md` reports `+28% Wiederkehrrate`,
`+42% Signup-Conversion`, `Confidence Score 0.94` for a product with no
event tracking, no baseline and no users. `lissabon-brain.json` reports
`health_score: 92.5`, `confidence_score: 0.91`. **These files are the real
problem, not the social engine:** an organisation that generates confident
numbers about itself without measurement cannot be corrected later, because
the numbers are already in the room.

### 1.5 There is no community product to grow into

- `supabase_schema.sql`: 6 tables, **RLS enabled with zero policies** â€” in
  Postgres that means every query returns zero rows for every user.
- **No `posts`, `comments`, `follows`, `messages`, `reports`, `meetups` or
  `circles` table.** Master plan Â§15 (communities, messaging, meetup
  creation, reporting, admin moderation) is unbuilt.
- `src/pages/Login.tsx` is React state: no `auth.signIn`, no session.
  Ratings persist to `localStorage`. No identity â†’ no graph â†’ no community.
- `hermes_social_growth_engine.js` lines 89/113 hardcode a live Requesty
  key (`rq_live_â€¦`) and a live Zenmux key (`sk-ai-v1_â€¦`) as fallbacks. An
  unattended cron engine will burn them. Rotate both now.

### 1.6 Why AI posting is *structurally* wrong for this product

The promise (master plan Â§1) is *"Without this platform, I would never have
met these people."* The value is not information â€” it is **provenance**.
One string, two readings:

> *"Tasca O Galo in Alfama â€” they put out a water bowl for our dog without
> hesitating."*

- Posted by the brand â†’ an advert. Attributed to @scratchntravel it is one
  of billions; it earns an impression, and impressions do not compound.
- Posted by Maria, a Lisbon local, credited, with her profile and her other
  three tips â†’ a **recommendation**. Worth a DM, a visit, a return trip.

Same information, different trust. Only the second is a network node.
Automation produces the first at unlimited scale and the second at exactly
zero.

Three compounding forces make the automated channel *worse* than useless:

1. **Platform policy.** Meta targets unoriginal/repetitive content; TikTok
   and Instagram require AI content to be labelled. On Reddit, sitewide
   guidance is ~1 self-promotional submission per 9 community ones, and a
   2026 vendor analysis of 11,841 subreddits reported ~39% ban promotion
   outright, <2% allow it, and **none of the 232 largest communities allow
   it** ([redship](https://redship.io/blog/getting-started-on-reddit-the-complete-guide-to-reddit-self-promotion-rules-in-2026),
   [analysis](https://headsrover.io/blog/reddit-self-promotion-rules-by-subreddit-what-11841-communities-actually-say)).
   A zero-karma brand account posting promotional carousels gets removed.
2. **Search policy.** Google: *"using generative AI tools or generate many
   pages without adding value for users may violate Google's spam policy on
   scaled content abuse"*, with rater guidelines 4.6.5/4.6.6 on content
   "created with little to no effort, little to no originality"
   ([Google Search Central](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content),
   updated 2025-12-10). The 65 AI-seeded spot pages are exactly this.
3. **Regulatory.** EU AI Act Art. 50 requires providers of AI systems
   generating synthetic content to mark outputs machine-readably, and
   deployers to disclose AI-generated/manipulated text published to inform
   the public, clearly at first interaction
   ([Art. 50](https://artificialintelligenceact.eu/article/50/)). General
   applicability of the Act is **2 August 2026**. The repo invents five
   human tour creators, review counts and star ratings *in the EU*.

**Verdict:** a vanity-metric generator. Move its budget to one human per
week.

### 1.7 What the market rewards (verified references)

| Precedent | What it proves | Source |
|---|---|---|
| **Nextdoor** â€” 110M+ verified neighbours, 350,000 neighbourhoods, 11 countries, 5M+ claimed business pages, "1 in 3 U.S. households" | Density at *hyperlocal* granularity plus **address verification** as the anti-spam primitive. A neighbourhood with 6 verified people beats a country with 60,000 unverified. Revenue $218M (2023) on a âˆ’$148M net loss: local networks are expensive to run | [about.nextdoor.com](https://about.nextdoor.com/), [Wikipedia](https://en.wikipedia.org/wiki/Nextdoor) |
| **Meetup** â€” 60M+ users, launched 2002, acquired by Bending Spoons 2024 | Value is in *events*, not posts. Founded because Scott Heiferman wanted to meet neighbours after 9/11 | [Wikipedia](https://en.wikipedia.org/wiki/Meetup) |
| **Nomads.com** (ex-Nomad List) â€” 47,154 members, **+4,075 in one month**, 1,500+ city data pages, $19.99 lifetime, 185 meetups/yr, 5,481 meetups held, 58,991 attendees | Grew on **rankable city data + meetups + a $1 spam wall** ("*Just $1 to avoid spammers*"), not social posting. Hosting requires a linked Telegram account; the site even suggests where to host based on member density | [nomads.com](https://nomads.com/), [nomads.com/meetups](https://nomads.com/meetups) |
| **Atlas Obscura** â€” 2009; "Atlas Obscura Societies" local experience groups in 9 cities; CEO Louise Story at a Lisbon event, March 2026 | Editorial quality **plus** a real-world local chapter model. Stated goal: *"Creating a real-world community â€¦ and getting away from their computers to actually see them."* Counter-warning: staff cuts and strategy disputes, Dec 2025 | [Wikipedia](https://en.wikipedia.org/wiki/Atlas_Obscura) |
| **Wikiloc** â€” 11M+ members, 37.9M tracks since 2006, **does not pay contributors**, charges for downloads | 20 years of crowd-gathered trails proves contributor supply is free if the format is standardised and the payoff is status / subscription share, not cash | [Wikipedia](https://en.wikipedia.org/wiki/Wikiloc) |
| **Couchsurfing** â€” 12M registered, 200,000+ cities, Paris claims 493k hosts; CEO turnover + 2013 layoffs; **paywall since 2020** | A huge directory with weak active density. 2026 third-party write-ups: *"A good chunk of the old community left when the paywall arrived"* | [couchsurfing.com](https://www.couchsurfing.com/), [Wikipedia](https://en.wikipedia.org/wiki/Couchsurfing) |
| **Workaway** â€” since 2002, work-for-room-and-board; 2025 press on "volunteering or free labour" risks | The durable successor to Couchsurfing is a **clear exchange of value**, not vibes. Ambiguity is what broke the old model | [Wikipedia](https://en.wikipedia.org/wiki/Workaway) |

**Composite lesson:** each of these won on one specific, human-expensive
mechanic â€” verified identity, real events, rankable data, a standardised
contribution format, or an explicit exchange. None won on post volume.

### 1.8 The 2026 landscape: where travellers actually meet each other

Post-Couchsurfing, the category fragmented. Current options surfaced in
2026 travel coverage and app-store data: **Couchsurfing Hangouts**
(spontaneous same-hour meetups, free tier), **Hostelworld** (in-app city
chat groups, book a bed or not), **Hostelworld/Selina-style** social hostels
that run events as the core product, **Backpackr**, **Travello**, **GAFFL**,
**Nomadtable** (post a plan â€” "dinner at 20:00, 3 going" â€” others join;
4.7â˜…, ~20.6k ratings), **Meetup**, **Eventbrite**, **Bumble BFF**,
**TripBFF**, **Workaway**, **Trustroots**, **NomadHer**, **Fairytrail**.
Sources: aggregated 2026 solo-travel app roundups
([1](https://bubblic.app/blog/best-apps-to-meet-people-while-traveling-solo.html),
[2](https://lostontheroute.com/6-apps-to-help-you-meet-new-people-while-traveling/),
[3](https://nomadtable.app/home/blog/the-6-best-apps-to-meet-people-while-traveling-solo-2026/)).

**The read:** none of these won on *information*. They won on (a) real-time
intent ("I'm doing X at time T, come"), (b) a physical host venue, or
(c) a clear exchange. The information layer is commoditised â€” Google Maps
plus a good creator is free. **Your moat must be provenance + a room, not a
map.** Design implication: your atomic unit is the *meetup*, not the
*post*.

---

## 2. Staged community strategy

Effort figures are **founder + 1 part-time ops**, in hours/week. A beachhead
is a job, not a channel.

### City Health Score (define it before you need it)

```
CHS = 0.30 Ã— (Locals active last 30d / 50)
    + 0.25 Ã— (locally-verified spots / 250)
    + 0.25 Ã— (meetups held last 30d / 8)
    + 0.20 Ã— (meaningful connections last 30d / 100)
```

- **Meaningful connection** = a 1:1 exchange of â‰¥20 messages, or two users
  co-attending a meetup. (Master plan Â§28 already defines this; keep it.)
- **Stage 1 gate:** CHS â‰¥ 60. **City #2 gate:** CHS â‰¥ 70 for two
  consecutive months.

---

### Stage 0 â€” Pre-community (0â€“500 registered, 0â€“2 meetups)

**Goal:** find out whether strangers will talk to each other because of the
app â€” not whether they will download it.

**Tactics**
- Build only four things: real auth, profile, city feed, "I'm here tonight"
  board. No badges, no tours, no merch, no maps beyond the basics.
- Recruit **15 unpaid founding locals** by hand, from the existing pins.
- Run **3 meetups of 6â€“12 people.** Fixed cafÃ©, 60â€“90 min, no pitch, no
  merch, no badge ceremony. One rule: everyone answers *"the one thing in
  this city you would never find on your own."*
- 20 structured in-person interviews (10 locals, 10 travellers), recorded.
- Instrument before recruiting: `signup`, `profile_complete`, `spot_view`,
  `dm_sent`, `dm_accepted`, `meetup_rsvp`, `meetup_attended`.

**Effort:** 15â€“20 h/wk.

**Success metric:** â‰¥2 of 3 meetups with â‰¥6 attendees, **and** â‰¥40% of
attendees not personally invited, **and** â‰¥10 distinct users returning within
14 days of a meetup, **and** â‰¥30% of registered users have sent â‰¥1 stranger
DM.

**Kill criteria:** if, after 3 meetups, fewer than 3 pairs of attendees
sustain a 30+ minute conversation without a founder bridging them, the
"meet locals" wedge is not working. Fall back to a pure utility product
(secret spots + offline maps + scam radar) monetised via B2B listings and
affiliate. Do not hire ambassadors. Do not open a second city.

---

### Stage 1 â€” One-city beachhead (500â€“3,000 registered, 50 Founding Locals, 6â€“8 meetups/month)

**Goal:** prove the local supply loop runs **without** the founder in the
room. If the founder must host every meetup, you have a hobby, not a
product.

**Tactics**
- Founding Local program at scale (Â§5): 50 named, vetted,
  obligation-bound locals.
- Two recurring weekly meetups (a walk; a food/hobby meetup) plus one
  monthly themed. Founding Locals co-host; you attend, then you stop.
- **The local-publishes rule:** AI may *draft* for a local; a local must
  *edit and press publish*. Never the reverse. Provenance stored per item.
- Weekly local drop: one newly verified spot, one Founding Local profile,
  one meetup. Three posts/week, human-written, local named.
- Owned channels: a public Discord (per city), one WhatsApp group (ops +
  locals), subreddit participation, one local newsletter, one Facebook
  Group.
- B2B pilot: 20 paid local business listings in Lisbon (tascas, surf
  schools, repair shops, cafÃ©s). This funds the meetups and gives locals a
  second reason to keep the app open.
- 10 nano/micro creators seeded per month (Â§7).

**Effort:** 25â€“35 h/wk.

**Success metric:** CHS â‰¥ 60; â‰¥40 of 50 Founding Locals have submitted â‰¥1
verified spot; â‰¥6 meetups/month with â‰¥8 attendees **without** founder
presence in at least half of them; â‰¥25% of meetup attendees are app users
who met another app user; travellerâ†’local contribution ratio better than
1.5:1.

**Kill criteria:** at day 90, if <15 Founding Locals have contributed
anything, or <3 meetups/month happen without you, **do not open city #2**.
Either fix the playbook (re-recruit, change the incentive, change the
format) or stop at Lisbon. Opening city #2 at CHS 40 doubles the failure
surface while halving your attention.

---

### Stage 2 â€” Multi-city (3â€“5 cities, 10kâ€“30k MAU)

**Goal:** prove the playbook is transferable by people who are not the
founder.

**Tactics**
- Recruit a paid **City Lead** per city (â‚¬600â€“1,200/month) from the
  strongest existing Founding Locals. This is the only test that matters: a
  founder-run playbook is not a playbook.
- Write `CITY_LAUNCH_PLAYBOOK.md` from Stage 1 while it is fresh, and
  version it. Nothing else in this repo is documented; this must be.
- Federate rather than centralise: each city gets its own Discord,
  subreddit presence and Facebook Group. Cross-promotion happens *inside
  the app*, never on the brand's channels.
- Gate every new city on CHS â‰¥ 70 **and** a named City Lead **before** a
  single AI spot is seeded there.
- Travel-side acquisition: creator collaborations tied to city launches.
  The German outbound market (Â§11) is the beachhead's natural second funnel.

**Effort:** 40â€“60 h/wk plus City Leads.

**Success metric:** â‰¥3 cities independently running â‰¥8 meetups/month;
time-to-first-meetup in a new city â‰¤21 days; D30 retention â‰¥35% in at
least 2 cities; â‰¥1 City Lead per city.

**Kill criteria:** if city #2 takes >60 days to reach city #1's Stage-1
numbers, the model is founder-bound. Stop expanding, spend two months on
the ops manual, then try once more.

---

### Stage 3 â€” Scale (30kâ€“150k MAU, 12â€“20 cities)

**Goal:** make growth self-funding, and be honest if it isn't.

**Tactics**
- Switch on paid acquisition **only** where D30 â‰¥35%. Below that you are
  buying churn.
- Revenue stack: local business listings, university/association (Taglit-
  style) group hubs, tour affiliate, Premium, print-on-demand scratchbooks.
  Respect the plan's own legal boundary â€” no P2P payment processing, so
  meetups and tours stay unpaid on-platform.
- Moderator bench of 4â€“6, one per 3 cities, paid.
- One annual city flagship â€” an "Obscura"-style single-day, local-led
  walk â€” as the PR engine, not ads.

**Effort:** 80+ h/wk, or a 4â€“6 person community team.

**Success metric:** >50% of new users from organic/referral; D30 â‰¥30% in
mature cities; â‰¥1 paid ambassador per 1,500 MAU; â‰¥25% of revenue from B2B
so the network is not a merch-margin hobby subsidised by a logo.

**Kill criteria:** MAU flat under 25k for two consecutive quarters â†’ you
have a profitable niche studio, not a network. Monetise accordingly and
stop calling it a network.

---

## 3. City #1: Lisboa â€” the data

**Decision: Greater Lisbon + Ericeira/Sintra/NazarÃ© day-belt. Portugal.**

| Criterion | Evidence |
|---|---|
| **Only real seed cluster exists** | Portugal has 5 pins (NazarÃ©, Alfama/Lisboa, Praia da Ursa, Sintra Waldkloster, Ponta do Ruivo) + `Lisbon` and `Ericeira` city entries = **~7 of 65 assets (11%) in one metro**. Japan's 6 pins sit in 4 different regions (Kyoto Ã—2, Wakayama, Nagano, Yakushima). Every other country has 1â€“3 pins in 1â€“2 places. The data layer is already a Lisbon-shaped brochure |
| **Only city brain exists** | `seeded_cities/lissabon-brain.json` is the single city brain: 5 baseline spots, 3 pet highlights, 3 family highlights, 2 recipes â€” all `ai_provider: "static-fallback"`, i.e. free to upgrade |
| **Pre-existing, dated inbound surge** | Nomads.com shows **Lisbon at 20,608 people arriving Sep 25 â€“ Nov 6 2026** (ranked #8 of 30 destinations, above Madrid 15,315 and Valencia 14,007). Berlin 22,726 and Barcelona 22,170 are comparable â€” but Lisbon is the one where your niche is actually dense. That is a 6-week window of guaranteed physical presence to aim at ([nomads.com](https://nomads.com/)) |
| **Niche density, not just tourist density** | Your differentiator is pet- and stroller-filters. Greater Lisbon gives you: Praia da Ursa (dog beach), Monsanto (dog off-leash + training area), Ericeira (**World Surfing Reserve** â€” a dense, mobilised surf community, 40 min from the airport), NazarÃ© surf town, Sintra. Ericeira is a *recruiting pool you can walk into*, not an audience you must buy |
| **Permanent transient English-speaking population** | Portugal's digital-nomad visa put Ericeira/Peniche/Lisbon on the nomad map; Nomads.com, a Lisbon-adjacent product, has 47,154 paying members at $19.99. These are exactly your "local with a hobby" side of the marketplace, and they are there in February |
| **German demand, high LTV** | FUR Reiseanalyse 2026: **57.1M Germans took â‰¥1 holiday trip of 5+ days in 2025** (record), **â‚¬91.7bn spend**; 80.5% of the population takes a 5+ day trip. Germany is one of the top Portuguese inbound markets. Build the beachhead in English (Ericeira expat layer), then layer a German surface in Stage 1b â€” do *not* build in German from day one |
| **Operational cost** | Meetups, printing, and a part-time local ops hire cost roughly half of Berlin or Barcelona |

**Considered and rejected**

- **Berlin** â€” highest German density and Nomads.com's #2 destination
  (22,726), but you cannot run Berlin meetups from Portugal, rents are
  high, and starting in German slows learning to 1.0 speed. Revisit at
  Stage 3.
- **Mallorca** â€” appears in the Instagram drafts but has **zero** pins, no
  city brain, and is seasonal. Content-only. Rejected.
- **Tbilisi** â€” cheapest, Nomads.com's #7 (21,398), genuinely interesting.
  But a Founding Local program needs a stable, reachable, English-capable
  local class; language and payment friction add 3â€“6 months. Stage 2
  candidate.
- **Kyoto / Barcelona / ReykjavÃ­k** â€” 6â€“8 pins each but no cluster, heavy
  competition, and expensive. Stage 2/3.
- **Ericeira standalone** â€” too small to be a beachhead, but it is the
  Stage-1b satellite: recruit Founding Locals there, run surf+dog meetups,
  treat it as a feeder town.

**Scope definition for Lisbon metro:** Lisbon, Sintra, Cascais, Ericeira,
Peniche, NazarÃ©, SetÃºbal, Almada. One Discord, one subreddit presence, one
WhatsApp ops group, one CHS. Not "Portugal."

---

## 4. 90-day "City #1 Beachhead" plan â€” Lisboa

Weekly milestones, each with a **binary end-of-week test**. If a week
fails its test, you do not advance â€” you repeat the week.

### Pre-week 0 (before day 1) â€” the unblockers, ~2 days

- Ship provenance fields on spots; delete the 10 fictional tours, the
  `total/taken` arrays, the auto-5-star in `hermes_community_extender.js`,
  and the hardcoded Lisbon-centroid default.
- Rotate the two leaked API keys; move all keys to `.env`.
- Deploy real auth (Supabase auth + RLS **policies**). Without identity
  there is no community and no metric.
- Instrument: PostHog or Plausible + the 7 events in Â§2 Stage 0.
- Publish `/lisboa`: a real map of ~30 real spots, each visibly marked
  **"AI seed â€” not yet verified by a local."**

---

### Weeks 1â€“2 â€” Recruit the supply side by hand

| Wk | Actions | Binary test |
|---|---|---|
| **1** | Recruit **5 Founding Locals in person**: 3 in Ericeira (surf school reception, a cafÃ© owner, a coworking space), 2 in Lisbon (an Alfama cafÃ©, a dog-friendly tasca). 45 min each, coffee on you. Each gets a walkthrough on *your* phone, the unverified-spot work queue filtered to their neighbourhood, and the offer. Set up a **WhatsApp group** for the 5 and create the Discord. Post zero promotion anywhere. | â‰¥5 said yes, â‰¥3 submitted a first spot, WhatsApp has â‰¥4 active members |
| **2** | Recruit 5 more (target 10). Write the first **3 real posts** from 3 of them (their words, lightly edited, credited, profile linked). Set up `r/Lisbon` + `r/Portugal` and a Lisbon expat/surf Facebook Group as *participants only* â€” comment helpfully on 10 threads, post nothing. Run **Meetup #1**: Thu 19:00, 8 max, fixed Alfama cafÃ©, 75 min, one question on the table: *"the one thing here you'd never find on your own."* | Meetup #1 held with â‰¥6 attendees, â‰¥3 not personally invited, â‰¥2 pairs talking without you bridging |

**Exit gate weeks 1â€“2:** Meetup #1 and #2 both held, â‰¥6 attendees each,
â‰¥10 Founding Locals signed.

---

### Weeks 3â€“6 â€” First loop closed (locals contribute â†’ travellers show)

| Wk | Actions | Binary test |
|---|---|---|
| **3** | Ship **"Claim/Verify this spot"**: every AI seed is a work item; a local claims it, corrects the text, it flips to **"verified by Maria, 12 Oct"**. 20 Founding Locals Ã— 3 spots â†’ target 60 verified. Run **Meetup #2** (a walk, not a cafÃ©). Open the Discord properly: `#local-spot-drops`, `#meetups`, `#help`. | â‰¥40 spots locally verified; â‰¥15 Discord weekly-actives; Meetup #2 â‰¥8 attendees |
| **4** | First **traveller-side** push, deliberately unglamorous: 15 Founding Locals each send 3 hand-written DMs to travellers/hosts they know ("I'm testing a thing â€” here's what Lisbon is really like, free, tell me what's wrong with it"). Not a blast. Run **Meetup #3**. Turn on **signup-source UTMs** and never again run a week without them. | â‰¥25 traveller accounts; â‰¥10 from a personal DM; signupâ†’profile_complete â‰¥50% |
| **5** | **Micro-creator wave 1:** 5 nano/micro creators visit a real spot and post in **their own words** â€” you supply no scripts. Unique code + QR. Collect the 20 questions they got asked; that is your next content. Run **Meetup #4** plus the first **Ericeira satellite** surf meetup. | â‰¥5 creator posts live; â‰¥40 signups attributed; â‰¥1 post has a stranger asking how to join |
| **6** | Ship **badges, redesigned: 12 total**, none earnable without a stranger's acknowledgement (Â§6). First **B2B listings**: 10 Lisbon businesses at â‚¬29/mo. Founder **stops co-hosting** â€” a Founding Local runs Meetup #5, you attend as a guest. | Meetup #5 hosted by a local, no founder nudge; 10 B2B listings live; â‰¥150 cumulative registered |

**Exit gate week 6:** CHS â‰¥ 30, â‰¥10 verified contributors, â‰¥5 meetups held,
â‰¥150 registered, and â€” the real one â€” **â‰¥10 pairs of app users have talked
or met**.

---

### Weeks 7â€“10 â€” Repeatability (founder out of the room)

| Wk | Actions | Binary test |
|---|---|---|
| **7** | Convert the 10 strongest locals into **paid Founding Locals** (â‚¬25/mo stipend). Formalise the obligation sheet and the 1-month probation. Start **Meetup #6 and #7 as a recurring weekly slot** â€” same day, same place, same time. Repetition creates a community; novelty creates an event. | 10 stipend agreements signed; â‰¥2 meetups run by locals with no founder nudge |
| **8** | **Micro-creator wave 2** (8 creators) + first **newsletter** issue ("The Lisbon this week, from 6 locals"). Open a **German-language surface**: one weekly German post for German-language threads + a German newsletter partner. Target 500 German-language signups. | â‰¥350 cumulative registered; â‰¥50 German-language signups; â‰¥2 press/mention items |
| **9** | Ship the **"I'm Here tonight"** board + **DMâ†’meetup conversion** (match + time + place in one tap, no chat required). Highest-leverage product change of the quarter. Audit provenance coverage, moderation queue and new-account rate limits. | â‰¥40 "I'm here" posts in 14 days; â‰¥15 user-created meetups; 0 unreviewed reports >24h old |
| **10** | **Review + renew.** Which 5 locals did 80% of the work? Pay them more, promote them, make them mentors. Which 3 meetup formats worked? Kill the rest. Draft `CITY_LAUNCH_PLAYBOOK.md` v1 â€” you are 4 weeks from the day-90 decision. | CHS â‰¥ 45; playbook drafted; â‰¥1 local mentor with 3 mentees |

---

### Weeks 11â€“13 â€” Decide, and prepare (or stop)

| Wk | Actions | Binary test |
|---|---|---|
| **11** | **Day-90 decision gate.** Publish the real numbers (registered, WAU, D30, locals, verified spots, meetups, meaningful connections) in `CITY_LAUNCH_PLAYBOOK.md`. CHS â‰¥ 60 â†’ continue Stage 1. CHS 30â€“60 â†’ fix the weakest term (usually meetups) for 30 more days. CHS < 30 â†’ **stop; do not open city #2**; pivot to the utility + B2B model. | Decision recorded in writing, with numbers |
| **12** | If continuing: 25 Founding Locals active, 8 meetups/month, second B2B cohort (20 listings), second Ericeira satellite, and a **City Lead candidate** promoted from the bench (â‚¬800/mo from Week 13). | 8 meetups scheduled for the next 30 days; â‰¥25 active locals |
| **13** | **Stage 2 dry run:** hand one neighbourhood (Ericeira) entirely to the prospective City Lead with the written playbook and no founder presence. Instrument separately. This is the experiment that tells you whether you have a product or a habit. | Ericeira runs â‰¥2 meetups and â‰¥15 spot verifications in 14 days with zero founder involvement |

**Day-90 success definition â€” all must hold:**

1. â‰¥1,500 registered Â· 2. â‰¥300 WAU Â· 3. â‰¥40 Founding Locals Â·
4. â‰¥120 locally verified spots Â· 5. â‰¥20 meetups held Â·
6. â‰¥40% of meetup attendees not personally invited Â·
7. â‰¥15% of registered users sent â‰¥1 stranger DM Â·
8. **â‰¥60 pairs of app users have met or exchanged â‰¥20 messages** Â·
9. D30 â‰¥22% Â· 10. â‰¥8 paying local businesses

If fewer than 6 of those 10 hold, the beachhead did not work. The correct
action is to keep it small and monetise B2B â€” not to raise money for a
multi-city launch on the strength of an AI content engine.

---

## 5. The Founding Local ambassador program

**50 slots for Lisbon.** Not 100. The master plan says "recruit 100
passionate locals"; 100 is an unfalsifiable target you are never audited
against, and it triples the stipend bill before you know whether locals
contribute at all. 50 is two per week for 25 weeks, and you can name every
one of them on a page.

### What they get

| Benefit | Why it works |
|---|---|
| **Lifetime free Premium** (not a trial) | Removes the Couchsurfing failure mode â€” the paywall is what drove the 2020 exodus |
| **"Founding Local" badge â€” revocable, status-contingent** | The real reward: permanent, number-stamped (#01â€“#50), non-transferable, and **removed** after 60 days inactive or on a pledge breach. Status that can be lost is status |
| **â‚¬25/month "local stipend"** â€” framed as a coffee budget, not a salary (50 Ã— â‚¬25 = â‚¬1,250/mo) | Material enough to create an obligation, small enough to avoid payroll. The â‚¬ removes the objection; the badge is the motivation |
| **First look** at every feature and at each new neighbourhood's spot queue | Early adopters want access, not money |
| **1 print scratchbook/year** + merch when it exists | Consumes the 460-badge inventory already built |
| **A profile page that converts**: their own list, their face, their name on every spot they verified | The only durable benefit â€” a portable reputation asset |
| **1 free partner-event ticket/month** | Recirculates them into the ecosystem |
| **A vote** on which neighbourhoods get seeded next | Ownership |

### What they owe (write it down â€” this is the whole program)

- **1 verified spot per month**, minimum 3 in the first 90 days. "Verified"
  means: coordinates corrected, text corrected, what is true *now* added,
  one photo they took. Not a like.
- **1 meetup per 6 weeks** â€” co-host or attend, plus a 20-minute "ask me
  anything about this city" segment.
- **1 correction of AI-seeded content per month** in their area. This is the
  flywheel your master plan already described (Â§3: *"AI populates the
  baseline â†’ real locals join and verify, correct, or claim"*) â€” you are
  simply making the contract explicit and paying for it.
- **48-hour DM response rate â‰¥80%** for traveller requests in their area.
- **Honour the etiquette pledge** (already modelled as
  `secret_spots.etiquette_pledge_required`) including the specific clause:
  do not send tourists to places that tourists will ruin.
- **Accept badge revocation** for inactivity or violations. No appeals
  committee.
- **No payment processing on-platform** (master plan Â§2) â€” meetups are free
  to organise and settle privately.

### Recruitment â€” five sources, in this order

1. **Physical recruiting in the existing seed.** Ericeira surf schools and
   cafÃ©s, Alfama tasca owners, Monsanto dog-park regulars, Sintra and NazarÃ©
   surf shops, Lisbon co-working desks. You already have 7 real places; go
   stand in front of them.
2. **Local online, as a participant first:** `r/Lisbon`, `r/Portugal`,
   `r/digitalnomad`, Lisbon expat and pet-owner Facebook Groups, the
   Ericeira surf community. Comment helpfully for two weeks *before* you
   ever mention the product. Never DM strangers about your app.
3. **Venue partnerships â€” the highest-yield channel.** 5 hostels/social
   hostels and 3 surf schools co-promote; you get a warm intro list and
   they get footfall. This is exactly how Nomads.com works: meetup hosts
   need a connected Telegram account and the platform even suggests where
   to host based on member density ([nomads.com/meetups](https://nomads.com/meetups)).
4. **Local newsletters and micro-creators** (5kâ€“50k) â€” 8 personal DMs from a
   human, not a form. Offer Founding Local status, not money.
5. **The in-app application** with a 60-second video, launched only once you
   have 15 members to recruit from. Never launch an application form at
   zero; applications from strangers are a vanity metric.

### Screening â€” five gates, in order

1. Lives in the metro â‰¥12 months (residence, not a holiday rental).
2. One hobby in the taxonomy, demonstrably done in the last 30 days.
3. A 15-minute video call with the founder. Ask: *"what's a place here
   you'd be annoyed to see on TripAdvisor?"* If the answer is nothing, end
   it.
4. Signs the etiquette pledge.
5. A **one-month probation**: one spot submitted, one meetup attended. Only
   then paid status. The probation is the single most important filter â€” it
   is exactly what today's automation lacks, because it has no probation and
   therefore auto-passes everyone.

### Platform and tooling

- **System of record:** the app (Founding Local directory + spot-verification
  queue). Do not run the program on Discord â€” you cannot gate content, DM,
  export, or delete an account.
- **Ops:** a **WhatsApp Community** (announcement-only, one-way) plus a
  **WhatsApp group** for the 50, because that is what Portuguese locals
  actually use. Weekly, not daily.
- **Roster/CRM:** Airtable or Notion â€” name, neighbourhood, hobbies, joined
  date, spots submitted, last active, meetups hosted, stipend paid. The only
  two columns that matter are *spots submitted* and *last active*.
- **Work queue:** the unverified-spot list filtered by their neighbourhood,
  as a shared view. This is what makes the job feel like work, not charity.
- **Pulse:** a 4-question monthly form, answerable in 30 seconds.
- **Leaderboard:** ranked by **neighbourhood coverage** (which of the ~24
  Lisbon neighbourhoods still has no verified local), not likes. That makes
  the work additive rather than competitive.
- **Identity:** Founding Locals get phone + ID verification (Stripe Identity
  or Jumio, per master plan Â§8). **Travellers never do** â€” friction at the
  traveller funnel is fatal.

---

## 6. Flywheel design: turning existing features into community hooks

The features exist. Almost none of them currently *require* another human,
so almost none of them create a network. The fix is the same in every case:
**make the feature structurally impossible to complete alone.**

### The loop you want

```
LOCAL CONTRIBUTION â†’ VERIFIED CONTENT â†’ TRAVELLER ACTION
   (a named person)    (provenance shown)   (a real visit)
        â†‘                                        â”‚
        â”‚                                        â†“
   TRIP SCRATCHBOOK  â†  MEETUP  â†  A STRANGER, NOT A BRAND
   (auto-post, names)   (a room)       (DM â†’ match â†’ meetup)
```

Compare with today: `tours` (no one), `badges` (no one), `storyPins` (no
one), `local_recipes` with `"chef": "Maria (Local, Alfama)"` (no Maria).
Everything in the product is authored by nobody.

### Feature-by-feature

| Feature | Today | The hook that makes it social |
|---|---|---|
| **Secret spots** | 65 AI rows, no source | Add `source_type` (`ai_seeded` \| `local_submitted`), `verified_by` (user id), `verified_at`. **The map becomes a work queue.** "Claim this spot" is the most important community mechanic you can ship, because it converts your biggest liability (65 unverified pins) into 65 open tasks. A verified spot must show a face and a name |
| **Badges** | 460 decorative badges | **Cut to 12.** No badge is awarded without a stranger's acknowledgement â€” e.g. *"Maria vouched for this dog beach"* requires 3 vouches from users who geofence-confirmed they were there. A badge nobody can witness is a sticker. This is your only "I was there" primitive; make it scarce and social |
| **Scratchbook** | `people_met` as a JSON blob, `is_public: false` | Auto-publish the post-trip post **only if â‰¥1 real person is named**, and render it as a card in the city feed. The post-trip artefact is what makes a new user want to be where the existing users are. Highest-leverage social feature you already have, currently switched off |
| **Hobby DNA matching** | "130 hobbies", no mutual consent, no time | Make it **mutual, opt-in, time-bounded**: *"3 people near you who want to do exactly this on Saturday at 10:00."* No daily swipe feed. Then one-tap conversion: match â†’ place â†’ RSVP. Nomadtable's entire product is that sentence |
| **AI concierge** | Answers from nothing | Restrict to the **local-verified corpus only**; cite the local who contributed each fact ("per Maria, checked Oct 2026"); label it; route to a human when it has no verified answer. Trust feature, differentiator, and Art. 50 mitigation in one |
| **Tours** | 10 fictional tours (88-178 invented reviews each) | **Delete.** Replace with *"Founding Local walks"*: a real person, a real date, 8-person cap, RSVP'd, free, no on-platform payment (keeps you out of PSD2 scope, master plan Â§2). A tour is a meetup with a route |
| **Stories** | 24h content concept | Make it **explicitly the anti-feed**: one story per spot, written by a local, 24h expiry, never AI-generated. If any automated content exists anywhere in the product, Stories is where it is banned |
| **Passport / stamps** | Gamified, solitary | Put **city liveness** next to progress: "collected in a city where 3 people are active." A stamp in a dead city should feel dead |
| **Scam radar** | Geo-fence warnings | Make it a **civic contribution**: a local confirms or corrects a warning and is credited. Safety is where a local's incentive and yours align most perfectly â€” use it |

### Anti-patterns

- **Do not** let the AI write a local's post body and publish it under their
  name. Drafting is fine; publishing unedited is not.
- **Do not** let a brand-authored "Scratch'n'Travel recommends" post appear
  in the city feed. The feed is only worth reading if everything in it has a
  human byline.
- **Do not** let a badge be earnable by activity alone. Badges must encode a
  human attestation.

---

## 7. Channel strategy with realistic expectations

### Tier 1 â€” actually drives signups (descending expected yield)

1. **Meetups, and the people who bring them.** Highest yield by a wide
   margin. Nomads.com: 5,481 meetups, 58,991 attendees, 47,154 paying
   members. Meetup: 60M+ users, built on this alone. Everything else is
   downstream of this.
2. **Personal DMs from Founding Locals.** Slow, then compounding. 15 locals Ã—
   3 DMs = 45 warm signups/week at a ~40% trust transfer rate. No channel
   beats a named person's recommendation.
3. **Venue and hostel partnerships.** The partner's audience is
   pre-qualified and pre-grouped. 8 venues in Lisbon.
4. **Reddit participation** â€” 4â€“6 h/week, never promotional. `r/Lisbon`,
   `r/Portugal`, `r/portugal`, `r/solotravel`, `r/digitalnomad`, `r/onebag`,
   `r/surf`, `r/vanlife` (Ericeira); for the German surface `r/AskAGerman`
   (German-language, correct flair, only in a thread where the question is
   already asked). Rules: ~1 promotion per 9 contributions, disclose
   affiliation every time, read each sub's own rules before posting, never
   post links from a new account
   ([redship 2026 guide](https://redship.io/blog/getting-started-on-reddit-the-complete-guide-to-reddit-self-promotion-rules-in-2026)).
   **Avoid r/travel and r/TravelNoPics** â€” instant removal, not worth the domain.
5. **Facebook Groups** â€” the actual 2026 local layer: Lisbon expat groups,
   "Ericeira Surf Community", "Lisboa com BebÃ©s e CrianÃ§as", "Hunde in
   Portugal", "Dogs in Lisbon". Join, answer questions, post meetup details
   with the organiser's real name.
6. **Forums:** `solotravel.cc` (German solo-travel forum, small and real),
   `HolidayCheck` Reiseforum, TripAdvisor DE (Tripinfos), `travelamigos.de`,
   `reisefuchsforum.de`, `weltreise-info.de`. 15-year-old, low-traffic,
   high-intent: single-digit signups, near-100% retention.
7. **SEO city pages â€” the Nomads.com lesson, and the most underrated channel
   available to you.** Nomads.com built 1,500+ rankable city data pages and
   47,154 paying members. This works *only* if the page is genuinely useful
   (a real dog-friendly map, real opening hours, real local notes) â€” 1,500
   AI spot pages is exactly what Google's scaled-content-abuse policy
   targets ([Google](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)).
   Do `/lisboa`, `/ericeira`, `/porto`, `/faro`: four excellent pages beat
   1,500 thin ones.
8. **Local newsletter partnerships and podcast guest slots.** Free, local,
   converts. Time Out Lisboa, Lisbonist, Portuguese travel podcasts.

### Tier 2 â€” mixed, use selectively

- **Instagram/TikTok via nano and micro creators only** (Â§7 tiering). Own
  accounts posting brand carousels: near-zero. Creator visits: real.
- **YouTube:** a 6â€“12 month channel, not a quarter-one one.
- **PR:** the annual Founding Local walk, pitched as "anti-overtourism, built
  by locals" â€” the only angle a Lisbon or Porto local journalist will run.

### Tier 3 â€” vanity, budget zero

- The brand's own Instagram/TikTok/X accounts (the AI-carousel engine).
- **Pinterest** â€” the repo already generates pins; they will not sign up a
  single person for a social travel network.
- **LinkedIn** â€” the repo's own "Lissabon mit Kind & Hund" LinkedIn post is
  a category error. There is no buying decision here.
- **Meta / Google ads** before D30 â‰¥35%. You are buying churn.
- **The AI blog / SEOMaster** â€” 65 thin pages, now a policy liability.

### Influencer tiering (2026 benchmarks)

Vendor-reported figures, directional only
([InfluenceFlow](https://influenceflow.io/home/resources/influencer-marketing/influencer-marketing-benchmarks-real-rates-roi-platform-comparison-data-2026/),
[Bizkol](https://bizkol.ai/blog/influencer-marketing-statistics),
[Influencer Marketing Hub](https://influencermarketinghub.com/influencer-rates/how-much-do-influencers-really-cost-in-2026/)):

| Tier | Followers | Engagement | Cost/post | Verdict for you |
|---|---|---|---|---|
| **Nano** | 1kâ€“10k | IG 2.7â€“3.9%; TikTok 8.3â€“10.3% | median campaign ~$134; ~$150â€“500/post | **Your only paid tier in Stage 1.** â‚¬0â€“150 + free Premium + Founding Local status |
| **Micro** | 10kâ€“100k | IG ~3.2% avg | $150â€“500 | 10 max, and only if they will actually show up |
| **Mid** | 100kâ€“500k | declining | $1,000â€“20,000 | **0** until D30 > 35% |
| **Macro/Mega** | 500k+ | IG 0.8â€“1.2% | $10,000â€“50,000 | **Never.** ~3Ã— less engagement at ~60% higher cost |

Program rules:
- **No script, no caption, no brief** beyond "visit it, say what you
  thought." A creator with a script produces content indistinguishable from
  the AI engine, which defeats the entire strategy.
- Product in hand, unique code + QR, 12 months free Premium.
- **Mandatory first-visit condition:** the creator must actually go to the
  spot in the first 30 days and post from it. No visit, no payment.
- Pay a â‚¬150 base for the visit plus a per-attributed-signup bonus (code/QR).
  Never pay for reach.
- Recruit Portuguese- and German-language creators first; Ericeira's English
  expat creators are cheaper and more credible.

### Hashtags and naming

Stop using 8 generic travel hashtags. Use **2 hyper-specific + 1 branded**:
`#PraiaDaUrsa`, `#Ericeira`, `#LisboaSecreta`, `#ScratchNTravel`. The repo's
current sets (`#hiddengems #secretspots #wanderlust #reisenmachtglÃ¼cklich`)
are the vocabulary of nobody.

---

## 8. Anti-fake-community safeguards

The goal: make it **structurally impossible** for the product to claim
social proof it does not have, and easy for a user to tell who is human.

### S1 â€” Provenance on everything (the big one, 1 day)

Add to every content row, no exceptions:
```
source_type      ai_seeded | local_submitted | imported_public | business_listed
verified_by      <profiles.id>   -- nullable ONLY if source_type = ai_seeded
verified_at      timestamptz
provenance_note  text           -- e.g. "corrected: beach is closed Oct-Jun"
```
UI rule: **every AI-seeded spot renders a visible "AI seed â€” not yet
verified by a local" state.** This does three things at once: it removes the
false claim, it exposes the 65-pin backlog as a to-do list, and it gives
locals a reason to open the app. A liability becomes the core mechanic.

### S2 â€” Break the automation's ability to publish (half a day)

- No code path may publish in-product from `social_campaigns/*.json`,
  `hermes_travel_seeder.js`, or `hermes_daily_spots_generator.js`. Add a CI
  test that fails if any admin/seed path writes without a `created_by`.
- The API must **reject** a submission missing `created_by` or `source_type`.
  This one change kills the entire auto-verify class of bug.
- Delete `rating: 5.0`, the `'Community Explorer'` default, and the
  Lisbon-centroid default coordinates.

### S3 â€” Purge the fabrications (half a day, non-negotiable)

- Delete the 8 fictional `tours` with their 88â€“156 invented reviews.
- Delete `total` / `taken` from `cities[]`. Fake scarcity is a dark pattern.
- Any spot with a `"chef"` who is not a real user: either remove the name or
  make it an unattributed recipe.
- Either delete `HERMES_WEEKLY_REFLECTION_DIGEST.md` and the
  `health_score` / `confidence_score` fields, or replace them with actual
  analytics. A self-generated "Confidence Score 0.94" about a product with
  zero users is a governance failure that an investor or co-founder will
  find, and it will cost more trust than the file ever earned.

### S4 â€” Disclose AI where the law requires it (1 hour)

EU AI Act Art. 50 requires machine-readable marking of synthetic output by
providers, and clear disclosure at first interaction for AI-generated or
manipulated text published to inform the public; the Act generally applies
from **2 August 2026** ([Art. 50](https://artificialintelligenceact.eu/article/50/)).
Minimum compliant implementation: a visible "KI-generiert / AI-assisted"
label on every AI-seeded item and every AI concierge answer, a
`provenance` field in the payload, and an obvious correction path for
locals. Do this now, while it is cheap â€” retrofitting disclosure across 65
pages and a content model is not.

### S5 â€” Moderation stack (build the minimum, in this order)

1. **One-click report** on every user-generated object, from day one. Your
   own `community-posts-feedback` skill already says this: *"Melde-Funktion
   fÃ¼r Posts/Kommentare von Anfang an einplanen, nicht nachtrÃ¤glich."*
2. **A 3-state provenance on every item** (Â§S1) plus a **trust score** per
   account derived from it (spots verified, meetups hosted, report rate,
   tenure). Show the trust score; make it contestable.
3. **Rate limits for new accounts:** 3 posts/day, 1 DM per 10 min, no spot
   submission without a completed profile. Most spam dies here.
4. **DM gate:** no outbound DM without an accepted connection request. This
   is the single most important anti-harassment control for a
   meet-strangers product, and it also protects locals.
5. **Human in the loop:** one 60-minute moderation review per week, from
   week 1, not after the first incident. Queue: reports first, then
   lowest-trust-account posts.
6. **Founding Locals get ID verification (Stripe Identity / Jumio).
   Travellers do not.** Never gate the top of the funnel.
7. **Status transparency** for reports â€” the requester sees "received /
   reviewing / actioned". Your own skill flags this as a large trust lever.
8. **Three-strike system with published rules**, and a public mod log in
   spirit (transparency is a Lemmy/fediverse norm and cheap to adopt).

### S6 â€” Cultural safeguards

- **Community guidelines shown in onboarding**, short, not a legal doc
  hidden in the footer.
- **A written anti-instagram clause:** *"Do not send people to a place that
  cannot take them."* Every Founding Local signs the etiquette pledge
  (already modelled as `etiquette_pledge_required`).
- **A "no engagement bait, no follower farming" rule** stated where
  creators read it. It is the boundary between your creator program and the
  spam economy.

### S7 â€” The governance rule

**No metric may be published unless it is computed from a query.** Every
number in every digest, README and pitch deck must have a source. If you
cannot produce the SQL, you may not say the number. This is the cheapest and
most durable of all these safeguards.

---

## 9. Ten actions for next week, ranked by impact Ã· effort

| # | Action | Effort | Impact | Why this order |
|---|---|---|---|---|
| **1** | **Provenance + purge the fabrications.** Add `source_type` / `verified_by` / `verified_at`; render "AI seed â€” not verified by a local" on all 65 spots; delete the 10 fictional tours; delete `total`/`taken`; delete `rating: 5.0`, the `'Community Explorer'` author and the Lisbon-centroid default from `hermes_community_extender.js`; make the API reject submissions without `created_by`. | 1 day | **â˜…â˜…â˜…â˜…â˜…** | Highest ratio in the list. Removes the repo's most dangerous artifact, converts 65 liabilities into 65 tasks, and is a prerequisite for recruiting anyone credible |
| **2** | **Kill the machine's publish path and rotate the keys.** Move the hardcoded Requesty and Zenmux keys out of `hermes_social_growth_engine.js` into `.env`, rotate both, add a CI test that no seed path can write without `created_by`. | 30 min | **â˜…â˜…â˜…â˜…â˜…** | Security + stops the bleeding. Unattended cron is spending money to generate content nobody publishes |
| **3** | **Commit to Lisboa in writing.** One page: metro boundary, CHS definition, day-90 kill criteria, and the sentence "we do not open city #2 until CHS â‰¥ 60." Delete the other 11 cities from the roadmap and from `cities[]`. | 30 min | **â˜…â˜…â˜…â˜…â˜…** | Every day with 24 candidate cities is a day of zero density. Nextdoor's 350,000 neighbourhoods are the lesson; your 65 pins across 25 countries is the anti-lesson |
| **4** | **Recruit 5 Founding Locals in person this week.** Ericeira: 2 surf school staff, 1 cafÃ© owner. Lisbon: 1 Alfama cafÃ©, 1 dog-friendly tasca. 45 min each, coffee on you, app walkthrough on your phone, unverified-spot work queue filtered to their neighbourhood. | 4 h | **â˜…â˜…â˜…â˜…â˜…** | The only activity here that creates the asset. Nothing else matters if this doesn't happen |
| **5** | **Write the Founding Local offer, obligation sheet and vetting script; put them on a public URL.** 50 slots, â‚¬25/mo, lifetime Premium, revocable numbered badge, 1 spot/month, 1 meetup/6 weeks, 1-month probation. | 3 h | **â˜…â˜…â˜…â˜…â˜†** | Multiplies #4. You cannot recruit 50 people one conversation at a time without a written offer they can forward |
| **6** | **Instrument.** PostHog or Plausible + 7 events (`signup`, `profile_complete`, `spot_view`, `dm_sent`, `dm_accepted`, `meetup_rsvp`, `meetup_attended`) + UTM discipline on every link. | 3 h | **â˜…â˜…â˜…â˜…â˜†** | Without this every subsequent decision is a guess, and you cannot evaluate the day-90 gate |
| **7** | **Ship "Claim/Verify this spot."** A real work queue, a real claim flow, a real profile link, a visible state change. | 1 day | **â˜…â˜…â˜…â˜…â˜†** | The mechanic that makes the strategy self-reinforcing: 65 open tasks â†’ 65 verified spots â†’ 65 reasons for a local to keep the app open |
| **8** | **Run Meetup #1.** Thu 19:00, 8-person cap, fixed Alfama cafÃ©, 75 min, no pitch, no merch, no badges. One question: *"the one thing here you'd never find on your own."* Get 6 humans in a room. | 1 h prep + 3 h | **â˜…â˜…â˜…â˜…â˜…** | The atomic unit of the entire business. Do it before building anything â€” its result may change what you build |
| **9** | **Set up the three owned channels and post nothing.** One Discord, one WhatsApp group, and *participate* in `r/Lisbon` + `r/Portugal` for 14 days before mentioning the product. | 2 h | **â˜…â˜…â˜…â˜†â˜†** | The 14-day no-promotion rule is what makes week 3+ possible. Reddit removes brand accounts with no karma; this is the fix |
| **10** | **Pause the automation for 30 days.** Disable the 7-day Instagram campaign, `hermes_daily_spots_generator.js` and the growth-engine cron. Replace with 2 human-written posts/week, each naming and crediting a Founding Local. | 10 min + discipline | **â˜…â˜…â˜…â˜…â˜†** | Costs nothing, removes the reputational and regulatory tail risk, and forces the human behaviour the strategy depends on |

**Do not do next week:** paid ads, new cities, new features, merch, badges,
the 460-badge shop, a rebrand, a podcast, or a second city brain.

---

## 10. KPI targets

Realistic for a 0â†’1 city beachhead with one founder. These are commitments,
not forecasts; the day-90 gate in Â§4 is the real control.

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Registered users | 300 | 2,000 | 8,000 | 35,000 |
| WAU | 60 | 450 | 2,000 | 9,000 |
| **DAU** | 20 | 150 | 650 | 3,000 |
| DAU/MAU | 0.33 | 0.33 | 0.33 | 0.33 |
| **D30 retention** | 18% | 25% | 28% | 32% |
| D7 retention | 35% | 42% | 45% | 48% |
| Active locals (30d) | 15 | 60 | 180 | 500 |
| Founding Locals (cumulative) | 6 | 40 | 120 | 350 |
| Locally verified spots | 10 | 150 | 600 | 2,000 |
| Meetups / month | 1 | 6 | 20 | 70 |
| Meetup attendees / month | 8 | 60 | 250 | 900 |
| % attendees not personally invited | 40% | 45% | 50% | 60% |
| Attendees who are app users | 30% | 45% | 55% | 65% |
| **Meaningful connections / month** | 5 | 40 | 180 | 700 |
| % of registered who sent â‰¥1 stranger DM | 20% | 25% | 30% | 35% |
| Paying local businesses | 0 | 3 | 12 | 40 |
| Cities live | 1 | 1 | 4 | 12 |
| Paying subscribers | 0 | 0 | 40 | 250 |
| Monthly revenue | â‚¬0 | â‚¬90 | â‚¬1,500 | â‚¬6,000 |
| Traveller : local contribution | 2:1 | 1.5:1 | 1.2:1 | 1:1 |
| **City Health Score (Lisbon)** | ~12 | ~60 | ~72 | ~85 |

**If month 3 does not hit 2,000 registered / 40 locals / 6 meetups per month
/ CHS â‰¥ 60, the plan is not working. Do not open city #2.** Change the
format, not the timeline.

### Do not measure these

Follower count. Impressions. Posts published. AI assets generated. App Store
rank. "Confidence score." Any number you cannot produce a query for.

### Definitions to fix before you need them

- **DAU/MAU of 0.33 is a deliberate target, not a failure.** Travellers are
  episodic; a travel community is *supposed* to have a spiky daily curve.
  Measure locals' DAU/MAU separately â€” that should exceed 0.5 by month 6.
- **D30 is the gate on every growth decision.** Paid acquisition, city
  expansion and the creator program all scale off it. Below 35% you are
  buying churn.
- **Meaningful connection is the north star** (master plan Â§28) and the only
  number that cannot be faked, because it requires two humans.

---

## 11. German / DACH market notes (for Stage 1b, not day 1)

Verified figures:

- **Destatis:** 497.4M overnight stays and 192.0M arrivals in German
  accommodation; â‚¬112bn hospitality turnover. July 2026 overnight stays
  **+3.2%** YoY, June 2026 **âˆ’2.9%** â€” volatile. 2025 headline: *"Weniger
  Reisen, aber Rekordwert bei mehrtÃ¤gigen Inlandsreisen"* (fewer trips,
  record spend on multi-day domestic trips). Germans are **36% of all
  overnight stays in Austria**.
  ([Destatis](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Gastgewerbe-Tourismus/_inhalt.html))
- **FUR Reiseanalyse 2026** (56th edition, >12,000 respondents/year): for
  2025, **57.1M Germans took â‰¥1 holiday trip of 5+ days** (a record) with
  **â‚¬91.7bn** spend; **80.5%** of the population took a 5+ day holiday;
  ~65M holiday trips by ~55M travellers. 2026 intentions hold up despite
  weak economic forecasts.
  ([reiseanalyse.de](https://reiseanalyse.de/), first results Feb 2026;
  [fvw.de](https://www.fvw.de/touristik/147604/fur-reiseanalyse-weichen-fuer-touristisches-rekordjahr-2026-gestellt.html);
  [DRV Zahlen & Fakten 2026 (PDF)](https://www.drv.de/public/Downloads_2026/26-02-27_Zahlen_und_Fakten_2026_final.pdf))
- **Eurostat:** 65% of EU residents took â‰¥1 personal trip in 2024; 71% of
  trips were domestic; Spain is the top EU destination for international
  tourists (322M nights); **over 950M short-stay guest nights** booked via
  Airbnb, Booking.com and Expedia Group; Germany has the **highest tourism
  expenditure** in the EU; tourism is 3.6% of EU gross value added.
  ([Eurostat, extracted March 2026](https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Tourism_statistics))
- **DACH behaviour that matters here:** German travellers are high-spend per
  trip, plan further ahead than most, are heavy users of forums and
  Reisebericht-style content, and are structurally reluctant to post on
  English-first social platforms. They *will* use a German-language surface;
  they will not use an English one.

**Implication:** Portugal is a top-5 inbound market for Germany. Do not build
in German from day one â€” build in English around Ericeira's expat layer,
then in Stage 1b ship a German surface (one newsletter, one German Reddit
cadence, German meetup descriptions, a German creator tier) measured as a
separate funnel with its own UTMs. A bilingual Lisbon is the cheapest
possible test of whether DACH is real for you.

---

## 12. Source list

**Precedents / benchmarks**
- Nextdoor: [about.nextdoor.com](https://about.nextdoor.com/) Â· [Wikipedia](https://en.wikipedia.org/wiki/Nextdoor)
- Meetup: [Wikipedia](https://en.wikipedia.org/wiki/Meetup)
- Nomads.com: [nomads.com](https://nomads.com/) Â· [nomads.com/meetups](https://nomads.com/meetups)
- Atlas Obscura: [Wikipedia](https://en.wikipedia.org/wiki/Atlas_Obscura)
- Wikiloc: [Wikipedia](https://en.wikipedia.org/wiki/Wikiloc)
- Couchsurfing: [couchsurfing.com](https://www.couchsurfing.com/) Â· [Wikipedia](https://en.wikipedia.org/wiki/Couchsurfing)
- Workaway (incl. The Times 2025 critique): [Wikipedia](https://en.wikipedia.org/wiki/Workaway)
- Post-Couchsurfing app landscape 2026: [Bubblic](https://bubblic.app/blog/best-apps-to-meet-people-while-traveling-solo.html) Â· [Lost on the Route](https://lostontheroute.com/6-apps-to-help-you-meet-new-people-while-traveling/) Â· [Nomadtable](https://nomadtable.app/home/blog/the-6-best-apps-to-meet-people-while-traveling-solo-2026/)
- Discord community tooling: [discord.com/community](https://discord.com/community)
- Lemmy federation model: [join-lemmy.org](https://join-lemmy.org/)

**Policy and legal**
- Google, Guidance on generative AI content (updated 2025-12-10): [docs](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- Google Search spam policies (scaled content abuse, site reputation abuse): [docs](https://developers.google.com/search/docs/essentials/spam-policies)
- EU AI Act Article 50 (transparency obligations): [artificialintelligenceact.eu](https://artificialintelligenceact.eu/article/50/)
- Meta community standards / manipulated media: [transparency.meta.com](https://transparency.meta.com/policies/community-standards/manipulated-media/)
- Reddit self-promotion norms 2026: [redship guide](https://redship.io/blog/getting-started-on-reddit-the-complete-guide-to-reddit-self-promotion-rules-in-2026) Â· [11,841-subreddit analysis](https://headsrover.io/blog/reddit-self-promotion-rules-by-subreddit-what-11841-communities-actually-say)

**Market data**
- Destatis, Gastgewerbe & Tourismus: [destatis.de](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Gastgewerbe-Tourismus/_inhalt.html)
- FUR Reiseanalyse 2026: [reiseanalyse.de](https://reiseanalyse.de/) Â· [fvw summary](https://www.fvw.de/touristik/147604/fur-reiseanalyse-weichen-fuer-touristisches-rekordjahr-2026-gestellt.html) Â· [DRV Zahlen & Fakten 2026 (PDF)](https://www.drv.de/public/Downloads_2026/26-02-27_Zahlen_und_Fakten_2026_final.pdf)
- Eurostat tourism statistics (extracted March 2026): [ec.europa.eu](https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Tourism_statistics)
- Turismo de Portugal / TravelBI: [travelbi.turismodeportugal.pt](https://travelbi.turismodeportugal.pt/)
- Influencer benchmarks 2026 (vendor-reported, directional): [InfluenceFlow](https://influenceflow.io/home/resources/influencer-marketing/influencer-marketing-benchmarks-real-rates-roi-platform-comparison-data-2026/) Â· [Bizkol](https://bizkol.ai/blog/influencer-marketing-statistics) Â· [Influencer Marketing Hub](https://influencermarketinghub.com/influencer-rates/how-much-do-influencers-really-cost-in-2026/)

**Internal sources reviewed**
- `Social_Travel_Platform_Master_Project_Plan (1).md` Â§14 City Launch Strategy, Â§15 MVP, Â§27 "Become a Local Insider", Â§28 Metrics
- `ScratchÂ´nÂ´travel_20260812_fpqluzr3m.md` Â§2 Legal Principles, Â§3 City Intelligence & Seeding Engine, Â§9 City Launch Strategy
- `.agents/skills/community-posts-feedback/SKILL.md`, `.agents/skills/zielgruppenanalyse/SKILL.md`, `.agents/skills/value-proposition-pitch/SKILL.md`
- `scripts/hermes_social_growth_engine.js`, `scripts/hermes_community_extender.js`, `scripts/hermes_weekly_reflection.js`
- `HERMES_WEEKLY_REFLECTION_DIGEST.md`, `HERMES_WEEKLY_REFLECTION_REPORT.json`
- `social_drafts/7_tage_instagram_kampagne_scratch_n_travel.md`, `social_drafts/7_tage_instagram_kampagne.json`, `social_drafts/2026-08-14-lissabon-drafts.md`
- `social_campaigns/campaign_2026-09-15_spot_47.json`, `seeded_cities/lissabon-brain.json`
- `verschiedene webseit versionen/04.09.2026/src/data/data.ts`, `src/services/supabase.ts`, `src/pages/Login.tsx`
- `supabase_schema.sql`, `package.json`

---

*The 10 fictional tours, 12 fake "slots taken", 460 unreachable badges and 65
unverified pins in this repo are not assets. Deleting them costs a day and
buys the only thing this strategy needs: the right to say "a local verified
this."*

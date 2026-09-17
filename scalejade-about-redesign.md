# ScaleJade — `/about` Redesign Brief

**Prepared:** 15 September 2026
**Page reviewed:** https://www.scalejade.com/about
**Companion to:** Website Audit §2.5 · Sectors · Portfolio · Navbar briefs

> ⚠️ **Bracketed values throughout are placeholders.** Replace each with a fact you can defend, or delete the line. On this page more than any other, an unverifiable claim does active damage.

---

## 0. Diagnosis

This is the page a serious buyer opens to decide whether you are real. It currently contains an H1, one paragraph, an unattributed quote, and four values.

| # | Problem | Severity |
|---|---|---|
| 1 | **Zero people.** No founders, no engineers, no photos, no CVs, no links | Critical |
| 2 | **The page contradicts your own sales claim.** `/services` says *"every engagement is led by engineers who have built production systems at scale"* — and then you show none of them | Critical |
| 3 | **Zero verifiable facts.** No founding year, headcount, registration numbers, certifications, client count | High |
| 4 | **Four values that are one value said four times.** Reliability First / Security by Design / Compliance-Ready / Built to Scale — every competitor claims all four, none is falsifiable | High |
| 5 | **Mission in quotation marks with no speaker.** Quoting an unnamed source is worse than not quoting | Medium |
| 6 | **Three names for one page.** Nav says "Who We Are", eyebrow says "About ScaleJade", H1 section says "Who We Are" | Medium |
| 7 | **H1 is category-generic.** "A Technology Partner You Can Rely On" — "partner" is the most overused word in your category | Medium |
| 8 | **Footer says "worldwide"** directly beneath a page positioning you in Southeast Asia | Low |

**The page answers none of the four questions buyers actually arrive with.**

---

## 1. What an About page is for

A procurement officer, a CTO and a risk officer open `/about` with four questions. Structure the page to answer them in this order.

| Question | Answered by | Currently |
|---|---|---|
| **Are you a real company?** | Entity, registration, founding year, offices, headcount | Nothing |
| **Who will actually do the work?** | Named team with prior experience | Nothing |
| **Can I trust you with regulated data?** | Certifications, hosting, access control, frameworks | Four adjectives |
| **Will you still exist in three years, and what happens if you don't?** | Client count, escrow, handover policy, careers page | Nothing |

Everything below serves one of these. Anything that serves none of them gets cut.

---

## 2. Proposed page structure

```
1. Header              Who we are — factual, with a number in it
2. Founding            Why the firm exists. One paragraph, specific
3. The team            ← the centre of the page
4. How we work         Engagement models, team composition, what you get
5. What we're built on Evidence replacing values
6. The facts           Entity, registration, offices, certifications
7. Research            Link to the preprints, with the authors named here
8. Careers / CTA
```

Blocks 3 and 5 carry the page. Everything else supports them.

---

## 3. The team block — the centre of the page

This is the single highest-value change available anywhere on your site. It costs about a day and it resolves the credibility contradiction outright.

### 3.1 Start from people you have already published

Your research preprints carry named authors: **A. Pradana, M. Wibowo, S. Tan, R. Halim, D. Putri.** They are the only named humans anywhere on the site, and they are currently unreachable. Those five are your team page.

Cross-link both ways: each profile lists the papers that person authored; each paper links back to the profile.

### 3.2 Profile specification

| Field | Requirement |
|---|---|
| Photo | Real, recent, consistent treatment across everyone. Same background, same crop, same lighting. Not stock, not avatars, not illustrations |
| Name | Full name, not an initial. "A. Pradana" on a paper is a convention; on a team page it reads evasive |
| Role | Specific. "Principal Engineer, Payments" beats "Senior Engineer" |
| Two lines of history | **What they built, and where.** This is the entire credibility payload |
| Prior employers | Name them. A buyer recognising one name changes the whole conversation |
| Links | LinkedIn always; GitHub where it exists and is active |
| Papers | Any preprints they authored |

**Write the two lines like this:**

> Built and ran the settlement reconciliation platform at [prior employer] for four years, covering [X] markets. Before that, [thing]. Leads our financial services work.

**Not like this:**

> Passionate about building scalable solutions and driving digital transformation.

The first is checkable. The second is noise, and on this page noise reads as concealment.

### 3.3 Show everyone, or show leadership honestly

Two viable approaches. Pick one and be consistent.

| | **Show everyone** | **Show leadership only** |
|---|---|---|
| Works when | Under ~20 people | Over ~20, or you want to protect junior staff from recruiters |
| Signals | Transparency, no bench, no hidden offshore team | Structure, seniority |
| Risk | Reveals you are small | Reads as hiding the delivery team |

**Recommended: show everyone.** At your size the "we are small" reveal is not the liability you think it is — see 3.4. Hiding it while claiming "our teams are practitioners" is the liability.

### 3.4 Address the size objection directly

Do not let a buyer discover your headcount by counting photos. State it, and make the argument:

> We are [N] engineers across Singapore and Jakarta. No account managers, no delivery layer, no bench. The person who scopes your engagement is the person who builds it, and the person you email at 11pm is the person who wrote the code.

This converts your biggest apparent weakness into the strongest reason to choose you over a 2,000-person firm. Enterprise buyers who have been burned by bait-and-switch staffing — and most have — will recognise exactly what you are offering.

**If you are under five people**, show all faces but omit the headcount number. Under five reads as a project rather than a firm, and the faces make the point without the arithmetic.

### 3.5 Photography

- One session, one photographer, one background. Inconsistent headshots are worse than none
- Plain backgrounds in `paper` or `jade-900`. No offices, no laptops, no whiteboards
- Neutral expression, direct to camera. No arms folded, no thoughtful-gaze-into-distance
- Square crop, consistent framing, subtle desaturation to sit inside the jade palette
- Budget roughly [local rate] for a half-day. It is the cheapest credibility on this entire list

---

## 4. Replace values with evidence

Your four values are four restatements of one idea, and each one is a claim a competitor can copy in thirty seconds. Replace the whole block with things that can be checked.

| Current value | Why it fails | Replace with |
|---|---|---|
| **Reliability First** | Every vendor claims it | Your standard SLA · on-call model · incident review policy · measured uptime across engagements |
| **Security by Design** | Unfalsifiable | ISO 27001 status (certified / in progress / not pursued) · pen-test cadence and who performs it · where data is hosted · who holds production access |
| **Compliance-Ready** | "Ready" means not done | Named frameworks you have genuinely built against: POJK, MAS TRM Guidelines, UU PDP No. 27/2022, PDPA, ISO 20022 |
| **Built to Scale** | Says nothing about risk | Source-code escrow terms · IP ownership (client owns it, say so) · documented handover policy · what happens to your code if the firm ceases trading |

**That last row is the one nobody writes and every risk officer asks about.** A vendor who publishes their exit and escrow terms unprompted has answered the hardest question in the room before it is asked. It is a genuine differentiator and it costs one paragraph.

**On stating a certification you do not hold:** write "ISO 27001 — in progress, targeting [quarter]" rather than implying it. Buyers respect a date. They do not respect discovering the gap during due diligence.

---

## 5. How we work

Currently absent, and buyers want it before they contact you. One short block:

**Engagement models** — name the two or three you actually offer. Fixed-scope delivery, embedded team, managed operations. State roughly what each suits.

**Team composition** — what a typical engagement looks like. "[N] engineers, one of whom is a principal, for [N] months" tells a buyer more about fit and budget than any pricing page.

**What the client owns** — code, documentation, infrastructure, IP. Say it plainly.

**How we start** — a two-week paid discovery, or whatever your actual first step is. Naming the first step lowers the barrier to the first call more than any CTA copy.

---

## 6. The facts block

A compact, scannable block near the foot of the page. Set in mono, spec-line treatment, consistent with sector pages and work entries.

```
FOUNDED          [year]
TEAM             [N] engineers · Singapore, Jakarta
ENTITIES         ScaleJade Technology Ltd (Singapore) · UEN [number]
                 PT Skala Kecerdasan Nusantara (Indonesia) · NIB [number]
CLIENTS          [N] institutions across banking, education, public sector
CERTIFICATIONS   [ISO 27001 — status] · [SOC 2 — status]
DATA RESIDENCY   [where client data is hosted, by jurisdiction]
LANGUAGES        English · Bahasa Indonesia · [others]
```

Publishing registration numbers costs nothing and signals "we are an auditable legal entity", which is precisely what a bank's vendor-onboarding team is checking.

**Fix the entity naming while you are here.** The site currently shows three names: "PT Skala Kecerdasan Nusantara", "ScaleJade Technology Ltd", and "Scalejade Systems" in the footer copyright — note the lowercase *j*, inconsistent with the brand everywhere else. Decide which entity contracts, name it consistently, and show the relationship between the two.

---

## 7. Copy

### 7.1 Naming

Three names for one page. Pick **"About"** — shortest, standard, and it matches the nav change in the Navbar brief. Kill "Who We Are" everywhere.

### 7.2 Header

**Current:**

> **A Technology Partner You Can Rely On.**
> ScaleJade is a technology firm helping enterprises build the digital foundation for their future — across software, AI, blockchain, and cloud.

Generic on both lines, and the subhead repeats the same four service words used on the homepage and the services page.

**Option A — lead with the number** *(recommended)*

> # [N] engineers in Singapore and Jakarta.
>
> We build and run software for institutions where a failure is a reportable event. No account managers, no delivery layer, no bench.

**Option B — lead with the people**

> # The engineers who will do the work.
>
> Every name on this page has run production systems in a regulated environment. Most of them will be in the room on your first call.

**Option C — lead with the constraint**

> # A small firm, deliberately.
>
> We turn down more work than we take, because the systems we build cannot be handed to whoever is available.

Option A is strongest: it answers "are you real" and "who does the work" in one line, and stating headcount unprompted is disarming in a category where everyone inflates.

### 7.3 Founding story

Currently absent. One paragraph, and it must be specific — a generic origin story is worse than none.

Answer: **what you saw that made this worth starting.** Something like the shape of:

> [Founder] spent [N] years building [specific system] at [institution]. The recurring problem was not technology — it was that the firms capable of the engineering did not understand the regulation, and the firms that understood the regulation subcontracted the engineering. ScaleJade exists to be one team that does both.

Replace with the truth. The value is in the specificity, not the arc.

### 7.4 Mission

Currently in quotation marks with no attributed speaker, which reads as either a lapse or a borrowed line.

Two fixes:

1. **Attribute it** to a named founder, with a photo beside it. A quote with a face is a commitment; a quote without one is decoration.
2. **Or drop the quote marks** and write it as a plain positioning statement.

Either way, rewrite the content. "Reliable, secure, and ready to grow with their business" is three adjectives every competitor uses. Your strongest existing sentence sits unused on `/services`:

> *Not every technology firm works in regulated industries. We do.*

### 7.5 Fix "worldwide"

The footer tagline — *"...for regulated markets worldwide"* — contradicts everything else. Change to Southeast Asia, or to Singapore and Jakarta. Consistency here matters more than reach.

---

## 8. Should this be one page or several?

**Now:** one page. Splitting thin content across three URLs makes it look thinner.

**Once the team block exists and careers opens:**

```
/about            story, how we work, evidence, facts
/about/team       full profiles
/careers          open roles
```

`/careers` is worth opening even with one role, or with none and a "we hire occasionally, introduce yourself" note. A careers page signals a firm that expects to exist next year, which is question four on the buyer's list.

---

## 9. Design notes

- **The team block gets the most space on the page.** If it is not the largest block, the page is still wrong.
- **One dark full-bleed `jade-900` band** behind the founding story. It is the one narrative moment on the page and it earns the weight.
- **Facts block in mono**, uppercase labels, hairline rules between rows — same spec-line treatment as sector regulations and work entry metadata. One typographic idea running through the whole site.
- **Photo grid:** 3 across desktop, 2 tablet, 1 mobile. Generous gaps. Name and role below the image, history revealed on the card rather than in a modal — modals hide the thing you most want read.
- **No stock photography.** No handshakes, no glass towers, no diverse-team-around-a-laptop. On this page especially, stock imagery reads as a substitute for real people, which is exactly the accusation you are trying to defeat.
- **No icons on the evidence block.** Shield and lock icons beside security claims are decoration that draws attention to how generic the claim is.
- Carry over the jade palette and type system from Audit §5.3–5.4.

---

## 10. Reference pages

### Team and people, done well

| Site | URL | Take |
|---|---|---|
| Zühlke — People | https://www.zuhlke.com/en/about-us/people | Closest peer. How an engineering firm presents people at scale |
| Metalab — About | https://www.metalab.com/about | Photography consistency and personality without losing seriousness |
| Work & Co — About | https://www.work.co/about | Studio structure explained plainly |

### Facts, transparency and evidence

| Site | URL | Take |
|---|---|---|
| Monzo — About | https://monzo.com/about/ | Publishing numbers as a trust strategy in a regulated sector |
| PostHog — Handbook | https://posthog.com/handbook | Radical operational transparency. Take the instinct, not the volume |
| 37signals | https://37signals.com/ | A small firm making smallness the argument |
| Basecamp — About | https://basecamp.com/about | Plain language, no category jargon |

### Register and restraint

| Site | URL | Take |
|---|---|---|
| Jane Street — Culture | https://www.janestreet.com/culture/ | Confidence with almost no marketing adjectives |
| Oliver Wyman — Who We Are | https://www.oliverwyman.com/who-we-are.html | Institutional serif register |
| Thoughtworks — About | https://www.thoughtworks.com/en-sg/about-us | Consultancy structure; note how much is evidence |
| Linear — About | https://linear.app/about | Short, opinionated, no filler |

---

## 11. Build order

### This week

| # | Task | Effort | Blocker |
|---|---|---|---|
| 1 | Decide: show everyone, or leadership only | 30 min | — |
| 2 | Book one photographer, one session, everyone | half day | Scheduling |
| 3 | Write two lines of real history per person — what they built, where | 2 hrs | The people themselves |
| 4 | Ship the team block | 1 day | 2, 3 |
| 5 | Rename "Who We Are" → "About" everywhere | 15 min | — |
| 6 | Attribute or de-quote the mission statement | 15 min | Founder |
| 7 | Fix "worldwide" → Southeast Asia in the footer | 5 min | — |

### Next

| # | Task | Effort | Blocker |
|---|---|---|---|
| 8 | Establish real answers for the four evidence rows (§4) | 1 week | Internal — legal, ops, security |
| 9 | Replace the values block with the evidence block | 3 hrs | 8 |
| 10 | Write the founding story | 2 hrs | Founder |
| 11 | Build the facts block; reconcile the three entity names | 3 hrs | Legal |
| 12 | Write the "How we work" block | 3 hrs | — |
| 13 | Cross-link research authors to team profiles both ways | 1 hr | 4 |
| 14 | Open `/careers` | 2 days | — |

**Item 4 is the one that matters.** Ship the team block even if the rest of the page stays exactly as it is today. A page with four generic values and five real engineers is dramatically more credible than the same page with no people, and it takes a day.

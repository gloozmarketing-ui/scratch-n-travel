# 🌍 Social Travel Platform — Master Project Plan

> **Working concept:** A human-first travel platform that connects travelers and locals through secret places, hobbies, local culture, food, stories, communities and real-world experiences.
>
> **Core promise:**  
> **“Don’t just visit a place. Become part of it.”**
>
> **Status:** Master roadmap / product blueprint  
> **Version:** 0.1  
> **Date:** 2026-08-11

---

# 1. Vision

The platform is **not** intended to become another Booking.com, Airbnb or Tinder.

It should become the **social layer of travel**:

- Discover places locals actually love.
- Meet people with similar hobbies.
- Find temporary communities while traveling.
- Exchange culture and knowledge.
- Discover local food and authentic recipes.
- Share personal travel memories.
- Create friendships and potentially relationships naturally, without making dating the purpose of the platform.
- Allow locals to share activities and experiences.
- Give hosts, local creators and businesses a presence.
- Eventually turn community knowledge into a powerful travel knowledge graph and AI travel companion.

### Core emotional outcome

The user should finish a trip thinking:

> “Without this platform, I would never have met these people or discovered these places.”

---

# 2. Important Product Principle

The platform should be built around **people and community first**, not transactions.

The initial model deliberately avoids becoming a booking/payment marketplace.

Users can contact each other and arrange activities independently.

The platform monetizes through:

- memberships
- visibility
- business profiles
- advertising
- affiliate referrals
- B2B communities
- digital products
- physical products
- creator/licensing models
- premium AI features

This keeps the initial architecture and business model substantially simpler than operating a full booking marketplace.

**Important:** exact legal obligations must still be reviewed for the countries in which the platform operates. The product should not rely on disclaimers as a substitute for actual legal compliance.

---

# 3. Platform Architecture

## High-level architecture

```text
                         ┌───────────────────────┐
                         │       USERS           │
                         │ Travelers / Locals    │
                         │ Hosts / Creators      │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────┐
                    │       WEB APPLICATION      │
                    │                            │
                    │ React / Next / Astro etc. │
                    │ UI + Profiles + Feed       │
                    └─────────────┬──────────────┘
                                  │
                         HTTPS / API / Auth
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │        APPLICATION API     │
                    │                            │
                    │ Users / Trips / Posts      │
                    │ Matching / Messaging       │
                    │ Communities / Reputation   │
                    └─────────────┬──────────────┘
                                  │
              ┌───────────────────┼────────────────────┐
              │                   │                    │
              ▼                   ▼                    ▼
        ┌───────────┐       ┌───────────┐       ┌──────────────┐
        │ Database  │       │ Media     │       │ Search       │
        │           │       │ Storage   │       │ / Discovery  │
        └───────────┘       └───────────┘       └──────────────┘
              │
              ▼
        ┌─────────────────────────────────────────────┐
        │              HERMES ORCHESTRATOR            │
        │                                             │
        │ NEVER the product UI itself.                │
        │ Coordinates specialized AI agents.          │
        └──────────────────────┬──────────────────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
       Research Agent    Community Agent   Content Agent
       Matching Agent    Safety Agent      Analytics Agent
       Travel Agent      Business Agent    Knowledge Agent
                               │
                               ▼
                        ┌───────────────┐
                        │  OpenRouter   │
                        │ Multi-model   │
                        └───────────────┘
                               │
                         Skills + MCPs
                               │
              ┌────────────────┼───────────────────┐
              ▼                ▼                   ▼
            Maps             Search              Social
            Email            Analytics           CMS
            Moderation       Affiliate APIs      etc.
```

---

# 4. Recommended Hosting Model

## GitHub

GitHub should be the source of truth for:

- frontend
- backend/API code
- database migrations
- configuration templates
- Hermes integration
- skills
- MCP definitions
- prompts
- tests
- documentation
- infrastructure configuration

Use:

```text
main
develop
feature/*
fix/*
```

### Suggested repository structure

```text
social-travel/
│
├── apps/
│   ├── web/
│   ├── api/
│   └── admin/
│
├── agents/
│   ├── hermes/
│   ├── research/
│   ├── matching/
│   ├── travel/
│   ├── community/
│   ├── content/
│   ├── business/
│   ├── safety/
│   └── analytics/
│
├── skills/
│   ├── travel-research/
│   ├── local-discovery/
│   ├── hobby-matching/
│   ├── recipe-analysis/
│   ├── community-moderation/
│   ├── travel-memory/
│   ├── local-business/
│   └── content-generation/
│
├── mcp/
│   ├── maps/
│   ├── search/
│   ├── database/
│   ├── moderation/
│   ├── analytics/
│   └── external-services/
│
├── knowledge/
│   ├── product/
│   ├── destinations/
│   ├── safety/
│   ├── culture/
│   ├── recipes/
│   └── policies/
│
├── packages/
│   ├── shared-types/
│   ├── matching-engine/
│   ├── reputation/
│   └── ai/
│
├── docs/
│   ├── architecture/
│   ├── product/
│   ├── legal/
│   ├── monetization/
│   └── operations/
│
├── tests/
│
├── .env.example
├── netlify.toml
├── README.md
└── PROJECT_PLAN.md
```

---

# 5. Netlify + GitHub

## Frontend

Recommended:

```text
GitHub → Netlify → Production
```

Netlify supports Git-based continuous deployment: pushes to the connected repository can trigger builds and deployments.

Use:

- Deploy Previews for feature branches / pull requests
- Production deploy from `main`
- Environment variables for public configuration
- Server-side functions only for suitable lightweight backend operations

## Important architecture rule

**Do not put long-running Hermes orchestration inside a static frontend deployment.**

The recommended separation is:

```text
Netlify
  ↓
Web application
  ↓
API / backend
  ↓
Hermes
  ↓
OpenRouter + MCP + Skills
```

If the existing Hermes project already runs elsewhere, reuse that architecture rather than replacing it.

---

# 6. OpenRouter

OpenRouter should act as the **model abstraction layer**.

Advantages:

- multiple models
- model switching
- fallback strategies
- cost optimization
- different models for different agents
- experimentation without rewriting the application

Suggested strategy:

```text
Cheap / fast model
→ classification
→ tagging
→ moderation pre-check
→ simple extraction

Medium model
→ matching
→ recommendations
→ content transformation

Strong model
→ complex travel planning
→ community reasoning
→ conflict analysis
→ high-value concierge requests
```

Never expose the OpenRouter API key in frontend code.

---

# 7. Hermes

Hermes remains the **orchestrator**.

Hermes should NOT become one giant super-agent.

Instead:

```text
User request
     ↓
Hermes
     ↓
Select agent
     ↓
Select skill
     ↓
Select MCP/tool
     ↓
Execute
     ↓
Validate
     ↓
Return result
```

### Hermes responsibilities

- task routing
- agent selection
- skill selection
- tool selection
- context management
- permissions
- retries
- error handling
- model selection
- cost control
- audit logs
- workflow orchestration

### Hermes should NOT own

- all business logic
- all prompts
- all tools
- all domain knowledge
- all moderation logic

Those belong to specialized components.

---

# 8. Agent System

## 8.1 Research Agent

Responsibilities:

- destination research
- local culture
- local events
- local places
- community knowledge
- source verification
- trend detection

Output:

```json
{
  "destination": "...",
  "findings": [],
  "sources": [],
  "confidence": 0.0
}
```

---

## 8.2 Local Discovery Agent

Finds:

- hidden places
- local restaurants
- markets
- trails
- beaches
- unusual activities
- cultural locations

It should prioritize community-generated knowledge over generic tourist lists.

---

## 8.3 Matching Agent

Matches people based on:

- hobbies
- interests
- language
- travel dates
- destination
- age range where appropriate
- travel style
- activity preferences
- social preferences

Possible score:

```text
Match Score =
  Hobby similarity
+ Destination overlap
+ Time overlap
+ Language compatibility
+ Activity compatibility
+ Community reputation
```

Do not make the score solely demographic.

---

## 8.4 Travel Agent

Creates:

- local itineraries
- hobby-based plans
- food routes
- rainy-day alternatives
- social suggestions
- local recommendations

The Travel Agent should be able to query community data.

---

## 8.5 Community Agent

Responsibilities:

- suggest groups
- identify emerging communities
- recommend people
- recommend meetups
- detect inactive groups
- suggest community events
- help organize local activities

---

## 8.6 Content Agent

Generates:

- destination pages
- local guide drafts
- newsletter content
- social posts
- community summaries
- recipe formatting
- travel journal summaries

AI-generated content must be clearly separated from verified community submissions.

---

## 8.7 Safety / Moderation Agent

Responsibilities:

- detect spam
- harassment
- scams
- suspicious behavior
- inappropriate content
- dangerous activity
- impersonation
- potential exploitation

The agent should assist human moderation rather than automatically make irreversible decisions.

---

## 8.8 Business Agent

Supports:

- local business profiles
- featured listings
- business onboarding
- local creator profiles
- affiliate opportunities
- business recommendations

---

## 8.9 Analytics Agent

Tracks:

- activation
- retention
- matches
- conversations
- meetups
- local contributions
- saved places
- repeat trips
- community growth
- monetization
- city-level network effects

---

## 8.10 Knowledge Agent

Maintains the platform's long-term knowledge layer:

```text
People
Places
Hobbies
Restaurants
Recipes
Stories
Events
Communities
Businesses
Trips
Relationships
```

This eventually becomes the **Travel Knowledge Graph**.

---

# 9. Skills Architecture

Skills should be modular.

Examples:

```text
skill:local-secret-discovery
skill:hobby-match
skill:travel-itinerary
skill:local-recipe
skill:community-summary
skill:travel-journal
skill:business-profile
skill:content-moderation
skill:trip-memory
skill:destination-analysis
skill:language-translation
skill:local-culture
```

Each skill should define:

- purpose
- input schema
- output schema
- permissions
- required MCP tools
- model recommendation
- cost limits
- safety constraints
- evaluation tests

---

# 10. MCP Architecture

MCP should expose controlled tools to agents.

Potential MCP servers:

### Maps MCP

- geocoding
- places
- distance
- routes

### Search MCP

- web search
- source retrieval
- source validation

### Database MCP

- users
- communities
- places
- trips
- posts

### Media MCP

- image processing
- metadata
- moderation

### Moderation MCP

- report management
- content review
- user restrictions

### Analytics MCP

- metrics
- dashboards
- experiments

### Affiliate MCP

Later:

- hotels
- tours
- transportation
- travel services

---

# 11. Core Product Modules

# MODULE A — LOCAL SECRETS

Users can create:

- Secret Spot
- Local Restaurant
- Hidden Bar
- Favorite Café
- Local Market
- Nature Spot
- Fishing Spot
- Hiking Route
- Photo Spot
- Local Tradition
- Family Recipe
- Seasonal Event

Each post should contain:

```text
Title
Description
Location
Category
Photos
Best time
Who it is suitable for
Local context
Personal story
Community reactions
```

---

# MODULE B — LOCAL PROFILES

Example:

```text
Maria
Lisbon, Portugal

Local since 1994

Hobbies:
🍳 Cooking
🌊 Surfing
📷 Photography
🥾 Hiking

Languages:
Portuguese
English
German

My Local Secrets:
12

Community reputation:
Trusted Local
```

---

# MODULE C — TRAVELER PROFILES

Example:

```text
Alex

Currently:
Barcelona

Next:
Lisbon
12–18 September

Hobbies:
Fishing
Photography
Food
Hiking

Looking for:
Local people
Other travelers
Group activities
```

---

# MODULE D — I'M HERE

Users can temporarily announce:

```text
I'm in Lisbon
12–18 September

Looking for:
Food
Surfing
Photography
Friends
```

This creates temporary local network density.

---

# MODULE E — HOBBY MATCH

Match users around:

- hobbies
- destination
- time
- interests
- activity type

Example:

```text
You + João

94% Hobby Match

🎣 Fishing
📷 Photography
🍳 Cooking
🌊 Ocean
```

---

# MODULE F — FIND YOUR PEOPLE

A broader discovery system.

Instead of only matching one person:

```text
People like you
in this destination
this week
```

Results:

- locals
- travelers
- groups
- communities
- events

---

# MODULE G — LOCAL CIRCLES

Examples:

```text
Naples Food Lovers
Berlin Hiking
Lisbon Surf Community
Tokyo Photography
Barcelona Solo Travelers
```

Features:

- posts
- members
- events
- chats
- local recommendations
- meetups
- community guides

---

# MODULE H — MEETUPS

Initially:

**No platform payment.**

Users can create:

```text
Saturday Fishing
Lisbon
10:00
Public meetup
8 spots
```

Participants communicate directly.

Future:

- recurring events
- private events
- group events
- organization events

---

# MODULE I — LOCAL EXPERIENCES

Locals can suggest:

- fishing
- walking
- cooking
- photography
- boating
- city exploration
- sports
- crafts
- music
- cultural activities

Initially this is a connection/discovery layer.

Later this can evolve into a regulated marketplace if business validation justifies the additional legal/payment complexity.

---

# MODULE J — TRAVEL MEMORY

After a trip:

```text
My Lisbon 2027

People I met
Places I discovered
Food I ate
Recipes
Photos
Stories
Best moment
Unexpected moment
```

---

# MODULE K — TRAVEL SCRATCHBOOK

Physical product.

Sections:

```text
Trip
Dates
Map

People
Places
Food
Recipes
Photos
Tickets
Notes
Stories
Secrets
Memories
```

Later:

- premium editions
- destination editions
- personalized editions
- community-designed editions
- limited editions

---

# MODULE L — DIGITAL SCRATCHBOOK

Users can create the digital version inside the platform.

Eventually:

```text
Trip data
    ↓
AI Travel Memory Agent
    ↓
Beautiful Travel Book
    ↓
PDF / print-ready file
    ↓
Optional physical product
```

---

# MODULE M — LOCAL CREATOR

A Local can become a creator.

Example:

```text
Luca's Naples

My favorite:
7 restaurants
3 beaches
4 bars
2 hikes
1 recipe
5 hidden places
```

Users can follow creators.

Future monetization:

- featured creator
- sponsored guide
- product collaboration
- licensing
- affiliate revenue

---

# MODULE N — LOCAL PRODUCTS

Potential products:

- scratchbooks
- shirts
- hoodies
- ponchos
- postcards
- maps
- recipe books
- art
- stickers
- travel accessories

Creator collaboration:

```text
Creator
   ↓
Design
   ↓
Platform / fulfillment partner
   ↓
Customer
   ↓
Revenue share
```

Start only after the community has enough demand.

---

# MODULE O — TRAVEL KARMA

Community contribution score.

Examples:

```text
+10 helpful local tip
+10 useful answer
+20 community contribution
+20 meetup organization
+30 helping a new traveler
```

Avoid turning this into a meaningless points game.

Karma should unlock:

- badges
- visibility
- community privileges
- recognition
- occasional physical rewards

---

# MODULE P — TRUSTED REPUTATION

Instead of only stars:

### Traveler

- Reliable
- Respectful
- Communicative
- Helpful

### Local

- Trusted Local
- Helpful
- Community Builder
- Great Recommendations

### Host

- Reliable Host
- Communicative
- Local Knowledge

Use careful privacy and anti-abuse design.

---

# MODULE Q — I WAS THERE

Places can accumulate memories.

Example:

```text
Secret Beach

Visited by:
Anna
David
Marco
Sarah

Community memories:
24
```

This turns locations into living community artifacts.

---

# MODULE R — SECRET SPOTS

Special category:

```text
🔐 SECRET
```

Potential mechanics:

- approximate location
- community guidelines
- reveal conditions
- local etiquette
- environmental protection reminders
- anti-spam rules

Avoid exposing fragile locations that could be damaged by mass tourism.

---

# MODULE S — LOCAL RECIPES

Locals can submit:

```text
Recipe
Origin
Story
Ingredients
Preparation
Family tradition
Photos
Season
```

Later:

### Community Cookbook

A destination can have its own collection.

---

# MODULE T — GROUP TRAVEL

For:

- universities
- student programs
- alumni
- youth organizations
- sports clubs
- companies
- travel groups
- cultural organizations

Private community:

```text
Barcelona Group 2027

500 members

Local Guides
Events
Chat
Hobby Groups
Travel Memories
```

---

# MODULE U — TAGLIT / COMMUNITY PROGRAMS

Potential strategic partnership / showcase category.

The platform can offer selected group programs free or at special terms.

The goal is not to make the platform religious.

The platform remains:

**neutral + multicultural + interest-driven.**

---

# MODULE V — AI LOCAL CONCIERGE

User:

> “I have three days in Porto. I like fishing, small restaurants and photography. I hate tourist traps.”

AI responds using:

- local community knowledge
- verified information
- current data
- user preferences
- local creators
- places
- events
- hobby matches

Not just generic internet recommendations.

---

# MODULE W — TRAVEL KNOWLEDGE GRAPH

Long-term moat:

```text
Person
 ↓
likes
 ↓
Hobby
 ↓
visits
 ↓
Place
 ↓
recommends
 ↓
Restaurant
 ↓
serves
 ↓
Dish
 ↓
Recipe
 ↓
Culture
```

The platform gradually becomes a structured database of human travel knowledge.

---

# 12. Monetization Stack

## Phase 1

### Free

- discover
- read
- profile
- basic posting
- limited messaging

### Premium

Target:

```text
€5–9/month
```

Potential benefits:

- unlimited contact requests
- advanced matching
- advanced discovery
- private groups
- AI concierge
- travel memory features
- advanced filters

---

## Phase 2

### Featured Local

Fixed monthly visibility fee.

No transaction commission.

---

## Phase 3

### Business Profiles

Local businesses can purchase:

- enhanced profile
- featured placement
- events
- local story
- community presence

---

## Phase 4

### Affiliate Revenue

Potential categories:

- hotels
- activities
- transportation
- travel services
- insurance
- equipment

The platform links users to external providers rather than processing the transaction itself where appropriate.

---

## Phase 5

### B2B

Organizations pay for:

- private communities
- group travel
- destination communities
- event coordination
- AI travel assistance
- member engagement

---

## Phase 6

### Products

- Scratchbooks
- Travel books
- creator merchandise
- destination editions
- personalized books

---

## Phase 7

### Creator Economy

Potential:

- licensing
- sponsored guides
- affiliate links
- creator products
- community collaborations

---

# 13. Network Effects

The platform becomes stronger as each city grows.

```text
More Locals
    ↓
More Secrets
    ↓
More Travelers
    ↓
More Matches
    ↓
More Meetups
    ↓
More Memories
    ↓
More Content
    ↓
More Locals
```

The goal is to create **city-level network effects**.

---

# 14. City Launch Strategy

Do not launch globally immediately.

Start with:

## City #1

Choose one city with:

- international travelers
- active locals
- strong hobby culture
- many communities
- manageable competition
- good English accessibility

Build density before geographic breadth.

---

# 15. MVP

The first usable version should contain only:

### Required

- authentication
- profiles
- local/traveler distinction
- hobbies
- destination
- Secret Spots
- local recommendations
- search
- basic messaging
- I'm Here
- Hobby Match
- communities
- simple meetup creation
- reporting
- basic moderation
- admin dashboard

### Nice-to-have

- travel journal
- recipes
- badges
- reputation
- follow locals

### Do NOT build initially

- payment marketplace
- accommodation booking
- full dating system
- complex creator economy
- physical product fulfillment
- complicated affiliate engine
- advanced AI concierge

---

# 16. Development Phases

## Phase 0 — Foundation

- [ ] Define brand
- [ ] Define product terminology
- [ ] Choose domain
- [ ] GitHub repository
- [ ] Netlify project
- [ ] Existing Hermes integration
- [ ] OpenRouter integration
- [ ] Secrets management
- [ ] CI/CD
- [ ] database
- [ ] authentication
- [ ] basic logging
- [ ] error monitoring

---

## Phase 1 — Social Travel MVP

- [ ] User profiles
- [ ] Traveler profiles
- [ ] Local profiles
- [ ] Hobbies
- [ ] Destination
- [ ] Local Secrets
- [ ] Search
- [ ] I'm Here
- [ ] Basic matching
- [ ] Messaging
- [ ] Community reporting
- [ ] Admin moderation

---

## Phase 2 — Community

- [ ] Local Circles
- [ ] Follow Local
- [ ] Meetup system
- [ ] Community reputation
- [ ] Travel Karma
- [ ] Community badges
- [ ] Local Creator
- [ ] Group chats
- [ ] Events

---

## Phase 3 — Travel Memory

- [ ] Travel Journal
- [ ] Photos
- [ ] Stories
- [ ] Recipes
- [ ] People met
- [ ] Places visited
- [ ] I Was There
- [ ] Digital Scratchbook

---

## Phase 4 — AI

- [ ] Hermes orchestration
- [ ] Research Agent
- [ ] Matching Agent
- [ ] Travel Agent
- [ ] Community Agent
- [ ] Content Agent
- [ ] Safety Agent
- [ ] Analytics Agent
- [ ] Knowledge Agent
- [ ] AI Local Concierge
- [ ] Personalized recommendations

---

## Phase 5 — Monetization

- [ ] Premium
- [ ] Featured Local
- [ ] Business profiles
- [ ] Sponsored visibility
- [ ] Affiliate engine
- [ ] B2B communities
- [ ] Organization accounts

---

## Phase 6 — Physical World

- [ ] Scratchbook
- [ ] Travel Passport
- [ ] Personalized books
- [ ] Creator merchandise
- [ ] Destination editions
- [ ] Local collaborations

---

## Phase 7 — Scale

- [ ] Multiple cities
- [ ] Multiple languages
- [ ] International communities
- [ ] Group travel
- [ ] University programs
- [ ] Travel organizations
- [ ] Local creator economy
- [ ] AI destination intelligence

---

# 17. Future Ideas Parking Lot

These should remain in the roadmap even if they are not built now.

## Social

- [ ] Travel buddy matching
- [ ] Hobby groups
- [ ] Local clubs
- [ ] Friend networks
- [ ] Post-trip friendships
- [ ] alumni communities
- [ ] recurring meetups

## Travel

- [ ] Secret itineraries
- [ ] Local routes
- [ ] neighborhood guides
- [ ] seasonal recommendations
- [ ] weather-aware suggestions
- [ ] event discovery
- [ ] spontaneous activities

## AI

- [ ] AI travel companion
- [ ] AI local guide
- [ ] AI translator
- [ ] AI memory book
- [ ] AI matching
- [ ] AI community manager
- [ ] AI destination analyst
- [ ] AI local culture explainer

## Community

- [ ] Local leaderboards
- [ ] community challenges
- [ ] city quests
- [ ] scavenger hunts
- [ ] travel karma
- [ ] secret missions
- [ ] city passports

## Physical

- [ ] Scratchbooks
- [ ] shirts
- [ ] hoodies
- [ ] ponchos
- [ ] maps
- [ ] postcards
- [ ] recipe books
- [ ] creator merchandise
- [ ] limited editions

## B2B

- [ ] University communities
- [ ] Student travel
- [ ] Group travel
- [ ] Company trips
- [ ] Alumni travel
- [ ] cultural organizations
- [ ] sports organizations
- [ ] exchange programs

---

# 18. Safety & Trust

This platform connects strangers offline.

Safety is therefore a product feature, not merely legal text.

Minimum:

- report user
- block user
- report content
- abuse detection
- spam detection
- moderation queue
- community guidelines
- clear communication about user-organized meetups
- emergency guidance
- age restrictions appropriate to the feature
- privacy controls
- account deletion
- data export where required

Dating is NOT the core product.

The platform should be explicitly positioned around:

**travel + hobbies + culture + community.**

Adults remain responsible for their personal relationships and activities, but the platform should still maintain reasonable trust and safety systems.

---

# 19. Privacy

Important data categories:

- location
- travel dates
- hobbies
- profile information
- messages
- photos
- community membership

Principles:

- minimize data collection
- do not expose exact real-time locations unnecessarily
- temporary “I'm Here” status
- clear privacy controls
- block/report
- deletion
- retention policies
- GDPR compliance where applicable
- privacy-by-design

---

# 20. Legal Workstream

Create a dedicated:

```text
/docs/legal/
```

with:

- Terms of Service
- Privacy Policy
- Community Guidelines
- Content policy
- User-generated-content rules
- Reporting process
- moderation policy
- marketplace analysis
- affiliate disclosures
- advertising disclosure
- creator agreements
- licensing agreements
- merchandise terms
- B2B terms
- country-specific review

Do not assume that a disclaimer automatically removes platform responsibilities.

Before launching features involving paid experiences, accommodation, payments, minors, transportation, or regulated activities, obtain jurisdiction-specific legal advice.

---

# 21. Database Core

Potential entities:

```text
User
Profile
Hobby
Destination
Place
Secret
Restaurant
Recipe
Story
Photo
Trip
TripMemory
Community
CommunityMember
Event
Meetup
Conversation
Message
Match
Follow
Reputation
Karma
Badge
Business
Creator
Host
Affiliate
Product
Order
Report
ModerationCase
Organization
GroupTrip
```

---

# 22. Recommendation Engine

Start simple.

### Candidate generation

```text
same destination
+
same travel dates
+
shared hobbies
```

Then ranking:

```text
hobby similarity
+
time overlap
+
distance
+
language
+
community reputation
+
activity preference
```

Later add machine-learning ranking.

---

# 23. Reputation System

Avoid one-dimensional star ratings.

Use separate signals:

```text
Reliability
Communication
Respect
Helpfulness
Community contribution
```

Build anti-gaming mechanisms.

Never allow reputation to become a simple popularity contest.

---

# 24. Content Quality

The platform should distinguish:

### Community knowledge

Human-generated.

### Verified information

Supported by reliable external sources.

### AI-generated

Generated or summarized by AI.

### Sponsored

Paid placement.

These should never be silently mixed.

---

# 25. Social Media Strategy

Create city/community accounts.

Potential content:

```text
“3 places locals love in Naples”

“Meet a Local: Maria”

“Secret Spot of the Week”

“Recipe from Lisbon”

“People you can meet in Berlin this weekend”

“Travel Story of the Week”
```

Platforms:

- Instagram
- TikTok
- YouTube
- Reddit communities where appropriate
- Facebook groups
- local community groups

---

# 26. Growth Loop

```text
Local posts Secret
       ↓
Traveler discovers Secret
       ↓
Traveler joins
       ↓
Traveler meets Local
       ↓
Traveler posts memory
       ↓
Friend sees memory
       ↓
New Traveler joins
       ↓
New Local contributes
```

This is the desired organic loop.

---

# 27. Launch Campaign

## “Become a Local Insider”

Recruit first locals.

Each receives:

- profile
- local badge
- contribution recognition
- early access
- future rewards

Goal:

```text
100 locals
500 secrets
1 city
```

before expanding.

---

# 28. Metrics

## North Star Metric

Potential:

### Meaningful Travel Connections

A meaningful connection could be:

```text
user A
+
user B
+
shared destination/hobby
+
conversation or meetup
```

Secondary metrics:

- weekly active users
- returning users
- secrets per active local
- matches per traveler
- conversations per match
- meetup creation
- meetup attendance
- saved places
- trip completion
- post-trip contributions
- premium conversion
- business conversion
- city density

---

# 29. AI Cost Control

Do not send every request to the most expensive model.

Use:

```text
Rule-based
    ↓
Small model
    ↓
Medium model
    ↓
Strong model
```

Cache:

- destination facts
- recurring recommendations
- embeddings
- summaries
- community metadata

Track:

```text
cost per user
cost per feature
cost per successful recommendation
```

---

# 30. Agent Evaluation

Every agent should have tests.

Example:

```text
Input:
“I like fishing and photography.
I am in Lisbon next weekend.”

Expected:
- relevant hobbies
- relevant location
- relevant time
- no unsafe assumptions
- useful local/community suggestions
```

Track:

- accuracy
- hallucinations
- tool success
- latency
- cost
- user feedback

---

# 31. Git Workflow

Recommended:

```text
feature/local-secrets
feature/hobby-match
feature/travel-memory
feature/ai-concierge
```

Pull Request:

```text
Code
Tests
Documentation
Security
AI evaluation
```

Netlify Deploy Preview:

```text
feature branch
     ↓
GitHub
     ↓
Netlify Preview
     ↓
test
     ↓
merge
     ↓
main
     ↓
production
```

---

# 32. Environment Separation

Use:

```text
development
staging
production
```

Never use production secrets locally.

Example:

```text
OPENROUTER_API_KEY
DATABASE_URL
AUTH_SECRET
MAPS_API_KEY
STORAGE_KEY
ANALYTICS_KEY
```

Secrets must never be committed to GitHub.

---

# 33. Admin Dashboard

Essential from the beginning.

Dashboard:

```text
Users
Locals
Reports
Posts
Communities
Meetups
Businesses
Moderation
Analytics
AI usage
Costs
```

Later:

```text
Revenue
Affiliate
Creator payouts
B2B
City health
```

---

# 34. City Health Score

A future internal metric:

```text
City Health =
active locals
+
active travelers
+
secrets
+
matches
+
conversations
+
meetups
+
repeat participation
```

Use it to decide:

> Should we expand this city?

---

# 35. Long-Term Product Vision

Eventually the platform could look like:

```text
                  SOCIAL TRAVEL OS
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
     DISCOVER          CONNECT          REMEMBER
        │                │                 │
    Secrets           People            Journal
    Places            Hobbies           Photos
    Food              Groups            Stories
    Culture            Events            Recipes
        │                │                 │
        └────────────────┼─────────────────┘
                         │
                      AI LAYER
                         │
             Personal Travel Companion
                         │
                   KNOWLEDGE GRAPH
                         │
                    COMMUNITIES
                         │
                   LOCAL ECONOMY
```

---

# 36. Strategic Moat

The long-term competitive advantage should NOT be:

> “We have an AI chatbot.”

That is easy to copy.

The moat should be:

### 1. Community

Real people.

### 2. Human local knowledge

Secrets, stories, recipes and recommendations.

### 3. Relationships

People who met through the platform.

### 4. Travel memory

A user's accumulated history.

### 5. Structured knowledge graph

People ↔ places ↔ hobbies ↔ food ↔ stories.

### 6. City-level network effects

The more people use it, the more valuable the destination becomes.

### 7. AI trained around this unique ecosystem

AI becomes better because it can reason over proprietary community context.

---

# 37. Development Priority Matrix

## 🔴 Build first

- authentication
- profiles
- hobbies
- destinations
- local secrets
- search
- messaging
- I'm Here
- Hobby Match
- reporting
- admin moderation

## 🟠 Build next

- communities
- meetups
- reputation
- Travel Karma
- follow locals
- recipes
- travel journal

## 🟡 Build after product-market fit

- AI Concierge
- AI Memory
- creator profiles
- businesses
- affiliate engine
- premium
- B2B

## 🟢 Long-term

- Scratchbook
- personalized books
- merchandise
- organization travel
- university programs
- creator economy
- local products
- advanced AI knowledge graph
- international scale

---

# 38. The Golden Rule

Do not build features because they sound cool.

Build them because they strengthen:

```text
DISCOVER
    ↓
CONNECT
    ↓
EXPERIENCE
    ↓
REMEMBER
    ↓
RETURN
    ↓
CONTRIBUTE
```

If a feature does not strengthen this loop, it should be questioned.

---

# 39. Ultimate Product Loop

```text
                 DISCOVER
                    ↓
              Find a Secret
                    ↓
               Find a Person
                    ↓
                HOBBY MATCH
                    ↓
                  CHAT
                    ↓
                 MEETUP
                    ↓
               EXPERIENCE
                    ↓
                 MEMORY
                    ↓
              TRAVEL JOURNAL
                    ↓
               SHARE STORY
                    ↓
              HELP NEXT USER
                    ↓
              BECOME LOCAL
                    ↓
             COMMUNITY GROWS
                    ↓
               DISCOVER
```

This is the core product flywheel.

---

# 40. First Technical Milestone

The first technical milestone should be:

```text
GitHub
  ↓
Netlify
  ↓
Web App
  ↓
API
  ↓
Database
  ↓
Hermes
  ↓
OpenRouter
  ↓
Skills
  ↓
MCP
```

Then build:

```text
Profile
+
Hobbies
+
Destination
+
Secret
+
I'm Here
+
Match
+
Message
```

Once this works end-to-end, the rest of the platform can be added modularly.

---

# 41. Final Product Definition

### Working category

**Social Travel Platform**

### Core user

Traveler + Local

### Core interaction

**Discover → Connect → Experience → Remember**

### Core differentiator

**Human local knowledge + hobby-based connections**

### Core business model

**Freemium + Featured Locals + Businesses + Affiliate + B2B + Products**

### Core AI architecture

**Hermes Orchestrator + Specialized Agents + Skills + MCP + OpenRouter**

### Core infrastructure

**GitHub + Netlify + API/Backend + Database + Hermes Runtime**

### Long-term vision

**The social layer of travel.**

---

# 42. Immediate Next Steps

1. Create GitHub repository.
2. Connect repository to Netlify.
3. Reuse the existing Hermes project architecture where practical.
4. Define the API boundary between the web application and Hermes.
5. Define database schema.
6. Create authentication.
7. Build profile system.
8. Build hobby taxonomy.
9. Build Local Secrets.
10. Build destination pages.
11. Build “I'm Here”.
12. Build Hobby Match.
13. Build basic messaging.
14. Build report/block functionality.
15. Build admin moderation.
16. Add first Hermes skills.
17. Add first MCP tools.
18. Connect OpenRouter server-side.
19. Launch one city.
20. Measure real user behavior.
21. Iterate before scaling to additional cities.

---

# 43. Definition of Success

The first success is NOT:

> 100,000 users.

It is:

> A traveler visits a city, discovers a Local through the platform, meets them because of a shared hobby, has a memorable experience, writes about it afterwards, and then contributes something useful for the next traveler.

If that happens repeatedly, the platform has found its core product.

**Everything else can grow around that.**

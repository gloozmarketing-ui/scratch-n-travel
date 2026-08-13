# 🌍 Social Travel Platform — Master Project Plan (Version 2.0)

**Working concept:** A human-first travel platform that connects travelers and locals through secret places, hobbies, local culture, food, stories, communities, and real-world experiences.
**Core promise:** "Don’t just visit a place. Become part of it."
**Status:** Master roadmap / product blueprint
**Version:** 2.0 (Consolidated)
**Date:** 2026-08-12

---

## 1. Vision & Core Identity
The platform is not intended to become another Booking.com, Airbnb, or Tinder.
It is the **Social Layer of Travel**:
- Discover places locals actually love (and hide from tourists).
- Meet people with similar hobbies (Fishing, Photography, Hiking, Cooking).
- Find temporary communities while traveling.
- Exchange culture, knowledge, and authentic local recipes.
- Allow locals to share activities and experiences without the pressure of a commercial tour guide.
- Create friendships (and naturally occurring relationships) without making dating the purpose of the platform.

**Core emotional outcome:**
The user finishes a trip thinking: *"Without this platform, I would never have met these people, eaten this food, or discovered these places."*

---

## 2. Important Product & Legal Principles
To keep the platform legally simple, scalable, and focused on community, we enforce strict architectural boundaries:

1. **No P2P Payment Processing (Crucial):** The platform does **not** process payments between travelers and locals for meetups, dinners, or informal tours. This avoids complex payment service regulations (ZAG/PSD2) and tax liabilities. Users connect on the platform and arrange payments/offline activities independently.
2. **Accommodation & Booking:** We do not build a booking engine. We use **Affiliate Links** (Booking.com, GetYourGuide) or allow Hosts to link to their own external booking sites.
3. **Safety & Dating Boundary:** The platform is for travel, hobbies, and culture. "More than friendship" is a natural human outcome, but we do not build "dating features" (like Tinder swiping). Adults are responsible for their offline meetings. The platform provides robust Report/Block tools and clear Terms of Service.
4. **Monetization via Access & Visibility:** We make money through Premium Subscriptions, Featured Visibility (for Locals/Businesses), B2B Community Hosting (Universities, Taglit), Affiliates, and E-Commerce (Scratchbooks/Merch).

---

## 3. The City Intelligence & Seeding Engine (NEW)
A platform without content is empty. Before launching a city, we use AI to pre-populate it.

**The Knowledge Flywheel:**
1. **Platform Discovery (AI Seeding):** Hermes Research Agents scrape public data, blogs, and culture to build a baseline (e.g., "Lisbon City Brain" with 100 spots, 20 recipes, 15 hobbies).
2. **Local Validation:** Real locals join and verify, correct, or claim these spots.
3. **Community Favorite:** Spots that get high engagement from travelers and locals.
4. **Local Secret (🔐):** Spots hidden by locals, revealed only to trusted community members or premium users.

---

## 4. Platform Architecture
**High-level architecture:**
```text
USERS (Travelers / Locals / Hosts / Groups)
       │
       ▼
WEB APPLICATION (React / Next.js / Astro) ─── Netlify
       │
       ▼
APPLICATION API (Users, Trips, Posts, Matching, Communities)
       │
       ▼
HERMES ORCHESTRATOR (Coordinates specialized AI agents)
       │
       ▼
OPENROUTER (Multi-model abstraction) + SKILLS + MCPs

Rule: Hermes is NEVER the product UI. It is the background intelligence.
5. Core Product Modules
MODULE A — LOCAL SECRETS & DISCOVERY
Locals share: Secret Spots, Hidden Bars, Nature Spots, Fishing Routes, Family Recipes.
Feature: 🔐 SECRET SPOTS. Exact coordinates are blurred. To reveal them, a traveler must agree to local etiquette (e.g., "Leave no trace", "Don't post on Instagram").
MODULE B — HOBBY MATCH & "FIND YOUR PEOPLE"
Instead of dating swipes, we match on Hobbies & Travel Dates.
Input: 🎣 Fishing, 📷 Photography, 🍳 Cooking.
Output: "João (Local) is going fishing this Saturday. You share 3 hobbies. Send a message."
Feature: "I'm Here". Travelers broadcast: "I'm in Lisbon, Sept 12-18, looking for surfing buddies."
MODULE C — LOCAL CIRCLES & COMMUNITIES
Micro-communities based on interests or origins.
Examples: "Naples Food Lovers", "Berlin Solo Travelers", "Taglit Berlin 2027".
Features: Group chats, meetup boards, shared secret maps.
MODULE D — THE TRAVEL SCRATCHBOOK (Digital & Physical)
Digital: Auto-generates a "Travel Memory" journal (People met, Places visited, Recipes learned, Photos).
Physical: A high-quality, beautifully designed notebook with prompts, maps, and polaroid spaces.
Business Model: Sold via Print-on-Demand or Etsy. The platform acts as the publisher. Later, "Local Creator Editions" (e.g., "Maria's Naples Scratchbook") where the local gets a royalty.
MODULE E — ACCOMMODATION & HOST PROFILES
Hosts don't just list beds; they list Local Knowledge.
Profile: "Stay with us, and we'll show you our favorite hidden market."
Reputation: Dual-sided (Traveler Reputation & Host Reputation) based on respect, communication, and cultural exchange, not just "cleanliness".
MODULE F — B2B & GROUP TRAVEL (Taglit, Universities, Clubs)
Organizations can rent private, white-labeled communities on the platform.
Example: A Taglit group or University Alumni trip gets a private hub with their own itineraries, local guides, and participant matching.
Revenue: High-ticket B2B SaaS/Community fees.
MODULE G — AI LOCAL CONCIERGE
User: "I have 3 days in Porto. I like fishing, small restaurants, and photography. I hate tourist traps."
AI responds using verified local community knowledge, not generic internet SEO blogs.
6. Monetization Stack (Legally Simple)
Phase
Model
Description
Legal Complexity
1
Freemium / Premium
Free to read/post. €5-9/mo for unlimited messaging, advanced Hobby Matching, AI Concierge, Secret Spot reveals.
Low (Standard SaaS)
2
Featured Locals/Biz
Locals/Restaurants pay a flat monthly fee for top visibility in their city. No commission on meetups.
Low (Advertising)
3
Affiliate Engine
Links to Booking.com, GetYourGuide, Rental Cars. Platform takes a cut for referring traffic.
Low (Standard Affiliate)
4
E-Commerce (Merch)
Travel Scratchbooks, Creator Merch, City Maps via Etsy/Shopify POD integration.
Medium (Standard E-Com)
5
B2B Communities
Universities, Taglit, Corporate Retreats pay for private group hubs.
Low (B2B SaaS)
Note: We explicitly avoid taking a % cut of P2P experiences (e.g., a local cooking dinner) to avoid becoming a regulated payment marketplace.
7. Agent System (Hermes)
Hermes orchestrates specialized agents:
Research Agent: Scrapes culture, events, and baseline city data (City Seeding).
Local Discovery Agent: Finds hidden gems, prioritizing community submissions over TripAdvisor.
Matching Agent: Calculates Hobby/Time/Location overlap scores.
Safety / Moderation Agent: Detects spam, scams, and inappropriate behavior (Assists human mods).
Knowledge Agent: Maintains the Travel Knowledge Graph (Person ↔ Hobby ↔ Place ↔ Recipe).
Memory Agent: Summarizes trips into Digital Scratchbooks.
8. Safety, Trust & Privacy
Since strangers meet offline, safety is a core product feature.
Minimum Viable Safety: Report/Block buttons, ID verification badges (via 3rd party like Stripe Identity/Jumio), clear Community Guidelines.
The "Offline Disclaimer": Clear UX copy stating: "The platform connects people. Offline meetings, payments, and activities are arranged privately and are the sole responsibility of the participants."
Privacy: Exact real-time locations are never exposed. "I'm Here" is temporary and broad.
9. City Launch Strategy & Network Effects
Do not launch globally. Launch city-by-city.
City Seeding: AI populates the "City Brain" with 500 baseline spots/recipes.
Local Insider Campaign: Recruit 100 passionate locals. Give them "Founding Local" badges and free Premium.
Traveler Influx: Target travelers visiting that specific city.
City Health Score: Internal metric (Active Locals + Secrets + Meetups + Repeat Visitors). If Health > Threshold, expand to the next city.
10. Development Phases
Phase 0: Foundation & Seeding
GitHub / Netlify / API Setup
Hermes OpenRouter Integration
City Seeding Engine (Populate City #1 with AI data)
Database Schema & Auth
Phase 1: Social Travel MVP (City #1)
User Profiles (Traveler / Local / Host)
Hobby Taxonomy & Matching Algorithm
Local Secrets & "I'm Here" Board
Basic Messaging & Report/Block
Admin Moderation Dashboard
Phase 2: Community & Memory
Local Circles & Group Chats
Travel Karma & Reputation System
Digital Scratchbook (Travel Journal)
"I Was There" (Location Memories)
Phase 3: Monetization & E-Commerce
Premium Subscriptions (Stripe)
Featured Local/Business Profiles
Physical Scratchbook Integration (Etsy/POD API)
Affiliate Link Engine
Phase 4: B2B & Scale
Private Group Hubs (Taglit, Universities)
AI Local Concierge
Multi-city expansion
Local Creator Economy (Merch/Licensing)
11. The Ultimate Product Loop (The Flywheel)

DISCOVER (Find a Secret / Hobby Match)
   ↓
CONNECT (Chat / "I'm Here")
   ↓
EXPERIENCE (Offline Meetup / Fishing / Cooking)
   ↓
REMEMBER (Digital Scratchbook / "I Was There")
   ↓
CONTRIBUTE (Post the new Secret / Recipe / Photo)
   ↓
COMMUNITY GROWS (Attracts next Traveler)

12. Future Ideas Parking Lot
Travel Karma Pool: "Pay it forward" system where travelers donate €3 to a community pool to fund local cleanups or free community events.
AI Memory Book: End-of-year auto-generated physical photo book of a user's travel connections.
Local Creator Licensing: Locals design their own Scratchbook covers/guides and sell them via the platform's Etsy integration.
Seasonal/Weather AI: "It's raining in Lisbon today. Here are 3 indoor cooking workshops with locals happening right now."
13. Immediate Next Steps
Initialize social-travel GitHub Repo & Netlify.
Define the Database Schema (Users, Hobbies, Secrets, Circles, Memories).
Build the City Seeding Skill for Hermes to populate the first test city (e.g., Lisbon or Naples).
Design the UI for the "Hobby Match" and "Local Secret" cards.
Draft the Legal/Terms of Service focusing on the P2P offline-meetup disclaimer.


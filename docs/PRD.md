# Product Requirements Document (PRD) — ReUseHub

**Version**: 1.0.0  
**Context**: IDEA Lab-1 Project, Theme "Digital Empowerment for All"  
**Department**: Department of Information Technology  
**Host Institution**: Shree L. R. Tiwari College of Engineering (SLRTCE)  
**Status**: Active / In Implementation  

---

## 1. Executive Summary & Vision

### 1.1 Overview
ReUseHub is an institutional peer-to-peer circular economy web application and installable Progressive Web App (PWA). It empowers students, faculty members, lab in-charges, and campus departments of ONE college to list, discover, exchange, and reuse functional materials—including laboratory components, electronic development boards, reference textbooks, drafting equipment, dorm furnishings, and stationery.

**Tagline**: *"Give it a second life."*  
**Core Currency**: **Zero INR**. No financial transactions are supported or permitted. Transactions are measured exclusively in environmental and social impact metrics: kilograms of solid waste diverted from landfills and estimated replacement currency saved.

---

## 2. Institutional Configuration Single Source of Truth

Per design constitution requirements, all campus brand identifiers, domains, and pickup points are centrally isolated in `src/config/campus.ts` and must never be hardcoded across views.

- **Institution Full Legal Name**: Shree L. R. Tiwari College of Engineering
- **Institution Short Name**: SLRTCE
- **Brand Typography**: ReUseHub @ SLRTCE
- **Authorized Domain**: `slrtce.in`
- **Sponsoring Body**: IDEA Lab-1, Department of Information Technology
- **Campus Office**: Kanakia Park, Near Commissioner's Bungalow, Mira Road (East), Thane 401107, Maharashtra
- **Support Contact**: sustainability@slrtce.in

---

## 3. Personas

1. **Student (Giver / Taker)**: Enrolled undergraduate/postgraduate student possessing semester-specific textbooks, project hardware (Arduino, ESP32, sensors), lab equipment, or room furnishings. Needs fast listing (<60s) and rapid discovery (<30s).
2. **Faculty / Lab In-Charge**: Academic or technical staff handling department inventory surpluses, retired experimental rigs, bulk stationary, or component kits. Needs bulk listing, departmental trust badge, and audit visibility.
3. **Admin / Eco-Cell Officer**: Campus sustainability coordinator or IT department moderator responsible for flagging prohibited items, managing official pickup stations, running reuse campaigns, inspecting audit logs, and generating compliance reports.

---

## 4. User Stories & Testable Acceptance Criteria

### US-01: Sign-Up, Domain Validation & Verification
*As a campus member (student/faculty), I want to sign up using my official college email domain (`@slrtce.in`), so that the platform remains a trusted, verified community.*
- **AC-01.1**: The registration form rejects any email address whose host domain does not match `campusConfig.emailDomain` (`slrtce.in`).
- **AC-01.2**: In Supabase mode, an email confirmation token is dispatched. In Mock mode, a realistic verification modal simulates instant activation.
- **AC-01.3**: Quick-login demo buttons ("Continue as Student", "Continue as Faculty", "Continue as Admin") pre-populate verified session identities with real names and department badges without manual typing.
- **AC-01.4**: First-time login automatically launches a 3-step interactive onboarding tour (Welcome & Impact Mission -> How Zero-Currency Handover Works -> Department & Interest Tagging).

### US-02: Listing an Item (4-Step Wizard)
*As an item owner, I want to list an unused item with photos, condition, category, and preferred pickup point in under 60 seconds, so that someone else on campus can use it.*
- **AC-02.1**: The 4-step wizard cleanly isolates: (1) Photo Upload & Crop/Order, (2) Specifications & Condition, (3) Designated Campus Pickup Point, (4) Live Card Review & Publish.
- **AC-02.2**: Client-side image compression converts high-resolution files into optimized WebP/JPEG under 400KB before storage.
- **AC-02.3**: Draft autosave persists in-progress form inputs to localStorage so refreshing never loses form state.
- **AC-02.4**: Optional AI Helper provides simulated or API-driven title, category suggestion, and polished description.
- **AC-02.5**: Submitting triggers instant optimistic card rendering and updates user's active listings count.

### US-03: Searching, Filtering & Category Discovery
*As a seeker, I want to search and filter available items by category, condition, department, and pickup location, so that I can find what I need in under 30 seconds.*
- **AC-03.1**: The search input features debounce (250ms), keyboard shortcuts (`/` and `Cmd+K`), recent searches memory, and category auto-suggestions.
- **AC-03.2**: Category chips allow single-click filtering with sliding active indicator pills (`layoutId`).
- **AC-03.3**: Filter drawer supports multi-attribute filtering (Condition: New, Like New, Good, Fair; Department: IT, CS, Mech, Civil, ECS, EXTC, Applied Sciences; Pickup Point).
- **AC-03.4**: Responsive layout seamlessly switches between Bento hero grid, 4-column responsive desktop grid, and 1-column mobile card view.
- **AC-03.5**: Empty states offer clear actions ("Clear filters" or "Add to Wishlist").

### US-04: Requesting an Item
*As a student needing project components, I want to request an available item with a note explaining my intended project use, so that the owner can approve my request.*
- **AC-04.1**: Clicking "Request Item" opens a modal displaying the item summary, pickup point, and a message box.
- **AC-04.2**: Once submitted, the item status changes from `available` to `requested`, and the owner receives an instant in-app notification.
- **AC-04.3**: A user cannot request their own listing.
- **AC-04.4**: Multiple interested users can place requests on the same item; the owner is presented with the candidate queue.

### US-05: Approving or Declining Requests
*As an item owner, I want to review incoming requests and approve the best match (or decline with an optional message), so that hand-over logistics can begin.*
- **AC-05.1**: Owner sees pending requests with requester's full name, department badge, trust score, and message.
- **AC-05.2**: Approving one request transitions item status to `reserved` and automatically marks other pending requests as declined with polite notifications.
- **AC-05.3**: Declining prompts for an optional polite reason (e.g., "Given to another student", "No longer available").

### US-06: In-App Handover Coordination Chat
*As a requester or owner of a reserved item, I want to chat inside the app without sharing my personal phone number, so that we can coordinate meeting time at the designated campus pickup point.*
- **AC-06.1**: Dedicated chat thread per active request with zero phone number exposure.
- **AC-06.2**: Provides quick-action reply pills ("When can we meet?", "I'm near the IDEA Lab", "Running 5 minutes late").
- **AC-06.3**: Real-time simulation of message delivery, read receipts, and typing indicators.

### US-07: Hand-Over Confirmation & Instant Impact Calculation
*As a participant in a hand-over, I want both parties to confirm the exchange (or scan the unique item QR code), so that the reuse is recorded and campus metrics increase.*
- **AC-07.1**: Either party can click "Confirm Hand-Over" or scan the item's unique printable QR code.
- **AC-07.2**: When both parties confirm (or QR is verified), item status permanently becomes `reused`.
- **AC-07.3**: Triggers a celebratory screen with confetti animation (`canvas-confetti`).
- **AC-07.4**: Campus cumulative impact metrics (kg avoided and INR saved based on category benchmark weights) update immediately and monotonically.
- **AC-07.5**: Prompts both giver and taker to rate each other (1 to 5 stars) and leave a review.

### US-08: Wishlist & "Wanted" Match Alerts
*As a student needing rare components, I want to create a wishlist entry with keywords, so that I receive an instant alert when a matching item is posted.*
- **AC-08.1**: User can add keywords (e.g. "Raspberry Pi", "Engineering Graphics Kit") to their personal wishlist.
- **AC-08.2**: When a new listing contains matching keywords, a notification is generated and flagged in the user's notification center.
- **AC-08.3**: Wishlist matching items are highlighted with a distinct "Matches your Wishlist" badge on the browse page.

### US-09: Reporting Inappropriate or Prohibited Listings
*As a campus member, I want to report unsafe, commercial, or prohibited items, so that student moderators can take swift action.*
- **AC-09.1**: Every item detail view has a "Report Listing" action with standard campus flags (Prohibited Item, Commercial Sale, Inaccurate Condition, Harassment).
- **AC-09.2**: Reports immediately enter the Admin Reports Queue with reporter ID and item snapshot.
- **AC-09.3**: If an item receives 3 or more reports, its visibility is automatically held pending moderation review.

### US-10: Public Campus Impact Dashboard & Certificates
*As a student or sustainability enthusiast, I want to view campus-wide circular metrics and download my personal sustainability certificate, so that I can quantify our environmental contribution.*
- **AC-10.1**: Real-time visual meters show: Total Items Reused, Total Solid Waste Diverted (kg), Total Student Budget Saved (INR).
- **AC-10.2**: Cumulative monthly reuse chart is strictly non-decreasing over time.
- **AC-10.3**: Department leaderboard displays rankings based on kg avoided and total items transferred.
- **AC-10.4**: Eligible users (≥1 completed reuse) can generate and download a formal, signed PDF "Campus Sustainability Certificate" powered by `jsPDF`.

### US-11: Admin Moderation & Platform Governance
*As an Eco-Cell Admin, I want an administrative panel to review flagged items, inspect user activity, publish campus campaigns, and configure benchmark values, so that the platform runs safely.*
- **AC-11.1**: Admin dashboard KPI cards show active listings, completed reuses, weekly active users, and system health.
- **AC-11.2**: Moderation queue allows one-click item suspension, dismissal of false reports, and user trust-score adjustments.
- **AC-11.3**: Campaign manager enables launching initiatives like "Semester-End Clear-Out Week" with target kg goals and countdowns.
- **AC-11.4**: Data export buttons generate clean CSV reports of campus reuse statistics.

### US-12: Contacting Campus Support & Office Directions
*As an app user, I want to view physical campus office hours, pickup point directions, and submit an inquiry, so that I can resolve logistical issues quickly.*
- **AC-12.1**: Contact view displays official IDEA Lab-1 location, map directions, and office timings.
- **AC-12.2**: Contact form includes honeypot anti-spam, topic selector, message field, and instant validation.
- **AC-12.3**: Submitted messages are stored in `contact_messages` and routed to the admin inbox with ticket statuses (New, In Progress, Resolved).

---

## 5. Non-Functional Requirements (NFR)

1. **Performance**: Initial gzipped JS bundle under 250KB via route splitting; mobile Lighthouse score 90+; sub-3 second FCP on simulated 4G connections.
2. **Accessibility**: Strict WCAG 2.1 AA compliance; full keyboard navigation for modal flows and wizards; high contrast ratios for both light and dark themes; `prefers-reduced-motion` compliance.
3. **Data Integrity & Fallback**: Zero-credential automatic fallback to `MockRepository` with identical reactive UI and localStorage persistence; cumulative impact curves strictly non-decreasing.
4. **Offline Capability (PWA)**: Service worker caching of app shell, icons, and previously loaded listings; offline banner with cached browse support.
5. **Security & Privacy**: Zero exposure of student phone numbers; contact restricted to internal messaging; strict row level security (RLS) policies on all tables.

# AgriLink

You are a senior full-stack engineer and hackathon product builder.

We are building an MVP called AGROLINK for the Thrive in Tech Hackathon.

Agrolink is a trusted digital agriculture marketplace connecting:

1. Farmers

2. Buyers

3. Transporters

The goal of this MVP is NOT to build the entire production system.

The goal is to build a polished, functional prototype that we can deploy and test BEFORE hackathon day, identify weaknesses, validate the core user journey, and later extend during the hackathon.

IMPORTANT:

Prioritize a working end-to-end experience over excessive features.

==================================================

PRODUCT VISION

==================================================

Agrolink reduces friction in agricultural commerce by helping farmers sell produce, buyers discover trusted suppliers, and transporters fulfil deliveries.

The key differentiator is a TRUST SYSTEM that cuts across all three roles.

A buyer should be able to evaluate a farmer.

A farmer should be able to evaluate a buyer.

Both should be able to evaluate a transporter.

The trust system must therefore be treated as a shared product capability, NOT an admin-only feature.

==================================================

TECHNICAL REQUIREMENTS

==================================================

Use:

- TypeScript

- React / Next.js

- Modern component architecture

- Tailwind CSS

- Reusable components

- Clean modular folder structure

- Responsive/mobile-first design

- Accessible UI

- Light/dark theme

- Mock/local data initially

- No unnecessary backend complexity

If an API is required for a feature, abstract it behind a service layer so mock data can easily be replaced later.

Do NOT over-engineer authentication, payments, AI infrastructure, or databases for this test MVP.

The application must be easy to run locally and easy to deploy.

==================================================

DESIGN SYSTEM

==================================================

Use this visual direction:

Deep Forest: #173B32

Sage Green: #7FAF8A

Warm Ivory: #F5F1E8

Soft Gold: #D6B85A

Design principles:

- Modern

- Minimalist

- Premium but approachable

- Agriculture + technology

- Strong visual hierarchy

- Clean cards

- Excellent spacing

- Mobile-first

- Accessible contrast

- Subtle animations only where useful

Avoid making it look like a generic admin dashboard.

==================================================

MVP PAGES

==================================================

Build these pages:

1. Landing Page

2. Authentication / Role Selection

3. Farmer Dashboard

4. Buyer Dashboard

5. Transporter Dashboard

6. Marketplace / Produce Search

7. AI Insights

8. Admin / Map Dashboard

9. Shared Trust Profile / Trust Score component

==================================================

1. LANDING PAGE

==================================================

The landing page should immediately communicate:

"Connecting agriculture through trust."

Show:

- Hero section

- Short explanation of Agrolink

- Farmer / Buyer / Transporter roles

- How Agrolink works

- Trust system explanation

- AI insights section

- CTA to enter the marketplace

- Small impact/value section

Do not overload the page with text.

==================================================

2. AUTHENTICATION / ROLE SELECTION

==================================================

For the MVP, use simple mock authentication.

Allow the user to select:

- Farmer

- Buyer

- Transporter

- Admin

After selecting a role, route them to the appropriate dashboard.

Persist the selected role locally.

Do not build real OAuth or complex authentication yet.

==================================================

3. FARMER DASHBOARD

==================================================

Show:

- Welcome message

- Trust score

- Active listings

- Pending orders

- Completed sales

- Earnings summary

- Recent activity

- Notifications

Allow farmer to:

- Create a produce listing

- View existing listings

- View buyer/order details

- See buyer trust score

- Update order status

Create a realistic sample farmer.

Example:

Farmer:

"Abdul Farms"

Produce:

- Tomatoes

- Maize

- Cassava

==================================================

4. BUYER DASHBOARD

==================================================

Show:

- Welcome message

- Trust score

- Active orders

- Completed purchases

- Recommended produce

- Recent activity

Allow buyer to:

- Search produce

- Filter produce

- View farmer profile

- View farmer trust score

- Place an order

- Track order status

==================================================

5. MARKETPLACE

==================================================

Create a polished marketplace.

Each produce card should show:

- Produce image

- Produce name

- Quantity

- Price

- Location

- Farmer name

- Farmer trust score

- Availability

- "View details"

- "Order"

Include:

- Search

- Category filter

- Location filter

- Trust filter

The marketplace should feel like an actual product rather than a static UI mockup.

==================================================

6. TRANSPORTER DASHBOARD

==================================================

Show:

- Trust score

- Available delivery jobs

- Active delivery

- Completed deliveries

- Earnings

- Notifications

A transporter should be able to:

- View delivery job

- See pickup location

- See destination

- See buyer/farmer trust information

- Accept delivery

- Update status:

  Pending

  Accepted

  Picked Up

  In Transit

  Delivered

Use a mock Google Maps-style map if the real Google Maps API is not configured.

If Google Maps credentials are available, structure the integration cleanly so it can be enabled.

==================================================

7. TRUST SYSTEM

==================================================

THIS IS THE MOST IMPORTANT SHARED FEATURE.

Create a reusable TrustScore component.

Example:

92

HIGH TRUST

Show:

- Score

- Trust level

- Rating

- Completed transactions

- Successful deliveries

- Cancellation rate

- Verification status

Example:

Trust Score: 92

Level: High Trust

Breakdown:

✓ 48 completed transactions

✓ 97% successful fulfilment

✓ Verified identity

✓ 4.8/5 average rating

⚠ 2 cancelled orders

The TrustScore component must be reusable across:

- Farmer profile

- Buyer profile

- Transporter profile

- Marketplace cards

- Order details

- Admin dashboard

Create mock trust data for all three roles.

==================================================

8. CORE END-TO-END FLOW

==================================================

THIS FLOW MUST WORK.

Demo scenario:

1. Farmer logs in.

2. Farmer creates a tomato listing.

3. Buyer logs in.

4. Buyer searches for tomatoes.

5. Buyer sees the farmer's trust score.

6. Buyer opens farmer profile.

7. Buyer places an order.

8. Order appears on farmer dashboard.

9. Transporter logs in.

10. Transporter sees delivery job.

11. Transporter accepts delivery.

12. Delivery status changes.

13. Map/location is displayed.

14. Delivery is completed.

15. Transaction is marked completed.

16. Trust/ratings can be updated.

This should work using mock/local state.

DO NOT build separate disconnected pages.

The application must demonstrate one continuous marketplace journey.

==================================================

9. AI INSIGHTS

==================================================

Build a simple AI-style assistant interface.

For the MVP, mock the AI responses if no API is configured.

The AI should demonstrate useful agricultural marketplace actions.

Examples:

Farmer asks:

"What should I do with my tomatoes that have been listed for 5 days?"

Possible response:

"Your tomatoes have been listed longer than similar listings in your area. Consider reducing the price by 5–8% or enabling a delivery option."

Buyer asks:

"Which farmer should I consider?"

AI can respond using mock marketplace data:

"Abdul Farms has the highest trust score among the available tomato suppliers and has completed 48 transactions with a 97% fulfilment rate."

Transporter asks:

"Which delivery should I prioritize?"

AI recommends based on distance, urgency and delivery status.

The AI interface should demonstrate:

- Ask question

- Receive answer

- Suggested action

- CTA to perform action

Avoid making it a generic ChatGPT clone.

==================================================

10. ADMIN / MAP DASHBOARD

==================================================

Create an admin dashboard showing:

- Total farmers

- Total buyers

- Total transporters

- Active orders

- Active deliveries

- Completed transactions

- Average trust score

- Flagged activity

Include a map visualization showing:

- Farmers

- Buyers

- Transporters

- Active deliveries

Allow admin to inspect:

- User

- Role

- Trust score

- Transaction activity

- Risk/flag status

==================================================

11. NOTIFICATIONS

==================================================

Create a reusable notification system.

Examples:

"New order received."

"Your delivery has been accepted."

"Your order has been delivered."

"Your trust score increased to 94."

"AI recommends adjusting your tomato price."

Use mock notifications initially.

==================================================

12. DATA MODEL

==================================================

Create clean TypeScript types/interfaces for:

User

Farmer

Buyer

Transporter

Produce

Order

Delivery

TrustProfile

Notification

AIInsight

Use realistic seeded mock data.

Do not scatter mock objects throughout components.

Create a central mock data/service layer.

==================================================

13. COMPONENT ARCHITECTURE

==================================================

Create reusable components such as:

Button

Card

Modal

Badge

Input

SearchBar

DashboardCard

ProduceCard

TrustScore

TrustBreakdown

UserProfileCard

OrderCard

DeliveryCard

NotificationPanel

AIChat

MapView

StatusBadge

Navigation

Sidebar

MobileNavigation

Avoid duplicated UI.

==================================================

14. TESTING / MVP VALIDATION

==================================================

Create a simple test checklist inside the project documentation.

The MVP must be tested against:

A. Farmer journey

B. Buyer journey

C. Transporter journey

D. Trust system

E. Order lifecycle

F. Delivery lifecycle

G. AI interaction

H. Admin monitoring

I. Mobile responsiveness

J. Dark/light theme

Also test:

- Empty states

- Loading states

- Error states

- Invalid form submission

- Navigation

- Refreshing the page

- Mobile viewport

==================================================

15. HACKATHON DEMO MODE

==================================================

Create a seeded demo environment.

The app should open with realistic sample data.

Include these demo users:

FARMER

Abdul Farms

Trust Score: 92

BUYER

FreshMart Retail

Trust Score: 88

TRANSPORTER

SwiftHaul Logistics

Trust Score: 95

Seed:

- 6–10 produce listings

- 3–5 orders

- 3 delivery jobs

- notifications

- trust histories

- AI insights

The purpose is to allow us to immediately test the product without setting up real accounts.

==================================================

16. IMPORTANT MVP RULE

==================================================

Do NOT spend most of the time building backend infrastructure.

The MVP is primarily for:

- product validation

- UX testing

- demo rehearsal

- identifying missing flows

- collecting team feedback

Use mock data and local state where necessary.

Architecture should make it possible to replace mock services with real APIs later.

==================================================

17. DEFINITION OF DONE

==================================================

The MVP is DONE when someone unfamiliar with the project can:

1. Enter Agrolink.

2. Choose a role.

3. Explore the marketplace.

4. View trust scores.

5. Create or place an order.

6. Assign/accept a delivery.

7. Track delivery.

8. Complete the transaction.

9. See how trust is involved.

10. Ask the AI for a recommendation.

11. View marketplace activity from admin.

The entire experience should be understandable without a developer explaining every screen.

==================================================

18. FINAL IMPLEMENTATION REQUIREMENT

==================================================

Before finishing:

- Run the project.

- Fix TypeScript errors.

- Fix console errors.

- Check responsive layouts.

- Test every route.

- Test the complete farmer → buyer → transporter journey.

- Ensure buttons actually perform actions.

- Ensure no placeholder lorem ipsum remains.

- Ensure there are no dead links.

- Ensure the demo data makes sense.

- Provide a README with:

  - setup instructions

  - environment variables

  - project structure

  - demo accounts/roles

  - core user flow

  - known limitations

Do not stop at generating the UI.

BUILD THE FUNCTIONAL MVP.

==================================================

19. DEVELOPER GUIDE & DEMO INSTRUCTIONS

==================================================

### Local Development Setup

Prerequisites: Node.js 18+ and npm.

```sh
npm install
npm run dev
```

The application will launch on `http://localhost:8080`.

### Production Build

```sh
npm run build
npm run preview
```

### Seeded Demo Accounts

You can switch between any of these accounts instantly using the role switcher in the top navigation bar or visiting `/auth`:

1. **Farmer**: `Abdul Farms` (Kano, Northern Region) — Trust Score 92.
2. **Buyer**: `FreshMart Retail` (Lagos, Commercial Hub) — Trust Score 88.
3. **Transporter**: `SwiftHaul Logistics` (Abuja, FCT) — Trust Score 95.
4. **Admin**: `Agrolink Operations` (Lagos, Operations HQ) — Trust Score 100.

### Complete End-to-End Walkthrough Flow

1. Open `/auth` and select **Abdul Farms (Farmer)**.
2. Click **Add New Produce Listing** to add a harvest lot (e.g. 500kg Tomatoes at ₦800/kg).
3. Switch role to **FreshMart Retail (Buyer)** via the top navigation dropdown.
4. Open `/marketplace`, filter by Vegetables or search for tomatoes, and open the produce details.
5. Review Abdul Farms' trust breakdown and click **Confirm Order**.
6. Switch role to **SwiftHaul Logistics (Transporter)** and navigate to the Transporter Dashboard.
7. Find the newly requested haulage job in **Available Delivery Jobs** and click **Accept Delivery Job**.
8. Advance the shipment status from **Accepted** → **Picked Up** → **In Transit** → **Mark Delivered**.
9. Switch back to **FreshMart Retail (Buyer)**, confirm receipt, and submit a 5-star rating for the farmer and transporter.
10. Verify that both counterparty trust scores increase and new trust history logs are recorded.
11. Navigate to `/admin` to inspect nationwide platform GMV, volume, and active logistics corridors on the map.

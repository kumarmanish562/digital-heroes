# Digital Heroes — Premium Backend v2

Fresh backend built specifically for the **Digital Heroes Premium UI**.

## Stack

- Node.js 22+
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Zod validation
- Role-based admin APIs
- Stripe-ready subscriptions
- Local demo subscription mode by default
- Helmet, CORS, rate limiting and structured API responses

## 1. Install

```bash
npm install
```

## 2. Configure

```bash
copy .env.example .env
```

For MongoDB Atlas, replace `MONGO_URI` with the connection string copied directly from Atlas. Do not commit `.env`.

## 3. Seed demo data

```bash
npm run seed
```

Creates:

```text
Admin email:    admin@digitalheroes.local
Admin password: Admin@12345
```

Change the password before using the project outside local development.

## 4. Start

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

Health:

```text
http://localhost:5000/health
```

## 5. Frontend environment

The premium React UI should contain:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Important route compatibility

The backend intentionally exposes:

```text
POST /api/v1/auth/login
POST /api/v1/auth/register
GET  /api/v1/user/me
PUT  /api/v1/user/me
GET  /api/v1/scores
POST /api/v1/scores
PUT  /api/v1/scores/:id
DELETE /api/v1/scores/:id
GET  /api/v1/charities
GET  /api/v1/charities/me
POST /api/v1/charities/select
GET  /api/v1/subscriptions/plans
GET  /api/v1/subscriptions/me
POST /api/v1/subscriptions/checkout
POST /api/v1/subscriptions/cancel
GET  /api/v1/draws
GET  /api/v1/draws/current
GET  /api/v1/draws/:id
GET  /api/v1/draws/winnings
GET  /api/v1/admin/dashboard
GET  /api/v1/admin/users
POST /api/v1/admin/draws
POST /api/v1/admin/draws/:id/simulate
POST /api/v1/admin/draws/:id/publish
GET  /api/v1/admin/charities
POST /api/v1/admin/charities
PUT  /api/v1/admin/charities/:id
DELETE /api/v1/admin/charities/:id
GET  /api/v1/admin/winners
POST /api/v1/admin/winners/:id/approve
POST /api/v1/admin/winners/:id/reject
POST /api/v1/admin/winners/:id/pay
```

## Subscription modes

Default:

```env
SUBSCRIPTION_PROVIDER=demo
```

In demo mode, checkout activates a subscription immediately and returns the frontend subscription URL. This makes the premium UI fully testable without Stripe.

For Stripe:

```env
SUBSCRIPTION_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Never paste secret Stripe keys into GitHub or chat.

## Draw workflow

Admin:

```text
Create draw
   ↓
Simulate draw
   ↓
Generate 5 unique numbers
   ↓
Evaluate members' latest 5 scores
   ↓
Create matching winner records
   ↓
Publish draw
   ↓
Review winner
   ↓
Approve / Reject
   ↓
Mark paid
```

## Verification

After installing dependencies:

```bash
npm run typecheck
npm run build
```

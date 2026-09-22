# Digital Heroes Premium Backend

Fresh Node.js + Express + TypeScript + MongoDB API designed for the Digital Heroes premium React UI.

## Run

```bash
npm install
copy .env.example .env
npm run seed
npm run dev
```

API: `http://localhost:5000`
Health: `http://localhost:5000/health`

## Demo admin

- Email: `admin@digitalheroes.local`
- Password: `Admin@12345`

Change this password for any non-demo environment.

## Subscription

The default provider is `demo`, so checkout works locally without Stripe. Set `SUBSCRIPTION_PROVIDER=stripe` and configure Stripe price IDs for real Checkout sessions.

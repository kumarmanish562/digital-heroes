# Digital Heroes Frontend

React + TypeScript + Vite frontend for the Digital Heroes backend.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- Responsive CSS

## Backend contract

The frontend expects the backend from `digital-heroes-server-complete.zip` to run at:

`http://localhost:5000`

API prefix:

`http://localhost:5000/api/v1`

Override it in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Run

```bash
npm install
copy .env.example .env
npm run typecheck
npm run build
npm run dev
```

Open:

`http://localhost:5173`

## Main routes

- `/login`
- `/register`
- `/dashboard`
- `/scores`
- `/charity`
- `/subscription`
- `/draws`
- `/draws/:id`
- `/winnings`
- `/profile`
- `/admin`

## API mapping

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

### User

- `GET /user/me`
- `PUT /user/me`

### Scores

- `GET /scores`
- `POST /scores`
- `PUT /scores/:id`
- `DELETE /scores/:id`

### Charity

- `GET /charities`
- `GET /charities/me`
- `POST /charities/select`

### Subscription

- `GET /subscriptions/plans`
- `GET /subscriptions/me`
- `POST /subscriptions/checkout`
- `POST /subscriptions/cancel`

### Draws

- `GET /draws`
- `GET /draws/current`
- `GET /draws/:id`
- `GET /draws/winnings`

### Admin

- `GET /admin/dashboard`
- `GET /admin/users`
- `POST /admin/draws`
- `POST /admin/draws/:id/simulate`
- `POST /admin/draws/:id/publish`
- `GET /admin/charities`
- `POST /admin/charities`
- `PUT /admin/charities/:id`
- `DELETE /admin/charities/:id`
- `GET /admin/winners`
- `POST /admin/winners/:id/approve`
- `POST /admin/winners/:id/reject`
- `POST /admin/winners/:id/pay`

## Important backend limitation

The supplied backend has a winner proof service method but no user-facing HTTP endpoint for submitting proof. The frontend therefore shows proof when the backend returns `proofUrl`, but does not invent an upload endpoint.

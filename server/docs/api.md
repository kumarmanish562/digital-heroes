# API Contract

Base URL: `/api/v1`

## Auth
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`
- POST `/auth/logout`

## User
- GET `/user/me`
- PUT `/user/me`

## Scores
- GET `/scores`
- POST `/scores`
- PUT `/scores/:id`
- DELETE `/scores/:id`

## Charity
- GET `/charities`
- GET `/charities/me`
- POST `/charities/select`

## Subscription
- GET `/subscriptions/plans`
- GET `/subscriptions/me`
- POST `/subscriptions/checkout`
- POST `/subscriptions/cancel`

## Draws
- GET `/draws`
- GET `/draws/current`
- GET `/draws/:id`
- GET `/draws/winnings`

## Admin
- GET `/admin/dashboard`
- GET `/admin/users`
- POST `/admin/draws`
- POST `/admin/draws/:id/simulate`
- POST `/admin/draws/:id/publish`
- GET `/admin/charities`
- POST `/admin/charities`
- PUT `/admin/charities/:id`
- DELETE `/admin/charities/:id`
- GET `/admin/winners`
- POST `/admin/winners/:id/approve`
- POST `/admin/winners/:id/reject`
- POST `/admin/winners/:id/pay`

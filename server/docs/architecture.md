# Architecture

- Express 5 HTTP API
- TypeScript strict mode
- MongoDB with Mongoose
- JWT bearer authentication
- Role-based admin authorization
- Zod request validation
- Helmet, CORS and rate limiting
- Demo subscription provider for local development
- Optional Stripe Checkout integration

The API envelope is consistent:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

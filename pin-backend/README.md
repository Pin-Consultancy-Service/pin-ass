# PIN Associate Backend

FastAPI service for the PIN Associate platform. The initial layout follows the
frontend's portal areas: student, consultancy client, corporate training, staff
administration, and payments.

## Local setup

From this directory, create and activate a virtual environment, install
`requirements.txt`, copy `.env.example` to `.env`, and replace `SECRET_KEY` with a
fresh random value. Never commit `.env` or use production credentials locally. Apply
the schema with `alembic upgrade head`.

Create an administrator from a trusted terminal with
`python scripts/create_admin.py --email admin@example.com`; the command prompts for
the password and does not enable public administrator registration. Run the
development server with `uvicorn app.main:app --reload`. The liveness route is
`GET /api/v1/health`; interactive API documentation is available at `/docs` in
development only.

To create the development-only sample fee plan, run
`python scripts/seed_demo_fee_plan.py` after applying migrations. It uses the illustrative
₦500,000 total, payable in full or as two ₦250,000 payments, and refuses to run when
`ENVIRONMENT=production`.

To try hosted Paystack Checkout, set `PAYSTACK_SECRET_KEY` to the test secret (`sk_test_...`)
in the ignored local `.env`, then restart FastAPI. Development configuration rejects
live Paystack keys. The student API creates the Checkout URL on the server and redirects
the browser to Paystack; no public key or card details belong in the frontend.

`FRONTEND_ORIGINS` and `ALLOWED_HOSTS` use JSON arrays. Set exact deployment origins
and hostnames before deployment. Do not use wildcard origins with credentials enabled.

## Layout

```text
app/
  api/v1/endpoints/  domain route modules
  core/              environment settings and HTTP security policy
  db/                database and migration integration seam
  models/            persistence models
  schemas/           request and response contracts
  services/          business operations and external integrations
```

## Security and integration notes

- Secrets come from environment configuration; `.env` is ignored by Git.
- CORS and accepted hosts are explicit allowlists. Production API docs are disabled.
- Generic server errors do not expose stack traces. Add private structured error
  reporting before deployment; never log credentials, tokens, or payment data.
- The student and admin login screens use HttpOnly session cookies and CSRF headers.
  The frontend keeps only non-sensitive profile display data in `localStorage`; never
  put access/refresh credentials there.
- Payment routes must initialize and verify transactions server-side, validate
  webhook signatures, make callbacks idempotent, and never trust browser-supplied
  payment status. Students can choose full payment or two installments; the API
  calculates the amount and enforces the two-payment maximum. Do not store card details.
- Authentication, role authorization, persistence, and migrations are implemented.
  Rate limiting, monitoring, backups, and deployment proxy settings still need
  operational configuration.
  Configure rate limiting at the API gateway/reverse proxy before exposing signup or
  login publicly. Treat this as a development starting point, not a production-ready
  security certification.

## Initial API areas

See [API_FLOW.md](API_FLOW.md) for student signup/login, paid access gating, payments,
and admin finance reporting. Client/training operations, receipts, and enrollment
snapshots that preserve historic plan prices are not implemented yet. The application
does not offer refunds.

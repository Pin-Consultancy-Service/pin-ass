# Student, admin, and payment API flow

All routes are under `/api/v1`. Amounts are integer minor units (kobo for NGN).
Admins create a priced course offer for a specific cohort, including admin-selected
cohort labels and start/end dates. Duration is not hard-coded. Students may pay that total once or in two
payments: the first is half (rounded up by one kobo if needed), and the second is the
remaining balance. The server computes each charge and rejects any third payment.

## Student account

1. `POST /auth/register` creates student accounts only.
2. `POST /auth/login` sets a short-lived `HttpOnly`, `SameSite=Strict` session cookie.
   Production cookies also use `Secure`.
3. `GET /auth/me` returns the signed-in user's public profile.
4. `GET /auth/csrf` returns the CSRF token for the cookie session. Send it in
   `X-CSRF-Token` for authenticated state changes. Logout uses `POST /auth/logout`.

Passwords are Argon2-hashed. Create admins with `scripts/create_admin.py` from a trusted
terminal; public registration cannot create administrators.

## Student payments

1. Read available options with `GET /students/me/fee-plans`, enrolled-plan balances and
   confirmed payment counts with `GET /students/me/fee-balances`, and history with
   `GET /students/me/payments`.
2. Initialize a payment using `POST /payments/initialize` with
   `{ "fee_plan_id": "...", "payment_option": "FULL", "idempotency_key": "..." }`
   or `payment_option: "INSTALLMENT"`. The browser does not submit the charge amount;
   the backend calculates it from the fee total and payment history. Starting checkout
   enrolls the signed-in student in that fee plan; balances are scoped to those enrolled
   plans and the student's own transactions.
3. The backend stores a pending attempt and initializes Paystack. A pending attempt is
   reused when retried with the same option; a different option is rejected until that
   attempt is resolved. The response contains the hosted Checkout URL.
4. Paystack redirects to `/payments/callback`. The backend verifies the transaction
   server-side and checks its reference, status, amount, and currency before confirming
   it. `POST /payments/verify/{reference}` can refresh the signed-in student's attempt.
5. Signed Paystack webhooks go to `/payments/webhook`. `charge.success` events are
   reconciled idempotently. Other events are ignored.
6. `/students/me/access` unlocks dashboard resources after any confirmed payment.
   Fee plans and payment history remain available while the dashboard is locked.
7. Students can download a PDF receipt for their own confirmed payments at
   `GET /students/me/payments/{payment_id}/receipt`. Pending or failed payments and
   another student's transactions do not produce a receipt.

## Classes

- Fee plans are classified as ICAN, ACCA, CITN, CISA, or ATS when created. Admins may
  classify an unclassified legacy plan once with `PATCH /admin/fee-plans/{id}/exam-body`.
  A fee plan should only be used for one exam body; create separate plans for separate
  qualifications. Classifying a legacy plan makes its existing paid students members of
  that exam body, so only classify it when all of those students belong to that track.
- Admins use `GET /admin/classes` and `POST /admin/classes` to review and schedule
  sessions against a matching active fee plan. Class times must include a timezone; meeting,
  recording, and material links must use HTTPS.
- Students use `GET /students/me/classes`. It returns sessions only when that student
  has a confirmed payment for the exact fee plan/course cohort assigned to the session.
  This scopes access to the cohort paid for and includes earlier sessions in that cohort
  for late enrollees. Meeting links are returned only
  during the live window (15 minutes before start through class end), and recording
  links are returned after the session ends.

## Admin reports and fee plans

- `GET /admin/students` lists student signups.
- `GET /admin/payments` and `/admin/payments/summary` report payment attempts.
- `GET /admin/payments/export.xlsx` exports the current complete payment ledger,
  including pending, confirmed, and failed attempts. The export is generated from the
  PostgreSQL records when requested and is restricted to authenticated admins.
- The Excel file is a reporting copy, not a database backup. Protect payment history with
  scheduled, access-controlled PostgreSQL backups and verify that backups can be restored.
- `GET /admin/finance/summary` reports confirmed income, expenses, net recorded, pending
  payments, and recent student signups.
- `GET` and `POST /admin/fee-plans` list and create total fees. A price change should use
  a new plan so prior students keep the original total.
- There is no refund UI or refund API in this application.

The development example fee plan is ₦500,000 total, payable as ₦500,000 once or as two
payments of ₦250,000. It is illustrative only, not approved tuition.

Paystack requires server-side initialization and verification. Keep secret keys in the
backend environment, never in frontend code. See the
[Transaction API](https://paystack.com/docs/api/transaction/),
[Verify Payments](https://paystack.com/docs/payments/verify-payments/), and
[Webhooks](https://paystack.com/docs/payments/webhooks/).

-- Minimal DDL mirroring the `account` model in prisma/schema.prisma, for `npm run test:race`.
CREATE TABLE account (id serial PRIMARY KEY, plan_id int NOT NULL, stripe_customer_id text, stripe_subscription_id text, current_period_ends timestamp NOT NULL DEFAULT now(), ai_gen_count int NOT NULL DEFAULT 0);

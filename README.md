# Nuxt 3 (SAAS) Boilerplate

## Not Production Ready
Please don't hitch your wagon to this star just yet... I'm coding this in the open and the TODO list is verrrrrry long.

## Tech Stack
- Nuxt 3 (I like it, shut up)
- Supabase (Auth including OAuth + Postgresql instance)
- Prisma (Schema management + Strongly typed client)
- TRPC (Server/Client communication with Strong types)
- Pinia (State Store.  I liked vuex a lot, in particular explicit mutations but gotta go with the cool crowd)
- Stripe (Payments including Webhook integration)

## Special Mention
This https://blog.checklyhq.com/building-a-multi-tenant-saas-data-model/ Article by https://twitter.com/tim_nolet was my inspiration for the user/account/subscription schema.  Tim was also generous with his time and answered some of my stoopid questions on the https://www.reddit.com/r/SaaS/ Subreddit.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Config
### .env
Most of the .env settings are self explanatory and are usually secrets.

### Trial Plan
If you want a 'free trial period' set initialPlanName to an appropriate plan name in the DB and initialPlanActiveMonths to a positive value.  If you don't want a free trial, set initialPlanName to an appropriate 'No Plan' plan in the DB and set the initialPlanActiveMonths to -1.

# Steps to Create
This is what I did to create the project including all the extra fiddly stuff.  Putting this here so I don't forget.

## Setup Nuxt
Follow instructions from here https://nuxt.com/docs/getting-started/installation

```bash
# install node
n lts
npx nuxi init nuxt3-boilerplate
code nuxt3-boilerplate/
npm install
npm run dev -- -o
```
## Setup Supabase

To setup supabase and middleware, loosely follow instructions from https://www.youtube.com/watch?v=IcaL1RfnU44

Supabase - new account (free tier), used github oath for supabase account

```
npm install  @nuxtjs/supabase
```

add this to nuxt.config.ts
```
modules: ['@nuxtjs/supabase']
```
## Setup Google OAuth

Follow these instructions to add google oath https://supabase.com/docs/guides/auth/social-login/auth-google

## Nuxt-Supabase
Then I frigged around trying to get the nuxt-supabase module to work properly for the oauth flow.  It's a bit of a mess TBH. Eventually I looked at the demo https://github.com/nuxt-modules/supabase/tree/main/demo like a chump and got it working

## Integrating Prisma
This felt like a difficult decision at first.  the Subabase client has some pseudo sql Ormy sort of features already
but Prisma has this awesome schema management support and autogeneration of a typed client works great and reduces errors.
I already had a schema lying around based on this (https://blog.checklyhq.com/building-a-multi-tenant-saas-data-model/) that was nearly what I needed and it was nice to be able to re-use it.

```
npm install prisma --save-dev
npx prisma init
```
go to Supabase -> settings -> database -> connection string -> URI.. and copy the URI into the 
DATABASE_URL setting created with prisma init.
still in database, go to 'Database password' and reset/set it and copy the password into the [YOUR-PASSWORD] placeholder in the URI

Then I manually hand coded the schema.prisma file based on something else I already had.

```
npx prisma db push
npm install @prisma/client --save-dev
npx prisma generate
```

## Stripe Integration
This was a royal pain in the butt.  Got some tips from https://github.com/jurassicjs/nuxt3-fullstack-tutorial and https://www.youtube.com/watch?v=A24aKCQ-rf4&t=895s  Official docs try to be helpful but succeed only in confusing things https://stripe.com/docs/billing/quickstart

I set up a Stripe account with a couple of 'Products' with a single price each to represent my different plans.  These price id's are embedded into the Pricing page.

### Key things I learned
- You need to need to pre-emptively create a Stripe user *before* you send them to the checkout page so that you know who they are when the webhook comes back.
- There are like a Billion Fricking Webhooks you *can* subscribe to but for an MVP, you just need the *customer.subscription* events and you basically treat them all the same.

# TODO
- add role to membership and have methods for changing role, making sure one owner etc (done)
- remove @unique so users can have multiple accounts (done)
- add concept of 'current' account for user.. (done)
- add max_notes property to plan and account as an example of a 'limit' property (done)
- add spinup script somehow to create plans???.... should I use some sort of generator like sidebase?
- team invitation thingy (not required, admins can add new members to team)
- actions which mutate the current user account should update the context... (done)
- integration with stripe including web hooks (basics done).
-- add email to user record... capture from login same as user name (done)
-- initial user should be created with an expired plan (done, initial plan and plan period now controled via config to allow either a trial plan or a 'No Plan' for initial users)
-- add a pricing page....should be the default redirect from signup if the user has no active plan.. not sure whether to use a 'blank' plan or make plan nullable  (basic pricing page is done - decided on 'no plan' plan)
-- figure out what to do with Plan Name.  Could add Plan Name to account record and copy over at time of account creation or updation.  could pull from the Plan record for display.... but makes it difficult to change... should be loosely coupled, maybe use first approach (done)
-- figure out when/how plan changes.. is it triggered by webhook?
# Admin Functions Scenario (shitty test)
Pre-condition
User 3 (encumbent id=3) - Owner of own single user account.  Admin of Team account
User 4 (noob id = 4) - Owner of own single user account.  

User 3...
- joins user 4 to team account (expect user is a read only member of team account)
- upgrades user 4 to owner (should fail)
- upgrades user 4 to admin
- claims ownership of team account



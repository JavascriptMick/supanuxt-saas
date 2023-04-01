# Nuxt 3 (SAAS) Boilerplate


## Not Production Ready
Please don't hitch your wagon to this star just yet... I'm coding this in the open and the TODO list is verrrrrry long.

## Tech Stack
- Nuxt 3 (I like it, shut up)
- Supabase (Auth including OAuth + Postgresql instance)
- Prisma (Schema management + Strongly typed client)
- TRPC (Server/Client communication with Strong types, SSR compatible)
- Pinia (State Store.  I liked vuex a lot, in particular explicit mutations but gotta go with the cool crowd)
- Stripe (Payments including Webhook integration)


## Features
### User Management
- [x] User authentication via Supabase including Social Signon (e.g. google) Email/Password (TODO) and Magic Link
- [x] Full list of available [providers](https://supabase.com/docs/guides/auth#providers)
- [x] User roles and permissions (admin, regular user, etc. roles defined in the [Prisma Schema](/prisma/schema.prisma))
- [x] User Email captured on initial login
- [x] Initial plan and plan period controled via config to allow either a trial plan or a 'No Plan' for initial users
- [ ] Edit Account Name from Account Page

### Schema and DB Management
- [x] Prisma based Schema Management
- [x] Supabase integration for DB
- [ ] Smart DB initialisation script including Plan and Stripe Product information, maybe templated

### Config Management and Env integration
- [x] [Config](/nuxt.config.ts) for Stripe Keys
- [x] [Env](/.env_example) keys for Supabase and Stripe
- [x] Config Switches for free trial - If you want a 'free trial period' set initialPlanName to an appropriate plan name in the DB and initialPlanActiveMonths to a positive value.  If you don't want a free trial, set initialPlanName to an appropriate 'No Plan' plan in the DB and set the initialPlanActiveMonths to -1.

### Multi-Modal State Management
- [x] SPA type pages (e.g. [Dashboard](/pages/dashboard.vue)) - postgresql(supabase) -> Prisma -> Service Layer for Business Logic -> TRPC -> Pinia -> UI
- [x] SSR type pages (e.g. [Note](/pages/notes/[note_id].vue)) - postgresql(supabase) -> Prisma -> Service Layer for Business Logic -> TRPC -> UI

### Multi User Accounts (Teams)
- [x] Allow users to upgrade their accounts fron individual accounts to multi-user accounts (Teams).
- [x] Allow users to switch between Teams and view/edit data from the selected Team.
- [x] All features, billing and limits is controlled at the Account (Team) level (not the user level)
- [ ] Team administrators and owners can administer the permissions (roles) of other team members on the Accounts page
- [ ] Gen/Regen an invite link to allow users to join a team

### Plans and Pricing
- [x] Manage multiple Plans each with specific Feature flags and Plan limits
- [x] Plan features copied to Accounts upon successfull subscription
- [x] Loose coupling between Plan and Account Features to allow ad-hoc account tweaks without creating custom plans
- [x] Pricing page appropriately reacts to users with/without account and current plan.
- [ ] Plan features and Limits available in an object structure in Server methods and with method annotations or similar

### Stripe (Payments) Integration
- [x] Each plan is configured with Stripe Product ID so that multiple Stripe Prices can be created for each plan but subscriptions (via Webhook) will still activate the correct plan.
- [x] Support basic (customer.subscription) flows for Subscription payments via Webhook
- [ ] Support additional Stripe flows for things like failed payments, imminent subscription expiry (send email?) etc.....

### Support
- [ ] Help desk support (ticketing system, live chat, etc.)
- [ ] Knowledge base with FAQs and tutorials

### Look and Feel, Design System and Customisation
- [x] Very Crap default UI
- [ ] Not Crap UI
- [ ] Integrated Design system (Bootstrap? Tailwind?)
- [ ] Branding options (logo, color scheme, etc.)

### Demo Software (Notes)
- [x] Simple Text based Notes functionality
- [x] Read only Notes Dashboard
- [x] SSR Rendered (SEO Optimised) [Note](/pages/notes/[note_id].vue) Display
- [x] Max Notes limit property on Plan 
- [ ] Max Notes enforced
- [ ] Optional public SSR Rendered public notes index page
- [ ] Add, Delete, edit notes on Dashboard

### Mobile App
- [ ] Flutter App Demo integrating with API endpoints, Auth etc
- [ ] Mobile-friendly web interface.


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

Start the Stripe thingy

```bash
stripe listen --forward-to localhost:3000/webhook
```

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
remember to update email template
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

# Admin Functions Scenario (shitty test)
Pre-condition
User 3 (encumbent id=3) - Owner of own single user account.  Admin of Team account
User 4 (noob id = 4) - Owner of own single user account.  

User 3...
- joins user 4 to team account (expect user is a read only member of team account)
- upgrades user 4 to owner (should fail)
- upgrades user 4 to admin
- claims ownership of team account



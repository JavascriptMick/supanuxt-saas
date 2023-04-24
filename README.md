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
- Tailwind + daisyUI (Tailwind because everybody is using it, daisyUI because I suck at tailwind)

## Features
### User Management
- [x] User authentication via Supabase including Social Signon (e.g. google) Email/Password (TODO) and Magic Link
- [x] Full list of available [providers](https://supabase.com/docs/guides/auth#providers)
- [x] User roles and permissions (admin, regular user, etc. roles defined in the [Prisma Schema](/prisma/schema.prisma))
- [x] User Email captured on initial login
- [x] Initial plan and plan period controled via config to allow either a trial plan or a 'No Plan' for initial users
- [x] Edit Account Name from Account Page

### Schema and DB Management
- [x] Prisma based Schema Management
- [x] Supabase integration for DB
- [x] DB Seed Script to setup plan information including Plan and Stripe Product information

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
- [x] Gen/Regen an invite link to allow users to join a team
- [x] Team administrators and owners can accept pending invites
- [x] Team administrators and owners can administer the permissions (roles) of other team members on the Accounts page
- [x] Team owners can remove users from team

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
- [x] Default UI isn't too crap
- [x] Integrated Design system including theming (Tailwind + daisyUI)

### Demo Software (Notes)
- [x] Simple Text based Notes functionality
- [x] Read only Notes Dashboard
- [x] SSR Rendered (SEO Optimised) [Note](/pages/notes/[note_id].vue) Display
- [x] Max Notes limit property on Plan 
- [x] Max Notes enforced
- [x] Add, Delete notes on Dashboard

### Testing
- [ ] Unit tests for server functions
- [ ] Integration tests around subscription scenarios

## Special Mention
This https://blog.checklyhq.com/building-a-multi-tenant-saas-data-model/ Article by https://twitter.com/tim_nolet was my inspiration for the user/account/subscription schema.  Tim was also generous with his time and answered some of my stoopid questions on the https://www.reddit.com/r/SaaS/ Subreddit.

## Externals Setup
Things you gotta do that aren't code (and are therefore not very interesting)

### Env
Copy the [.env_example](/.env_example) file to create [.env](/.env) 
Note) This file is for development convenience, is .gitignored by default and should *not* be added to source control

### Supabase
This solution uses Supabase for Auth and to provide a DB.  In addition to Magic Link and email/password login via Supabase, it also supports Google OAuth via Supabase.

1) Go to [Supabase](https://supabase.com/) and 'Start your Project'
2) Setup your org and project (Free tier is fine to start)
3) Update the project's email template
4) Choose an OAuth provider.  I have chosen Google using these [Instructions](https://supabase.com/docs/guides/auth/social-login/auth-google) for the purposes of demonstration but they all should work.
5) Go to Project Settings -> API and copy Project URL and Project API Key to SUPABASE_URL and SUPABASE_KEY settings respectively in your [.env](/.env) file
6) Go to Project Settings -> Database -> Connection String -> URI and copy the uri value into the DATABASE_URL setting in your [.env](/.env) file, remembering to replace ```[YOUR-PASSWORD]``` with the password you provided when you setup the project.

### Stripe
This solution uses Stripe for Subscription payments.

1) Go to [Stripe](https://stripe.com) and setup your business (Free Tier is fine to start)
2) Create 2 products ('Team Plan' and 'Individual Plan') each with a single price and note the Product ID's and Price ID's
3) Edit the [seed.ts](/prisma/seed.ts) file and replace the stripe_product_id values with the Product ID's from 2)
``` typescript
    create: {
      name: 'Team Plan',
      .....
      stripe_product_id: '[Your Product ID from Stripe]'
    },
```
4) Edit the Pricing [pricing](/pages/pricing.vue) page and put your Price ID's from 2) into the appropriate hidden ```price_id``` form fields...
``` html
<input type="hidden" name="price_id" value="[Your Price ID from Stripe]" />
```

### Setup Database (Prisma)
This solution uses Prisma to both manage changes and connect to the Postgresql database provided by Supabase.  Your Supabase DB will be empty by default so you need to hydrate the schema and re-generate the local prisma client.
```
npx prisma db push
npx prisma generate
npm install @prisma/client --save-dev
npx prisma db seed
```
...you should now have a a Plan table with 3 rows and a bunch of empty tables in your Supabase DB

## Developement Setup

### Dependencies

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```



### Webhook Forwarding
This makes sure that you can debug subscription workflows locally


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


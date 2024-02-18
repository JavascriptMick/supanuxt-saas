# Changelog

## Version 1.4.3
### Update All Dependencies to latest
- openai (3.3.0 -> 4.28.0)
- superjson (1.12.2 -> 2.2.1)
- node types (18.15.11 -> 20.11.19)
- stripe lib (11.12.0 -> 14.17.0)
- stripe api version (2022-11-15 -> 2023-10-16)
- cookie consent (2.9.2 -> 3.0.0)
- daisyui (2.51.5 -> 4.7.2)
- vitest (0.33.0 -> 1.3.0)
- other minor and patch versions


## Version 1.4.2
- Added Favicons and web manifest and referenced in nuxt.config (I used https://favicon.io/favicon-converter/ to generate the icon assets, seems to work well)
- Added patch folder to hold patch files, should make it easier to update repos based on earlier versions
- Refactor service classes into namespaces to avoid pointless service instantiation (1_4_2-service-refactor-to-namespaces_authcontextremoved.patch or 1_4_2-service-refactor-to-namespaces.patch)
- Added an Acount Deletion page - you will need to show you have one of these (along with privacy and terms pages) for several signups e.g. Facebook login
- Added seoMeta - required for Facebook login

## Version 1.4.1

- Refactor some components and explicitly split out client only components
- Fix bug in the notifications
- Update readme to indicate sister project in react/next

## Version 1.4.0

- Cookie Consent
  `npm i vanilla-cookieconsent`

## Version 1.3.0

- Add an example of usage limits (Notes AI Gen).
- Includes non-destructive schema changes
  `npx prisma db push`

## Version 1.2.0

- 'Lift' auth context into server middleware to support authenticated api (rest) endpoints for alternate clients while still supporting fully typed Trpc context.

## Version 1.1.0

- Upgrade Prisma to version 5 to improve performance (https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-5)

```
npm install @prisma/client@5
npm install -D prisma@5
npx prisma generate
```

- Upgrade Nuxt to 3.7.0

```
npx nuxi upgrade --force
```

## Version 1.0.0

First Release version. If your package.json does not have a version attribute, this is the version you have.

## Project Creation (for interest only)

This is what I did to create the project including all the extra fiddly stuff. Putting this here so I don't forget.

### Setup Nuxt

I Followed instructions from here https://nuxt.com/docs/getting-started/installation

```bash
# install node
n lts
npx nuxi init nuxt3-boilerplate
code nuxt3-boilerplate/
npm install
npm run dev -- -o
```

### Setup Supabase

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

### Setup Google OAuth

Follow these instructions to add google oath https://supabase.com/docs/guides/auth/social-login/auth-google

### Nuxt-Supabase

Then I frigged around trying to get the nuxt-supabase module to work properly for the oauth flow. It's a bit of a mess TBH. Eventually I looked at the demo https://github.com/nuxt-modules/supabase/tree/main/demo like a chump and got it working

### Integrating Prisma

This felt like a difficult decision at first. the Subabase client has some pseudo sql Ormy sort of features already
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

### Stripe Integration

This was a royal pain in the butt. Got some tips from https://github.com/jurassicjs/nuxt3-fullstack-tutorial and https://www.youtube.com/watch?v=A24aKCQ-rf4&t=895s Official docs try to be helpful but succeed only in confusing things https://stripe.com/docs/billing/quickstart

I set up a Stripe account with a couple of 'Products' with a single price each to represent my different plans. These price id's are embedded into the Pricing page.

### Key things I learned

- You need to need to pre-emptively create a Stripe user _before_ you send them to the checkout page so that you know who they are when the webhook comes back.
- There are like a Billion Fricking Webhooks you _can_ subscribe to but for an MVP, you just need the _customer.subscription_ events and you basically treat them all the same.

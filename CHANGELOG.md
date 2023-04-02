# Changelog

## Version 0.0.0
This is what I did to create the project including all the extra fiddly stuff.  Putting this here so I don't forget.

### Setup Nuxt
Follow instructions from here https://nuxt.com/docs/getting-started/installation

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
Then I frigged around trying to get the nuxt-supabase module to work properly for the oauth flow.  It's a bit of a mess TBH. Eventually I looked at the demo https://github.com/nuxt-modules/supabase/tree/main/demo like a chump and got it working

### Integrating Prisma
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

### Stripe Integration
This was a royal pain in the butt.  Got some tips from https://github.com/jurassicjs/nuxt3-fullstack-tutorial and https://www.youtube.com/watch?v=A24aKCQ-rf4&t=895s  Official docs try to be helpful but succeed only in confusing things https://stripe.com/docs/billing/quickstart

I set up a Stripe account with a couple of 'Products' with a single price each to represent my different plans.  These price id's are embedded into the Pricing page.

### Key things I learned
- You need to need to pre-emptively create a Stripe user *before* you send them to the checkout page so that you know who they are when the webhook comes back.
- There are like a Billion Fricking Webhooks you *can* subscribe to but for an MVP, you just need the *customer.subscription* events and you basically treat them all the same.
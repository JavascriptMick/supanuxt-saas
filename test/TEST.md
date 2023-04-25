# Manual test for Admin Functions Scenario
## Pre-req
- Site configured for free plan
- Neither User1 or User2 are present in DB
## Main Flow (Happy Path)
This scenario covers most of the Site Auth and Account admin functions.

(User 1)
- Front page - Get Started
- Signup with google - should drop to dashboard
- Check account page via nav
- Go to pricing page via nav
- Click on 'Subscribe' button under team account
- Fill in Credit card details and sub in Stripe - Should come back to Dashboard page (comes to success page but no customer info??)
- Add a Note or 2 in the Dashboard page - make it clear user1 has entered
- Check Account view - Should be OWNER of this account, max members should be updated to 10
- Update Team account Name using button
- Copy Join Link
- Signout

(User 2)
- Open Join Link - Should prompt for signup to new account name
- Signup with email/password - should drop to dashboard (some fucking bullshit error with signin + no avatar link + how the fuck to deal with non confirmed emails)
- Open join link again - should prompt to Join (Note, doing navigateTo and saving a returnURL seems to be difficult in Nuxt)
- Click Join - should redirect to dashboard
- Check 'Switch to' accounts, team account should be (pending) and not clickable
- Sign out

(User 1)
- Front Page - Sign in - Note Signin page subtly different to signup page, no password conf and no 'if you proceed' warning
- Sign in with google - Should drop to dashboard page
- navigate to Account page
- Look at members, should show User 2 as 'Pending' with approve/reject buttons
- Click approve, should update user item in list and display 'Upgrade to read/write' and 'Delete'

(User 2)
- Signin -> Dashboard should now show notes but no 'Delete' or 'Add' buttons

(User 1)
- Signin -> Dashboard
- Navigate to Account Page
- Click 'Upgrade to read/write' - Should update user and now show 'Upgrade to Admin' button
- sign out

(User 2)
- Signin -> Dashboard - should see 'Add' button now
- Add a Note
- Sign Out

(User 1)
- Signin -> Dashboard
- Navigate to Account Page
- Click 'Upgrade to Admin' - Should see just the 'Delete' button now
- sign out

(User 2)
- Signin -> Dashboard - should now see 'Delete' button on notes
- Click on 'Delete' for an existing Note 
- Go to Account Page - should now see 'Claim ownership' button next to access
- Click on 'Claim Ownership' - Button should dissappear and member list should be updated - Delete button should be visible against 
User 1
- Click 'Delete' for user 1
- You are now king of the world
- navigate to Notes, verify you can see/crud notes on dashboard.

## Unchecked things
- Admin can approve pending membership

## Alternate Flow (Pricing First)
- Front Page - Pricing
- get started for free (TODO - should be button to go to signup under free plan)
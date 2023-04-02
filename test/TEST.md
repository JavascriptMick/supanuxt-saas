# Manual test for Admin Functions Scenario
Pre-condition
User 3 (encumbent id=3) - Owner of own single user account.  Admin of Team account
User 4 (noob id = 4) - Owner of own single user account.  

User 3...
- joins user 4 to team account (expect user is a read only member of team account)
- upgrades user 4 to owner (should fail)
- upgrades user 4 to admin
- claims ownership of team account
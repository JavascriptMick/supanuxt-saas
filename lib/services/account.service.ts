import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';
import prisma_client from '~~/prisma/prisma.client';
import {
  accountWithMembers,
  type AccountWithMembers,
  membershipWithAccount,
  type MembershipWithAccount,
  membershipWithUser,
  type MembershipWithUser
} from './service.types';
import generator from 'generate-password-ts';
import { UtilService } from './util.service';
import { AccountLimitError } from './errors';

const config = useRuntimeConfig();

export namespace AccountService {
  export async function getAccountById(
    account_id: number
  ): Promise<AccountWithMembers> {
    return prisma_client.account.findFirstOrThrow({
      where: { id: account_id },
      ...accountWithMembers
    });
  }

  export async function getAccountByJoinPassword(
    join_password: string
  ): Promise<AccountWithMembers> {
    return prisma_client.account.findFirstOrThrow({
      where: { join_password },
      ...accountWithMembers
    });
  }

  export async function getAccountMembers(
    account_id: number
  ): Promise<MembershipWithUser[]> {
    return prisma_client.membership.findMany({
      where: { account_id },
      ...membershipWithUser
    });
  }

  export async function updateAccountStipeCustomerId(
    account_id: number,
    stripe_customer_id: string
  ) {
    return await prisma_client.account.update({
      where: { id: account_id },
      data: {
        stripe_customer_id
      }
    });
  }

  export async function updateStripeSubscriptionDetailsForAccount(
    stripe_customer_id: string,
    stripe_subscription_id: string,
    current_period_ends: Date,
    stripe_product_id: string
  ) {
    const account = await prisma_client.account.findFirstOrThrow({
      where: { stripe_customer_id }
    });

    const paid_plan = await prisma_client.plan.findFirstOrThrow({
      where: { stripe_product_id }
    });

    if (paid_plan.id == account.plan_id) {
      // only update sub and period info
      return await prisma_client.account.update({
        where: { id: account.id },
        data: {
          stripe_subscription_id,
          current_period_ends,
          ai_gen_count: 0
        }
      });
    } else {
      // plan upgrade/downgrade... update everything, copying over plan features and perks
      return await prisma_client.account.update({
        where: { id: account.id },
        data: {
          stripe_subscription_id,
          current_period_ends,
          plan_id: paid_plan.id,
          features: paid_plan.features,
          max_notes: paid_plan.max_notes,
          max_members: paid_plan.max_members,
          plan_name: paid_plan.name,
          ai_gen_max_pm: paid_plan.ai_gen_max_pm,
          ai_gen_count: 0 // I did vacillate on this point ultimately easier to just reset, discussion here https://www.reddit.com/r/SaaS/comments/16e9bew/should_i_reset_usage_counts_on_plan_upgrade/
        }
      });
    }
  }

  export async function acceptPendingMembership(
    account_id: number,
    membership_id: number
  ): Promise<MembershipWithAccount> {
    const membership = await prisma_client.membership.findFirstOrThrow({
      where: {
        id: membership_id
      }
    });

    if (membership.account_id != account_id) {
      throw new Error(`Membership does not belong to current account`);
    }

    return await prisma_client.membership.update({
      where: {
        id: membership_id
      },
      data: {
        pending: false
      },
      ...membershipWithAccount
    });
  }

  export async function deleteMembership(
    account_id: number,
    membership_id: number
  ): Promise<MembershipWithAccount> {
    const membership = await prisma_client.membership.findFirstOrThrow({
      where: {
        id: membership_id
      }
    });

    if (membership.account_id != account_id) {
      throw new Error(`Membership does not belong to current account`);
    }

    return await prisma_client.membership.delete({
      where: {
        id: membership_id
      },
      ...membershipWithAccount
    });
  }

  export async function joinUserToAccount(
    user_id: number,
    account_id: number,
    pending: boolean
  ): Promise<MembershipWithAccount> {
    const account = await prisma_client.account.findUnique({
      where: {
        id: account_id
      },
      include: {
        members: true
      }
    });

    if (account?.members && account?.members?.length >= account?.max_members) {
      throw new Error(
        `Too Many Members, Account only permits ${account?.max_members} members.`
      );
    }

    if (account?.members) {
      for (const member of account.members) {
        if (member.user_id === user_id) {
          throw new Error(`User is already a member`);
        }
      }
    }

    return prisma_client.membership.create({
      data: {
        user_id: user_id,
        account_id,
        access: ACCOUNT_ACCESS.READ_ONLY,
        pending
      },
      ...membershipWithAccount
    });
  }

  export async function changeAccountName(
    account_id: number,
    new_name: string
  ) {
    return prisma_client.account.update({
      where: { id: account_id },
      data: {
        name: new_name
      }
    });
  }

  export async function changeAccountPlan(account_id: number, plan_id: number) {
    const plan = await prisma_client.plan.findFirstOrThrow({
      where: { id: plan_id }
    });
    return prisma_client.account.update({
      where: { id: account_id },
      data: {
        plan_id: plan_id,
        features: plan.features,
        max_notes: plan.max_notes
      }
    });
  }

  export async function rotateJoinPassword(account_id: number) {
    const join_password: string = generator.generate({
      length: 10,
      numbers: true
    });
    return await prisma_client.account.update({
      where: { id: account_id },
      data: { join_password }
    });
  }

  // Claim ownership of an account.
  // User must already be an ADMIN for the Account
  // Existing OWNER memberships are downgraded to ADMIN
  // In future, some sort of Billing/Stripe tie in here e.g. changing email details on the Account, not sure.
  export async function claimOwnershipOfAccount(
    user_id: number,
    account_id: number
  ): Promise<MembershipWithUser[]> {
    const membership = await prisma_client.membership.findUniqueOrThrow({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id
        }
      }
    });

    if (membership.access === ACCOUNT_ACCESS.OWNER) {
      throw new Error('BADREQUEST: user is already owner');
    } else if (membership.access !== ACCOUNT_ACCESS.ADMIN) {
      throw new Error('UNAUTHORISED: only Admins can claim ownership');
    }

    const existing_owner_memberships = await prisma_client.membership.findMany({
      where: {
        account_id: account_id,
        access: ACCOUNT_ACCESS.OWNER
      }
    });

    for (const existing_owner_membership of existing_owner_memberships) {
      await prisma_client.membership.update({
        where: {
          user_id_account_id: {
            user_id: existing_owner_membership.user_id,
            account_id: account_id
          }
        },
        data: {
          access: ACCOUNT_ACCESS.ADMIN // Downgrade OWNER to ADMIN
        }
      });
    }

    // finally update the ADMIN member to OWNER
    await prisma_client.membership.update({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id
        }
      },
      data: {
        access: ACCOUNT_ACCESS.OWNER
      }
    });

    // return the full membership list because 2 members have changed.
    return prisma_client.membership.findMany({
      where: { account_id },
      ...membershipWithUser
    });
  }

  // Upgrade access of a membership.  Cannot use this method to upgrade to or downgrade from OWNER access
  export async function changeUserAccessWithinAccount(
    user_id: number,
    account_id: number,
    access: ACCOUNT_ACCESS
  ) {
    if (access === ACCOUNT_ACCESS.OWNER) {
      throw new Error(
        'UNABLE TO UPDATE MEMBERSHIP: use claimOwnershipOfAccount method to change ownership'
      );
    }

    const membership = await prisma_client.membership.findUniqueOrThrow({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id
        }
      }
    });

    if (membership.access === ACCOUNT_ACCESS.OWNER) {
      throw new Error(
        'UNABLE TO UPDATE MEMBERSHIP: use claimOwnershipOfAccount method to change ownership'
      );
    }

    return prisma_client.membership.update({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id
        }
      },
      data: {
        access: access
      },
      include: {
        account: true
      }
    });
  }

  /*
  **** Usage Limit Checking *****
  This is trickier than you might think at first.  Free plan users don't get a webhook from Stripe
  that we can use to tick over their period end date and associated usage counts.  I also didn't 
  want to require an additional background thread to do the rollover processing.

  getAccountWithPeriodRollover: retrieves an account record and does the rollover checking returning up to date account info
  checkAIGenCount: retrieves the account using getAccountWithPeriodRollover, checks the count and returns the account
  incrementAIGenCount: increments the counter using the account.  Note that passing in the account avoids another db fetch for the account.
  
  Note.. for each usage limit, you will need another pair of check/increment methods and of course the count and max limit in the account schema

  How to use in a service method....
  export async function someServiceMethod(account_id: number, .....etc) {
    const account = await AccountService.checkAIGenCount(account_id);
    ... User is under the limit so do work
    await AccountService.incrementAIGenCount(account);
  }
  */

  export async function getAccountWithPeriodRollover(account_id: number) {
    const account = await prisma_client.account.findFirstOrThrow({
      where: { id: account_id }
    });

    if (
      account.plan_name === config.initialPlanName &&
      account.current_period_ends < new Date()
    ) {
      return await prisma_client.account.update({
        where: { id: account.id },
        data: {
          current_period_ends: UtilService.addMonths(
            account.current_period_ends,
            1
          ),
          // reset anything that is affected by the rollover
          ai_gen_count: 0
        }
      });
    }

    return account;
  }

  export async function checkAIGenCount(account_id: number) {
    const account = await getAccountWithPeriodRollover(account_id);

    if (account.ai_gen_count >= account.ai_gen_max_pm) {
      throw new AccountLimitError(
        'Monthly AI gen limit reached, no new AI Generations can be made'
      );
    }

    return account;
  }

  export async function incrementAIGenCount(account: any) {
    return await prisma_client.account.update({
      where: { id: account.id },
      data: {
        ai_gen_count: account.ai_gen_count + 1
      }
    });
  }
}

import { ACCOUNT_ACCESS, User, Membership, Account } from '@prisma/client';
import prisma_client from '~~/prisma/prisma.client';
import { UtilService } from './util.service';
const config = useRuntimeConfig();


export type MembershipWithAccount = (Membership & {account: Account});
export type FullDBUser = (User & { memberships: MembershipWithAccount[]; });
export type MembershipWithUser = (Membership & { user: User});
export type AccountWithMembers = (Account & {members: MembershipWithUser[]});
export default class UserAccountService {
  async getUserBySupabaseId(supabase_uid: string): Promise<FullDBUser | null> {
    return prisma_client.user.findFirst({ 
      where: { supabase_uid }, 
      include: { memberships: {include: {
        account: true
      }}} 
    });
  }

  async getFullUserBySupabaseId(supabase_uid: string): Promise<FullDBUser | null> {
    return prisma_client.user.findFirst({ 
      where: { supabase_uid }, 
      include: { memberships: {include: {
        account: true
      }}}
    });
  }

  async getUserById(user_id: number): Promise<FullDBUser | null> {
    return prisma_client.user.findFirstOrThrow({ 
      where: { id: user_id }, 
      include: { memberships: {include: {
        account: true
      }}} 
    });
  }

  async getAccountById(account_id: number): Promise<AccountWithMembers> {
    return prisma_client.account.findFirstOrThrow({ 
      where: { id: account_id },
      include: { members: {include: {
        user: true
      }} }
    });
  }

  async updateAccountStipeCustomerId (account_id: number, stripe_customer_id: string){
    return await prisma_client.account.update({
      where: { id: account_id },
      data: {
        stripe_customer_id,
      }
    })
  }

  async updateStripeSubscriptionDetailsForAccount (stripe_customer_id: string, stripe_subscription_id: string, current_period_ends: Date){
    const account = await prisma_client.account.findFirstOrThrow({
      where: {stripe_customer_id}
    });
    return await prisma_client.account.update({
      where: { id: account.id },
      data: {
        stripe_subscription_id,
        current_period_ends
      }
    })
  }

  async createUser( supabase_uid: string, display_name: string, email: string ): Promise<FullDBUser | null> {
    const trialPlan = await prisma_client.plan.findFirstOrThrow({ where: { name: config.initialPlanName}});
    return prisma_client.user.create({
      data:{
        supabase_uid: supabase_uid,
        display_name: display_name,
        email: email,
        memberships: {
          create: {
            account: {
              create: {
                plan_id: trialPlan.id,  
                name: display_name,
                features: trialPlan.features, //copy in features from the plan, plan_id is a loose association and settings can change independently
                current_period_ends: UtilService.addMonths(new Date(), config.initialPlanActiveMonths),
                max_notes: trialPlan.max_notes,
                plan_name: trialPlan.name,
              }
            },
            access: ACCOUNT_ACCESS.OWNER
          }
        }
      },
      include: { memberships: {include: {
        account: true
      }}}
    });
  }

  async deleteUser(user_id: number) {
    return prisma_client.user.delete({ where: { id: user_id } });
  }

  async joinUserToAccount(user_id: number, account_id: number): Promise<MembershipWithAccount> {
    return prisma_client.membership.create({
      data: {
        user_id: user_id,
        account_id: account_id,
        access: ACCOUNT_ACCESS.READ_ONLY
      },
      include: {
        account: true
      }
    });
  }

  async changeAccountPlan(account_id: number, plan_id: number) {
    const plan = await prisma_client.plan.findFirstOrThrow({ where: {id: plan_id}});
    return prisma_client.account.update({
      where: { id: account_id},
      data: {
        plan_id: plan_id,
        features: plan.features,
        max_notes: plan.max_notes,
      }
    });
  }


  // Claim ownership of an account.  
  // User must already be an ADMIN for the Account
  // Existing OWNER memberships are downgraded to ADMIN
  // In future, some sort of Billing/Stripe tie in here e.g. changing email details on the Account, not sure.
  async claimOwnershipOfAccount(user_id: number, account_id: number) {
    const membership = await prisma_client.membership.findUniqueOrThrow({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id,
        }
      },
    });

    if (membership.access === ACCOUNT_ACCESS.OWNER) {
      return; // already owner
    } else if (membership.access !== ACCOUNT_ACCESS.ADMIN) {
      throw new Error('UNAUTHORISED: only Admins can claim ownership');
    }

    const existing_owner_memberships = await prisma_client.membership.findMany({
      where: {
        account_id: account_id,
        access: ACCOUNT_ACCESS.OWNER,
      },
    });

    for(const existing_owner_membership of existing_owner_memberships) {
      await prisma_client.membership.update({
        where: {
          user_id_account_id: {
            user_id: existing_owner_membership.user_id,
            account_id: account_id,
          }
        },
        data: {
          access: ACCOUNT_ACCESS.ADMIN, // Downgrade OWNER to ADMIN
        }
      });
    }

    // finally update the ADMIN member to OWNER
    return prisma_client.membership.update({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id,
        }
      },
      data: {
        access: ACCOUNT_ACCESS.OWNER,
      },
      include: {
        account: true
      }
    });
  }

  // Upgrade access of a membership.  Cannot use this method to upgrade to or downgrade from OWNER access
  async changeUserAccessWithinAccount(user_id: number, account_id: number, access: ACCOUNT_ACCESS) {
    if (access === ACCOUNT_ACCESS.OWNER) {
      throw new Error('UNABLE TO UPDATE MEMBERSHIP: use claimOwnershipOfAccount method to change ownership');
    }

    const membership = await prisma_client.membership.findUniqueOrThrow({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id,
        }
      },
    });

    if (membership.access === ACCOUNT_ACCESS.OWNER) {
      throw new Error('UNABLE TO UPDATE MEMBERSHIP: use claimOwnershipOfAccount method to change ownership');
    }

    return prisma_client.membership.update({
      where: {
        user_id_account_id: {
          user_id: user_id,
          account_id: account_id,
        }
      },
      data: {
        access: access,
      },
      include: {
        account: true
      }
    });
  }
}

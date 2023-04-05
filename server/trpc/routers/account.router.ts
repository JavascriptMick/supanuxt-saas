import { router, adminProcedure } from '../trpc'
import { ACCOUNT_ACCESS } from '@prisma/client';
import { z } from 'zod';
import AccountService from '~~/lib/services/account.service';
import { MembershipWithAccount } from '~~/lib/services/service.types';

export const accountRouter = router({
  changeAccountName: adminProcedure
    .input(z.object({ account_id: z.number(), new_name: z.string() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const account = await accountService.changeAccountName(input.account_id, input.new_name);

      return {
        account,
      }
    }),
  changeAccountPlan: adminProcedure
    .input(z.object({ account_id: z.number(), plan_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const account = await accountService.changeAccountPlan(input.account_id, input.plan_id);

      return {
        account,
      }
    }),
  joinUserToAccount: adminProcedure
    .input(z.object({ account_id: z.number(), user_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership: MembershipWithAccount| null = (ctx.dbUser?.id)?await accountService.joinUserToAccount(input.user_id, input.account_id):null;
      return {
        membership,
      }
    }),
  changeUserAccessWithinAccount: adminProcedure
    .input(z.object({ user_id: z.number(), account_id: z.number(), access: z.enum([ACCOUNT_ACCESS.ADMIN, ACCOUNT_ACCESS.OWNER, ACCOUNT_ACCESS.READ_ONLY, ACCOUNT_ACCESS.READ_WRITE]) }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership = await accountService.changeUserAccessWithinAccount(input.user_id, input.account_id, input.access);
      
      return {
        membership,
      }
    }),
    claimOwnershipOfAccount: adminProcedure
    .input(z.object({ account_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership = await accountService.claimOwnershipOfAccount(ctx.dbUser.id, input.account_id);

      return {
        membership,
      }
    }),
    getAccountMembers: adminProcedure
    .input(z.object({ account_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const memberships = await accountService.getAccountMembers(input.account_id);

      return {
        memberships,
      }
    }),
})

import UserAccountService from '~~/lib/services/user.account.service';
import { protectedProcedure, router, adminProcedure } from '../trpc'
import { ACCOUNT_ACCESS } from '@prisma/client';
import { z } from 'zod';

export const userAccountRouter = router({
  getDBUser: protectedProcedure
    .query(({ ctx }) => {
      return {
        dbUser: ctx.dbUser,
      }
    }),  
  changeAccountName: adminProcedure
    .input(z.object({ account_id: z.number(), new_name: z.string() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService();
      const account = await uaService.changeAccountName(input.account_id, input.new_name);

      return {
        account,
      }
    }),
  changeAccountPlan: adminProcedure
    .input(z.object({ account_id: z.number(), plan_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService();
      const account = await uaService.changeAccountPlan(input.account_id, input.plan_id);

      return {
        account,
      }
    }),
  joinUserToAccount: adminProcedure
    .input(z.object({ account_id: z.number(), user_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService();
      const membership = (ctx.dbUser?.id)?await uaService.joinUserToAccount(input.user_id, input.account_id):null;
      return {
        membership,
      }
    }),
  changeUserAccessWithinAccount: adminProcedure
    .input(z.object({ user_id: z.number(), account_id: z.number(), access: z.enum([ACCOUNT_ACCESS.ADMIN, ACCOUNT_ACCESS.OWNER, ACCOUNT_ACCESS.READ_ONLY, ACCOUNT_ACCESS.READ_WRITE]) }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService();
      const membership = await uaService.changeUserAccessWithinAccount(input.user_id, input.account_id, input.access);
      
      return {
        membership,
      }
    }),
  claimOwnershipOfAccount: adminProcedure
    .input(z.object({ account_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService();
      const membership = await uaService.claimOwnershipOfAccount(ctx.dbUser.id, input.account_id);

      return {
        membership,
      }
    }),
})

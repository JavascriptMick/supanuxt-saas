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
  changeAccountPlan: adminProcedure
    .input(z.object({ account_id: z.number(), plan_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const account = await uaService.changeAccountPlan(input.account_id, input.plan_id);

      if(account){
        ctx.dbUser.memberships = ctx.dbUser.memberships.map(m => m.account_id !== account.id ? m : { ...m, account });
      }

      return {
        account,
      }
    }),
  joinUserToAccount: adminProcedure
    .input(z.object({ account_id: z.number(), user_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const membership = (ctx.dbUser?.id)?await uaService.joinUserToAccount(input.user_id, input.account_id):null;
      return {
        membership,
      }
    }),
  changeUserAccessWithinAccount: adminProcedure
    .input(z.object({ user_id: z.number(), account_id: z.number(), access: z.enum([ACCOUNT_ACCESS.ADMIN, ACCOUNT_ACCESS.OWNER, ACCOUNT_ACCESS.READ_ONLY, ACCOUNT_ACCESS.READ_WRITE]) }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const membership = await uaService.changeUserAccessWithinAccount(input.user_id, input.account_id, input.access);
      
      if(membership && ctx.dbUser?.id == input.user_id){
        ctx.dbUser.memberships = ctx.dbUser.memberships.map(m => m.id !== membership.id ? m : membership);
      }
      
      return {
        membership,
      }
    }),
  claimOwnershipOfAccount: adminProcedure
    .input(z.object({ account_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const membership = await uaService.claimOwnershipOfAccount(ctx.dbUser.id, input.account_id);
      
      if(membership && ctx.dbUser){
        ctx.dbUser.memberships = ctx.dbUser.memberships.map(m => m.id !== membership.id ? m : membership);
      }

      return {
        membership,
      }
    }),
})

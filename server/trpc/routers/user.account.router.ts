import UserAccountService from '~~/lib/services/user.account.service';
import { protectedProcedure, router } from '../trpc'
import { ACCOUNT_ACCESS } from '@prisma/client';

export const userAccountRouter = router({
  changeAccountPlan: protectedProcedure
    .query(async ({ ctx }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const account = await uaService.changeAccountPlan(ctx.dbUser.memberships[0].account_id, 2); // todo - plan should be an in put param
      return {
        account,
      }
    }),
  joinUserToAccount: protectedProcedure
    .query(async ({ ctx }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const membership = await uaService.joinUserToAccount(ctx.dbUser.id, 5); // todo - account should be an input param
      return {
        membership,
      }
    }),
  changeUserAccessWithinAccount: protectedProcedure // TODO - should be protectedAdmin (i.e. ctx.dbUser.id should be admin within the session account)
    .query(async ({ ctx }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const membership = await uaService.changeUserAccessWithinAccount(3, 5, ACCOUNT_ACCESS.ADMIN); // todo - member and access should be an input param (from UI) account should be the session account
      return {
        membership,
      }
    }),
  claimOwnershipOfAccount: protectedProcedure // TODO - should be protectedAdmin (i.e. ctx.dbUser.id should be admin within the session account)
    .query(async ({ ctx }) => {
      const uaService = new UserAccountService(ctx.prisma);
      const membership = await uaService.claimOwnershipOfAccount(3, 5); // todo - member should be an input param (from UI) account should be the session account
      return {
        membership,
      }
    }),
})
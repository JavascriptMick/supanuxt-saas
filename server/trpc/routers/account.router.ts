import { TRPCError } from '@trpc/server';
import { router, adminProcedure, publicProcedure, protectedProcedure, ownerProcedure } from '../trpc'
import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';
import { z } from 'zod';
import AccountService from '~~/lib/services/account.service';
import { MembershipWithAccount } from '~~/lib/services/service.types';

/*
  Note on proliferation of Bang syntax... adminProcedure throws if either the ctx.dbUser or the ctx.activeAccountId is not available but the compiler can't figure that out so bang quiesces the null warning
*/
export const accountRouter = router({
  getDBUser: publicProcedure
    .query(({ ctx }) => {
      return {
        dbUser: ctx.dbUser,
      }
    }),
  getActiveAccountId: publicProcedure
    .query(({ ctx }) => {
      return {
        activeAccountId: ctx.activeAccountId,
      }
    }),
  changeActiveAccount: protectedProcedure
    .input(z.object({ account_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const activeMembership = ctx.dbUser?.memberships.find(membership => membership.account_id == input.account_id);
      if(activeMembership?.pending){
        throw new TRPCError({ code: 'BAD_REQUEST', message:`membership ${activeMembership?.id} is not active so cannot be switched to` });
      }
      ctx.activeAccountId = input.account_id;
      setCookie(ctx.event, 'preferred-active-account-id', input.account_id.toString(), {expires: new Date(Date.now() + 1000 * 60 * 60 * 24  * 365 * 10)});
    }),
  changeAccountName: adminProcedure
    .input(z.object({ new_name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const account = await accountService.changeAccountName(ctx.activeAccountId!, input.new_name);
      return {
        account,
      }
    }),
  rotateJoinPassword: adminProcedure
    .mutation(async ({ ctx }) => {
      const accountService = new AccountService();
      const account = await accountService.rotateJoinPassword(ctx.activeAccountId!);
      return {
        account,
      }
    }),
  getAccountByJoinPassword: publicProcedure
    .input(z.object({ join_password: z.string() }))
    .query(async ({ input }) => {
      const accountService = new AccountService();
      const account = await accountService.getAccountByJoinPassword(input.join_password);
      return {
        account,
      }
    }),
  joinUserToAccountPending: publicProcedure // this uses a passed account id rather than using the active account because user is usually active on their personal or some other account when they attempt to join a new account
    .input(z.object({ account_id: z.number(), user_id: z.number() }))
    .mutation(async ({ input }) => {
      const accountService = new AccountService();
      const membership: MembershipWithAccount = await accountService.joinUserToAccount(input.user_id, input.account_id, true);
      return {
        membership,
      }
    }),
  acceptPendingMembership: adminProcedure
    .input(z.object({ membership_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership: MembershipWithAccount = await accountService.acceptPendingMembership(ctx.activeAccountId!, input.membership_id);
      return {
        membership,
      }
    }),
  rejectPendingMembership: adminProcedure
    .input(z.object({ membership_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership: MembershipWithAccount = await accountService.deleteMembership(ctx.activeAccountId!, input.membership_id);
      return {
        membership,
      }
    }),
  deleteMembership: ownerProcedure
    .input(z.object({ membership_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership: MembershipWithAccount = await accountService.deleteMembership(ctx.activeAccountId!, input.membership_id);
      return {
        membership,
      }
    }),
  changeUserAccessWithinAccount: adminProcedure
    .input(z.object({ user_id: z.number(), access: z.enum([ACCOUNT_ACCESS.ADMIN, ACCOUNT_ACCESS.OWNER, ACCOUNT_ACCESS.READ_ONLY, ACCOUNT_ACCESS.READ_WRITE]) }))
    .mutation(async ({ ctx, input }) => {
      const accountService = new AccountService();
      const membership = await accountService.changeUserAccessWithinAccount(input.user_id, ctx.activeAccountId!, input.access);
      return {
        membership,
      }
    }),
  claimOwnershipOfAccount: adminProcedure
    .mutation(async ({ ctx }) => {
      const accountService = new AccountService();
      const memberships = await accountService.claimOwnershipOfAccount(ctx.dbUser!.id, ctx.activeAccountId!);
      return {
        memberships,
      }
    }),
  getAccountMembers: adminProcedure
    .query(async ({ ctx }) => {
      const accountService = new AccountService();
      const memberships = await accountService.getAccountMembers(ctx.activeAccountId!);
      return {
        memberships,
      }
    }),
})

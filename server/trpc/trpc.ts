/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context';
import { z } from 'zod';
import { ACCOUNT_ACCESS } from '@prisma/client';

const t = initTRPC.context<Context>().create()

/**
 * auth middlewares
 **/
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

const isAdminForInputAccountId = t.middleware(({ next, rawInput, ctx }) => {
  if (!ctx.dbUser) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const result = z.object({ account_id: z.number() }).safeParse(rawInput);
  if (!result.success) throw new TRPCError({ code: 'BAD_REQUEST' });
  const { account_id } = result.data;
  const test_membership = ctx.dbUser.memberships.find(membership => membership.account_id == account_id);
  console.log(`isAdminForInputAccountId  test_membership?.access:${test_membership?.access}`);
  if(!test_membership || (test_membership?.access !== ACCOUNT_ACCESS.ADMIN && test_membership?.access !== ACCOUNT_ACCESS.OWNER)) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  return next({ ctx });
});

/**
 * Procedures
 **/
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = protectedProcedure.use(isAdminForInputAccountId);
export const router = t.router;
export const middleware = t.middleware;

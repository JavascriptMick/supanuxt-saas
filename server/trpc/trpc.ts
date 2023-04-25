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
import { ACCOUNT_ACCESS } from '@prisma/client';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

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

// Yes, these functions do look very repetitive and could be refactored.  If only I was smart enough to understand https://trpc.io/docs/server/procedures#reusable-base-procedures
const isMemberForActiveAccountId = t.middleware(({ next, ctx }) => {
  if (!ctx.dbUser || !ctx.activeAccountId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const activeMembership = ctx.dbUser.memberships.find(membership => membership.account_id == ctx.activeAccountId);

  if(!activeMembership) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`user is not a member of the active account` });
  }

  if(activeMembership.pending) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`membership ${activeMembership?.id} is not active` });
  }
  
  return next({ ctx });
});

const isReadWriteForActiveAccountId = t.middleware(({ next, ctx }) => {
  if (!ctx.dbUser || !ctx.activeAccountId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const activeMembership = ctx.dbUser.memberships.find(membership => membership.account_id == ctx.activeAccountId);

  if(!activeMembership) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`user is not a member of the active account` });
  }

  if(activeMembership.pending) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`membership ${activeMembership?.id} is not active` });
  }

  if(activeMembership?.access !== ACCOUNT_ACCESS.READ_WRITE && activeMembership?.access !== ACCOUNT_ACCESS.ADMIN && activeMembership?.access !== ACCOUNT_ACCESS.OWNER) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`activeMembership ${activeMembership?.id} has insufficient access (${activeMembership?.access})` });
  }
  
  return next({ ctx });
});

const isAdminForActiveAccountId = t.middleware(({ next, ctx }) => {
  if (!ctx.dbUser || !ctx.activeAccountId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const activeMembership = ctx.dbUser.memberships.find(membership => membership.account_id == ctx.activeAccountId);

  if(!activeMembership) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`user is not a member of the active account` });
  }

  if(activeMembership.pending) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`membership ${activeMembership?.id} is not active` });
  }

  if(activeMembership?.access !== ACCOUNT_ACCESS.ADMIN && activeMembership?.access !== ACCOUNT_ACCESS.OWNER) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`activeMembership ${activeMembership?.id} has insufficient access (${activeMembership?.access})` });
  }
  
  return next({ ctx });
});

const isOwnerForActiveAccountId = t.middleware(({ next, ctx }) => {
  if (!ctx.dbUser || !ctx.activeAccountId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const activeMembership = ctx.dbUser.memberships.find(membership => membership.account_id == ctx.activeAccountId);

  if(!activeMembership) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`user is not a member of the active account` });
  }

  if(activeMembership.pending) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`membership ${activeMembership?.id} is not active` });
  }

  if(activeMembership?.access !== ACCOUNT_ACCESS.OWNER) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message:`activeMembership ${activeMembership?.id} has insufficient access (${activeMembership?.access})` });
  }
  
  return next({ ctx });
});

/**
 * Procedures
 **/
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const memberProcedure = protectedProcedure.use(isMemberForActiveAccountId);
export const readWriteProcedure = protectedProcedure.use(isReadWriteForActiveAccountId);
export const adminProcedure = protectedProcedure.use(isAdminForActiveAccountId);
export const ownerProcedure = protectedProcedure.use(isOwnerForActiveAccountId);
export const router = t.router;
export const middleware = t.middleware;

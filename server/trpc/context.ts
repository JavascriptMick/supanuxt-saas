import type { inferAsyncReturnType } from '@trpc/server';
import { H3Event } from 'h3';

export async function createContext(event: H3Event) {
  return {
    user: event.context.user, // the Supabase User
    dbUser: event.context.dbUser, // the corresponding Database User
    activeAccountId: event.context.activeAccountId, // the account ID that is active for the user
    event // required to enable setCookie in accountRouter
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

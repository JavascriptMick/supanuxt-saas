/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { createNuxtApiHandler } from 'trpc-nuxt'

import { publicProcedure, router } from '~/server/trpc/trpc'
import { createContext } from '~~/server/trpc/context';
import { notesRouter } from '~~/server/trpc/routers/notes.router';
import { userAccountRouter } from '~~/server/trpc/routers/user.account.router';

export const appRouter = router({
  notes: notesRouter,
  userAccount: userAccountRouter,
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext: createContext,
  onError({ error}) { console.error(error)}, // TODO - logging and reporting  
})

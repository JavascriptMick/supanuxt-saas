/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { createNuxtApiHandler } from 'trpc-nuxt'
import { z } from 'zod'

import { publicProcedure, router } from '~/server/trpc/trpc'
import { createContext } from '~~/server/trpc/context';
import NotesService from '~~/lib/services/notes.service';

export const appRouter = router({
  notes: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const notesService = new NotesService(ctx.prisma);
      const notes = await notesService.getNotesForAccountId(ctx.dbUser.membership?.account_id);
      return {
        notes,
      }
    }),
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

import { router } from '~/server/trpc/trpc';
import { notesRouter } from './notes.router';
import { authRouter } from './auth.router';
import { accountRouter } from './account.router';

export const appRouter = router({
  notes: notesRouter,
  auth: authRouter,
  account: accountRouter
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

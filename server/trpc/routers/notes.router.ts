import NotesService from '~~/lib/services/notes.service';
import { protectedProcedure, router } from '../trpc'

export const notesRouter = router({
  getForCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      const notesService = new NotesService(ctx.prisma);
      console.log(`fetching notes for account_id: ${ctx.dbUser.memberships[0].account_id}`);
      const notes = await notesService.getNotesForAccountId(ctx.dbUser.memberships[0].account_id);
      return {
        notes,
      }
    }),
})
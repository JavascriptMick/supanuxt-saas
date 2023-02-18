import NotesService from '~~/lib/services/notes.service';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const notesRouter = router({
  getForCurrentUser: protectedProcedure
    .input(z.object({ account_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const notesService = new NotesService(ctx.prisma);
      const notes = await notesService.getNotesForAccountId(input.account_id); 
      return {
        notes,
      }
    }),
    getById: publicProcedure
    .input(z.object({ note_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const notesService = new NotesService(ctx.prisma);
      const note = await notesService.getNoteById(input.note_id); 
      return {
        note,
      }
    }),
})
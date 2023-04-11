import NotesService from '~~/lib/services/notes.service';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const notesRouter = router({
  getForCurrentUser: protectedProcedure
    .query(async ({ ctx, input }) => {
      const notesService = new NotesService();
      const notes = (ctx.activeAccountId)?await notesService.getNotesForAccountId(ctx.activeAccountId):[]; 
      return {
        notes,
      }
    }),
    getById: publicProcedure
    .input(z.object({ note_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const notesService = new NotesService();
      const note = await notesService.getNoteById(input.note_id); 
      return {
        note,
      }
    }),
})
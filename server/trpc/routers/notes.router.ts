import NotesService from '~~/lib/services/notes.service';
import { memberProcedure, protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const notesRouter = router({
  getForCurrentUser: memberProcedure
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
  createNote: memberProcedure
    .input(z.object({ note_text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notesService = new NotesService();
      const note = (ctx.activeAccountId)?await notesService.createNote(ctx.activeAccountId, input.note_text):null; 
      return {
        note,
      }
    }),
  deleteNote: memberProcedure
    .input(z.object({ note_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const notesService = new NotesService();
      const note = (ctx.activeAccountId)?await notesService.deleteNote(input.note_id):null; 
      return {
        note,
      }
    }),
})
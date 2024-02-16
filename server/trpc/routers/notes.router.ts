import { NotesService } from '~~/lib/services/notes.service';
import {
  accountHasSpecialFeature,
  adminProcedure,
  memberProcedure,
  publicProcedure,
  readWriteProcedure,
  router
} from '../trpc';
import { z } from 'zod';

export const notesRouter = router({
  getForActiveAccount: memberProcedure.query(async ({ ctx, input }) => {
    const notes = ctx.activeAccountId
      ? await NotesService.getNotesForAccountId(ctx.activeAccountId)
      : [];
    return {
      notes
    };
  }),
  getById: publicProcedure
    .input(z.object({ note_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await NotesService.getNoteById(input.note_id);
      return {
        note
      };
    }),
  createNote: readWriteProcedure
    .input(z.object({ note_text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = ctx.activeAccountId
        ? await NotesService.createNote(ctx.activeAccountId, input.note_text)
        : null;
      return {
        note
      };
    }),
  deleteNote: adminProcedure
    .input(z.object({ note_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const note = ctx.activeAccountId
        ? await NotesService.deleteNote(input.note_id)
        : null;
      return {
        note
      };
    }),
  generateAINoteFromPrompt: readWriteProcedure
    .use(accountHasSpecialFeature)
    .input(z.object({ user_prompt: z.string() }))
    .query(async ({ ctx, input }) => {
      const noteText = ctx.activeAccountId
        ? await NotesService.generateAINoteFromPrompt(
            input.user_prompt,
            ctx.activeAccountId
          )
        : null;
      return {
        noteText
      };
    })
});

import { H3Event, getQuery } from 'h3';
import { defineProtectedEventHandler } from '../defineProtectedEventHandler';
import { NotesService } from '~/lib/services/notes.service';

// Example API Route with query params ... /api/note?note_id=41
export default defineProtectedEventHandler(async (event: H3Event) => {
  const queryParams = getQuery(event);
  let note_id: string = '';
  if (queryParams.note_id) {
    if (Array.isArray(queryParams.note_id)) {
      note_id = queryParams.note_id[0];
    } else {
      note_id = queryParams.note_id.toString();
    }
  }

  const note = await NotesService.getNoteById(+note_id);

  return {
    note
  };
});

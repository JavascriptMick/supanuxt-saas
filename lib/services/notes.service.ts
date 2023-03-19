import prisma_client from '~~/prisma/prisma.client';

export default class NotesService {
  async getAllNotes() {
    return prisma_client.note.findMany();
  }

  async getNoteById(id: number) {
    return prisma_client.note.findUniqueOrThrow({ where: { id } });
  }

  async getNotesForAccountId(account_id: number) {
    return prisma_client.note.findMany({ where: { account_id } });
  }

  async createNote( account_id: number, note_text: string ) {
    return prisma_client.note.create({ data: { account_id, note_text }});
  }

  async updateNote(id: number, note_text: string) {
    return prisma_client.note.update({ where: { id }, data: { note_text } });
  }

  async deleteNote(id: number) {
    return prisma_client.note.delete({ where: { id } });
  }
}

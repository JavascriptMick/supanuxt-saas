import { PrismaClient } from '@prisma/client';

export default class NotesService {
  private prisma: PrismaClient;

  constructor( prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllNotes() {
    return this.prisma.note.findMany();
  }

  async getNotesForAccountId(account_id: number) {
    return this.prisma.note.findMany({ where: { account_id } });
  }

  async createNote( account_id: number, note_text: string ) {
    return this.prisma.note.create({ data: { account_id, note_text }});
  }

  async updateNote(id: number, note_text: string) {
    return this.prisma.note.update({ where: { id }, data: { note_text } });
  }

  async deleteNote(id: number) {
    return this.prisma.note.delete({ where: { id } });
  }
}

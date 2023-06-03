import prisma_client from '~~/prisma/prisma.client';
import { openai } from './openai.client';
import { AccountLimitError } from './errors';

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
    const account = await prisma_client.account.findFirstOrThrow({
      where: { id: account_id},
      include: { notes: true}
    });

    if(account.notes.length>= account.max_notes){
      throw new AccountLimitError('Note Limit reached, no new notes can be added');
    }
    
    return prisma_client.note.create({ data: { account_id, note_text }});
  }

  async updateNote(id: number, note_text: string) {
    return prisma_client.note.update({ where: { id }, data: { note_text } });
  }

  async deleteNote(id: number) {
    return prisma_client.note.delete({ where: { id } });
  }

  async generateAINoteFromPrompt(userPrompt: string) {
    const prompt = `
    Write an interesting short note about ${userPrompt}.  
    Restrict the note to a single paragraph.
    `
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.6,
      stop: "\n\n",
      max_tokens: 1000,
      n: 1,
    });
    return completion.data.choices[0].text;
  }
}

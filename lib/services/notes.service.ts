import prisma_client from '~~/prisma/prisma.client';
import { openai } from './openai.client';
import { AccountLimitError } from './errors';
import { AccountService } from './account.service';

export namespace NotesService {
  export async function getNoteById(id: number) {
    return prisma_client.note.findUniqueOrThrow({ where: { id } });
  }

  export async function getNotesForAccountId(account_id: number) {
    return prisma_client.note.findMany({ where: { account_id } });
  }

  export async function createNote(account_id: number, note_text: string) {
    const account = await prisma_client.account.findFirstOrThrow({
      where: { id: account_id },
      include: { notes: true }
    });

    if (account.notes.length >= account.max_notes) {
      throw new AccountLimitError(
        'Note Limit reached, no new notes can be added'
      );
    }

    return prisma_client.note.create({ data: { account_id, note_text } });
  }

  export async function updateNote(id: number, note_text: string) {
    return prisma_client.note.update({ where: { id }, data: { note_text } });
  }

  export async function deleteNote(id: number) {
    return prisma_client.note.delete({ where: { id } });
  }

  export async function generateAINoteFromPrompt(
    userPrompt: string,
    account_id: number
  ) {
    const account = await AccountService.checkAIGenCount(account_id);

    const prompt = `
    Write an interesting short note about ${userPrompt}.  
    Restrict the note to a single paragraph.
    `;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      stop: '\n\n',
      max_tokens: 1000,
      n: 1
    });

    await AccountService.incrementAIGenCount(account);

    return completion.choices?.[0]?.message.content?.trim();
  }
}

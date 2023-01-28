import { PrismaClient } from '@prisma/client';
import { serverSupabaseClient } from '#supabase/server';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event)
  const user = await client.auth.getUser();

  const dbUser = await prisma.user.findFirstOrThrow({
    where: {
      supabase_uid: user.data.id // TODO - this shit is messy.. typing
    },
    include: {
      membership: true, // Return all fields
    },    
  });

  const data = await prisma.note.findMany({
    where:{
      account_id: dbUser.membership?.account_id
    }
  });
  return data;
})
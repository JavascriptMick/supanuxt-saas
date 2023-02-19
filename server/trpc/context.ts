import { PrismaClient } from '@prisma/client';
import { inferAsyncReturnType, TRPCError } from '@trpc/server'
import { H3Event } from 'h3';
import { serverSupabaseClient } from '#supabase/server';
import SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { User } from '@supabase/supabase-js';
import UserAccountService, { FullDBUser } from '~~/lib/services/user.account.service';

let prisma: PrismaClient | undefined
let supabase: SupabaseClient | undefined
let user: User | null;
let dbUser: FullDBUser | null

export async function createContext(event: H3Event){
  if (!supabase) {
    supabase = serverSupabaseClient(event)
  }
  if (!user) {
    ({data: { user }} = await supabase.auth.getUser());
  }
  if (!prisma) {
    prisma = new PrismaClient()
  }
  if (!dbUser && user) {
    const userService = new UserAccountService(prisma);
    dbUser = await userService.getFullUserBySupabaseId(user.id);
    
    if (!dbUser && user) {
      dbUser = await userService.createUser( user.id, user.user_metadata.full_name );
      console.log(`\n Created user \n ${JSON.stringify(dbUser)}\n`);
    }
  }

  if(!supabase || !user || !prisma || !dbUser) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unable to fetch user data, please try again later.',
    });
  }
  
  // TODO - This seems excessive, trim context when I have figured out what I actually need
  return {
    supabase,
    user,
    prisma,
    dbUser,
  }  
};

export type Context = inferAsyncReturnType<typeof createContext>